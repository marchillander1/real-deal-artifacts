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
        message: 'Ny förfrågan för React-utvecklare från TechCorp AB',
        timestamp: '2 timmar sedan',
        consultant: consultants[0]?.name
      },
      {
        id: '2',
        type: 'placement',
        message: `${consultants[0]?.name || 'En konsult'} har matchats till nytt uppdrag`,
        timestamp: '1 dag sedan',
        consultant: consultants[0]?.name
      },
      {
        id: '3',
        type: 'edit',
        message: `Profil uppdaterad för ${consultants[1]?.name || 'konsult'}`,
        timestamp: '3 dagar sedan',
        consultant: consultants[1]?.name
      },
      {
        id: '4',
        type: 'assignment_end',
        message: 'Uppdrag avslutas inom kort för systemarkitekt',
        timestamp: '1 vecka sedan'
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
            Översikt
          </Button>
          <Button
            onClick={() => setActiveTab('upload')}
            variant={activeTab === 'upload' ? 'default' : 'outline'}
          >
            <Upload className="h-4 w-4 mr-2" />
            Ladda upp konsulter
          </Button>
          <Button
            onClick={() => setActiveTab('consultants')}
            variant={activeTab === 'consultants' ? 'default' : 'outline'}
          >
            <Users className="h-4 w-4 mr-2" />
            Hantera konsulter ({consultants.length})
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
                    <h1 className="text-3xl font-bold mb-2">👋 Välkommen tillbaka, {profile?.company || profile?.full_name}!</h1>
                    <p className="text-blue-100 text-lg mb-4">
                      Här är en snabb överblick av dina konsulter och marknadsaktivitet.
                    </p>
                    <p className="text-blue-100">
                      Behåll full kontroll över din konsultpool och marknadsaktivitet. Övervaka placeringar, 
                      hantera profiler och se exakt hur dina konsulter presterar på marknaden — allt på ett ställe.
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
                      <p className="text-sm font-medium text-gray-600">Totalt antal konsulter</p>
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
                      <p className="text-sm font-medium text-gray-600">Aktiva konsulter</p>
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
                      <p className="text-sm font-medium text-gray-600">Placerade konsulter</p>
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
                      <p className="text-sm font-medium text-gray-600">Utkast & pågående redigeringar</p>
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
                      <p className="text-sm font-medium text-gray-600">Totala marknadsförfrågningar</p>
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
                      <p className="text-sm font-medium text-gray-600">Genomsnittlig tid till placering</p>
                      <p className="text-3xl font-bold text-gray-900">{metrics.avgTimeToPlacement}</p>
                      <p className="text-sm text-gray-500">dagar</p>
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
                      <span>Senaste aktiviteter</span>
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
                          <p>Ingen aktivitet att visa ännu</p>
                          <p className="text-sm">Ladda upp dina första konsulter för att komma igång</p>
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
                    <CardTitle>Snabbåtgärder</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      onClick={() => setActiveTab('upload')} 
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Ladda upp nya konsulter
                    </Button>
                    
                    <Button 
                      onClick={() => setActiveTab('consultants')} 
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Redigera/inaktivera konsulter
                    </Button>
                    
                    <Button 
                      className="w-full justify-start"
                      variant="outline"
                      disabled
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Ladda ner one-pagers
                    </Button>
                    
                    <Button 
                      className="w-full justify-start"
                      variant="outline"
                      disabled
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Visa rapporter
                    </Button>
                  </CardContent>
                </Card>

                {/* Summary Info Card */}
                <Card className="mt-6">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="mb-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Företagskonto aktivt
                      </div>
                      <p className="text-sm text-gray-600">
                        Du har full kontroll över dina konsulters synlighet och prissättning
                      </p>
                      <div className="mt-4 text-lg font-semibold text-emerald-600">2% Success Fee</div>
                      <p className="text-gray-600 text-sm">
                        Betala endast när dina konsulter blir anställda
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
                  <CardTitle className="text-xl font-bold text-gray-900">Bulk konsultuppladdning</CardTitle>
                  <p className="text-gray-600 mt-1">
                    Ladda upp dina konsulter i bulk, låt vår AI analysera och paketera dem, 
                    och bestäm när och hur de visas på marknaden.
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
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Välkommen!</h3>
                    <p className="text-blue-800">
                      Ladda upp dina konsulter i bulk, låt vår AI analysera och paketera dem, 
                      och bestäm när och hur de visas på marknaden.
                    </p>
                    <p className="text-blue-800 mt-2">
                      Du har full kontroll: redigera profiler när som helst, sätt priser och tillgänglighet, 
                      och ladda ner presentationsfärdiga one-pagers på sekunder.
                    </p>
                    <p className="text-blue-800 mt-2 font-medium">
                      Redo att få dina talanger från bänken? Vi kör!
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
                  <CardTitle className="text-xl font-bold text-gray-900">Hantera konsulter</CardTitle>
                  <p className="text-gray-600 mt-1">
                    Redigera, aktivera eller inaktivera dina konsulter. Uppdatera priser och tillgänglighet.
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