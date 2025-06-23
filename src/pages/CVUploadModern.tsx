
import React from 'react';
import { CVUploadPage } from '@/components/cv-upload/CVUploadPage';
import Logo from '@/components/Logo';

const CVUploadModern = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo size="md" />
            <div className="text-sm text-slate-600">
              AI-Driven Konsultanalys
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <CVUploadPage />
    </div>
  );
};

export default CVUploadModern;
