
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CVUploadFormProps {
  onUploadComplete: (token: string) => void;
}

export const CVUploadForm: React.FC<CVUploadFormProps> = ({ onUploadComplete }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [personalTagline, setPersonalTagline] = useState('');
  const [gdprConsent, setGdprConsent] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file",
          variant: "destructive",
        });
        return;
      }
      setUploadedFile(file);
      toast({
        title: "File uploaded successfully",
        description: `${file.name} is ready for analysis`,
      });
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadedFile) {
      toast({
        title: "No file selected",
        description: "Please upload a CV file",
        variant: "destructive",
      });
      return;
    }

    if (!gdprConsent) {
      toast({
        title: "GDPR consent required",
        description: "Please consent to data processing",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Create session token
      const sessionToken = crypto.randomUUID();
      
      // Upload file to Supabase Storage
      const fileExt = 'pdf';
      const fileName = `${sessionToken}.${fileExt}`;
      const filePath = `cv-uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('cv-uploads')
        .upload(filePath, uploadedFile);

      if (uploadError) {
        throw new Error(`File upload failed: ${uploadError.message}`);
      }

      // Create upload session record
      const { error: sessionError } = await supabase
        .from('upload_sessions')
        .insert({
          session_token: sessionToken,
          cv_file_path: filePath,
          linkedin_url: linkedinUrl,
          personal_tagline: personalTagline,
          gdpr_consent: gdprConsent,
          status: 'uploaded'
        });

      if (sessionError) {
        throw new Error(`Session creation failed: ${sessionError.message}`);
      }

      toast({
        title: "Upload successful! 🎉",
        description: "Starting AI analysis of your CV...",
      });

      onUploadComplete(sessionToken);

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="text-3xl font-bold mb-4">
            Upload Your CV for AI Analysis
          </CardTitle>
          <p className="text-lg opacity-90">
            Get personalized career insights and join our exclusive consultant network
          </p>
        </CardHeader>

        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload */}
            <div>
              <Label className="text-lg font-semibold mb-4 block">Upload Your CV (PDF)</Label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                  isDragActive
                    ? 'border-blue-500 bg-blue-50'
                    : uploadedFile
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                <input {...getInputProps()} />
                <div className="space-y-4">
                  {uploadedFile ? (
                    <>
                      <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                      <div>
                        <p className="text-lg font-semibold text-green-800">
                          {uploadedFile.name}
                        </p>
                        <p className="text-sm text-green-600">
                          File uploaded successfully - Click to change
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-lg font-semibold text-gray-700">
                          {isDragActive
                            ? 'Drop your CV here...'
                            : 'Drag & drop your CV here, or click to select'}
                        </p>
                        <p className="text-sm text-gray-500">
                          PDF files only, max 10MB
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* LinkedIn URL */}
            <div>
              <Label htmlFor="linkedin" className="text-lg font-semibold">
                LinkedIn Profile URL (Optional)
              </Label>
              <Input
                id="linkedin"
                type="url"
                placeholder="https://linkedin.com/in/your-profile"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="mt-2"
              />
              <p className="text-sm text-gray-600 mt-1">
                Add your LinkedIn profile for enhanced analysis
              </p>
            </div>

            {/* Personal Tagline */}
            <div>
              <Label htmlFor="tagline" className="text-lg font-semibold">
                Personal Tagline (Optional)
              </Label>
              <Textarea
                id="tagline"
                placeholder="Describe yourself in a few sentences - your strengths, goals, or what makes you unique as a consultant..."
                value={personalTagline}
                onChange={(e) => setPersonalTagline(e.target.value)}
                className="mt-2"
                rows={3}
              />
              <p className="text-sm text-gray-600 mt-1">
                This helps our AI provide more personalized insights
              </p>
            </div>

            {/* GDPR Consent */}
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <Checkbox
                id="gdpr"
                checked={gdprConsent}
                onCheckedChange={setGdprConsent}
                className="mt-1"
              />
              <div className="flex-1">
                <Label htmlFor="gdpr" className="text-sm font-medium cursor-pointer">
                  I consent to the processing of my personal data
                </Label>
                <p className="text-xs text-gray-600 mt-1">
                  Your data will be used to analyze your CV and create your consultant profile. 
                  You can request deletion at any time by contacting us.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!uploadedFile || !gdprConsent || isUploading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 text-lg font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Uploading & Starting Analysis...
                </>
              ) : (
                <>
                  <FileText className="h-5 w-5 mr-2" />
                  Start AI Analysis
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">What happens next?</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• AI analyzes your CV for technical and soft skills</li>
              <li>• Market valuation and optimal hourly rate calculation</li>
              <li>• Personalized career development recommendations</li>
              <li>• Professional consultant profile creation</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
