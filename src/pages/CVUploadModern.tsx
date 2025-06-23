import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, Check, ArrowLeft, Brain, Linkedin, Star, Shield, Zap, User, Mail, Phone, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CVUploadFlow } from '@/components/cv-analysis/CVUploadFlow';
import { MatchWiseChat } from '@/components/MatchWiseChat';
import Logo from '@/components/Logo';
import { supabase } from '@/integrations/supabase/client';
import { CVParser } from '@/components/cv-analysis/CVParser';

export default function CVUploadModern() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState<'upload' | 'personal-info' | 'processing' | 'analysis' | 'complete'>('upload');
  const [consultant, setConsultant] = useState<any>(null);
  const [chatMinimized, setChatMinimized] = useState(true);
  const [cvAnalysisData, setCvAnalysisData] = useState<any>(null);
  
  // Personal info state
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    selfDescription: ''
  });

  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const source = searchParams.get('source');
  const isMyConsultant = source === 'my-consultants';

  // Auto-analyze CV when file is uploaded
  useEffect(() => {
    const analyzeCV = async () => {
      if (!file) return;
      
      console.log('🔍 Starting automatic CV analysis for:', file.name);
      
      try {
        setIsProcessing(true);
        setProgress(20);
        
        const { analysis, detectedInfo } = await CVParser.parseCV(file, '');
        setProgress(60);
        
        console.log('📊 CV analysis completed:', { analysis, detectedInfo });
        
        // Auto-fill personal information from CV analysis
        const extractedInfo = {
          name: detectedInfo?.names?.[0] || analysis?.personalInfo?.name || '',
          email: detectedInfo?.emails?.[0] || analysis?.personalInfo?.email || '',
          phone: detectedInfo?.phones?.[0] || analysis?.personalInfo?.phone || '',
          location: detectedInfo?.locations?.[0] || analysis?.personalInfo?.location || '',
          selfDescription: ''
        };
        
        console.log('✅ Auto-filling personal info:', extractedInfo);
        
        setPersonalInfo(prev => ({
          ...prev,
          ...extractedInfo
        }));
        
        setCvAnalysisData({ analysis, detectedInfo });
        setProgress(100);
        
        toast({
          title: "CV analyzed successfully! 🎉",
          description: "Personal information has been auto-filled from your CV",
        });
        
      } catch (error: any) {
        console.error('❌ CV analysis failed:', error);
        toast({
          title: "CV analysis failed",
          description: error.message || "Could not analyze CV. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    };

    analyzeCV();
  }, [file, toast]);

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
      description: `${selectedFile.name} is ready for analysis`,
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleContinueToPersonalInfo = () => {
    if (!file || !cvAnalysisData) {
      toast({
        title: "CV analysis required",
        description: "Please wait for CV analysis to complete",
        variant: "destructive",
      });
      return;
    }

    setStep('personal-info');
  };

  const handleStartProcessing = () => {
    if (!personalInfo.name.trim() || !personalInfo.email.trim()) {
      toast({
        title: "Required fields missing",
        description: "Please fill in name and email",
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
    setStep('analysis');
    setIsProcessing(false);
    setProgress(100);
  };

  const handleProcessingError = (error: string) => {
    setIsProcessing(false);
    setStep('personal-info');
    setProgress(0);
    toast({
      title: "Processing failed",
      description: error,
      variant: "destructive",
    });
  };

  const handleJoinNetwork = async () => {
    try {
      console.log('🌐 Joining MatchWise Network...');
      
      // Send welcome email with consultant info
      const response = await supabase.functions.invoke('send-welcome-email', {
        body: {
          consultantEmail: personalInfo.email,
          consultantName: personalInfo.name,
          isMyConsultant: false // Network consultant
        }
      });

      if (response.error) {
        console.error('❌ Welcome email failed:', response.error);
      }

      // Send admin notification to Marc
      await supabase.functions.invoke('send-registration-notification', {
        body: {
          consultantName: personalInfo.name,
          consultantEmail: personalInfo.email,
          isMyConsultant: false
        }
      });

      toast({
        title: "Welcome to MatchWise Network! 🎉",
        description: "Check your email for login credentials",
      });
      
      // Navigate to NetworkSuccess page
      navigate(`/network-success?consultant=${consultant?.id}`);
      
    } catch (error) {
      console.error('❌ Join network failed:', error);
      toast({
        title: "Error joining network",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const goBack = () => {
    if (step === 'personal-info') {
      setStep('upload');
    } else if (isMyConsultant) {
      navigate('/matchwiseai');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Logo size="md" variant="full" />
          <Button onClick={goBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Value Proposition Section */}
            <Card className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Brain className="h-6 w-6 mr-3 text-purple-600" />
                  AI-Driven CV Analysis & Market Positioning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Zap className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Instant Analysis</h3>
                    <p className="text-sm text-gray-600">AI extracts skills, experience, and market value from your CV in seconds</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Star className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Market Rates</h3>
                    <p className="text-sm text-gray-600">Get precise hourly rate recommendations based on your skills and location</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Shield className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold mb-2">GDPR Safe</h3>
                    <p className="text-sm text-gray-600">Your data is processed securely and deleted after analysis completion</p>
                  </div>
                </div>
                <div className="bg-white/70 rounded-lg p-4 border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-2">What you'll get:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• <strong>Skills Assessment:</strong> Technical and soft skills analysis with market demand scoring</li>
                    <li>• <strong>Experience Evaluation:</strong> Career trajectory analysis and leadership potential</li>
                    <li>• <strong>Market Positioning:</strong> Optimal hourly rates and competitive advantages</li>
                    <li>• <strong>Personal Branding:</strong> Professional perception insights and LinkedIn optimization tips</li>
                    <li>• <strong>Growth Recommendations:</strong> Certification paths and skill development priorities</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-center space-x-4">
                <div className={`flex items-center ${step === 'upload' ? 'text-blue-600' : ['personal-info', 'processing', 'analysis', 'complete'].includes(step) ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${step === 'upload' ? 'bg-blue-100' : ['personal-info', 'processing', 'analysis', 'complete'].includes(step) ? 'bg-green-100' : 'bg-gray-100'}`}>
                    {['personal-info', 'processing', 'analysis', 'complete'].includes(step) ? <Check className="h-4 w-4" /> : '1'}
                  </div>
                  Upload CV
                </div>
                <div className={`flex items-center ${step === 'personal-info' ? 'text-blue-600' : ['processing', 'analysis', 'complete'].includes(step) ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${step === 'personal-info' ? 'bg-blue-100' : ['processing', 'analysis', 'complete'].includes(step) ? 'bg-green-100' : 'bg-gray-100'}`}>
                    {['processing', 'analysis', 'complete'].includes(step) ? <Check className="h-4 w-4" /> : '2'}
                  </div>
                  Personal Info
                </div>
                <div className={`flex items-center ${step === 'processing' ? 'text-blue-600' : ['analysis', 'complete'].includes(step) ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${step === 'processing' ? 'bg-blue-100' : ['analysis', 'complete'].includes(step) ? 'bg-green-100' : 'bg-gray-100'}`}>
                    {['analysis', 'complete'].includes(step) ? <Check className="h-4 w-4" /> : '3'}
                  </div>
                  AI Analysis
                </div>
                <div className={`flex items-center ${step === 'analysis' ? 'text-blue-600' : step === 'complete' ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${step === 'analysis' ? 'bg-blue-100' : step === 'complete' ? 'bg-green-100' : 'bg-gray-100'}`}>
                    {step === 'complete' ? <Check className="h-4 w-4" /> : '4'}
                  </div>
                  View Analysis
                </div>
              </div>
            </div>

            {/* Step Content */}
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
                      <div className="space-y-4">
                        <div className="flex items-center justify-center space-x-3">
                          <FileText className="h-8 w-8 text-green-600" />
                          <div>
                            <p className="font-semibold text-green-700">{file.name}</p>
                            <p className="text-sm text-green-600">Ready for analysis ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>
                          </div>
                        </div>
                        
                        {/* Analysis Status */}
                        {isProcessing && (
                          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center space-x-2 mb-2">
                              <Brain className="h-5 w-5 text-blue-600 animate-pulse" />
                              <span className="text-blue-800 font-medium">Analyzing CV...</span>
                            </div>
                            <Progress value={progress} className="mb-2" />
                            <p className="text-sm text-blue-600">
                              Extracting personal information and skills from your CV
                            </p>
                          </div>
                        )}
                        
                        {cvAnalysisData && !isProcessing && (
                          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center space-x-2 mb-2">
                              <Check className="h-5 w-5 text-green-600" />
                              <span className="font-medium text-green-800">CV Analysis Complete!</span>
                            </div>
                            <p className="text-sm text-green-600">
                              Personal information has been extracted and will be auto-filled in the next step
                            </p>
                          </div>
                        )}
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

                  {/* Continue Button */}
                  <Button
                    onClick={handleContinueToPersonalInfo}
                    disabled={!file || !cvAnalysisData || isProcessing}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <Brain className="h-4 w-4 mr-2 animate-pulse" />
                        Analyzing CV...
                      </>
                    ) : !file ? (
                      "Please upload CV first"
                    ) : !cvAnalysisData ? (
                      "Waiting for CV analysis..."
                    ) : (
                      "Continue to Personal Information"
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {step === 'personal-info' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Personal Information</CardTitle>
                  <p className="text-center text-gray-600">
                    Information extracted from your CV - please review and edit if needed
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Auto-filled notification */}
                  {cvAnalysisData && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Check className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-800">Information auto-filled from CV</span>
                      </div>
                      <p className="text-sm text-green-700">
                        We've extracted your personal information from the CV. Please review and edit if needed.
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="name"
                          value={personalInfo.name}
                          onChange={(e) => setPersonalInfo({...personalInfo, name: e.target.value})}
                          className="pl-10"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          value={personalInfo.email}
                          onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                          className="pl-10"
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="phone"
                          value={personalInfo.phone}
                          onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                          className="pl-10"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="location"
                          value={personalInfo.location}
                          onChange={(e) => setPersonalInfo({...personalInfo, location: e.target.value})}
                          className="pl-10"
                          placeholder="Enter your location"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="selfDescription">Tell us about yourself</Label>
                    <Textarea
                      id="selfDescription"
                      value={personalInfo.selfDescription}
                      onChange={(e) => setPersonalInfo({...personalInfo, selfDescription: e.target.value})}
                      placeholder="Share your work style, values, passions, or anything else you'd like us to know for better analysis..."
                      rows={5}
                      maxLength={1000}
                    />
                    <p className="text-xs text-gray-500">
                      {personalInfo.selfDescription.length}/1000 characters - This helps our AI provide more accurate personality and soft skills analysis
                    </p>
                  </div>

                  <Button
                    onClick={handleStartProcessing}
                    disabled={!personalInfo.name.trim() || !personalInfo.email.trim()}
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

            {step === 'analysis' && consultant && (
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center">Your AI Analysis Results</CardTitle>
                    <p className="text-center text-gray-600">
                      Complete analysis of your skills, experience, and market position
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Skills Analysis */}
                    {consultant.analysis?.skills && (
                      <div>
                        <h3 className="font-semibold mb-3">Technical Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {consultant.analysis.skills.technical?.map((skill: string, index: number) => (
                            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Experience Level */}
                    {consultant.analysis?.experience && (
                      <div>
                        <h3 className="font-semibold mb-3">Experience Analysis</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <p className="text-2xl font-bold text-blue-600">{consultant.analysis.experience.years || 'N/A'}</p>
                            <p className="text-sm text-gray-600">Years Experience</p>
                          </div>
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <p className="text-lg font-semibold">{consultant.analysis.experience.level || 'N/A'}</p>
                            <p className="text-sm text-gray-600">Experience Level</p>
                          </div>
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <p className="text-lg font-semibold">{consultant.analysis.experience.currentRole || 'N/A'}</p>
                            <p className="text-sm text-gray-600">Current Role</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Market Analysis */}
                    {consultant.analysis?.marketAnalysis && (
                      <div>
                        <h3 className="font-semibold mb-3">Market Position</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-green-50 rounded-lg">
                            <p className="text-xl font-bold text-green-600">
                              {consultant.analysis.marketAnalysis.hourlyRate?.current || 0} SEK/h
                            </p>
                            <p className="text-sm text-gray-600">Current Market Rate</p>
                          </div>
                          <div className="p-4 bg-purple-50 rounded-lg">
                            <p className="text-xl font-bold text-purple-600">
                              {consultant.analysis.marketAnalysis.hourlyRate?.optimized ||0} SEK/h
                            </p>
                            <p className="text-sm text-gray-600">Optimized Rate</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Soft Skills Scores */}
                    {consultant.analysis?.scores && (
                      <div>
                        <h3 className="font-semibold mb-3">Professional Scores</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-lg font-bold">{consultant.analysis.scores.leadership || 0}/5</p>
                            <p className="text-xs text-gray-600">Leadership</p>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-lg font-bold">{consultant.analysis.scores.communication || 0}/5</p>
                            <p className="text-xs text-gray-600">Communication</p>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-lg font-bold">{consultant.analysis.scores.adaptability || 0}/5</p>
                            <p className="text-xs text-gray-600">Adaptability</p>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-lg font-bold">{consultant.analysis.scores.innovation || 0}/5</p>
                            <p className="text-xs text-gray-600">Innovation</p>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-lg font-bold">{consultant.analysis.scores.teamwork || 0}/5</p>
                            <p className="text-xs text-gray-600">Teamwork</p>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-lg font-bold">{consultant.analysis.scores.culturalFit || 0}/5</p>
                            <p className="text-xs text-gray-600">Cultural Fit</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-6">
                      <Button 
                        onClick={handleJoinNetwork}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        size="lg"
                      >
                        Join Network
                      </Button>
                      <Button 
                        onClick={goBack}
                        variant="outline"
                        className="flex-1"
                        size="lg"
                      >
                        Back to Dashboard
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Background Processing - Only starts when in processing step */}
            {isProcessing && file && step === 'processing' && (
              <CVUploadFlow
                file={file}
                linkedinUrl={linkedinUrl}
                personalDescription={personalInfo.selfDescription}
                onProgress={setProgress}
                onComplete={handleProcessingComplete}
                onError={handleProcessingError}
              />
            )}
          </div>

          {/* AI Chat Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <MatchWiseChat
                showWelcome={true}
                isMinimized={chatMinimized}
                onToggleMinimize={() => setChatMinimized(!chatMinimized)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
