
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Briefcase, Clock, Plus } from 'lucide-react';
import { DashboardOverview } from './dashboard/DashboardOverview';
import { ConsultantsSection } from './dashboard/ConsultantsSection';
import { AssignmentsSection } from './dashboard/AssignmentsSection';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">MatchWise AI</h1>
          <p className="text-gray-600">AI-driven consultant matching platform</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="consultants">Consultants</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardOverview onCreateAssignment={() => setActiveTab('assignments')} />
          </TabsContent>

          <TabsContent value="consultants">
            <ConsultantsSection />
          </TabsContent>

          <TabsContent value="assignments">
            <AssignmentsSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
