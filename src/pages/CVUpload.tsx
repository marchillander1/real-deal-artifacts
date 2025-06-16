
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Logo from '@/components/Logo';

export const CVUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf' || selectedFile.type.startsWith('image/')) {
        setFile(selectedFile);
      } else {
        toast.error('Please upload a PDF file or image');
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!file || !email || !fullName) {
      toast.error('Please fill in all required fields and upload a file');
      return;
    }

    setIsUploading(true);

    try {
      // Convert file to base64
      const fileBuffer = await file.arrayBuffer();
      const fileBase64 = btoa(String.fromCharCode(...new Uint8Array(fileBuffer)));

      console.log('Sending CV for parsing...');
      
      // Call the parse-cv edge function
      const { data: parseData, error: parseError } = await supabase.functions.invoke('parse-cv', {
        body: {
          file: fileBase64,
          fileName: file.name,
          fileType: file.type,
          email,
          fullName,
          phoneNumber,
          linkedinUrl
        }
      });

      if (parseError) {
        console.error('Parse error:', parseError);
        throw parseError;
      }

      console.log('CV parsed successfully:', parseData);

      // Save to database
      const { data: insertData, error: insertError } = await supabase
        .from('consultants')
        .insert({
          name: fullName,
          email: email,
          phone: phoneNumber || null,
          linkedin_url: linkedinUrl || null,
          skills: parseData.skills || [],
          years_of_experience: parseData.yearsOfExperience || 0,
          hourly_rate: parseData.hourlyRate || null,
          location: parseData.location || null,
          availability: parseData.availability || 'Available',
          bio: parseData.summary || '',
          cv_text: parseData.extractedText || '',
          soft_skills: parseData.softSkills || [],
          certifications: parseData.certifications || []
        });

      if (insertError) {
        console.error('Insert error:', insertError);
        throw insertError;
      }

      console.log('Consultant saved to database:', insertData);

      // Send welcome email
      try {
        const { error: emailError } = await supabase.functions.invoke('send-welcome-email', {
          body: {
            email,
            name: fullName
          }
        });
        
        if (emailError) {
          console.error('Welcome email error:', emailError);
        }
      } catch (emailErr) {
        console.error('Error sending welcome email:', emailErr);
      }

      setUploadComplete(true);
      toast.success('CV uploaded and processed successfully!');

    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload CV. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleContinue = () => {
    navigate('/pricing');
  };

  if (uploadComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Logo />
            </div>
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-600">
              Success!
            </CardTitle>
            <CardDescription>
              Your CV has been uploaded and analyzed. You're now part of our consultant network!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              We've sent a welcome email to {email} with next steps.
            </p>
            <Button onClick={handleContinue} className="w-full">
              Continue to Pricing
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <CardTitle className="text-2xl font-bold">Upload Your CV</CardTitle>
          <CardDescription>
            Join our network of consultants and get matched with relevant opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+46 70 123 45 67"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn URL</Label>
                <Input
                  id="linkedin"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cv-upload">CV Upload *</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  id="cv-upload"
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="cv-upload" className="cursor-pointer">
                  {file ? (
                    <div className="flex items-center justify-center space-x-2 text-green-600">
                      <FileText className="h-8 w-8" />
                      <span className="font-medium">{file.name}</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-lg font-medium text-gray-700">
                          Click to upload your CV
                        </p>
                        <p className="text-sm text-gray-500">
                          PDF or image files supported
                        </p>
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isUploading || !file || !email || !fullName}
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing CV...
                </>
              ) : (
                'Upload CV & Join Network'
              )}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              By uploading your CV, you agree to our terms of service and privacy policy.
              Your information will be used to match you with relevant consulting opportunities.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
