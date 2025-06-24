
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConsultantsTab } from '@/components/ConsultantsTab';
import { AssignmentsTab } from '@/components/AssignmentsTab';
import { AnalyticsTab } from '@/components/AnalyticsTab';

export const DashboardTabs: React.FC = () => {
  return (
    <Tabs defaultValue="consultants" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="consultants">Consultants</TabsTrigger>
        <TabsTrigger value="assignments">Assignments</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>
      
      <TabsContent value="consultants" className="space-y-6">
        <ConsultantsTab />
      </TabsContent>
      
      <TabsContent value="assignments" className="space-y-6">
        <AssignmentsTab />
      </TabsContent>
      
      <TabsContent value="analytics" className="space-y-6">
        <AnalyticsTab />
      </TabsContent>
    </Tabs>
  );
};
