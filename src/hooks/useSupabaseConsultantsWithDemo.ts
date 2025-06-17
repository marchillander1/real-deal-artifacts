
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Consultant } from '@/types/consultant';
import { demoConsultants } from '@/data/demoConsultants';
import { myDemoConsultants } from '@/data/myDemoConsultants';

export const useSupabaseConsultantsWithDemo = () => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  // Fetch real consultants from Supabase
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
    console.log('📊 Demo consultants:', demoConsultants.length);
    console.log('📊 My demo consultants:', myDemoConsultants.length);

    // Combine all consultants: Supabase + demo + my demo
    const allConsultants = [
      ...supabaseConsultants,
      ...demoConsultants,
      ...myDemoConsultants
    ];

    console.log('📊 Total combined consultants:', allConsultants.length);
    
    setConsultants(allConsultants);
    setIsLoading(isSupabaseLoading);
  }, [supabaseConsultants, isSupabaseLoading]);

  const updateConsultant = async (updatedConsultant: Consultant) => {
    console.log('🔄 Updating consultant:', updatedConsultant.id);
    
    // Check if this is a demo consultant (starts with string ID)
    if (typeof updatedConsultant.id === 'string' && (
        updatedConsultant.id.startsWith('1') || 
        updatedConsultant.id.startsWith('2') || 
        updatedConsultant.id.startsWith('3') ||
        updatedConsultant.id.startsWith('my-')
      )) {
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
        .eq('id', updatedConsultant.id);

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

  const clearAllNetworkConsultants = async () => {
    try {
      console.log('🔄 Clearing all network consultants...');
      
      // Delete all consultants with type 'new' from Supabase
      const { error, count } = await supabase
        .from('consultants')
        .delete()
        .eq('type', 'new');

      if (error) {
        console.error('❌ Error clearing network consultants:', error);
        throw error;
      }

      console.log('✅ Network consultants cleared:', count);
      
      // Invalidate and refetch to update the UI
      queryClient.invalidateQueries({ queryKey: ['consultants'] });
      
      return { deletedCount: count || 0 };
    } catch (error) {
      console.error('❌ Failed to clear network consultants:', error);
      throw error;
    }
  };

  return {
    consultants,
    isLoading,
    error,
    updateConsultant,
    clearAllNetworkConsultants
  };
};
