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
  const [currentStep, setCurrentStep] = useState('Preparing analysis...');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [analysisInsights, setAnalysisInsights] = useState<string[]>([]);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState(180);
  const { toast } = useToast();

  const steps = [
    { 
      icon: FileText, 
      label: 'Analyzing CV with Gemini AI', 
      key: 'cv', 
      duration: 45000,
      description: 'Extracting technical skills and experience'
    },
    { 
      icon: Linkedin, 
      label: 'Processing LinkedIn data', 
      key: 'linkedin', 
      duration: 30000,
      description: 'Analyzing professional presence and network'
    },
    { 
      icon: Brain, 
      label: 'AI analysis of soft skills', 
      key: 'processing', 
      duration: 35000,
      description: 'Assessing communication style and leadership'
    },
    { 
      icon: TrendingUp, 
      label: 'Market valuation', 
      key: 'market', 
      duration: 25000,
      description: 'Calculating optimal hourly rate and competitiveness'
    },
    { 
      icon: Database, 
      label: 'Creating consultant profile', 
      key: 'database', 
      duration: 15000,
      description: 'Saving results and preparing recommendations'
    }
  ];

  const insightMessages = [
    "🎯 Identifying your unique strengths...",
    "💡 Analyzing market opportunities...",
    "🚀 Calculating your development potential...",
    "📊 Comparing with industry standards...",
    "🎪 Creating personal recommendations...",
    "✨ Fine-tuning your profile..."
  ];

  useEffect(() => {
    performAnalysis();
    
    const insightInterval = setInterval(() => {
      if (analysisInsights.length < insightMessages.length) {
        setAnalysisInsights(prev => [
          ...prev, 
          insightMessages[prev.length]
        ]);
      }
    }, 25000);

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
      setProgress(5);
      setCurrentStep('Preparing analysis...');
      
      const sessionToken = crypto.randomUUID();

      // Step 1: CV Analysis with personal tagline
      setProgress(15);
      setCurrentStep('Analyzing CV with Gemini AI...');
      setAnalysisInsights(['🎯 Identifying your unique strengths...']);
      
      await simulateStepProgress('cv', 15, 35, 45000);
      setCompletedSteps(prev => [...prev, 'cv']);

      // Step 2: LinkedIn Analysis
      setProgress(40);
      setCurrentStep('Processing LinkedIn data...');
      
      await simulateStepProgress('linkedin', 40, 55, 30000);
      setCompletedSteps(prev => [...prev, 'linkedin']);

      // Step 3: AI Processing
      setProgress(60);
      setCurrentStep('AI analysis of soft skills...');
      
      await simulateStepProgress('processing', 60, 75, 35000);
      setCompletedSteps(prev => [...prev, 'processing']);

      // Step 4: Market Analysis
      setProgress(80);
      setCurrentStep('Market valuation...');
      
      await simulateStepProgress('market', 80, 90, 25000);
      setCompletedSteps(prev => [...prev, 'market']);

      // Step 5: Actual CV Analysis with parse-cv function
      setProgress(95);
      setCurrentStep('Creating consultant profile...');
      
      console.log('🚀 Starting CV analysis with personal tagline:', uploadData.personalTagline);
      
      const formData = new FormData();
      formData.append('file', uploadData.file!);
      formData.append('linkedinUrl', uploadData.linkedinUrl);
      formData.append('personalDescription', uploadData.personalTagline); // Pass personal tagline as description

      console.log('📤 Calling parse-cv function with data...');

      const response = await supabase.functions.invoke('parse-cv', {
        body: formData
      });

      if (response.error) {
        throw new Error(`CV analysis failed: ${response.error.message}`);
      }

      const result = response.data;
      
      if (!result.success) {
        throw new Error(result.error || 'CV analysis failed');
      }

      console.log('✅ CV analysis completed:', result.analysis);

      setCompletedSteps(prev => [...prev, 'database']);
      setProgress(100);
      setCurrentStep('Analysis completed!');

      setTimeout(() => {
        toast({
          title: "Analysis completed! 🎉",
          description: "Your consultant profile has been created with AI-driven insights",
        });
        
        onComplete({
          sessionId: sessionToken,
          profileId: result.analysis?.personalInfo?.name || 'profile',
          analysisData: result.analysis
        });
      }, 2000);

    } catch (error: any) {
      console.error('❌ Analysis failed:', error);
      toast({
        title: "Analysis failed",
        description: error.message || "An unexpected error occurred",
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
            AI Analyzing Your Profile
          </CardTitle>
          <p className="text-lg opacity-90">
            Our advanced AI system analyzes both soft and hard skills for deep career insights
          </p>
          
          {estimatedTimeRemaining > 0 && (
            <div className="mt-4 text-sm opacity-75">
              Estimated time remaining: {formatTime(estimatedTimeRemaining)}
            </div>
          )}
        </CardHeader>

        <CardContent className="p-8">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-700">Analysis Progress</span>
              <span className="text-sm font-medium text-slate-700">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full h-4" />
            <p className="text-sm text-slate-600 mt-2 font-medium">{currentStep}</p>
          </div>

          {analysisInsights.length > 0 && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">🔍 Ongoing analysis:</h4>
              <div className="space-y-1">
                {analysisInsights.map((insight, index) => (
                  <p key={index} className="text-sm text-blue-700 animate-fade-in">
                    {insight}
                  </p>
                ))}
              </div>
            </div>
          )}

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
                      {isCompleted ? '✅ Completed' : isActive ? '⏳ In progress...' : '⏸️ Waiting'}
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

          <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
            <h4 className="font-semibold text-indigo-800 mb-3 flex items-center">
              <Target className="h-5 w-5 mr-2" />
              What's being analyzed right now:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-indigo-700">
              <div>
                <strong>Technical skills:</strong>
                <ul className="mt-1 space-y-1">
                  <li>• Programming languages & frameworks</li>
                  <li>• Certifications & education</li>
                  <li>• Project examples & portfolio</li>
                </ul>
              </div>
              <div>
                <strong>Soft skills:</strong>
                <ul className="mt-1 space-y-1">
                  <li>• Communication style</li>
                  <li>• Leadership abilities</li>
                  <li>• Teamwork & cultural fit</li>
                </ul>
              </div>
              <div>
                <strong>Market valuation:</strong>
                <ul className="mt-1 space-y-1">
                  <li>• Optimal hourly rate</li>
                  <li>• Competitive advantages</li>
                  <li>• Demand & trends</li>
                </ul>
              </div>
              <div>
                <strong>Career development:</strong>
                <ul className="mt-1 space-y-1">
                  <li>• Development areas</li>
                  <li>• Recommended courses</li>
                  <li>• Next career step</li>
                </ul>
              </div>
            </div>
          </div>

          {progress > 80 && (
            <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200 animate-fade-in">
              <p className="text-sm text-green-700 text-center font-medium">
                🎉 Analysis is almost complete! Preparing your personal career report...
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
