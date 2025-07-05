import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Target, 
  BarChart3, 
  Settings,
  Search,
  Filter,
  Download,
  Plus,
  Shield,
  Activity,
  TrendingUp,
  UserCheck,
  Briefcase
} from 'lucide-react';
import { ConsultantManagement } from '@/components/admin/ConsultantManagement';
import { UserManagement } from '@/components/admin/UserManagement';
import { DetailedReporting } from '@/components/admin/DetailedReporting';
import { useSupabaseConsultants } from '@/hooks/useSupabaseConsultants';
import { useSupabaseAssignments } from '@/hooks/useSupabaseAssignments';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { consultants } = useSupabaseConsultants();
  const { assignments } = useSupabaseAssignments();
  
  const { data: matches = [] } = useQuery({
    queryKey: ['admin-matches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('matches')
        .select('*');
      
      if (error) throw error;
      return data || [];
    }
  });

  const stats = {
    totalConsultants: consultants.length,
    activeConsultants: consultants.filter(c => c.availability === 'Available').length,
    totalAssignments: assignments.length,
    totalMatches: matches.length,
    successfulMatches: matches.filter(m => m.status === 'accepted').length,
    avgMatchScore: matches.length > 0 
      ? Math.round(matches.reduce((sum, m) => sum + (Number(m.match_score) || 0), 0) / matches.length) 
      : 0
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Admin Portal</h1>
                <p className="text-slate-600">Hantera plattformen och användare</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Sök..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Plus className="h-4 w-4 mr-2" />
                Ny användare
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Översikt</span>
            </TabsTrigger>
            <TabsTrigger value="consultants" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Konsulter</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Användare</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Rapporter</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Inställningar</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    Totala Konsulter
                  </CardTitle>
                  <Target className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">{stats.totalConsultants}</div>
                  <p className="text-xs text-slate-600 mt-1">
                    {stats.activeConsultants} aktiva
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    Uppdrag
                  </CardTitle>
                  <Briefcase className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">{stats.totalAssignments}</div>
                  <p className="text-xs text-slate-600 mt-1">
                    skapade totalt
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    Matchningar
                  </CardTitle>
                  <UserCheck className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">{stats.totalMatches}</div>
                  <p className="text-xs text-slate-600 mt-1">
                    {stats.successfulMatches} lyckade
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    Snitt Matchning
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">{stats.avgMatchScore}%</div>
                  <p className="text-xs text-slate-600 mt-1">
                    genomsnittlig poäng
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  Snabbåtgärder
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="justify-start h-auto p-4">
                    <div className="text-left">
                      <div className="font-medium">Exportera Data</div>
                      <div className="text-sm text-slate-600">Ladda ner rapporter</div>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="justify-start h-auto p-4">
                    <div className="text-left">
                      <div className="font-medium">Backup System</div>
                      <div className="text-sm text-slate-600">Säkerhetskopiera data</div>
                    </div>
                  </Button>
                  
                  <Button variant="outline" className="justify-start h-auto p-4">
                    <div className="text-left">
                      <div className="font-medium">System Health</div>
                      <div className="text-sm text-slate-600">Kontrollera status</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  Senaste Aktivitet
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportera
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: "Ny konsult registrerad", user: "system", time: "2 min sedan", type: "success" },
                    { action: "Uppdrag skapat", user: "admin", time: "15 min sedan", type: "info" },
                    { action: "Matchning genomförd", user: "system", time: "1 timme sedan", type: "success" },
                    { action: "Användare inaktiverad", user: "admin", time: "3 timmar sedan", type: "warning" }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant={activity.type === 'success' ? 'default' : activity.type === 'warning' ? 'destructive' : 'secondary'}>
                          {activity.type}
                        </Badge>
                        <div>
                          <div className="font-medium text-slate-900">{activity.action}</div>
                          <div className="text-sm text-slate-600">av {activity.user}</div>
                        </div>
                      </div>
                      <div className="text-sm text-slate-500">{activity.time}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="consultants">
            <ConsultantManagement />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="reports">
            <DetailedReporting 
              consultants={consultants} 
              assignments={assignments} 
              matches={matches} 
            />
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-600" />
                  Systeminställningar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Allmänna Inställningar</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Automatiska matchningar</div>
                          <div className="text-sm text-slate-600">Aktivera automatisk matchning av konsulter</div>
                        </div>
                        <Button variant="outline" size="sm">Aktivera</Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">E-postnotifikationer</div>
                          <div className="text-sm text-slate-600">Skicka notifikationer till användare</div>
                        </div>
                        <Button variant="outline" size="sm">Konfigurera</Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Datalagring</div>
                          <div className="text-sm text-slate-600">Hantera datalagring och backup</div>
                        </div>
                        <Button variant="outline" size="sm">Hantera</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPortal;
