
import React, { useState, useEffect } from 'react';
import { CVUploadForm } from '@/components/CVUploadForm';
import { AnalysisResults } from '@/components/AnalysisResults';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Navbar } from '@/components/Navbar';

const CVUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isMyConsultant, setIsMyConsultant] = useState(false);
  const { toast } = useToast();

  // Check if we're uploading for "My Consultants"
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const source = urlParams.get('source');
    setIsMyConsultant(source === 'my-consultants');
  }, []);

  useEffect(() => {
    if (file && linkedinUrl.includes('linkedin.com') && !isAnalyzing && !analysisResults) {
      handleAnalysis();
    }
  }, [file, linkedinUrl]);

  const handleAnalysis = async () => {
    if (!file || !linkedinUrl.includes('linkedin.com')) return;

    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const { data: cvData, error: cvError } = await supabase.functions.invoke('parse-cv', {
        body: formData,
      });

      if (cvError) throw cvError;

      const { data: linkedinData, error: linkedinError } = await supabase.functions.invoke('analyze-linkedin', {
        body: { linkedinUrl }
      });

      if (linkedinError) throw linkedinError;

      const combinedResults = {
        cv: cvData,
        linkedin: linkedinData,
        combined: {
          name: cvData.name || linkedinData.name || '',
          email: cvData.email || linkedinData.email || '',
          phone: cvData.phone || '',
          location: cvData.location || linkedinData.location || '',
          skills: [...(cvData.skills || []), ...(linkedinData.skills || [])],
          experience: cvData.experience || linkedinData.experience || '',
          roles: [...(cvData.roles || []), ...(linkedinData.roles || [])],
          certifications: cvData.certifications || [],
          workStyle: linkedinData.workStyle || '',
          values: linkedinData.values || [],
          personalityTraits: linkedinData.personalityTraits || [],
          teamFit: linkedinData.teamFit || '',
          culturalFit: linkedinData.culturalFit || 5,
          adaptability: linkedinData.adaptability || 5,
          leadership: linkedinData.leadership || 3,
        }
      };

      setAnalysisResults(combinedResults);
      
      // Auto-fill form fields
      if (combinedResults.combined.name) setFullName(combinedResults.combined.name);
      if (combinedResults.combined.email) setEmail(combinedResults.combined.email);
      if (combinedResults.combined.phone) setPhoneNumber(combinedResults.combined.phone);

    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Error",
        description: "Failed to analyze CV or LinkedIn profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!file || !analysisResults || !agreeToTerms) {
      toast({
        title: "Missing Information",
        description: "Please complete all required fields and agree to terms.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Determine user_id based on context
      let userId = null;
      if (isMyConsultant && user) {
        userId = user.id; // For "My Consultants", set user_id to current user
      }
      // For network consultants, user_id remains null

      const consultantData = {
        name: fullName,
        email: email,
        phone: phoneNumber,
        location: analysisResults.combined.location,
        skills: analysisResults.combined.skills,
        experience_years: analysisResults.combined.experience ? parseInt(analysisResults.combined.experience) : null,
        availability: 'Available',
        communication_style: analysisResults.combined.workStyle,
        roles: analysisResults.combined.roles,
        certifications: analysisResults.combined.certifications,
        linkedin_url: linkedinUrl,
        languages: analysisResults.combined.languages || [],
        work_style: analysisResults.combined.workStyle,
        values: analysisResults.combined.values,
        personality_traits: analysisResults.combined.personalityTraits,
        team_fit: analysisResults.combined.teamFit,
        cultural_fit: analysisResults.combined.culturalFit,
        adaptability: analysisResults.combined.adaptability,
        leadership: analysisResults.combined.leadership,
        user_id: userId // This determines if it goes to "My Consultants" or "Network"
      };

      const { error } = await supabase
        .from('consultants')
        .insert([consultantData]);

      if (error) throw error;

      // Send notification emails
      try {
        await supabase.functions.invoke('send-registration-notification', {
          body: { 
            consultantName: fullName, 
            consultantEmail: email,
            isMyConsultant: isMyConsultant
          }
        });

        await supabase.functions.invoke('send-welcome-email', {
          body: { 
            consultantName: fullName, 
            consultantEmail: email,
            isMyConsultant: isMyConsultant
          }
        });
      } catch (emailError) {
        console.error('Email notification error:', emailError);
      }

      toast({
        title: "Success!",
        description: isMyConsultant 
          ? "Consultant successfully added to your team!"
          : "Profile created successfully! Welcome to our network.",
      });

      // Redirect based on context
      if (isMyConsultant) {
        window.location.href = '/matchwiseai';
      } else {
        window.location.href = '/';
      }

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isMyConsultant ? "Add Consultant to Your Team" : "Join Our Consultant Network"}
            </h1>
            <p className="text-gray-600">
              {isMyConsultant 
                ? "Upload a CV to add a new consultant to your team with AI-powered analysis"
                : "Upload your CV and get AI-powered matching with relevant assignments"
              }
            </p>
          </div>

          {!analysisResults ? (
            <CVUploadForm
              file={file}
              email={email}
              fullName={fullName}
              phoneNumber={phoneNumber}
              linkedinUrl={linkedinUrl}
              agreeToTerms={agreeToTerms}
              isUploading={isUploading}
              analysisResults={analysisResults}
              isAnalyzing={isAnalyzing}
              onFileChange={handleFileChange}
              onEmailChange={setEmail}
              onFullNameChange={setFullName}
              onPhoneNumberChange={setPhoneNumber}
              onLinkedinUrlChange={setLinkedinUrl}
              onAgreeToTermsChange={setAgreeToTerms}
              onSubmit={handleSubmit}
            />
          ) : (
            <AnalysisResults
              analysisResults={analysisResults}
              file={file}
              email={email}
              fullName={fullName}
              phoneNumber={phoneNumber}
              linkedinUrl={linkedinUrl}
              agreeToTerms={agreeToTerms}
              isUploading={isUploading}
              onEmailChange={setEmail}
              onFullNameChange={setFullName}
              onPhoneNumberChange={setPhoneNumber}
              onLinkedinUrlChange={setLinkedinUrl}
              onAgreeToTermsChange={setAgreeToTerms}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CVUpload;
