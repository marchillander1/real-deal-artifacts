
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Consultant } from '@/types/consultant';
import { myDemoConsultants } from '@/data/myDemoConsultants';
import { demoConsultants } from '@/data/demoConsultants';

export const useSupabaseConsultantsWithDemo = () => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadConsultants = async () => {
    try {
      // Get current user's profile to get company info
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // If no user, show demo data
        const demoData = [
          ...myDemoConsultants.map(c => ({ ...c, type: 'existing' as const })),
          ...demoConsultants.map(c => ({ ...c, type: 'new' as const }))
        ];
        setConsultants(demoData);
        setIsLoading(false);
        return;
      }

      // Get user's profile to determine company
      const { data: profile } = await supabase
        .from('profiles')
        .select('company')
        .eq('id', user.id)
        .single();

      // Load consultants with team sharing logic
      const { data: supabaseConsultants, error } = await supabase
        .from('consultants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading consultants:', error);
        throw error;
      }

      // Transform Supabase data to match Consultant interface
      const transformedConsultants: Consultant[] = (supabaseConsultants || []).map(consultant => ({
        id: consultant.id,
        name: consultant.name,
        email: consultant.email,
        phone: consultant.phone || '',
        location: consultant.location || 'Unknown',
        skills: consultant.skills || [],
        certifications: consultant.certifications || [],
        languages: consultant.languages || [],
        roles: consultant.roles || ['Consultant'],
        experience: consultant.experience_years ? `${consultant.experience_years} years` : '0 years',
        projects: consultant.projects_completed || 0,
        rate: consultant.hourly_rate ? `${consultant.hourly_rate} SEK/h` : '0 SEK/h',
        rating: consultant.rating || 5.0,
        availability: consultant.availability || 'Available',
        lastActive: consultant.last_active || 'Today',
        values: consultant.values || [],
        personalityTraits: consultant.personality_traits || [],
        workStyle: consultant.work_style || '',
        communicationStyle: consultant.communication_style || '',
        teamFit: consultant.team_fit || '',
        // Determine type based on user_id and company_id
        type: (() => {
          // Network consultants (no user_id)
          if (!consultant.user_id) return 'new';
          
          // Own consultants
          if (consultant.user_id === user.id) return 'existing';
          
          // Team consultants (same company)
          if (profile?.company && consultant.company_id === profile.company) {
            return 'existing';
          }
          
          // Default to network for others
          return 'new';
        })(),
        cvAnalysis: consultant.cv_analysis_data ? {
          analysis: consultant.cv_analysis_data
        } : undefined,
        linkedinAnalysis: consultant.linkedin_analysis_data ? {
          analysis: consultant.linkedin_analysis_data
        } : undefined,
      }));

      // Add demo data for demonstration
      const demoData = [
        ...myDemoConsultants.map(c => ({ ...c, type: 'existing' as const })),
        ...demoConsultants.map(c => ({ ...c, type: 'new' as const }))
      ];

      setConsultants([...transformedConsultants, ...demoData]);
    } catch (error: any) {
      console.error('Error loading consultants:', error);
      toast({
        title: "Error loading consultants",
        description: error.message || "Failed to load consultant data",
        variant: "destructive",
      });

      // Fallback to demo data
      const demoData = [
        ...myDemoConsultants.map(c => ({ ...c, type: 'existing' as const })),
        ...demoConsultants.map(c => ({ ...c, type: 'new' as const }))
      ];
      setConsultants(demoData);
    } finally {
      setIsLoading(false);
    }
  };

  // Set up real-time notifications
  useEffect(() => {
    loadConsultants();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('consultants-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'consultants'
        },
        (payload) => {
          console.log('Real-time consultant change:', payload);
          
          // Show toast notification for new consultants
          if (payload.eventType === 'INSERT' && payload.new) {
            toast({
              title: "New consultant added!",
              description: `${payload.new.name} has been added to the team database`,
            });
          }
          
          // Reload consultants to get fresh data
          loadConsultants();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateConsultant = async (updatedConsultant: Consultant) => {
    try {
      const consultantId = String(updatedConsultant.id);
      
      // Skip demo consultants
      if (consultantId.startsWith('my-') || consultantId.startsWith('demo-')) {
        setConsultants(prev => 
          prev.map(c => c.id === updatedConsultant.id ? updatedConsultant : c)
        );
        return;
      }

      // Get current user for company_id
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('company')
        .eq('id', user.id)
        .single();

      const { error } = await supabase
        .from('consultants')
        .update({
          name: updatedConsultant.name,
          email: updatedConsultant.email,
          phone: updatedConsultant.phone,
          location: updatedConsultant.location,
          skills: updatedConsultant.skills,
          certifications: updatedConsultant.certifications,
          languages: updatedConsultant.languages,
          roles: updatedConsultant.roles,
          experience_years: parseInt(updatedConsultant.experience) || 0,
          projects_completed: updatedConsultant.projects,
          hourly_rate: parseInt(updatedConsultant.rate.replace(/[^\d]/g, '')) || 0,
          rating: updatedConsultant.rating,
          availability: updatedConsultant.availability,
          values: updatedConsultant.values,
          personality_traits: updatedConsultant.personalityTraits,
          work_style: updatedConsultant.workStyle,
          communication_style: updatedConsultant.communicationStyle,
          team_fit: updatedConsultant.teamFit,
          company_id: profile?.company,
          updated_at: new Date().toISOString(),
        })
        .eq('id', consultantId);

      if (error) {
        throw error;
      }

      toast({
        title: "Consultant updated",
        description: "The consultant profile has been successfully updated",
      });

      // Update local state
      setConsultants(prev => 
        prev.map(c => c.id === updatedConsultant.id ? updatedConsultant : c)
      );

    } catch (error: any) {
      console.error('Error updating consultant:', error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update consultant",
        variant: "destructive",
      });
    }
  };

  return { consultants, isLoading, updateConsultant, reloadConsultants: loadConsultants };
};
