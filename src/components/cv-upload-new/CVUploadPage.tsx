import React, { useState } from 'react';
import { CVUploadForm } from './CVUploadForm';
import { AnalysisProgress } from './AnalysisProgress';
import { AnalysisResults } from './AnalysisResults';
import { ProfilePreview } from './ProfilePreview';
import { SummaryConfirmation } from './SummaryConfirmation';
import { JoinNetworkSuccess } from './JoinNetworkSuccess';
import { useSkillAlertTrigger } from '@/hooks/useSkillAlertTrigger';

type Step = 'upload' | 'analysis' | 'results' | 'preview' | 'confirm' | 'success';

export const CVUploadPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [sessionToken, setSessionToken] = useState<string>('');
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [consultantId, setConsultantId] = useState<string>('');
  const { triggerSkillAlerts } = useSkillAlertTrigger();

  const handleUploadComplete = (token: string) => {
    console.log('📤 Upload complete, moving to analysis');
    setSessionToken(token);
    setCurrentStep('analysis');
  };

  const handleAnalysisComplete = (data: any) => {
    console.log('🔍 Analysis complete:', data);
    setAnalysisData(data);
    setCurrentStep('results');
  };

  const handleViewResults = () => {
    setCurrentStep('preview');
  };

  const handleEditProfile = () => {
    setCurrentStep('results');
  };

  const handleProfileConfirm = () => {
    setCurrentStep('confirm');
  };

  const handleFinalConfirm = async (finalData: any) => {
    console.log('✅ Final confirmation, creating consultant profile');
    setConsultantId(finalData.consultantId);
    
    // Trigger skill alerts for the new consultant
    if (finalData.consultant) {
      console.log('🔔 Triggering skill alerts for new consultant');
      await triggerSkillAlerts(finalData.consultant);
    }
    
    setCurrentStep('success');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'upload':
        return <CVUploadForm onUploadComplete={handleUploadComplete} />;
      case 'analysis':
        return (
          <AnalysisProgress 
            sessionToken={sessionToken}
            onAnalysisComplete={handleAnalysisComplete}
          />
        );
      case 'results':
        return (
          <AnalysisResults 
            analysisData={analysisData}
            onViewResults={handleViewResults}
          />
        );
      case 'preview':
        return (
          <ProfilePreview 
            analysisData={analysisData}
            onEditProfile={handleEditProfile}
            onConfirmProfile={handleProfileConfirm}
          />
        );
      case 'confirm':
        return (
          <SummaryConfirmation 
            analysisData={analysisData}
            onFinalConfirm={handleFinalConfirm}
          />
        );
      case 'success':
        return <JoinNetworkSuccess consultantId={consultantId} />;
      default:
        return <CVUploadForm onUploadComplete={handleUploadComplete} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {renderCurrentStep()}
      </div>
    </div>
  );
};
