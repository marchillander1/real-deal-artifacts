
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Consultant } from '@/types/consultant';

export const useSupabaseConsultants = () => {
  return useQuery({
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

      // Transform Supabase data to match our Consultant interface
      return data.map((consultant: any) => ({
        id: parseInt(consultant.id.replace(/-/g, '').substring(0, 8), 16),
        name: consultant.name,
        skills: consultant.skills || [],
        experience: `${consultant.experience_years} år erfarenhet`,
        roles: consultant.roles || [],
        location: consultant.location || 'Stockholm',
        rate: `${consultant.hourly_rate} SEK/h`,
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
};
