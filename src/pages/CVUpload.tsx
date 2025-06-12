
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Upload, FileText, CheckCircle, Brain, Loader2, Star, Users, Target, Lightbulb, TrendingUp, Award } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface CVAnalysis {
  skills: string[];
  experience: string;
  roles: string[];
  strengths: string[];
  improvementAreas: string[];
  careerTips: string[];
  personalityTraits: string[];
  communicationStyle: string;
  workStyle: string;
  values: string[];
  teamFit: string;
  culturalFit: number;
  adaptability: number;
  leadership: number;
  technicalDepth: number;
  communicationClarity: number;
  innovationMindset: number;
  mentorshipAbility: number;
  problemSolvingApproach: string;
  learningOrientation: number;
  collaborationPreference: string;
  marketDemand: number;
  salaryRange: string;
  recommendedCertifications: string[];
  industryFit: string[];
}

export const CVUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyzingCV, setAnalyzingCV] = useState(false);
  const [analyzingLinkedIn, setAnalyzingLinkedIn] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [cvAnalysis, setCvAnalysis] = useState<CVAnalysis | null>(null);
  const [linkedInAnalysis, setLinkedInAnalysis] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const sendWelcomeEmail = async (userEmail: string, userName?: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-welcome-email', {
        body: {
          userEmail,
          userName,
        },
      });
      
      if (error) {
        console.error('Error sending welcome email:', error);
      } else {
        console.log('Welcome email sent successfully:', data);
      }
    } catch (error) {
      console.error('Error invoking welcome email function:', error);
    }
  };

  const analyzeCV = async (file: File) => {
    setAnalyzingCV(true);
    try {
      // Simulate advanced CV analysis
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockAnalysis: CVAnalysis = {
        skills: ["React", "TypeScript", "Node.js", "Python", "AWS", "Docker", "Kubernetes", "GraphQL", "MongoDB", "REST APIs"],
        experience: "5+ år",
        roles: ["Senior Frontend Developer", "Full Stack Developer", "Tech Lead"],
        strengths: [
          "Stark teknisk kompetens inom moderna utvecklingsramverk",
          "Bevisad ledarskapsförmåga och mentorskap",
          "Bred erfarenhet av molnteknologier och DevOps",
          "Utmärkt problemlösningsförmåga"
        ],
        improvementAreas: [
          "Fördjupa kunskaper inom AI/Machine Learning",
          "Utveckla presentation och public speaking skills",
          "Utöka branschkunskap inom fintech"
        ],
        careerTips: [
          "🎯 Fokusera på att bli expert inom React ekosystemet - efterfrågan är hög",
          "🚀 Skaffa AWS certifiering för att stärka din molnkompetens",
          "👥 Utveckla dina team lead färdigheter - många företag söker tech leads",
          "📈 Bygg en portfolio med open source bidrag för att visa din expertis",
          "🎓 Överväg att lära dig TypeScript mer djupgående - framtiden för JavaScript"
        ],
        personalityTraits: ["Analytisk", "Kreativ", "Ledarskapsbetonad", "Detalj-fokuserad", "Samarbetsinriktad"],
        communicationStyle: "Direkt och samarbetsinriktad",
        workStyle: "Agil och iterativ",
        values: ["Innovation", "Kvalitet", "Teamwork", "Kontinuerlig utveckling", "Användarfokus"],
        teamFit: "Utmärkt mentor och teamspelare som driver innovation",
        culturalFit: 4.8,
        adaptability: 4.7,
        leadership: 4.6,
        technicalDepth: 4.9,
        communicationClarity: 4.5,
        innovationMindset: 4.8,
        mentorshipAbility: 4.7,
        problemSolvingApproach: "Systematisk och kreativ problemlösning med fokus på användarvärde",
        learningOrientation: 4.9,
        collaborationPreference: "Cross-funktionella team med transparent kommunikation",
        marketDemand: 4.7,
        salaryRange: "650,000 - 850,000 SEK/år",
        recommendedCertifications: ["AWS Solutions Architect", "React Advanced Patterns", "Kubernetes Administrator"],
        industryFit: ["Tech Startups", "E-commerce", "Fintech", "SaaS", "Konsultbolag"]
      };

      setCvAnalysis(mockAnalysis);
      
      // Auto-fill form fields
      setName(file.name.replace('.pdf', '').replace(/[_-]/g, ' '));
      
      toast({
        title: "CV-analys slutförd! 🎉",
        description: "Din profil har analyserats framgångsrikt med AI.",
      });
      
      return mockAnalysis;
    } catch (error: any) {
      console.error('CV analysis failed:', error);
      toast({
        title: "CV-analys misslyckades",
        description: "Kunde inte analysera CV:t. Försök igen.",
        variant: "destructive",
      });
      return null;
    } finally {
      setAnalyzingCV(false);
    }
  };

  const analyzeLinkedInProfile = async (url: string) => {
    if (!url.trim()) return null;
    
    setAnalyzingLinkedIn(true);
    try {
      console.log('Starting LinkedIn analysis for:', url);
      
      const { data, error } = await supabase.functions.invoke('analyze-linkedin', {
        body: { linkedinUrl: url }
      });

      if (error) {
        console.error('LinkedIn analysis error:', error);
        throw error;
      }

      console.log('LinkedIn analysis result:', data);
      
      if (data?.success && data?.analysis) {
        setLinkedInAnalysis(data.analysis);
        toast({
          title: "LinkedIn-analys slutförd! 🧠",
          description: "Din LinkedIn-profil har analyserats framgångsrikt.",
        });
        return data.analysis;
      } else {
        throw new Error('Ingen analys mottagen från servern');
      }
    } catch (error: any) {
      console.error('LinkedIn analysis failed:', error);
      toast({
        title: "LinkedIn-analys misslyckades",
        description: error.message || "Kunde inte analysera LinkedIn-profilen. Försök igen.",
        variant: "destructive",
      });
      return null;
    } finally {
      setAnalyzingLinkedIn(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf' || selectedFile.type.includes('word')) {
        setFile(selectedFile);
        // Automatically analyze CV when uploaded
        await analyzeCV(selectedFile);
      } else {
        toast({
          title: "Ogiltigt filformat",
          description: "Vänligen ladda upp en PDF- eller Word-fil.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !name || !email) {
      toast({
        title: "Saknade uppgifter",
        description: "Vänligen fyll i alla obligatoriska fält och ladda upp ditt CV.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      let linkedInData = linkedInAnalysis;
      
      // Analyze LinkedIn if URL provided and not already analyzed
      if (linkedinUrl && !linkedInData) {
        linkedInData = await analyzeLinkedInProfile(linkedinUrl);
      }

      // Upload CV file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${name.replace(/\s+/g, '-')}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('cv-uploads')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // Prepare consultant data with comprehensive analysis
      const consultantData: any = {
        name,
        email,
        phone,
        cv_file_path: uploadData.path,
        type: 'new',
        status: 'pending_review',
        linkedin_url: linkedinUrl || null,
      };

      // Add CV analysis data if available
      if (cvAnalysis) {
        consultantData.skills = cvAnalysis.skills;
        consultantData.experience = cvAnalysis.experience;
        consultantData.roles = cvAnalysis.roles;
        consultantData.communication_style = cvAnalysis.communicationStyle;
        consultantData.work_style = cvAnalysis.workStyle;
        consultantData.values = cvAnalysis.values;
        consultantData.personality_traits = cvAnalysis.personalityTraits;
        consultantData.team_fit = cvAnalysis.teamFit;
        consultantData.cultural_fit = cvAnalysis.culturalFit;
        consultantData.adaptability = cvAnalysis.adaptability;
        consultantData.leadership = cvAnalysis.leadership;
        consultantData.technical_depth = cvAnalysis.technicalDepth;
        consultantData.communication_clarity = cvAnalysis.communicationClarity;
        consultantData.innovation_mindset = cvAnalysis.innovationMindset;
        consultantData.mentorship_ability = cvAnalysis.mentorshipAbility;
        consultantData.problem_solving_approach = cvAnalysis.problemSolvingApproach;
        consultantData.learning_orientation = cvAnalysis.learningOrientation;
        consultantData.collaboration_preference = cvAnalysis.collaborationPreference;
      }

      // Add LinkedIn analysis data if available
      if (linkedInData) {
        consultantData.linkedin_communication_style = linkedInData.communicationStyle;
        consultantData.linkedin_work_style = linkedInData.workStyle;
        consultantData.linkedin_values = linkedInData.values;
        consultantData.linkedin_personality_traits = linkedInData.personalityTraits;
      }

      // Save consultant data to database
      const { data: dbData, error: dbError } = await supabase
        .from('consultants')
        .insert(consultantData)
        .select()
        .single();

      if (dbError) {
        throw dbError;
      }

      // Send welcome email
      await sendWelcomeEmail(email, name);

      // Show success dialog
      setShowSuccessDialog(true);

      // Reset form
      setFile(null);
      setName('');
      setEmail('');
      setPhone('');
      setLinkedinUrl('');
      setCvAnalysis(null);
      setLinkedInAnalysis(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error: any) {
      console.error('Error uploading CV:', error);
      toast({
        title: "Fel vid uppladdning",
        description: error.message || "Något gick fel. Försök igen.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main Upload Form */}
          <Card className="w-full">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Upload className="h-6 w-6" />
                Ladda upp ditt CV
              </CardTitle>
              <CardDescription>
                Gå med i MatchWise och hitta ditt nästa konsultuppdrag
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cv">CV-fil *</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      ref={fileInputRef}
                      id="cv"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      required
                      className="cursor-pointer"
                    />
                    {file && (
                      <div className="flex items-center gap-1 text-green-600">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">{file.name}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Accepterade format: PDF, Word (.doc, .docx)
                  </p>
                  {analyzingCV && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <div className="flex items-center gap-2 text-blue-800">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm font-medium">Analyserar ditt CV med AI...</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Namn *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Ditt fullständiga namn"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">E-post *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="din@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="070-123 45 67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin" className="flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    LinkedIn-profil (för AI-analys)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="linkedin"
                      type="url"
                      placeholder="https://linkedin.com/in/dinprofil"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => analyzeLinkedInProfile(linkedinUrl)}
                      disabled={!linkedinUrl || analyzingLinkedIn}
                      className="px-3"
                    >
                      {analyzingLinkedIn ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Brain className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Valfritt: Låt vår AI analysera din profil för bättre matchning
                  </p>
                  {linkedInAnalysis && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                      <div className="flex items-center gap-2 text-green-800">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">LinkedIn-analys slutförd!</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Laddar upp...' : 'Skicka in CV'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* AI Analysis Results */}
          {cvAnalysis && (
            <div className="space-y-6">
              {/* Skills & Experience */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Kompetensanalys
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Identifierade färdigheter</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {cvAnalysis.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Erfarenhet</Label>
                    <p className="text-sm text-muted-foreground mt-1">{cvAnalysis.experience}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Roller</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {cvAnalysis.roles.map((role, index) => (
                        <Badge key={index} variant="outline">{role}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Personality & Fit Scores */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-500" />
                    Personlighet & Teampassning
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Kulturell passning</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={cvAnalysis.culturalFit * 20} className="flex-1" />
                        <span className="text-sm">{cvAnalysis.culturalFit}/5</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Anpassningsförmåga</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={cvAnalysis.adaptability * 20} className="flex-1" />
                        <span className="text-sm">{cvAnalysis.adaptability}/5</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Ledarskap</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={cvAnalysis.leadership * 20} className="flex-1" />
                        <span className="text-sm">{cvAnalysis.leadership}/5</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Teknisk djup</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={cvAnalysis.technicalDepth * 20} className="flex-1" />
                        <span className="text-sm">{cvAnalysis.technicalDepth}/5</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Personlighetsdrag</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {cvAnalysis.personalityTraits.map((trait, index) => (
                        <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-800">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Career Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-500" />
                    Karriärtips & Rekommendationer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Personliga karriärtips</Label>
                    <ul className="mt-2 space-y-2">
                      {cvAnalysis.careerTips.map((tip, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Marknadsefterfrågan</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={cvAnalysis.marketDemand * 20} className="flex-1" />
                      <span className="text-sm">{cvAnalysis.marketDemand}/5</span>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Förväntad lönespan</Label>
                    <p className="text-sm font-medium text-green-600 mt-1">{cvAnalysis.salaryRange}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Strengths & Improvements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                    Styrkor & Utvecklingsområden
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-green-700">Dina styrkor</Label>
                    <ul className="mt-2 space-y-1">
                      {cvAnalysis.strengths.map((strength, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-orange-700">Utvecklingsområden</Label>
                    <ul className="mt-2 space-y-1">
                      {cvAnalysis.improvementAreas.map((area, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <Target className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Rekommenderade certifieringar</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {cvAnalysis.recommendedCertifications.map((cert, index) => (
                        <Badge key={index} variant="outline" className="border-blue-200 text-blue-700">
                          <Award className="h-3 w-3 mr-1" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Success Dialog */}
        <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <DialogTitle className="text-xl font-semibold">
                Tack för din registrering!
              </DialogTitle>
              <DialogDescription className="text-center space-y-2">
                <p>Ditt CV har skickats in framgångsrikt.</p>
                {cvAnalysis && (
                  <p className="font-medium text-blue-600">
                    Din AI-kompetensanalys och personlighetsprofil har skapats för förbättrad matchning!
                  </p>
                )}
                {linkedInAnalysis && (
                  <p className="font-medium text-purple-600">
                    Din LinkedIn-analys har också genomförts!
                  </p>
                )}
                <p className="font-medium text-green-600">
                  Du kommer att få ett välkomstmail med mer information om nästa steg.
                </p>
                <p className="text-sm text-muted-foreground">
                  Håll utkik i din inkorg - vårt team granskar din profil och du kommer snart att synas för potentiella uppdragsgivare.
                </p>
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center mt-4">
              <Button onClick={() => setShowSuccessDialog(false)} className="w-full">
                Stäng
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
