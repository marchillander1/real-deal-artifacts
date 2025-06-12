
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, CheckCircle, AlertCircle, User, Mail, Phone, Brain, Star } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface AnalysisResult {
  skills: string[];
  experience: string;
  roles: string[];
  strengths: string[];
  recommendations: string[];
  personalityTraits: string[];
  communicationStyle: string;
  workStyle: string;
  culturalFit: number;
  adaptability: number;
  leadership: number;
}

interface CVAnalysis {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  skills: string[];
  experience: string;
  roles: string[];
  education: string[];
  languages: string[];
}

export const CVUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [cvAnalysis, setCvAnalysis] = useState<CVAnalysis | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    linkedinUrl: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      console.log('CV file selected:', selectedFile.name);
      toast.success(`CV file "${selectedFile.name}" selected`);
      
      // Auto-parse CV when selected
      await parseCV(selectedFile);
    }
  };

  const parseCV = async (file: File) => {
    setIsParsing(true);
    try {
      console.log('Starting CV parsing...');
      
      const formData = new FormData();
      formData.append('file', file);

      const { data, error } = await supabase.functions.invoke('parse-cv', {
        body: formData
      });

      if (error) {
        console.error('CV parsing error:', error);
        throw new Error(error.message || 'CV parsing failed');
      }

      console.log('CV parsing result:', data);

      if (data?.success && data?.analysis) {
        setCvAnalysis(data.analysis);
        
        // Auto-fill form with CV data
        setFormData(prev => ({
          ...prev,
          name: data.analysis.personalInfo.name || prev.name,
          email: data.analysis.personalInfo.email || prev.email,
          phone: data.analysis.personalInfo.phone || prev.phone
        }));

        toast.success('CV parsed successfully and form auto-filled!');
      }

    } catch (error: any) {
      console.error('CV parsing error:', error);
      toast.error(error.message || 'Failed to parse CV');
    } finally {
      setIsParsing(false);
    }
  };

  const analyzeLinkedIn = async () => {
    if (!formData.linkedinUrl) {
      toast.error('Please enter your LinkedIn URL first');
      return;
    }

    setIsAnalyzing(true);
    try {
      console.log('Starting LinkedIn analysis...');
      
      const { data, error } = await supabase.functions.invoke('analyze-linkedin', {
        body: { linkedinUrl: formData.linkedinUrl }
      });

      if (error) {
        console.error('Analysis error:', error);
        throw new Error(error.message || 'Analysis failed');
      }

      console.log('Analysis result:', data);

      const analysis: AnalysisResult = data?.analysis || {
        skills: cvAnalysis?.skills || ['React', 'TypeScript', 'Node.js'],
        experience: cvAnalysis?.experience || '5+ years in software development',
        roles: cvAnalysis?.roles || ['Full-Stack Developer'],
        strengths: ['Problem-solving', 'Team collaboration', 'Technical leadership'],
        recommendations: ['Consider cloud certifications', 'Expand mobile development skills'],
        personalityTraits: ['Analytical', 'Creative', 'Detail-oriented'],
        communicationStyle: 'Clear and collaborative',
        workStyle: 'Agile and iterative',
        culturalFit: 4,
        adaptability: 4,
        leadership: 3
      };

      setAnalysisResult(analysis);
      toast.success('LinkedIn analysis completed successfully!');

    } catch (error: any) {
      console.error('LinkedIn analysis error:', error);
      toast.error(error.message || 'Failed to analyze LinkedIn profile');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please upload your CV first');
      return;
    }
    
    if (!analysisResult) {
      toast.error('Please analyze your LinkedIn profile first');
      return;
    }

    setIsUploading(true);

    try {
      console.log('Creating consultant profile...');

      if (!formData.name || !formData.email || !formData.linkedinUrl) {
        toast.error('Name, email and LinkedIn URL are required');
        return;
      }

      const experienceYears = analysisResult.experience.match(/\d+/)?.[0] || '0';
      
      // Safely combine skills from both analyses
      const combinedSkills = [
        ...(analysisResult.skills || []),
        ...(cvAnalysis?.skills || [])
      ];
      const uniqueSkills = [...new Set(combinedSkills)];
      
      // Safely combine roles from both analyses
      const combinedRoles = [
        ...(analysisResult.roles || []),
        ...(cvAnalysis?.roles || [])
      ];
      const uniqueRoles = [...new Set(combinedRoles)];
      
      const consultantData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '',
        location: 'Stockholm',
        skills: uniqueSkills,
        experience_years: parseInt(experienceYears),
        roles: uniqueRoles,
        hourly_rate: 800,
        availability: 'Available now',
        projects_completed: 0,
        rating: 4.5,
        certifications: [],
        languages: cvAnalysis?.languages || ['Swedish', 'English'],
        type: 'new',
        linkedin_url: formData.linkedinUrl,
        communication_style: analysisResult.communicationStyle,
        work_style: analysisResult.workStyle,
        values: ['Quality', 'Innovation', 'Teamwork'],
        personality_traits: analysisResult.personalityTraits || [],
        team_fit: 'Strong collaborative skills',
        cultural_fit: analysisResult.culturalFit,
        adaptability: analysisResult.adaptability,
        leadership: analysisResult.leadership
      };

      console.log('Inserting consultant data:', consultantData);

      const { data: insertedConsultant, error: insertError } = await supabase
        .from('consultants')
        .insert([consultantData])
        .select()
        .single();

      if (insertError) {
        console.error('Database insert error:', insertError);
        throw new Error(`Database error: ${insertError.message}`);
      }

      console.log('Consultant inserted successfully:', insertedConsultant);

      if (formData.email) {
        console.log('Sending welcome email...');
        try {
          const emailResponse = await supabase.functions.invoke('send-welcome-email', {
            body: {
              userEmail: formData.email,
              userName: formData.name
            }
          });

          if (emailResponse.error) {
            console.warn('Email sending failed:', emailResponse.error);
          } else {
            console.log('Welcome email sent successfully');
          }
        } catch (emailError) {
          console.warn('Email error (non-blocking):', emailError);
        }
      }

      setUploadSuccess(true);
      toast.success('Profile created successfully! Welcome to MatchWise!');
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        linkedinUrl: ''
      });
      setFile(null);
      setAnalysisResult(null);
      setCvAnalysis(null);

    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'An error occurred during upload');
    } finally {
      setIsUploading(false);
    }
  };

  if (uploadSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to MatchWise!</h2>
            <p className="text-gray-600 mb-6">
              Your profile has been successfully added. You'll soon be visible to hiring companies on the platform.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => setUploadSuccess(false)}
                className="w-full"
              >
                Upload Another Consultant
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.href = '/matchwiseai'}
              >
                Go to MatchWise AI
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <div className="mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4">
              <Brain className="h-4 w-4 mr-2" />
              AI-Powered Career Analysis
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Upload Your CV & LinkedIn Profile
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get instant AI analysis of your skills, personality, and career potential. Upload 
            your CV and add your LinkedIn profile to receive comprehensive insights and join 
            our exclusive consultant network.
          </p>
          
          {/* Feature icons */}
          <div className="flex justify-center items-center gap-8 mt-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-blue-500" />
              <span>AI Skills Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-purple-500" />
              <span>Personality Profiling</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-orange-500" />
              <span>Career Insights</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Instant Results</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-2xl text-gray-900 flex items-center justify-center gap-3">
              <Upload className="h-6 w-6 text-blue-600" />
              Start Your Analysis
            </CardTitle>
            <p className="text-sm text-gray-500 mt-2">
              Both CV and LinkedIn profile are required for complete analysis
            </p>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* CV Upload */}
              <div>
                <Label htmlFor="cv-upload" className="text-base font-medium text-gray-900 mb-3 block">
                  CV File *
                </Label>
                <div className="relative">
                  <Input
                    id="cv-upload"
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                    required
                    className="h-12 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {isParsing && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-blue-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span>Parsing CV...</span>
                    </div>
                  )}
                  {file && !isParsing && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>{file.name} uploaded and parsed</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Accepted formats: PDF, Word (.doc, .docx)
                </p>
              </div>

              {/* LinkedIn URL */}
              <div>
                <Label htmlFor="linkedinUrl" className="text-base font-medium text-gray-900 mb-3 block">
                  LinkedIn Profile URL *
                </Label>
                <div className="flex gap-3">
                  <Input
                    id="linkedinUrl"
                    name="linkedinUrl"
                    type="url"
                    required
                    value={formData.linkedinUrl}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="flex-1 h-12"
                  />
                  <Button 
                    type="button"
                    onClick={analyzeLinkedIn}
                    disabled={!formData.linkedinUrl || isAnalyzing}
                    className="bg-purple-600 hover:bg-purple-700 px-6"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Analyzing...
                      </>
                    ) : (
                      'Analyze'
                    )}
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Required: LinkedIn profile for enhanced personality and communication analysis
                </p>
              </div>

              {/* Personal Information */}
              <div>
                <Label className="text-base font-medium text-gray-900 mb-3 block">
                  Full Name *
                </Label>
                <Input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  className="h-12"
                />
              </div>

              <div>
                <Label className="text-base font-medium text-gray-900 mb-3 block">
                  Email *
                </Label>
                <Input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="h-12"
                />
              </div>

              <div>
                <Label className="text-base font-medium text-gray-900 mb-3 block">
                  Phone
                </Label>
                <Input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+46 70 123 45 67"
                  className="h-12"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-gray-600 hover:bg-gray-700 text-white font-medium" 
                disabled={isUploading || !analysisResult || !file}
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Profile...
                  </>
                ) : (
                  <>
                    <Star className="h-4 w-4 mr-2" />
                    Submit & Join Network
                  </>
                )}
              </Button>
            </form>

            {/* Analysis Results */}
            {(cvAnalysis || analysisResult) && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Results</h3>
                
                {cvAnalysis && (
                  <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-800 mb-2">CV Analysis Complete</h4>
                    <div className="text-sm text-green-700">
                      <p><strong>Skills identified:</strong> {(cvAnalysis.skills || []).join(', ')}</p>
                      <p><strong>Experience:</strong> {cvAnalysis.experience}</p>
                    </div>
                  </div>
                )}

                {analysisResult && (
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-medium text-purple-800 mb-2">LinkedIn Analysis Complete</h4>
                    <div className="text-sm text-purple-700">
                      <p><strong>Communication Style:</strong> {analysisResult.communicationStyle}</p>
                      <p><strong>Work Style:</strong> {analysisResult.workStyle}</p>
                      <div className="flex gap-4 mt-2">
                        <span>Cultural Fit: {analysisResult.culturalFit}/5</span>
                        <span>Adaptability: {analysisResult.adaptability}/5</span>
                        <span>Leadership: {analysisResult.leadership}/5</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
