
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
    setAnalysisData(data.analysisData || data);
    setCurrentStep('results');
  };

  const handleViewResults = () => {
    console.log('👀 Moving to profile preview');
    setCurrentStep('preview');
  };

  const handleEditProfile = () => {
    console.log('✏️ Going back to results for editing');
    setCurrentStep('results');
  };

  const handleProfileConfirm = () => {
    console.log('✅ Profile confirmed, moving to final confirmation');
    setCurrentStep('confirm');
  };

  const handleFinalConfirm = async (finalData: any) => {
    console.log('✅ Final confirmation, creating consultant profile');
    setConsultantId(finalData.consultantId);
    
    // Trigger skill alerts for the new consultant
    if (finalData.consultant) {
      console.log('🔔 Triggering skill alerts for new consultant');
      try {
        await triggerSkillAlerts(finalData.consultant);
      } catch (error) {
        console.warn('⚠️ Skill alerts failed but continuing:', error);
      }
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
        {/* Progress Indicator */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[
              { key: 'upload', label: 'Upload', step: 1 },
              { key: 'analysis', label: 'Analysis', step: 2 },
              { key: 'results', label: 'Results', step: 3 },
              { key: 'preview', label: 'Preview', step: 4 },
              { key: 'confirm', label: 'Confirm', step: 5 },
              { key: 'success', label: 'Success', step: 6 }
            ].map((item, index) => (
              <React.Fragment key={item.key}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold ${
                  currentStep === item.key 
                    ? 'bg-blue-600 text-white' 
                    : ['upload', 'analysis', 'results', 'preview', 'confirm'].indexOf(currentStep) > index
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {item.step}
                </div>
                {index < 5 && (
                  <div className={`h-1 w-12 ${
                    ['upload', 'analysis', 'results', 'preview', 'confirm'].indexOf(currentStep) > index
                      ? 'bg-green-500'
                      : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex items-center justify-center space-x-16 mt-2">
            {[
              'Upload',
              'Analysis', 
              'Results',
              'Preview',
              'Confirm',
              'Success'
            ].map((label, index) => (
              <span key={label} className="text-xs text-gray-600 font-medium">
                {label}
              </span>
            ))}
          </div>
        </div>

        {renderCurrentStep()}
      </div>
    </div>
  );
};
