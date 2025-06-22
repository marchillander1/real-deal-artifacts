
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardOverview } from './dashboard/DashboardOverview';
import { AssignmentsSection } from './dashboard/AssignmentsSection';
import { ConsultantsSection } from './dashboard/ConsultantsSection';
import { NotificationsPanel } from './dashboard/NotificationsPanel';
import { SkillAlertsManager } from './SkillAlertsManager';

export const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">MatchWise Dashboard</h1>
          <p className="text-gray-600 mt-2">AI-powered consultant matching platform</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="assignments">Assignments</TabsTrigger>
                <TabsTrigger value="consultants">Consultants</TabsTrigger>
                <TabsTrigger value="alerts">Skill Alerts</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <DashboardOverview />
              </TabsContent>

              <TabsContent value="assignments" className="mt-6">
                <AssignmentsSection />
              </TabsContent>

              <TabsContent value="consultants" className="mt-6">
                <ConsultantsSection />
              </TabsContent>

              <TabsContent value="alerts" className="mt-6">
                <SkillAlertsManager />
              </TabsContent>
            </Tabs>
          </div>

          {/* Real-time Notifications Panel */}
          <div className="lg:col-span-1">
            <NotificationsPanel />
          </div>
        </div>
      </div>
    </div>
  );
};
