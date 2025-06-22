import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, LogOut, Mail, Phone, MapPin, Briefcase, Star, Calendar, Globe, Edit2, Upload, Eye } from 'lucide-react';
import Logo from '@/components/Logo';

interface ConsultantProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  tagline: string;
  skills: string[];
  certifications: string[];
  availability: string;
  hourly_rate: number;
  experience_years: number;
  is_published: boolean;
  last_active: string;
  created_at: string;
}

const MyProfile: React.FC = () => {
  const [profile, setProfile] = useState<ConsultantProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [showLogin, setShowLogin] = useState(true);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if consultant is authenticated via email/password
  const checkAuthentication = async () => {
    const storedAuth = localStorage.getItem('consultant_auth');
    if (storedAuth) {
      const { email, consultantId } = JSON.parse(storedAuth);
      await loadProfile(consultantId);
      setIsAuthenticated(true);
      setShowLogin(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Clean and normalize the email input
      const normalizedEmail = loginData.email.trim().toLowerCase();
      
      console.log('🔍 Looking for consultant with email:', normalizedEmail);

      // Use ilike for case-insensitive search and take first match if multiple exist
      const { data: consultants, error } = await supabase
        .from('consultants')
        .select('*')
        .ilike('email', normalizedEmail)
        .order('created_at', { ascending: false }); // Get most recent if multiple

      console.log('📊 Database query result:', { consultants, error });

      if (error || !consultants || consultants.length === 0) {
        console.error('❌ No consultant found:', error);
        
        // Let's also try a broader search to debug
        const { data: allConsultants } = await supabase
          .from('consultants')
          .select('id, name, email')
          .limit(10);
        
        console.log('📋 Available consultants in database:', allConsultants);
        
        toast({
          title: "Login failed",
          description: "No consultant found with this email address.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Take the first consultant if multiple exist
      const consultant = consultants[0];
      
      if (consultants.length > 1) {
        console.log(`⚠️ Found ${consultants.length} consultants with email ${normalizedEmail}, using the most recent one`);
      }

      // Simple password check (in production, use proper hashing)
      const expectedPassword = `${consultant.name.toLowerCase().replace(/\s+/g, '')}123`;
      
      console.log('🔑 Expected password format:', expectedPassword);
      
      if (loginData.password !== expectedPassword) {
        toast({
          title: "Login failed", 
          description: `Incorrect password. Try: ${expectedPassword}`,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Store authentication
      localStorage.setItem('consultant_auth', JSON.stringify({
        email: normalizedEmail,
        consultantId: consultant.id
      }));

      setProfile(consultant);
      setIsAuthenticated(true);
      setShowLogin(false);
      
      toast({
        title: "Login successful!",
        description: `Welcome back, ${consultant.name}!`,
      });

    } catch (error) {
      console.error('❌ Login error:', error);
      toast({
        title: "Login error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  const loadProfile = async (consultantId: string) => {
    try {
      const { data, error } = await supabase
        .from('consultants')
        .select('*')
        .eq('id', consultantId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error loading profile",
        description: "Could not load your profile data.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('consultants')
        .update({
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          location: profile.location,
          title: profile.title,
          tagline: profile.tagline,
          skills: profile.skills,
          certifications: profile.certifications,
          availability: profile.availability,
          hourly_rate: profile.hourly_rate,
          is_published: profile.is_published,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);

      if (error) throw error;

      toast({
        title: "Profile updated!",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Save failed",
        description: "Could not save your changes.",
        variant: "destructive",
      });
    }
    setSaving(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('consultant_auth');
    setIsAuthenticated(false);
    setShowLogin(true);
    setProfile(null);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  const addSkill = (skill: string) => {
    if (profile && skill.trim() && !profile.skills.includes(skill.trim())) {
      setProfile({
        ...profile,
        skills: [...profile.skills, skill.trim()]
      });
    }
  };

  const removeSkill = (skillToRemove: string) => {
    if (profile) {
      setProfile({
        ...profile,
        skills: profile.skills.filter(skill => skill !== skillToRemove)
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (showLogin || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Logo />
            </div>
            <CardTitle className="text-2xl">Consultant Login</CardTitle>
            <p className="text-slate-600">Access your MatchWise profile</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  placeholder="Your password"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">
                  Password format: [firstname][lastname]123 (lowercase, no spaces)
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <Button 
                variant="link" 
                onClick={() => navigate('/')}
                className="text-slate-600"
              >
                ← Back to MatchWise
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Profile not found</h1>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Logo />
              <div>
                <h1 className="text-xl font-bold text-slate-900">My Profile</h1>
                <p className="text-sm text-slate-600">Manage your consultant profile</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={profile.is_published ? "default" : "secondary"}>
                {profile.is_published ? "Published" : "Draft"}
              </Badge>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Profile Settings */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="title">Professional Title</Label>
                    <Input
                      id="title"
                      value={profile.title || ''}
                      onChange={(e) => setProfile({...profile, title: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="tagline">Professional Tagline</Label>
                  <Textarea
                    id="tagline"
                    value={profile.tagline || ''}
                    onChange={(e) => setProfile({...profile, tagline: e.target.value})}
                    placeholder="Brief description of your expertise and value proposition..."
                    maxLength={150}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    {(profile.tagline || '').length}/150 characters
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        className="pl-10"
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="phone"
                        className="pl-10"
                        value={profile.phone || ''}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="location"
                        className="pl-10"
                        value={profile.location || ''}
                        onChange={(e) => setProfile({...profile, location: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Skills & Expertise
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Current Skills</Label>
                  <div className="flex flex-wrap gap-2 mt-2 mb-4">
                    {profile.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer hover:bg-red-100"
                        onClick={() => removeSkill(skill)}
                      >
                        {skill} ×
                      </Badge>
                    ))}
                  </div>
                  <Input
                    placeholder="Add a new skill and press Enter"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addSkill(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input
                      id="experience"
                      type="number"
                      value={profile.experience_years || 0}
                      onChange={(e) => setProfile({...profile, experience_years: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="rate">Hourly Rate (SEK)</Label>
                    <Input
                      id="rate"
                      type="number"
                      value={profile.hourly_rate || 0}
                      onChange={(e) => setProfile({...profile, hourly_rate: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="availability">Availability Status</Label>
                  <select
                    id="availability"
                    className="w-full p-2 border border-slate-300 rounded-md"
                    value={profile.availability}
                    onChange={(e) => setProfile({...profile, availability: e.target.value})}
                  >
                    <option value="Available">Available</option>
                    <option value="Busy">Busy</option>
                    <option value="Not Available">Not Available</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button onClick={handleSave} disabled={saving} className="flex-1">
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button variant="outline" onClick={() => navigate(`/analysis?id=${profile.id}`)}>
                <Eye className="h-4 w-4 mr-2" />
                View Analysis
              </Button>
            </div>
          </div>

          {/* Profile Preview */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Public Profile Preview
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={profile.is_published}
                    onCheckedChange={(checked) => setProfile({...profile, is_published: checked})}
                  />
                  <Label>Publish Profile</Label>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <h3 className="font-bold text-lg">{profile.name}</h3>
                    <p className="text-slate-600">{profile.title}</p>
                    {profile.tagline && (
                      <p className="text-sm text-slate-500 mt-2 italic">"{profile.tagline}"</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span>{profile.location || 'Location not set'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="h-4 w-4 text-slate-400" />
                      <span>{profile.experience_years} years experience</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="h-4 w-4 text-slate-400" />
                      <span>{profile.hourly_rate} SEK/hour</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Top Skills</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {profile.skills.slice(0, 6).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {profile.skills.length > 6 && (
                        <Badge variant="outline" className="text-xs">
                          +{profile.skills.length - 6} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar className="h-3 w-3" />
                      <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
