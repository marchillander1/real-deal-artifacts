
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
        
        // Fetch ALL consultants from database (efter att vi tog bort network consultants är alla "existing")
        const { data: allData, error: fetchError } = await supabase
          .from('consultants')
          .select('*')
          .order('created_at', { ascending: false });

        if (fetchError) {
          throw fetchError;
        }

        console.log('🔍 Raw database consultants:', allData?.length || 0);

        // Map all consultants from database - alla ska vara "existing" nu
        const mappedConsultants: Consultant[] = (allData || []).map((c: any) => ({
          id: c.id,
          name: c.name || 'Unknown Name',
          email: c.email || '',
          phone: c.phone || '',
          location: c.location || 'Location not specified',
          skills: c.skills || [],
          experience: c.experience_years ? `${c.experience_years} years` : '5 years',
          rate: c.hourly_rate ? `${c.hourly_rate} SEK/hour` : '800 SEK/hour',
          availability: c.availability || 'Available',
          cv: c.cv_file_path || '',
          communicationStyle: c.communication_style || '',
          rating: c.rating || 4.8,
          projects: c.projects_completed || 0,
          lastActive: c.last_active || 'Recently',
          roles: c.roles || ['Consultant'],
          certifications: c.certifications || [],
          type: 'existing', // 🎯 CRITICAL: Alla konsulter från databasen är nu "existing"
          user_id: c.user_id, // Include user_id in the mapped data
          languages: c.languages || [],
          workStyle: c.work_style || '',
          values: c.values || [],
          personalityTraits: c.personality_traits || [],
          teamFit: c.team_fit || '',
          culturalFit: c.cultural_fit || 5,
          adaptability: c.adaptability || 5,
          leadership: c.leadership || 3,
          linkedinUrl: c.linkedin_url || '',
        }));

        console.log('🔍 Mapped consultants from DB:', mappedConsultants.length);

        // 🎯 CRITICAL: Set user_id for demo consultants so they appear under "My Consultants"
        const demoConsultantsWithUserId = myDemoConsultants.map(consultant => ({
          ...consultant,
          user_id: user?.id || 'demo-user-id', // Set to current user's ID
          type: 'existing' as const // Ensure they appear under "My Consultants"
        }));

        console.log('🔍 Demo consultants prepared:', demoConsultantsWithUserId.length);

        // Combine with demo consultants
        const allConsultants = [...mappedConsultants, ...demoConsultantsWithUserId];

        console.log('🔍 Final consultant counts:');
        console.log('📊 Total consultants:', allConsultants.length);
        console.log('📊 Network consultants (type=new):', allConsultants.filter(c => c.type === 'new').length);
        console.log('📊 My consultants (type=existing):', allConsultants.filter(c => c.type === 'existing').length);

        setConsultants(allConsultants);
      } catch (err) {
        console.error('❌ Error fetching consultants:', err);
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

  // Ta bort clearAllNetworkConsultants funktionen eftersom vi inte har network consultants längre
  const clearAllNetworkConsultants = async () => {
    console.log('🧹 No network consultants to clear - all consultants are now "My Consultants"');
    return { success: true, deletedCount: 0 };
  };

  return { consultants, isLoading, error, updateConsultant, clearAllNetworkConsultants };
};
