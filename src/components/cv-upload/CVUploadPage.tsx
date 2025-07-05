
import React, { useState } from 'react';
import { CVUploadStep } from './CVUploadStep';
import { CVAnalysisStep } from './CVAnalysisStep';
import { JoinNetworkStep } from './JoinNetworkStep';
import { SuccessStep } from './SuccessStep';
import { CVCareerChat } from '../CVCareerChat';

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
  const [isChatMinimized, setIsChatMinimized] = useState(false);
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

  // Map step to chat step
  const getChatStep = (): 'upload' | 'analyzing' | 'complete' => {
    switch (currentStep) {
      case 'upload':
        return 'upload';
      case 'analyzing':
        return 'analyzing';
      case 'join-network':
      case 'success':
        return 'complete';
      default:
        return 'upload';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {renderCurrentStep()}
          </div>
          
          {/* AI Career Chat Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <CVCareerChat 
                analysisResults={analysisResult}
                currentStep={getChatStep()}
                isMinimized={isChatMinimized}
                onToggleMinimize={() => setIsChatMinimized(!isChatMinimized)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
