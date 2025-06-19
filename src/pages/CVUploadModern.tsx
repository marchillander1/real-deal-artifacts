
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CVUploadStep } from '@/components/modern/CVUploadStep';
import { AnalysisStep } from '@/components/modern/AnalysisStep';
import { ConfirmStep } from '@/components/modern/ConfirmStep';
import { BackgroundAnalysis } from '@/components/modern/BackgroundAnalysis';
import { ModernNavbar } from '@/components/modern/ModernNavbar';
import { TrustSection } from '@/components/modern/TrustSection';
import { MatchWiseChat } from '@/components/MatchWiseChat';
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
  const [showChat, setShowChat] = useState(false);
  
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
    
    // Extract data from CV analysis with better parsing
    const cvData = results.cvAnalysis?.analysis;
    const detectedInfo = results.cvAnalysis?.detectedInformation;
    
    console.log('📊 CV Data:', cvData);
    console.log('🔍 Detected Info:', detectedInfo);
    
    // Smart extraction with better fallbacks and validation
    let extractedName = '';
    if (detectedInfo?.names?.[0] && 
        detectedInfo.names[0] !== 'Ej specificerat' && 
        detectedInfo.names[0] !== 'Not specified' &&
        detectedInfo.names[0] !== 'Subtype Image' &&
        detectedInfo.names[0].length > 2) {
      extractedName = detectedInfo.names[0];
    } else if (cvData?.personalInfo?.name && 
               cvData.personalInfo.name !== 'Ej specificerat' && 
               cvData.personalInfo.name !== 'Not specified' &&
               cvData.personalInfo.name !== 'Subtype Image' &&
               cvData.personalInfo.name.length > 2) {
      extractedName = cvData.personalInfo.name;
    }
    
    let extractedEmail = '';
    if (detectedInfo?.emails?.[0] && 
        detectedInfo.emails[0].includes('@') && 
        detectedInfo.emails[0] !== 'Ej specificerat' && 
        detectedInfo.emails[0] !== 'Not specified') {
      extractedEmail = detectedInfo.emails[0];
    } else if (cvData?.personalInfo?.email && 
               cvData.personalInfo.email.includes('@') && 
               cvData.personalInfo.email !== 'Ej specificerat' && 
               cvData.personalInfo.email !== 'Not specified') {
      extractedEmail = cvData.personalInfo.email;
    }
    
    let extractedPhone = '';
    if (detectedInfo?.phones?.[0] && 
        detectedInfo.phones[0] !== 'Ej specificerat' && 
        detectedInfo.phones[0] !== 'Not specified' &&
        detectedInfo.phones[0].length > 5) {
      extractedPhone = detectedInfo.phones[0];
    } else if (cvData?.personalInfo?.phone && 
               cvData.personalInfo.phone !== 'Ej specificerat' && 
               cvData.personalInfo.phone !== 'Not specified' &&
               cvData.personalInfo.phone.length > 5) {
      extractedPhone = cvData.personalInfo.phone;
    }
    
    let extractedLocation = '';
    if (cvData?.personalInfo?.location && 
        cvData.personalInfo.location !== 'Ej specificerat' && 
        cvData.personalInfo.location !== 'Not specified') {
      extractedLocation = cvData.personalInfo.location;
    }
    
    // Extract skills from multiple sources with better filtering
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
    
    // Clean and filter skills more thoroughly
    allSkills = allSkills.filter(skill => 
      skill && 
      skill.length > 1 && 
      skill.trim() !== '' &&
      skill !== 'Ej specificerat' && 
      skill !== 'Not specified' &&
      skill !== 'N/A' &&
      skill !== 'null' &&
      skill !== 'undefined'
    ).map(skill => skill.trim());
    
    // Remove duplicates
    allSkills = [...new Set(allSkills)];
    
    // Extract experience years with better parsing
    let experienceYears = 0;
    
    // Try multiple sources for experience years
    if (cvData?.experience?.years) {
      const yearsStr = cvData.experience.years.toString();
      const match = yearsStr.match(/(\d+)/);
      if (match) {
        experienceYears = parseInt(match[1]);
      }
    } else if (cvData?.professionalSummary?.yearsOfExperience) {
      const yearsStr = cvData.professionalSummary.yearsOfExperience.toString();
      const match = yearsStr.match(/(\d+)/);
      if (match) {
        experienceYears = parseInt(match[1]);
      }
    } else if (cvData?.workHistory && Array.isArray(cvData.workHistory)) {
      // Try to calculate from work history
      let totalYears = 0;
      cvData.workHistory.forEach((job: any) => {
        if (job.duration) {
          const durationMatch = job.duration.match(/(\d+)/);
          if (durationMatch) {
            totalYears += parseInt(durationMatch[1]);
          }
        }
      });
      experienceYears = totalYears;
    }
    
    // Ensure experience years is reasonable (between 0 and 50)
    if (experienceYears < 0 || experienceYears > 50) {
      experienceYears = 0;
    }
    
    console.log('✅ Extracted data:', {
      name: extractedName,
      email: extractedEmail,
      phone: extractedPhone,
      location: extractedLocation,
      skills: allSkills,
      experience_years: experienceYears
    });
    
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
        <div className="max-w-7xl mx-auto">
          
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content */}
            <div className="lg:col-span-2">
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

            {/* AI Chat Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <MatchWiseChat 
                  analysisResults={analysisResults}
                  isMinimized={false}
                />
              </div>
            </div>
          </div>
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
