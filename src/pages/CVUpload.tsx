
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle, User, Mail, Phone, MapPin, Briefcase, Code, Star, Award, Languages, Lightbulb, Target, Brain, Linkedin, Users, MessageCircle, Rocket } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const CVUpload = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [isAnalyzingLinkedin, setIsAnalyzingLinkedin] = useState(false);
  const [linkedinAnalysis, setLinkedinAnalysis] = useState<any>(null);
  const [cvTips, setCvTips] = useState<string[]>([]);
  const [dataProcessingConsent, setDataProcessingConsent] = useState(false);
  const { toast } = useToast();

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    role: '',
    experience: '',
    skills: '',
    rate: '',
    availability: '',
    certifications: '',
    languages: '',
    motivation: '',
    education: '',
    portfolio: '',
    achievements: '',
    interests: '',
    careerGoals: '',
    preferredWorkType: '',
    salaryExpectation: '',
    noticePeriod: '',
    travelWillingness: '',
    workExperience: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      processCV(file);
    }
  };

  const processCV = async (file: File) => {
    setIsProcessing(true);
    
    // Simulate AI CV analysis
    setTimeout(() => {
      // Auto-fill form with extracted data
      setFormData({
        name: "Anna Andersson",
        email: "anna.andersson@email.com",
        phone: "+46 70 123 45 67",
        location: "Stockholm",
        role: "Senior Developer",
        experience: "5 years",
        skills: "React, TypeScript, Node.js, AWS, Python, Docker",
        rate: "800 SEK/hour",
        availability: "available",
        certifications: "AWS Certified, React Advanced",
        languages: "Swedish, English",
        motivation: "Passionate about creating innovative solutions and working with cutting-edge technologies. I love solving complex problems and mentoring junior developers.",
        education: "Master's in Computer Science",
        portfolio: "github.com/anna-dev, portfolio.anna.se",
        achievements: "Led 5+ successful projects, 98% client satisfaction",
        interests: "AI/ML, Open Source, Tech Conferences",
        careerGoals: "Become a tech lead in AI-driven development",
        preferredWorkType: "Hybrid",
        salaryExpectation: "800-1000 SEK/hour",
        noticePeriod: "2 weeks",
        travelWillingness: "Occasionally",
        workExperience: "Senior Developer at TechCorp (2019-2024): Led development of microservices architecture"
      });

      // Generate CV tips
      const generatedCvTips = [
        "💡 Keep it concise - Aim for 1-2 pages max. Highlight your most relevant experience and skills.",
        "✅ Professional format - Use a clean, readable font and consistent formatting.",
        "🎯 Use keywords - Include industry-specific keywords and technologies you master.",
        "📈 Quantify achievements - Use numbers and metrics to show your impact and results.",
        "🔄 Update regularly - Keep your CV current with your latest projects and certifications.",
        "📝 Proofread carefully - Ensure there are no spelling or grammatical errors."
      ];
      
      setCvTips(generatedCvTips);
      setIsProcessing(false);
    }, 3000);
  };

  const handleLinkedInAnalysis = async () => {
    if (!linkedinUrl) {
      toast({
        title: "LinkedIn URL krävs",
        description: "Vänligen ange en LinkedIn-profil URL först",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzingLinkedin(true);
    
    try {
      console.log('🔍 Starting LinkedIn analysis for:', linkedinUrl);
      
      const { data, error } = await supabase.functions.invoke('analyze-linkedin', {
        body: { linkedinUrl },
      });

      console.log('📊 LinkedIn analysis response:', { data, error });

      if (error) {
        console.error('❌ Supabase function error:', error);
        throw new Error(`Function error: ${error.message}`);
      }
      
      if (data?.success) {
        setLinkedinAnalysis(data.analysis);
        console.log('✅ LinkedIn analysis successful:', data.analysis);
        
        toast({
          title: "LinkedIn-analys klar!",
          description: "Personlighetsinsikter har lagts till i din profil.",
        });
      } else {
        console.error('❌ Analysis failed:', data);
        throw new Error(data?.error || 'LinkedIn analysis failed');
      }
    } catch (error) {
      console.error('💥 LinkedIn analysis error:', error);
      
      toast({
        title: "LinkedIn-analys misslyckades",
        description: error instanceof Error ? error.message : "Ett fel uppstod vid analysen",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzingLinkedin(false);
    }
  };

  const handleSaveConsultant = async () => {
    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Obligatoriska fält saknas",
        description: "Vänligen fyll i namn, e-post och telefon.",
        variant: "destructive",
      });
      return;
    }

    // Validate data processing consent
    if (!dataProcessingConsent) {
      toast({
        title: "Samtycke krävs",
        description: "Du måste godkänna databehandling för att fortsätta.",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      console.log('🚀 Starting consultant save process...');
      
      // Clean and prepare data
      const experienceYears = parseInt(formData.experience.replace(/\D/g, '')) || 0;
      const hourlyRate = parseInt(formData.rate.replace(/\D/g, '')) || 0;
      
      // Convert LinkedIn analysis scores to integers, ensuring they're within 1-5 range
      const culturalFitScore = linkedinAnalysis?.culturalFit 
        ? Math.round(Math.max(1, Math.min(5, parseFloat(linkedinAnalysis.culturalFit.toString())))) 
        : 4;
      const adaptabilityScore = linkedinAnalysis?.adaptability 
        ? Math.round(Math.max(1, Math.min(5, parseFloat(linkedinAnalysis.adaptability.toString())))) 
        : 4;
      const leadershipScore = linkedinAnalysis?.leadership 
        ? Math.round(Math.max(1, Math.min(5, parseFloat(linkedinAnalysis.leadership.toString())))) 
        : 3;

      console.log('📊 LinkedIn scores converted:', {
        original: {
          culturalFit: linkedinAnalysis?.culturalFit,
          adaptability: linkedinAnalysis?.adaptability,
          leadership: linkedinAnalysis?.leadership
        },
        converted: {
          culturalFitScore,
          adaptabilityScore,
          leadershipScore
        }
      });

      const consultantData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        location: formData.location.trim() || 'Stockholm',
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(s => s.length > 0) : [],
        experience_years: experienceYears,
        roles: formData.role ? [formData.role.trim()] : [],
        hourly_rate: hourlyRate,
        availability: formData.availability || 'Available',
        projects_completed: 0,
        rating: 5.0,
        certifications: formData.certifications ? formData.certifications.split(',').map(c => c.trim()).filter(c => c.length > 0) : [],
        languages: formData.languages ? formData.languages.split(',').map(l => l.trim()).filter(l => l.length > 0) : [],
        type: 'new',
        linkedin_url: linkedinUrl.trim() || null,
        
        // LinkedIn and AI analysis data with fallbacks - all as integers
        communication_style: linkedinAnalysis?.communicationStyle || "Professional and collaborative",
        work_style: linkedinAnalysis?.workStyle || "Agile and results-oriented",
        values: linkedinAnalysis?.values || ["Quality", "Innovation", "Teamwork"],
        personality_traits: linkedinAnalysis?.personalityTraits || ["Analytical", "Creative", "Leadership-oriented"],
        team_fit: linkedinAnalysis?.teamFit || "Strong team player with excellent communication skills",
        cultural_fit: culturalFitScore,
        adaptability: adaptabilityScore,
        leadership: leadershipScore
      };

      console.log('📝 Final consultant data:', consultantData);

      const { data, error } = await supabase
        .from('consultants')
        .insert(consultantData)
        .select()
        .single();

      if (error) {
        console.error('❌ Database error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      console.log('✅ Consultant saved successfully:', data);
      
      toast({
        title: "Profil skapad!",
        description: "🚀 Du är nu del av vårt konsultnätverk och kan få matchningar.",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        location: '',
        role: '',
        experience: '',
        skills: '',
        rate: '',
        availability: '',
        certifications: '',
        languages: '',
        motivation: '',
        education: '',
        portfolio: '',
        achievements: '',
        interests: '',
        careerGoals: '',
        preferredWorkType: '',
        salaryExpectation: '',
        noticePeriod: '',
        travelWillingness: '',
        workExperience: ''
      });
      setUploadedFile(null);
      setCvTips([]);
      setLinkedinUrl('');
      setLinkedinAnalysis(null);
      setDataProcessingConsent(false);
      
    } catch (error) {
      console.error('💥 Save consultant error:', error);
      
      toast({
        title: "Fel vid sparande",
        description: error instanceof Error ? error.message : "Ett oväntat fel inträffade. Försök igen.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-blue-600 p-3 rounded-lg mr-3">
            <Star className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">ConsultMatch AI</h1>
            <p className="text-gray-600">Join our network</p>
          </div>
        </div>
        
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Join our <span className="text-blue-600">Consultant Network</span>
        </h2>
        <p className="text-xl text-gray-600 mb-2">
          <strong>Upload your CV and provide your LinkedIn profile</strong> - let our AI create your profile
        </p>
        <p className="text-lg text-gray-500">
          Get automatically matched with premium assignments by sharing your CV and LinkedIn
        </p>
      </div>

      {/* CV Tips Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-center justify-center">
            <Lightbulb className="h-5 w-5 text-orange-600" />
            CV Tips for Success
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">Keep it concise</h4>
                <p className="text-sm text-gray-600">Aim for 1-2 pages max. Highlight your most relevant experience and skills.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">Professional format</h4>
                <p className="text-sm text-gray-600">Use a clean, readable font and consistent formatting.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">Use keywords</h4>
                <p className="text-sm text-gray-600">Include industry-specific keywords and technologies you master.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">Quantify achievements</h4>
                <p className="text-sm text-gray-600">Use numbers and metrics to show your impact and results.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">Update regularly</h4>
                <p className="text-sm text-gray-600">Keep your CV current with your latest projects and certifications.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">Proofread carefully</h4>
                <p className="text-sm text-gray-600">Ensure there are no spelling or grammatical errors.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CV Upload Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload CV/Resume (Required)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
              id="cv-upload"
            />
            <label htmlFor="cv-upload" className="cursor-pointer">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                <strong>Upload your CV to auto-fill the fields</strong>
              </p>
              <p className="text-sm text-gray-500">
                Supports PDF, DOC, DOCX files • Makes the process much faster
              </p>
            </label>
          </div>

          {uploadedFile && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-4">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">{uploadedFile.name}</p>
                  <p className="text-sm text-blue-600">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>
          )}

          {isProcessing && (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mt-4">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600"></div>
                <div>
                  <p className="text-yellow-800 font-medium">🤖 AI analyzing CV...</p>
                  <p className="text-yellow-700 text-sm">Extracting data and auto-filling form fields</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* LinkedIn Analysis Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Linkedin className="h-5 w-5 text-blue-600" />
            LinkedIn Profile Analysis (Required)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="linkedin-url">LinkedIn Profile URL</Label>
            <Input
              id="linkedin-url"
              type="url"
              placeholder="https://linkedin.com/in/your-name"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">
              <strong>Add your LinkedIn profile for deeper AI analysis of your soft skills</strong>
            </p>
          </div>
          
          <Button 
            onClick={handleLinkedInAnalysis}
            disabled={isAnalyzingLinkedin || !linkedinUrl}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isAnalyzingLinkedin ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyzing LinkedIn profile...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Analyze LinkedIn Profile
              </>
            )}
          </Button>

          {linkedinAnalysis && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-3">✅ LinkedIn Analysis Complete</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-blue-800">Communication Style:</span>
                  <p className="text-blue-700">{linkedinAnalysis.communicationStyle}</p>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Work Style:</span>
                  <p className="text-blue-700">{linkedinAnalysis.workStyle}</p>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-blue-200">
                  <div className="text-center">
                    <div className="font-bold text-blue-600">{linkedinAnalysis.culturalFit}/5</div>
                    <div className="text-xs text-blue-500">Cultural Fit</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-blue-600">{linkedinAnalysis.adaptability}/5</div>
                    <div className="text-xs text-blue-500">Adaptability</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-blue-600">{linkedinAnalysis.leadership}/5</div>
                    <div className="text-xs text-blue-500">Leadership</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Profile Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                placeholder="+46 70 123 4567"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Stockholm"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Professional Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="role">Role/Title</Label>
              <Input
                id="role"
                placeholder="Senior Developer"
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                placeholder="5 years"
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Skills */}
          <div>
            <Label htmlFor="skills">Skills (comma separated)</Label>
            <Input
              id="skills"
              placeholder="React, TypeScript, Node.js"
              value={formData.skills}
              onChange={(e) => handleInputChange('skills', e.target.value)}
              className="mt-1"
            />
          </div>

          {/* Education */}
          <div>
            <Label htmlFor="education">Education</Label>
            <Input
              id="education"
              placeholder="Master's in Computer Science"
              value={formData.education}
              onChange={(e) => handleInputChange('education', e.target.value)}
              className="mt-1"
            />
          </div>

          {/* Work Experience */}
          <div>
            <Label htmlFor="workExperience">Work Experience</Label>
            <Textarea
              id="workExperience"
              placeholder="Senior Developer at TechCorp (2019-2024): Led development of microservices architecture..."
              value={formData.workExperience}
              onChange={(e) => handleInputChange('workExperience', e.target.value)}
              className="mt-1"
              rows={3}
            />
          </div>

          {/* Rate and Availability */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rate">Hourly Rate</Label>
              <Input
                id="rate"
                placeholder="800 SEK/hour"
                value={formData.rate}
                onChange={(e) => handleInputChange('rate', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="availability">Availability</Label>
              <Select value={formData.availability} onValueChange={(value) => handleInputChange('availability', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available immediately</SelectItem>
                  <SelectItem value="2weeks">Available in 2 weeks</SelectItem>
                  <SelectItem value="1month">Available in 1 month</SelectItem>
                  <SelectItem value="3months">Available in 3+ months</SelectItem>
                  <SelectItem value="remote">Remote only</SelectItem>
                  <SelectItem value="hybrid">Hybrid work</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Additional Professional Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="certifications">Certifications (comma separated)</Label>
              <Input
                id="certifications"
                placeholder="AWS Certified, React Advanced"
                value={formData.certifications}
                onChange={(e) => handleInputChange('certifications', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="languages">Languages (comma separated)</Label>
              <Input
                id="languages"
                placeholder="Swedish, English"
                value={formData.languages}
                onChange={(e) => handleInputChange('languages', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Portfolio and Achievements */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="portfolio">Portfolio/GitHub</Label>
              <Input
                id="portfolio"
                placeholder="github.com/your-username"
                value={formData.portfolio}
                onChange={(e) => handleInputChange('portfolio', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="achievements">Key Achievements</Label>
              <Input
                id="achievements"
                placeholder="Led 5+ successful projects, 98% client satisfaction"
                value={formData.achievements}
                onChange={(e) => handleInputChange('achievements', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Career Goals and Interests */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="careerGoals">Career Goals</Label>
              <Input
                id="careerGoals"
                placeholder="Become a tech lead in AI-driven development"
                value={formData.careerGoals}
                onChange={(e) => handleInputChange('careerGoals', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="interests">Professional Interests</Label>
              <Input
                id="interests"
                placeholder="AI/ML, Open Source, Tech Conferences"
                value={formData.interests}
                onChange={(e) => handleInputChange('interests', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Work Preferences */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="preferredWorkType">Preferred Work Type</Label>
              <Select value={formData.preferredWorkType} onValueChange={(value) => handleInputChange('preferredWorkType', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select work type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="onsite">On-site</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="noticePeriod">Notice Period</Label>
              <Input
                id="noticePeriod"
                placeholder="2 weeks"
                value={formData.noticePeriod}
                onChange={(e) => handleInputChange('noticePeriod', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="travelWillingness">Travel Willingness</Label>
              <Select value={formData.travelWillingness} onValueChange={(value) => handleInputChange('travelWillingness', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select travel preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never</SelectItem>
                  <SelectItem value="occasionally">Occasionally</SelectItem>
                  <SelectItem value="frequently">Frequently</SelectItem>
                  <SelectItem value="always">Always willing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Motivation */}
          <div>
            <Label htmlFor="motivation">What motivates you most in your work?</Label>
            <Textarea
              id="motivation"
              placeholder="Tell us what drives your passion for technology and your career goals..."
              value={formData.motivation}
              onChange={(e) => handleInputChange('motivation', e.target.value)}
              className="mt-1"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* AI CV Tips Section */}
      {cvTips.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-orange-600" />
              AI CV Improvement Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {cvTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex-shrink-0 w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-xs font-bold text-orange-600">
                    {index + 1}
                  </div>
                  <p className="text-sm text-orange-800">{tip}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Processing Consent */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="data-consent"
              checked={dataProcessingConsent}
              onCheckedChange={(checked) => setDataProcessingConsent(checked as boolean)}
              className="mt-1"
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="data-consent"
                className="text-sm font-medium leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree that Matchwise may process my personal data in accordance with the Privacy Policy for the purpose of matching me with relevant projects. I understand that I can request data deletion at any time by contacting info@matchwise.tech. *
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="text-center">
        <Button 
          onClick={handleSaveConsultant} 
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
          disabled={isUploading || !dataProcessingConsent}
          size="lg"
        >
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Creating profile...
            </>
          ) : (
            <>
              <Rocket className="h-5 w-5 mr-2" />
              🚀 Join the network & get matched
            </>
          )}
        </Button>
        <p className="text-sm text-gray-500 mt-2">* Required fields</p>
        <p className="text-sm text-blue-600 mt-1">
          <strong>Tip: Upload CV and provide LinkedIn for best results!</strong>
        </p>
      </div>
    </div>
  );
};
