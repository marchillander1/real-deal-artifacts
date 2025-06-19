
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CVUploadStep } from '@/components/modern/CVUploadStep';
import { AnalysisStep } from '@/components/modern/AnalysisStep';
import { ConfirmStep } from '@/components/modern/ConfirmStep';
import { BackgroundAnalysis } from '@/components/modern/BackgroundAnalysis';
import { ModernNavbar } from '@/components/modern/ModernNavbar';
import { TrustSection } from '@/components/modern/TrustSection';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ExtractedData {
  name: string;
  email: string;
  phone: string;
  skills: string[];
  experience_years: number;
  location: string;
}

const CVUploadModern: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'upload' | 'analyzing' | 'confirm'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [extractedData, setExtractedData] = useState<ExtractedData>({
    name: '',
    email: '',
    phone: '',
    skills: [],
    experience_years: 0,
    location: ''
  });
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
  const [consultantId, setConsultantId] = useState<string>('');
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileUpload = (uploadedFile: File, linkedin: string) => {
    setFile(uploadedFile);
    setLinkedinUrl(linkedin);
    setCurrentStep('analyzing');
  };

  const handleAnalysisComplete = (results: any) => {
    console.log('🎉 Analysis complete:', results);
    setAnalysisResults(results);
    setIsAnalysisComplete(true);
    
    // Extract data for editing
    const cvData = results.cvAnalysis?.analysis;
    const detectedInfo = results.cvAnalysis?.detectedInformation;
    
    // Smart extraction with fallbacks
    const extractedName = detectedInfo?.names?.[0] || cvData?.personalInfo?.name || '';
    const extractedEmail = detectedInfo?.emails?.[0] || cvData?.personalInfo?.email || '';
    const extractedPhone = detectedInfo?.phones?.[0] || cvData?.personalInfo?.phone || '';
    const extractedLocation = cvData?.personalInfo?.location || '';
    
    // Extract skills from multiple sources
    let allSkills: string[] = [];
    if (cvData?.skills) {
      allSkills = [
        ...(cvData.skills.technical || []),
        ...(cvData.skills.languages || []),
        ...(cvData.skills.tools || [])
      ];
    } else if (cvData?.technicalExpertise) {
      const tech = cvData.technicalExpertise;
      allSkills = [
        ...(tech.programmingLanguages?.expert || []),
        ...(tech.programmingLanguages?.proficient || []),
        ...(tech.frameworks || []),
        ...(tech.tools || []),
        ...(tech.databases || [])
      ];
    }
    
    // Clean skills
    allSkills = allSkills.filter(skill => 
      skill && skill.length > 0 && 
      skill !== 'Ej specificerat' && 
      skill !== 'Not specified'
    );
    
    // Extract experience years
    let experienceYears = 0;
    if (cvData?.experience?.years) {
      experienceYears = parseInt(cvData.experience.years.toString().match(/\d+/)?.[0] || '0');
    } else if (cvData?.professionalSummary?.yearsOfExperience) {
      experienceYears = parseInt(cvData.professionalSummary.yearsOfExperience.toString().match(/\d+/)?.[0] || '0');
    }
    
    setExtractedData({
      name: extractedName,
      email: extractedEmail,
      phone: extractedPhone,
      skills: allSkills,
      experience_years: experienceYears,
      location: extractedLocation
    });
    
    setConsultantId(results.consultant?.id || '');
    setCurrentStep('confirm');
  };

  const handleConfirm = () => {
    // Navigate to analysis page with consultant ID
    navigate(`/analysis?id=${consultantId}`);
  };

  const updateExtractedData = (field: keyof ExtractedData, value: any) => {
    setExtractedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
      <ModernNavbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              Let AI unlock your 
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent"> freelance potential</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Upload your CV and LinkedIn profile – and receive a personalized AI-driven career report with improvement tips, rate estimation, and a roadmap for growth.
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            {currentStep === 'upload' && (
              <CVUploadStep onFileUpload={handleFileUpload} />
            )}
            
            {currentStep === 'analyzing' && (
              <AnalysisStep 
                file={file!}
                linkedinUrl={linkedinUrl}
                onAnalysisComplete={handleAnalysisComplete}
              />
            )}
            
            {currentStep === 'confirm' && (
              <ConfirmStep
                extractedData={extractedData}
                onUpdateData={updateExtractedData}
                onConfirm={handleConfirm}
                consultantId={consultantId}
              />
            )}
          </div>

          {/* Trust Section */}
          <TrustSection />
        </div>
      </div>
      
      {/* Background Analysis Component */}
      {currentStep === 'analyzing' && file && (
        <BackgroundAnalysis
          file={file}
          linkedinUrl={linkedinUrl}
          onComplete={handleAnalysisComplete}
        />
      )}
    </div>
  );
};

export default CVUploadModern;
