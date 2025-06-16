
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Briefcase, TrendingUp, Clock, Star, FileText, Bot } from 'lucide-react';
import { ConsultantsTab } from './ConsultantsTab';
import AIMatchingPreview from './AIMatchingPreview';
import { CVUploadForm } from './CVUploadForm';
import { MatchWiseChat } from './MatchWiseChat';
import { useSupabaseConsultantsWithDemo } from '@/hooks/useSupabaseConsultantsWithDemo';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { consultants } = useSupabaseConsultantsWithDemo();

  // Fetch matches data for stats
  const { data: matchesData = [] } = useQuery({
    queryKey: ['matches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('matches')
        .select('*');

      if (error) {
        console.error('Error fetching matches:', error);
        return [];
      }
      return data || [];
    },
  });

  // Real stats using actual data (same logic as Index page)
  const networkConsultants = consultants.filter(consultant => consultant.type === 'new');
  const myConsultants = consultants.filter(consultant => consultant.type === 'existing');
  const totalConsultants = consultants.length;
  const successfulMatches = matchesData.filter(match => match.status === 'accepted').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">MatchWise AI Dashboard</h1>
          <p className="text-gray-600">AI-driven consultant matching with human factors analysis</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="consultants">Consultants</TabsTrigger>
            <TabsTrigger value="matching">AI Matching</TabsTrigger>
            <TabsTrigger value="upload">CV Upload</TabsTrigger>
            <TabsTrigger value="chat">MatchWise Chat</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Consultants</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalConsultants}</div>
                  <p className="text-xs text-muted-foreground">
                    {networkConsultants.length} network + {myConsultants.length} my consultants
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">18</div>
                  <p className="text-xs text-muted-foreground">
                    +3 new this week
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Successful Matches</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{successfulMatches}</div>
                  <p className="text-xs text-muted-foreground">
                    +{Math.max(1, Math.floor(successfulMatches * 0.1))} this month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2.4h</div>
                  <p className="text-xs text-muted-foreground">
                    50% faster than industry
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Star className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New consultant Anna Lindström joined</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">New</Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Briefcase className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Assignment "React Developer" matched successfully</p>
                      <p className="text-xs text-gray-500">4 hours ago</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Matched</Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <Bot className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">AI analysis completed for 3 new CVs</p>
                      <p className="text-xs text-gray-500">6 hours ago</p>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800">AI</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button 
                    onClick={() => setActiveTab('upload')}
                    className="h-20 flex flex-col gap-2"
                  >
                    <FileText className="h-6 w-6" />
                    <span className="text-xs">Upload CV</span>
                  </Button>
                  
                  <Button 
                    onClick={() => setActiveTab('matching')}
                    variant="outline"
                    className="h-20 flex flex-col gap-2"
                  >
                    <Bot className="h-6 w-6" />
                    <span className="text-xs">AI Matching</span>
                  </Button>
                  
                  <Button 
                    onClick={() => setActiveTab('consultants')}
                    variant="outline"
                    className="h-20 flex flex-col gap-2"
                  >
                    <Users className="h-6 w-6" />
                    <span className="text-xs">View Consultants</span>
                  </Button>

                  <Button 
                    onClick={() => setActiveTab('chat')}
                    variant="outline"
                    className="h-20 flex flex-col gap-2"
                  >
                    <Bot className="h-6 w-6" />
                    <span className="text-xs">MatchWise Chat</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="consultants">
            <ConsultantsTab />
          </TabsContent>

          <TabsContent value="matching">
            <AIMatchingPreview />
          </TabsContent>

          <TabsContent value="upload">
            <CVUploadForm 
              file={null}
              email=""
              fullName=""
              phoneNumber=""
              linkedinUrl=""
              agreeToTerms={false}
              isUploading={false}
              analysisResults={null}
              isAnalyzing={false}
              onFileChange={() => {}}
              onEmailChange={() => {}}
              onFullNameChange={() => {}}
              onPhoneNumberChange={() => {}}
              onLinkedinUrlChange={() => {}}
              onAgreeToTermsChange={() => {}}
              onSubmit={() => {}}
            />
          </TabsContent>

          <TabsContent value="chat">
            <MatchWiseChat />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
