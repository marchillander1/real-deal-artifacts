import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BulkConsultantUpload } from '@/components/company/BulkConsultantUpload';
import { CompanyConsultantsList } from '@/components/company/CompanyConsultantsList';
import { 
  LogOut, 
  Upload, 
  Users, 
  Settings, 
  FileText, 
  BarChart3,
  TrendingUp,
  Clock,
  Mail,
  Activity,
  UserCheck,
  Calendar,
  Download,
  Eye
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DashboardMetrics {
  totalConsultants: number;
  activeConsultants: number;
  placedConsultants: number;
  draftConsultants: number;
  totalInquiries: number;
  avgTimeToPlacement: number;
}

interface ActivityItem {
  id: string;
  type: 'inquiry' | 'placement' | 'edit' | 'assignment_end';
  message: string;
  timestamp: string;
  consultant?: string;
}

export const CompanyDashboard: React.FC = () => {
  const { signOut, user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState<any>(null);
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalConsultants: 0,
    activeConsultants: 0,
    placedConsultants: 0,
    draftConsultants: 0,
    totalInquiries: 0,
    avgTimeToPlacement: 0
  });
  const [activities, setActivities] = useState<ActivityItem[]>([]);

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
      
      // Calculate metrics
      const total = data?.length || 0;
      const active = data?.filter((c: any) => c.availability === 'Available' && c.is_published)?.length || 0;
      const placed = data?.filter((c: any) => c.availability === 'Placed' || c.availability === 'Busy')?.length || 0;
      const drafts = data?.filter((c: any) => !c.is_published)?.length || 0;

      // For now, using mock data for inquiries and placement time
      const inquiries = Math.floor(Math.random() * 20) + 5;
      const avgPlacement = Math.floor(Math.random() * 30) + 15;

      setMetrics({
        totalConsultants: total,
        activeConsultants: active,
        placedConsultants: placed,
        draftConsultants: drafts,
        totalInquiries: inquiries,
        avgTimeToPlacement: avgPlacement
      });

      // Generate mock activities
      generateMockActivities(data || []);
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

  const generateMockActivities = (consultants: any[]) => {
      const mockActivities: ActivityItem[] = [
      {
        id: '1',
        type: 'inquiry',
        message: 'New inquiry for React developer from TechCorp AB',
        timestamp: '2 hours ago',
        consultant: consultants[0]?.name
      },
      {
        id: '2',
        type: 'placement',
        message: `${consultants[0]?.name || 'A consultant'} has been matched to new assignment`,
        timestamp: '1 day ago',
        consultant: consultants[0]?.name
      },
      {
        id: '3',
        type: 'edit',
        message: `Profile updated for ${consultants[1]?.name || 'consultant'}`,
        timestamp: '3 days ago',
        consultant: consultants[1]?.name
      },
      {
        id: '4',
        type: 'assignment_end',
        message: 'Assignment ending soon for system architect',
        timestamp: '1 week ago'
      }
    ];

    setActivities(mockActivities.slice(0, Math.min(mockActivities.length, consultants.length + 1)));
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'inquiry': return <Mail className="h-4 w-4 text-blue-600" />;
      case 'placement': return <UserCheck className="h-4 w-4 text-green-600" />;
      case 'edit': return <Settings className="h-4 w-4 text-orange-600" />;
      case 'assignment_end': return <Calendar className="h-4 w-4 text-purple-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-900">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Company Dashboard</h1>
            <p className="text-gray-600">{profile?.company || 'Your Company'}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {profile?.full_name}</span>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button
            onClick={() => setActiveTab('overview')}
            variant={activeTab === 'overview' ? 'default' : 'outline'}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </Button>
          <Button
            onClick={() => setActiveTab('upload')}
            variant={activeTab === 'upload' ? 'default' : 'outline'}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Consultants
          </Button>
          <Button
            onClick={() => setActiveTab('consultants')}
            variant={activeTab === 'consultants' ? 'default' : 'outline'}
          >
            <Users className="h-4 w-4 mr-2" />
            Manage Consultants ({consultants.length})
          </Button>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Header Section */}
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">👋 Welcome back, {profile?.company || profile?.full_name}!</h1>
                    <p className="text-blue-100 text-lg mb-4">
                      Here's a quick snapshot of your consultants and market activity.
                    </p>
                    <p className="text-blue-100">
                      Keep full control of your consultant pool and market activity. Monitor placements, 
                      manage profiles, and see exactly how your consultants perform in the market — all in one place.
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <BarChart3 className="h-20 w-20 text-white/30" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Consultants</p>
                      <p className="text-3xl font-bold text-gray-900">{metrics.totalConsultants}</p>
                    </div>
                    <Users className="h-10 w-10 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Consultants</p>
                      <p className="text-3xl font-bold text-green-600">{metrics.activeConsultants}</p>
                    </div>
                    <UserCheck className="h-10 w-10 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Placed Consultants</p>
                      <p className="text-3xl font-bold text-purple-600">{metrics.placedConsultants}</p>
                    </div>
                    <TrendingUp className="h-10 w-10 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending Edits or Drafts</p>
                      <p className="text-3xl font-bold text-orange-600">{metrics.draftConsultants}</p>
                    </div>
                    <FileText className="h-10 w-10 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Market Inquiries</p>
                      <p className="text-3xl font-bold text-blue-600">{metrics.totalInquiries}</p>
                    </div>
                    <Mail className="h-10 w-10 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Average Time to Placement</p>
                      <p className="text-3xl font-bold text-gray-900">{metrics.avgTimeToPlacement}</p>
                      <p className="text-sm text-gray-500">days</p>
                    </div>
                    <Clock className="h-10 w-10 text-gray-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Activity Feed */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5" />
                      <span>Recent Activity</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activities.length > 0 ? activities.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                          {getActivityIcon(activity.type)}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                            <p className="text-xs text-gray-500">{activity.timestamp}</p>
                          </div>
                        </div>
                      )) : (
                        <div className="text-center py-8 text-gray-500">
                          <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p>No activity to show yet</p>
                          <p className="text-sm">Upload your first consultants to get started</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions Panel */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      onClick={() => setActiveTab('upload')} 
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload New Consultants
                    </Button>
                    
                    <Button 
                      onClick={() => setActiveTab('consultants')} 
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Edit/Deactivate Consultants
                    </Button>
                    
                    <Button 
                      className="w-full justify-start"
                      variant="outline"
                      disabled
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download One-Pagers
                    </Button>
                    
                    <Button 
                      className="w-full justify-start"
                      variant="outline"
                      disabled
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Reports
                    </Button>
                  </CardContent>
                </Card>

                {/* Summary Info Card */}
                <Card className="mt-6">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="mb-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Company Account Active
                      </div>
                      <p className="text-sm text-gray-600">
                        You have full control over your consultants' visibility and pricing
                      </p>
                      <div className="mt-4 text-lg font-semibold text-emerald-600">2% Success Fee</div>
                      <p className="text-gray-600 text-sm">
                        Only pay when your consultants get hired
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'upload' && (
          <Card className="bg-white border-gray-200">
            <CardHeader className="bg-gray-50 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">Bulk Consultant Upload</CardTitle>
                  <p className="text-gray-600 mt-1">
                    Upload your consultants in bulk, let our AI analyze and package them, 
                    and decide when and how they appear on the market.
                  </p>
                </div>
                <Upload className="h-10 w-10 text-blue-600" />
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">👋</div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Welcome!</h3>
                    <p className="text-blue-800">
                      Upload your consultants in bulk, let our AI analyze and package them, 
                      and decide when and how they appear on the market.
                    </p>
                    <p className="text-blue-800 mt-2">
                      You're fully in control: edit profiles anytime, set pricing and availability, 
                      and download presentation-ready one-pagers in seconds.
                    </p>
                    <p className="text-blue-800 mt-2 font-medium">
                      Ready to get your talent off the bench? Let's go!
                    </p>
                  </div>
                </div>
              </div>
              
              <BulkConsultantUpload onConsultantUploaded={handleConsultantUploaded} />
            </CardContent>
          </Card>
        )}

        {activeTab === 'consultants' && (
          <Card className="bg-white border-gray-200">
            <CardHeader className="bg-gray-50 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">Manage Consultants</CardTitle>
                  <p className="text-gray-600 mt-1">
                    Edit, activate, or deactivate your consultants. Update pricing and availability.
                  </p>
                </div>
                <Users className="h-10 w-10 text-blue-600" />
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <CompanyConsultantsList 
                consultants={consultants} 
                onConsultantsUpdated={fetchConsultants}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};