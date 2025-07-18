import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  DollarSign, 
  Eye, 
  EyeOff, 
  Upload, 
  Download,
  Brain,
  Star,
  Tag,
  Plus,
  X
} from 'lucide-react';

export default function MyProfile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [consultant, setConsultant] = useState<any>(null);
  const [isPublished, setIsPublished] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    personal_tagline: '',
    rate_preference: '',
    availability: 'Available',
    skills: [] as string[],
    certifications: [] as string[]
  });

  // Input states for adding skills/certifications
  const [newSkill, setNewSkill] = useState('');
  const [newCertification, setNewCertification] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    loadProfileData();
  }, [user]);

  const loadProfileData = async () => {
    console.log('🔍 MyProfile: Loading profile data for user:', user?.id);
    try {
      setIsLoading(true);
      
      // Load user profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      // Load AI analysis
      const { data: analysis } = await supabase
        .from('ai_analysis')
        .select('*')
        .eq('user_profile_id', profile?.id)
        .maybeSingle();

      // Load consultant data
      const { data: consultantData } = await supabase
        .from('consultants')
        .select('*')
        .eq('user_id', user?.id)
        .limit(1)
        .maybeSingle();

      // Check if profile is published
      const { data: published } = await supabase
        .from('published_profiles')
        .select('*')
        .eq('user_profile_id', profile?.id)
        .eq('is_active', true)
        .maybeSingle();

      console.log('🔍 MyProfile: Loaded data:', { profile, analysis, consultantData, published });
      
      setUserProfile(profile);
      setAiAnalysis(analysis);
      setConsultant(consultantData);
      setIsPublished(!!published);

      // Set form data
      if (profile || consultantData) {
        setFormData({
          full_name: profile?.full_name || consultantData?.name || '',
          email: profile?.email || consultantData?.email || '',
          phone: profile?.phone || consultantData?.phone || '',
          personal_tagline: profile?.personal_tagline || consultantData?.tagline || '',
          rate_preference: profile?.rate_preference?.toString() || consultantData?.hourly_rate?.toString() || '',
          availability: profile?.availability || consultantData?.availability || 'Available',
          skills: consultantData?.skills || [],
          certifications: consultantData?.certifications || []
        });
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
      toast({
        title: "Loading Error",
        description: "Could not load your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      
      // Update user profile
      if (userProfile) {
        await supabase
          .from('user_profiles')
          .update({
            full_name: formData.full_name,
            email: formData.email,
            phone: formData.phone,
            personal_tagline: formData.personal_tagline,
            rate_preference: formData.rate_preference ? parseInt(formData.rate_preference) : null,
            availability: formData.availability,
            updated_at: new Date().toISOString()
          })
          .eq('id', userProfile.id);
      }

      // Update consultant data
      if (consultant) {
        await supabase
          .from('consultants')
          .update({
            name: formData.full_name,
            email: formData.email,
            phone: formData.phone,
            tagline: formData.personal_tagline,
            hourly_rate: formData.rate_preference ? parseInt(formData.rate_preference) : null,
            availability: formData.availability,
            skills: formData.skills,
            certifications: formData.certifications,
            updated_at: new Date().toISOString()
          })
          .eq('id', consultant.id);
      }

      toast({
        title: "Profile Updated",
        description: "Your changes have been saved successfully",
      });

      // Reload data
      await loadProfileData();
    } catch (error) {
      console.error('Error saving changes:', error);
      toast({
        title: "Save Error",
        description: "Could not save changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleVisibility = async () => {
    try {
      if (isPublished) {
        // Remove from published profiles
        await supabase
          .from('published_profiles')
          .update({ is_active: false })
          .eq('user_profile_id', userProfile?.id);
      } else {
        // Add to published profiles
        await supabase
          .from('published_profiles')
          .insert({
            user_profile_id: userProfile?.id,
            ai_analysis_id: aiAnalysis?.id,
            is_active: true,
            visibility_status: 'public'
          });
      }

      setIsPublished(!isPublished);
      toast({
        title: isPublished ? "Profile Hidden" : "Profile Published",
        description: isPublished 
          ? "Your profile is now only visible to you" 
          : "Your profile is now visible in the MatchWise network",
      });
    } catch (error) {
      console.error('Error toggling visibility:', error);
      toast({
        title: "Error",
        description: "Could not change visibility. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addCertification = () => {
    if (newCertification.trim() && !formData.certifications.includes(newCertification.trim())) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }));
      setNewCertification('');
    }
  };

  const removeCertification = (certToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert !== certToRemove)
    }));
  };

  const handleReUpload = () => {
    navigate('/cv-upload');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!userProfile && !consultant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="w-full max-w-md text-center">
          <h2 className="text-xl font-semibold mb-4">No Profile Found</h2>
          <p className="text-gray-600 mb-4">You don't have a profile yet. Upload your CV to get started.</p>
          <Button onClick={() => navigate('/cv-upload')}>
            Upload CV
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-xl font-semibold">My Profile</h1>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Profile Info Block */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Full Name</label>
                  <Input
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Phone Number</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+46 70 123 45 67"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Availability</label>
                  <Input
                    value={formData.availability}
                    onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
                    placeholder="Available"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Personal tagline (max 150 characters)</label>
                <Textarea
                  value={formData.personal_tagline}
                  onChange={(e) => setFormData(prev => ({ ...prev, personal_tagline: e.target.value }))}
                  placeholder="Describe yourself briefly..."
                  maxLength={150}
                  className="resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.personal_tagline.length}/150 characters
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Skills & Tech Stack */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Skills & Tech Stack
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Your skills</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <X 
                        className="h-3 w-3 cursor-pointer hover:text-red-500" 
                        onClick={() => removeSkill(skill)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add skill..."
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  />
                  <Button onClick={addSkill} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Certifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Your certifications</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.certifications.map((cert, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {cert}
                      <X 
                        className="h-3 w-3 cursor-pointer hover:text-red-500" 
                        onClick={() => removeCertification(cert)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newCertification}
                    onChange={(e) => setNewCertification(e.target.value)}
                    placeholder="Add certification..."
                    onKeyPress={(e) => e.key === 'Enter' && addCertification()}
                  />
                  <Button onClick={addCertification} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rate & Availability */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Rate & Availability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <label className="text-sm font-medium mb-1 block">Preferred hourly rate (SEK)</label>
                <Input
                  type="number"
                  value={formData.rate_preference}
                  onChange={(e) => setFormData(prev => ({ ...prev, rate_preference: e.target.value }))}
                  placeholder="950"
                />
              </div>
            </CardContent>
          </Card>

          {/* Visibility Control */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isPublished ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                Visibility
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Show my profile publicly in the MatchWise network</h3>
                  <p className="text-sm text-gray-600">
                    When enabled, your profile will be visible to potential clients
                  </p>
                </div>
                <Switch
                  checked={isPublished}
                  onCheckedChange={handleToggleVisibility}
                />
              </div>
            </CardContent>
          </Card>

          {/* AI Analysis & Insights */}
          {(aiAnalysis || consultant) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Analysis & Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Top values</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(aiAnalysis?.top_values || consultant?.top_values)?.map((value: string, index: number) => (
                        <Badge key={index} variant="secondary">{value}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Personality traits</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(aiAnalysis?.personality_traits || consultant?.personality_traits)?.map((trait: string, index: number) => (
                        <Badge key={index} variant="outline">{trait}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                {(aiAnalysis?.communication_style || consultant?.communication_style) && (
                  <div>
                    <p className="text-sm font-medium">Communication style</p>
                    <p className="text-sm text-gray-600 mt-1">{aiAnalysis?.communication_style || consultant?.communication_style}</p>
                  </div>
                )}
                
                {(aiAnalysis?.thought_leadership_score || consultant?.thought_leadership_score) && (
                  <div>
                    <p className="text-sm font-medium">Thought Leadership score</p>
                    <p className="text-lg font-semibold text-blue-600">{aiAnalysis?.thought_leadership_score || consultant?.thought_leadership_score}/100</p>
                  </div>
                )}
                
                <Button 
                  variant="outline" 
                  onClick={() => {
                    console.log('🔍 Navigating to analysis with consultant ID:', consultant?.id);
                    navigate(`/analysis?id=${consultant?.id}`);
                  }}
                  className="w-full"
                  disabled={!consultant?.id}
                >
                  View full AI analysis
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Button 
                  onClick={handleReUpload}
                  variant="outline"
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload new CV & LinkedIn
                </Button>
                <Button 
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className="w-full"
                >
                  {isSaving ? 'Saving...' : 'Save all changes'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Notice */}
          <div className="text-center text-sm text-gray-600 bg-white rounded-lg p-4 border">
            <p>
              Your data is stored securely and is only visible to you and MatchWise administrators 
              unless you choose to publish it. You can update or delete your data at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}