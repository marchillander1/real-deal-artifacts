
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, FileText, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
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
  const hasValidLinkedInUrl = linkedinUrl && linkedinUrl.includes('linkedin.com');
  const canStartAnalysis = file && hasValidLinkedInUrl;

  return (
    <Card className="shadow-xl">
      <CardHeader className="text-center border-b">
        <div className="flex items-center justify-center mb-4">
          <Upload className="h-6 w-6 mr-2 text-purple-600" />
          <CardTitle className="text-xl font-semibold">Start Your Comprehensive Analysis</CardTitle>
        </div>
        <CardDescription className="text-gray-600">
          Both CV and LinkedIn profile are required for complete professional analysis
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
                      <p className="text-sm text-gray-500">
                        {isAnalyzing ? 'Analyzing...' : analysisResults ? 'Analysis complete' : 'CV uploaded - LinkedIn required to start analysis'}
                      </p>
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
                        PDF or image format - Analysis starts when both CV and LinkedIn are provided
                      </p>
                    </div>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* LinkedIn URL Section - Enhanced */}
          <div className="space-y-3">
            <Label htmlFor="linkedin" className="text-base font-medium flex items-center">
              LinkedIn Profile <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="linkedin"
              value={linkedinUrl}
              onChange={(e) => onLinkedinUrlChange(e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile - Required for comprehensive analysis"
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
                Valid LinkedIn URL - Ready for analysis
              </div>
            )}
          </div>

          {/* Analysis Requirements Alert */}
          {!canStartAnalysis && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-800">Comprehensive Analysis Requirements</span>
              </div>
              <p className="text-sm text-blue-700">
                Both CV file and LinkedIn profile URL are required.
              </p>
            </div>
          )}

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
                placeholder="Auto-filled from CV"
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
                placeholder="Auto-filled from CV"
                className="h-12"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="phone" className="text-base font-medium">Phone</Label>
            <Input
              id="phone"
              value={phoneNumber}
              onChange={(e) => onPhoneNumberChange(e.target.value)}
              placeholder="Auto-filled from CV"
              className="h-12"
            />
          </div>

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
                <span className="font-medium">I agree to comprehensive analysis and network joining</span>
              </Label>
              <p className="mt-1">
                I consent to MatchWise analyzing my CV and LinkedIn profile for advanced consultant matching.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full h-14 text-lg bg-purple-600 hover:bg-purple-700" 
            disabled={isUploading || !file || !email || !fullName || !agreeToTerms || !analysisResults || !hasValidLinkedInUrl}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Saving Comprehensive Profile...
              </>
            ) : analysisResults ? (
              <>
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Submit & Join Our Network
              </>
            ) : (
              <>
                <Upload className="mr-2 h-5 w-5" />
                Upload CV & Add LinkedIn to Start Analysis
              </>
            )}
          </Button>
          
          {!analysisResults && canStartAnalysis && (
            <p className="text-center text-sm text-green-600">
              ✅ Ready for analysis - Upload will trigger comprehensive CV and LinkedIn analysis
            </p>
          )}
          
          {!canStartAnalysis && (
            <p className="text-center text-sm text-orange-500">
              Both CV file and LinkedIn URL are required to start analysis
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
