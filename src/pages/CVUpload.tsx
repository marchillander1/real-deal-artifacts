import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, FileText, CheckCircle2, ArrowRight, Code, Users, Target, TrendingUp, Brain, Award, Star, Loader2, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Logo from '@/components/Logo';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export const CVUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const navigate = useNavigate();
  
  // Keep track of analyzed files to prevent re-analysis
  const analyzedFiles = useRef<Set<string>>(new Set());

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf' || selectedFile.type.startsWith('image/')) {
        const fileId = `${selectedFile.name}-${selectedFile.size}-${selectedFile.lastModified}`;
        
        setFile(selectedFile);
        
        // Only analyze if this file hasn't been analyzed before
        if (!analyzedFiles.current.has(fileId)) {
          analyzedFiles.current.add(fileId);
          setAnalysisResults(null);
          toast.success('CV uploaded! Starting comprehensive AI analysis...');
          performAnalysis(selectedFile);
        } else {
          toast.info('This file has already been analyzed');
        }
      } else {
        toast.error('Please upload a PDF file or image');
      }
    }
  };

  const performAnalysis = async (fileToAnalyze: File) => {
    console.log('Starting comprehensive analysis for file:', fileToAnalyze.name);
    
    setIsAnalyzing(true);
    setAnalysisProgress(10);
    toast.info('🧠 AI analyzing your CV and extracting comprehensive professional information...');

    try {
      // Convert file to base64
      const fileBuffer = await fileToAnalyze.arrayBuffer();
      const fileBase64 = btoa(String.fromCharCode(...new Uint8Array(fileBuffer)));

      console.log('Sending CV for comprehensive parsing...');
      setAnalysisProgress(30);
      
      // Call the parse-cv edge function
      const { data: parseData, error: parseError } = await supabase.functions.invoke('parse-cv', {
        body: {
          file: fileBase64,
          fileName: fileToAnalyze.name,
          fileType: fileToAnalyze.type
        }
      });

      if (parseError) {
        console.error('Parse error:', parseError);
        throw new Error(`CV parsing failed: ${parseError.message}`);
      }

      if (!parseData || !parseData.analysis) {
        throw new Error('No analysis data returned from CV parsing');
      }

      console.log('CV analyzed successfully with comprehensive data:', parseData);
      setAnalysisProgress(60);
      
      // Auto-populate form fields from CV analysis
      if (parseData.analysis?.personalInfo) {
        const personalInfo = parseData.analysis.personalInfo;
        
        if (personalInfo.name && !fullName) {
          setFullName(personalInfo.name);
          console.log('Auto-filled name:', personalInfo.name);
        }
        if (personalInfo.email && !email) {
          setEmail(personalInfo.email);
          console.log('Auto-filled email:', personalInfo.email);
        }
        if (personalInfo.phone && !phoneNumber) {
          setPhoneNumber(personalInfo.phone);
          console.log('Auto-filled phone:', personalInfo.phone);
        }
        if (personalInfo.linkedinProfile && !linkedinUrl) {
          const linkedinProfile = personalInfo.linkedinProfile.startsWith('http') 
            ? personalInfo.linkedinProfile 
            : `https://linkedin.com/in/${personalInfo.linkedinProfile}`;
          setLinkedinUrl(linkedinProfile);
          console.log('Auto-filled LinkedIn:', linkedinProfile);
        }
      }

      setAnalysisProgress(80);

      // Call LinkedIn analysis
      let linkedinAnalysis = null;
      const linkedinToAnalyze = linkedinUrl || parseData.analysis?.personalInfo?.linkedinProfile;
      
      if (linkedinToAnalyze) {
        try {
          console.log('Analyzing LinkedIn profile for comprehensive soft skills analysis...', linkedinToAnalyze);
          const { data: linkedinData, error: linkedinError } = await supabase.functions.invoke('analyze-linkedin', {
            body: {
              linkedinUrl: linkedinToAnalyze,
              fullName: fullName || parseData.analysis?.personalInfo?.name || 'Unknown',
              email: email || parseData.analysis?.personalInfo?.email || 'unknown@email.com'
            }
          });

          if (linkedinError) {
            console.error('LinkedIn analysis error:', linkedinError);
            console.warn('Continuing with CV analysis only - LinkedIn analysis failed');
          } else if (linkedinData?.analysis) {
            linkedinAnalysis = linkedinData.analysis;
            console.log('LinkedIn analysis completed with comprehensive soft skills:', linkedinAnalysis);
          }
        } catch (linkedinErr) {
          console.error('LinkedIn analysis failed:', linkedinErr);
          console.warn('Continuing with CV analysis only');
        }
      }

      setAnalysisProgress(100);

      // Set comprehensive analysis results
      const completeAnalysis = {
        cvAnalysis: parseData.analysis,
        linkedinAnalysis: linkedinAnalysis
      };
      
      setAnalysisResults(completeAnalysis);
      
      toast.success('🎉 Comprehensive analysis completed! Review your complete professional profile and join our network.');

    } catch (error) {
      console.error('Analysis error:', error);
      toast.error(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
      
      // Remove file from analyzed set to allow retry
      const fileId = `${fileToAnalyze.name}-${fileToAnalyze.size}-${fileToAnalyze.lastModified}`;
      analyzedFiles.current.delete(fileId);
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!file || !email || !fullName || !agreeToTerms) {
      toast.error('Please fill in all required fields, upload a file and agree to terms');
      return;
    }

    if (!analysisResults) {
      toast.error('Please wait for analysis to complete');
      return;
    }

    setIsUploading(true);

    try {
      // Prepare comprehensive consultant data
      const consultantData = {
        name: fullName,
        email: email,
        phone: phoneNumber || null,
        linkedin_url: linkedinUrl || null,
        skills: analysisResults.cvAnalysis?.technicalExpertise?.programmingLanguages?.expert || 
               analysisResults.cvAnalysis?.technicalExpertise?.programmingLanguages || [],
        experience_years: parseInt(analysisResults.cvAnalysis?.professionalSummary?.yearsOfExperience?.replace(/\D/g, '') || '0'),
        hourly_rate: parseInt(analysisResults.cvAnalysis?.marketPositioning?.salaryBenchmarks?.stockholm?.replace(/\D/g, '') || '800'),
        location: analysisResults.cvAnalysis?.personalInfo?.location || 'Sweden',
        availability: 'Available now',
        cv_file_path: `cv_${Date.now()}_${file.name}`,
        
        // Enhanced soft skills and human factors
        communication_style: analysisResults.linkedinAnalysis?.communicationStyle || 
                           analysisResults.cvAnalysis?.softSkills?.communication?.[0] || 
                           'Professional and clear communication',
        work_style: analysisResults.cvAnalysis?.workPreferences?.workStyle || 
                   'Systematic and collaborative',
        values: analysisResults.cvAnalysis?.softSkills?.leadership || 
               ['Innovation', 'Quality', 'Teamwork', 'Continuous learning'],
        personality_traits: analysisResults.cvAnalysis?.softSkills?.problemSolving || 
                          ['Analytical', 'Solution-oriented', 'Creative', 'Collaborative'],
        
        // Human factors scoring
        cultural_fit: analysisResults.linkedinAnalysis?.culturalFit || 5,
        leadership: analysisResults.linkedinAnalysis?.leadership || 
                   (analysisResults.cvAnalysis?.professionalSummary?.seniorityLevel === 'Senior' ? 4 : 3),
        adaptability: analysisResults.linkedinAnalysis?.adaptability || 5,
        
        // Professional data
        certifications: analysisResults.cvAnalysis?.certifications?.development || 
                       analysisResults.cvAnalysis?.certifications || [],
        roles: analysisResults.cvAnalysis?.marketPositioning?.targetRoles?.slice(0, 3) || 
              [analysisResults.cvAnalysis?.professionalSummary?.currentRole || 'Software Developer'],
        type: 'new',
        languages: analysisResults.cvAnalysis?.personalInfo?.languages || ['Swedish', 'English'],
        team_fit: analysisResults.linkedinAnalysis?.teamCollaboration || 
                 'Strong collaborative partner focused on collective problem-solving',
        rating: 4.8,
        projects_completed: 0,
        last_active: 'Today',
        
        // Store complete analysis data
        cvAnalysis: analysisResults.cvAnalysis,
        linkedinAnalysis: analysisResults.linkedinAnalysis
      };

      console.log('Saving consultant data with comprehensive analysis:', consultantData);

      const { data: insertData, error: insertError } = await supabase
        .from('consultants')
        .insert(consultantData);

      if (insertError) {
        console.error('Insert error:', insertError);
        throw new Error(`Failed to save profile: ${insertError.message}`);
      }

      console.log('Consultant saved to database successfully');

      // Send welcome email
      try {
        const { error: emailError } = await supabase.functions.invoke('send-welcome-email', {
          body: {
            email,
            name: fullName
          }
        });
        
        if (emailError) {
          console.error('Welcome email error:', emailError);
        }
      } catch (emailErr) {
        console.error('Error sending welcome email:', emailErr);
      }

      setUploadComplete(true);
      toast.success('🎉 Comprehensive profile saved! You are now part of our consultant network.');

    } catch (error) {
      console.error('Save error:', error);
      toast.error(`Failed to save profile: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleContinue = () => {
    navigate('/dashboard');
  };

  if (uploadComplete && analysisResults) {
    const cvAnalysis = analysisResults.cvAnalysis;
    const linkedinAnalysis = analysisResults.linkedinAnalysis;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="container mx-auto max-w-6xl">
          {/* Success Header */}
          <Card className="mb-8 text-center shadow-xl">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Logo />
              </div>
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl font-bold text-green-600">
                Welcome to our consultant network!
              </CardTitle>
              <CardDescription>
                Your comprehensive professional profile has been analyzed and you are now part of our network. 
                You can now receive matching assignments based on your complete skills and experience profile.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Comprehensive Analysis Results Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Professional Summary */}
            {cvAnalysis?.professionalSummary && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    Professional Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Level:</span>
                      <p className="font-semibold">{cvAnalysis.professionalSummary.seniorityLevel}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Experience:</span>
                      <p className="font-semibold">{cvAnalysis.professionalSummary.yearsOfExperience}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Role:</span>
                      <p className="font-semibold">{cvAnalysis.professionalSummary.currentRole}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Trajectory:</span>
                      <p className="font-semibold text-green-600">{cvAnalysis.professionalSummary.careerTrajectory}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Technical Expertise */}
            {cvAnalysis?.technicalExpertise && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-purple-500" />
                    Technical Expertise
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {cvAnalysis.technicalExpertise.programmingLanguages?.expert && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Expert Skills:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {cvAnalysis.technicalExpertise.programmingLanguages.expert.map((skill: string, idx: number) => (
                          <Badge key={idx} className="bg-green-100 text-green-800">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {cvAnalysis.technicalExpertise.cloudAndInfrastructure?.platforms && (
                    <div className="mt-3">
                      <span className="text-sm font-medium text-gray-700">Cloud Platforms:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {cvAnalysis.technicalExpertise.cloudAndInfrastructure.platforms.map((platform: string, idx: number) => (
                          <Badge key={idx} className="bg-blue-100 text-blue-800">{platform}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Leadership Analysis */}
            {linkedinAnalysis && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-500" />
                    Communication & Leadership
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Communication Style:</span>
                      <p className="font-semibold">{linkedinAnalysis.communicationStyle}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Leadership Approach:</span>
                      <p className="font-semibold">{linkedinAnalysis.leadershipStyle}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      <div className="text-center">
                        <p className="text-xs text-gray-600">Cultural Fit</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div className="bg-blue-600 h-2 rounded-full" style={{width: `${(linkedinAnalysis.culturalFit/5)*100}%`}}></div>
                        </div>
                        <p className="text-xs font-bold text-blue-600 mt-1">{linkedinAnalysis.culturalFit}/5</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-600">Leadership</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div className="bg-orange-600 h-2 rounded-full" style={{width: `${(linkedinAnalysis.leadership/5)*100}%`}}></div>
                        </div>
                        <p className="text-xs font-bold text-orange-600 mt-1">{linkedinAnalysis.leadership}/5</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-600">Innovation</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div className="bg-green-600 h-2 rounded-full" style={{width: `${((linkedinAnalysis.innovation || 4)/5)*100}%`}}></div>
                        </div>
                        <p className="text-xs font-bold text-green-600 mt-1">{linkedinAnalysis.innovation || 4}/5</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Market Positioning */}
            {cvAnalysis?.marketPositioning && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-500" />
                    Market Positioning
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="text-sm text-gray-600">Unique Value:</span>
                    <p className="text-sm font-medium">{cvAnalysis.marketPositioning.uniqueValueProposition}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Competitiveness:</span>
                    <p className="text-sm font-semibold text-blue-600">{cvAnalysis.marketPositioning.competitiveness}</p>
                  </div>
                  {cvAnalysis.marketPositioning.salaryBenchmarks && (
                    <div className="space-y-2">
                      <span className="text-sm font-medium text-gray-700">Salary Range:</span>
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <p className="text-xs text-gray-600">Stockholm Market</p>
                        <p className="text-sm font-bold text-blue-600">{cvAnalysis.marketPositioning.salaryBenchmarks.stockholm}</p>
                      </div>
                    </div>
                  )}
                  {cvAnalysis.marketPositioning.targetRoles && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Target Roles:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {cvAnalysis.marketPositioning.targetRoles.slice(0, 3).map((role: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs">{role}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Detailed Strengths Analysis */}
          {cvAnalysis?.detailedStrengthsAnalysis && (
            <Card className="shadow-lg mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Detailed Strengths Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {cvAnalysis.detailedStrengthsAnalysis.slice(0, 4).map((strength: any, idx: number) => (
                    <div key={idx} className="border-l-4 border-green-500 pl-3 bg-green-50 p-3 rounded">
                      <h6 className="font-semibold text-green-700 text-sm">{strength.category}</h6>
                      <p className="text-xs text-gray-600 mt-1">{strength.description}</p>
                      <p className="text-xs text-green-600 mt-1 font-medium">Market Value: {strength.marketValue}</p>
                      <p className="text-xs text-blue-600 mt-1">Growth Potential: {strength.growthPotential}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Development Roadmap */}
          {cvAnalysis?.comprehensiveImprovementAreas && (
            <Card className="shadow-lg mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-orange-500" />
                  Development Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cvAnalysis.comprehensiveImprovementAreas.slice(0, 3).map((area: any, idx: number) => (
                    <div key={idx} className="border border-orange-200 p-3 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h6 className="font-semibold text-orange-700 text-sm">{area.area}</h6>
                        <Badge className={`text-xs ${area.improvementPriority === 'High Priority' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {area.improvementPriority}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{area.currentState}</p>
                      <p className="text-xs text-orange-600 font-medium">Expected Impact: {area.expectedImpact}</p>
                      <p className="text-xs text-blue-600">Time to Implement: {area.timeToImplement}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              A welcome email has been sent to {email} with your comprehensive analysis. You can now explore the platform.
            </p>
            <Button onClick={handleContinue} className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3">
              Continue to Platform
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          
          <div className="inline-flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            AI-Powered Comprehensive Career Analysis
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Upload Your CV & LinkedIn Profile
          </h1>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Get instant comprehensive AI analysis of your technical skills, leadership style, 
            personality, and career potential. Upload your CV and add your LinkedIn profile 
            to receive detailed insights and join our exclusive consultant network.
          </p>

          {/* Feature highlights */}
          <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Code className="h-4 w-4 text-purple-500" />
              Technical Expertise
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4 text-blue-500" />
              Leadership Analysis
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Target className="h-4 w-4 text-orange-500" />
              Career Strategy
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <BarChart3 className="h-4 w-4 text-green-500" />
              Market Positioning
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <Card className="shadow-xl">
            <CardHeader className="text-center border-b">
              <div className="flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 mr-2 text-purple-600" />
                <CardTitle className="text-xl font-semibold">Start Your Comprehensive Analysis</CardTitle>
              </div>
              <CardDescription className="text-gray-600">
                Both CV and LinkedIn profile are required for complete professional analysis
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* CV Upload Section */}
                <div className="space-y-3">
                  <Label htmlFor="cv-upload" className="text-base font-medium flex items-center">
                    CV File <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-purple-300 transition-colors bg-gray-50">
                    <input
                      id="cv-upload"
                      type="file"
                      accept=".pdf,image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="cv-upload" className="cursor-pointer">
                      {file ? (
                        <div className="flex items-center justify-center space-x-3">
                          <FileText className="h-8 w-8 text-green-600" />
                          <div>
                            <p className="font-medium text-green-700">{file.name}</p>
                            <p className="text-sm text-gray-500">
                              {isAnalyzing ? 'Analyzing...' : analysisResults ? 'Analysis complete' : 'Ready for analysis'}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                          <div>
                            <p className="text-base font-medium text-gray-700 mb-1">
                              Upload Your CV
                            </p>
                            <p className="text-sm text-gray-500">
                              PDF or image format - Comprehensive analysis starts automatically
                            </p>
                          </div>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Personal Information - Auto-populated from comprehensive CV analysis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="fullName" className="text-base font-medium flex items-center">
                      Full Name <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Auto-filled from CV"
                      className="h-12"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-base font-medium flex items-center">
                      Email <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Auto-filled from CV"
                      className="h-12"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="phone" className="text-base font-medium">Phone</Label>
                    <Input
                      id="phone"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Auto-filled from CV"
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="linkedin" className="text-base font-medium flex items-center">
                      LinkedIn Profile <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="linkedin"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="Required for comprehensive analysis"
                      className="h-12"
                      required
                    />
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Checkbox
                    id="terms"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                    className="mt-1"
                  />
                  <div className="text-sm text-gray-600">
                    <Label htmlFor="terms" className="cursor-pointer">
                      <span className="font-medium">I agree to comprehensive analysis and network joining</span>
                    </Label>
                    <p className="mt-1">
                      I consent to MatchWise storing and processing my comprehensive professional information for advanced consultant matching. 
                      This allows me to receive highly relevant assignment opportunities based on my complete skills, experience and personality profile.
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg bg-purple-600 hover:bg-purple-700" 
                  disabled={isUploading || !file || !email || !fullName || !agreeToTerms || isAnalyzing}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Saving Comprehensive Profile...
                    </>
                  ) : isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Comprehensive Analysis in Progress...
                    </>
                  ) : analysisResults ? (
                    <>
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Submit & Join Our Network
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-5 w-5" />
                      Upload CV to Start Analysis
                    </>
                  )}
                </Button>
                
                {!analysisResults && file && !isAnalyzing && (
                  <p className="text-center text-sm text-orange-500">
                    Waiting for analysis to complete before you can submit
                  </p>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Right Column - Analysis Results */}
          <div className="space-y-6">
            {/* Analysis in Progress */}
            {isAnalyzing && (
              <Card className="shadow-xl">
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-4">Analyzing your CV & LinkedIn...</h3>
                  <Progress value={analysisProgress} className="w-full mb-4" />
                  <p className="text-gray-600">
                    Our AI is performing comprehensive analysis of your CV and LinkedIn profile, 
                    extracting technical skills, soft skills, leadership qualities and creating your complete professional profile.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Analysis Results */}
            {analysisResults && (
              <div className="space-y-6">
                <Card className="shadow-xl">
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl text-green-600 flex items-center justify-center gap-2">
                      <CheckCircle2 className="h-6 w-6" />
                      Comprehensive Analysis Complete!
                    </CardTitle>
                    <CardDescription>
                      Your CV and LinkedIn have been analyzed successfully. Complete the form to join our network.
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* Professional Summary */}
                {analysisResults.cvAnalysis?.professionalSummary && (
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-blue-500" />
                        Professional Profile
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-gray-600">Level:</span>
                          <p className="font-semibold">{analysisResults.cvAnalysis.professionalSummary.seniorityLevel}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Experience:</span>
                          <p className="font-semibold">{analysisResults.cvAnalysis.professionalSummary.yearsOfExperience}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Role:</span>
                          <p className="font-semibold">{analysisResults.cvAnalysis.professionalSummary.currentRole}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Trajectory:</span>
                          <p className="font-semibold text-green-600">{analysisResults.cvAnalysis.professionalSummary.careerTrajectory}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Technical Expertise */}
                {analysisResults.cvAnalysis?.technicalExpertise && (
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Code className="h-5 w-5 text-purple-500" />
                        Technical Expertise
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {analysisResults.cvAnalysis.technicalExpertise.programmingLanguages?.expert && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Expert Skills:</span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {analysisResults.cvAnalysis.technicalExpertise.programmingLanguages.expert.map((skill: string, idx: number) => (
                              <Badge key={idx} className="bg-green-100 text-green-800">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {analysisResults.cvAnalysis.technicalExpertise.cloudAndInfrastructure?.platforms && (
                        <div className="mt-3">
                          <span className="text-sm font-medium text-gray-700">Cloud Platforms:</span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {analysisResults.cvAnalysis.technicalExpertise.cloudAndInfrastructure.platforms.map((platform: string, idx: number) => (
                              <Badge key={idx} className="bg-blue-100 text-blue-800">{platform}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Leadership Analysis */}
                {analysisResults.linkedinAnalysis && (
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-blue-500" />
                        Communication & Leadership
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm text-gray-600">Communication Style:</span>
                          <p className="font-semibold">{analysisResults.linkedinAnalysis.communicationStyle}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Leadership Approach:</span>
                          <p className="font-semibold">{analysisResults.linkedinAnalysis.leadershipStyle}</p>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-4">
                          <div className="text-center">
                            <p className="text-xs text-gray-600">Cultural Fit</p>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div className="bg-blue-600 h-2 rounded-full" style={{width: `${(analysisResults.linkedinAnalysis.culturalFit/5)*100}%`}}></div>
                            </div>
                            <p className="text-xs font-bold text-blue-600 mt-1">{analysisResults.linkedinAnalysis.culturalFit}/5</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-600">Leadership</p>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div className="bg-orange-600 h-2 rounded-full" style={{width: `${(analysisResults.linkedinAnalysis.leadership/5)*100}%`}}></div>
                            </div>
                            <p className="text-xs font-bold text-orange-600 mt-1">{analysisResults.linkedinAnalysis.leadership}/5</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-600">Innovation</p>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div className="bg-green-600 h-2 rounded-full" style={{width: `${((analysisResults.linkedinAnalysis.innovation || 4)/5)*100}%`}}></div>
                            </div>
                            <p className="text-xs font-bold text-green-600 mt-1">{analysisResults.linkedinAnalysis.innovation || 4}/5</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Market Positioning */}
                {analysisResults.cvAnalysis?.marketPositioning && (
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-purple-500" />
                        Market Positioning
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <span className="text-sm text-gray-600">Unique Value:</span>
                        <p className="text-sm font-medium">{analysisResults.cvAnalysis.marketPositioning.uniqueValueProposition}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Competitiveness:</span>
                        <p className="text-sm font-semibold text-blue-600">{analysisResults.cvAnalysis.marketPositioning.competitiveness}</p>
                      </div>
                      {analysisResults.cvAnalysis.marketPositioning.salaryBenchmarks && (
                        <div className="space-y-2">
                          <span className="text-sm font-medium text-gray-700">Salary Range:</span>
                          <div className="text-center p-2 bg-blue-50 rounded">
                            <p className="text-xs text-gray-600">Stockholm Market</p>
                            <p className="text-sm font-bold text-blue-600">{analysisResults.cvAnalysis.marketPositioning.salaryBenchmarks.stockholm}</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
