
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
    console.log('📁 File uploaded:', uploadedFile.name, 'LinkedIn:', linkedin);
    setFile(uploadedFile);
    setLinkedinUrl(linkedin);
    setCurrentStep('analyzing');
  };

  const handleAnalysisComplete = (results: any) => {
    console.log('🎉 Analysis complete with enhanced results:', results);
    setAnalysisResults(results);
    setIsAnalysisComplete(true);
    
    // Get the consultant data and extracted personal info
    const consultant = results.consultant;
    const extractedPersonalInfo = results.extractedPersonalInfo;
    const cvAnalysis = results.cvAnalysis;
    
    console.log('📊 Consultant data:', consultant);
    console.log('📊 Extracted personal info:', extractedPersonalInfo);
    console.log('📊 CV Analysis:', cvAnalysis);
    
    if (extractedPersonalInfo) {
      // Use the already extracted and processed personal info
      const enhancedData = {
        name: extractedPersonalInfo.name || consultant?.name || '',
        email: extractedPersonalInfo.email || consultant?.email || '',
        phone: extractedPersonalInfo.phone || consultant?.phone || '',
        skills: consultant?.skills || cvAnalysis?.primary_tech_stack || [],
        experience_years: consultant?.experience_years || cvAnalysis?.years_of_experience || 0,
        location: extractedPersonalInfo.location || consultant?.location || 'Sweden'
      };
      
      console.log('✅ Setting enhanced extracted data:', enhancedData);
      setExtractedData(enhancedData);
      
      // Show success toast with name if available
      if (enhancedData.name) {
        toast({
          title: "Personlig information extraherad! ✅",
          description: `Namn: ${enhancedData.name}${enhancedData.email ? `, E-post: ${enhancedData.email}` : ''}`,
        });
      }
    } else {
      console.warn('⚠️ No extracted personal info found in results');
    }
    
    setConsultantId(results.consultant?.id || '');
    setCurrentStep('confirm');
  };

  const handleConfirm = () => {
    // Navigate to analysis page with consultant ID
    navigate(`/analysis?id=${consultantId}`);
  };

  const updateExtractedData = async (field: keyof ExtractedData, value: any) => {
    console.log('🔄 Updating extracted data:', field, value);
    
    // Update local state
    setExtractedData(prev => ({
      ...prev,
      [field]: value
    }));

    // Also update in database if consultant exists
    if (consultantId) {
      try {
        console.log('💾 Updating consultant in database:', consultantId, field, value);
        
        const updateData: any = {};
        
        // Map the field to the correct database column
        switch (field) {
          case 'name':
            updateData.name = value;
            break;
          case 'email':
            updateData.email = value;
            break;
          case 'phone':
            updateData.phone = value;
            break;
          case 'location':
            updateData.location = value;
            break;
          case 'skills':
            updateData.skills = value;
            break;
          case 'experience_years':
            updateData.experience_years = value;
            break;
        }

        const { error } = await supabase
          .from('consultants')
          .update(updateData)
          .eq('id', consultantId);

        if (error) {
          console.error('❌ Error updating consultant:', error);
        } else {
          console.log('✅ Consultant updated successfully in database');
        }
      } catch (error) {
        console.error('❌ Failed to update consultant in database:', error);
      }
    }
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
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent"> potential</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Upload your CV and LinkedIn profile – get a personalized AI-driven career report with improvement tips, market value assessment, and a roadmap for growth.
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

            {/* AI Chat Sidebar - Always visible */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <MatchWiseChat 
                  analysisResults={analysisResults}
                  isMinimized={false}
                  showWelcome={currentStep === 'upload'}
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
