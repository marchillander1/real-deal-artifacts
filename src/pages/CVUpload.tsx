
import React, { useState } from 'react';
import { CVUploadForm } from '@/components/cv-upload-new/CVUploadForm';
import { AnalysisProgress } from '@/components/cv-upload-new/AnalysisProgress';
import { SummaryConfirmation } from '@/components/cv-upload-new/SummaryConfirmation';
import { ProfilePreview } from '@/components/cv-upload-new/ProfilePreview';
import { JoinNetworkSuccess } from '@/components/cv-upload-new/JoinNetworkSuccess';
import Logo from '@/components/Logo';

type FlowStep = 'upload' | 'analyzing' | 'summary' | 'preview' | 'success';

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

export default function CVUpload() {
  const [currentStep, setCurrentStep] = useState<FlowStep>('upload');
  const [uploadData, setUploadData] = useState<UploadData>({
    file: null,
    linkedinUrl: '',
    personalTagline: '',
    gdprConsent: false
  });
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleUploadSubmit = (data: UploadData) => {
    setUploadData(data);
    setCurrentStep('analyzing');
  };

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result);
    setCurrentStep('summary');
  };

  const handleSummaryConfirm = () => {
    setCurrentStep('preview');
  };

  const handleJoinNetwork = () => {
    setCurrentStep('success');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'upload':
        return <CVUploadForm onSubmit={handleUploadSubmit} />;
      
      case 'analyzing':
        return (
          <AnalysisProgress
            uploadData={uploadData}
            onComplete={handleAnalysisComplete}
          />
        );
      
      case 'summary':
        return (
          <SummaryConfirmation
            analysisResult={analysisResult!}
            onConfirm={handleSummaryConfirm}
          />
        );
      
      case 'preview':
        return (
          <ProfilePreview
            analysisResult={analysisResult!}
            onJoinNetwork={handleJoinNetwork}
          />
        );
      
      case 'success':
        return <JoinNetworkSuccess />;
      
      default:
        return <CVUploadForm onSubmit={handleUploadSubmit} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo size="md" />
            <div className="text-sm text-slate-600">
              AI-Driven Konsultanalys
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {renderStep()}
      </div>
    </div>
  );
}
