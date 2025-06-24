
import React, { useState } from 'react';
import { CVUploadForm } from './CVUploadForm';
import { AnalysisProgress } from './AnalysisProgress';
import { AnalysisResults } from './AnalysisResults';
import { SummaryConfirmation } from './SummaryConfirmation';
import { ProfilePreview } from './ProfilePreview';
import { JoinNetworkSuccess } from './JoinNetworkSuccess';

type UploadStep = 'upload' | 'analyzing' | 'results' | 'summary' | 'preview' | 'success';

interface UploadData {
  file: File | null;
  linkedinUrl: string;
  personalTagline: string;
  gdprConsent: boolean;
}

interface AnalysisResult {
  sessionId: string;
  profileId: string;
  analysisData: any;
}

export const CVUploadPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<UploadStep>('upload');
  const [uploadData, setUploadData] = useState<UploadData>({
    file: null,
    linkedinUrl: '',
    personalTagline: '',
    gdprConsent: false
  });
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleFormSubmit = (data: UploadData) => {
    setUploadData(data);
    setCurrentStep('analyzing');
  };

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result);
    setCurrentStep('results');
  };

  const handleResultsReview = () => {
    setCurrentStep('summary');
  };

  const handleSummaryConfirm = () => {
    setCurrentStep('preview');
  };

  const handleProfileComplete = () => {
    setCurrentStep('success');
  };

  const handleRestart = () => {
    setCurrentStep('upload');
    setUploadData({
      file: null,
      linkedinUrl: '',
      personalTagline: '',
      gdprConsent: false
    });
    setAnalysisResult(null);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'upload':
        return <CVUploadForm onSubmit={handleFormSubmit} />;
      
      case 'analyzing':
        return (
          <AnalysisProgress
            uploadData={uploadData}
            onComplete={handleAnalysisComplete}
          />
        );
      
      case 'results':
        return (
          <AnalysisResults
            analysisResult={analysisResult!}
            onContinue={handleResultsReview}
            onRestart={handleRestart}
          />
        );
      
      case 'summary':
        return (
          <SummaryConfirmation
            analysisResult={analysisResult!}
            onConfirm={handleSummaryConfirm}
            onRestart={handleRestart}
          />
        );
      
      case 'preview':
        return (
          <ProfilePreview
            analysisResult={analysisResult!}
            onComplete={handleProfileComplete}
          />
        );
      
      case 'success':
        return (
          <JoinNetworkSuccess
            profileId={analysisResult?.profileId || ''}
            onRestart={handleRestart}
          />
        );
      
      default:
        return <CVUploadForm onSubmit={handleFormSubmit} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Indicator */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[
              { step: 'upload', label: 'Upload', number: 1 },
              { step: 'analyzing', label: 'Analysis', number: 2 },
              { step: 'results', label: 'Results', number: 3 },
              { step: 'summary', label: 'Confirmation', number: 4 },
              { step: 'preview', label: 'Preview', number: 5 },
              { step: 'success', label: 'Complete', number: 6 }
            ].map((stepInfo, index) => {
              const isActive = currentStep === stepInfo.step;
              const isCompleted = ['upload', 'analyzing', 'results', 'summary', 'preview', 'success'].indexOf(currentStep) > 
                                ['upload', 'analyzing', 'results', 'summary', 'preview', 'success'].indexOf(stepInfo.step);
              
              return (
                <React.Fragment key={stepInfo.step}>
                  <div className={`flex flex-col items-center ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-slate-400'
                  }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                      isActive 
                        ? 'bg-blue-600 text-white ring-4 ring-blue-200' 
                        : isCompleted 
                        ? 'bg-green-600 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {stepInfo.number}
                    </div>
                    <span className="text-xs mt-1 font-medium">{stepInfo.label}</span>
                  </div>
                  
                  {index < 5 && (
                    <div className={`w-12 h-0.5 ${
                      isCompleted ? 'bg-green-600' : 'bg-slate-200'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        {renderCurrentStep()}
      </div>
    </div>
  );
};
