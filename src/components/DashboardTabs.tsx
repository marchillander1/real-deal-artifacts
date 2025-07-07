
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConsultantsSection } from './dashboard/ConsultantsSection';
import { AssignmentsSection } from './dashboard/AssignmentsSection';
import { DashboardOverview } from './dashboard/DashboardOverview';
import { useSupabaseConsultantsWithDemo } from '@/hooks/useSupabaseConsultantsWithDemo';
import { useSupabaseAssignments } from '@/hooks/useSupabaseAssignments';
import { demoAssignments } from '@/data/demoAssignments';
import { Assignment } from '@/types/assignment';
import { Consultant } from '@/types/consultant';

export const DashboardTabs: React.FC = () => {
  const { consultants, isLoading: consultantsLoading } = useSupabaseConsultantsWithDemo();
  const { assignments: dbAssignments, loading: assignmentsLoading } = useSupabaseAssignments();
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  const handleMatch = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
  };

  const handleSelectConsultant = (consultant: Consultant) => {
    console.log('Selected consultant:', consultant);
  };

  // Convert database assignments to Assignment type format
  const formattedDbAssignments: Assignment[] = dbAssignments.map(assignment => ({
    id: assignment.id,
    title: assignment.title,
    description: assignment.description,
    company: assignment.company,
    clientLogo: assignment.client_logo || '🏢',
    requiredSkills: assignment.required_skills || [],
    workload: assignment.workload || 'Full-time',
    duration: assignment.duration || '6 months',
    budget: assignment.budget_min && assignment.budget_max 
      ? `${assignment.budget_min}-${assignment.budget_max} ${assignment.budget_currency}`
      : 'Not specified',
    remote: assignment.remote_type || 'Hybrid',
    urgency: assignment.urgency as 'Low' | 'Medium' | 'High',
    teamSize: assignment.team_size || '5-8 people',
    teamCulture: assignment.team_culture || '',
    industry: assignment.industry || 'Technology',
    status: assignment.status as 'open' | 'in_progress' | 'completed' | 'cancelled',
    createdAt: assignment.created_at || new Date().toISOString(),
    startDate: assignment.start_date || new Date().toISOString().split('T')[0],
    desiredCommunicationStyle: assignment.desired_communication_style || '',
    requiredValues: assignment.required_values || [],
    leadershipLevel: assignment.leadership_level || 3,
    teamDynamics: assignment.team_dynamics || ''
  }));

  // Combine database assignments with demo assignments
  const allAssignments: Assignment[] = [...formattedDbAssignments, ...demoAssignments];

  return (
    <div className="w-full">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="consultants">Consultants</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="ai-matches">AI Matches</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <DashboardOverview 
            consultants={consultants}
            assignments={allAssignments}
            onCreateAssignment={() => {}}
          />
        </TabsContent>
        
        <TabsContent value="consultants" className="space-y-6">
          <ConsultantsSection 
            consultants={consultants}
          />
        </TabsContent>
        
        <TabsContent value="assignments" className="space-y-6">
          <AssignmentsSection 
            assignments={allAssignments}
            onMatch={handleMatch}
            consultants={consultants}
          />
        </TabsContent>

        <TabsContent value="ai-matches" className="space-y-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">🤖 AI Matches</h2>
              <p className="text-gray-600">
                AI-powered consultant matching results and analytics
              </p>
            </div>
            
            {selectedAssignment ? (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Current Assignment: {selectedAssignment.title}
                  </h3>
                  <p className="text-blue-700">
                    {selectedAssignment.company} • {selectedAssignment.duration}
                  </p>
                </div>
                
                <AssignmentsSection 
                  assignments={[selectedAssignment]}
                  onMatch={handleMatch}
                  consultants={consultants}
                />
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <div className="text-6xl mb-4">🤖</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Select an Assignment to Start AI Matching
                </h3>
                <p className="text-gray-600 mb-6">
                  Go to the Assignments tab and click "Find AI Matches" on any assignment to see AI-powered matching results here.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="text-2xl mb-2">⚡</div>
                    <div className="text-sm font-medium">Lightning Fast</div>
                    <div className="text-xs text-gray-600">Results in seconds</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="text-2xl mb-2">🎯</div>
                    <div className="text-sm font-medium">Smart Matching</div>
                    <div className="text-xs text-gray-600">AI-powered precision</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="text-2xl mb-2">📊</div>
                    <div className="text-sm font-medium">Detailed Analysis</div>
                    <div className="text-xs text-gray-600">Complete insights</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
