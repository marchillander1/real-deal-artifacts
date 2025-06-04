import React, { useRef } from 'react';
import { Upload, Plus, Users, Award } from 'lucide-react';
import ConsultantCard from './ConsultantCard';
import { Consultant } from '../types/consultant';

interface ConsultantsTabProps {
  existingConsultants: Consultant[];
  newConsultants: Consultant[];
  isMatching: boolean;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ConsultantsTab: React.FC<ConsultantsTabProps> = ({
  existingConsultants,
  newConsultants,
  isMatching,
  onFileUpload
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Consultant Database</h2>
          <p className="text-gray-600">AI-powered consultant profiles with automated skill extraction</p>
        </div>
        <div className="flex items-center space-x-3">
          <a 
            href="/cv-upload"
            className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Join Network</span>
          </a>
          <input
            type="file"
            accept=".pdf"
            onChange={onFileUpload}
            ref={fileInputRef}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isMatching}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />
            <span>{isMatching ? 'Processing...' : 'Upload CV'}</span>
          </button>
        </div>
      </div>

      {/* Existing Consultants Section */}
      {existingConsultants.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Award className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Verified Consultants</h3>
              <p className="text-sm text-gray-600">Our established network of experienced professionals</p>
            </div>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {existingConsultants.length} consultants
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {existingConsultants.map((consultant) => (
              <ConsultantCard key={consultant.id} consultant={consultant} />
            ))}
          </div>
        </div>
      )}

      {/* New Consultants Section */}
      {newConsultants.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">New Applicants</h3>
              <p className="text-sm text-gray-600">Recent consultants who joined through our platform</p>
            </div>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              {newConsultants.length} new
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {newConsultants.map((consultant) => (
              <ConsultantCard key={consultant.id} consultant={consultant} isNew />
            ))}
          </div>
        </div>
      )}

      {existingConsultants.length === 0 && newConsultants.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Consultants Yet</h3>
          <p className="text-gray-600">Upload CVs or invite consultants to join the network.</p>
        </div>
      )}
    </div>
  );
};

export default ConsultantsTab;
