
import React, { useEffect, useState } from 'react';
import { Brain, FileText, Linkedin, Sparkles, CheckCircle } from 'lucide-react';

interface AnalysisStepProps {
  file: File;
  linkedinUrl: string;
  onAnalysisComplete: (results: any) => void;
}

export const AnalysisStep: React.FC<AnalysisStepProps> = ({ 
  file, 
  linkedinUrl, 
  onAnalysisComplete 
}) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('cv');

  useEffect(() => {
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev < 25) {
          setCurrentStep('cv');
          return prev + 2;
        } else if (prev < 50) {
          setCurrentStep('linkedin');
          return prev + 1.5;
        } else if (prev < 85) {
          setCurrentStep('processing');
          return prev + 1;
        } else if (prev < 95) {
          return prev + 0.5;
        }
        return prev;
      });
    }, 200);

    return () => clearInterval(progressInterval);
  }, []);

  return (
    <div className="p-8 md:p-12">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Brain className="h-16 w-16 text-blue-600 animate-pulse" />
              <Sparkles className="h-6 w-6 text-yellow-500 absolute -top-1 -right-1 animate-bounce" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            🔄 Analyzing your profile...
          </h2>
          
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            We're reading your experience, skills, and background to generate a personalized growth plan. 
            This will only take a few seconds.
          </p>
        </div>

        {/* Progress Indicators */}
        <div className="space-y-6 max-w-md mx-auto">
          <div className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 ${
            currentStep === 'cv' ? 'bg-blue-100 border-2 border-blue-300' : 
            progress > 25 ? 'bg-green-50' : 'bg-slate-50'
          }`}>
            {progress > 25 ? (
              <CheckCircle className="h-6 w-6 text-green-600" />
            ) : (
              <FileText className="h-6 w-6 text-blue-600" />
            )}
            <div className="flex-1 text-left">
              <p className={`font-semibold ${progress > 25 ? 'text-green-900' : 'text-blue-900'}`}>
                {progress > 25 ? 'CV Parsed ✓' : 'Parsing CV'}
              </p>
              <p className={`text-sm ${progress > 25 ? 'text-green-700' : 'text-blue-700'}`}>
                {file.name}
              </p>
            </div>
            {progress <= 25 && (
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
            )}
          </div>

          {linkedinUrl && (
            <div className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 ${
              currentStep === 'linkedin' ? 'bg-indigo-100 border-2 border-indigo-300' : 
              progress > 50 ? 'bg-green-50' : 'bg-slate-50'
            }`}>
              {progress > 50 ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <Linkedin className="h-6 w-6 text-indigo-600" />
              )}
              <div className="flex-1 text-left">
                <p className={`font-semibold ${progress > 50 ? 'text-green-900' : 'text-indigo-900'}`}>
                  {progress > 50 ? 'LinkedIn Analyzed ✓' : 'Analyzing LinkedIn'}
                </p>
                <p className={`text-sm ${progress > 50 ? 'text-green-700' : 'text-indigo-700'}`}>
                  Professional insights
                </p>
              </div>
              {progress <= 50 && progress > 25 && (
                <div className="w-3 h-3 bg-indigo-600 rounded-full animate-pulse"></div>
              )}
            </div>
          )}

          <div className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 ${
            currentStep === 'processing' ? 'bg-green-100 border-2 border-green-300' : 
            progress > 85 ? 'bg-green-50' : 'bg-slate-50'
          }`}>
            {progress > 85 ? (
              <CheckCircle className="h-6 w-6 text-green-600" />
            ) : (
              <Brain className="h-6 w-6 text-green-600" />
            )}
            <div className="flex-1 text-left">
              <p className={`font-semibold ${progress > 85 ? 'text-green-900' : 'text-green-900'}`}>
                {progress > 85 ? 'Analysis Complete ✓' : 'AI Processing'}
              </p>
              <p className={`text-sm ${progress > 85 ? 'text-green-700' : 'text-green-700'}`}>
                Generating insights
              </p>
            </div>
            {progress <= 85 && progress > 50 && (
              <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
            )}
          </div>
        </div>

        {/* Loading Animation */}
        <div className="mt-8">
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-600 to-green-600 h-3 rounded-full transition-all duration-300 ease-out" 
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-2">
            {progress < 25 ? 'Parsing CV content...' :
             progress < 50 ? 'Analyzing LinkedIn profile...' :
             progress < 85 ? 'Processing with AI...' :
             'Finalizing analysis...'}
          </p>
        </div>
      </div>
    </div>
  );
};
