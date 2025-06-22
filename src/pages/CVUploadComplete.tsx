
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  Upload, 
  FileText, 
  Loader2, 
  CheckCircle2, 
  Brain, 
  TrendingUp, 
  Award, 
  Target,
  Users,
  Lightbulb,
  Star,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Edit3,
  Plus,
  X
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';

type AnalysisStep = 'upload' | 'analyzing' | 'summary' | 'report' | 'preview' | 'complete';

interface ConsultantData {
  id: string;
  name: string;
  email: string;
  phone: string;
  title: string;
  primary_tech_stack: string[];
  secondary_tech_stack: string[];
  certifications: string[];
  top_values: string[];
  personality_traits: string[];
  cv_tips: string[];
  linkedin_tips: string[];
  certification_recommendations: string[];
  suggested_learning_paths: string[];
  thought_leadership_score: number;
  linkedin_engagement_level: string;
  market_rate_current: number;
  market_rate_optimized: number;
  years_of_experience: number;
  tagline?: string;
}

const CVUploadComplete: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // State management
  const [step, setStep] = useState<AnalysisStep>('upload');
  const [sessionToken] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  
  // Upload state
  const [file, setFile] = useState<File | null>(null);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [dragActive, setDragActive] = useState(false);
  
  // Analysis state
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [consultant, setConsultant] = useState<ConsultantData | null>(null);
  
  // Summary editing state
  const [editableData, setEditableData] = useState({
    name: '',
    email: '',
    phone: '',
    tagline: ''
  });
  const [editingSkills, setEditingSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  
  // Publication state
  const [agreeToPublish, setAgreeToPublish] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Check for existing session
  useEffect(() => {
    const sessionId = searchParams.get('session');
    if (sessionId) {
      // Load existing session
      loadSession(sessionId);
    }
  }, [searchParams]);

  const loadSession = async (sessionId: string) => {
    try {
      const { data: session } = await supabase
        .from('analysis_sessions')
        .select('*, consultants(*)')
        .eq('session_token', sessionId)
        .single();
      
      if (session?.consultant) {
        setConsultant(session.consultant);
        setStep(session.step as AnalysisStep);
        setEditableData({
          name: session.consultant.name,
          email: session.consultant.email,
          phone: session.consultant.phone || '',
          tagline: session.consultant.tagline || ''
        });
        setEditingSkills(session.consultant.primary_tech_stack || []);
      }
    } catch (error) {
      console.error('Failed to load session:', error);
    }
  };

  // File upload handling
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png'
    ];
    
    if (validTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      checkReadyForAnalysis(selectedFile, linkedinUrl);
    } else {
      toast.error('Please upload a PDF, Word document, or image file');
    }
  };

  const checkReadyForAnalysis = (currentFile: File | null, currentLinkedIn: string) => {
    if (currentFile && currentLinkedIn && currentLinkedIn.includes('linkedin.com')) {
      // Auto-trigger analysis
      setTimeout(() => startAnalysis(currentFile, currentLinkedIn), 1000);
    }
  };

  const startAnalysis = async (fileToAnalyze: File, linkedIn: string) => {
    setStep('analyzing');
    setAnalysisProgress(0);
    
    // Track analysis start
    await supabase.from('analytics_events').insert({
      session_token: sessionToken,
      event_type: 'parsing_started',
      event_data: { filename: fileToAnalyze.name, linkedin_url: linkedIn }
    });

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => Math.min(prev + 10, 80));
      }, 500);

      const formData = new FormData();
      formData.append('file', fileToAnalyze);
      formData.append('linkedinUrl', linkedIn);
      formData.append('sessionToken', sessionToken);

      const { data, error } = await supabase.functions.invoke('enhanced-profile-analysis', {
        body: formData
      });

      clearInterval(progressInterval);
      setAnalysisProgress(100);

      if (error) throw error;

      if (data.success) {
        setConsultant(data.consultant);
        setEditableData({
          name: data.consultant.name,
          email: data.consultant.email,
          phone: data.consultant.phone || '',
          tagline: data.consultant.tagline || ''
        });
        setEditingSkills(data.consultant.primary_tech_stack || []);
        setStep('summary');
        
        toast.success('Profile analysis completed! 🎉');
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      console.error('Analysis failed:', error);
      toast.error('Analysis failed: ' + error.message);
      setStep('upload');
      setAnalysisProgress(0);
    }
  };

  const handleLinkedInChange = (value: string) => {
    setLinkedinUrl(value);
    checkReadyForAnalysis(file, value);
  };

  // Summary confirmation
  const confirmSummary = async () => {
    if (!consultant) return;

    try {
      // Update consultant with edited data
      const { error } = await supabase
        .from('consultants')
        .update({
          name: editableData.name,
          email: editableData.email,
          phone: editableData.phone,
          tagline: editableData.tagline,
          primary_tech_stack: editingSkills
        })
        .eq('id', consultant.id);

      if (error) throw error;

      // Track event
      await supabase.from('analytics_events').insert({
        session_token: sessionToken,
        event_type: 'summary_confirmed',
        consultant_id: consultant.id
      });

      setStep('report');
    } catch (error: any) {
      toast.error('Failed to save changes: ' + error.message);
    }
  };

  // Skill editing
  const addSkill = () => {
    if (newSkill.trim() && !editingSkills.includes(newSkill.trim())) {
      setEditingSkills([...editingSkills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setEditingSkills(editingSkills.filter(skill => skill !== skillToRemove));
  };

  // Publication
  const publishProfile = async () => {
    if (!consultant || !agreeToPublish) return;

    setIsPublishing(true);
    try {
      // Update consultant as published
      const { error } = await supabase
        .from('consultants')
        .update({
          is_published: true,
          visibility_status: 'public'
        })
        .eq('id', consultant.id);

      if (error) throw error;

      // Send welcome email
      await supabase.functions.invoke('send-welcome-email', {
        body: {
          email: editableData.email,
          name: editableData.name,
          consultantId: consultant.id
        }
      });

      // Track event
      await supabase.from('analytics_events').insert({
        session_token: sessionToken,
        event_type: 'join_network_clicked',
        consultant_id: consultant.id
      });

      setStep('complete');
      toast.success('Welcome to the MatchWise network! 🚀');
    } catch (error: any) {
      toast.error('Failed to publish profile: ' + error.message);
    } finally {
      setIsPublishing(false);
    }
  };

  // Render different steps
  const renderUploadStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Intelligent CV Analysis & Network Join
        </h1>
        <p className="text-lg text-slate-600">
          Upload your CV and LinkedIn profile for AI-powered analysis and instant network registration
        </p>
      </div>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Your CV
          </CardTitle>
          <CardDescription>
            PDF, Word document, or image format accepted
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 transition-all duration-200 ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : file 
                ? 'border-green-500 bg-green-50' 
                : 'border-slate-300 hover:border-slate-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".pdf,.doc,.docx,image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <div className="text-center">
              {file ? (
                <div className="flex items-center justify-center space-x-3">
                  <FileText className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-700">{file.name}</p>
                    <p className="text-sm text-green-600">Ready for analysis</p>
                  </div>
                </div>
              ) : (
                <div>
                  <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-slate-700 mb-2">
                    Drag and drop your CV here
                  </p>
                  <p className="text-slate-500">
                    or click to browse files
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* LinkedIn URL */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            LinkedIn Profile
          </CardTitle>
          <CardDescription>
            Required for comprehensive analysis and insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="linkedin" className="text-base font-medium">
                LinkedIn URL *
              </Label>
              <Input
                id="linkedin"
                value={linkedinUrl}
                onChange={(e) => handleLinkedInChange(e.target.value)}
                placeholder="https://linkedin.com/in/your-profile"
                className="mt-2"
              />
            </div>
            {linkedinUrl && !linkedinUrl.includes('linkedin.com') && (
              <p className="text-sm text-orange-600">
                Please enter a valid LinkedIn URL
              </p>
            )}
            {linkedinUrl && linkedinUrl.includes('linkedin.com') && (
              <p className="text-sm text-green-600 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Valid LinkedIn URL - analysis will start when CV is uploaded
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {file && linkedinUrl.includes('linkedin.com') && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Brain className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-900">Ready for AI Analysis</h3>
                <p className="text-sm text-blue-700">
                  Analysis will start automatically and extract your professional profile
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderAnalyzingStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Brain className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-pulse" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          AI Analysis in Progress
        </h2>
        <p className="text-slate-600">
          Analyzing your CV and LinkedIn profile with advanced AI...
        </p>
      </div>

      <Card>
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Analysis Progress</span>
              <span>{analysisProgress}%</span>
            </div>
            <Progress value={analysisProgress} className="h-3" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>CV text extraction</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span>LinkedIn profile analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                <span>Skills identification</span>
              </div>
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                <span>Market rate analysis</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSummaryStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Edit3 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Review & Edit Your Profile
        </h2>
        <p className="text-slate-600">
          Verify the extracted information and make any necessary adjustments
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={editableData.name}
                onChange={(e) => setEditableData({...editableData, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={editableData.email}
                onChange={(e) => setEditableData({...editableData, email: e.target.value})}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={editableData.phone}
              onChange={(e) => setEditableData({...editableData, phone: e.target.value})}
            />
          </div>
          
          <div>
            <Label htmlFor="tagline">Professional Tagline (Optional)</Label>
            <Input
              id="tagline"
              value={editableData.tagline}
              onChange={(e) => setEditableData({...editableData, tagline: e.target.value})}
              placeholder="e.g., Senior DevOps Engineer specializing in cloud architecture"
              maxLength={150}
            />
            <p className="text-xs text-slate-500 mt-1">
              {editableData.tagline.length}/150 characters
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Technical Skills</CardTitle>
          <CardDescription>
            Add or remove skills to accurately represent your expertise
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {editingSkills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {skill}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-red-600" 
                  onClick={() => removeSkill(skill)}
                />
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill"
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            />
            <Button onClick={addSkill} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {consultant && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <Label className="text-slate-600">Title</Label>
                <p className="font-medium">{consultant.title}</p>
              </div>
              <div>
                <Label className="text-slate-600">Experience</Label>
                <p className="font-medium">{consultant.years_of_experience} years</p>
              </div>
              <div>
                <Label className="text-slate-600">Market Rate</Label>
                <p className="font-medium">{consultant.market_rate_current} SEK/hour</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Button onClick={confirmSummary} className="w-full" size="lg">
        <ArrowRight className="h-4 w-4 mr-2" />
        Confirm & See My Full Report
      </Button>
    </div>
  );

  const renderReportStep = () => {
    if (!consultant) return null;

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <Sparkles className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Your AI-Generated Career Report
          </h2>
          <p className="text-slate-600">
            Comprehensive analysis and personalized recommendations
          </p>
        </div>

        {/* Consultant Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Professional Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{editableData.name}</h3>
                <p className="text-lg text-slate-600">{consultant.title}</p>
                {editableData.tagline && (
                  <p className="text-slate-700 mt-2 italic">"{editableData.tagline}"</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-600">Experience Level</Label>
                  <p className="font-medium">{consultant.years_of_experience} years in IT</p>
                </div>
                <div>
                  <Label className="text-slate-600">Specialization</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {editingSkills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market Value */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Market Value Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600">Current Market Rate</p>
                  <p className="text-2xl font-bold text-slate-900">{consultant.market_rate_current} SEK</p>
                  <p className="text-xs text-slate-500">per hour</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600">Optimized Potential</p>
                  <p className="text-2xl font-bold text-green-700">{consultant.market_rate_optimized} SEK</p>
                  <p className="text-xs text-green-500">per hour</p>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Potential increase: </strong>
                  +{consultant.market_rate_optimized - consultant.market_rate_current} SEK/hour 
                  ({Math.round(((consultant.market_rate_optimized - consultant.market_rate_current) / consultant.market_rate_current) * 100)}% improvement)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Optimization Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Profile Optimization Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">📄 CV Improvements</h4>
                <ul className="space-y-2 text-sm">
                  {consultant.cv_tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">💼 LinkedIn Tips</h4>
                <ul className="space-y-2 text-sm">
                  {consultant.linkedin_tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skill Development */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Skill Development Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">🎓 Recommended Certifications</h4>
                <div className="space-y-2">
                  {consultant.certification_recommendations.map((cert, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                      <Award className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">📚 Learning Paths</h4>
                <div className="space-y-2">
                  {consultant.suggested_learning_paths.map((path, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                      <Lightbulb className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">{path}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personality & Values */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Professional Profile & Traits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Values</h4>
                <div className="flex flex-wrap gap-1">
                  {consultant.top_values.map((value, index) => (
                    <Badge key={index} variant="secondary">{value}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Personality</h4>
                <div className="flex flex-wrap gap-1">
                  {consultant.personality_traits.map((trait, index) => (
                    <Badge key={index} variant="outline">{trait}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">LinkedIn Insights</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <Label className="text-slate-600">Engagement Level</Label>
                    <p className="font-medium capitalize">{consultant.linkedin_engagement_level}</p>
                  </div>
                  <div>
                    <Label className="text-slate-600">Thought Leadership</Label>
                    <p className="font-medium">{consultant.thought_leadership_score}/10</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button onClick={() => setStep('preview')} className="w-full" size="lg">
          <Eye className="h-4 w-4 mr-2" />
          Preview Public Profile & Join Network
        </Button>
      </div>
    );
  };

  const renderPreviewStep = () => {
    if (!consultant) return null;

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <Eye className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Public Profile Preview
          </h2>
          <p className="text-slate-600">
            This is how your profile will appear to potential clients
          </p>
        </div>

        {/* Public Profile Preview */}
        <Card className="border-2 border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl">{editableData.name}</CardTitle>
                <CardDescription className="text-base mt-1">
                  {consultant.title}
                </CardDescription>
                {editableData.tagline && (
                  <p className="text-slate-700 mt-2 italic">"{editableData.tagline}"</p>
                )}
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 mt-1">{consultant.years_of_experience} years experience</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label className="text-slate-600">Primary Skills</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {editingSkills.slice(0, 6).map((skill, index) => (
                    <Badge key={index} variant="default">{skill}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="text-slate-600">Professional Values</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {consultant.top_values.slice(0, 4).map((value, index) => (
                    <Badge key={index} variant="outline">{value}</Badge>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="text-center p-3 bg-slate-50 rounded">
                  <p className="text-lg font-bold text-slate-900">{consultant.market_rate_optimized}</p>
                  <p className="text-xs text-slate-600">SEK/hour</p>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded">
                  <p className="text-lg font-bold text-slate-900">{consultant.linkedin_engagement_level}</p>
                  <p className="text-xs text-slate-600">LinkedIn Activity</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Publication Agreement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Join the MatchWise Network
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">What happens when you join:</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>✅ Your profile becomes visible to potential clients</li>
                <li>✅ You'll receive relevant assignment opportunities</li>
                <li>✅ AI-powered matching based on your skills and values</li>
                <li>✅ Welcome email with next steps and tips</li>
                <li>✅ Access to your personal consultant dashboard</li>
              </ul>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg">
              <Checkbox
                id="publish"
                checked={agreeToPublish}
                onCheckedChange={(checked) => setAgreeToPublish(checked as boolean)}
                className="mt-1"
              />
              <div className="text-sm">
                <Label htmlFor="publish" className="cursor-pointer font-medium">
                  I agree to publish my profile and join the MatchWise consultant network
                </Label>
                <p className="text-slate-600 mt-1">
                  Your profile will be visible to clients looking for consultants with your skills. 
                  You can update your visibility settings anytime from your dashboard.
                </p>
              </div>
            </div>
            
            <Button 
              onClick={publishProfile}
              disabled={!agreeToPublish || isPublishing}
              className="w-full"
              size="lg"
            >
              {isPublishing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Publishing Profile...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Publish Profile & Join Network
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderCompleteStep = () => (
    <div className="text-center space-y-6">
      <div className="mb-8">
        <div className="relative inline-block">
          <CheckCircle2 className="h-20 w-20 text-green-600 mx-auto mb-4" />
          <Sparkles className="h-8 w-8 text-yellow-500 absolute -top-2 -right-2 animate-pulse" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Welcome to MatchWise! 🚀
        </h2>
        <p className="text-lg text-slate-600">
          Your profile is now live and you're part of our consultant network
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-3">🎯 You're now live!</h3>
              <ul className="text-left text-green-800 space-y-2 text-sm">
                <li>✅ <strong>Profile Published:</strong> Visible to potential clients</li>
                <li>✅ <strong>AI Matching Active:</strong> You'll receive relevant opportunities</li>
                <li>✅ <strong>Welcome Email Sent:</strong> Check your inbox for next steps</li>
                <li>✅ <strong>Dashboard Access:</strong> Manage your profile anytime</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-3">📧 Check your email!</h3>
              <p className="text-blue-800 text-sm">
                We've sent a comprehensive welcome email to <strong>{editableData.email}</strong> with:
              </p>
              <ul className="text-left text-blue-700 mt-2 space-y-1 text-sm">
                <li>• Tips for maximizing your profile visibility</li>
                <li>• How our AI matching system works</li>
                <li>• Best practices for engaging with clients</li>
                <li>• Link to your personal dashboard</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
        <Button 
          onClick={() => navigate('/matchwiseai')}
          className="flex-1"
          size="lg"
        >
          Go to Dashboard
        </Button>
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="flex-1"
          size="lg"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
              <span>Step {['upload', 'analyzing', 'summary', 'report', 'preview', 'complete'].indexOf(step) + 1} of 6</span>
              <span className="capitalize">{step === 'analyzing' ? 'AI Analysis' : step}</span>
            </div>
            <Progress 
              value={(['upload', 'analyzing', 'summary', 'report', 'preview', 'complete'].indexOf(step) + 1) * 16.67} 
              className="h-2" 
            />
          </div>

          {/* Render current step */}
          {step === 'upload' && renderUploadStep()}
          {step === 'analyzing' && renderAnalyzingStep()}
          {step === 'summary' && renderSummaryStep()}
          {step === 'report' && renderReportStep()}
          {step === 'preview' && renderPreviewStep()}
          {step === 'complete' && renderCompleteStep()}
        </div>
      </div>
      
      {/* Privacy notice */}
      <div className="border-t bg-white">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-sm text-slate-600">
            🔒 Your profile and data are only used for analysis and matching purposes. 
            Nothing is published without your explicit approval.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CVUploadComplete;
