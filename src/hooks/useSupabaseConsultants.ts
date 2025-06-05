
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Consultant } from '@/types/consultant';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export const useSupabaseConsultants = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const consultantsQuery = useQuery({
    queryKey: ['consultants'],
    queryFn: async (): Promise<Consultant[]> => {
      const { data, error } = await supabase
        .from('consultants')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching consultants:', error);
        throw error;
      }

      return data.map((consultant: any) => ({
        id: consultant.id,
        name: consultant.name,
        skills: consultant.skills || [],
        experience: `${consultant.experience_years || 0} years experience`,
        roles: consultant.roles || [],
        location: consultant.location || 'Stockholm',
        rate: `${consultant.hourly_rate || 0} SEK/h`,
        availability: consultant.availability || 'Available',
        phone: consultant.phone || '',
        email: consultant.email,
        projects: consultant.projects_completed || 0,
        rating: consultant.rating || 5.0,
        lastActive: consultant.last_active || 'Today',
        cv: consultant.cv_file_path || '',
        certifications: consultant.certifications || [],
        languages: consultant.languages || [],
        type: consultant.type as 'existing' | 'new',
        communicationStyle: consultant.communication_style || '',
        workStyle: consultant.work_style || '',
        values: consultant.values || [],
        personalityTraits: consultant.personality_traits || [],
        teamFit: consultant.team_fit || '',
        culturalFit: consultant.cultural_fit || 5,
        adaptability: consultant.adaptability || 5,
        leadership: consultant.leadership || 3,
      }));
    },
  });

  const createConsultantMutation = useMutation({
    mutationFn: async (consultantData: Partial<Consultant>) => {
      const experienceYears = consultantData.experience 
        ? parseInt(consultantData.experience.split(' ')[0]) || 0 
        : 0;
      
      const hourlyRate = consultantData.rate 
        ? parseInt(consultantData.rate.split(' ')[0]) || 0 
        : 0;

      const { data, error } = await supabase
        .from('consultants')
        .insert([{
          name: consultantData.name,
          email: consultantData.email,
          skills: consultantData.skills || [],
          experience_years: experienceYears,
          roles: consultantData.roles || [],
          location: consultantData.location,
          hourly_rate: hourlyRate,
          availability: consultantData.availability,
          phone: consultantData.phone,
          projects_completed: consultantData.projects || 0,
          rating: consultantData.rating || 5.0,
          certifications: consultantData.certifications || [],
          languages: consultantData.languages || [],
          type: consultantData.type || 'new',
          communication_style: consultantData.communicationStyle,
          work_style: consultantData.workStyle,
          values: consultantData.values || [],
          personality_traits: consultantData.personalityTraits || [],
          team_fit: consultantData.teamFit,
          cultural_fit: consultantData.culturalFit || 5,
          adaptability: consultantData.adaptability || 5,
          leadership: consultantData.leadership || 3,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultants'] });
      toast.success('Consultant added!');
    },
    onError: (error) => {
      console.error('Error creating consultant:', error);
      toast.error('Could not add consultant');
    },
  });

  const updateConsultantMutation = useMutation({
    mutationFn: async (consultantData: Consultant) => {
      const experienceYears = consultantData.experience 
        ? parseInt(consultantData.experience.split(' ')[0]) || 0 
        : 0;
      
      const hourlyRate = consultantData.rate 
        ? parseInt(consultantData.rate.split(' ')[0]) || 0 
        : 0;

      const { data, error } = await supabase
        .from('consultants')
        .update({
          name: consultantData.name,
          email: consultantData.email,
          skills: consultantData.skills,
          experience_years: experienceYears,
          roles: consultantData.roles,
          location: consultantData.location,
          hourly_rate: hourlyRate,
          availability: consultantData.availability,
          phone: consultantData.phone,
          projects_completed: consultantData.projects,
          rating: consultantData.rating,
          certifications: consultantData.certifications,
          languages: consultantData.languages,
          communication_style: consultantData.communicationStyle,
          work_style: consultantData.workStyle,
          values: consultantData.values,
          personality_traits: consultantData.personalityTraits,
          team_fit: consultantData.teamFit,
          cultural_fit: consultantData.culturalFit,
          adaptability: consultantData.adaptability,
          leadership: consultantData.leadership,
        })
        .eq('id', consultantData.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultants'] });
      toast.success('Consultant updated!');
    },
    onError: (error) => {
      console.error('Error updating consultant:', error);
      toast.error('Could not update consultant');
    },
  });

  return {
    consultants: consultantsQuery.data || [],
    isLoading: consultantsQuery.isLoading,
    error: consultantsQuery.error,
    createConsultant: createConsultantMutation.mutate,
    updateConsultant: updateConsultantMutation.mutate,
    isCreating: createConsultantMutation.isPending,
    isUpdating: updateConsultantMutation.isPending,
  };
};
