
import React, { useState, useEffect } from 'react';
import { CVUploadForm } from '@/components/CVUploadForm';
import { AnalysisResults } from '@/components/AnalysisResults';
import { MatchWiseChat } from '@/components/MatchWiseChat';
import { performCVAnalysis } from '@/components/CVAnalysisLogic';
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
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [isMyConsultant, setIsMyConsultant] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(true);
  const { toast } = useToast();

  // Check if we're uploading for "My Consultants"
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const source = urlParams.get('source');
    setIsMyConsultant(source === 'my-consultants');
  }, []);

  // Auto-trigger analysis when both file and LinkedIn URL are provided
  useEffect(() => {
    if (file && linkedinUrl.includes('linkedin.com') && !isAnalyzing && !analysisResults) {
      performCVAnalysis(
        file,
        setIsAnalyzing,
        setAnalysisProgress,
        setAnalysisResults,
        setFullName,
        setEmail,
        setPhoneNumber,
        setLinkedinUrl,
        linkedinUrl
      );
    }
  }, [file, linkedinUrl, isAnalyzing, analysisResults]);

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
        location: analysisResults.cvAnalysis?.personalInfo?.location || '',
        skills: analysisResults.cvAnalysis?.technicalExpertise?.allSkills || [],
        experience_years: analysisResults.cvAnalysis?.professionalSummary?.yearsOfExperience ? 
          parseInt(analysisResults.cvAnalysis.professionalSummary.yearsOfExperience) : null,
        availability: 'Available',
        communication_style: analysisResults.linkedinAnalysis?.communicationStyle || '',
        roles: analysisResults.cvAnalysis?.professionalSummary?.currentRole ? 
          [analysisResults.cvAnalysis.professionalSummary.currentRole] : [],
        certifications: analysisResults.cvAnalysis?.education?.certifications || [],
        linkedin_url: linkedinUrl,
        languages: analysisResults.cvAnalysis?.personalInfo?.languages || [],
        work_style: analysisResults.linkedinAnalysis?.teamFitAssessment?.workStyle || '',
        values: analysisResults.linkedinAnalysis?.marketPositioning?.competitiveAdvantages || [],
        personality_traits: analysisResults.linkedinAnalysis?.marketPositioning?.marketDifferentiators || [],
        team_fit: analysisResults.linkedinAnalysis?.teamFitAssessment?.projectApproach || '',
        cultural_fit: analysisResults.linkedinAnalysis?.culturalFit || 5,
        adaptability: analysisResults.linkedinAnalysis?.adaptability || 5,
        leadership: analysisResults.linkedinAnalysis?.leadership || 3,
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
                  {/* Enhanced Analysis Results with comprehensive insights */}
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">🤖 Comprehensive CV & LinkedIn Analysis</h2>
                      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        Analysis Complete ✓
                      </div>
                    </div>

                    {/* Professional Summary */}
                    <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-500">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">📋 Professional Summary</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Experience Level</p>
                          <p className="font-semibold">{analysisResults.cvAnalysis?.professionalSummary?.yearsOfExperience || '5+'} years</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Primary Role</p>
                          <p className="font-semibold">{analysisResults.cvAnalysis?.professionalSummary?.currentRole || 'Developer'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Market Rate</p>
                          <p className="font-semibold text-green-600">
                            {analysisResults.roiPredictions?.currentMarketValue?.hourlyRate || 1000} SEK/h
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Technical Skills Analysis */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">🔧 Technical Expertise Analysis</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-3">Core Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {(analysisResults.technicalAssessment?.skillsGapAnalysis?.strengths || 
                              analysisResults.cvAnalysis?.technicalExpertise?.programmingLanguages?.expert || 
                              ['React', 'TypeScript', 'Node.js', 'AWS']).slice(0, 8).map((skill: string, index: number) => (
                              <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-3">Technical Maturity</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Frontend</span>
                              <span className="font-medium">{analysisResults.technicalAssessment?.technicalMaturity?.frontendScore || 8}/10</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Backend</span>
                              <span className="font-medium">{analysisResults.technicalAssessment?.technicalMaturity?.backendScore || 7}/10</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">DevOps</span>
                              <span className="font-medium">{analysisResults.technicalAssessment?.technicalMaturity?.devopsScore || 6}/10</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Skills Gap Analysis */}
                      {analysisResults.technicalAssessment?.skillsGapAnalysis?.missing?.length > 0 && (
                        <div className="mt-4 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                          <h4 className="font-medium text-gray-900 mb-2">🎯 High-Demand Skills to Add</h4>
                          <div className="flex flex-wrap gap-2">
                            {analysisResults.technicalAssessment.skillsGapAnalysis.missing.slice(0, 5).map((skill: string, index: number) => (
                              <span key={index} className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                                + {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* LinkedIn Analysis Based on Posts & Bio */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">🔗 LinkedIn Analysis (30 Recent Posts + Bio)</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-linkedin-blue bg-opacity-10 p-4 rounded-lg border border-blue-200">
                          <h4 className="font-medium text-gray-900 mb-3">Content Analysis</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Post Frequency</span>
                              <span className="font-medium">{analysisResults.linkedinAnalysis?.recentPostsAnalysis?.postFrequency || 'Medium'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Content Quality</span>
                              <span className="font-medium">{analysisResults.linkedinAnalysis?.recentPostsAnalysis?.contentQuality || 'Good'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Thought Leadership</span>
                              <span className="font-medium">{analysisResults.linkedinAnalysis?.recentPostsAnalysis?.thoughtLeadership || 'Moderate'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Engagement Level</span>
                              <span className="font-medium">{analysisResults.linkedinAnalysis?.recentPostsAnalysis?.engagementLevel || 'Medium'}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-3">Professional Bio Analysis</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Bio Clarity</span>
                              <span className="font-medium">{analysisResults.linkedinAnalysis?.bioAnalysis?.clarity || 'Good'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Consultant Positioning</span>
                              <span className="font-medium">{analysisResults.linkedinAnalysis?.bioAnalysis?.consultantPositioning || 'Moderate'}</span>
                            </div>
                            <div className="mt-3">
                              <p className="text-sm text-gray-600 mb-1">Key Strengths:</p>
                              <div className="flex flex-wrap gap-1">
                                {(analysisResults.linkedinAnalysis?.bioAnalysis?.keyStrengths || ['Technical expertise', 'Clear communication']).map((strength: string, index: number) => (
                                  <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                    {strength}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Leadership & Team Fit Analysis */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">👥 Leadership & Team Fit Assessment</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">{analysisResults.linkedinAnalysis?.leadership || 7}/10</div>
                          <p className="text-sm text-gray-600">Leadership Score</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{analysisResults.linkedinAnalysis?.culturalFit || 8}/10</div>
                          <p className="text-sm text-gray-600">Cultural Fit</p>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">{analysisResults.linkedinAnalysis?.adaptability || 9}/10</div>
                          <p className="text-sm text-gray-600">Adaptability</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Work Style Analysis</h4>
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                            {analysisResults.linkedinAnalysis?.communicationStyle || 
                             'Professional and structured communication with clear technical explanations and collaborative approach'}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Team Collaboration</h4>
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                            {analysisResults.linkedinAnalysis?.teamCollaboration || 
                             'Strong collaborative partner focused on knowledge sharing and cross-functional teamwork'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Certification Recommendations */}
                    <div className="mb-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-l-4 border-indigo-500">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">🏆 Certification Recommendations</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(analysisResults.certificationRecommendations?.technical || [
                          {
                            certification: 'AWS Solutions Architect',
                            priority: 'High',
                            reason: 'Enhance cloud consulting capabilities',
                            timeToComplete: '2-3 months',
                            marketValue: 'High demand in enterprise consulting'
                          },
                          {
                            certification: 'Google Professional Cloud Developer',
                            priority: 'Medium',
                            reason: 'Complement frontend skills with cloud backend',
                            timeToComplete: '1-2 months',
                            marketValue: 'Growing demand for full-stack cloud developers'
                          }
                        ]).map((cert: any, index: number) => (
                          <div key={index} className="bg-white p-4 rounded border">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">{cert.certification}</h4>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                cert.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {cert.priority} Priority
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{cert.reason}</p>
                            <div className="text-xs text-gray-500">
                              <p>⏱️ Time: {cert.timeToComplete}</p>
                              <p>💼 Value: {cert.marketValue}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Improvement Tips */}
                    <div className="mb-8 p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border-l-4 border-orange-500">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Career Enhancement Tips</h3>
                      <div className="space-y-4">
                        
                        {/* CV Tips */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">📄 CV Optimization</h4>
                          <div className="space-y-2">
                            {(analysisResults.improvementTips?.cvTips || [
                              {
                                category: 'Technical Skills',
                                tip: 'Add a dedicated "Technical Skills" section with clear proficiency levels',
                                priority: 'High'
                              }
                            ]).slice(0, 2).map((tip: any, index: number) => (
                              <div key={index} className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{tip.category}</p>
                                  <p className="text-sm text-gray-700">{tip.tip}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* LinkedIn Tips */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">🔗 LinkedIn Optimization</h4>
                          <div className="space-y-2">
                            {(analysisResults.improvementTips?.linkedinTips || [
                              {
                                category: 'Consulting Readiness',
                                tip: 'Improve your consulting positioning with client-focused content',
                                priority: 'High'
                              }
                            ]).slice(0, 2).map((tip: any, index: number) => (
                              <div key={index} className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{tip.category}</p>
                                  <p className="text-sm text-gray-700">{tip.tip}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ROI Predictions */}
                    <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-l-4 border-green-500">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Market Positioning & ROI Predictions</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Current Market Position</h4>
                          <div className="bg-white p-4 rounded border">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-green-600">
                                {analysisResults.roiPredictions?.currentMarketValue?.hourlyRate || 1000} SEK/h
                              </p>
                              <p className="text-sm text-gray-600">Current Market Rate</p>
                              <p className="text-xs text-gray-500 mt-1">
                                Monthly: {(analysisResults.roiPredictions?.currentMarketValue?.monthlyPotential || 160000).toLocaleString()} SEK
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Growth Potential</h4>
                          <div className="space-y-2">
                            <div className="bg-white p-3 rounded border">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">6 months improvement</span>
                                <span className="font-medium text-green-600">
                                  {analysisResults.roiPredictions?.improvementPotential?.with6MonthsImprovement?.hourlyRate || 1150} SEK/h
                                </span>
                              </div>
                              <p className="text-xs text-gray-500">LinkedIn optimization + certification</p>
                            </div>
                            <div className="bg-white p-3 rounded border">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">1 year improvement</span>
                                <span className="font-medium text-green-600">
                                  {analysisResults.roiPredictions?.improvementPotential?.with1YearImprovement?.hourlyRate || 1300} SEK/h
                                </span>
                              </div>
                              <p className="text-xs text-gray-500">Technical certs + thought leadership</p>
                            </div>
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
