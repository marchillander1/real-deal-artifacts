
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Upload, FileText, CheckCircle, Brain, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const CVUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyzingLinkedIn, setAnalyzingLinkedIn] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
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
        setAiAnalysis(data.analysis);
        toast({
          title: "AI-analys slutförd! 🧠",
          description: "Din LinkedIn-profil har analyserats framgångsrikt.",
        });
        return data.analysis;
      } else {
        throw new Error('Ingen analys mottagen från servern');
      }
    } catch (error: any) {
      console.error('LinkedIn analysis failed:', error);
      toast({
        title: "AI-analys misslyckades",
        description: error.message || "Kunde inte analysera LinkedIn-profilen. Försök igen.",
        variant: "destructive",
      });
      return null;
    } finally {
      setAnalyzingLinkedIn(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf' || selectedFile.type.includes('word')) {
        setFile(selectedFile);
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
      let analysis = aiAnalysis;
      
      // Analyze LinkedIn if URL provided and not already analyzed
      if (linkedinUrl && !analysis) {
        analysis = await analyzeLinkedInProfile(linkedinUrl);
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

      // Prepare consultant data with AI analysis
      const consultantData: any = {
        name,
        email,
        phone,
        cv_file_path: uploadData.path,
        type: 'new',
        status: 'pending_review',
        linkedin_url: linkedinUrl || null,
      };

      // Add AI analysis data if available
      if (analysis) {
        consultantData.communication_style = analysis.communicationStyle;
        consultantData.work_style = analysis.workStyle;
        consultantData.values = analysis.values;
        consultantData.personality_traits = analysis.personalityTraits;
        consultantData.team_fit = analysis.teamFit;
        consultantData.cultural_fit = analysis.culturalFit;
        consultantData.adaptability = analysis.adaptability;
        consultantData.leadership = analysis.leadership;
        consultantData.technical_depth = analysis.technicalDepth;
        consultantData.communication_clarity = analysis.communicationClarity;
        consultantData.innovation_mindset = analysis.innovationMindset;
        consultantData.mentorship_ability = analysis.mentorshipAbility;
        consultantData.problem_solving_approach = analysis.problemSolvingApproach;
        consultantData.learning_orientation = analysis.learningOrientation;
        consultantData.collaboration_preference = analysis.collaborationPreference;
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
      setAiAnalysis(null);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
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
              {aiAnalysis && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">AI-analys slutförd!</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Din personlighetsprofil har skapats för förbättrad matchning
                  </p>
                </div>
              )}
            </div>
            
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
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Laddar upp...' : 'Skicka in CV'}
            </Button>
          </form>
        </CardContent>
      </Card>

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
              {aiAnalysis && (
                <p className="font-medium text-blue-600">
                  Din AI-personlighetsprofil har också skapats för förbättrad matchning!
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
  );
};
