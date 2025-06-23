
import React, { useState } from 'react';
import { CVUploadStep } from '@/components/modern/CVUploadStep';
import { AnalysisStep } from '@/components/modern/AnalysisStep';
import { ConfirmStep } from '@/components/modern/ConfirmStep';
import { CVUploadFlow } from '@/components/cv-analysis/CVUploadFlow';
import { ModernNavbar } from '@/components/modern/ModernNavbar';
import { TrustSection } from '@/components/modern/TrustSection';
import { MatchWiseChat } from '@/components/MatchWiseChat';
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
  const [currentStep, setCurrentStep] = useState<'upload' | 'analyzing' | 'complete'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [progress, setProgress] = useState(0);
  const [consultant, setConsultant] = useState<any>(null);
  const { toast } = useToast();

  const handleFileUpload = (uploadedFile: File, linkedin: string) => {
    console.log('📁 Starting CV upload process for:', uploadedFile.name);
    setFile(uploadedFile);
    setLinkedinUrl(linkedin);
    setCurrentStep('analyzing');
    setProgress(0);
  };

  const handleUploadComplete = (createdConsultant: any) => {
    console.log('✅ Upload completed for consultant:', createdConsultant.id);
    setConsultant(createdConsultant);
    setCurrentStep('complete');
    
    toast({
      title: "Success! 🎉",
      description: `Profile created for ${createdConsultant.name}. Redirecting to analysis...`,
    });
  };

  const handleUploadError = (error: string) => {
    console.error('❌ Upload failed:', error);
    setCurrentStep('upload');
    setProgress(0);
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
                    progress={progress}
                  />
                )}
                
                {currentStep === 'complete' && consultant && (
                  <div className="p-8 text-center">
                    <div className="mb-6">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🎉</span>
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-2">
                        Profile Created Successfully!
                      </h2>
                      <p className="text-slate-600">
                        Welcome to MatchWise Network, {consultant.name}!
                      </p>
                    </div>
                    
                    <div className="bg-slate-50 rounded-xl p-6 mb-6">
                      <h3 className="font-semibold text-slate-900 mb-3">What's Next?</h3>
                      <ul className="text-sm text-slate-600 space-y-2">
                        <li>✅ Check your email for welcome instructions</li>
                        <li>✅ Your profile is now live in our network</li>
                        <li>✅ You'll be matched with relevant opportunities</li>
                        <li>✅ Access your profile anytime at my-profile</li>
                      </ul>
                    </div>
                    
                    <p className="text-sm text-slate-500">
                      Redirecting to your analysis page...
                    </p>
                  </div>
                )}
              </div>

              <TrustSection />
            </div>

            {/* AI Chat Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <MatchWiseChat 
                  analysisResults={consultant}
                  isMinimized={false}
                  showWelcome={currentStep === 'upload'}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background Processing */}
      {currentStep === 'analyzing' && file && (
        <CVUploadFlow
          file={file}
          linkedinUrl={linkedinUrl}
          onProgress={setProgress}
          onComplete={handleUploadComplete}
          onError={handleUploadError}
        />
      )}
    </div>
  );
};

export default CVUploadModern;
