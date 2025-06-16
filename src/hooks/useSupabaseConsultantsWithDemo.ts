
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Consultant } from '@/types/consultant';
import { myDemoConsultants } from '@/data/myDemoConsultants';

export const useSupabaseConsultantsWithDemo = () => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        setIsLoading(true);
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        // Fetch network consultants (user_id IS NULL) - visible to everyone
        const { data: networkData, error: networkError } = await supabase
          .from('consultants')
          .select('*')
          .is('user_id', null)
          .order('rating', { ascending: false });

        if (networkError) {
          throw networkError;
        }

        let myData = [];
        
        // Fetch user's own consultants only if user is authenticated
        if (user) {
          const { data: userData, error: userError } = await supabase
            .from('consultants')
            .select('*')
            .eq('user_id', user.id)
            .order('rating', { ascending: false });

          if (userError) {
            throw userError;
          }
          
          myData = userData || [];
        }

        // Map network consultants
        const mappedNetworkConsultants: Consultant[] = (networkData || []).map((c: any) => ({
          id: c.id,
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
          type: 'new' as const,
          languages: c.languages || [],
          workStyle: c.work_style || '',
          values: c.values || [],
          personalityTraits: c.personality_traits || [],
          teamFit: c.team_fit || '',
          culturalFit: c.cultural_fit || 5,
          adaptability: c.adaptability || 5,
          leadership: c.leadership || 3,
          linkedinUrl: c.linkedin_url || ''
        }));

        // Map user's consultants
        const mappedUserConsultants: Consultant[] = myData.map((c: any) => ({
          id: c.id,
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
          type: 'existing' as const,
          languages: c.languages || [],
          workStyle: c.work_style || '',
          values: c.values || [],
          personalityTraits: c.personality_traits || [],
          teamFit: c.team_fit || '',
          culturalFit: c.cultural_fit || 5,
          adaptability: c.adaptability || 5,
          leadership: c.leadership || 3,
          linkedinUrl: c.linkedin_url || ''
        }));

        // Combine network consultants, user consultants, and demo consultants
        const allConsultants = [
          ...mappedNetworkConsultants,
          ...mappedUserConsultants,
          ...myDemoConsultants
        ];

        setConsultants(allConsultants);
      } catch (err) {
        console.error('Error fetching consultants:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConsultants();
  }, []);

  const updateConsultant = async (consultant: Consultant) => {
    try {
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
        .eq('id', String(consultant.id));

      if (error) throw error;

      // Update local state
      setConsultants(prev => 
        prev.map(c => c.id === consultant.id ? consultant : c)
      );
    } catch (err) {
      console.error('Error updating consultant:', err);
      throw err;
    }
  };

  return { consultants, isLoading, error, updateConsultant };
};
