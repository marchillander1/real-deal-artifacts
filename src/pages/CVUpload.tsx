
import React from 'react';
import { CVUploadPage } from '@/components/cv-upload-new/CVUploadPage';
import Logo from '@/components/Logo';

const CVUpload: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Enhanced Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo size="md" />
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center space-x-4 text-sm text-slate-600">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>AI-Driven Analysis</span>
                </div>
                <span>•</span>
                <span>GDPR-Safe</span>
                <span>•</span>
                <span>2-3 min analysis</span>
              </div>
              <div className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                Beta v2.0
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <CVUploadPage />
      
      {/* Footer */}
      <div className="border-t bg-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-slate-600">
            <p>© 2024 MatchWise AI. All rights reserved.</p>
            <div className="flex justify-center space-x-6 mt-4">
              <a href="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</a>
              <a href="/support" className="hover:text-blue-600 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVUpload;
