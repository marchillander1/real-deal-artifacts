
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { AssignmentsSection } from '@/components/dashboard/AssignmentsSection';
import { useRealTimeTeamNotifications } from '@/hooks/useRealTimeTeamNotifications';
import { ConsultantsTab } from '@/components/ConsultantsTab';
import { SystemCheck } from '@/components/SystemCheck';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Navbar } from '@/components/Navbar';

export const Dashboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const activeTab = searchParams.get('tab') || 'overview';
  const success = searchParams.get('success');

  useRealTimeTeamNotifications();

  useEffect(() => {
    if (success === 'team-member-added') {
      toast({
        title: "🎉 Team member added successfully!",
        description: "The consultant has been added to your team's database",
      });
      
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
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', 'assignments');
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="consultants">Consultants</TabsTrigger>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
              <TabsTrigger value="system-check">System Check</TabsTrigger>
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

            <TabsContent value="system-check" className="space-y-6">
              <SystemCheck />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
