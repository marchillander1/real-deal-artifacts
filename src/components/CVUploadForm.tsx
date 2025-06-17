
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, FileText, CheckCircle2, Loader2, AlertCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface CVUploadFormProps {
  file: File | null;
  email: string;
  fullName: string;
  phoneNumber: string;
  linkedinUrl: string;
  agreeToTerms: boolean;
  isUploading: boolean;
  analysisResults: any;
  isAnalyzing: boolean;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEmailChange: (value: string) => void;
  onFullNameChange: (value: string) => void;
  onPhoneNumberChange: (value: string) => void;
  onLinkedinUrlChange: (value: string) => void;
  onAgreeToTermsChange: (checked: boolean) => void;
  onSubmit: (event: React.FormEvent) => void;
}

export const CVUploadForm: React.FC<CVUploadFormProps> = ({
  file,
  email,
  fullName,
  phoneNumber,
  linkedinUrl,
  agreeToTerms,
  isUploading,
  analysisResults,
  isAnalyzing,
  onFileChange,
  onEmailChange,
  onFullNameChange,
  onPhoneNumberChange,
  onLinkedinUrlChange,
  onAgreeToTermsChange,
  onSubmit
}) => {
  const [isMyConsultant, setIsMyConsultant] = useState(false);

  // Check if we're uploading for "My Consultants" based on URL parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const source = urlParams.get('source');
    setIsMyConsultant(source === 'my-consultants');
  }, []);

  const hasValidLinkedInUrl = linkedinUrl && linkedinUrl.includes('linkedin.com');
  // 🔥 SIMPLIFIED: Only CV and LinkedIn required for analysis to start
  const canStartAnalysis = file && hasValidLinkedInUrl;

  const getAnalysisStatus = () => {
    if (isAnalyzing) {
      return { icon: Loader2, text: "Analyzing CV and LinkedIn together...", color: "text-blue-600" };
    }
    if (analysisResults) {
      return { icon: CheckCircle2, text: "Analysis complete! Information auto-filled from CV.", color: "text-green-600" };
    }
    if (file && hasValidLinkedInUrl) {
      return { icon: CheckCircle2, text: "Ready for analysis (will auto-fill contact info)", color: "text-green-600" };
    }
    if (file && !hasValidLinkedInUrl) {
      return { icon: Clock, text: "Add LinkedIn URL to start analysis", color: "text-orange-600" };
    }
    if (!file) {
      return { icon: Clock, text: "Upload CV to start", color: "text-gray-600" };
    }
    return { icon: Clock, text: "Waiting for requirements", color: "text-gray-600" };
  };

  const analysisStatus = getAnalysisStatus();
  const StatusIcon = analysisStatus.icon;

  const getCardTitle = () => {
    if (isMyConsultant) {
      return "Add Consultant to My Team";
    }
    return "Start Your Analysis & Join Network";
  };

  const getCardDescription = () => {
    if (isMyConsultant) {
      return "Upload CV and LinkedIn profile to start analysis and auto-fill information";
    }
    return "Upload CV and LinkedIn profile for analysis - contact information will be auto-filled";
  };

  const getSubmitButtonText = () => {
    if (isUploading) {
      return isMyConsultant ? "Adding to My Team..." : "Joining Network...";
    }
    if (analysisResults) {
      return isMyConsultant ? "Add to My Team" : "Complete Registration & Join Network";
    }
    return "Analysis Required Before Registration";
  };

  return (
    <Card className="shadow-xl">
      <CardHeader className="text-center border-b">
        <div className="flex items-center justify-center mb-4">
          <Upload className="h-6 w-6 mr-2 text-purple-600" />
          <CardTitle className="text-xl font-semibold">{getCardTitle()}</CardTitle>
        </div>
        <CardDescription className="text-gray-600">
          {getCardDescription()}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-8">
        <form onSubmit={onSubmit} className="space-y-6">
          {/* CV Upload Section */}
          <div className="space-y-3">
            <Label htmlFor="cv-upload" className="text-base font-medium flex items-center">
              CV File <span className="text-red-500 ml-1">*</span>
            </Label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-purple-300 transition-colors bg-gray-50">
              <input
                id="cv-upload"
                type="file"
                accept=".pdf,image/*"
                onChange={onFileChange}
                className="hidden"
              />
              <label htmlFor="cv-upload" className="cursor-pointer">
                {file ? (
                  <div className="flex items-center justify-center space-x-3">
                    <FileText className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="font-medium text-green-700">{file.name}</p>
                      <div className="flex items-center justify-center space-x-2 mt-1">
                        <StatusIcon className={`h-4 w-4 ${analysisStatus.color} ${isAnalyzing ? 'animate-spin' : ''}`} />
                        <p className={`text-sm ${analysisStatus.color}`}>
                          {analysisStatus.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-base font-medium text-gray-700 mb-1">
                        Upload Your CV
                      </p>
                      <p className="text-sm text-gray-500">
                        PDF or image format - Analysis auto-fills contact information
                      </p>
                    </div>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* LinkedIn URL Section - Required for analysis */}
          <div className="space-y-3">
            <Label htmlFor="linkedin" className="text-base font-medium flex items-center">
              LinkedIn Profile <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="linkedin"
              value={linkedinUrl}
              onChange={(e) => onLinkedinUrlChange(e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile"
              className="h-12"
              required
            />
            {linkedinUrl && !hasValidLinkedInUrl && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                Please enter a valid LinkedIn URL (must contain 'linkedin.com')
              </div>
            )}
            {hasValidLinkedInUrl && (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <CheckCircle2 className="h-4 w-4" />
                Valid LinkedIn URL - Analysis will start when CV is uploaded
              </div>
            )}
          </div>

          {/* Analysis Status Info */}
          {!canStartAnalysis && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <StatusIcon className={`h-5 w-5 ${analysisStatus.color}`} />
                <span className={`font-medium ${analysisStatus.color}`}>Analysis Requirements</span>
              </div>
              <p className="text-sm text-blue-700">
                Upload CV and add LinkedIn URL to start analysis. Contact information will be automatically extracted and filled.
              </p>
            </div>
          )}

          {/* Auto-filled Information Display (only show after analysis) */}
          {analysisResults && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">✅ Information Auto-filled from Analysis</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <label className="block text-green-700 font-medium">Name:</label>
                  <p className="text-green-800">{fullName || 'Not detected'}</p>
                </div>
                <div>
                  <label className="block text-green-700 font-medium">Email:</label>
                  <p className="text-green-800">{email || 'Not detected'}</p>
                </div>
                <div>
                  <label className="block text-green-700 font-medium">Phone:</label>
                  <p className="text-green-800">{phoneNumber || 'Not detected'}</p>
                </div>
              </div>
              <p className="text-xs text-green-600 mt-2">
                You can modify these fields in the next step if needed.
              </p>
            </div>
          )}

          {/* Terms and Conditions */}
          <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
            <Checkbox
              id="terms"
              checked={agreeToTerms}
              onCheckedChange={(checked) => onAgreeToTermsChange(checked as boolean)}
              className="mt-1"
            />
            <div className="text-sm text-gray-600">
              <Label htmlFor="terms" className="cursor-pointer">
                <span className="font-medium">
                  I agree to comprehensive analysis and auto-filling
                </span>
              </Label>
              <p className="mt-1">
                I consent to MatchWise analyzing my CV and LinkedIn profile to auto-fill contact information and create my consultant profile.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full h-14 text-lg bg-purple-600 hover:bg-purple-700" 
            disabled={isUploading || !agreeToTerms || !analysisResults}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {getSubmitButtonText()}
              </>
            ) : analysisResults ? (
              <>
                <CheckCircle2 className="mr-2 h-5 w-5" />
                {getSubmitButtonText()}
              </>
            ) : (
              <>
                <StatusIcon className={`mr-2 h-5 w-5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                {getSubmitButtonText()}
              </>
            )}
          </Button>
          
          {canStartAnalysis && !analysisResults && !isAnalyzing && (
            <p className="text-center text-sm text-green-600">
              ✅ Analysis will start automatically and auto-fill your information
            </p>
          )}
          
          {isAnalyzing && (
            <p className="text-center text-sm text-blue-600">
              🔄 Analyzing CV and LinkedIn - auto-filling contact information...
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
