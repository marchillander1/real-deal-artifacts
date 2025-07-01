
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, TrendingUp, Clock, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Consultant } from '@/types/consultant';
import { Assignment } from '@/types/assignment';
import { ActivityFeed } from './ActivityFeed';
import { AIInsightsSection } from './AIInsightsSection';
import { PredictiveAnalytics } from './PredictiveAnalytics';
import { SmartRecommendations } from './SmartRecommendations';

interface DashboardOverviewProps {
  onCreateAssignment: () => void;
  consultants: Consultant[];
  assignments: Assignment[];
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ 
  onCreateAssignment, 
  consultants, 
  assignments 
}) => {
  // Fetch matches data
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

  const myConsultants = consultants.filter(c => c.type === 'existing');
  const networkConsultants = consultants.filter(c => c.type === 'new');
  const totalConsultants = consultants.length;
  const successfulMatches = matchesData.filter(match => match.status === 'accepted').length;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Consultants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConsultants}</div>
            <p className="text-xs text-muted-foreground">
              My: {myConsultants.length}, Network: {networkConsultants.length}
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
            <CardTitle className="text-sm font-medium">Average Match Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 seconds</div>
            <p className="text-xs text-muted-foreground">
              67% faster
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Section */}
      <AIInsightsSection 
        consultants={consultants}
        assignments={assignments}
        onCreateAssignment={onCreateAssignment}
      />

      {/* Smart Recommendations */}
      <SmartRecommendations
        consultants={consultants}
        assignments={assignments}
        onCreateAssignment={onCreateAssignment}
      />

      {/* Predictive Analytics */}
      <PredictiveAnalytics
        consultants={consultants}
        assignments={assignments}
      />

      {/* Main CTA */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">Ready to find the perfect consultant?</h3>
            <p className="text-gray-600">Create a new assignment and let AI match you with the best candidates</p>
            <Button 
              onClick={onCreateAssignment}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Assignment
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Activity Feed */}
      <ActivityFeed consultants={consultants} assignments={assignments} />
    </div>
  );
};
