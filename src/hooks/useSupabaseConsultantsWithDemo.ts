
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
      const transformedData: Consultant[] = (data || []).map(consultant => ({
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
        type: (consultant.type === 'existing' || consultant.type === 'new') ? consultant.type : 'existing',
        // Include analysis data for the analysis modal
        cvAnalysis: consultant.cv_analysis_data || consultant.analysis_results,
        linkedinAnalysis: consultant.linkedin_analysis_data
      }));

      // Combine with demo data
      const allConsultants = [
        ...transformedData,
        ...myDemoConsultants,
        ...demoConsultants
      ];

      setConsultants(allConsultants);
      setError(null);
    } catch (err: any) {
      console.error('Error in fetchConsultants:', err);
      setError(err.message || 'Failed to fetch consultants');
      // Fallback to demo data only
      setConsultants([...myDemoConsultants, ...demoConsultants]);
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
