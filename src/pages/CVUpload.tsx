
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
                <h3 className="font-semibold text-sm">Technical Analysis</h3>
                <p className="text-xs text-gray-600">Skills assessment</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-purple-600 mb-2">🔗</div>
                <h3 className="font-semibold text-sm">LinkedIn Analysis</h3>
                <p className="text-xs text-gray-600">Profile optimization</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-orange-600 mb-2">💡</div>
                <h3 className="font-semibold text-sm">Improvement Plan</h3>
                <p className="text-xs text-gray-600">Actionable steps</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-green-600 mb-2">📈</div>
                <h3 className="font-semibold text-sm">Market Positioning</h3>
                <p className="text-xs text-gray-600">Rate optimization</p>
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
                  {/* Analysis Complete Header */}
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">🤖 Professional Analysis Complete</h2>
                      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        Analysis Complete ✓
                      </div>
                    </div>

                    {/* Professional Summary */}
                    <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-500">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">📋 Professional Overview</h3>
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
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">🔧 Technical Assessment</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-3">Current Skills</h4>
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
                          <h4 className="font-medium text-gray-900 mb-3">Skill Maturity</h4>
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
                    </div>

                    {/* LinkedIn Analysis */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">🔗 LinkedIn Analysis</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <h4 className="font-medium text-gray-900 mb-3">Profile Analysis</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Professional Presence</span>
                              <span className="font-medium">{analysisResults.linkedinAnalysis?.professionalPresence || 'Good'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Consulting Readiness</span>
                              <span className="font-medium">{analysisResults.linkedinAnalysis?.consultingReadiness || '7/10'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Content Quality</span>
                              <span className="font-medium">{analysisResults.linkedinAnalysis?.contentQuality || 'Moderate'}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-3">Communication Style</h4>
                          <p className="text-sm text-gray-700 mb-3">
                            {analysisResults.linkedinAnalysis?.communicationStyle || 
                             'Professional and technical communication with good industry engagement'}
                          </p>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-600">Leadership</span>
                              <span className="font-medium">{analysisResults.linkedinAnalysis?.leadership || 7}/10</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-600">Adaptability</span>
                              <span className="font-medium">{analysisResults.linkedinAnalysis?.adaptability || 8}/10</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Professional Perception Analysis */}
                    <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-l-4 border-purple-500">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">👤 Professional Perception Analysis</h3>
                      
                      {/* First Impression */}
                      <div className="mb-6">
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">FIRST IMPRESSION</span>
                          What stands out
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white p-4 rounded border-l-4 border-green-400">
                            <h5 className="font-medium text-green-800 mb-2">✅ Positive signals</h5>
                            <ul className="text-sm text-gray-700 space-y-1">
                              <li>• Strong technical background and expertise</li>
                              <li>• Clear professional development trajectory</li>
                              <li>• Relevant industry expertise and experience</li>
                              <li>• Active on LinkedIn with industry engagement</li>
                            </ul>
                          </div>
                          <div className="bg-white p-4 rounded border-l-4 border-orange-400">
                            <h5 className="font-medium text-orange-800 mb-2">⚠️ Areas for improvement</h5>
                            <ul className="text-sm text-gray-700 space-y-1">
                              <li>• Profile could be more clearly consulting-oriented</li>
                              <li>• Needs more visibility in industry community</li>
                              <li>• Could clarify unique value propositions</li>
                              <li>• More quantified results and achievements</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Market Positioning */}
                      <div className="mb-6">
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">MARKET POSITIONING</span>
                          Technical level & consulting maturity
                        </h4>
                        <div className="bg-white p-4 rounded border">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center">
                              <p className="text-lg font-bold text-blue-600">
                                {analysisResults.technicalAssessment?.overallTechnicalLevel || 'Senior'}
                              </p>
                              <p className="text-xs text-gray-600">Technical Level</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-bold text-purple-600">
                                {analysisResults.linkedinAnalysis?.consultingReadiness || '7/10'}
                              </p>
                              <p className="text-xs text-gray-600">Consulting Maturity</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-bold text-green-600">
                                {analysisResults.roiPredictions?.currentMarketValue?.hourlyRate || 1000} SEK/h
                              </p>
                              <p className="text-xs text-gray-600">Market Value</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Communication Profile */}
                      <div className="mb-6">
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">COMMUNICATION</span>
                          How you come across in communication
                        </h4>
                        <div className="bg-white p-4 rounded border">
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm font-medium text-gray-800">Communication Style:</p>
                              <p className="text-sm text-gray-700">
                                {analysisResults.linkedinAnalysis?.communicationStyle || 
                                 'Professional and technically oriented with good industry engagement'}
                              </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-gray-600">Leadership</p>
                                <div className="flex items-center gap-2">
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-blue-600 h-2 rounded-full" 
                                      style={{width: `${(analysisResults.linkedinAnalysis?.leadership || 7) * 10}%`}}
                                    ></div>
                                  </div>
                                  <span className="text-xs font-medium">{analysisResults.linkedinAnalysis?.leadership || 7}/10</span>
                                </div>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600">Adaptability</p>
                                <div className="flex items-center gap-2">
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-green-600 h-2 rounded-full" 
                                      style={{width: `${(analysisResults.linkedinAnalysis?.adaptability || 8) * 10}%`}}
                                    ></div>
                                  </div>
                                  <span className="text-xs font-medium">{analysisResults.linkedinAnalysis?.adaptability || 8}/10</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Competitive Analysis */}
                      <div className="mb-6">
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">COMPETITION</span>
                          How you compare to others
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white p-4 rounded border">
                            <h5 className="font-medium text-gray-900 mb-2">Competitive Advantages</h5>
                            <ul className="text-sm text-gray-700 space-y-1">
                              {(analysisResults.linkedinAnalysis?.marketPositioning?.competitiveAdvantages || [
                                'Strong technical background',
                                'Relevant industry expertise',
                                'Active knowledge sharing'
                              ]).slice(0, 3).map((advantage: string, index: number) => (
                                <li key={index}>• {advantage}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-white p-4 rounded border">
                            <h5 className="font-medium text-gray-900 mb-2">Differentiating Factors</h5>
                            <ul className="text-sm text-gray-700 space-y-1">
                              {(analysisResults.linkedinAnalysis?.marketPositioning?.marketDifferentiators || [
                                'Unique technical combination',
                                'Industry-specific experience',
                                'Innovative problem-solving'
                              ]).slice(0, 3).map((factor: string, index: number) => (
                                <li key={index}>• {factor}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Personal Brand Analysis */}
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200">
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs">PERSONAL BRAND</span>
                          Brand positioning
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Current positioning</h5>
                            <p className="text-sm text-gray-700 mb-2">
                              {analysisResults.linkedinAnalysis?.currentBrandPositioning || 
                               'Technical expert with strong problem-solving skills and industry knowledge'}
                            </p>
                            <div className="text-xs text-gray-600">
                              Visibility: {analysisResults.linkedinAnalysis?.brandVisibility || 'Medium'} | 
                              Credibility: {analysisResults.linkedinAnalysis?.brandCredibility || 'High'}
                            </div>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Potential & next steps</h5>
                            <ul className="text-xs text-gray-700 space-y-1">
                              <li>• Increase visibility through thought leadership</li>
                              <li>• Develop niche expertise within specific areas</li>
                              <li>• Build stronger network within target industries</li>
                              <li>• Create more consistent online presence</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Plan - FOCUSED SECTION */}
                    <div className="mb-8 p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border-l-4 border-orange-500">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Improvement Action Plan</h3>
                      
                      {/* Immediate Actions (This Week) */}
                      <div className="mb-6">
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">THIS WEEK</span>
                          Immediate Actions
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white p-4 rounded border-l-4 border-red-400">
                            <h5 className="font-medium text-gray-900 mb-2">📄 CV Updates</h5>
                            <ul className="text-sm text-gray-700 space-y-1">
                              <li>• Add "Technical Skills" section with clear proficiency levels</li>
                              <li>• Write 3-line professional summary at the top</li>
                              <li>• Add quantified achievements (numbers, percentages)</li>
                              <li>• Include 2-3 key projects with tech stack</li>
                            </ul>
                          </div>
                          <div className="bg-white p-4 rounded border-l-4 border-blue-400">
                            <h5 className="font-medium text-gray-900 mb-2">🔗 LinkedIn Profile</h5>
                            <ul className="text-sm text-gray-700 space-y-1">
                              <li>• Update headline: "Role | Tech Stack | Available for Consulting"</li>
                              <li>• Optimize About section with client focus</li>
                              <li>• Add top 10 relevant skills and get endorsements</li>
                              <li>• Update profile photo and banner</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Monthly Plan */}
                      <div className="mb-6">
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">30 DAYS</span>
                          Monthly Development Plan
                        </h4>
                        <div className="space-y-4">
                          <div className="bg-white p-4 rounded border-l-4 border-green-400">
                            <h5 className="font-medium text-gray-900 mb-2">📚 Skill Development</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium text-gray-800 mb-1">High Priority Skills to Add:</p>
                                <div className="flex flex-wrap gap-1">
                                  {(analysisResults.technicalAssessment?.skillsGapAnalysis?.missing || 
                                    ['Docker', 'Kubernetes', 'AWS', 'TypeScript']).slice(0, 4).map((skill: string, index: number) => (
                                    <span key={index} className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-800 mb-1">Recommended Certifications:</p>
                                <ul className="text-xs text-gray-700">
                                  <li>• AWS Solutions Architect (High Priority)</li>
                                  <li>• Certified Kubernetes Administrator</li>
                                  <li>• Google Cloud Professional Developer</li>
                                </ul>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white p-4 rounded border-l-4 border-purple-400">
                            <h5 className="font-medium text-gray-900 mb-2">💼 Professional Positioning</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium text-gray-800 mb-1">Content Strategy:</p>
                                <ul className="text-xs text-gray-700 space-y-1">
                                  <li>• Share 2 technical posts per week</li>
                                  <li>• Write about project learnings</li>
                                  <li>• Comment on industry discussions</li>
                                  <li>• Share case studies (anonymized)</li>
                                </ul>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-800 mb-1">Thought Leadership:</p>
                                <ul className="text-xs text-gray-700 space-y-1">
                                  <li>• Write about technology trends</li>
                                  <li>• Share best practices and tips</li>
                                  <li>• Engage with tech community</li>
                                  <li>• Build consultant personal brand</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Expected Outcomes */}
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h4 className="font-medium text-gray-900 mb-2">📈 Expected Results</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="text-center">
                            <p className="font-bold text-green-700">Week 1-2</p>
                            <p className="text-gray-700">Improved profile visibility</p>
                            <p className="text-xs text-gray-600">+20% profile views</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-green-700">Month 1</p>
                            <p className="text-gray-700">Increased opportunities</p>
                            <p className="text-xs text-gray-600">+50% relevant inquiries</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-green-700">Month 2-3</p>
                            <p className="text-gray-700">Rate increase potential</p>
                            <p className="text-xs text-gray-600">+15% hourly rate</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Current Market Position */}
                    <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-l-4 border-green-500">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Market Position & Growth</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Current Value</h4>
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
                          <h4 className="font-medium text-gray-900 mb-3">Growth Timeline</h4>
                          <div className="space-y-2">
                            <div className="bg-white p-3 rounded border">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">After improvements (6 months)</span>
                                <span className="font-medium text-green-600">
                                  {analysisResults.roiPredictions?.improvementPotential?.with6MonthsImprovement?.hourlyRate || 1150} SEK/h
                                </span>
                              </div>
                              <p className="text-xs text-gray-500">LinkedIn optimization + certification</p>
                            </div>
                            <div className="bg-white p-3 rounded border">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Long-term potential (1 year)</span>
                                <span className="font-medium text-green-600">
                                  {analysisResults.roiPredictions?.improvementPotential?.with1YearImprovement?.hourlyRate || 1300} SEK/h
                                </span>
                              </div>
                              <p className="text-xs text-gray-500">Technical expertise + thought leadership</p>
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
