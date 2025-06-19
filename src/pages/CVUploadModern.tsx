
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
    
    // Get the consultant data that was just created
    const consultant = results.consultant;
    
    if (consultant) {
      console.log('📊 Using consultant data:', consultant);
      
      // Use the consultant data directly since it's already processed
      setExtractedData({
        name: consultant.name || '',
        email: consultant.email || '',
        phone: consultant.phone || '',
        skills: consultant.skills || [],
        experience_years: consultant.experience_years || 0,
        location: consultant.location || ''
      });
      
      console.log('✅ Extracted data set:', {
        name: consultant.name,
        email: consultant.email,
        phone: consultant.phone,
        skills: consultant.skills,
        experience_years: consultant.experience_years,
        location: consultant.location
      });
    } else {
      console.warn('⚠️ No consultant data found in results');
    }
    
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
