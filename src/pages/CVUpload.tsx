
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
      console.log('Startar automatisk analys av laddat CV...');
      startAnalysis();
    }
  }, [file]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf' || selectedFile.type.startsWith('image/')) {
        setFile(selectedFile);
        setAnalysisResults(null);
        toast.success('CV uppladdat! Startar AI-analys...');
      } else {
        toast.error('Vänligen ladda upp en PDF-fil eller bild');
      }
    }
  };

  const startAnalysis = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setAnalysisProgress(10);
    toast.info('🧠 AI analyserar ditt CV och extraherar professionell information...');

    try {
      // Convert file to base64
      const fileBuffer = await file.arrayBuffer();
      const fileBase64 = btoa(String.fromCharCode(...new Uint8Array(fileBuffer)));

      console.log('Skickar CV för parsing...');
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

      console.log('CV analyserat framgångsrikt:', parseData);
      setAnalysisProgress(60);
      
      // Auto-populate form fields from CV analysis
      if (parseData.analysis?.personalInfo) {
        const personalInfo = parseData.analysis.personalInfo;
        
        if (personalInfo.name && !fullName) {
          setFullName(personalInfo.name);
          console.log('Auto-fyllde namn:', personalInfo.name);
        }
        if (personalInfo.email && !email) {
          setEmail(personalInfo.email);
          console.log('Auto-fyllde email:', personalInfo.email);
        }
        if (personalInfo.phone && !phoneNumber) {
          setPhoneNumber(personalInfo.phone);
          console.log('Auto-fyllde telefon:', personalInfo.phone);
        }
        if (personalInfo.linkedinProfile && !linkedinUrl) {
          // Ensure it's a full URL
          const linkedinProfile = personalInfo.linkedinProfile.startsWith('http') 
            ? personalInfo.linkedinProfile 
            : `https://linkedin.com/in/${personalInfo.linkedinProfile}`;
          setLinkedinUrl(linkedinProfile);
          console.log('Auto-fyllde LinkedIn:', linkedinProfile);
        }
      }

      setAnalysisProgress(80);

      // Call LinkedIn analysis if LinkedIn URL is available
      let linkedinAnalysis = null;
      const linkedinToAnalyze = linkedinUrl || parseData.analysis?.personalInfo?.linkedinProfile;
      
      if (linkedinToAnalyze) {
        try {
          console.log('Analyserar LinkedIn-profil...', linkedinToAnalyze);
          const { data: linkedinData, error: linkedinError } = await supabase.functions.invoke('analyze-linkedin', {
            body: {
              linkedinUrl: linkedinToAnalyze,
              fullName: fullName || parseData.analysis?.personalInfo?.name || 'Okänd',
              email: email || parseData.analysis?.personalInfo?.email || 'unknown@email.com'
            }
          });

          if (linkedinError) {
            console.warn('LinkedIn-analysfel:', linkedinError);
          } else {
            linkedinAnalysis = linkedinData?.analysis;
            console.log('LinkedIn-analys slutförd:', linkedinAnalysis);
          }
        } catch (linkedinErr) {
          console.warn('LinkedIn-analys misslyckades:', linkedinErr);
        }
      }

      setAnalysisProgress(100);

      // Set analysis results for immediate display
      const completeAnalysis = {
        cvAnalysis: parseData.analysis,
        linkedinAnalysis: linkedinAnalysis
      };
      
      setAnalysisResults(completeAnalysis);
      
      toast.success('🎉 Analys slutförd! Din professionella profil har analyserats. Granska och gå med i vårt nätverk.');

    } catch (error) {
      console.error('Analysfel:', error);
      toast.error('Analys misslyckades. Vänligen försök igen.');
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!file || !email || !fullName || !agreeToTerms) {
      toast.error('Vänligen fyll i alla obligatoriska fält, ladda upp en fil och godkänn villkoren');
      return;
    }

    if (!analysisResults) {
      toast.error('Vänligen vänta tills analysen är klar');
      return;
    }

    setIsUploading(true);

    try {
      // Prepare comprehensive consultant data with full analysis integration
      const consultantData = {
        name: fullName,
        email: email,
        phone: phoneNumber || null,
        linkedin_url: linkedinUrl || null,
        skills: analysisResults.cvAnalysis?.technicalExpertise?.programmingLanguages?.expert || 
               analysisResults.cvAnalysis?.technicalExpertise?.programmingLanguages || [],
        experience_years: parseInt(analysisResults.cvAnalysis?.professionalSummary?.yearsOfExperience?.replace(/\D/g, '') || '0'),
        hourly_rate: parseInt(analysisResults.cvAnalysis?.marketPositioning?.salaryBenchmarks?.stockholm?.replace(/\D/g, '') || '800'),
        location: analysisResults.cvAnalysis?.personalInfo?.location || 'Sverige',
        availability: 'Tillgänglig nu',
        cv_file_path: `cv_${Date.now()}_${file.name}`,
        communication_style: analysisResults.linkedinAnalysis?.communicationStyle || 
                           analysisResults.cvAnalysis?.softSkills?.communication?.[0] || 
                           'Professionell och tydlig kommunikation',
        work_style: analysisResults.cvAnalysis?.workPreferences?.workStyle || 
                   'Systematisk och samarbetsinriktad',
        values: analysisResults.cvAnalysis?.softSkills?.leadership || 
               ['Innovation', 'Kvalitet', 'Samarbete', 'Kontinuerligt lärande'],
        personality_traits: analysisResults.cvAnalysis?.softSkills?.problemSolving || 
                          ['Analytisk', 'Lösningsorienterad', 'Kreativ', 'Samarbetsinriktad'],
        cultural_fit: analysisResults.linkedinAnalysis?.culturalFit || 5,
        leadership: analysisResults.linkedinAnalysis?.leadership || 
                   (analysisResults.cvAnalysis?.professionalSummary?.seniorityLevel === 'Senior' ? 4 : 3),
        certifications: analysisResults.cvAnalysis?.certifications?.development || 
                       analysisResults.cvAnalysis?.certifications || [],
        roles: analysisResults.cvAnalysis?.marketPositioning?.targetRoles?.slice(0, 3) || 
              [analysisResults.cvAnalysis?.professionalSummary?.currentRole || 'Systemutvecklare'],
        type: 'new',
        languages: analysisResults.cvAnalysis?.personalInfo?.languages || ['Svenska', 'Engelska'],
        team_fit: analysisResults.linkedinAnalysis?.teamCollaboration || 
                 'Stark samarbetspartner med fokus på kollektiv problemlösning',
        adaptability: 5,
        rating: 4.8,
        projects_completed: 0,
        last_active: 'Idag'
      };

      console.log('Sparar konsultdata med fullständig analys:', consultantData);

      const { data: insertData, error: insertError } = await supabase
        .from('consultants')
        .insert(consultantData);

      if (insertError) {
        console.error('Insättningsfel:', insertError);
        throw insertError;
      }

      console.log('Konsult sparad i databasen framgångsrikt');

      // Send welcome email
      try {
        const { error: emailError } = await supabase.functions.invoke('send-welcome-email', {
          body: {
            email,
            name: fullName
          }
        });
        
        if (emailError) {
          console.error('Välkomstmejlfel:', emailError);
        }
      } catch (emailErr) {
        console.error('Fel vid skickande av välkomstmejl:', emailErr);
      }

      setUploadComplete(true);
      toast.success('🎉 Profil sparad! Du är nu del av vårt konsultnätverk och kan ta emot uppdrag.');

    } catch (error) {
      console.error('Sparfel:', error);
      toast.error('Misslyckades med att spara profil. Vänligen försök igen.');
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
                Välkommen till vårt konsultnätverk!
              </CardTitle>
              <CardDescription>
                Din profil har analyserats och du är nu del av vårt nätverk. Du kan nu ta emot matchande uppdrag baserat på dina färdigheter och erfarenhet.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Professional Summary */}
          {cvAnalysis?.professionalSummary && (
            <Card className="shadow-lg mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Professionell sammanfattning
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Senioritetsnivå:</span>
                    <p className="font-semibold">{cvAnalysis.professionalSummary.seniorityLevel}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">År av erfarenhet:</span>
                    <p className="font-semibold">{cvAnalysis.professionalSummary.yearsOfExperience}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Nuvarande roll:</span>
                    <p className="font-semibold">{cvAnalysis.professionalSummary.currentRole}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Karriärbana:</span>
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
                  Tekniska färdigheter
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cvAnalysis.technicalExpertise.programmingLanguages?.expert && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Expertfärdigheter:</span>
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
              Ett välkomstmejl har skickats till {email} med nästa steg. Du kan nu utforska plattformen.
            </p>
            <Button onClick={handleContinue} className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3">
              Fortsätt till plattformen
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
            AI-driven omedelbar CV-analys
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Gå med i vårt konsultnätverk
          </h1>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Ladda upp ditt CV för omedelbar AI-analys och gå med i vårt exklusiva konsultnätverk. 
            Bli matchad med relevanta uppdrag baserat på dina färdigheter och erfarenhet.
          </p>
        </div>

        {/* Analysis in Progress */}
        {isAnalyzing && (
          <Card className="max-w-2xl mx-auto mb-8 shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-4">Analyserar ditt CV...</h3>
              <Progress value={analysisProgress} className="w-full mb-4" />
              <p className="text-gray-600">
                Vår AI analyserar ditt CV, extraherar färdigheter, erfarenhet och skapar din professionella profil.
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
                  Analys slutförd!
                </CardTitle>
                <CardDescription>
                  Ditt CV har analyserats framgångsrikt. Slutför formuläret nedan för att gå med i vårt nätverk.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Quick Preview */}
                {analysisResults.cvAnalysis?.professionalSummary && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Professionell sammanfattning</h4>
                    <p className="text-sm text-blue-700">
                      {analysisResults.cvAnalysis.professionalSummary.seniorityLevel} • 
                      {analysisResults.cvAnalysis.professionalSummary.yearsOfExperience} • 
                      {analysisResults.cvAnalysis.professionalSummary.currentRole}
                    </p>
                  </div>
                )}
                
                {analysisResults.cvAnalysis?.technicalExpertise?.programmingLanguages?.expert && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Upptäckta expertfärdigheter</h4>
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
              <CardTitle className="text-xl font-semibold">Ladda upp ditt CV</CardTitle>
            </div>
            <CardDescription className="text-gray-600">
              Information kommer automatiskt att extraheras från ditt CV
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* CV Upload Section */}
              <div className="space-y-3">
                <Label htmlFor="cv-upload" className="text-base font-medium flex items-center">
                  CV-fil <span className="text-red-500 ml-1">*</span>
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
                            {isAnalyzing ? 'Analyserar...' : analysisResults ? 'Analys slutförd' : 'Redo för analys'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                        <div>
                          <p className="text-base font-medium text-gray-700 mb-1">
                            Ladda upp ditt CV
                          </p>
                          <p className="text-sm text-gray-500">
                            PDF eller bildformat - Analys startar automatiskt
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
                    Fullständigt namn <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Auto-fylls från CV"
                    className="h-12"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-base font-medium flex items-center">
                    E-post <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Auto-fylls från CV"
                    className="h-12"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="phone" className="text-base font-medium">Telefon</Label>
                  <Input
                    id="phone"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Auto-fylls från CV"
                    className="h-12"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="linkedin" className="text-base font-medium">LinkedIn-profil</Label>
                  <Input
                    id="linkedin"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="Auto-fylls från CV"
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
                    <span className="font-medium">Jag godkänner att gå med i konsultnätverket</span>
                  </Label>
                  <p className="mt-1">
                    Jag samtycker till att MatchWise lagrar och behandlar min information för konsultmatchning. 
                    Detta gör att jag kan ta emot relevanta uppdragsmöjligheter baserat på mina färdigheter och erfarenhet.
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
                    Sparar profil...
                  </>
                ) : isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyserar CV...
                  </>
                ) : analysisResults ? (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Gå med i konsultnätverket
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-5 w-5" />
                    Ladda upp CV för att börja
                  </>
                )}
              </Button>
              
              {file && !analysisResults && !isAnalyzing && (
                <p className="text-center text-sm text-gray-500">
                  Analys startar automatiskt när du laddar upp ditt CV
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
