import React, { useState } from 'react';
import { Upload, FileText, Link as LinkIcon, Clock } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface CVUploadFormProps {
  onUploadComplete: (file: File, personalTagline?: string) => void;
}

export const CVUploadForm: React.FC<CVUploadFormProps> = ({ onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [agreeToGDPR, setAgreeToGDPR] = useState(false);
  const [personalTagline, setPersonalTagline] = useState('');

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
      console.log('🚀 Starting comprehensive AI analysis for file:', file.name);
      console.log('📝 Personal tagline provided:', !!personalTagline);
      onUploadComplete(file, personalTagline);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Analyze your consultant profile with AI
          </h2>
          <p className="text-lg text-slate-600">
            Get deep insights into your technical skills and market value
          </p>
        </div>

        <div className="space-y-6">
          {/* File Upload */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Upload your CV (PDF or DOCX) *
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
                      <p className="text-sm text-green-600">Ready for AI analysis</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-slate-700 mb-2">
                      Drag and drop your CV here
                    </p>
                    <p className="text-slate-500">
                      or click to browse files (max 10MB)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* LinkedIn URL - Coming Soon */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              LinkedIn profile integration
            </label>
            <div className="relative">
              <div className="w-full p-4 border border-slate-300 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center space-x-2">
                <LinkIcon className="h-5 w-5" />
                <span>🚀 Coming soon - LinkedIn profile analysis</span>
              </div>
            </div>
            <p className="text-sm text-slate-500">
              LinkedIn integration will be available soon to provide even more comprehensive analysis.
            </p>
          </div>

          {/* Personal Tagline */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Personal tagline (optional, improves AI analysis)
            </label>
            <Textarea
              placeholder="Briefly describe what drives you as a consultant and your career goals..."
              value={personalTagline}
              onChange={(e) => setPersonalTagline(e.target.value)}
              className="w-full p-4 border border-slate-300 rounded-xl resize-none"
              rows={3}
              maxLength={200}
            />
            <div className="flex justify-between text-sm text-slate-500">
              <span>A personal description helps the AI provide more tailored recommendations</span>
              <span>{personalTagline.length}/200 characters</span>
            </div>
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
                  I agree to let MatchWise analyze my CV *
                </label>
                <p className="mt-1 text-slate-600">
                  By checking this box, I consent to MatchWise AI analyzing my CV to create a personalized career report. 
                  Your data is processed according to our privacy policy and will not be shared with third parties without your consent.
                </p>
                <div className="mt-2 flex items-center space-x-2 text-blue-600">
                  <span className="text-xs">🔒</span>
                  <span className="text-xs font-medium">GDPR-compliant data processing</span>
                </div>
              </div>
            </div>
          </div>

          {/* Start Analysis Button */}
          <div className="pt-4">
            <Button
              onClick={handleStartAnalysis}
              disabled={!file || !agreeToGDPR}
              className={`w-full py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-200 transform ${
                file && agreeToGDPR
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:scale-105 active:scale-95'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {!file 
                ? 'Upload CV first' 
                : !agreeToGDPR 
                ? 'Please accept data processing consent'
                : 'Upload CV'
              }
            </Button>
          </div>

          {file && agreeToGDPR && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                💡 Tips for best results:
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Use your latest CV with updated skills</li>
                <li>• Write a personal tagline describing your goals</li>
                <li>• Analysis takes 2-3 minutes and is fully automated</li>
                <li>• LinkedIn integration coming soon for deeper analysis</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
