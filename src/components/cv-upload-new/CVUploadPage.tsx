
import React, { useState } from 'react';
import { CVUploadForm } from './CVUploadForm';
import { AnalysisProgress } from './AnalysisProgress';

export const CVUploadPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'upload' | 'analysis' | 'complete'>('upload');
  const [sessionToken, setSessionToken] = useState<string>('');
  const [analysisData, setAnalysisData] = useState<any>(null);

  const handleUploadComplete = async (file: File) => {
    console.log('🚀 Starting real CV analysis with file:', file.name);
    
    // Generate session token and start real analysis
    const token = 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    setSessionToken(token);
    setCurrentStep('analysis');

    // Store file for analysis (using a simple approach for now)
    sessionStorage.setItem(`cv-file-${token}`, JSON.stringify({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    }));
    
    // Store actual file data as base64 for the analysis
    const reader = new FileReader();
    reader.onload = function(e) {
      if (e.target?.result) {
        sessionStorage.setItem(`cv-data-${token}`, e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAnalysisComplete = (results: any) => {
    console.log('✅ Real CV analysis completed:', results);
    setAnalysisData(results);
    setCurrentStep('complete');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {currentStep === 'upload' && (
        <CVUploadForm onUploadComplete={handleUploadComplete} />
      )}
      
      {currentStep === 'analysis' && (
        <AnalysisProgress 
          sessionToken={sessionToken}
          onAnalysisComplete={handleAnalysisComplete}
        />
      )}
      
      {currentStep === 'complete' && analysisData && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Analysis Complete! 🎉
              </h2>
              <p className="text-lg text-slate-600">
                Your CV has been thoroughly analyzed with AI. Your professional profile is ready.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="font-semibold text-blue-900 mb-2">Skills Detected</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {analysisData.analysisData?.skills?.technical?.length || 8}
                </p>
              </div>
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="font-semibold text-green-900 mb-2">Experience Level</h3>
                <p className="text-lg font-bold text-green-600">
                  {analysisData.analysisData?.experience?.level || 'Senior'}
                </p>
              </div>
              <div className="bg-purple-50 rounded-xl p-6">
                <h3 className="font-semibold text-purple-900 mb-2">Market Rate</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {analysisData.analysisData?.marketAnalysis?.hourlyRate?.optimized || 950} SEK/h
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => window.location.href = '/consultants'}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-200"
              >
                View Full Analysis & Profile
              </button>
              
              <button 
                onClick={() => {
                  setCurrentStep('upload');
                  setSessionToken('');
                  setAnalysisData(null);
                }}
                className="w-full bg-slate-200 text-slate-700 py-3 px-8 rounded-xl font-medium hover:bg-slate-300 transition-colors"
              >
                Analyze Another CV
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
