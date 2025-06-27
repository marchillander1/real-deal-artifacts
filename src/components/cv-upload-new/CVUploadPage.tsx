
import React from 'react';
import { UnifiedCVUpload } from '../cv-upload/UnifiedCVUpload';
import { MatchWiseChat } from '../MatchWiseChat';

export const CVUploadPage: React.FC = () => {
  const handleUploadComplete = (consultant: any) => {
    console.log('✅ Consultant joined network:', consultant);
    
    // Redirect to success page or consultant profile
    setTimeout(() => {
      window.location.href = `/consultant/${consultant.id}`;
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Join the MatchWise Network
              </h1>
              <p className="text-lg text-gray-600">
                Upload your CV and LinkedIn profile to get AI-powered career insights and join our consultant network.
              </p>
            </div>
            
            <UnifiedCVUpload
              isMyConsultant={false}
              onComplete={handleUploadComplete}
            />
          </div>
          
          {/* AI Chat Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <MatchWiseChat 
                showWelcome={true}
                isMinimized={false}
                onToggleMinimize={() => {}}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
