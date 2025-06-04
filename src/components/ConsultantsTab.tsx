
import React, { useRef } from 'react';
import { Upload, Users, Award, Lightbulb } from 'lucide-react';
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

      {/* CV Tips Section */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <div className="bg-yellow-100 p-2 rounded-lg">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">CV Tips for Better Matching</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-yellow-700">
              <div>
                <h4 className="font-medium mb-2">📝 Content Structure</h4>
                <ul className="space-y-1">
                  <li>• List all technical skills clearly</li>
                  <li>• Include years of experience</li>
                  <li>• Mention relevant certifications</li>
                  <li>• Add project descriptions</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">🎯 Best Practices</h4>
                <ul className="space-y-1">
                  <li>• Use keywords from job descriptions</li>
                  <li>• Include programming languages</li>
                  <li>• Mention frameworks & tools</li>
                  <li>• Add industry experience</li>
                </ul>
              </div>
            </div>
          </div>
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
              <h3 className="text-lg font-semibold text-gray-900">Our Consultants</h3>
              <p className="text-sm text-gray-600">Our established team of experienced professionals</p>
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
              <h3 className="text-lg font-semibold text-gray-900">Network Consultants</h3>
              <p className="text-sm text-gray-600">External consultants who joined through our platform</p>
            </div>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              {newConsultants.length} network
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
          <p className="text-gray-600">Upload CVs to add consultants to the network.</p>
        </div>
      )}
    </div>
  );
};

export default ConsultantsTab;
