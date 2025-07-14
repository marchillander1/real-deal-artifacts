
import React, { useState } from 'react';
import { CVUploadForm } from './CVUploadForm';
import { AnalysisProgress } from './AnalysisProgress';
import { AnalysisResults } from './AnalysisResults';
import { ProfilePreview } from './ProfilePreview';
import { SummaryConfirmation } from './SummaryConfirmation';
import { SetPasswordStep } from './SetPasswordStep';
import { JoinNetworkSuccess } from './JoinNetworkSuccess';

export const CVUploadPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'upload' | 'analysis' | 'results' | 'preview' | 'confirmation' | 'password' | 'complete'>('upload');
  const [sessionToken, setSessionToken] = useState<string>('');
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [personalTagline, setPersonalTagline] = useState<string>('');
  const [consultantId, setConsultantId] = useState<string>('');

  const handleUploadComplete = async (file: File, tagline: string = '') => {
    console.log('🚀 Starting real CV analysis with file:', file.name);
    console.log('📝 Personal tagline provided:', !!tagline);
    
    // Generate session token and start real analysis
    const token = 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    setSessionToken(token);
    setUploadedFile(file);
    setPersonalTagline(tagline);
    setCurrentStep('analysis');

    // Store file info only (not the actual file data to avoid quota issues)
    sessionStorage.setItem(`cv-file-${token}`, JSON.stringify({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    }));

    // Store personal tagline for enhanced analysis
    if (tagline) {
      sessionStorage.setItem(`cv-tagline-${token}`, tagline);
    }

    console.log('✅ Session data stored, starting analysis...');
  };

  const handleAnalysisComplete = (results: any) => {
    console.log('✅ Real CV analysis completed:', results);
    setAnalysisData(results.analysis);
    
    // Set consultant ID from the results
    if (results.consultant?.id) {
      setConsultantId(results.consultant.id);
    }
    
    setCurrentStep('results');
  };

  const handleResultsReviewed = () => {
    setCurrentStep('preview');
  };

  const handleProfileEdit = () => {
    setCurrentStep('results');
  };

  const handleProfileConfirmed = () => {
    setCurrentStep('confirmation');
  };

  const handleFinalConfirm = async (finalData: any) => {
    console.log('✅ Final confirmation with consultant data:', finalData);
    if (finalData.consultantId) {
      setConsultantId(finalData.consultantId);
    }
    setCurrentStep('password');
  };

  const handlePasswordComplete = () => {
    // Navigate to my-profile after successful account creation
    window.location.href = '/my-profile';
  };

  const handleRestartProcess = () => {
    setCurrentStep('upload');
    setSessionToken('');
    setAnalysisData(null);
    setUploadedFile(null);
    setPersonalTagline('');
    setConsultantId('');
    // Clear session storage
    if (sessionToken) {
      sessionStorage.removeItem(`cv-file-${sessionToken}`);
      sessionStorage.removeItem(`cv-tagline-${sessionToken}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          {[
            { step: 1, label: 'Upload', key: 'upload' },
            { step: 2, label: 'Analysis', key: 'analysis' },
            { step: 3, label: 'Results', key: 'results' },
            { step: 4, label: 'Preview', key: 'preview' },
            { step: 5, label: 'Confirmation', key: 'confirmation' },
            { step: 6, label: 'Complete', key: 'complete' }
          ].map((item) => (
            <div key={item.key} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep === item.key 
                  ? 'bg-blue-600 text-white' 
                  : ['upload', 'analysis', 'results', 'preview', 'confirmation'].indexOf(currentStep) > ['upload', 'analysis', 'results', 'preview', 'confirmation'].indexOf(item.key)
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {item.step}
              </div>
              <span className="text-xs mt-2 text-gray-600">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      {currentStep === 'upload' && (
        <CVUploadForm onUploadComplete={handleUploadComplete} />
      )}
      
      {currentStep === 'analysis' && (
        <AnalysisProgress 
          sessionToken={sessionToken}
          personalTagline={personalTagline}
          uploadedFile={uploadedFile}
          onAnalysisComplete={handleAnalysisComplete}
        />
      )}
      
      {currentStep === 'results' && analysisData && (
        <AnalysisResults 
          analysisData={analysisData}
          onViewResults={handleResultsReviewed}
        />
      )}

      {currentStep === 'preview' && analysisData && (
        <ProfilePreview
          analysisData={analysisData}
          onEditProfile={handleProfileEdit}
          onConfirmProfile={handleProfileConfirmed}
        />
      )}

      {currentStep === 'confirmation' && analysisData && (
        <SummaryConfirmation
          analysisData={analysisData}
          onFinalConfirm={handleFinalConfirm}
        />
      )}

      {currentStep === 'password' && analysisData && consultantId && (
        <SetPasswordStep
          consultantId={consultantId}
          email={analysisData.personalInfo?.email || analysisData.email || ''}
          fullName={analysisData.personalInfo?.name || analysisData.name || ''}
          onComplete={handlePasswordComplete}
        />
      )}

      {currentStep === 'complete' && consultantId && (
        <JoinNetworkSuccess
          consultantId={consultantId}
        />
      )}
    </div>
  );
};
