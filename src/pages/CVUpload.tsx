
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, CheckCircle, Brain, User, Star, Target, Trophy, BookOpen, Code, Users } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface EnhancedCVAnalysis {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  technicalSkills: {
    programming: string[];
    frameworks: string[];
    databases: string[];
    cloud: string[];
    tools: string[];
  };
  experience: {
    totalYears: string;
    roles: string[];
    industries: string[];
    keyAchievements: string[];
  };
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    impact: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  certifications: string[];
  languages: string[];
  softSkills: string[];
  careerGoals: string[];
  workPreferences: {
    workStyle: string;
    teamSize: string;
    projectType: string;
    remotePreference: string;
    travelWillingness: string;
  };
}

interface LinkedInAnalysis {
  communicationStyle: string;
  workStyle: string;
  values: string[];
  personalityTraits: string[];
  teamFit: string;
  culturalFit: number;
  adaptability: number;
  leadership: number;
  technicalDepth: number;
  communicationClarity: number;
  innovationMindset: number;
  mentorshipAbility: number;
  problemSolvingApproach: string;
  learningOrientation: string;
  collaborationPreference: string;
}

export const CVUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [linkedinAnalysis, setLinkedinAnalysis] = useState<LinkedInAnalysis | null>(null);
  const [cvAnalysis, setCvAnalysis] = useState<EnhancedCVAnalysis | null>(null);
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
      setLinkedinAnalysis(data?.analysis);
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
    
    if (!linkedinAnalysis) {
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

      const experienceYears = cvAnalysis?.experience.totalYears.match(/\d+/)?.[0] || '0';
      
      // Combine all technical skills
      const allTechnicalSkills = [
        ...(cvAnalysis?.technicalSkills.programming || []),
        ...(cvAnalysis?.technicalSkills.frameworks || []),
        ...(cvAnalysis?.technicalSkills.databases || []),
        ...(cvAnalysis?.technicalSkills.cloud || []),
        ...(cvAnalysis?.technicalSkills.tools || [])
      ];
      
      const consultantData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '',
        location: cvAnalysis?.personalInfo.location || 'Stockholm',
        skills: [...new Set(allTechnicalSkills)],
        experience_years: parseInt(experienceYears),
        roles: cvAnalysis?.experience.roles || [],
        hourly_rate: 800,
        availability: 'Available now',
        projects_completed: cvAnalysis?.projects?.length || 0,
        rating: 4.5,
        certifications: cvAnalysis?.certifications || [],
        languages: cvAnalysis?.languages || ['Swedish', 'English'],
        type: 'new',
        linkedin_url: formData.linkedinUrl,
        communication_style: linkedinAnalysis?.communicationStyle || '',
        work_style: linkedinAnalysis?.workStyle || '',
        values: linkedinAnalysis?.values || [],
        personality_traits: linkedinAnalysis?.personalityTraits || [],
        team_fit: linkedinAnalysis?.teamFit || '',
        cultural_fit: linkedinAnalysis?.culturalFit || 4,
        adaptability: linkedinAnalysis?.adaptability || 4,
        leadership: linkedinAnalysis?.leadership || 3
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

      // Send welcome email to consultant
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

      // Send registration notification to Marc
      console.log('Sending registration notification to Marc...');
      try {
        const notificationResponse = await supabase.functions.invoke('send-registration-notification', {
          body: {
            userEmail: formData.email,
            userName: formData.name
          }
        });

        if (notificationResponse.error) {
          console.warn('Registration notification failed:', notificationResponse.error);
        } else {
          console.log('Registration notification sent successfully');
        }
      } catch (notificationError) {
        console.warn('Registration notification error (non-blocking):', notificationError);
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
      setLinkedinAnalysis(null);
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
              <Code className="h-4 w-4 text-blue-500" />
              <span>Technical Skills</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-purple-500" />
              <span>Personality Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-orange-500" />
              <span>Career Goals</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-green-500" />
              <span>Achievements</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Form */}
          <div className="lg:col-span-2">
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
                  </div>

                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    disabled={isUploading || !linkedinAnalysis || !file}
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
              </CardContent>
            </Card>
          </div>

          {/* Analysis Results Sidebar */}
          <div className="space-y-6">
            {/* CV Analysis */}
            {cvAnalysis && (
              <Card className="border border-green-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-green-800 flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    CV Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Technical Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {cvAnalysis.technicalSkills.programming.slice(0, 5).map((skill, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Experience</h4>
                    <p className="text-xs text-gray-600">{cvAnalysis.experience.totalYears}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Key Achievements</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {cvAnalysis.experience.keyAchievements.slice(0, 2).map((achievement, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <Trophy className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Career Goals</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {cvAnalysis.careerGoals.slice(0, 2).map((goal, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <Target className="h-3 w-3 text-orange-500 mt-0.5 flex-shrink-0" />
                          {goal}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* LinkedIn Analysis */}
            {linkedinAnalysis && (
              <Card className="border border-purple-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-purple-800 flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    LinkedIn Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Communication Style</h4>
                    <p className="text-xs text-gray-600">{linkedinAnalysis.communicationStyle}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Work Style</h4>
                    <p className="text-xs text-gray-600">{linkedinAnalysis.workStyle}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Personality Traits</h4>
                    <div className="flex flex-wrap gap-1">
                      {linkedinAnalysis.personalityTraits.slice(0, 4).map((trait, idx) => (
                        <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="font-medium text-gray-700">Cultural Fit:</span>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full" 
                            style={{ width: `${(linkedinAnalysis.culturalFit / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span>{linkedinAnalysis.culturalFit}/5</span>
                      </div>
                    </div>
                    
                    <div>
                      <span className="font-medium text-gray-700">Leadership:</span>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-orange-600 h-2 rounded-full" 
                            style={{ width: `${(linkedinAnalysis.leadership / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span>{linkedinAnalysis.leadership}/5</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
