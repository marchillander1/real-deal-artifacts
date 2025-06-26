
import React, { useState } from 'react';
import { Upload, FileText, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface CVUploadFormProps {
  onSubmit: (data: {
    file: File | null;
    linkedinUrl: string;
    personalTagline: string;
    gdprConsent: boolean;
  }) => void;
}

export const CVUploadForm: React.FC<CVUploadFormProps> = ({ onSubmit }) => {
  const [file, setFile] = useState<File | null>(null);
  const [personalTagline, setPersonalTagline] = useState('');
  const [gdprConsent, setGdprConsent] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

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
      handleFileSelection(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      handleFileSelection(selectedFile);
    }
  };

  const handleFileSelection = (selectedFile: File) => {
    const errors: string[] = [];
    
    // Validate file type
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!validTypes.includes(selectedFile.type)) {
      errors.push('Only PDF, DOC or DOCX files allowed');
    }
    
    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      errors.push('File is too large (max 10MB)');
    }
    
    if (errors.length === 0) {
      setFile(selectedFile);
      setValidationErrors([]);
    } else {
      setValidationErrors(errors);
      setFile(null);
    }
  };

  const getFormCompleteness = () => {
    let completeness = 0;
    if (file) completeness += 60;
    if (personalTagline.trim()) completeness += 30;
    if (gdprConsent) completeness += 10;
    return completeness;
  };

  const isFormValid = () => {
    return file && gdprConsent && validationErrors.length === 0;
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      onSubmit({
        file,
        linkedinUrl: '', // Empty since we removed LinkedIn
        personalTagline,
        gdprConsent
      });
    }
  };

  const completeness = getFormCompleteness();

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="text-3xl font-bold">
            Analyze your consultant profile with AI
          </CardTitle>
          <p className="text-lg opacity-90">
            Get deep insights into your technical skills and market value
          </p>
          
          {/* Progress indicator */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Profile completion</span>
              <span className="text-sm font-medium">{completeness}%</span>
            </div>
            <Progress value={completeness} className="w-full h-2 bg-white/20" />
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-6">
          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center mb-2">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-red-800 font-medium">Please correct the following errors:</span>
              </div>
              <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* CV Upload */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700">
              Upload your CV (PDF or DOCX) *
            </label>
            
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 ${
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
                      <p className="text-sm text-green-600">
                        {(file.size / (1024 * 1024)).toFixed(1)} MB - Ready for analysis
                      </p>
                    </div>
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                ) : (
                  <div>
                    <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-slate-700 mb-2">
                      Drag and drop your CV here
                    </p>
                    <p className="text-slate-500">
                      or click to browse (max 10MB)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* LinkedIn URL - Coming Soon */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700">
              LinkedIn profile integration
            </label>
            <div className="relative">
              <div className="w-full p-4 border border-slate-300 rounded-xl bg-slate-50 text-slate-500 text-center">
                🚀 Coming soon - LinkedIn profile analysis
              </div>
            </div>
            <p className="text-sm text-slate-500">
              LinkedIn integration will be available soon to provide even more comprehensive analysis.
            </p>
          </div>

          {/* Personal Tagline */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700">
              Personal tagline (optional, improves AI analysis)
            </label>
            <textarea
              value={personalTagline}
              onChange={(e) => setPersonalTagline(e.target.value.slice(0, 200))}
              placeholder="Briefly describe what drives you as a consultant and your career goals..."
              className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              rows={3}
              maxLength={200}
            />
            <div className="flex justify-between items-center">
              <p className="text-sm text-slate-500">
                A personal description helps the AI provide more tailored recommendations
              </p>
              <div className="text-sm text-slate-500">
                {personalTagline.length}/200 characters
              </div>
            </div>
          </div>

          {/* GDPR Consent */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-6 bg-blue-50 rounded-xl border border-blue-200">
              <Checkbox
                id="gdpr-consent"
                checked={gdprConsent}
                onCheckedChange={(checked) => setGdprConsent(checked as boolean)}
                className="mt-1"
              />
              <div className="text-sm">
                <label htmlFor="gdpr-consent" className="cursor-pointer font-medium text-slate-700">
                  I agree to let MatchWise analyze my CV *
                </label>
                <p className="mt-2 text-slate-600">
                  By checking this box, I consent to MatchWise AI analyzing my CV 
                  to create a personalized career report. Your data is processed 
                  according to our privacy policy and never shared with third parties without your consent.
                </p>
                <div className="flex items-center mt-3 text-blue-700">
                  <Shield className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">GDPR-compliant data processing</span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid()}
              size="lg"
              className={`w-full py-4 text-lg font-semibold rounded-xl transition-all duration-200 ${
                isFormValid()
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:shadow-lg transform hover:scale-105'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {!file 
                ? 'Upload CV first' 
                : validationErrors.length > 0
                ? 'Fix errors first'
                : !gdprConsent 
                ? 'Accept data processing'
                : 'Start AI analysis'
              }
            </Button>
          </div>

          {/* Tips Section */}
          <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
            <h4 className="font-semibold text-indigo-800 mb-2">💡 Tips for best results:</h4>
            <ul className="text-sm text-indigo-700 space-y-1">
              <li>• Use your latest CV with updated skills</li>
              <li>• Write a personal tagline describing your goals</li>
              <li>• Analysis takes 2-3 minutes and is fully automated</li>
              <li>• LinkedIn integration coming soon for deeper analysis</li>
            </ul>
          </div>

          {/* Privacy Notice */}
          <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-sm text-slate-600 text-center">
              <strong>Privacy:</strong> Your data is used only for analysis and matching. 
              It's never shared without your approval and you can request deletion at any time.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
