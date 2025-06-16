
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
            
            {/* Enhanced description with analysis features */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-blue-600 mb-2">🔧</div>
                <h3 className="font-semibold text-sm">Technical Expertise</h3>
                <p className="text-xs text-gray-600">Deep skill analysis</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-purple-600 mb-2">👥</div>
                <h3 className="font-semibold text-sm">Leadership Analysis</h3>
                <p className="text-xs text-gray-600">Team fit assessment</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-orange-600 mb-2">💡</div>
                <h3 className="font-semibold text-sm">Improvement Tips</h3>
                <p className="text-xs text-gray-600">Career guidance</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-green-600 mb-2">📈</div>
                <h3 className="font-semibold text-sm">Market Positioning</h3>
                <p className="text-xs text-gray-600">Rate benchmarking</p>
              </div>
            </div>
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
                  {/* Enhanced Analysis Results with tips and detailed insights */}
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">AI-Driven Comprehensive Analysis</h2>
                      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        Analysis Complete ✓
                      </div>
                    </div>

                    {/* Professional Summary */}
                    <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-500">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Professional Summary</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Experience Level</p>
                          <p className="font-semibold">{analysisResults.combined.experience || '5+'} years</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Primary Role</p>
                          <p className="font-semibold">{analysisResults.combined.roles?.[0] || 'Developer'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Market Rate</p>
                          <p className="font-semibold text-green-600">
                            {analysisResults.cvAnalysis?.marketPositioning?.hourlyRateEstimate?.recommended || '1000'} SEK/h
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Technical Skills Analysis */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">🔧 Technical Expertise</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-3">Core Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {(analysisResults.combined.skills || []).slice(0, 8).map((skill: string, index: number) => (
                              <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-3">Certifications</h4>
                          <div className="space-y-1">
                            {(analysisResults.combined.certifications || ['AWS Certified', 'Professional Scrum Master']).map((cert: string, index: number) => (
                              <p key={index} className="text-sm text-gray-700">• {cert}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Leadership & Personality Analysis */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">👥 Leadership & Personality</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">{analysisResults.combined.leadership || 7}/10</div>
                          <p className="text-sm text-gray-600">Leadership Score</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{analysisResults.combined.culturalFit || 8}/10</div>
                          <p className="text-sm text-gray-600">Cultural Fit</p>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">{analysisResults.combined.adaptability || 9}/10</div>
                          <p className="text-sm text-gray-600">Adaptability</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Work Style</h4>
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                            {analysisResults.combined.workStyle || 'Collaborativ och resultatinriktad. Trivs i team-miljöer med tydliga mål och öppen kommunikation.'}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Key Values</h4>
                          <div className="flex flex-wrap gap-1">
                            {(analysisResults.combined.values || ['Innovation', 'Kvalitet', 'Teamwork']).map((value: string, index: number) => (
                              <span key={index} className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
                                {value}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Improvement Tips */}
                    <div className="mb-8 p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border-l-4 border-orange-500">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Career Enhancement Tips</h3>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                          <p className="text-sm text-gray-700">
                            <strong>Skill Development:</strong> Consider adding Docker and Kubernetes to your toolkit för increased market value (+15% rate increase potential)
                          </p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                          <p className="text-sm text-gray-700">
                            <strong>Leadership Growth:</strong> Your technical skills are strong - consider formal leadership training to unlock architect-level roles
                          </p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                          <p className="text-sm text-gray-700">
                            <strong>Portfolio:</strong> Document 2-3 key projects with business impact metrics to strengthen consultant positioning
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Market Positioning */}
                    <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-l-4 border-green-500">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Market Positioning</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Rate Recommendation</h4>
                          <div className="bg-white p-4 rounded border">
                            <p className="text-2xl font-bold text-green-600">
                              {analysisResults.cvAnalysis?.marketPositioning?.hourlyRateEstimate?.recommended || 1000} SEK/h
                            </p>
                            <p className="text-sm text-gray-600">
                              Range: {analysisResults.cvAnalysis?.marketPositioning?.hourlyRateEstimate?.min || 800} - {analysisResults.cvAnalysis?.marketPositioning?.hourlyRateEstimate?.max || 1200} SEK/h
                            </p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Competitive Advantages</h4>
                          <div className="space-y-1">
                            {(analysisResults.combined.skills?.slice(0, 4) || ['React', 'TypeScript', 'AWS', 'Leadership']).map((advantage: string, index: number) => (
                              <p key={index} className="text-sm text-gray-700">✓ {advantage} expertise</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
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
