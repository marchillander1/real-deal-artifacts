
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, FileText, CheckCircle2, ArrowRight, Code, Users, Target, TrendingUp, Brain, Award, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Logo from '@/components/Logo';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export const CVUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
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
      setAnalysisResults(parseData.analysis);

      // Save to database with analysis data
      const { data: insertData, error: insertError } = await supabase
        .from('consultants')
        .insert({
          name: fullName,
          email: email,
          phone: phoneNumber || null,
          linkedin_url: linkedinUrl || null,
          skills: parseData.analysis?.technicalExpertise?.programmingLanguages?.expert || [],
          experience_years: parseData.analysis?.professionalSummary?.yearsOfExperience?.replace(/\D/g, '') || 0,
          hourly_rate: parseData.analysis?.marketPositioning?.salaryBenchmarks?.stockholm?.replace(/\D/g, '') || null,
          location: parseData.analysis?.personalInfo?.location || 'Sweden',
          availability: 'Available',
          cv_file_path: `cv_${Date.now()}_${file.name}`,
          communication_style: parseData.analysis?.softSkills?.communication?.[0] || 'Professional',
          work_style: parseData.analysis?.workPreferences?.workStyle || 'Collaborative',
          values: parseData.analysis?.softSkills?.leadership || [],
          personality_traits: parseData.analysis?.softSkills?.problemSolving || [],
          cultural_fit: 5,
          leadership: parseData.analysis?.professionalSummary?.seniorityLevel === 'Senior' ? 4 : 3,
          certifications: parseData.analysis?.certifications?.development || [],
          type: 'new'
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
      toast.success('CV uploaded and analyzed successfully!');

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

  if (uploadComplete && analysisResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="container mx-auto max-w-4xl">
          {/* Success Header */}
          <Card className="mb-8 text-center shadow-xl">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Logo />
              </div>
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl font-bold text-green-600">
                Analysis Complete!
              </CardTitle>
              <CardDescription>
                Din CV har analyserats och du är nu del av vårt konsultnätverk. Här är din omfattande professionella analys:
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Comprehensive Analysis Results */}
          <div className="space-y-6">
            {/* Professional Summary */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Professional Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Seniority Level:</span>
                    <p className="font-semibold">{analysisResults.professionalSummary?.seniorityLevel}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Years of Experience:</span>
                    <p className="font-semibold">{analysisResults.professionalSummary?.yearsOfExperience}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Career Trajectory:</span>
                    <p className="font-semibold text-green-600">{analysisResults.professionalSummary?.careerTrajectory}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Current Role:</span>
                    <p className="font-semibold">{analysisResults.professionalSummary?.currentRole}</p>
                  </div>
                </div>
                
                <div>
                  <span className="text-sm text-gray-600">Specializations:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {analysisResults.professionalSummary?.specializations?.map((spec: string, idx: number) => (
                      <Badge key={idx} className="bg-blue-100 text-blue-800">{spec}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technical Expertise */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-purple-500" />
                  Technical Expertise
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Expert Level:</span>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {analysisResults.technicalExpertise?.programmingLanguages?.expert?.map((skill: string, idx: number) => (
                        <Badge key={idx} className="bg-green-100 text-green-800 text-xs">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Proficient:</span>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {analysisResults.technicalExpertise?.programmingLanguages?.proficient?.map((skill: string, idx: number) => (
                        <Badge key={idx} className="bg-blue-100 text-blue-800 text-xs">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Familiar:</span>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {analysisResults.technicalExpertise?.programmingLanguages?.familiar?.map((skill: string, idx: number) => (
                        <Badge key={idx} className="bg-gray-100 text-gray-800 text-xs">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-700">Cloud & Infrastructure:</span>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {analysisResults.technicalExpertise?.cloudAndInfrastructure?.platforms?.map((platform: string, idx: number) => (
                      <Badge key={idx} className="bg-orange-100 text-orange-800 text-xs">{platform}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Strengths Analysis */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Key Strengths & Market Position
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysisResults.detailedStrengthsAnalysis?.slice(0, 3).map((strength: any, idx: number) => (
                  <div key={idx} className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold text-green-700">{strength.category}</h4>
                    <p className="text-sm text-gray-600 mt-1">{strength.description}</p>
                    <div className="mt-2">
                      <span className="text-xs text-gray-500">Market Value: </span>
                      <span className="text-xs font-medium">{strength.marketValue}</span>
                    </div>
                  </div>
                ))}
                
                <div className="bg-green-50 p-4 rounded-lg mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-semibold">Market Positioning</span>
                  </div>
                  <p className="text-sm text-gray-700">{analysisResults.marketPositioning?.uniqueValueProposition}</p>
                  <div className="mt-2">
                    <span className="text-xs text-gray-600">Competitiveness: </span>
                    <span className="text-xs font-semibold text-green-600">{analysisResults.marketPositioning?.competitiveness}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Improvement Areas */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-orange-500" />
                  Development Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysisResults.comprehensiveImprovementAreas?.slice(0, 3).map((area: any, idx: number) => (
                  <div key={idx} className="border border-orange-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-orange-700">{area.area}</h4>
                      <Badge className={`text-xs ${
                        area.improvementPriority === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {area.improvementPriority} Priority
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{area.currentState}</p>
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">Expected Impact: </span>
                      {area.expectedImpact}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      <span className="font-medium">Timeline: </span>
                      {area.timeToImplement}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Salary Benchmarks */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-500" />
                  Salary Benchmarks & Career Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Stockholm Market</p>
                    <p className="font-bold text-lg text-blue-600">{analysisResults.marketPositioning?.salaryBenchmarks?.stockholm}</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">European Tech</p>
                    <p className="font-bold text-lg text-green-600">{analysisResults.marketPositioning?.salaryBenchmarks?.europeanTech}</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600">Remote Global</p>
                    <p className="font-bold text-lg text-purple-600">{analysisResults.marketPositioning?.salaryBenchmarks?.remoteGlobal}</p>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-700">Target Roles:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {analysisResults.marketPositioning?.targetRoles?.slice(0, 6).map((role: string, idx: number) => (
                      <Badge key={idx} className="bg-purple-100 text-purple-800 text-xs">{role}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Button */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Vi har skickat en välkomstmail till {email} med nästa steg.
              </p>
              <Button onClick={handleContinue} className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3">
                Continue to Pricing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
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
