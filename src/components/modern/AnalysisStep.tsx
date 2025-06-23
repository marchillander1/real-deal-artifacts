
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, Upload, Brain, Mail, Sparkles } from 'lucide-react';

interface AnalysisStepProps {
  file: File;
  linkedinUrl: string;
  progress?: number;
}

export const AnalysisStep: React.FC<AnalysisStepProps> = ({ 
  file, 
  linkedinUrl, 
  progress = 0 
}) => {
  const getStatusIcon = (stepProgress: number) => {
    if (progress >= stepProgress) {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
    if (progress >= stepProgress - 20) {
      return <Clock className="h-5 w-5 text-blue-600 animate-spin" />;
    }
    return <div className="h-5 w-5 rounded-full border-2 border-slate-300" />;
  };

  const analysisSteps = [
    { label: 'Uploading CV', progress: 20, icon: Upload },
    { label: 'AI Analysis', progress: 40, icon: Brain },
    { label: 'LinkedIn Processing', progress: 60, icon: Sparkles },
    { label: 'Creating Profile', progress: 80, icon: CheckCircle },
    { label: 'Sending Welcome Email', progress: 100, icon: Mail },
  ];

  return (
    <div className="p-8 md:p-12">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Brain className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
          AI is analyzing your profile
        </h2>
        <p className="text-lg text-slate-600">
          We're processing {file.name} and creating your personalized career analysis
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-slate-700">Analysis Progress</span>
          <span className="text-sm font-medium text-slate-700">{progress}%</span>
        </div>
        <Progress value={progress} className="h-3" />
      </div>

      {/* Analysis Steps */}
      <div className="space-y-4">
        {analysisSteps.map((step, index) => (
          <div 
            key={index}
            className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 ${
              progress >= step.progress 
                ? 'bg-green-50 border border-green-200' 
                : progress >= step.progress - 20
                ? 'bg-blue-50 border border-blue-200'
                : 'bg-slate-50 border border-slate-200'
            }`}
          >
            {getStatusIcon(step.progress)}
            <div className="flex-1">
              <p className={`font-medium ${
                progress >= step.progress 
                  ? 'text-green-800' 
                  : progress >= step.progress - 20
                  ? 'text-blue-800'
                  : 'text-slate-600'
              }`}>
                {step.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Processing Info */}
      <div className="mt-8 p-6 bg-slate-50 rounded-xl">
        <h3 className="font-semibold text-slate-900 mb-3">What we're analyzing:</h3>
        <ul className="space-y-2 text-sm text-slate-600">
          <li>• Technical skills and experience level</li>
          <li>• Professional background and career trajectory</li>
          <li>• Communication style and personality traits</li>
          {linkedinUrl && <li>• LinkedIn profile insights and networking activity</li>}
          <li>• Market positioning and rate recommendations</li>
          <li>• Cultural fit and team compatibility</li>
        </ul>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-500">
          This usually takes 30-60 seconds. Please don't close this window.
        </p>
      </div>
    </div>
  );
};
