
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, User, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import SelfDescriptionStep from '@/components/SelfDescriptionStep';

interface FormData {
  name: string;
  email: string;
  phone: string;
  linkedinUrl: string;
  selfDescription: string;
}

const CVUpload: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    linkedinUrl: '',
    selfDescription: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const sessionToken = searchParams.get('session');
    if (sessionToken) {
      localStorage.setItem('analysis_session', sessionToken);
    }
  }, [searchParams]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.pdf')) {
        setFile(selectedFile);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file.",
          variant: "destructive",
        });
      }
    }
  };

  const handleFormSubmit = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload your CV first.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name || !formData.email) {
      toast({
        title: "Missing information",
        description: "Please fill in your name and email.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const sessionToken = localStorage.getItem('analysis_session') || 
                           searchParams.get('session') || 
                           Date.now().toString();

      const formDataToSend = new FormData();
      formDataToSend.append('cv', file);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('linkedinUrl', formData.linkedinUrl);
      formDataToSend.append('selfDescription', formData.selfDescription);
      formDataToSend.append('sessionToken', sessionToken);

      const response = await fetch('/api/parse-cv', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to upload CV');
      }

      const result = await response.json();
      
      toast({
        title: "CV uploaded successfully!",
        description: "Your CV is being analyzed. You will be redirected shortly.",
      });

      setTimeout(() => {
        navigate(`/analysis?session=${sessionToken}`);
      }, 2000);

    } catch (error) {
      console.error('Error uploading CV:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your CV. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Upload className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-2xl">Upload Your CV</CardTitle>
              <p className="text-slate-600">
                Upload your CV to get started with your professional analysis
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="cv-upload"
                />
                <label htmlFor="cv-upload" className="cursor-pointer">
                  <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-slate-600 mb-2">
                    {file ? file.name : 'Choose CV file'}
                  </p>
                  <p className="text-sm text-slate-500">
                    PDF files only, max 10MB
                  </p>
                </label>
              </div>
              
              {file && (
                <Button onClick={() => setStep(2)} className="w-full">
                  Continue
                </Button>
              )}
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-2xl">Your Information</CardTitle>
              <p className="text-slate-600">
                Please provide your contact information
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin">LinkedIn URL</Label>
                  <Input
                    id="linkedin"
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData({...formData, linkedinUrl: e.target.value})}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                  Back
                </Button>
                <Button onClick={() => setStep(3)} className="flex-1">
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <SelfDescriptionStep
            selfDescription={formData.selfDescription}
            setSelfDescription={(description) => setFormData({...formData, selfDescription: description})}
            onNext={handleFormSubmit}
            onSkip={handleFormSubmit}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <React.Fragment key={stepNumber}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-200 text-slate-500'
                }`}>
                  {step > stepNumber ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    stepNumber
                  )}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-8 h-px ${
                    step > stepNumber ? 'bg-blue-600' : 'bg-slate-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {renderStep()}
      </div>
    </div>
  );
};

export default CVUpload;
