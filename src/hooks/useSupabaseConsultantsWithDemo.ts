
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Consultant } from '@/types/consultant';
import { myDemoConsultants } from '@/data/myDemoConsultants';

export const useSupabaseConsultantsWithDemo = () => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  // Fetch consultants from Supabase (both 'new' and 'existing')
  const { data: supabaseConsultants = [], isLoading: isSupabaseLoading, error } = useQuery({
    queryKey: ['consultants'],
    queryFn: async () => {
      console.log('🔄 Fetching consultants from Supabase...');
      
      const { data, error } = await supabase
        .from('consultants')
        .select('*');

      if (error) {
        console.error('❌ Error fetching consultants:', error);
        throw error;
      }

      console.log('✅ Supabase consultants fetched:', data?.length || 0);
      return (data || []).map(consultant => ({
        ...consultant,
        skills: consultant.skills || [],
        languages: consultant.languages || [],
        roles: consultant.roles || [],
        certifications: consultant.certifications || [],
        values: consultant.values || [],
        personalityTraits: consultant.personality_traits || [],
        communicationStyle: consultant.communication_style || '',
        workStyle: consultant.work_style || '',
        teamFit: consultant.team_fit || '',
        linkedinUrl: consultant.linkedin_url || '',
        experience: consultant.experience_years ? `${consultant.experience_years} years` : '',
        rate: consultant.hourly_rate ? `${consultant.hourly_rate} SEK/hour` : '',
        projects: consultant.projects_completed || 0,
        cv: consultant.cv_file_path || '',
        lastActive: consultant.last_active || 'Today',
        // Add missing required properties with default values
        culturalFit: consultant.cultural_fit || 5,
        adaptability: consultant.adaptability || 5,
        leadership: consultant.leadership || 3,
        // Add analysis data placeholders
        cvAnalysis: null,
        linkedinAnalysis: null
      })) as Consultant[];
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    console.log('🔄 Combining consultants...');
    console.log('📊 Supabase consultants:', supabaseConsultants.length);
    console.log('📊 My demo consultants:', myDemoConsultants.length);

    // Combine Supabase consultants + my demo consultants
    const allConsultants = [
      ...supabaseConsultants,
      ...myDemoConsultants
    ];

    console.log('📊 Total combined consultants:', allConsultants.length);
    
    setConsultants(allConsultants);
    setIsLoading(isSupabaseLoading);
  }, [supabaseConsultants, isSupabaseLoading]);

  const updateConsultant = async (updatedConsultant: Consultant) => {
    console.log('🔄 Updating consultant:', updatedConsultant.id);
    
    // Check if this is a demo consultant (starts with string ID)
    if (typeof updatedConsultant.id === 'string' && updatedConsultant.id.startsWith('my-')) {
      // Update locally for demo consultants
      setConsultants(prev => 
        prev.map(consultant => 
          consultant.id === updatedConsultant.id ? updatedConsultant : consultant
        )
      );
      return;
    }

    // Update in Supabase for real consultants
    try {
      const { error } = await supabase
        .from('consultants')
        .update({
          name: updatedConsultant.name,
          email: updatedConsultant.email,
          phone: updatedConsultant.phone,
          location: updatedConsultant.location,
          skills: updatedConsultant.skills,
          experience_years: parseInt(updatedConsultant.experience.split(' ')[0]) || 0,
          hourly_rate: parseInt(updatedConsultant.rate.split(' ')[0]) || 0,
          availability: updatedConsultant.availability,
          communication_style: updatedConsultant.communicationStyle,
          work_style: updatedConsultant.workStyle,
          languages: updatedConsultant.languages,
          roles: updatedConsultant.roles,
          certifications: updatedConsultant.certifications,
          values: updatedConsultant.values,
          personality_traits: updatedConsultant.personalityTraits,
          team_fit: updatedConsultant.teamFit,
          cultural_fit: updatedConsultant.culturalFit,
          adaptability: updatedConsultant.adaptability,
          leadership: updatedConsultant.leadership,
          linkedin_url: updatedConsultant.linkedinUrl,
          type: updatedConsultant.type,
          rating: updatedConsultant.rating,
          projects_completed: updatedConsultant.projects,
          last_active: updatedConsultant.lastActive
        })
        .eq('id', String(updatedConsultant.id));

      if (error) {
        console.error('❌ Error updating consultant:', error);
        throw error;
      }

      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['consultants'] });
      console.log('✅ Consultant updated successfully');
    } catch (error) {
      console.error('❌ Failed to update consultant:', error);
      throw error;
    }
  };

  return {
    consultants,
    isLoading,
    error,
    updateConsultant
  };
};
