
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { User, Mail, Users, Plus, Building, ArrowLeft } from 'lucide-react';
import Logo from '@/components/Logo';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  company: string;
  role: string;
  created_at: string;
}

interface TeamMember {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
}

const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadProfile();
      loadTeamMembers();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
      } else {
        // Create profile if it doesn't exist
        const newProfile = {
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || user.email || '',
          company: '',
          role: 'user'
        };
        
        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single();

        if (createError) throw createError;
        setProfile(createdProfile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error loading profile",
        description: "Could not load your profile data.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const loadTeamMembers = async () => {
    if (!user) return;
    
    try {
      // Get current user's company
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('company')
        .eq('id', user.id)
        .single();

      if (currentProfile?.company) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('company', currentProfile.company)
          .neq('id', user.id);

        if (error) throw error;
        setTeamMembers(data || []);
      }
    } catch (error) {
      console.error('Error loading team members:', error);
    }
  };

  const handleSave = async () => {
    if (!profile || !user) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          company: profile.company,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated!",
        description: "Your changes have been saved successfully.",
      });
      
      // Reload team members in case company changed
      loadTeamMembers();
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

  const handleInvite = async () => {
    if (!inviteEmail || !user || !profile) return;
    
    setInviteLoading(true);
    try {
      // Send invitation email via edge function
      const { error } = await supabase.functions.invoke('send-team-invitation', {
        body: {
          inviterName: profile.full_name,
          inviterEmail: profile.email,
          inviteeEmail: inviteEmail,
          company: profile.company,
        }
      });

      if (error) throw error;

      toast({
        title: "Invitation sent!",
        description: `An invitation has been sent to ${inviteEmail}`,
      });
      
      setInviteEmail('');
      setShowInviteDialog(false);
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast({
        title: "Invitation failed",
        description: "Could not send the invitation. Please try again.",
        variant: "destructive",
      });
    }
    setInviteLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Profile not found</h1>
          <Button onClick={() => navigate('/matchwiseai')}>Back to Dashboard</Button>
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
              <Button 
                variant="ghost" 
                onClick={() => navigate('/matchwiseai')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Account Settings</h1>
                <p className="text-sm text-slate-600">Manage your profile and team</p>
              </div>
            </div>
            <Logo />
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
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={profile?.full_name || ''}
                    onChange={(e) => setProfile(profile ? {...profile, full_name: e.target.value} : null)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      className="pl-10 bg-gray-50"
                      value={profile?.email || ''}
                      readOnly
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Email address cannot be changed
                  </p>
                </div>

                <div>
                  <Label htmlFor="company">Company Name</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="company"
                      className="pl-10"
                      value={profile?.company || ''}
                      onChange={(e) => setProfile(profile ? {...profile, company: e.target.value} : null)}
                      placeholder="Enter your company name"
                    />
                  </div>
                </div>

                <Button onClick={handleSave} disabled={saving} className="w-full">
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>

            {/* Team Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Team Members
                  </CardTitle>
                  <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Invite Colleague
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Invite Team Member</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="invite_email">Email Address</Label>
                          <Input
                            id="invite_email"
                            type="email"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            placeholder="colleague@company.com"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            onClick={handleInvite} 
                            disabled={inviteLoading || !inviteEmail}
                            className="flex-1"
                          >
                            {inviteLoading ? 'Sending...' : 'Send Invitation'}
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setShowInviteDialog(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {teamMembers.length > 0 ? (
                  <div className="space-y-3">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium">{member.full_name}</p>
                          <p className="text-sm text-slate-600">{member.email}</p>
                        </div>
                        <Badge variant="secondary">{member.role}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-600 mb-2">No team members yet</p>
                    <p className="text-sm text-slate-500">
                      Invite colleagues to collaborate on the same consultant database
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Account Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Account Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">
                    {profile?.full_name.split(' ').map(n => n[0]).join('') || 'U'}
                  </div>
                  <h3 className="font-bold text-lg">{profile?.full_name}</h3>
                  <p className="text-slate-600">{profile?.email}</p>
                  {profile?.company && (
                    <p className="text-sm text-slate-500 mt-1">{profile?.company}</p>
                  )}
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Account Type:</span>
                    <Badge variant="default">Professional</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Team Size:</span>
                    <span>{teamMembers.length + 1} members</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Member since:</span>
                    <span>{new Date(profile?.created_at).toLocaleDateString()}</span>
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

export default UserProfile;
