
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Consultant } from '@/types/consultant';
import { myDemoConsultants } from '@/data/myDemoConsultants';
import { demoConsultants } from '@/data/demoConsultants';

export const useSupabaseConsultantsWithDemo = () => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConsultants = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('consultants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching consultants:', error);
        setError(error.message);
        return;
      }

      // Transform Supabase data to match Consultant interface
      const transformedData: Consultant[] = (data || []).map(consultant => {
        // Determine consultant type based on user_id
        let consultantType: 'existing' | 'new' | 'my' | 'network' = 'network';
        
        if (consultant.user_id) {
          // Has user_id = belongs to someone's team (my consultant)
          consultantType = 'my';
        } else {
          // No user_id = network consultant (uploaded from /cv-upload)
          consultantType = 'network';
        }

        return {
          id: consultant.id.toString(),
          name: consultant.name,
          email: consultant.email,
          phone: consultant.phone || '',
          location: consultant.location || 'Sweden',
          skills: consultant.skills || [],
          certifications: consultant.certifications || [],
          languages: consultant.languages || [],
          roles: consultant.roles || [consultant.title] || ['Consultant'],
          values: consultant.values || [],
          experience: `${consultant.experience_years || 5} years experience`,
          rating: parseFloat(consultant.rating?.toString() || '5.0'),
          projects: consultant.projects_completed || 0,
          rate: `${consultant.hourly_rate || 800} SEK/h`,
          availability: consultant.availability || 'Available',
          lastActive: 'Today',
          communicationStyle: consultant.communication_style || 'Professional',
          workStyle: consultant.work_style || 'Collaborative',
          personalityTraits: consultant.personality_traits || [],
          teamFit: consultant.cultural_fit?.toString() || '4',
          adaptability: consultant.adaptability || 4,
          leadership: consultant.leadership || 3,
          type: consultantType,
          title: consultant.title || consultant.roles?.[0] || 'Consultant',
          // Include analysis data for the analysis modal
          cvAnalysis: consultant.cv_analysis_data || consultant.analysis_results,
          linkedinAnalysis: consultant.linkedin_analysis_data,
          // Include user_id and company_id for access control
          user_id: consultant.user_id,
          company_id: consultant.company_id
        };
      });

      // Add demo data with proper types
      const myDemoWithType = myDemoConsultants.map(c => ({ ...c, type: 'my' as const }));
      const networkDemoWithType = demoConsultants.map(c => ({ ...c, type: 'network' as const }));

      // Combine with demo data
      const allConsultants = [
        ...transformedData,
        ...myDemoWithType,
        ...networkDemoWithType
      ];

      console.log('📊 Consultant types breakdown:');
      console.log('- My Team:', allConsultants.filter(c => c.type === 'my' || c.type === 'existing').length);
      console.log('- Network:', allConsultants.filter(c => c.type === 'network' || c.type === 'new').length);
      console.log('- Total:', allConsultants.length);

      setConsultants(allConsultants);
      setError(null);
    } catch (err: any) {
      console.error('Error in fetchConsultants:', err);
      setError(err.message || 'Failed to fetch consultants');
      // Fallback to demo data only
      const myDemoWithType = myDemoConsultants.map(c => ({ ...c, type: 'my' as const }));
      const networkDemoWithType = demoConsultants.map(c => ({ ...c, type: 'network' as const }));
      setConsultants([...myDemoWithType, ...networkDemoWithType]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateConsultant = async (id: string | number, updates: Partial<Consultant>) => {
    try {
      const { error } = await supabase
        .from('consultants')
        .update({
          name: updates.name,
          email: updates.email,
          phone: updates.phone,
          location: updates.location,
          skills: updates.skills,
          hourly_rate: updates.rate ? parseInt(updates.rate.replace(/[^\d]/g, '')) : undefined,
          availability: updates.availability
        })
        .eq('id', id.toString());

      if (error) throw error;

      // Refresh the data
      fetchConsultants();
      return true;
    } catch (err: any) {
      console.error('Error updating consultant:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchConsultants();
  }, []);

  return {
    consultants,
    isLoading,
    error,
    updateConsultant,
    refetch: fetchConsultants
  };
};
