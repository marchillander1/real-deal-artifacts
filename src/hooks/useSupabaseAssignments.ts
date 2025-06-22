
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Assignment } from '@/types/consultant';

export const useSupabaseAssignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading assignments:', error);
        setError('Failed to load assignments');
        return;
      }

      // Transform database data to Assignment interface with proper type casting
      const transformedAssignments: Assignment[] = (data || []).map(assignment => ({
        id: assignment.id,
        title: assignment.title,
        description: assignment.description,
        company: assignment.company,
        clientLogo: assignment.client_logo || '🏢',
        requiredSkills: assignment.required_skills || [],
        workload: assignment.workload || '',
        duration: assignment.duration || '',
        budget: assignment.budget_min && assignment.budget_max 
          ? `${assignment.budget_min}-${assignment.budget_max} ${assignment.budget_currency}`
          : 'Not specified',
        remote: assignment.remote_type || '',
        urgency: (assignment.urgency || 'Medium') as 'Low' | 'Medium' | 'High',
        teamSize: assignment.team_size || '',
        teamCulture: assignment.team_culture || '',
        industry: assignment.industry || '',
        status: assignment.status as 'open' | 'in_progress' | 'completed' | 'cancelled',
        createdAt: assignment.created_at,
        startDate: assignment.start_date,
        desiredCommunicationStyle: assignment.desired_communication_style,
        requiredValues: assignment.required_values || [],
        leadershipLevel: assignment.leadership_level || 3,
        teamDynamics: assignment.team_dynamics
      }));

      setAssignments(transformedAssignments);
      setError(null);
    } catch (err) {
      console.error('Error in loadAssignments:', err);
      setError('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const refetch = () => {
    loadAssignments();
  };

  return {
    assignments,
    loading,
    error,
    refetch,
    setAssignments
  };
};
