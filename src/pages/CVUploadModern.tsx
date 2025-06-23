
import React, { useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, Check, ArrowLeft, Brain, Linkedin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CVUploadFlow } from '@/components/cv-analysis/CVUploadFlow';
import Logo from '@/components/Logo';

export default function CVUploadModern() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState<'upload' | 'processing' | 'complete'>('upload');
  const [consultant, setConsultant] = useState<any>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const source = searchParams.get('source');
  const isMyConsultant = source === 'my-consultants';

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleFileSelect = (selectedFile: File) => {
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/jpg'
    ];

    if (!validTypes.includes(selectedFile.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOC, DOCX, or image file",
        variant: "destructive",
      });
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);
    toast({
      title: "File selected",
      description: `${selectedFile.name} is ready for upload`,
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleStartProcessing = () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a CV file first",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setStep('processing');
    setProgress(0);
  };

  const handleProcessingComplete = (result: any) => {
    setConsultant(result);
    setStep('complete');
    setIsProcessing(false);
    setProgress(100);
  };

  const handleProcessingError = (error: string) => {
    setIsProcessing(false);
    setStep('upload');
    setProgress(0);
    toast({
      title: "Processing failed",
      description: error,
      variant: "destructive",
    });
  };

  const goBack = () => {
    if (isMyConsultant) {
      navigate('/matchwiseai');
    } else {
      navigate('/');
    }
  };

  if (step === 'complete' && consultant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analysis Complete!</h1>
            <p className="text-gray-600">
              Your consultant profile has been created and analyzed successfully.
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2 text-purple-600" />
                AI Analysis Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Personal Information</h3>
                  <p className="text-sm text-gray-600 mb-1">Name: {consultant.name}</p>
                  <p className="text-sm text-gray-600 mb-1">Email: {consultant.email}</p>
                  <p className="text-sm text-gray-600">Location: {consultant.location}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Analysis Status</h3>
                  <p className="text-sm text-green-600 mb-1">✅ CV Analysis Complete</p>
                  {linkedinUrl && <p className="text-sm text-green-600 mb-1">✅ LinkedIn Analysis Complete</p>}
                  <p className="text-sm text-green-600">✅ Market Analysis Complete</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 justify-center">
            <Button 
              onClick={() => navigate(`/analysis?consultant=${consultant.id}`)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Brain className="h-4 w-4 mr-2" />
              View Full Analysis
            </Button>
            <Button 
              onClick={goBack}
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Logo size="md" variant="full" />
          <Button onClick={goBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            <div className={`flex items-center ${step === 'upload' ? 'text-blue-600' : step === 'processing' || step === 'complete' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${step === 'upload' ? 'bg-blue-100' : step === 'processing' || step === 'complete' ? 'bg-green-100' : 'bg-gray-100'}`}>
                {step === 'processing' || step === 'complete' ? <Check className="h-4 w-4" /> : '1'}
              </div>
              Upload CV
            </div>
            <div className={`flex items-center ${step === 'processing' ? 'text-blue-600' : step === 'complete' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${step === 'processing' ? 'bg-blue-100' : step === 'complete' ? 'bg-green-100' : 'bg-gray-100'}`}>
                {step === 'complete' ? <Check className="h-4 w-4" /> : '2'}
              </div>
              AI Analysis
            </div>
            <div className={`flex items-center ${step === 'complete' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${step === 'complete' ? 'bg-green-100' : 'bg-gray-100'}`}>
                {step === 'complete' ? <Check className="h-4 w-4" /> : '3'}
              </div>
              Complete
            </div>
          </div>
        </div>

        {step === 'upload' && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-center">Upload Your CV</CardTitle>
              <p className="text-center text-gray-600">
                {isMyConsultant ? 'Add a consultant to your team' : 'Join our consultant network'}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Upload */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                  dragActive ? 'border-blue-500 bg-blue-50' : file ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('cv-upload')?.click()}
              >
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                  id="cv-upload"
                />
                
                {file ? (
                  <div className="flex items-center justify-center space-x-3">
                    <FileText className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-700">{file.name}</p>
                      <p className="text-sm text-green-600">Ready for analysis ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      Drop your CV here or click to browse
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      PDF, DOC, DOCX, or image files • Max 10MB
                    </p>
                    <Button variant="outline" className="pointer-events-none">
                      <FileText className="h-4 w-4 mr-2" />
                      Select File
                    </Button>
                  </div>
                )}
              </div>

              {/* LinkedIn URL */}
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn Profile (Optional)</Label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="linkedin"
                    type="url"
                    placeholder="https://linkedin.com/in/yourprofile"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <p className="text-sm text-gray-600">
                  Add your LinkedIn for enhanced personality and market analysis
                </p>
              </div>

              {/* Start Button */}
              <Button
                onClick={handleStartProcessing}
                disabled={!file || isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                <Brain className="h-4 w-4 mr-2" />
                Start AI Analysis
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 'processing' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Analyzing Your CV</CardTitle>
              <p className="text-center text-gray-600">
                Our AI is processing your information...
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <Progress value={progress} className="w-full" />
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  {progress < 20 && "Extracting text from CV..."}
                  {progress >= 20 && progress < 40 && "Analyzing technical skills..."}
                  {progress >= 40 && progress < 60 && "Processing LinkedIn profile..."}
                  {progress >= 60 && progress < 80 && "Creating consultant profile..."}
                  {progress >= 80 && progress < 100 && "Finalizing analysis..."}
                  {progress === 100 && "Complete!"}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Background Processing */}
        {isProcessing && file && (
          <CVUploadFlow
            file={file}
            linkedinUrl={linkedinUrl}
            onProgress={setProgress}
            onComplete={handleProcessingComplete}
            onError={handleProcessingError}
          />
        )}
      </div>
    </div>
  );
}
