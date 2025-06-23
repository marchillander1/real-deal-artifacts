
import React, { useState } from 'react';
import { CVUploadStep } from './CVUploadStep';
import { CVAnalysisStep } from './CVAnalysisStep';
import { JoinNetworkStep } from './JoinNetworkStep';
import { SuccessStep } from './SuccessStep';

type UploadStep = 'upload' | 'analyzing' | 'join-network' | 'success';

interface AnalysisResult {
  consultant: any;
  cvAnalysis: any;
  linkedinAnalysis: any;
  extractedPersonalInfo: any;
}

export const CVUploadPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<UploadStep>('upload');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [uploadData, setUploadData] = useState<{
    file: File | null;
    linkedinUrl: string;
    personalDescription: string;
  }>({
    file: null,
    linkedinUrl: '',
    personalDescription: ''
  });

  const handleFileUpload = (file: File, linkedinUrl: string, personalDescription: string) => {
    setUploadData({ file, linkedinUrl, personalDescription });
    setCurrentStep('analyzing');
  };

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result);
    setCurrentStep('join-network');
  };

  const handleAnalysisError = (error: string) => {
    console.error('Analysis failed:', error);
    setCurrentStep('upload');
  };

  const handleJoinNetwork = () => {
    setCurrentStep('success');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'upload':
        return <CVUploadStep onFileUpload={handleFileUpload} />;
      
      case 'analyzing':
        return (
          <CVAnalysisStep
            file={uploadData.file!}
            linkedinUrl={uploadData.linkedinUrl}
            personalDescription={uploadData.personalDescription}
            onComplete={handleAnalysisComplete}
            onError={handleAnalysisError}
          />
        );
      
      case 'join-network':
        return (
          <JoinNetworkStep
            analysisResult={analysisResult!}
            onJoinNetwork={handleJoinNetwork}
          />
        );
      
      case 'success':
        return <SuccessStep consultant={analysisResult?.consultant} />;
      
      default:
        return <CVUploadStep onFileUpload={handleFileUpload} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {renderCurrentStep()}
      </div>
    </div>
  );
};
