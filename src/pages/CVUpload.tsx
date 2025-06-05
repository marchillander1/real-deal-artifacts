
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle, User, Mail, Phone, MapPin, Briefcase, Code, Star, Award, Languages, Lightbulb, Target, Brain, Linkedin, Users, MessageCircle, Rocket } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export const CVUpload = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [isAnalyzingLinkedin, setIsAnalyzingLinkedin] = useState(false);
  const [linkedinAnalysis, setLinkedinAnalysis] = useState<any>(null);
  const [cvTips, setCvTips] = useState<string[]>([]);

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
    motivation: ''
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
    
    // Simulera AI CV-analys
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
        motivation: "Passionate about creating innovative solutions and working with cutting-edge technologies. I love solving complex problems and mentoring junior developers."
      });

      // Generera CV-tips
      const generatedCvTips = [
        "💡 Keep it concise - Aim for 1-2 pages maximum. Highlight your most relevant experience and skills.",
        "✅ Professional format - Use a clean, readable font and consistent formatting throughout.",
        "🎯 Use keywords - Include industry-specific keywords and technologies you're proficient in.",
        "📈 Quantify achievements - Use numbers and metrics to demonstrate your impact and results.",
        "🔄 Update regularly - Keep your CV current with your latest projects and certifications.",
        "📝 Proofread carefully - Ensure there are no spelling or grammatical errors before submitting."
      ];
      
      setCvTips(generatedCvTips);
      setIsProcessing(false);
    }, 3000);
  };

  const handleLinkedInAnalysis = async () => {
    if (!linkedinUrl) {
      alert('Vänligen ange en LinkedIn URL först');
      return;
    }

    setIsAnalyzingLinkedin(true);
    
    try {
      const response = await fetch('https://xbliknlrikolcjjfhxqa.supabase.co/functions/v1/analyze-linkedin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ linkedinUrl }),
      });

      const data = await response.json();
      
      if (data.success) {
        setLinkedinAnalysis(data.analysis);
        alert('LinkedIn-analys komplett! Personlighetsinsikter har lagts till din profil.');
      } else {
        alert('LinkedIn analys misslyckades');
      }
    } catch (error) {
      console.error('LinkedIn analysis failed:', error);
      alert('LinkedIn analys misslyckades');
    } finally {
      setIsAnalyzingLinkedin(false);
    }
  };

  const handleSaveConsultant = async () => {
    // Validera obligatoriska fält
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Vänligen fyll i alla obligatoriska fält (namn, email, telefon)');
      return;
    }
    
    setIsUploading(true);
    
    try {
      const consultantData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        experience_years: parseInt(formData.experience.replace(/\D/g, '')) || 0,
        roles: [formData.role].filter(r => r),
        hourly_rate: parseInt(formData.rate.replace(/\D/g, '')) || 0,
        availability: formData.availability || 'Available',
        projects_completed: 0,
        rating: 5.0,
        last_active: 'Today',
        certifications: formData.certifications.split(',').map(c => c.trim()).filter(c => c),
        languages: formData.languages.split(',').map(l => l.trim()).filter(l => l),
        type: 'new' as const,
        
        // LinkedIn och AI-analys data
        communication_style: linkedinAnalysis?.communicationStyle || "Professional and collaborative",
        work_style: linkedinAnalysis?.workStyle || "Agile and results-oriented",
        values: linkedinAnalysis?.values || ["Quality", "Innovation", "Teamwork"],
        personality_traits: linkedinAnalysis?.personalityTraits || ["Analytical", "Creative", "Leadership-oriented"],
        team_fit: linkedinAnalysis?.teamFit || "Strong team player with excellent communication skills",
        cultural_fit: linkedinAnalysis?.culturalFit || 4.5,
        adaptability: linkedinAnalysis?.adaptability || 4.3,
        leadership: linkedinAnalysis?.leadership || 4.1,
        
        // Ytterligare fält
        education: ["Master's in Computer Science"],
        work_experience: [{
          company: "TechCorp AB",
          position: formData.role,
          duration: `${formData.experience}`,
          description: "Developed innovative solutions using modern technologies"
        }],
        portfolio: ["Portfolio project examples"],
        achievements: ["Led successful project implementations"],
        interests: ["Technology", "Innovation", "Problem Solving"],
        career_goals: formData.motivation,
        linkedin_url: linkedinUrl || null,
        github_url: null,
        portfolio_url: null,
        preferred_work_type: formData.availability === 'remote' ? 'Remote' : 'Hybrid',
        salary_expectation: formData.rate,
        notice_period: "2 weeks",
        travel_willingness: "Occasionally",
        professional_summary: formData.motivation || "Experienced professional with strong technical skills and passion for innovation."
      };

      const { data, error } = await supabase
        .from('consultants')
        .insert(consultantData)
        .select()
        .single();

      if (error) {
        console.error('Error saving consultant:', error);
        alert('Fel vid sparande av konsult');
        return;
      }

      console.log('Consultant saved successfully:', data);
      alert('🚀 Profil skapad framgångsrikt! Du är nu del av vårt konsultnätverk.');
      
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
        motivation: ''
      });
      setUploadedFile(null);
      setCvTips([]);
      setLinkedinUrl('');
      setLinkedinAnalysis(null);
    } catch (error) {
      console.error('Error:', error);
      alert('Ett fel uppstod');
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
            <p className="text-gray-600">Join Our Network</p>
          </div>
        </div>
        
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Join Our <span className="text-blue-600">Consultant Network</span>
        </h2>
        <p className="text-xl text-gray-600 mb-2">Upload your CV and let our AI create your profile</p>
        <p className="text-lg text-gray-500">Get matched with premium opportunities automatically</p>
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
                <p className="text-sm text-gray-600">Aim for 1-2 pages maximum. Highlight your most relevant experience and skills.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">Professional format</h4>
                <p className="text-sm text-gray-600">Use a clean, readable font and consistent formatting throughout.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">Use keywords</h4>
                <p className="text-sm text-gray-600">Include industry-specific keywords and technologies you're proficient in.</p>
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
                <h4 className="font-medium text-gray-900">Quantify achievements</h4>
                <p className="text-sm text-gray-600">Use numbers and metrics to demonstrate your impact and results.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-900">Proofread carefully</h4>
                <p className="text-sm text-gray-600">Ensure there are no spelling or grammatical errors before submitting.</p>
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
            Upload CV/Resume (Optional)
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
                Upload your CV to auto-fill fields
              </p>
              <p className="text-sm text-gray-500">
                Supports PDF, DOC, DOCX files
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
                  <p className="text-yellow-800 font-medium">🤖 AI analyserar CV:et...</p>
                  <p className="text-yellow-700 text-sm">Extraherar data och fyller i formulärfälten automatiskt</p>
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
              <Label htmlFor="experience">Experience</Label>
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

          {/* Rate and Availability */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rate">Rate</Label>
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

          {/* Certifications and Languages */}
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

      {/* LinkedIn Analysis Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Linkedin className="h-5 w-5 text-blue-600" />
            LinkedIn Profile Analysis (Optional)
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

      {/* Submit Button */}
      <div className="text-center">
        <Button 
          onClick={handleSaveConsultant} 
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
          disabled={isUploading}
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
              🚀 Join Network & Get Matched
            </>
          )}
        </Button>
        <p className="text-sm text-gray-500 mt-2">* Required fields</p>
      </div>
    </div>
  );
};
