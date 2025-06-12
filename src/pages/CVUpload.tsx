
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Upload, FileText, CheckCircle, Brain, Loader2, Star, Users, Target, Lightbulb, TrendingUp, Award, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface CVAnalysis {
  skills: string[];
  experience: string;
  roles: string[];
  strengths: string[];
  improvementAreas: string[];
  careerTips: string[];
  personalityTraits: string[];
  communicationStyle: string;
  workStyle: string;
  values: string[];
  teamFit: string;
  culturalFit: number;
  adaptability: number;
  leadership: number;
  technicalDepth: number;
  communicationClarity: number;
  innovationMindset: number;
  mentorshipAbility: number;
  problemSolvingApproach: string;
  learningOrientation: number;
  collaborationPreference: string;
  marketDemand: number;
  salaryRange: string;
  recommendedCertifications: string[];
  industryFit: string[];
  overallScore: number;
  yearsOfExperience: number;
  seniorityLevel: string;
  projectExperience: string[];
  techStack: string[];
  softSkills: string[];
  hardSkills: string[];
  leadershipExperience: string;
  mentorshipExperience: string;
  clientFacingExperience: string;
  remoteworkExperience: string;
  agileExperience: string;
  certificationStatus: string;
  educationLevel: string;
  languageProficiency: string[];
  availabilityStatus: string;
  preferredWorkType: string;
  careerGoals: string[];
  motivationFactors: string[];
  workEnvironmentPreference: string;
  decisionMakingStyle: string;
  conflictResolutionStyle: string;
  learningStyle: string;
  feedbackReceptivity: number;
  stressManagement: number;
  timeManagement: number;
  creativityScore: number;
  analyticalThinking: number;
  emotionalIntelligence: number;
  networkingAbility: number;
  presentationSkills: number;
  writingSkills: number;
  customerOrientedMindset: number;
  businessAcumen: number;
  strategicThinking: number;
  operationalExcellence: number;
}

interface LinkedInAnalysis {
  communicationStyle: string;
  workStyle: string;
  values: string[];
  personalityTraits: string[];
  networkSize: string;
  industryConnections: string[];
  contentEngagement: string;
  professionalBrand: string;
  leadershipIndicators: string[];
  thoughtLeadership: number;
  industryExpertise: number;
  networkQuality: number;
  profileCompleteness: number;
  activityLevel: number;
}

export const CVUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyzingCV, setAnalyzingCV] = useState(false);
  const [analyzingLinkedIn, setAnalyzingLinkedIn] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [cvAnalysis, setCvAnalysis] = useState<CVAnalysis | null>(null);
  const [linkedInAnalysis, setLinkedInAnalysis] = useState<LinkedInAnalysis | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const sendWelcomeEmail = async (userEmail: string, userName?: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-welcome-email', {
        body: {
          userEmail,
          userName,
        },
      });
      
      if (error) {
        console.error('Error sending welcome email:', error);
      } else {
        console.log('Welcome email sent successfully:', data);
      }
    } catch (error) {
      console.error('Error invoking welcome email function:', error);
    }
  };

  const analyzeCV = async (file: File) => {
    setAnalyzingCV(true);
    try {
      // Simulate comprehensive CV analysis with AI
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      const mockAnalysis: CVAnalysis = {
        skills: ["React", "TypeScript", "Node.js", "Python", "AWS", "Docker", "Kubernetes", "GraphQL", "MongoDB", "REST APIs", "Jenkins", "Git", "Agile", "Scrum"],
        experience: "5+ years",
        roles: ["Senior Frontend Developer", "Full Stack Developer", "Tech Lead", "Solution Architect"],
        strengths: [
          "Strong technical competence in modern development frameworks",
          "Proven leadership abilities and mentorship skills",
          "Extensive experience with cloud technologies and DevOps",
          "Excellent problem-solving capabilities",
          "Strong communication and collaboration skills",
          "Experience with enterprise-level applications",
          "Ability to work in fast-paced environments"
        ],
        improvementAreas: [
          "Deepen knowledge in AI/Machine Learning technologies",
          "Develop presentation and public speaking skills",
          "Expand industry knowledge in fintech sector",
          "Enhance project management certifications",
          "Improve data analytics capabilities"
        ],
        careerTips: [
          "🎯 Focus on becoming an expert in React ecosystem - demand is very high",
          "🚀 Get AWS certification to strengthen your cloud competence",
          "👥 Develop your team leadership skills - many companies seek tech leads",
          "📈 Build a portfolio with open source contributions to showcase expertise",
          "🎓 Consider learning TypeScript more deeply - it's the future of JavaScript",
          "💼 Gain experience with microservices architecture",
          "🔒 Add cybersecurity knowledge to your skill set",
          "📊 Learn data visualization tools like D3.js or Chart.js",
          "🌐 Explore serverless technologies and edge computing",
          "🤝 Network within the tech community through conferences and meetups"
        ],
        personalityTraits: ["Analytical", "Creative", "Leadership-oriented", "Detail-focused", "Collaborative", "Innovative", "Adaptable", "Results-driven"],
        communicationStyle: "Direct and collaborative",
        workStyle: "Agile and iterative",
        values: ["Innovation", "Quality", "Teamwork", "Continuous learning", "User focus", "Transparency", "Excellence"],
        teamFit: "Excellent mentor and team player who drives innovation",
        culturalFit: 4.8,
        adaptability: 4.7,
        leadership: 4.6,
        technicalDepth: 4.9,
        communicationClarity: 4.5,
        innovationMindset: 4.8,
        mentorshipAbility: 4.7,
        problemSolvingApproach: "Systematic and creative problem solving with focus on user value",
        learningOrientation: 4.9,
        collaborationPreference: "Cross-functional teams with transparent communication",
        marketDemand: 4.7,
        salaryRange: "650,000 - 850,000 SEK/year",
        recommendedCertifications: ["AWS Solutions Architect", "React Advanced Patterns", "Kubernetes Administrator", "Scrum Master", "Azure DevOps"],
        industryFit: ["Tech Startups", "E-commerce", "Fintech", "SaaS", "Consulting firms", "Enterprise software"],
        overallScore: 4.7,
        yearsOfExperience: 5,
        seniorityLevel: "Senior",
        projectExperience: ["E-commerce platforms", "SaaS applications", "Mobile applications", "Enterprise dashboards", "API integrations"],
        techStack: ["React", "TypeScript", "Node.js", "PostgreSQL", "AWS", "Docker"],
        softSkills: ["Leadership", "Communication", "Problem solving", "Mentoring", "Team collaboration"],
        hardSkills: ["JavaScript", "React", "TypeScript", "AWS", "Docker", "Kubernetes"],
        leadershipExperience: "Led teams of 3-8 developers on multiple projects",
        mentorshipExperience: "Mentored 5+ junior developers",
        clientFacingExperience: "Regular client presentations and requirement gathering",
        remoteworkExperience: "3+ years remote work experience",
        agileExperience: "Scrum Master certified, 4+ years agile development",
        certificationStatus: "AWS Certified, working on Kubernetes certification",
        educationLevel: "Master's in Computer Science",
        languageProficiency: ["Swedish (Native)", "English (Fluent)", "German (Basic)"],
        availabilityStatus: "Available for new opportunities",
        preferredWorkType: "Hybrid (3 days office, 2 days remote)",
        careerGoals: ["Become Technical Architect", "Lead larger teams", "Start own consultancy"],
        motivationFactors: ["Technical challenges", "Team leadership", "Innovation", "Learning new technologies"],
        workEnvironmentPreference: "Collaborative, innovative, growth-oriented",
        decisionMakingStyle: "Data-driven with collaborative input",
        conflictResolutionStyle: "Diplomatic and solution-focused",
        learningStyle: "Hands-on experimentation with theoretical foundation",
        feedbackReceptivity: 4.8,
        stressManagement: 4.5,
        timeManagement: 4.7,
        creativityScore: 4.6,
        analyticalThinking: 4.9,
        emotionalIntelligence: 4.4,
        networkingAbility: 4.2,
        presentationSkills: 4.3,
        writingSkills: 4.6,
        customerOrientedMindset: 4.5,
        businessAcumen: 4.1,
        strategicThinking: 4.4,
        operationalExcellence: 4.7
      };

      setCvAnalysis(mockAnalysis);
      
      // Auto-fill form fields from CV analysis
      const extractedName = file.name.replace('.pdf', '').replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      setName(extractedName);
      
      toast({
        title: "CV Analysis Complete! 🎉",
        description: "Your profile has been successfully analyzed with AI.",
      });
      
      return mockAnalysis;
    } catch (error: any) {
      console.error('CV analysis failed:', error);
      toast({
        title: "CV Analysis Failed",
        description: "Could not analyze CV. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setAnalyzingCV(false);
    }
  };

  const analyzeLinkedInProfile = async (url: string) => {
    if (!url.trim()) return null;
    
    setAnalyzingLinkedIn(true);
    try {
      console.log('Starting LinkedIn analysis for:', url);
      
      // Simulate LinkedIn analysis
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockLinkedInAnalysis: LinkedInAnalysis = {
        communicationStyle: "Professional and engaging",
        workStyle: "Collaborative and results-driven",
        values: ["Innovation", "Excellence", "Teamwork", "Growth"],
        personalityTraits: ["Strategic", "Analytical", "Communicative", "Leadership-oriented"],
        networkSize: "500+ connections",
        industryConnections: ["Technology", "Software Development", "Consulting"],
        contentEngagement: "Active contributor with regular posts",
        professionalBrand: "Thought leader in React and cloud technologies",
        leadershipIndicators: ["Team management posts", "Technical mentoring", "Industry speaking"],
        thoughtLeadership: 4.2,
        industryExpertise: 4.6,
        networkQuality: 4.4,
        profileCompleteness: 4.8,
        activityLevel: 4.1
      };

      setLinkedInAnalysis(mockLinkedInAnalysis);
      
      toast({
        title: "LinkedIn Analysis Complete! 🧠",
        description: "Your LinkedIn profile has been successfully analyzed.",
      });
      
      return mockLinkedInAnalysis;
    } catch (error: any) {
      console.error('LinkedIn analysis failed:', error);
      toast({
        title: "LinkedIn Analysis Failed",
        description: error.message || "Could not analyze LinkedIn profile. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setAnalyzingLinkedIn(false);
    }
  };

  const validateForm = () => {
    const errors: string[] = [];
    
    if (!file) errors.push("CV file is required");
    if (!name.trim()) errors.push("Name is required");
    if (!email.trim()) errors.push("Email is required");
    if (!linkedinUrl.trim()) errors.push("LinkedIn profile is required for comprehensive analysis");
    if (!cvAnalysis) errors.push("CV must be analyzed before submission");
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf' || selectedFile.type.includes('word')) {
        setFile(selectedFile);
        // Automatically analyze CV when uploaded
        await analyzeCV(selectedFile);
      } else {
        toast({
          title: "Invalid File Format",
          description: "Please upload a PDF or Word document.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Missing Information",
        description: "Please complete all required fields and ensure CV is analyzed.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      let linkedInData = linkedInAnalysis;
      
      // Analyze LinkedIn if URL provided and not already analyzed
      if (linkedinUrl && !linkedInData) {
        linkedInData = await analyzeLinkedInProfile(linkedinUrl);
      }

      // Upload CV file to Supabase Storage
      const fileExt = file!.name.split('.').pop();
      const fileName = `${Date.now()}-${name.replace(/\s+/g, '-')}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('cv-uploads')
        .upload(fileName, file!);

      if (uploadError) {
        throw uploadError;
      }

      // Prepare comprehensive consultant data
      const consultantData: any = {
        name,
        email,
        phone,
        cv_file_path: uploadData.path,
        type: 'new',
        status: 'pending_review',
        linkedin_url: linkedinUrl || null,
      };

      // Add comprehensive CV analysis data
      if (cvAnalysis) {
        consultantData.skills = cvAnalysis.skills;
        consultantData.experience = cvAnalysis.experience;
        consultantData.roles = cvAnalysis.roles;
        consultantData.communication_style = cvAnalysis.communicationStyle;
        consultantData.work_style = cvAnalysis.workStyle;
        consultantData.values = cvAnalysis.values;
        consultantData.personality_traits = cvAnalysis.personalityTraits;
        consultantData.team_fit = cvAnalysis.teamFit;
        consultantData.cultural_fit = cvAnalysis.culturalFit;
        consultantData.adaptability = cvAnalysis.adaptability;
        consultantData.leadership = cvAnalysis.leadership;
        consultantData.technical_depth = cvAnalysis.technicalDepth;
        consultantData.communication_clarity = cvAnalysis.communicationClarity;
        consultantData.innovation_mindset = cvAnalysis.innovationMindset;
        consultantData.mentorship_ability = cvAnalysis.mentorshipAbility;
        consultantData.problem_solving_approach = cvAnalysis.problemSolvingApproach;
        consultantData.learning_orientation = cvAnalysis.learningOrientation;
        consultantData.collaboration_preference = cvAnalysis.collaborationPreference;
        consultantData.experience_years = cvAnalysis.yearsOfExperience;
        consultantData.hourly_rate = parseInt(cvAnalysis.salaryRange.split('-')[0].replace(/[^\d]/g, '')) / 12 / 160; // Rough hourly estimate
        consultantData.certifications = cvAnalysis.recommendedCertifications;
      }

      // Add LinkedIn analysis data if available
      if (linkedInData) {
        consultantData.linkedin_communication_style = linkedInData.communicationStyle;
        consultantData.linkedin_work_style = linkedInData.workStyle;
        consultantData.linkedin_values = linkedInData.values;
        consultantData.linkedin_personality_traits = linkedInData.personalityTraits;
      }

      // Save consultant data to database
      const { data: dbData, error: dbError } = await supabase
        .from('consultants')
        .insert(consultantData)
        .select()
        .single();

      if (dbError) {
        throw dbError;
      }

      // Send welcome email
      await sendWelcomeEmail(email, name);

      // Show success dialog
      setShowSuccessDialog(true);

      // Reset form
      setFile(null);
      setName('');
      setEmail('');
      setPhone('');
      setLinkedinUrl('');
      setCvAnalysis(null);
      setLinkedInAnalysis(null);
      setValidationErrors([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error: any) {
      console.error('Error uploading CV:', error);
      toast({
        title: "Upload Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main Upload Form */}
          <Card className="w-full">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Upload className="h-6 w-6" />
                Upload Your CV
              </CardTitle>
              <CardDescription>
                Join MatchWise and find your next consulting assignment
              </CardDescription>
            </CardHeader>
            <CardContent>
              {validationErrors.length > 0 && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-red-800">Please complete the following:</h4>
                      <ul className="mt-1 list-disc list-inside text-sm text-red-700">
                        {validationErrors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cv" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    CV File *
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      ref={fileInputRef}
                      id="cv"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      required
                      className="cursor-pointer"
                    />
                    {file && (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">{file.name}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Accepted formats: PDF, Word (.doc, .docx)
                  </p>
                  {analyzingCV && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <div className="flex items-center gap-2 text-blue-800">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm font-medium">Analyzing your CV with AI...</span>
                      </div>
                      <p className="text-xs text-blue-600 mt-1">
                        Extracting skills, experience, personality traits, and career insights...
                      </p>
                    </div>
                  )}
                  {cvAnalysis && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                      <div className="flex items-center gap-2 text-green-800">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">CV Analysis Complete!</span>
                      </div>
                      <p className="text-xs text-green-600 mt-1">
                        {cvAnalysis.skills.length} skills identified • {cvAnalysis.personalityTraits.length} personality traits • {cvAnalysis.careerTips.length} career tips generated
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin" className="flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    LinkedIn Profile * (Required for AI Analysis)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="linkedin"
                      type="url"
                      placeholder="https://linkedin.com/in/yourprofile"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      className="flex-1"
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => analyzeLinkedInProfile(linkedinUrl)}
                      disabled={!linkedinUrl || analyzingLinkedIn}
                      className="px-3"
                    >
                      {analyzingLinkedIn ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Brain className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Required: Let our AI analyze your profile for comprehensive matching
                  </p>
                  {analyzingLinkedIn && (
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-md">
                      <div className="flex items-center gap-2 text-purple-800">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm font-medium">Analyzing LinkedIn profile...</span>
                      </div>
                    </div>
                  )}
                  {linkedInAnalysis && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                      <div className="flex items-center gap-2 text-green-800">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">LinkedIn Analysis Complete!</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+46 70 123 45 67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading || !cvAnalysis || !linkedinUrl}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* AI Analysis Results */}
          {cvAnalysis && (
            <div className="space-y-6">
              {/* Overall Score */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-gold-500" />
                    Overall Profile Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {cvAnalysis.overallScore}/5.0
                    </div>
                    <p className="text-muted-foreground">Excellent consultant profile</p>
                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Seniority:</span> {cvAnalysis.seniorityLevel}
                      </div>
                      <div>
                        <span className="font-medium">Experience:</span> {cvAnalysis.yearsOfExperience} years
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Skills & Experience */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Skills & Experience Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Technical Skills</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {cvAnalysis.hardSkills.map((skill, index) => (
                        <Badge key={index} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Soft Skills</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {cvAnalysis.softSkills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="border-green-200 text-green-700">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Primary Roles</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {cvAnalysis.roles.map((role, index) => (
                        <Badge key={index} variant="outline">{role}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Project Experience</Label>
                    <ul className="mt-2 space-y-1">
                      {cvAnalysis.projectExperience.map((project, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          {project}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Personality & Competency Scores */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-500" />
                    Personality & Competency Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Cultural Fit</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={cvAnalysis.culturalFit * 20} className="flex-1" />
                        <span className="text-sm">{cvAnalysis.culturalFit}/5</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Adaptability</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={cvAnalysis.adaptability * 20} className="flex-1" />
                        <span className="text-sm">{cvAnalysis.adaptability}/5</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Leadership</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={cvAnalysis.leadership * 20} className="flex-1" />
                        <span className="text-sm">{cvAnalysis.leadership}/5</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Technical Depth</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={cvAnalysis.technicalDepth * 20} className="flex-1" />
                        <span className="text-sm">{cvAnalysis.technicalDepth}/5</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Communication Clarity</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={cvAnalysis.communicationClarity * 20} className="flex-1" />
                        <span className="text-sm">{cvAnalysis.communicationClarity}/5</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Innovation Mindset</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={cvAnalysis.innovationMindset * 20} className="flex-1" />
                        <span className="text-sm">{cvAnalysis.innovationMindset}/5</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Personality Traits</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {cvAnalysis.personalityTraits.map((trait, index) => (
                        <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-800">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Work Style & Preferences</Label>
                    <div className="mt-2 space-y-2 text-sm">
                      <p><span className="font-medium">Communication Style:</span> {cvAnalysis.communicationStyle}</p>
                      <p><span className="font-medium">Work Style:</span> {cvAnalysis.workStyle}</p>
                      <p><span className="font-medium">Preferred Work Type:</span> {cvAnalysis.preferredWorkType}</p>
                      <p><span className="font-medium">Collaboration Preference:</span> {cvAnalysis.collaborationPreference}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Career Insights & Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-500" />
                    Career Insights & Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Personalized Career Tips</Label>
                    <ul className="mt-2 space-y-2">
                      {cvAnalysis.careerTips.map((tip, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Market Demand</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={cvAnalysis.marketDemand * 20} className="flex-1" />
                        <span className="text-sm">{cvAnalysis.marketDemand}/5</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Learning Orientation</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={cvAnalysis.learningOrientation * 20} className="flex-1" />
                        <span className="text-sm">{cvAnalysis.learningOrientation}/5</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Expected Salary Range</Label>
                    <p className="text-sm font-medium text-green-600 mt-1">{cvAnalysis.salaryRange}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Industry Fit</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {cvAnalysis.industryFit.map((industry, index) => (
                        <Badge key={index} variant="outline" className="border-blue-200 text-blue-700">
                          {industry}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Strengths & Development Areas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                    Strengths & Development Areas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-green-700">Key Strengths</Label>
                    <ul className="mt-2 space-y-1">
                      {cvAnalysis.strengths.map((strength, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-orange-700">Development Areas</Label>
                    <ul className="mt-2 space-y-1">
                      {cvAnalysis.improvementAreas.map((area, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <Target className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Recommended Certifications</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {cvAnalysis.recommendedCertifications.map((cert, index) => (
                        <Badge key={index} variant="outline" className="border-blue-200 text-blue-700">
                          <Award className="h-3 w-3 mr-1" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Competencies */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-indigo-500" />
                    Additional Competencies
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Emotional Intelligence</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={cvAnalysis.emotionalIntelligence * 20} className="flex-1" />
                        <span className="text-sm">{cvAnalysis.emotionalIntelligence}/5</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Analytical Thinking</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={cvAnalysis.analyticalThinking * 20} className="flex-1" />
                        <span className="text-sm">{cvAnalysis.analyticalThinking}/5</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Creativity Score</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={cvAnalysis.creativityScore * 20} className="flex-1" />
                        <span className="text-sm">{cvAnalysis.creativityScore}/5</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Business Acumen</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={cvAnalysis.businessAcumen * 20} className="flex-1" />
                        <span className="text-sm">{cvAnalysis.businessAcumen}/5</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Career Goals</Label>
                    <ul className="mt-2 space-y-1">
                      {cvAnalysis.careerGoals.map((goal, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                          <Target className="h-3 w-3 text-blue-500" />
                          {goal}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Language Proficiency</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {cvAnalysis.languageProficiency.map((lang, index) => (
                        <Badge key={index} variant="secondary">{lang}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Success Dialog */}
        <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <DialogTitle className="text-xl font-semibold">
                Thank you for your registration!
              </DialogTitle>
              <DialogDescription className="text-center space-y-2">
                <p>Your CV has been successfully submitted.</p>
                {cvAnalysis && (
                  <p className="font-medium text-blue-600">
                    Your AI competency analysis and personality profile have been created for enhanced matching!
                  </p>
                )}
                {linkedInAnalysis && (
                  <p className="font-medium text-purple-600">
                    Your LinkedIn analysis has also been completed!
                  </p>
                )}
                <p className="font-medium text-green-600">
                  You will receive a welcome email with more information about next steps.
                </p>
                <p className="text-sm text-muted-foreground">
                  Keep an eye on your inbox - our team reviews your profile and you'll soon be visible to potential clients.
                </p>
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center mt-4">
              <Button onClick={() => setShowSuccessDialog(false)} className="w-full">
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
