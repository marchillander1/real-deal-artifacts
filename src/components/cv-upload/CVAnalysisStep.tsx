
import React, { useEffect, useState } from 'react';
import { Brain, FileText, Linkedin, Database, Mail, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { CVParser } from '../cv-analysis/CVParser';
import { LinkedInAnalyzer } from '../cv-analysis/LinkedInAnalyzer';
import { ConsultantService } from '../database/ConsultantService';
import { EmailService } from '../email/EmailService';

interface CVAnalysisStepProps {
  file: File;
  linkedinUrl: string;
  personalDescription: string;
  onComplete: (result: any) => void;
  onError: (error: string) => void;
}

export const CVAnalysisStep: React.FC<CVAnalysisStepProps> = ({
  file,
  linkedinUrl,
  personalDescription,
  onComplete,
  onError
}) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('Förbereder analys...');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const { toast } = useToast();

  const steps = [
    { icon: FileText, label: 'Analyserar CV med Gemini AI', key: 'cv' },
    { icon: Linkedin, label: 'Analyserar LinkedIn-profil', key: 'linkedin' },
    { icon: Brain, label: 'Bearbetar mjuka och hårda värden', key: 'processing' },
    { icon: Database, label: 'Skapar konsultprofil', key: 'database' },
    { icon: Mail, label: 'Förbereder välkomstmail', key: 'email' }
  ];

  useEffect(() => {
    performAnalysis();
  }, []);

  const performAnalysis = async () => {
    try {
      setProgress(10);
      setCurrentStep('Analyserar CV med Gemini AI...');

      // Step 1: Parse CV with personal description
      const { analysis: cvAnalysis, detectedInfo } = await CVParser.parseCV(
        file, 
        personalDescription
      );
      setCompletedSteps(prev => [...prev, 'cv']);
      setProgress(30);

      // Step 2: LinkedIn analysis (if provided)
      setCurrentStep('Analyserar LinkedIn-profil...');
      let linkedinData = null;
      if (linkedinUrl && linkedinUrl.includes('linkedin.com')) {
        linkedinData = await LinkedInAnalyzer.analyzeLinkedIn(linkedinUrl);
      }
      setCompletedSteps(prev => [...prev, 'linkedin']);
      setProgress(50);

      // Step 3: Process and extract personal info
      setCurrentStep('Bearbetar mjuka och hårda värden...');
      const extractedPersonalInfo = extractPersonalInfo(cvAnalysis, detectedInfo);
      setCompletedSteps(prev => [...prev, 'processing']);
      setProgress(70);

      // Step 4: Create consultant profile
      setCurrentStep('Skapar konsultprofil...');
      const consultant = await ConsultantService.createConsultant({
        cvAnalysis,
        linkedinData,
        extractedPersonalInfo,
        personalDescription,
        file,
        linkedinUrl,
        isMyConsultant: false // This will be a network consultant
      });
      setCompletedSteps(prev => [...prev, 'database']);
      setProgress(90);

      // Step 5: Prepare email data
      setCurrentStep('Förbereder välkomstmail...');
      setCompletedSteps(prev => [...prev, 'email']);
      setProgress(100);

      // Complete analysis
      setTimeout(() => {
        onComplete({
          consultant,
          cvAnalysis,
          linkedinAnalysis: linkedinData,
          extractedPersonalInfo
        });
      }, 1000);

    } catch (error: any) {
      console.error('❌ Analysis failed:', error);
      onError(error.message || 'Analys misslyckades');
      toast({
        title: "Analys misslyckades",
        description: error.message || "Ett oväntat fel inträffade",
        variant: "destructive",
      });
    }
  };

  const extractPersonalInfo = (cvAnalysis: any, detectedInfo: any) => {
    const personalInfo = cvAnalysis?.personalInfo || {};
    
    return {
      name: detectedInfo?.names?.[0] || personalInfo.name || 'Professional Consultant',
      email: detectedInfo?.emails?.[0] || personalInfo.email || 'temp@example.com',
      phone: detectedInfo?.phones?.[0] || personalInfo.phone || '',
      location: personalInfo.location || 'Sweden'
    };
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
        <div className="text-center mb-8">
          <Brain className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-pulse" />
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            AI Analyserar Din Profil
          </h2>
          <p className="text-lg text-slate-600">
            Vårt avancerade AI-system analyserar både mjuka och hårda värden för att ge dig djupgående karriärinsikter.
          </p>
        </div>

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
                  ) : (
                    <Icon className={`h-6 w-6 text-white ${isActive ? 'animate-pulse' : ''}`} />
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
      </div>
    </div>
  );
};
