
import React from 'react';
import { ReportsOverview } from '@/components/reports/ReportsOverview';
import { useSupabaseConsultantsWithDemo } from '@/hooks/useSupabaseConsultantsWithDemo';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Reports: React.FC = () => {
  const { consultants } = useSupabaseConsultantsWithDemo();

  // Fetch assignments
  const { data: assignments = [] } = useQuery({
    queryKey: ['assignments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching assignments:', error);
        return [];
      }
      return data || [];
    },
  });

  // Fetch matches
  const { data: matches = [] } = useQuery({
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <ReportsOverview 
          consultants={consultants}
          assignments={assignments}
          matches={matches}
        />
      </div>
    </div>
  );
};

export default Reports;
