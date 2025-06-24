
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Shield, Users, BarChart3, Settings, Database, Zap, Activity } from 'lucide-react';
import { PlatformHealth } from '@/components/platform/PlatformHealth';
import { PerformanceMonitor } from '@/components/optimization/PerformanceMonitor';
import { AdvancedAnalytics } from '@/components/analytics/AdvancedAnalytics';
import { ReportsOverview } from '@/components/reports/ReportsOverview';
import { useSupabaseConsultantsWithDemo } from '@/hooks/useSupabaseConsultantsWithDemo';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AdminPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { consultants } = useSupabaseConsultantsWithDemo();

  // Fetch system data
  const { data: assignments = [] } = useQuery({
    queryKey: ['admin-assignments'],
    queryFn: async () => {
      const { data, error } = await supabase.from('assignments').select('*');
      return error ? [] : data;
    },
  });

  const { data: matches = [] } = useQuery({
    queryKey: ['admin-matches'],
    queryFn: async () => {
      const { data, error } = await supabase.from('matches').select('*');
      return error ? [] : data;
    },
  });

  // System statistics
  const totalUsers = consultants.length;
  const totalAssignments = assignments.length;
  const totalMatches = matches.length;
  const systemUptime = '99.9%';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
              <p className="text-gray-600">Systemövervakning och plattformshantering</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Översikt
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Analys
            </TabsTrigger>
            <TabsTrigger value="health" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Systemhälsa
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Prestanda
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Rapporter
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* System Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <Users className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">{totalUsers}</p>
                      <p className="text-gray-600">Registrerade användare</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">{totalAssignments}</p>
                      <p className="text-gray-600">Aktiva uppdrag</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <Zap className="h-8 w-8 text-purple-500" />
                    <div>
                      <p className="text-2xl font-bold">{totalMatches}</p>
                      <p className="text-gray-600">Totala matchningar</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <Activity className="h-8 w-8 text-orange-500" />
                    <div>
                      <p className="text-2xl font-bold">{systemUptime}</p>
                      <p className="text-gray-600">System drifttid</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Snabbåtgärder</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="h-16 flex flex-col items-center justify-center">
                    <Database className="h-5 w-5 mb-1" />
                    Backup databas
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                    <Settings className="h-5 w-5 mb-1" />
                    Systemunderhåll
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                    <Shield className="h-5 w-5 mb-1" />
                    Säkerhetslogg
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PlatformHealth />
              <PerformanceMonitor />
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <AdvancedAnalytics />
          </TabsContent>

          <TabsContent value="health">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PlatformHealth />
              <Card>
                <CardHeader>
                  <CardTitle>Systemloggar</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm font-mono bg-gray-900 text-green-400 p-4 rounded-lg max-h-64 overflow-y-auto">
                    <div>[2024-06-24 14:23:12] INFO: AI matching service operational</div>
                    <div>[2024-06-24 14:23:11] INFO: Database connection stable</div>
                    <div>[2024-06-24 14:23:10] INFO: Email service functional</div>
                    <div>[2024-06-24 14:23:09] INFO: Cache hit rate: 94%</div>
                    <div>[2024-06-24 14:23:08] INFO: API response time: 156ms</div>
                    <div>[2024-06-24 14:23:07] INFO: User session created</div>
                    <div>[2024-06-24 14:23:06] INFO: CV analysis completed</div>
                    <div>[2024-06-24 14:23:05] INFO: New consultant registered</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance">
            <PerformanceMonitor />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsOverview 
              consultants={consultants}
              assignments={assignments}
              matches={matches}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPortal;
