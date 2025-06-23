
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { ConsultantsSection } from '@/components/dashboard/ConsultantsSection';
import { AssignmentsSection } from '@/components/dashboard/AssignmentsSection';
import { useRealTimeTeamNotifications } from '@/hooks/useRealTimeTeamNotifications';
import { ConsultantsTab } from '@/components/ConsultantsTab';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

export const Dashboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const activeTab = searchParams.get('tab') || 'overview';
  const success = searchParams.get('success');

  // Enable real-time notifications
  useRealTimeTeamNotifications();

  useEffect(() => {
    // Show success message if redirected from CV upload
    if (success === 'team-member-added') {
      toast({
        title: "🎉 Team member added successfully!",
        description: "The consultant has been added to your team's database",
      });
      
      // Remove success param from URL
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('success');
      setSearchParams(newParams);
    }
  }, [success, searchParams, setSearchParams, toast]);

  const handleTabChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', value);
    setSearchParams(newParams);
  };

  const handleCreateAssignment = () => {
    // Navigate to assignments tab when creating a new assignment
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', 'assignments');
    setSearchParams(newParams);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="consultants">Consultants</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <DashboardOverview onCreateAssignment={handleCreateAssignment} />
        </TabsContent>
        
        <TabsContent value="consultants" className="space-y-6">
          <ConsultantsTab 
            showEditForNetwork={true}
            showDeleteForMyConsultants={true}
            showRemoveDuplicates={true}
          />
        </TabsContent>
        
        <TabsContent value="assignments" className="space-y-6">
          <AssignmentsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};
