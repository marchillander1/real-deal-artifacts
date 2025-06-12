import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, User, Mail, Phone, MapPin, Calendar, Download, ExternalLink, Sparkles, TrendingUp, Target, Award, Brain, Building, Users, MessageCircle, Lightbulb, BarChart3, CheckCircle, AlertCircle, Plus, X, Star, Zap, Shield, Compass } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

interface EnhancedCVAnalysis {
  technicalStrengths: string[];
  improvementAreas: string[];
  cvScore: number;
  careerSummary: string;
  marketPositioning: {
    suitableRoles: string[];
    salaryRange: string;
    competitiveness: string;
    uniqueValue: string;
  };
  // CV-specific detailed analysis
  summary: string;
  strengths: string[];
  improvements: string[];
  marketValue: {
    targetRoles: string[];
    salaryBenchmarks: string;
    uniqueValueProposition: string;
  };
}

interface LinkedInAnalysis {
  networkStrength: number;
  contentQuality: number;
  professionalBranding: number;
  industryPresence: number;
  overallScore: number;
  recommendations: string[];
  insights: string;
  // Enhanced properties
  leadership: number;
  innovation: number;
  business: number;
  strategic: number;
  decisionMaking: string;
  growthAreas: string[];
  thoughtLeadership: number;
}

interface ConsultantProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  skills: string[];
  experienceYears: number;
  hourlyRate: number;
  availability: string;
  cvFilePath: string;
  communicationStyle: string;
}

const CVUpload: React.FC = () => {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [linkedinProfileUrl, setLinkedinProfileUrl] = useState('');
  const [cvAnalysis, setCvAnalysis] = useState<EnhancedCVAnalysis | null>(null);
  const [linkedinAnalysis, setLinkedinAnalysis] = useState<LinkedInAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<ConsultantProfile>({
    name: '',
    email: '',
    phone: '',
    location: '',
    skills: [],
    experienceYears: 0,
    hourlyRate: 0,
    availability: 'Available',
    cvFilePath: '',
    communicationStyle: '',
  });
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setCvFile(event.target.files[0]);
    }
  };

  const handleLinkedinUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLinkedinProfileUrl(event.target.value);
  };

  const handleUpload = async () => {
    if (!cvFile) {
      toast({
        title: "Fel",
        description: "Välj en CV-fil att ladda upp.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setCvAnalysis(null); // Clear previous analysis

    try {
      // 1. Upload file to Supabase storage
      const filePath = `cv-uploads/${Date.now()}-${cvFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('cv-storage')
        .upload(filePath, cvFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Filuppladdning misslyckades: ${uploadError.message}`);
      }

      // 2. Get public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('cv-storage')
        .getPublicUrl(filePath);

      // 3. Call function to analyze CV (replace with your actual function call)
      // const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-cv', {
      //   body: { fileUrl: publicUrl },
      // });

      // Mock analysis data for demonstration
      const analysisData = {
        technicalStrengths: ["React", "TypeScript", "Node.js", "GraphQL"],
        improvementAreas: ["Frontend performance optimization", "Backend scalability"],
        cvScore: 88,
        careerSummary: "Experienced full-stack developer with a passion for building scalable web applications.",
        marketPositioning: {
          suitableRoles: ["Senior Frontend Developer", "Full-Stack Engineer", "Technical Lead"],
          salaryRange: "50,000 - 65,000 SEK/month",
          competitiveness: "High demand for skilled React developers",
          uniqueValue: "Expertise in modern JavaScript frameworks and cloud technologies"
        },
        summary: "Driven and results-oriented software engineer with 7+ years of experience.",
        strengths: ["Problem-solving", "Team collaboration", "Continuous learning"],
        improvements: ["Public speaking", "Project management"],
        marketValue: {
          targetRoles: ["Software Architect", "Lead Developer"],
          salaryBenchmarks: "60,000 - 80,000 SEK/month",
          uniqueValueProposition: "Proven ability to lead technical teams and deliver high-quality software solutions"
        }
      };

      // if (analysisError) {
      //   throw new Error(`CV-analys misslyckades: ${analysisError.message}`);
      // }

      setCvAnalysis(analysisData as EnhancedCVAnalysis);

      // Update profileData with CV analysis results
      setProfileData(prevData => ({
        ...prevData,
        skills: analysisData.technicalStrengths || [],
        cvFilePath: publicUrl,
      }));

      toast({
        title: "CV uppladdat och analyserat!",
        description: "CV-analysen är klar och resultaten visas nedan.",
      });

    } catch (error: any) {
      toast({
        title: "Fel",
        description: error.message || "Något gick fel vid CV-analysen.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkedInAnalysis = async () => {
    if (!linkedinProfileUrl) {
      toast({
        title: "Fel",
        description: "Ange en LinkedIn-profil URL för att analysera.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setLinkedinAnalysis(null); // Clear previous analysis

    try {
      // Call function to analyze LinkedIn profile (replace with your actual function call)
      // const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-linkedin', {
      //   body: { profileUrl: linkedinProfileUrl },
      // });

      // Mock analysis data for demonstration
      const analysisData = {
        networkStrength: 92,
        contentQuality: 85,
        professionalBranding: 90,
        industryPresence: 88,
        overallScore: 89,
        recommendations: ["Erik has a strong work ethic and is a valuable team player.", "Maria is a highly skilled and dedicated professional."],
        insights: "Your LinkedIn profile showcases a strong professional brand and active engagement in the industry.",
        leadership: 4,
        innovation: 5,
        business: 4,
        strategic: 4,
        decisionMaking: "Data-driven and collaborative",
        growthAreas: ["Public speaking", "Negotiation skills"],
        thoughtLeadership: 4
      };

      // if (analysisError) {
      //   throw new Error(`LinkedIn-analys misslyckades: ${analysisError.message}`);
      // }

      setLinkedinAnalysis(analysisData as LinkedInAnalysis);

      toast({
        title: "LinkedIn-profil analyseras!",
        description: "LinkedIn-analysen är klar och resultaten visas nedan.",
      });

    } catch (error: any) {
      toast({
        title: "Fel",
        description: error.message || "Något gick fel vid LinkedIn-analysen.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset the file input
    }
    setCvFile(null); // Clear the selected file
  };

  const renderCVAnalysis = () => {
    if (!cvAnalysis) return null;

    return (
      <div className="space-y-6">
        {/* Professional Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Professionell sammanfattning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              {cvAnalysis.summary || cvAnalysis.careerSummary}
            </p>
          </CardContent>
        </Card>

        {/* CV Score */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-green-600" />
              CV-betyg: {cvAnalysis.cvScore || 85}/100
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={cvAnalysis.cvScore || 85} className="mb-4" />
            <p className="text-sm text-gray-600">
              {cvAnalysis.cvScore >= 80 ? "Utmärkt CV med stark professionell presentation" :
               cvAnalysis.cvScore >= 60 ? "Bra CV med utrymme för förbättringar" :
               "CV behöver betydande förbättringar"}
            </p>
          </CardContent>
        </Card>

        {/* Technical Strengths */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              Tekniska styrkor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(cvAnalysis.technicalStrengths || cvAnalysis.strengths || []).map((strength, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{strength}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Improvement Areas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              Förbättringsområden
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(cvAnalysis.improvementAreas || cvAnalysis.improvements || []).map((area, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{area}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Market Positioning */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              Marknadspositionering
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Unik värdeproposition</h4>
              <p className="text-gray-700">{cvAnalysis.marketValue?.uniqueValueProposition || cvAnalysis.marketPositioning?.uniqueValue}</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Lönebenchmarks</h4>
              <p className="text-gray-700">{cvAnalysis.marketValue?.salaryBenchmarks || cvAnalysis.marketPositioning?.salaryRange}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Målroller</h4>
              <div className="flex flex-wrap gap-2">
                {(cvAnalysis.marketValue?.targetRoles || cvAnalysis.marketPositioning?.suitableRoles || []).map((role, index) => (
                  <Badge key={index} variant="outline" className="bg-purple-50 text-purple-700">
                    {role}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderLinkedInAnalysis = () => {
    if (!linkedinAnalysis) return null;

    return (
      <div className="space-y-6">
        {/* Overall LinkedIn Score */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-blue-600" />
              LinkedIn-betyg: {linkedinAnalysis.overallScore}/100
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={linkedinAnalysis.overallScore} className="mb-4" />
            <p className="text-sm text-gray-600">{linkedinAnalysis.insights}</p>
          </CardContent>
        </Card>

        {/* Leadership Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              Ledarskapsanalys
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Ledarskap</span>
                <div className="flex items-center gap-2">
                  <Progress value={linkedinAnalysis.leadership * 20} className="w-24" />
                  <span className="text-sm font-medium">{linkedinAnalysis.leadership}/5</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Innovation & Strategy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              Innovation & Strategi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Innovation</span>
              <div className="flex items-center gap-2">
                <Progress value={linkedinAnalysis.innovation * 20} className="w-24" />
                <span className="text-sm font-medium">{linkedinAnalysis.innovation}/5</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Understanding */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-green-600" />
              Affärsförståelse
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Affärsförståelse</span>
              <div className="flex items-center gap-2">
                <Progress value={linkedinAnalysis.business * 20} className="w-24" />
                <span className="text-sm font-medium">{linkedinAnalysis.business}/5</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Strategiskt tänkande</span>
              <div className="flex items-center gap-2">
                <Progress value={linkedinAnalysis.strategic * 20} className="w-24" />
                <span className="text-sm font-medium">{linkedinAnalysis.strategic}/5</span>
              </div>
            </div>
            <div className="mt-3">
              <span className="text-sm text-gray-600">Beslutsfattande stil: {linkedinAnalysis.decisionMaking}</span>
            </div>
          </CardContent>
        </Card>

        {/* Growth Areas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              Utvecklingsområden
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(linkedinAnalysis.growthAreas || []).map((area, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{area}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Thought Leadership */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-indigo-600" />
              Thought Leadership
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Nivå av thought leadership</span>
              <div className="flex items-center gap-2">
                <Progress value={linkedinAnalysis.thoughtLeadership * 20} className="w-24" />
                <span className="text-sm font-medium">{linkedinAnalysis.thoughtLeadership}/5</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Rekommendationer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {linkedinAnalysis.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{rec}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-8 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">CV och LinkedIn Analys</h2>
        <p className="text-gray-600">Ladda upp ditt CV eller analysera din LinkedIn-profil för att få insikter och förbättringsförslag.</p>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">CV Uppladdning</CardTitle>
          <CardDescription>Ladda upp ditt CV för en detaljerad analys.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="flex items-center gap-2" onClick={triggerFileInput} disabled={isLoading}>
              <Upload className="h-4 w-4" />
              Välj CV-fil
            </Button>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
              ref={fileInputRef}
            />
            {cvFile && (
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{cvFile.name}</span>
                <Button variant="ghost" size="icon" onClick={resetFileInput}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          <Button className="w-full" onClick={handleUpload} disabled={isLoading || !cvFile}>
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analysera CV...
              </>
            ) : (
              "Analysera CV"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* LinkedIn Analysis Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">LinkedIn Profil Analys</CardTitle>
          <CardDescription>Ange din LinkedIn profil URL för att få en analys.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="linkedin-url">LinkedIn Profil URL</Label>
            <Input
              type="url"
              id="linkedin-url"
              placeholder="https://www.linkedin.com/in/yourprofile"
              value={linkedinProfileUrl}
              onChange={handleLinkedinUrlChange}
              disabled={isLoading}
            />
          </div>
          <Button className="w-full" onClick={handleLinkedInAnalysis} disabled={isLoading || !linkedinProfileUrl}>
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analysera LinkedIn...
              </>
            ) : (
              "Analysera LinkedIn"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {cvAnalysis || linkedinAnalysis ? (
        <Tabs defaultValue="cv" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="cv" disabled={!cvAnalysis}>CV Analys</TabsTrigger>
            <TabsTrigger value="linkedin" disabled={!linkedinAnalysis}>LinkedIn Analys</TabsTrigger>
          </TabsList>
          <TabsContent value="cv" className="mt-6">
            {renderCVAnalysis()}
          </TabsContent>
          <TabsContent value="linkedin" className="mt-6">
            {renderLinkedInAnalysis()}
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardContent className="text-center">
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-lg font-medium text-gray-700">Analys pågår...</span>
              </div>
            ) : (
              <span className="text-lg font-medium text-gray-700">Ladda upp ditt CV eller analysera din LinkedIn-profil för att se resultaten.</span>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CVUpload;
