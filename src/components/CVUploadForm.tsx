
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
  const hasValidEmail = email && email.trim() !== '';
  const canStartAnalysis = file && hasValidLinkedInUrl && hasValidEmail;

  const getAnalysisStatus = () => {
    if (isAnalyzing) {
      return { icon: Loader2, text: "Analyzing CV and LinkedIn together...", color: "text-blue-600" };
    }
    if (analysisResults) {
      return { icon: CheckCircle2, text: "Complete analysis finished!", color: "text-green-600" };
    }
    if (file && hasValidLinkedInUrl && hasValidEmail) {
      return { icon: CheckCircle2, text: "Ready for comprehensive analysis", color: "text-green-600" };
    }
    if (file && !hasValidLinkedInUrl) {
      return { icon: Clock, text: "Add LinkedIn URL to start analysis", color: "text-orange-600" };
    }
    if (file && hasValidLinkedInUrl && !hasValidEmail) {
      return { icon: Clock, text: "Enter email to start analysis", color: "text-orange-600" };
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
    return "Start Your Comprehensive Analysis";
  };

  const getCardDescription = () => {
    if (isMyConsultant) {
      return "Upload CV, add LinkedIn profile and email to start analysis";
    }
    return "CV, LinkedIn profile, and email are required for complete professional analysis";
  };

  const getSubmitButtonText = () => {
    if (isUploading) {
      return isMyConsultant ? "Adding to My Team..." : "Saving Comprehensive Profile...";
    }
    if (analysisResults) {
      return isMyConsultant ? "Add to My Team" : "Submit & Join Our Network";
    }
    return isMyConsultant ? "Complete Form to Start Analysis" : "Complete Form to Start Analysis";
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
                        PDF or image format - Analysis starts when CV + LinkedIn URL are complete
                      </p>
                    </div>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="fullName" className="text-base font-medium flex items-center">
                Full Name <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => onFullNameChange(e.target.value)}
                placeholder="Your full name"
                className="h-12"
                required
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="email" className="text-base font-medium flex items-center">
                Email <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                placeholder="your.email@example.com"
                className="h-12"
                required
              />
              {email && !hasValidEmail && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  Please enter a valid email address
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="phone" className="text-base font-medium">Phone</Label>
            <Input
              id="phone"
              value={phoneNumber}
              onChange={(e) => onPhoneNumberChange(e.target.value)}
              placeholder="Your phone number"
              className="h-12"
            />
          </div>

          {/* LinkedIn URL Section */}
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

          {/* Analysis Status Alert */}
          {!canStartAnalysis && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <StatusIcon className={`h-5 w-5 ${analysisStatus.color}`} />
                <span className={`font-medium ${analysisStatus.color.replace('text-', 'text-')}`}>Analysis Requirements</span>
              </div>
              <p className="text-sm text-blue-700">
                {analysisStatus.text} - CV, LinkedIn URL, and email are all required for comprehensive analysis.
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
                  {isMyConsultant ? "I agree to add this consultant to my team" : "I agree to comprehensive analysis and network joining"}
                </span>
              </Label>
              <p className="mt-1">
                {isMyConsultant 
                  ? "I consent to MatchWise analyzing this CV and LinkedIn profile for my consultant team."
                  : "I consent to MatchWise analyzing my CV and LinkedIn profile for advanced consultant matching."
                }
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full h-14 text-lg bg-purple-600 hover:bg-purple-700" 
            disabled={isUploading || !file || !email || !fullName || !agreeToTerms || !analysisResults || !hasValidLinkedInUrl || !hasValidEmail}
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
              ✅ Analysis will start automatically when you complete CV + LinkedIn URL
            </p>
          )}
          
          {isAnalyzing && (
            <p className="text-center text-sm text-blue-600">
              🔄 Comprehensive analysis in progress - CV and LinkedIn being analyzed together...
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );

  function getCardTitle() {
    if (isMyConsultant) {
      return "Add Consultant to My Team";
    }
    return "Start Your Comprehensive Analysis";
  }

  function getCardDescription() {
    if (isMyConsultant) {
      return "Upload CV, add LinkedIn profile and email to start comprehensive analysis";
    }
    return "CV, LinkedIn profile, and email are required for complete professional analysis";
  }

  function getSubmitButtonText() {
    if (isUploading) {
      return isMyConsultant ? "Adding to My Team..." : "Saving Comprehensive Profile...";
    }
    if (analysisResults) {
      return isMyConsultant ? "Add to My Team" : "Submit & Join Our Network";
    }
    return isMyConsultant ? "Complete Form to Start Analysis" : "Complete Form to Start Analysis";
  }
};
