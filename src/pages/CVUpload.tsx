
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight, Code, Users, Target, TrendingUp, Brain, Award, Star, BarChart3, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Logo from '@/components/Logo';
import { Badge } from '@/components/ui/badge';
import { CVUploadForm } from '@/components/CVUploadForm';
import { AnalysisResults } from '@/components/AnalysisResults';
import { MatchWiseChat } from '@/components/MatchWiseChat';
import { performCVAnalysis } from '@/components/CVAnalysisLogic';

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
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    if (!selectedFile.type.includes('pdf') && !selectedFile.type.startsWith('image/')) {
      toast.error('Please upload a PDF file or image');
      return;
    }

    console.log('📂 File selected:', selectedFile.name, selectedFile.type);
    setFile(selectedFile);
    
    // Reset previous analysis
    setAnalysisResults(null);
    
    console.log('🎯 Starting comprehensive analysis...');
    toast.success('CV uploaded! Starting comprehensive analysis...');
    
    // Start analysis with LinkedIn URL if provided
    await performCVAnalysis(
      selectedFile,
      setIsAnalyzing,
      setAnalysisProgress,
      setAnalysisResults,
      setFullName,
      setEmail,
      setPhoneNumber,
      setLinkedinUrl,
      linkedinUrl // Pass current LinkedIn URL for analysis
    );
  };

  const handleLinkedInUrlChange = async (newUrl: string) => {
    setLinkedinUrl(newUrl);
    
    // If we have a file and valid LinkedIn URL, re-run analysis
    if (file && newUrl && newUrl.includes('linkedin.com')) {
      console.log('🔗 LinkedIn URL updated, re-running analysis...');
      toast.info('Re-analyzing with LinkedIn profile...');
      
      await performCVAnalysis(
        file,
        setIsAnalyzing,
        setAnalysisProgress,
        setAnalysisResults,
        setFullName,
        setEmail,
        setPhoneNumber,
        setLinkedinUrl,
        newUrl
      );
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
      // Prepare consultant data
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
        
        communication_style: analysisResults.linkedinAnalysis?.communicationStyle || 
                           analysisResults.cvAnalysis?.softSkills?.communication?.[0] || 
                           'Professional and clear communication',
        work_style: analysisResults.cvAnalysis?.workPreferences?.workStyle || 
                   'Systematic and collaborative',
        values: analysisResults.cvAnalysis?.softSkills?.leadership || 
               ['Innovation', 'Quality', 'Teamwork', 'Continuous learning'],
        personality_traits: analysisResults.cvAnalysis?.softSkills?.problemSolving || 
                          ['Analytical', 'Solution-oriented', 'Creative', 'Collaborative'],
        
        cultural_fit: analysisResults.linkedinAnalysis?.culturalFit || 5,
        leadership: analysisResults.linkedinAnalysis?.leadership || 
                   (analysisResults.cvAnalysis?.professionalSummary?.seniorityLevel === 'Senior' ? 4 : 3),
        adaptability: analysisResults.linkedinAnalysis?.adaptability || 5,
        
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
        
        cvAnalysis: analysisResults.cvAnalysis,
        linkedinAnalysis: analysisResults.linkedinAnalysis
      };

      console.log('💾 Saving consultant data:', consultantData);

      const { data: insertData, error: insertError } = await supabase
        .from('consultants')
        .insert(consultantData);

      if (insertError) {
        console.error('❌ Database insert error:', insertError);
        throw new Error(`Failed to save profile: ${insertError.message}`);
      }

      console.log('✅ Consultant saved successfully');

      // Send welcome email
      try {
        const { error: emailError } = await supabase.functions.invoke('send-welcome-email', {
          body: { email, name: fullName }
        });
        
        if (emailError) {
          console.error('⚠️ Welcome email error:', emailError);
        }
      } catch (emailErr) {
        console.error('⚠️ Email service error:', emailErr);
      }

      setUploadComplete(true);
      toast.success('🎉 Profile saved! Welcome to our consultant network.');

    } catch (error) {
      console.error('❌ Save error:', error);
      toast.error(`Failed to save profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
    const improvementTips = analysisResults.improvementTips;

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
                Welcome to Our Consultant Network!
              </CardTitle>
              <CardDescription>
                Your profile has been analyzed and you are now visible in our consultant network on /dashboard.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Analysis Results and Improvement Tips */}
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
                      <span className="text-sm text-gray-600">Career Development:</span>
                      <p className="font-semibold text-green-600">{cvAnalysis.professionalSummary.careerTrajectory}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Market Rate Estimate */}
            {cvAnalysis?.marketPositioning?.hourlyRateEstimate && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-500" />
                    Market Rate Estimate
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {cvAnalysis.marketPositioning.hourlyRateEstimate.recommended} {cvAnalysis.marketPositioning.hourlyRateEstimate.currency}/h
                    </div>
                    <div className="text-sm text-gray-600 mb-4">
                      Range: {cvAnalysis.marketPositioning.hourlyRateEstimate.min} - {cvAnalysis.marketPositioning.hourlyRateEstimate.max} {cvAnalysis.marketPositioning.hourlyRateEstimate.currency}/h
                    </div>
                    <p className="text-xs text-gray-500 italic">
                      {cvAnalysis.marketPositioning.hourlyRateEstimate.explanation}
                    </p>
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
                </CardContent>
              </Card>
            )}

            {/* LinkedIn Analysis */}
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

            {/* Improvement Tips */}
            {improvementTips && (
              <Card className="shadow-lg col-span-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Personalized Improvement Tips
                  </CardTitle>
                  <CardDescription>
                    Based on your CV and LinkedIn analysis, here are specific recommendations to enhance your profile
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* CV Tips */}
                    <div>
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <Award className="h-5 w-5 text-blue-500" />
                        CV Improvements
                      </h4>
                      <div className="space-y-4">
                        {improvementTips.cvTips.map((tip: any, idx: number) => (
                          <div key={idx} className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-3 rounded-r-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant={tip.priority === 'High' ? 'destructive' : 'secondary'}>
                                {tip.priority}
                              </Badge>
                              <span className="font-medium text-blue-800">{tip.category}</span>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{tip.tip}</p>
                            {tip.action && (
                              <p className="text-xs text-blue-600 font-medium">Action: {tip.action}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* LinkedIn Tips */}
                    <div>
                      <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <Brain className="h-5 w-5 text-purple-500" />
                        LinkedIn Improvements
                      </h4>
                      <div className="space-y-4">
                        {improvementTips.linkedinTips.map((tip: any, idx: number) => (
                          <div key={idx} className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-3 rounded-r-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant={tip.priority === 'High' ? 'destructive' : 'secondary'}>
                                {tip.priority}
                              </Badge>
                              <span className="font-medium text-purple-800">{tip.category}</span>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{tip.tip}</p>
                            {tip.action && (
                              <p className="text-xs text-purple-600 font-medium">Action: {tip.action}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Overall Strategy */}
                  <div className="mt-6">
                    <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Target className="h-5 w-5 text-green-500" />
                      Overall Strategy
                    </h4>
                    <div className="space-y-3">
                      {improvementTips.overallStrategy.map((tip: any, idx: number) => (
                        <div key={idx} className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                          <Star className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant={tip.priority === 'High' ? 'destructive' : 'secondary'}>
                                {tip.priority}
                              </Badge>
                              <span className="font-medium text-green-800">{tip.category}</span>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{tip.tip}</p>
                            {tip.action && (
                              <p className="text-xs text-green-600 font-medium">Action: {tip.action}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Next Steps */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              A welcome email has been sent to {email}. Your profile is now visible in the consultant network.
            </p>
            <Button onClick={handleContinue} className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3">
              Go to Platform
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
            AI-Driven Comprehensive Career Analysis
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Upload Your CV & LinkedIn Profile
          </h1>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Get instant comprehensive AI analysis of your technical skills, leadership capabilities, 
            personality traits, and career potential. Upload your CV and add your LinkedIn profile 
            to receive detailed insights and become visible in our consultant network.
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
              Improvement Tips
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
            onLinkedinUrlChange={handleLinkedInUrlChange}
            onAgreeToTermsChange={setAgreeToTerms}
            onSubmit={handleSubmit}
          />

          {/* Right Column - Analysis Results and AI Chat */}
          <div className="space-y-6">
            <AnalysisResults
              analysisResults={analysisResults}
              isAnalyzing={isAnalyzing}
              analysisProgress={analysisProgress}
            />
            
            {/* AI Chat - Always visible */}
            <div className="sticky top-4">
              <MatchWiseChat
                analysisResults={analysisResults}
                isMinimized={isChatMinimized}
                onToggleMinimize={() => setIsChatMinimized(!isChatMinimized)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
