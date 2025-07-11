import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BulkConsultantUpload } from '@/components/company/BulkConsultantUpload';
import { CompanyConsultantsList } from '@/components/company/CompanyConsultantsList';
import { LogOut, Upload, Users, Settings, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const CompanyDashboard: React.FC = () => {
  const { signOut, user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState<any>(null);
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    fetchConsultants();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchConsultants = async () => {
    try {
      const { data, error } = await supabase
        .from('consultants')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConsultants(data || []);
    } catch (error) {
      console.error('Error fetching consultants:', error);
      toast({
        title: "Error",
        description: "Failed to load consultants",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleConsultantUploaded = () => {
    fetchConsultants();
    setActiveTab('consultants');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-slate-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Company Dashboard</h1>
              <p className="text-slate-300">{profile?.company || 'Your Company'}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-slate-300">Welcome, {profile?.full_name}</span>
              <Button variant="outline" onClick={handleSignOut} className="text-white border-slate-600">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Onboarding Message */}
        {activeTab === 'overview' && (
          <Card className="mb-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30">
            <CardContent className="p-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-4">👋 Welcome!</h2>
                <p className="text-slate-300 max-w-3xl mx-auto leading-relaxed">
                  Upload your consultants in bulk, let our AI analyze and package them, and decide when and how they appear on the market.
                  You're fully in control: edit profiles anytime, set pricing and availability, and download presentation-ready one-pagers in seconds.
                  <br />
                  <span className="font-semibold text-blue-300">Ready to get your talent off the bench? Let's go!</span>
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button
            onClick={() => setActiveTab('overview')}
            variant={activeTab === 'overview' ? 'default' : 'outline'}
            className="text-white"
          >
            <FileText className="h-4 w-4 mr-2" />
            Overview
          </Button>
          <Button
            onClick={() => setActiveTab('upload')}
            variant={activeTab === 'upload' ? 'default' : 'outline'}
            className="text-white"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Consultants
          </Button>
          <Button
            onClick={() => setActiveTab('consultants')}
            variant={activeTab === 'consultants' ? 'default' : 'outline'}
            className="text-white"
          >
            <Users className="h-4 w-4 mr-2" />
            Manage Consultants ({consultants.length})
          </Button>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Total Consultants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{consultants.length}</div>
                <p className="text-slate-400 mt-2">
                  {consultants.filter((c: any) => c.is_published).length} published to network
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => setActiveTab('upload')} 
                  className="w-full"
                  size="sm"
                >
                  Upload New Consultants
                </Button>
                <Button 
                  onClick={() => setActiveTab('consultants')} 
                  variant="outline" 
                  className="w-full text-white border-slate-600"
                  size="sm"
                >
                  Manage Existing
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  💰 Pricing Model
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold text-emerald-400">2% Success Fee</div>
                <p className="text-slate-400 mt-2 text-sm">
                  Only pay when your consultants get hired through MatchWise
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'upload' && (
          <BulkConsultantUpload onConsultantUploaded={handleConsultantUploaded} />
        )}

        {activeTab === 'consultants' && (
          <CompanyConsultantsList 
            consultants={consultants} 
            onConsultantsUpdated={fetchConsultants}
          />
        )}
      </div>
    </div>
  );
};