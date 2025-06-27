
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, Loader2, CheckCircle2, User, Link as LinkIcon } from 'lucide-react';
import { CVUploadFlow } from '../cv-analysis/CVUploadFlow';
import { useToast } from '@/hooks/use-toast';

interface UnifiedCVUploadProps {
  isMyConsultant?: boolean;
  onComplete?: (consultant: any) => void;
  onClose?: () => void;
}

export const UnifiedCVUpload: React.FC<UnifiedCVUploadProps> = ({
  isMyConsultant = false,
  onComplete,
  onClose
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [personalDescription, setPersonalDescription] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

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
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/jpg'
    ];
    return validTypes.includes(file.type);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !agreeToTerms) {
      toast({
        title: "Incomplete form",
        description: "Please upload a CV and agree to terms",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Set URL parameter for consultant type
    const currentUrl = new URL(window.location.href);
    if (isMyConsultant) {
      currentUrl.searchParams.set('source', 'my-consultants');
    } else {
      currentUrl.searchParams.delete('source');
    }
    window.history.replaceState({}, '', currentUrl.toString());
  };

  const handleUploadComplete = (consultant: any) => {
    setIsProcessing(false);
    setProgress(100);
    
    toast({
      title: "CV uploaded successfully! 🎉",
      description: `${consultant.name} has been added to ${isMyConsultant ? 'your team' : 'the network'}`,
    });

    if (onComplete) {
      onComplete(consultant);
    }

    // Reset form
    setTimeout(() => {
      setFile(null);
      setLinkedinUrl('');
      setPersonalDescription('');
      setAgreeToTerms(false);
      setProgress(0);
    }, 2000);
  };

  const handleUploadError = (error: string) => {
    setIsProcessing(false);
    setProgress(0);
    
    toast({
      title: "Upload failed",
      description: error,
      variant: "destructive",
    });
  };

  const canSubmit = file && agreeToTerms;
  const hasValidLinkedIn = linkedinUrl && linkedinUrl.includes('linkedin.com');

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          {isMyConsultant ? 'Add Consultant to Team' : 'Join Network'}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload */}
          <div className="space-y-3">
            <Label htmlFor="cv-upload" className="text-base font-medium flex items-center">
              CV File <span className="text-red-500 ml-1">*</span>
            </Label>
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : file 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                id="cv-upload"
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isProcessing}
              />
              
              <div className="text-center">
                {file ? (
                  <div className="flex items-center justify-center space-x-3">
                    <FileText className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="font-medium text-green-700">{file.name}</p>
                      <p className="text-sm text-green-600">Ready for upload</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-base font-medium text-gray-700 mb-1">
                        Upload your CV
                      </p>
                      <p className="text-sm text-gray-500">
                        PDF, Word, or image format
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* LinkedIn URL */}
          <div className="space-y-3">
            <Label htmlFor="linkedin" className="text-base font-medium flex items-center">
              <LinkIcon className="h-4 w-4 mr-2" />
              LinkedIn Profile (optional)
            </Label>
            <Input
              id="linkedin"
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile"
              disabled={isProcessing}
            />
            {hasValidLinkedIn && (
              <p className="text-sm text-green-600">✓ Valid LinkedIn URL - will enhance analysis</p>
            )}
          </div>

          {/* Personal Description */}
          <div className="space-y-3">
            <Label htmlFor="personal-description" className="text-base font-medium flex items-center">
              <User className="h-4 w-4 mr-2" />
              Personal Description (optional)
            </Label>
            <Textarea
              id="personal-description"
              value={personalDescription}
              onChange={(e) => setPersonalDescription(e.target.value)}
              placeholder="Tell us about yourself, your strengths, interests, and what makes you unique as a consultant..."
              className="h-24 resize-none"
              maxLength={500}
              disabled={isProcessing}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Helps improve AI analysis quality</span>
              <span>{personalDescription.length}/500</span>
            </div>
          </div>

          {/* Progress */}
          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-600">Processing CV...</span>
                <span className="text-blue-600">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Terms */}
          <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
            <Checkbox
              id="terms"
              checked={agreeToTerms}
              onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
              className="mt-1"
              disabled={isProcessing}
            />
            <div className="text-sm text-gray-600">
              <Label htmlFor="terms" className="cursor-pointer">
                <span className="font-medium">
                  I agree to AI analysis and data processing
                </span>
              </Label>
              <p className="mt-1">
                I consent to MatchWise analyzing my CV and profile data to create my consultant profile.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            {onClose && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isProcessing}
                className="flex-1"
              >
                Cancel
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={!canSubmit || isProcessing}
              className={`${onClose ? 'flex-1' : 'w-full'} bg-blue-600 hover:bg-blue-700`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {isMyConsultant ? 'Add to Team' : 'Join Network'}
                </>
              )}
            </Button>
          </div>
        </form>

        {/* CV Upload Flow */}
        {isProcessing && file && (
          <CVUploadFlow
            file={file}
            linkedinUrl={linkedinUrl}
            personalDescription={personalDescription}
            onProgress={setProgress}
            onComplete={handleUploadComplete}
            onError={handleUploadError}
          />
        )}
      </CardContent>
    </Card>
  );
};
