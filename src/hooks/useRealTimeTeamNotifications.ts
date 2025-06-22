
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useRealTimeTeamNotifications = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Subscribe to consultant changes for team notifications
    const consultantsChannel = supabase
      .channel('team-consultant-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'consultants'
        },
        (payload) => {
          if (payload.new) {
            const consultant = payload.new;
            
            // Only show notification if it's not from the current user
            supabase.auth.getUser().then(({ data: { user } }) => {
              if (user && consultant.user_id !== user.id) {
                toast({
                  title: "🎉 New team member added!",
                  description: `${consultant.name} has been added to your team's consultant database`,
                });
              }
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'consultants'
        },
        (payload) => {
          if (payload.new && payload.old) {
            const consultant = payload.new;
            const oldConsultant = payload.old;
            
            // Show notification for availability changes
            if (consultant.availability !== oldConsultant.availability && 
                consultant.availability?.includes('Available')) {
              
              supabase.auth.getUser().then(({ data: { user } }) => {
                if (user && consultant.user_id !== user.id) {
                  toast({
                    title: "🟢 Consultant now available!",
                    description: `${consultant.name} is now ${consultant.availability}`,
                  });
                }
              });
            }
          }
        }
      )
      .subscribe();

    // Subscribe to assignment changes
    const assignmentsChannel = supabase
      .channel('team-assignment-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'assignments'
        },
        (payload) => {
          if (payload.new) {
            const assignment = payload.new;
            
            supabase.auth.getUser().then(({ data: { user } }) => {
              if (user && assignment.created_by !== user.id) {
                toast({
                  title: "📋 New assignment created!",
                  description: `"${assignment.title}" has been added by a team member`,
                });
              }
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(consultantsChannel);
      supabase.removeChannel(assignmentsChannel);
    };
  }, [toast]);
};
