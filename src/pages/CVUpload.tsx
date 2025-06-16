
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, FileText, CheckCircle2, ArrowRight, Code, Users, Target, TrendingUp, Brain, Award, Star } from 'lucide-react';
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
  const navigate = useNavigate();

  // Auto-start analysis when CV and LinkedIn URL are available
  useEffect(() => {
    if (file && linkedinUrl && fullName && email && !isAnalyzing && !uploadComplete) {
      startAnalysis();
    }
  }, [file, linkedinUrl, fullName, email]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf' || selectedFile.type.startsWith('image/')) {
        setFile(selectedFile);
        toast.success('CV uploaded! Analysis will start automatically when all fields are filled.');
      } else {
        toast.error('Please upload a PDF file or image');
      }
    }
  };

  const startAnalysis = async () => {
    if (!file || !linkedinUrl || !fullName || !email) return;

    setIsAnalyzing(true);
    toast.info('Starting comprehensive analysis...');

    try {
      // Convert file to base64
      const fileBuffer = await file.arrayBuffer();
      const fileBase64 = btoa(String.fromCharCode(...new Uint8Array(fileBuffer)));

      console.log('Sending CV for parsing...');
      
      // Call the parse-cv edge function
      const { data: parseData, error: parseError } = await supabase.functions.invoke('parse-cv', {
        body: {
          file: fileBase64,
          fileName: file.name,
          fileType: file.type,
          email,
          fullName,
          phoneNumber,
          linkedinUrl
        }
      });

      if (parseError) {
        console.error('Parse error:', parseError);
        throw parseError;
      }

      console.log('CV parsed successfully:', parseData);
      
      // Call LinkedIn analysis
      let linkedinAnalysis = null;
      try {
        console.log('Analyzing LinkedIn profile...');
        const { data: linkedinData, error: linkedinError } = await supabase.functions.invoke('analyze-linkedin', {
          body: {
            linkedinUrl,
            fullName,
            email
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

      // Set analysis results for display
      setAnalysisResults({
        cvAnalysis: parseData.analysis,
        linkedinAnalysis: linkedinAnalysis
      });

      toast.success('Analysis complete! Review your comprehensive profile below.');

    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!file || !email || !fullName || !linkedinUrl || !agreeToTerms) {
      toast.error('Please fill in all required fields, upload a file, add LinkedIn URL, and agree to terms');
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
        experience_years: analysisResults.cvAnalysis?.professionalSummary?.yearsOfExperience?.replace(/\D/g, '') || 0,
        hourly_rate: analysisResults.cvAnalysis?.marketPositioning?.salaryBenchmarks?.stockholm?.replace(/\D/g, '') || null,
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
        type: 'new',
        // Store complete analysis data
        cv_analysis: analysisResults.cvAnalysis,
        linkedin_analysis: analysisResults.linkedinAnalysis
      };

      const { data: insertData, error: insertError } = await supabase
        .from('consultants')
        .insert(consultantData);

      if (insertError) {
        console.error('Insert error:', insertError);
        throw insertError;
      }

      console.log('Consultant saved to database:', insertData);

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
      toast.success('Profile saved successfully! You are now part of our consultant network.');

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
                Analysis Complete!
              </CardTitle>
              <CardDescription>
                Din CV och LinkedIn-profil har analyserats och du är nu del av vårt konsultnätverk. Här är din omfattande professionella analys:
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Comprehensive Analysis Results */}
          <div className="space-y-6">
            {/* Professional Summary */}
            {cvAnalysis?.professionalSummary && (
              <Card className="shadow-lg">
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
                      <span className="text-sm text-gray-600">Career Trajectory:</span>
                      <p className="font-semibold text-green-600">{cvAnalysis.professionalSummary.careerTrajectory}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Current Role:</span>
                      <p className="font-semibold">{cvAnalysis.professionalSummary.currentRole}</p>
                    </div>
                  </div>
                  
                  {cvAnalysis.professionalSummary.specializations && (
                    <div>
                      <span className="text-sm text-gray-600">Specializations:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {cvAnalysis.professionalSummary.specializations.map((spec: string, idx: number) => (
                          <Badge key={idx} className="bg-blue-100 text-blue-800">{spec}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
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
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    {cvAnalysis.technicalExpertise.programmingLanguages?.expert && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">Expert Level:</span>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {cvAnalysis.technicalExpertise.programmingLanguages.expert.map((skill: string, idx: number) => (
                            <Badge key={idx} className="bg-green-100 text-green-800 text-xs">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {cvAnalysis.technicalExpertise.programmingLanguages?.proficient && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">Proficient:</span>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {cvAnalysis.technicalExpertise.programmingLanguages.proficient.map((skill: string, idx: number) => (
                            <Badge key={idx} className="bg-blue-100 text-blue-800 text-xs">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {cvAnalysis.technicalExpertise.programmingLanguages?.familiar && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">Familiar:</span>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {cvAnalysis.technicalExpertise.programmingLanguages.familiar.map((skill: string, idx: number) => (
                            <Badge key={idx} className="bg-gray-100 text-gray-800 text-xs">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {cvAnalysis.technicalExpertise.cloudAndInfrastructure?.platforms && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Cloud & Infrastructure:</span>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {cvAnalysis.technicalExpertise.cloudAndInfrastructure.platforms.map((platform: string, idx: number) => (
                          <Badge key={idx} className="bg-orange-100 text-orange-800 text-xs">{platform}</Badge>
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
                    <Brain className="h-5 w-5 text-blue-600" />
                    LinkedIn Leadership & Communication Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Communication Style:</span>
                      <p className="font-semibold">{linkedinAnalysis.communicationStyle}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Leadership Style:</span>
                      <p className="font-semibold">{linkedinAnalysis.leadershipStyle}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Problem Solving:</span>
                      <p className="font-semibold">{linkedinAnalysis.problemSolving}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Business Acumen:</span>
                      <p className="font-semibold">{linkedinAnalysis.businessAcumen}</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 mt-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm text-gray-600">Cultural Fit</span>
                      <div className="flex items-center justify-center mt-2">
                        <Progress value={(linkedinAnalysis.culturalFit / 5) * 100} className="w-16 h-2" />
                        <span className="ml-2 text-sm font-bold">{linkedinAnalysis.culturalFit}/5</span>
                      </div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm text-gray-600">Leadership</span>
                      <div className="flex items-center justify-center mt-2">
                        <Progress value={(linkedinAnalysis.leadership / 5) * 100} className="w-16 h-2" />
                        <span className="ml-2 text-sm font-bold">{linkedinAnalysis.leadership}/5</span>
                      </div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm text-gray-600">Innovation</span>
                      <div className="flex items-center justify-center mt-2">
                        <Progress value={(linkedinAnalysis.innovation / 5) * 100} className="w-16 h-2" />
                        <span className="ml-2 text-sm font-bold">{linkedinAnalysis.innovation}/5</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Strengths Analysis */}
            {cvAnalysis?.detailedStrengthsAnalysis && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Key Strengths & Market Position
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cvAnalysis.detailedStrengthsAnalysis.slice(0, 3).map((strength: any, idx: number) => (
                    <div key={idx} className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-semibold text-green-700">{strength.category}</h4>
                      <p className="text-sm text-gray-600 mt-1">{strength.description}</p>
                      <div className="mt-2">
                        <span className="text-xs text-gray-500">Market Value: </span>
                        <span className="text-xs font-medium">{strength.marketValue}</span>
                      </div>
                    </div>
                  ))}
                  
                  {cvAnalysis.marketPositioning && (
                    <div className="bg-green-50 p-4 rounded-lg mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-semibold">Market Positioning</span>
                      </div>
                      <p className="text-sm text-gray-700">{cvAnalysis.marketPositioning.uniqueValueProposition}</p>
                      <div className="mt-2">
                        <span className="text-xs text-gray-600">Competitiveness: </span>
                        <span className="text-xs font-semibold text-green-600">{cvAnalysis.marketPositioning.competitiveness}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Improvement Areas */}
            {cvAnalysis?.comprehensiveImprovementAreas && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-orange-500" />
                    Development Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cvAnalysis.comprehensiveImprovementAreas.slice(0, 3).map((area: any, idx: number) => (
                    <div key={idx} className="border border-orange-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-orange-700">{area.area}</h4>
                        <Badge className={`text-xs ${
                          area.improvementPriority === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {area.improvementPriority} Priority
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{area.currentState}</p>
                      <div className="text-xs text-gray-500">
                        <span className="font-medium">Expected Impact: </span>
                        {area.expectedImpact}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        <span className="font-medium">Timeline: </span>
                        {area.timeToImplement}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Salary Benchmarks */}
            {cvAnalysis?.marketPositioning?.salaryBenchmarks && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-purple-500" />
                    Salary Benchmarks & Career Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600">Stockholm Market</p>
                      <p className="font-bold text-lg text-blue-600">{cvAnalysis.marketPositioning.salaryBenchmarks.stockholm}</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600">European Tech</p>
                      <p className="font-bold text-lg text-green-600">{cvAnalysis.marketPositioning.salaryBenchmarks.europeanTech}</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-gray-600">Remote Global</p>
                      <p className="font-bold text-lg text-purple-600">{cvAnalysis.marketPositioning.salaryBenchmarks.remoteGlobal}</p>
                    </div>
                  </div>

                  {cvAnalysis.marketPositioning.targetRoles && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Target Roles:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {cvAnalysis.marketPositioning.targetRoles.slice(0, 6).map((role: string, idx: number) => (
                          <Badge key={idx} className="bg-purple-100 text-purple-800 text-xs">{role}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Action Button */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Vi har skickat en välkomstmail till {email} med nästa steg.
              </p>
              <Button onClick={handleContinue} className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3">
                Continue to Pricing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
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
          
          {/* Feature Icons */}
          <div className="flex justify-center space-x-8 mb-12">
            <div className="flex items-center text-gray-600">
              <Code className="h-5 w-5 mr-2 text-blue-500" />
              <span className="text-sm">Technical Expertise</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="h-5 w-5 mr-2 text-green-500" />
              <span className="text-sm">Leadership Analysis</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Target className="h-5 w-5 mr-2 text-orange-500" />
              <span className="text-sm">Career Strategy</span>
            </div>
            <div className="flex items-center text-gray-600">
              <TrendingUp className="h-5 w-5 mr-2 text-purple-500" />
              <span className="text-sm">Market Positioning</span>
            </div>
          </div>
        </div>

        {/* Analysis Status */}
        {isAnalyzing && (
          <Card className="max-w-2xl mx-auto mb-8 shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold mb-2">Analyzing Your Profile...</h3>
              <p className="text-gray-600">
                Vårt AI system analyserar ditt CV och LinkedIn-profil för att ge dig djupgående insikter.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Analysis Results Preview */}
        {analysisResults && !uploadComplete && (
          <div className="max-w-4xl mx-auto mb-8">
            <Card className="shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-xl text-green-600">Analysis Complete!</CardTitle>
                <CardDescription>
                  Här är en förhandsvisning av din analys. Fyll i resterande information och acceptera villkoren för att spara din profil.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Quick Preview */}
                {analysisResults.cvAnalysis?.professionalSummary && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Professional Summary</h4>
                    <p className="text-sm text-blue-700">
                      {analysisResults.cvAnalysis.professionalSummary.seniorityLevel} • {analysisResults.cvAnalysis.professionalSummary.yearsOfExperience} • {analysisResults.cvAnalysis.professionalSummary.currentRole}
                    </p>
                  </div>
                )}
                
                {analysisResults.cvAnalysis?.technicalExpertise?.programmingLanguages?.expert && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Expert Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {analysisResults.cvAnalysis.technicalExpertise.programmingLanguages.expert.slice(0, 5).map((skill: string, idx: number) => (
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
                          <p className="text-sm text-gray-500">Click to change file</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                        <div>
                          <p className="text-base font-medium text-gray-700 mb-1">
                            Välj fil
                          </p>
                          <p className="text-sm text-gray-500">
                            ingen fil vald
                          </p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="fullName" className="text-base font-medium flex items-center">
                    Full Name <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
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
                    placeholder="your@email.com"
                    className="h-12"
                    required
                  />
                </div>
              </div>

              {/* LinkedIn Profile Section */}
              <div className="space-y-3">
                <Label htmlFor="linkedin" className="text-base font-medium flex items-center">
                  LinkedIn Profile URL <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="linkedin"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="h-12"
                  required
                />
                <p className="text-xs text-gray-500">
                  Analysis will start automatically when all required fields are filled
                </p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="phone" className="text-base font-medium">Phone</Label>
                <Input
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+46 70 123 45 67"
                  className="h-12"
                />
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
                    <span className="font-medium">I agree to data storage</span>
                  </Label>
                  <p className="mt-1">
                    I consent to MatchWise storing and processing my personal information, CV data, 
                    and LinkedIn information for matching purposes. Data is used only to connect me 
                    with relevant assignments and can be deleted upon request.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-14 text-lg bg-purple-600 hover:bg-purple-700" 
                disabled={isUploading || !file || !email || !fullName || !linkedinUrl || !agreeToTerms || !analysisResults}
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Saving Profile...
                  </>
                ) : analysisResults ? (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Save Profile & Join Network
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-5 w-5" />
                    Complete Analysis First
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
