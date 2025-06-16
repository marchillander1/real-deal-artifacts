
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, FileText, CheckCircle2, ArrowRight, Code, Users, Target, TrendingUp } from 'lucide-react';
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
  const [agreeToTerms, setAgreeToTerms] = useState(false);
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
    
    if (!file || !email || !fullName || !agreeToTerms) {
      toast.error('Please fill in all required fields, upload a file, and agree to terms');
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center shadow-xl">
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
            <Button onClick={handleContinue} className="w-full bg-purple-600 hover:bg-purple-700">
              Continue to Pricing
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          
          <div className="inline-flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            AI-Powered Comprehensive Career Analysis
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Upload Your CV & LinkedIn Profile
          </h1>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Get instant comprehensive AI analysis of your technical skills, leadership style, 
            personality, and career potential. Upload your CV and add your LinkedIn profile 
            to receive detailed insights and join our exclusive consultant network.
          </p>
          
          {/* Feature Icons */}
          <div className="flex justify-center space-x-8 mb-12">
            <div className="flex items-center text-gray-600">
              <Code className="h-5 w-5 mr-2 text-blue-500" />
              <span className="text-sm">Technical Expertise</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="h-5 w-5 mr-2 text-green-500" />
              <span className="text-sm">Leadership Analysis</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Target className="h-5 w-5 mr-2 text-orange-500" />
              <span className="text-sm">Career Strategy</span>
            </div>
            <div className="flex items-center text-gray-600">
              <TrendingUp className="h-5 w-5 mr-2 text-purple-500" />
              <span className="text-sm">Market Positioning</span>
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <Card className="max-w-2xl mx-auto shadow-xl">
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
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="cv-upload" className="cursor-pointer">
                    {file ? (
                      <div className="flex items-center justify-center space-x-3">
                        <FileText className="h-8 w-8 text-green-600" />
                        <div>
                          <p className="font-medium text-green-700">{file.name}</p>
                          <p className="text-sm text-gray-500">Click to change file</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                        <div>
                          <p className="text-base font-medium text-gray-700 mb-1">
                            Välj fil
                          </p>
                          <p className="text-sm text-gray-500">
                            ingen fil vald
                          </p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* LinkedIn Profile Section */}
              <div className="space-y-3">
                <Label htmlFor="linkedin" className="text-base font-medium flex items-center">
                  LinkedIn Profile URL <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="linkedin"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="h-12"
                  required
                />
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
                    onChange={(e) => setFullName(e.target.value)}
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
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
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
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+46 70 123 45 67"
                  className="h-12"
                />
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                  className="mt-1"
                />
                <div className="text-sm text-gray-600">
                  <Label htmlFor="terms" className="cursor-pointer">
                    <span className="font-medium">I agree to data storage</span>
                  </Label>
                  <p className="mt-1">
                    I consent to MatchWise storing and processing my personal information, CV data, 
                    and LinkedIn information for matching purposes. Data is used only to connect me 
                    with relevant assignments and can be deleted upon request.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-14 text-lg bg-gray-500 hover:bg-gray-600" 
                disabled={isUploading || !file || !email || !fullName || !linkedinUrl || !agreeToTerms}
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Processing Analysis...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-5 w-5" />
                    Submit & Join Network
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
