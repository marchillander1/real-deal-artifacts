
import React, { useState } from 'react';
import { Upload, FileText, Link as LinkIcon, MessageSquare } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

interface CVUploadStepProps {
  onFileUpload: (file: File, linkedinUrl: string, personalDescription: string) => void;
}

export const CVUploadStep: React.FC<CVUploadStepProps> = ({ onFileUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [personalDescription, setPersonalDescription] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [agreeToGDPR, setAgreeToGDPR] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (isValidFileType(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (isValidFileType(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const isValidFileType = (file: File) => {
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    return validTypes.includes(file.type);
  };

  const handleStartAnalysis = () => {
    if (file && agreeToGDPR) {
      onFileUpload(file, linkedinUrl, personalDescription);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Let AI unlock your potential
          </h1>
          <p className="text-lg text-slate-600">
            Start by uploading your latest CV (PDF or Word). You can also add your LinkedIn profile for improved analysis.
          </p>
        </div>

        <div className="space-y-8">
          {/* File Upload */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Upload CV (PDF, DOC, DOCX) *
            </label>
            
            <div
              className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-200 ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : file 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-slate-300 hover:border-slate-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <div className="text-center">
                {file ? (
                  <div className="flex items-center justify-center space-x-3">
                    <FileText className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-700">{file.name}</p>
                      <p className="text-sm text-green-600">Ready for analysis</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-slate-700 mb-2">
                      Drag and drop your CV here
                    </p>
                    <p className="text-slate-500">
                      or click to browse files
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* LinkedIn URL */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              LinkedIn URL (optional)
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/your-profile"
                className="w-full pl-12 pr-4 py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <p className="text-sm text-slate-500">
              Adding your LinkedIn profile improves analysis quality and provides better career insights.
            </p>
          </div>

          {/* Personal Description */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Personal description (optional)
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
              <Textarea
                value={personalDescription}
                onChange={(e) => setPersonalDescription(e.target.value)}
                placeholder="Tell us a bit about yourself, your goals and ambitions..."
                className="w-full pl-12 pr-4 py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[120px]"
              />
            </div>
            <p className="text-sm text-slate-500">
              A personal description helps the AI provide more tailored insights and recommendations.
            </p>
          </div>

          {/* GDPR Consent */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <Checkbox
                id="gdpr-consent"
                checked={agreeToGDPR}
                onCheckedChange={(checked) => setAgreeToGDPR(checked as boolean)}
                className="mt-1"
              />
              <div className="text-sm text-slate-700">
                <label htmlFor="gdpr-consent" className="cursor-pointer font-medium">
                  I agree to let MatchWise analyze my CV and LinkedIn profile
                </label>
                <p className="mt-1 text-slate-600">
                  By checking this box, I consent to MatchWise AI analyzing my CV and LinkedIn profile to create a personalized career report. 
                  Your data is processed according to our privacy policy and will not be shared with third parties without your consent.
                </p>
              </div>
            </div>
          </div>

          {/* Start Analysis Button */}
          <div className="pt-4">
            <button
              onClick={handleStartAnalysis}
              disabled={!file || !agreeToGDPR}
              className={`w-full py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-200 transform ${
                file && agreeToGDPR
                  ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white hover:shadow-lg hover:scale-105 active:scale-95'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {!file 
                ? 'Please upload your CV first' 
                : !agreeToGDPR 
                ? 'Please accept data processing consent'
                : 'Start Analysis'
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
