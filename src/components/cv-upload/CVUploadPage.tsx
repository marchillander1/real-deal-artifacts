
import React, { useState } from 'react';
import { CVUploadStep } from './CVUploadStep';
import { CVAnalysisStep } from './CVAnalysisStep';
import { ConfirmStep } from '../modern/ConfirmStep';
import { ExtractedData } from '@/types/extractedData';

type UploadStep = 'upload' | 'analyzing' | 'confirm' | 'success';

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
    file: File;
    linkedinUrl: string;
    personalDescription: string;
  } | null>(null);

  const [extractedData, setExtractedData] = useState<ExtractedData>({
    name: '',
    email: '',
    phone: '',
    location: '',
    skills: [],
    experience: '',
    education: [],
    certifications: [],
    languages: [],
    workHistory: []
  });

  const handleUploadNext = (data: {
    file: File;
    linkedinUrl: string;
    personalDescription: string;
  }) => {
    setUploadData(data);
    setCurrentStep('analyzing');
  };

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result);
    
    // Transform result to ExtractedData format
    const transformedData: ExtractedData = {
      name: result.extractedPersonalInfo.name || '',
      email: result.extractedPersonalInfo.email || '',
      phone: result.extractedPersonalInfo.phone || '',
      location: result.extractedPersonalInfo.location || '',
      skills: result.cvAnalysis.technicalSkills || [],
      experience: result.cvAnalysis.experience || '',
      education: result.cvAnalysis.education || [],
      certifications: [],
      languages: ['Svenska', 'Engelska'],
      workHistory: []
    };
    
    setExtractedData(transformedData);
    setCurrentStep('confirm');
  };

  const handleUpdateData = (field: keyof ExtractedData, value: any) => {
    setExtractedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConfirm = () => {
    console.log('CV upload and analysis complete:', extractedData);
    setCurrentStep('success');
  };

  const generateConsultantId = () => {
    return 'consultant-' + Date.now();
  };

  switch (currentStep) {
    case 'upload':
      return <CVUploadStep onNext={handleUploadNext} />;
    
    case 'analyzing':
      return uploadData ? (
        <CVAnalysisStep
          file={uploadData.file}
          linkedinUrl={uploadData.linkedinUrl}
          personalDescription={uploadData.personalDescription}
          onComplete={handleAnalysisComplete}
        />
      ) : null;
    
    case 'confirm':
      return (
        <ConfirmStep
          extractedData={extractedData}
          onUpdateData={handleUpdateData}
          onConfirm={handleConfirm}
          consultantId={generateConsultantId()}
        />
      );
    
    case 'success':
      return (
        <div className="max-w-2xl mx-auto p-6 text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-green-900 mb-4">
              Grattis! Din profil är nu skapad! 🎉
            </h2>
            <p className="text-green-700 mb-6">
              Du har nu blivit del av MatchWise-nätverket och kan börja ta emot uppdrag.
            </p>
          </div>
        </div>
      );
    
    default:
      return null;
  }
};
