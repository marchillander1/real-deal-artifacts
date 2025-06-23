
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NotificationData {
  id: string;
  type: 'skill_alert' | 'new_assignment' | 'new_consultant';
  title: string;
  message: string;
  data?: any;
  created_at: string;
}

export const useRealTimeNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    console.log('🔔 Setting up real-time notifications...');

    // Create unique channel names using random UUIDs to avoid conflicts
    const generateChannelId = () => Math.random().toString(36).substring(2, 15);
    const assignmentChannelName = `notifications-assignments-${generateChannelId()}`;
    const consultantChannelName = `notifications-consultants-${generateChannelId()}`;
    const skillAlertChannelName = `notifications-skill-alerts-${generateChannelId()}`;

    // Listen to new assignments
    const assignmentsChannel = supabase
      .channel(assignmentChannelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'assignments'
        },
        (payload) => {
          console.log('🎯 New assignment detected:', payload.new);
          
          const newAssignment = payload.new as any;
          const notification: NotificationData = {
            id: `assignment-${newAssignment.id}`,
            type: 'new_assignment',
            title: 'New Assignment Available!',
            message: `"${newAssignment.title}" at ${newAssignment.company}`,
            data: newAssignment,
            created_at: new Date().toISOString()
          };

          setNotifications(prev => [notification, ...prev]);
          setUnreadCount(prev => prev + 1);

          toast({
            title: "🎯 New Assignment",
            description: `${newAssignment.title} at ${newAssignment.company}`,
          });
        }
      )
      .subscribe();

    // Listen to new consultants
    const consultantsChannel = supabase
      .channel(consultantChannelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'consultants'
        },
        (payload) => {
          console.log('👤 New consultant detected:', payload.new);
          
          const newConsultant = payload.new as any;
          const notification: NotificationData = {
            id: `consultant-${newConsultant.id}`,
            type: 'new_consultant',
            title: 'New Consultant Added!',
            message: `${newConsultant.name} joined ${newConsultant.type === 'existing' ? 'your team' : 'the network'}`,
            data: newConsultant,
            created_at: new Date().toISOString()
          };

          setNotifications(prev => [notification, ...prev]);
          setUnreadCount(prev => prev + 1);

          toast({
            title: "👤 New Consultant",
            description: `${newConsultant.name} has been added`,
          });
        }
      )
      .subscribe();

    // Listen to skill alerts matches
    const skillAlertsChannel = supabase
      .channel(skillAlertChannelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'analytics_events'
        },
        (payload) => {
          const event = payload.new as any;
          
          if (event.event_type === 'skill_alert_match') {
            console.log('🚨 Skill alert match:', event.event_data);
            
            const matchData = event.event_data;
            const notification: NotificationData = {
              id: `skill-alert-${event.id}`,
              type: 'skill_alert',
              title: 'Skill Alert Match! 🚨',
              message: `New assignment matches your skills: ${matchData.matched_skills?.join(', ')}`,
              data: matchData,
              created_at: new Date().toISOString()
            };

            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);

            toast({
              title: "🚨 Skill Alert",
              description: `Match found: ${matchData.assignment_title}`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      console.log('🔕 Cleaning up real-time subscriptions...');
      supabase.removeChannel(assignmentsChannel);
      supabase.removeChannel(consultantsChannel);
      supabase.removeChannel(skillAlertsChannel);
    };
  }, [toast]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    clearAll
  };
};
