
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Brain, Loader2, CheckCircle, FileText, User, Globe } from 'lucide-react';

interface CVAnalysisStepProps {
  file: File;
  linkedinUrl: string;
  personalDescription: string;
  onComplete: (analysisResult: any) => void;
}

export const CVAnalysisStep: React.FC<CVAnalysisStepProps> = ({
  file,
  linkedinUrl,
  personalDescription,
  onComplete
}) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('Läser CV...');
  const [isComplete, setIsComplete] = useState(false);

  const analysisSteps = [
    'Läser CV...',
    'Analyserar färdigheter...',
    'Bearbetar erfarenhet...',
    'Analyserar LinkedIn...',
    'Genererar personlig profil...',
    'Färdigställer analys...'
  ];

  useEffect(() => {
    const runAnalysis = async () => {
      for (let i = 0; i < analysisSteps.length; i++) {
        setCurrentStep(analysisSteps[i]);
        
        // Simulate analysis time
        const stepDuration = i === 0 ? 2000 : 1500; // First step takes longer
        const stepProgress = ((i + 1) / analysisSteps.length) * 100;
        
        await new Promise(resolve => setTimeout(resolve, stepDuration));
        setProgress(stepProgress);
      }

      // Complete analysis
      setIsComplete(true);
      setCurrentStep('Analys klar!');

      // Simulate analysis result
      const mockAnalysisResult = {
        consultant: {
          id: 'new-consultant-' + Date.now(),
          name: 'Ny Konsult',
          email: 'ny.konsult@exempel.se',
          phone: '+46 70 123 45 67',
          location: 'Stockholm, Sverige',
          skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'PostgreSQL'],
          experience: '5+ år',
          rating: 4.8,
          roles: ['Senior Developer', 'Tech Lead'],
          availability: 'Tillgänglig',
          type: 'new'
        },
        cvAnalysis: {
          technicalSkills: ['React', 'TypeScript', 'Node.js', 'AWS', 'PostgreSQL'],
          softSkills: ['Teamwork', 'Problem-solving', 'Communication'],
          experience: '5+ years',
          education: ['Högskoleexamen i Datavetenskap']
        },
        linkedinAnalysis: linkedinUrl ? {
          connections: 500,
          recommendations: 12,
          posts: 45
        } : null,
        extractedPersonalInfo: {
          name: 'Ny Konsult',
          email: 'ny.konsult@exempel.se',
          phone: '+46 70 123 45 67',
          location: 'Stockholm, Sverige'
        }
      };

      // Wait a bit then complete
      setTimeout(() => {
        onComplete(mockAnalysisResult);
      }, 1000);
    };

    runAnalysis();
  }, [file, linkedinUrl, personalDescription, onComplete]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI-analys pågår
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Progress Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{currentStep}</span>
              <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          {/* Analysis Details */}
          <div className="grid gap-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">CV-analys</p>
                <p className="text-sm text-blue-700">Extraherar färdigheter och erfarenhet</p>
              </div>
              {progress >= 50 ? <CheckCircle className="h-5 w-5 text-green-600" /> : <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />}
            </div>

            {linkedinUrl && (
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <Globe className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium text-purple-900">LinkedIn-analys</p>
                  <p className="text-sm text-purple-700">Analyserar professionell närvaro</p>
                </div>
                {progress >= 70 ? <CheckCircle className="h-5 w-5 text-green-600" /> : <Loader2 className="h-5 w-5 text-purple-600 animate-spin" />}
              </div>
            )}

            {personalDescription && (
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <User className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Personlig beskrivning</p>
                  <p className="text-sm text-green-700">Integrerar din personliga profil</p>
                </div>
                {progress >= 80 ? <CheckCircle className="h-5 w-5 text-green-600" /> : <Loader2 className="h-5 w-5 text-green-600 animate-spin" />}
              </div>
            )}
          </div>

          {/* Completion Message */}
          {isComplete && (
            <div className="text-center py-4">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <p className="text-lg font-semibold text-green-900">Analys slutförd!</p>
              <p className="text-sm text-gray-600">Förbereder din profil...</p>
            </div>
          )}

          {/* Tips while waiting */}
          {!isComplete && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-900 mb-2">💡 Visste du att...</h4>
              <p className="text-sm text-yellow-800">
                Vår AI analyserar över 50 olika faktorer från ditt CV för att skapa den mest exakta profilen möjligt.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
