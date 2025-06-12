
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Consultant } from '@/types/consultant';

export const useSupabaseConsultantsDedup = () => {
  const queryClient = useQueryClient();

  const { data: consultants = [], isLoading } = useQuery({
    queryKey: ['consultants-deduped'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('consultants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Remove duplicates based on email
      const seen = new Set();
      const deduped = data.filter((consultant: any) => {
        if (seen.has(consultant.email)) {
          return false;
        }
        seen.add(consultant.email);
        return true;
      });

      console.log(`Original count: ${data.length}, After dedup: ${deduped.length}`);

      return deduped.map((c: any) => ({
        id: c.id, // Keep as string since Supabase uses UUID
        name: c.name,
        email: c.email,
        phone: c.phone || '',
        location: c.location || '',
        skills: c.skills || [],
        experience: c.experience_years?.toString() || '',
        rate: c.hourly_rate?.toString() || '',
        availability: c.availability || 'Available',
        cv: c.cv_file_path || '',
        communicationStyle: c.communication_style || '',
        rating: c.rating || 4.8,
        projects: c.projects_completed || 0,
        lastActive: c.last_active || 'Recently',
        roles: c.roles || [],
        certifications: c.certifications || [],
        type: c.type || 'new',
        languages: c.languages || [],
        workStyle: c.work_style || '',
        values: c.values || [],
        personalityTraits: c.personality_traits || [],
        teamFit: c.team_fit || '',
        culturalFit: c.cultural_fit || 5,
        adaptability: c.adaptability || 5,
        leadership: c.leadership || 3,
        linkedinUrl: c.linkedin_url || ''
      })) as Consultant[];
    },
  });

  const updateConsultant = async (consultant: Consultant) => {
    const { error } = await supabase
      .from('consultants')
      .update({
        name: consultant.name,
        email: consultant.email,
        phone: consultant.phone,
        location: consultant.location,
        skills: consultant.skills,
        experience_years: consultant.experience ? parseInt(consultant.experience) : null,
        hourly_rate: consultant.rate ? parseInt(consultant.rate) : null,
        availability: consultant.availability,
        cv_file_path: consultant.cv,
        communication_style: consultant.communicationStyle,
      })
      .eq('id', consultant.id); // consultant.id is now a string

    if (error) throw error;

    queryClient.invalidateQueries({ queryKey: ['consultants-deduped'] });
  };

  const removeDuplicates = async () => {
    const { data: allConsultants, error } = await supabase
      .from('consultants')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Group by email
    const emailGroups = allConsultants.reduce((acc: any, consultant: any) => {
      if (!acc[consultant.email]) {
        acc[consultant.email] = [];
      }
      acc[consultant.email].push(consultant);
      return acc;
    }, {});

    // Delete duplicates (keep the most recent one)
    for (const email in emailGroups) {
      const group = emailGroups[email];
      if (group.length > 1) {
        const toDelete = group.slice(1); // Keep first (most recent), delete rest
        const idsToDelete = toDelete.map((c: any) => c.id);
        
        console.log(`Deleting ${idsToDelete.length} duplicates for ${email}`);
        
        const { error: deleteError } = await supabase
          .from('consultants')
          .delete()
          .in('id', idsToDelete);

        if (deleteError) {
          console.error('Error deleting duplicates:', deleteError);
        }
      }
    }

    queryClient.invalidateQueries({ queryKey: ['consultants-deduped'] });
  };

  return {
    consultants,
    isLoading,
    updateConsultant,
    removeDuplicates
  };
};
