import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
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
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';

export default function DemoConsultant() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [consultant, setConsultant] = useState<any>(null);
  const [isPublished, setIsPublished] = useState(true);
  
  // Form state based on the demo consultant data
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
    loadDemoConsultant();
  }, []);

  const loadDemoConsultant = async () => {
    try {
      setIsLoading(true);
      
      // Load demo consultant
      const { data: consultantData } = await supabase
        .from('consultants')
        .select('*')
        .eq('type', 'demo-consultant')
        .single();

      if (consultantData) {
        setConsultant(consultantData);
        setFormData({
          full_name: consultantData.name || '',
          email: consultantData.email || '',
          phone: consultantData.phone || '',
          personal_tagline: consultantData.tagline || '',
          rate_preference: consultantData.hourly_rate?.toString() || '',
          availability: consultantData.availability || 'Available',
          skills: consultantData.skills || [],
          certifications: consultantData.certifications || []
        });
      }
    } catch (error) {
      console.error('Error loading demo consultant:', error);
      toast({
        title: "Demo data not available",
        description: "Could not load demo consultant.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChanges = () => {
    toast({
      title: "Demo Mode",
      description: "No changes are saved permanently in demo mode.",
    });
  };

  const handleToggleVisibility = () => {
    setIsPublished(!isPublished);
    toast({
      title: isPublished ? "Profile Hidden (Demo)" : "Profile Published (Demo)",
      description: isPublished 
        ? "In real usage, your profile would now be hidden" 
        : "In real usage, your profile would now be visible in the MatchWise network",
    });
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Logo size="md" variant="full" />
            <Badge className="bg-blue-600/20 text-blue-600 border-blue-500/30">
              Demo - Consultant View
            </Badge>
          </div>
          <h1 className="text-xl font-semibold">My Profile (Demo)</h1>
          <Link to="/">
            <Button 
              variant="outline" 
              className="border-slate-300 text-slate-700 hover:bg-slate-50 font-medium px-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Homepage
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Demo Notice */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">👋</span>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">Demo: Consultant Profile</h3>
                  <p className="text-sm text-blue-700">
                    This is how the consultant view looks after CV upload and AI analysis. All changes are temporary in demo mode.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

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
                    {consultant?.top_values?.map((value: string, index: number) => (
                      <Badge key={index} variant="secondary">{value}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Personality traits</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {consultant?.personality_traits?.map((trait: string, index: number) => (
                      <Badge key={index} variant="outline">{trait}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              {consultant?.communication_style && (
                <div>
                  <p className="text-sm font-medium">Communication style</p>
                  <p className="text-sm text-gray-600 mt-1">{consultant.communication_style}</p>
                </div>
              )}
              
              {consultant?.thought_leadership_score && (
                <div>
                  <p className="text-sm font-medium">Thought Leadership score</p>
                  <p className="text-lg font-semibold text-blue-600">{consultant.thought_leadership_score}/100</p>
                </div>
              )}
              
              <Button variant="outline" className="w-full" disabled>
                View full AI analysis (Demo)
              </Button>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Button 
                  variant="outline"
                  className="w-full"
                  disabled
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload new CV & LinkedIn (Demo)
                </Button>
                <Button 
                  onClick={handleSaveChanges}
                  className="w-full"
                >
                  Save changes (Demo)
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