import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight, Code, Users, Target, TrendingUp, Brain, Award, Star, BarChart3, DollarSign, Lightbulb, Zap, Trophy } from 'lucide-react';
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
    
    // Check if LinkedIn URL is provided before starting analysis
    if (!linkedinUrl || !linkedinUrl.includes('linkedin.com')) {
      toast.info('CV uploaded! Please add your LinkedIn profile URL to start comprehensive analysis.');
      return;
    }
    
    console.log('🎯 Starting comprehensive analysis with both CV and LinkedIn...');
    toast.success('CV uploaded! Starting comprehensive analysis with LinkedIn profile...');
    
    // Start analysis with LinkedIn URL
    await performCVAnalysis(
      selectedFile,
      setIsAnalyzing,
      setAnalysisProgress,
      setAnalysisResults,
      setFullName,
      setEmail,
      setPhoneNumber,
      setLinkedinUrl,
      linkedinUrl
    );
  };

  const handleLinkedInUrlChange = async (newUrl: string) => {
    setLinkedinUrl(newUrl);
    
    // If we have a file and valid LinkedIn URL, start/re-run analysis
    if (file && newUrl && newUrl.includes('linkedin.com')) {
      console.log('🔗 LinkedIn URL added/updated, starting comprehensive analysis...');
      toast.info('Starting comprehensive analysis with CV and LinkedIn profile...');
      
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
    } else if (file && newUrl && !newUrl.includes('linkedin.com')) {
      toast.warning('Please enter a valid LinkedIn URL to start comprehensive analysis');
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
    navigate('/matchwiseai'); // Changed from '/dashboard' to '/matchwiseai'
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
          </div>

          {/* Enhanced Personalized Improvement Tips - Like the reference image */}
          <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50/30 mb-8">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
              <CardTitle className="flex items-center gap-2 text-xl">
                <TrendingUp className="h-6 w-6 text-green-600" />
                Personalized Improvement Tips
              </CardTitle>
              <CardDescription className="text-gray-600">
                Based on your CV and LinkedIn analysis, here are specific recommendations to enhance your profile
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-8">
                {/* CV Improvements Section */}
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-blue-800 mb-4">
                    <Award className="h-5 w-5" />
                    CV Improvements
                  </h3>
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-red-100 text-red-800 border-red-200">High</Badge>
                        <span className="font-semibold text-blue-900">Technical Skills</span>
                      </div>
                      <p className="text-gray-700 text-sm mb-2">
                        Add a dedicated "Technical Skills" section with clear skill levels (Expert, Proficient, Familiar).
                      </p>
                      <p className="text-blue-700 text-xs font-medium">
                        Action: Create sections: "Expert: [languages]", "Proficient: [frameworks]", "Tools: [platforms]"
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-red-100 text-red-800 border-red-200">High</Badge>
                        <span className="font-semibold text-blue-900">Work Experience</span>
                      </div>
                      <p className="text-gray-700 text-sm mb-2">
                        Expand your work experience with specific achievements, technologies used and measurable results.
                      </p>
                      <p className="text-blue-700 text-xs font-medium">
                        Action: For each role, add: Used technologies, Key achievements with numbers, Team collaboration examples
                      </p>
                    </div>
                  </div>
                </div>

                {/* LinkedIn Improvements Section */}
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-purple-800 mb-4">
                    <Brain className="h-5 w-5" />
                    LinkedIn Improvements
                  </h3>
                  <div className="space-y-4">
                    <div className="border-l-4 border-purple-500 bg-purple-50 p-4 rounded-r-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-red-100 text-red-800 border-red-200">High</Badge>
                        <span className="font-semibold text-purple-900">LinkedIn Profile</span>
                      </div>
                      <p className="text-gray-700 text-sm mb-2">
                        Ensure your LinkedIn profile is public and complete.
                      </p>
                      <p className="text-purple-700 text-xs font-medium">
                        Action: Update: Professional headline, Detailed work experience, Skills section, Public profile settings
                      </p>
                    </div>
                  </div>
                </div>

                {/* Overall Strategy Section */}
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-green-800 mb-4">
                    <Target className="h-5 w-5" />
                    Overall Strategy
                  </h3>
                  <div className="space-y-4">
                    <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
                      <div className="flex items-center gap-3">
                        <Star className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-red-100 text-red-800 border-red-200">High</Badge>
                            <span className="font-semibold text-green-900">Consistent Professional Brand</span>
                          </div>
                          <p className="text-gray-700 text-sm mb-2">
                            Ensure your CV and LinkedIn tell the same professional story.
                          </p>
                          <p className="text-green-700 text-xs font-medium">
                            Action: Match: Job titles and dates, Skills and technologies, Professional summary, Achievements
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
                      <div className="flex items-center gap-3">
                        <Star className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-orange-100 text-orange-800 border-orange-200">Medium</Badge>
                            <span className="font-semibold text-green-900">Consultant Positioning</span>
                          </div>
                          <p className="text-gray-700 text-sm mb-2">
                            Position yourself clearly as a consultant through project-based work emphasis.
                          </p>
                          <p className="text-green-700 text-xs font-medium">
                            Action: Highlight: Consultant experience, Specialized skills, Availability for projects
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

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
            to receive detailed insights including analysis of your recent posts and professional bio.
          </p>

          {/* Feature highlights */}
          <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Code className="h-4 w-4 text-purple-500" />
              Technical Expertise
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4 text-blue-500" />
              LinkedIn Analysis
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

          {/* Requirements Notice - Shortened */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-2xl mx-auto mb-8">
            <p className="text-amber-800 text-sm">
              <strong>Requirements:</strong> Both CV file and LinkedIn profile URL are required for complete analysis.
            </p>
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
