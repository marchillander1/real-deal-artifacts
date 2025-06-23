
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { User, Mail, Phone, MapPin, Briefcase, Eye, EyeOff, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function MyProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // Fetch user profile with analysis
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select(`
          *,
          ai_analysis (
            *,
            published_profiles (*)
          )
        `)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (profileError) throw profileError;

      setProfile(profileData);
      if (profileData.ai_analysis && profileData.ai_analysis.length > 0) {
        setAnalysis(profileData.ai_analysis[0]);
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Could not fetch profile",
        description: "Please check that you are logged in and have a profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: profile.full_name,
          email: profile.email,
          phone: profile.phone,
          title: profile.title,
          personal_tagline: profile.personal_tagline,
          availability: profile.availability,
          visibility_toggle: profile.visibility_toggle
        })
        .eq('id', profile.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your changes have been saved",
        variant: "default",
      });
      
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Could not save",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleVisibility = async () => {
    if (!profile || !analysis?.published_profiles?.[0]) return;

    try {
      const newVisibility = !profile.visibility_toggle;
      
      // Update profile visibility
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({ visibility_toggle: newVisibility })
        .eq('id', profile.id);

      if (profileError) throw profileError;

      // Update published profile status
      const { error: publishError } = await supabase
        .from('published_profiles')
        .update({ 
          is_active: newVisibility,
          visibility_status: newVisibility ? 'public' : 'private' 
        })
        .eq('user_profile_id', profile.id);

      if (publishError) throw publishError;

      setProfile({ ...profile, visibility_toggle: newVisibility });
      
      toast({
        title: newVisibility ? "Profile visible" : "Profile hidden",
        description: newVisibility ? "Your profile is now visible to clients" : "Your profile is now hidden",
        variant: "default",
      });
    } catch (error: any) {
      console.error('Error toggling visibility:', error);
      toast({
        title: "Could not change visibility",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <User className="h-16 w-16 text-blue-500 animate-pulse mx-auto mb-4" />
          <p className="text-lg text-slate-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <Card className="max-w-md text-center p-8">
          <User className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">No profile found</h2>
          <p className="text-slate-600">Create a profile by uploading your CV.</p>
        </Card>
      </div>
    );
  }

  const isPublished = analysis?.published_profiles && analysis.published_profiles.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <User className="h-8 w-8 text-blue-500" />
              <div>
                <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
                <p className="text-slate-600">Manage your consultant profile and visibility</p>
              </div>
            </div>
            
            {/* Visibility Toggle */}
            {isPublished && (
              <div className="flex items-center gap-3">
                {profile.visibility_toggle ? (
                  <Eye className="h-5 w-5 text-green-500" />
                ) : (
                  <EyeOff className="h-5 w-5 text-red-500" />
                )}
                <Label htmlFor="visibility" className="text-sm font-medium">
                  {profile.visibility_toggle ? 'Visible' : 'Hidden'}
                </Label>
                <Switch
                  id="visibility"
                  checked={profile.visibility_toggle}
                  onCheckedChange={toggleVisibility}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Status */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle>Profile Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">
                  {isPublished ? 'Published' : 'Not Published'}
                </div>
                <div className="text-sm text-slate-600">Status</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-2xl font-bold text-green-600">
                  {profile.visibility_toggle ? 'Visible' : 'Hidden'}
                </div>
                <div className="text-sm text-slate-600">Visibility</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">{profile.availability}</div>
                <div className="text-sm text-slate-600">Availability</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Information */}
        <Card className="mb-8 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Personal Information</CardTitle>
            <Button
              variant={isEditing ? "default" : "outline"}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={profile.full_name || ''}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  />
                ) : (
                  <div className="p-3 bg-slate-50 rounded-lg border">{profile.full_name}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title/Role</Label>
                {isEditing ? (
                  <Input
                    id="title"
                    value={profile.title || ''}
                    onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                  />
                ) : (
                  <div className="p-3 bg-slate-50 rounded-lg border">{profile.title}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={profile.email || ''}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                ) : (
                  <div className="p-3 bg-slate-50 rounded-lg border flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-500" />
                    {profile.email}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={profile.phone || ''}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                ) : (
                  <div className="p-3 bg-slate-50 rounded-lg border flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-500" />
                    {profile.phone || 'Not specified'}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tagline">Personal tagline</Label>
              {isEditing ? (
                <Textarea
                  id="tagline"
                  value={profile.personal_tagline || ''}
                  onChange={(e) => setProfile({ ...profile, personal_tagline: e.target.value })}
                  maxLength={150}
                />
              ) : (
                <div className="p-3 bg-slate-50 rounded-lg border">
                  {profile.personal_tagline || 'No tagline specified'}
                </div>
              )}
            </div>

            {isEditing && (
              <div className="flex gap-3">
                <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving...' : 'Save changes'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Analysis Summary */}
        {analysis && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>AI Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Technical Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {(analysis.tech_stack_primary || []).slice(0, 6).map((skill: string, index: number) => (
                      <Badge key={index} variant="default" className="bg-blue-100 text-blue-800">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Core Values</h4>
                  <div className="flex flex-wrap gap-2">
                    {(analysis.top_values || []).slice(0, 4).map((value: string, index: number) => (
                      <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                        {value}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Industry Areas</h4>
                  <div className="flex flex-wrap gap-2">
                    {(analysis.industries || []).slice(0, 4).map((industry: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-orange-600">
                        {industry}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Thought Leadership Score</h4>
                  <div className="text-2xl font-bold text-purple-600">
                    {analysis.thought_leadership_score || 0}/100
                  </div>
                </div>
              </div>

              {analysis.communication_style && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-2">Communication Style</h4>
                  <p className="text-slate-600 bg-slate-50 p-3 rounded-lg">
                    {analysis.communication_style}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
