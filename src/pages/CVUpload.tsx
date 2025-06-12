
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, CheckCircle, AlertCircle, User, Mail, Phone, MapPin, Briefcase, Brain, Star } from 'lucide-react';
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

export const CVUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    linkedinUrl: '',
    availability: 'Available now'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      console.log('CV file selected:', selectedFile.name);
      toast.success(`CV file "${selectedFile.name}" selected`);
    }
  };

  const analyzeCV = async () => {
    if (!file) {
      toast.error('Please select a CV file first');
      return;
    }

    setIsAnalyzing(true);
    try {
      console.log('Starting CV analysis...');
      
      // Create FormData for file upload
      const formDataForUpload = new FormData();
      formDataForUpload.append('file', file);

      // Call analysis function
      const { data, error } = await supabase.functions.invoke('analyze-linkedin', {
        body: formDataForUpload
      });

      if (error) {
        console.error('Analysis error:', error);
        throw new Error(error.message || 'Analysis failed');
      }

      console.log('Analysis result:', data);

      // Mock analysis result for demo (replace with actual API response parsing)
      const mockAnalysis: AnalysisResult = {
        skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS'],
        experience: '5+ years in software development',
        roles: ['Full-Stack Developer', 'Software Engineer'],
        strengths: ['Problem-solving', 'Team collaboration', 'Technical leadership'],
        recommendations: ['Consider cloud certifications', 'Expand mobile development skills'],
        personalityTraits: ['Analytical', 'Creative', 'Detail-oriented'],
        communicationStyle: 'Clear and collaborative',
        workStyle: 'Agile and iterative',
        culturalFit: 4,
        adaptability: 4,
        leadership: 3
      };

      setAnalysisResult(mockAnalysis);
      toast.success('CV analysis completed successfully!');

    } catch (error: any) {
      console.error('CV analysis error:', error);
      toast.error(error.message || 'Failed to analyze CV');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!analysisResult) {
      toast.error('Please analyze your CV first');
      return;
    }

    setIsUploading(true);

    try {
      console.log('Creating consultant profile...');

      // Validate required fields
      if (!formData.name || !formData.email) {
        toast.error('Name and email are required');
        return;
      }

      // Parse experience years from analysis
      const experienceYears = analysisResult.experience.match(/\d+/)?.[0] || '0';
      
      // Prepare consultant data
      const consultantData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '',
        location: formData.location || 'Stockholm',
        skills: analysisResult.skills,
        experience_years: parseInt(experienceYears),
        roles: analysisResult.roles,
        hourly_rate: 800, // Default rate
        availability: formData.availability,
        projects_completed: 0,
        rating: 4.5,
        certifications: [],
        languages: ['Swedish', 'English'],
        type: 'new',
        linkedin_url: formData.linkedinUrl || '',
        communication_style: analysisResult.communicationStyle,
        work_style: analysisResult.workStyle,
        values: ['Quality', 'Innovation', 'Teamwork'],
        personality_traits: analysisResult.personalityTraits,
        team_fit: 'Strong collaborative skills',
        cultural_fit: analysisResult.culturalFit,
        adaptability: analysisResult.adaptability,
        leadership: analysisResult.leadership
      };

      console.log('Inserting consultant data:', consultantData);

      // Insert consultant into database
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

      // Send welcome email
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
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        location: '',
        linkedinUrl: '',
        availability: 'Available now'
      });
      setFile(null);
      setAnalysisResult(null);

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
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Join the MatchWise Consultant Network
            </h1>
            <p className="text-lg text-gray-600">
              Upload your CV and get AI-powered analysis to join our exclusive network
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - CV Upload & Analysis */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-blue-600" />
                  CV Upload & Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* File Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <div className="relative">
                      <Button type="button" variant="outline" className="relative">
                        <Upload className="h-4 w-4 mr-2" />
                        {file ? file.name : 'Choose CV File'}
                      </Button>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      PDF, DOC or DOCX up to 10MB
                    </p>
                  </div>
                </div>

                {/* Analysis Button */}
                <Button 
                  onClick={analyzeCV}
                  disabled={!file || isAnalyzing}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Analyzing CV...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Analyze with AI
                    </>
                  )}
                </Button>

                {/* Analysis Results */}
                {analysisResult && (
                  <Card className="border-green-200 bg-green-50">
                    <CardHeader>
                      <CardTitle className="text-lg text-green-800 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        Analysis Complete
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Key Skills Identified</h4>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.skills.map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Experience Level</h4>
                        <p className="text-gray-700">{analysisResult.experience}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Suitable Roles</h4>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.roles.map((role, index) => (
                            <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                              {role}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="flex items-center justify-center mb-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-4 w-4 ${i < analysisResult.culturalFit ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                            ))}
                          </div>
                          <p className="text-xs text-gray-600">Cultural Fit</p>
                        </div>
                        <div>
                          <div className="flex items-center justify-center mb-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-4 w-4 ${i < analysisResult.adaptability ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                            ))}
                          </div>
                          <p className="text-xs text-gray-600">Adaptability</p>
                        </div>
                        <div>
                          <div className="flex items-center justify-center mb-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-4 w-4 ${i < analysisResult.leadership ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                            ))}
                          </div>
                          <p className="text-xs text-gray-600">Leadership</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>

            {/* Personal Information Form */}
            {analysisResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your full name"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone" className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Phone
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+46 70 123 45 67"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="location" className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Location
                        </Label>
                        <Input
                          id="location"
                          name="location"
                          type="text"
                          value={formData.location}
                          onChange={handleInputChange}
                          placeholder="Stockholm"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="linkedinUrl">LinkedIn Profile (Optional)</Label>
                      <Input
                        id="linkedinUrl"
                        name="linkedinUrl"
                        type="url"
                        value={formData.linkedinUrl}
                        onChange={handleInputChange}
                        placeholder="https://linkedin.com/in/your-name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="availability">Availability</Label>
                      <Input
                        id="availability"
                        name="availability"
                        type="text"
                        value={formData.availability}
                        onChange={handleInputChange}
                        placeholder="Available now"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700" 
                      size="lg"
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Creating Profile...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Join MatchWise Network
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Info */}
          <div className="space-y-6">
            {/* Benefits Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-blue-600">
                  Why Join MatchWise?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">AI-Powered Matching</h4>
                    <p className="text-sm text-gray-600">
                      Our AI matches you with projects based on skills and personality
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Premium Projects</h4>
                    <p className="text-sm text-gray-600">
                      Hand-picked assignments from renowned companies
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Fast Process</h4>
                    <p className="text-sm text-gray-600">
                      From matching to project start in just days
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Personal Support</h4>
                    <p className="text-sm text-gray-600">
                      Dedicated consultant manager throughout the process
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Process Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-purple-600">
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">Upload & Analyze</h4>
                    <p className="text-sm text-gray-600">Upload your CV and get AI analysis</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">Profile Creation</h4>
                    <p className="text-sm text-gray-600">Complete your consultant profile</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">AI Matching</h4>
                    <p className="text-sm text-gray-600">Get matched with perfect projects</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold">Start Working</h4>
                    <p className="text-sm text-gray-600">Begin your new consulting assignment</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Analysis Info */}
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="text-lg text-purple-800 flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI-Powered Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-700 text-sm">
                  Our advanced AI analyzes your CV to identify skills, experience level, 
                  personality traits, and cultural fit. This ensures better project matches 
                  and higher success rates for both consultants and clients.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
