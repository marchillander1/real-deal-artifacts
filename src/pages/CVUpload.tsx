
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, FileText, CheckCircle2, ArrowRight, Code, Users, Target, TrendingUp, Brain, Award, Star, Loader2 } from 'lucide-react';
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

  // Auto-start analysis immediately when CV is uploaded
  useEffect(() => {
    if (file && !isAnalyzing && !analysisResults) {
      console.log('Starting automatic analysis for uploaded CV...');
      startAnalysis();
    }
  }, [file]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf' || selectedFile.type.startsWith('image/')) {
        setFile(selectedFile);
        setAnalysisResults(null);
        toast.success('CV uploaded! Starting AI analysis...');
      } else {
        toast.error('Please upload a PDF file or image');
      }
    }
  };

  const startAnalysis = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setAnalysisProgress(10);
    toast.info('🧠 AI is analyzing your CV and extracting professional information...');

    try {
      // Convert file to base64
      const fileBuffer = await file.arrayBuffer();
      const fileBase64 = btoa(String.fromCharCode(...new Uint8Array(fileBuffer)));

      console.log('Sending CV for parsing...');
      setAnalysisProgress(30);
      
      // Call the parse-cv edge function
      const { data: parseData, error: parseError } = await supabase.functions.invoke('parse-cv', {
        body: {
          file: fileBase64,
          fileName: file.name,
          fileType: file.type
        }
      });

      if (parseError) {
        console.error('Parse error:', parseError);
        throw parseError;
      }

      console.log('CV parsed successfully:', parseData);
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
          // Ensure it's a full URL
          const linkedinProfile = personalInfo.linkedinProfile.startsWith('http') 
            ? personalInfo.linkedinProfile 
            : `https://linkedin.com/in/${personalInfo.linkedinProfile}`;
          setLinkedinUrl(linkedinProfile);
          console.log('Auto-filled LinkedIn:', linkedinProfile);
        }
      }

      setAnalysisProgress(80);

      // Call LinkedIn analysis if LinkedIn URL is available
      let linkedinAnalysis = null;
      const linkedinToAnalyze = linkedinUrl || parseData.analysis?.personalInfo?.linkedinProfile;
      
      if (linkedinToAnalyze) {
        try {
          console.log('Analyzing LinkedIn profile...', linkedinToAnalyze);
          const { data: linkedinData, error: linkedinError } = await supabase.functions.invoke('analyze-linkedin', {
            body: {
              linkedinUrl: linkedinToAnalyze,
              fullName: fullName || parseData.analysis?.personalInfo?.name || 'Unknown',
              email: email || parseData.analysis?.personalInfo?.email || 'unknown@email.com'
            }
          });

          if (linkedinError) {
            console.warn('LinkedIn analysis error:', linkedinError);
          } else {
            linkedinAnalysis = linkedinData?.analysis;
            console.log('LinkedIn analysis completed:', linkedinAnalysis);
          }
        } catch (linkedinErr) {
          console.warn('LinkedIn analysis failed:', linkedinErr);
        }
      }

      setAnalysisProgress(100);

      // Set analysis results for immediate display
      const completeAnalysis = {
        cvAnalysis: parseData.analysis,
        linkedinAnalysis: linkedinAnalysis
      };
      
      setAnalysisResults(completeAnalysis);
      
      toast.success('🎉 Analysis complete! Your professional profile has been analyzed. Review and join our network.');

    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!file || !email || !fullName || !agreeToTerms) {
      toast.error('Please fill in all required fields, upload a file, and agree to terms');
      return;
    }

    if (!analysisResults) {
      toast.error('Please wait for analysis to complete');
      return;
    }

    setIsUploading(true);

    try {
      // Save to database with comprehensive analysis data
      const consultantData = {
        name: fullName,
        email: email,
        phone: phoneNumber || null,
        linkedin_url: linkedinUrl || null,
        skills: analysisResults.cvAnalysis?.technicalExpertise?.programmingLanguages?.expert || [],
        experience_years: parseInt(analysisResults.cvAnalysis?.professionalSummary?.yearsOfExperience?.replace(/\D/g, '') || '0'),
        hourly_rate: parseInt(analysisResults.cvAnalysis?.marketPositioning?.salaryBenchmarks?.stockholm?.replace(/\D/g, '') || '0'),
        location: analysisResults.cvAnalysis?.personalInfo?.location || 'Sweden',
        availability: 'Available',
        cv_file_path: `cv_${Date.now()}_${file.name}`,
        communication_style: analysisResults.linkedinAnalysis?.communicationStyle || analysisResults.cvAnalysis?.softSkills?.communication?.[0] || 'Professional',
        work_style: analysisResults.cvAnalysis?.workPreferences?.workStyle || 'Collaborative',
        values: analysisResults.cvAnalysis?.softSkills?.leadership || [],
        personality_traits: analysisResults.cvAnalysis?.softSkills?.problemSolving || [],
        cultural_fit: analysisResults.linkedinAnalysis?.culturalFit || 5,
        leadership: analysisResults.linkedinAnalysis?.leadership || (analysisResults.cvAnalysis?.professionalSummary?.seniorityLevel === 'Senior' ? 4 : 3),
        certifications: analysisResults.cvAnalysis?.certifications?.development || [],
        roles: analysisResults.cvAnalysis?.marketPositioning?.targetRoles?.slice(0, 3) || [analysisResults.cvAnalysis?.professionalSummary?.currentRole || 'Software Developer'],
        type: 'new'
      };

      console.log('Saving consultant data:', consultantData);

      const { data: insertData, error: insertError } = await supabase
        .from('consultants')
        .insert(consultantData);

      if (insertError) {
        console.error('Insert error:', insertError);
        throw insertError;
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
      toast.success('🎉 Profile saved! You are now part of our consultant network and can receive assignments.');

    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleContinue = () => {
    navigate('/pricing');
  };

  if (uploadComplete && analysisResults) {
    const cvAnalysis = analysisResults.cvAnalysis;
    const linkedinAnalysis = analysisResults.linkedinAnalysis;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="container mx-auto max-w-4xl">
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
                Your profile has been analyzed and you're now part of our network. You can now receive matching assignments based on your skills and experience.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Professional Summary */}
          {cvAnalysis?.professionalSummary && (
            <Card className="shadow-lg mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Professional Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Seniority Level:</span>
                    <p className="font-semibold">{cvAnalysis.professionalSummary.seniorityLevel}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Years of Experience:</span>
                    <p className="font-semibold">{cvAnalysis.professionalSummary.yearsOfExperience}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Current Role:</span>
                    <p className="font-semibold">{cvAnalysis.professionalSummary.currentRole}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Career Trajectory:</span>
                    <p className="font-semibold text-green-600">{cvAnalysis.professionalSummary.careerTrajectory}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Technical Skills */}
          {cvAnalysis?.technicalExpertise && (
            <Card className="shadow-lg mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-purple-500" />
                  Technical Skills
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

          {/* Next Steps */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              A welcome email has been sent to {email} with next steps. You can now explore our pricing options.
            </p>
            <Button onClick={handleContinue} className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3">
              Continue to Pricing
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
            AI-Powered Instant CV Analysis
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Join Our Consultant Network
          </h1>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Upload your CV for instant AI analysis and join our exclusive consultant network. 
            Get matched with relevant assignments based on your skills and experience.
          </p>
        </div>

        {/* Analysis in Progress */}
        {isAnalyzing && (
          <Card className="max-w-2xl mx-auto mb-8 shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-4">Analyzing Your CV...</h3>
              <Progress value={analysisProgress} className="w-full mb-4" />
              <p className="text-gray-600">
                Our AI is analyzing your CV, extracting skills, experience, and creating your professional profile.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Analysis Results Preview */}
        {analysisResults && !uploadComplete && (
          <div className="max-w-4xl mx-auto mb-8">
            <Card className="shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-xl text-green-600 flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-6 w-6" />
                  Analysis Complete!
                </CardTitle>
                <CardDescription>
                  Your CV has been analyzed successfully. Complete the form below to join our network.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Quick Preview */}
                {analysisResults.cvAnalysis?.professionalSummary && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Professional Summary</h4>
                    <p className="text-sm text-blue-700">
                      {analysisResults.cvAnalysis.professionalSummary.seniorityLevel} • 
                      {analysisResults.cvAnalysis.professionalSummary.yearsOfExperience} • 
                      {analysisResults.cvAnalysis.professionalSummary.currentRole}
                    </p>
                  </div>
                )}
                
                {analysisResults.cvAnalysis?.technicalExpertise?.programmingLanguages?.expert && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Expert Skills Detected</h4>
                    <div className="flex flex-wrap gap-1">
                      {analysisResults.cvAnalysis.technicalExpertise.programmingLanguages.expert.slice(0, 6).map((skill: string, idx: number) => (
                        <Badge key={idx} className="bg-green-100 text-green-800 text-xs">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Form Card */}
        <Card className="max-w-2xl mx-auto shadow-xl">
          <CardHeader className="text-center border-b">
            <div className="flex items-center justify-center mb-4">
              <Upload className="h-6 w-6 mr-2 text-purple-600" />
              <CardTitle className="text-xl font-semibold">Upload Your CV</CardTitle>
            </div>
            <CardDescription className="text-gray-600">
              Information will be automatically extracted from your CV
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
                            PDF or image format - Analysis starts automatically
                          </p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Personal Information - Auto-populated from CV */}
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
                  <Label htmlFor="linkedin" className="text-base font-medium">LinkedIn Profile</Label>
                  <Input
                    id="linkedin"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="Auto-filled from CV"
                    className="h-12"
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
                    <span className="font-medium">I agree to join the consultant network</span>
                  </Label>
                  <p className="mt-1">
                    I consent to MatchWise storing and processing my information for consultant matching purposes. 
                    This allows me to receive relevant assignment opportunities based on my skills and experience.
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
                    Saving Profile...
                  </>
                ) : isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing CV...
                  </>
                ) : analysisResults ? (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Join Consultant Network
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-5 w-5" />
                    Upload CV to Start
                  </>
                )}
              </Button>
              
              {file && !analysisResults && !isAnalyzing && (
                <p className="text-center text-sm text-gray-500">
                  Analysis will start automatically when you upload your CV
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
