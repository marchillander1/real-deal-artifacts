
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConsultantsSection } from './dashboard/ConsultantsSection';
import { AssignmentsSection } from './dashboard/AssignmentsSection';
import { DashboardOverview } from './dashboard/DashboardOverview';
import { CVUploadSection } from './dashboard/CVUploadSection';

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'consultants' | 'assignments'>('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">MatchWise AI Platform</h1>
          <p className="text-gray-600 mt-1">
            Advanced AI-powered consultant matching platform
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="overview">Dashboard Overview</TabsTrigger>
            <TabsTrigger value="consultants">Consultants</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <DashboardOverview />
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
};
