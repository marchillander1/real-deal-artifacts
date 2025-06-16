import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight, Code, Users, Target, TrendingUp, Brain, Award, Star, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Logo from '@/components/Logo';
import { Badge } from '@/components/ui/badge';
import { CVUploadForm } from '@/components/CVUploadForm';
import { AnalysisResults } from '@/components/AnalysisResults';
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
                Välkommen till vårt konsultnätverk!
              </CardTitle>
              <CardDescription>
                Din profil har analyserats och du är nu synlig i vårt konsultnätverk på /dashboard.
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
                    Professionell Profil
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Nivå:</span>
                      <p className="font-semibold">{cvAnalysis.professionalSummary.seniorityLevel}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Erfarenhet:</span>
                      <p className="font-semibold">{cvAnalysis.professionalSummary.yearsOfExperience}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Roll:</span>
                      <p className="font-semibold">{cvAnalysis.professionalSummary.currentRole}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Karriärutveckling:</span>
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
                    Teknisk Expertis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {cvAnalysis.technicalExpertise.programmingLanguages?.expert && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Expert färdigheter:</span>
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
                    LinkedIn Analys
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Kommunikationsstil:</span>
                      <p className="font-semibold">{linkedinAnalysis.communicationStyle}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Ledarskapsansats:</span>
                      <p className="font-semibold">{linkedinAnalysis.leadershipStyle}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      <div className="text-center">
                        <p className="text-xs text-gray-600">Kulturell Passform</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div className="bg-blue-600 h-2 rounded-full" style={{width: `${(linkedinAnalysis.culturalFit/5)*100}%`}}></div>
                        </div>
                        <p className="text-xs font-bold text-blue-600 mt-1">{linkedinAnalysis.culturalFit}/5</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-600">Ledarskap</p>
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
                    Förbättringstips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* CV Tips */}
                    <div>
                      <h4 className="font-semibold text-lg mb-3">CV Förbättringar</h4>
                      <div className="space-y-3">
                        {improvementTips.cvTips.map((tip: any, idx: number) => (
                          <div key={idx} className="border-l-4 border-blue-500 pl-4">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant={tip.priority === 'High' ? 'destructive' : 'secondary'}>
                                {tip.priority}
                              </Badge>
                              <span className="font-medium">{tip.category}</span>
                            </div>
                            <p className="text-sm text-gray-600">{tip.tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* LinkedIn Tips */}
                    <div>
                      <h4 className="font-semibold text-lg mb-3">LinkedIn Förbättringar</h4>
                      <div className="space-y-3">
                        {improvementTips.linkedinTips.map((tip: any, idx: number) => (
                          <div key={idx} className="border-l-4 border-purple-500 pl-4">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant={tip.priority === 'High' ? 'destructive' : 'secondary'}>
                                {tip.priority}
                              </Badge>
                              <span className="font-medium">{tip.category}</span>
                            </div>
                            <p className="text-sm text-gray-600">{tip.tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Overall Strategy */}
                  <div className="mt-6">
                    <h4 className="font-semibold text-lg mb-3">Övergripande Strategi</h4>
                    <div className="space-y-2">
                      {improvementTips.overallStrategy.map((tip: any, idx: number) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                          <Star className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <span className="font-medium text-green-800">{tip.category}: </span>
                            <span className="text-green-700">{tip.tip}</span>
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
              Ett välkomstmail har skickats till {email}. Din profil är nu synlig i konsultnätverket.
            </p>
            <Button onClick={handleContinue} className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3">
              Gå till Plattformen
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
            AI-Driven Omfattande Karriäranalys
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Ladda upp ditt CV & LinkedIn Profil
          </h1>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Få omedelbar omfattande AI-analys av dina tekniska färdigheter, ledarskapsförmåga, 
            personlighet och karriärpotential. Ladda upp ditt CV och lägg till din LinkedIn-profil 
            för att få detaljerade insikter och bli synlig i vårt konsultnätverk.
          </p>

          {/* Feature highlights */}
          <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Code className="h-4 w-4 text-purple-500" />
              Teknisk Expertis
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4 text-blue-500" />
              Ledarskapsanalys
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Target className="h-4 w-4 text-orange-500" />
              Förbättringstips
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <BarChart3 className="h-4 w-4 text-green-500" />
              Marknadspositionering
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

          {/* Right Column - Analysis Results */}
          <div className="space-y-6">
            <AnalysisResults
              analysisResults={analysisResults}
              isAnalyzing={isAnalyzing}
              analysisProgress={analysisProgress}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
