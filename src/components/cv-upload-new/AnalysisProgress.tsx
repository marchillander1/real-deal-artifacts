
import React, { useEffect, useState } from 'react';
import { Brain, FileText, Linkedin, Database, CheckCircle, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AnalysisProgressProps {
  uploadData: {
    file: File | null;
    linkedinUrl: string;
    personalTagline: string;
    gdprConsent: boolean;
  };
  onComplete: (result: any) => void;
}

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({
  uploadData,
  onComplete
}) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('Förbereder analys...');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const { toast } = useToast();

  const steps = [
    { icon: FileText, label: 'Analyserar CV med Gemini AI', key: 'cv', duration: 3000 },
    { icon: Linkedin, label: 'Hämtar LinkedIn-data', key: 'linkedin', duration: 2000 },
    { icon: Brain, label: 'Bearbetar mjuka och hårda värden', key: 'processing', duration: 2500 },
    { icon: Database, label: 'Skapar konsultprofil', key: 'database', duration: 1500 }
  ];

  useEffect(() => {
    performAnalysis();
  }, []);

  const performAnalysis = async () => {
    try {
      // Step 1: Create upload session
      setProgress(10);
      setCurrentStep('Förbereder analys...');
      
      const sessionToken = crypto.randomUUID();
      const { data: sessionData, error: sessionError } = await supabase
        .from('upload_sessions')
        .insert({
          session_token: sessionToken,
          linkedin_url: uploadData.linkedinUrl,
          personal_tagline: uploadData.personalTagline,
          gdpr_consent: uploadData.gdprConsent,
          status: 'processing'
        })
        .select()
        .single();

      if (sessionError) {
        throw new Error('Kunde inte skapa analyssession');
      }

      // Step 2: Upload file and trigger Gemini analysis
      setProgress(25);
      setCurrentStep('Analyserar CV med Gemini AI...');
      
      const formData = new FormData();
      formData.append('file', uploadData.file!);
      formData.append('linkedinUrl', uploadData.linkedinUrl);
      formData.append('personalTagline', uploadData.personalTagline);
      formData.append('sessionToken', sessionToken);

      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('parse-cv-enhanced', {
        body: formData
      });

      if (analysisError) {
        throw new Error('CV-analys misslyckades');
      }

      setCompletedSteps(prev => [...prev, 'cv']);
      setProgress(50);

      // Step 3: Process LinkedIn data
      setCurrentStep('Hämtar LinkedIn-data...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCompletedSteps(prev => [...prev, 'linkedin']);
      setProgress(75);

      // Step 4: Create user profile
      setCurrentStep('Bearbetar mjuka och hårda värden...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCompletedSteps(prev => [...prev, 'processing']);
      setProgress(90);

      // Step 5: Save to database
      setCurrentStep('Skapar konsultprofil...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCompletedSteps(prev => [...prev, 'database']);
      setProgress(100);

      // Complete
      setTimeout(() => {
        onComplete({
          sessionId: sessionData.id,
          profileId: analysisData.profileId,
          analysisData: analysisData.analysis
        });
      }, 1000);

    } catch (error: any) {
      console.error('Analysis failed:', error);
      toast({
        title: "Analys misslyckades",
        description: error.message || "Ett oväntat fel inträffade",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-center mb-4">
            <Brain className="h-16 w-16 animate-pulse" />
          </div>
          <CardTitle className="text-3xl font-bold mb-4">
            AI Analyserar Din Profil
          </CardTitle>
          <p className="text-lg opacity-90">
            Vårt avancerade AI-system analyserar både mjuka och hårda värden för djupgående karriärinsikter
          </p>
        </CardHeader>

        <CardContent className="p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-700">Analysförlopp</span>
              <span className="text-sm font-medium text-slate-700">{progress}%</span>
            </div>
            <Progress value={progress} className="w-full h-3" />
            <p className="text-sm text-slate-600 mt-2">{currentStep}</p>
          </div>

          {/* Analysis Steps */}
          <div className="space-y-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = completedSteps.includes(step.key);
              const isActive = currentStep.toLowerCase().includes(step.label.toLowerCase().split(' ')[1] || '');
              
              return (
                <div
                  key={step.key}
                  className={`flex items-center p-4 rounded-xl border-2 transition-all duration-300 ${
                    isCompleted
                      ? 'border-green-500 bg-green-50'
                      : isActive
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className={`p-2 rounded-lg mr-4 ${
                    isCompleted
                      ? 'bg-green-500'
                      : isActive
                      ? 'bg-blue-500'
                      : 'bg-slate-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-6 w-6 text-white" />
                    ) : isActive ? (
                      <Loader2 className="h-6 w-6 text-white animate-spin" />
                    ) : (
                      <Icon className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className={`font-semibold ${
                      isCompleted ? 'text-green-700' : isActive ? 'text-blue-700' : 'text-slate-700'
                    }`}>
                      {step.label}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {isCompleted ? 'Slutförd' : isActive ? 'Pågår...' : 'Väntar'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm text-blue-700 text-center">
              💡 Analysen inkluderar tekniska färdigheter, ledarskapsförmåga, kommunikationsstil, 
              marknadsvärdering och karriärutvecklingsrekommendationer.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
