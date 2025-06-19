
import React from 'react';
import { Brain, FileText, Linkedin, Sparkles } from 'lucide-react';

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
          <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl">
            <FileText className="h-6 w-6 text-blue-600" />
            <div className="flex-1 text-left">
              <p className="font-semibold text-blue-900">Parsing CV</p>
              <p className="text-sm text-blue-700">{file.name}</p>
            </div>
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
          </div>

          {linkedinUrl && (
            <div className="flex items-center space-x-4 p-4 bg-indigo-50 rounded-xl">
              <Linkedin className="h-6 w-6 text-indigo-600" />
              <div className="flex-1 text-left">
                <p className="font-semibold text-indigo-900">Analyzing LinkedIn</p>
                <p className="text-sm text-indigo-700">Professional insights</p>
              </div>
              <div className="w-3 h-3 bg-indigo-600 rounded-full animate-pulse"></div>
            </div>
          )}

          <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl">
            <Brain className="h-6 w-6 text-green-600" />
            <div className="flex-1 text-left">
              <p className="font-semibold text-green-900">AI Processing</p>
              <p className="text-sm text-green-700">Generating insights</p>
            </div>
            <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Loading Animation */}
        <div className="mt-8">
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full animate-pulse" 
                 style={{ width: '75%' }}>
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-2">Processing your data...</p>
        </div>
      </div>
    </div>
  );
};
