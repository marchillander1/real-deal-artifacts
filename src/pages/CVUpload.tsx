
import React, { useState, useEffect } from 'react';
import { CVUploadForm } from '@/components/CVUploadForm';
import { AnalysisResults } from '@/components/AnalysisResults';
import { MatchWiseChat } from '@/components/MatchWiseChat';
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
  const [isChatMinimized, setIsChatMinimized] = useState(true);
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
        cvAnalysis: cvData,
        linkedinAnalysis: linkedinData,
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
        <div className="max-w-6xl mx-auto">
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
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
                <div className="space-y-6">
                  <AnalysisResults
                    analysisResults={analysisResults}
                    isAnalyzing={isAnalyzing}
                    analysisProgress={100}
                  />
                  
                  {/* Form for final submission */}
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Complete Registration</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email *
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          LinkedIn URL *
                        </label>
                        <input
                          type="url"
                          value={linkedinUrl}
                          onChange={(e) => setLinkedinUrl(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      
                      <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                        <input
                          type="checkbox"
                          id="terms"
                          checked={agreeToTerms}
                          onChange={(e) => setAgreeToTerms(e.target.checked)}
                          className="mt-1"
                          required
                        />
                        <div className="text-sm text-gray-600">
                          <label htmlFor="terms" className="cursor-pointer">
                            <span className="font-medium">
                              {isMyConsultant ? "I agree to add this consultant to my team" : "I agree to comprehensive analysis and network joining"}
                            </span>
                          </label>
                          <p className="mt-1">
                            {isMyConsultant 
                              ? "I consent to MatchWise analyzing this CV and LinkedIn profile for my consultant team."
                              : "I consent to MatchWise analyzing my CV and LinkedIn profile for advanced consultant matching."
                            }
                          </p>
                        </div>
                      </div>
                      
                      <button
                        type="submit"
                        disabled={isUploading || !agreeToTerms}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isUploading ? "Processing..." : (isMyConsultant ? "Add to My Team" : "Join Network")}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>

            {/* AI Chat sidebar */}
            <div className="lg:col-span-1">
              {!isChatMinimized && (
                <div className="sticky top-8">
                  <MatchWiseChat 
                    analysisResults={analysisResults}
                    isMinimized={false}
                    onToggleMinimize={() => setIsChatMinimized(true)}
                  />
                </div>
              )}
              
              {isChatMinimized && (
                <MatchWiseChat 
                  analysisResults={analysisResults}
                  isMinimized={true}
                  onToggleMinimize={() => setIsChatMinimized(false)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVUpload;
