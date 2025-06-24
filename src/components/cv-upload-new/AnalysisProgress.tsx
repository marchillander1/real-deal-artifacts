
import React, { useEffect, useState } from 'react';
import { Brain, FileText, Linkedin, Database, CheckCircle, Loader2, Sparkles, TrendingUp, Target } from 'lucide-react';
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
  const [analysisInsights, setAnalysisInsights] = useState<string[]>([]);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState(180); // 3 minutes
  const { toast } = useToast();

  const steps = [
    { 
      icon: FileText, 
      label: 'Analyserar CV med Gemini AI', 
      key: 'cv', 
      duration: 45000,
      description: 'Extraherar tekniska färdigheter och erfarenhet'
    },
    { 
      icon: Linkedin, 
      label: 'Bearbetar LinkedIn-data', 
      key: 'linkedin', 
      duration: 30000,
      description: 'Analyserar professionell närvaro och nätverk'
    },
    { 
      icon: Brain, 
      label: 'AI-analys av mjuka värden', 
      key: 'processing', 
      duration: 35000,
      description: 'Bedömer kommunikationsstil och ledarskap'
    },
    { 
      icon: TrendingUp, 
      label: 'Marknadsvärdering', 
      key: 'market', 
      duration: 25000,
      description: 'Beräknar optimal timpris och konkurrenskraft'
    },
    { 
      icon: Database, 
      label: 'Skapar konsultprofil', 
      key: 'database', 
      duration: 15000,
      description: 'Sparar resultat och förbereder rekommendationer'
    }
  ];

  const insightMessages = [
    "🎯 Identifierar dina unika styrkor...",
    "💡 Analyserar marknadsmöjligheter...",
    "🚀 Beräknar din utvecklingspotential...",
    "📊 Jämför med branschstandarder...",
    "🎪 Skapar personliga rekommendationer...",
    "✨ Finsliper din profil..."
  ];

  useEffect(() => {
    performAnalysis();
    
    // Update insights periodically
    const insightInterval = setInterval(() => {
      if (analysisInsights.length < insightMessages.length) {
        setAnalysisInsights(prev => [
          ...prev, 
          insightMessages[prev.length]
        ]);
      }
    }, 25000);

    // Update estimated time
    const timeInterval = setInterval(() => {
      setEstimatedTimeRemaining(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      clearInterval(insightInterval);
      clearInterval(timeInterval);
    };
  }, []);

  const performAnalysis = async () => {
    try {
      // Step 1: Create upload session
      setProgress(5);
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

      // Step 2: CV Analysis
      setProgress(15);
      setCurrentStep('Analyserar CV med Gemini AI...');
      setAnalysisInsights(['🎯 Identifierar dina unika styrkor...']);
      
      await simulateStepProgress('cv', 15, 35, 45000);
      setCompletedSteps(prev => [...prev, 'cv']);

      // Step 3: LinkedIn Analysis
      setProgress(40);
      setCurrentStep('Bearbetar LinkedIn-data...');
      
      await simulateStepProgress('linkedin', 40, 55, 30000);
      setCompletedSteps(prev => [...prev, 'linkedin']);

      // Step 4: AI Processing
      setProgress(60);
      setCurrentStep('AI-analys av mjuka värden...');
      
      await simulateStepProgress('processing', 60, 75, 35000);
      setCompletedSteps(prev => [...prev, 'processing']);

      // Step 5: Market Analysis
      setProgress(80);
      setCurrentStep('Marknadsvärdering...');
      
      await simulateStepProgress('market', 80, 90, 25000);
      setCompletedSteps(prev => [...prev, 'market']);

      // Step 6: Database Creation
      setProgress(95);
      setCurrentStep('Skapar konsultprofil...');
      
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

      setCompletedSteps(prev => [...prev, 'database']);
      setProgress(100);
      setCurrentStep('Analys slutförd!');

      // Complete with success message
      setTimeout(() => {
        toast({
          title: "Analys slutförd! 🎉",
          description: "Din konsultprofil har skapats med AI-drivna insikter",
        });
        
        onComplete({
          sessionId: sessionData.id,
          profileId: analysisData.profileId,
          analysisData: analysisData.analysis
        });
      }, 2000);

    } catch (error: any) {
      console.error('Analysis failed:', error);
      toast({
        title: "Analys misslyckades",
        description: error.message || "Ett oväntat fel inträffade",
        variant: "destructive",
      });
    }
  };

  const simulateStepProgress = async (stepKey: string, startProgress: number, endProgress: number, duration: number) => {
    return new Promise(resolve => {
      const steps = 20;
      const increment = (endProgress - startProgress) / steps;
      const interval = duration / steps;
      
      let currentProgress = startProgress;
      const progressInterval = setInterval(() => {
        currentProgress += increment;
        setProgress(Math.min(currentProgress, endProgress));
        
        if (currentProgress >= endProgress) {
          clearInterval(progressInterval);
          resolve(void 0);
        }
      }, interval);
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Brain className="h-16 w-16 animate-pulse" />
              <Sparkles className="h-6 w-6 absolute -top-1 -right-1 text-yellow-300 animate-bounce" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold mb-4">
            AI Analyserar Din Profil
          </CardTitle>
          <p className="text-lg opacity-90">
            Vårt avancerade AI-system analyserar både mjuka och hårda värden för djupgående karriärinsikter
          </p>
          
          {estimatedTimeRemaining > 0 && (
            <div className="mt-4 text-sm opacity-75">
              Beräknad tid kvar: {formatTime(estimatedTimeRemaining)}
            </div>
          )}
        </CardHeader>

        <CardContent className="p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-700">Analysförlopp</span>
              <span className="text-sm font-medium text-slate-700">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full h-4" />
            <p className="text-sm text-slate-600 mt-2 font-medium">{currentStep}</p>
          </div>

          {/* Real-time Insights */}
          {analysisInsights.length > 0 && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">🔍 Pågående analys:</h4>
              <div className="space-y-1">
                {analysisInsights.map((insight, index) => (
                  <p key={index} className="text-sm text-blue-700 animate-fade-in">
                    {insight}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Analysis Steps */}
          <div className="space-y-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = completedSteps.includes(step.key);
              const isActive = currentStep.toLowerCase().includes(step.label.toLowerCase().split(' ')[1] || '');
              
              return (
                <div
                  key={step.key}
                  className={`flex items-center p-4 rounded-xl border-2 transition-all duration-500 ${
                    isCompleted
                      ? 'border-green-500 bg-green-50 transform scale-105'
                      : isActive
                      ? 'border-blue-500 bg-blue-50 animate-pulse'
                      : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className={`p-3 rounded-lg mr-4 transition-all duration-300 ${
                    isCompleted
                      ? 'bg-green-500 shadow-lg'
                      : isActive
                      ? 'bg-blue-500 shadow-md'
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
                  <div className="flex-1">
                    <h3 className={`font-semibold transition-colors ${
                      isCompleted ? 'text-green-700' : isActive ? 'text-blue-700' : 'text-slate-700'
                    }`}>
                      {step.label}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      {step.description}
                    </p>
                    <p className="text-xs mt-1 font-medium">
                      {isCompleted ? '✅ Slutförd' : isActive ? '⏳ Pågår...' : '⏸️ Väntar'}
                    </p>
                  </div>
                  {isActive && (
                    <div className="ml-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* What's Being Analyzed */}
          <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
            <h4 className="font-semibold text-indigo-800 mb-3 flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Vad analyseras just nu:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-indigo-700">
              <div>
                <strong>Tekniska färdigheter:</strong>
                <ul className="mt-1 space-y-1">
                  <li>• Programmeringsspråk & ramverk</li>
                  <li>• Certifieringar & utbildning</li>
                  <li>• Projektexempel & portfölj</li>
                </ul>
              </div>
              <div>
                <strong>Mjuka värden:</strong>
                <ul className="mt-1 space-y-1">
                  <li>• Kommunikationsstil</li>
                  <li>• Ledarskapsförmåga</li>
                  <li>• Teamwork & kulturell passform</li>
                </ul>
              </div>
              <div>
                <strong>Marknadsvärdering:</strong>
                <ul className="mt-1 space-y-1">
                  <li>• Optimal timpris</li>
                  <li>• Konkurrensfördelar</li>
                  <li>• Efterfrågan & trender</li>
                </ul>
              </div>
              <div>
                <strong>Karriärutveckling:</strong>
                <ul className="mt-1 space-y-1">
                  <li>• Utvecklingsområden</li>
                  <li>• Rekommenderade kurser</li>
                  <li>• Nästa karriärsteg</li>
                </ul>
              </div>
            </div>
          </div>

          {progress > 80 && (
            <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200 animate-fade-in">
              <p className="text-sm text-green-700 text-center font-medium">
                🎉 Analysen är nästan klar! Förbereder din personliga karriärrapport...
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};
