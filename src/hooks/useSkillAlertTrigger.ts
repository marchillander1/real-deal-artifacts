
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useSkillAlertTrigger = () => {
  const [isTriggering, setIsTriggering] = useState(false);
  const { toast } = useToast();

  const triggerSkillAlerts = async (consultant: any) => {
    if (!consultant) {
      console.warn('⚠️ No consultant provided to trigger skill alerts');
      return;
    }

    setIsTriggering(true);
    
    try {
      console.log('🔔 Triggering skill alerts for:', consultant.name);
      
      const { data, error } = await supabase.functions.invoke('check-skill-alerts', {
        body: { consultant }
      });

      if (error) {
        console.error('❌ Skill alert trigger error:', error);
        throw new Error(error.message);
      }

      if (data?.success) {
        console.log(`✅ Skill alerts processed: ${data.matchesFound} matches found, ${data.emailsSent} emails sent`);
        
        if (data.emailsSent > 0) {
          toast({
            title: "Skill alerts skickade! 📧",
            description: `${data.emailsSent} email-notifieringar skickades för matchande skills`,
          });
        }
        
        return data;
      }
      
    } catch (error) {
      console.error('❌ Skill alert trigger failed:', error);
      toast({
        title: "Skill alert misslyckades",
        description: "Kunde inte kontrollera skill alerts",
        variant: "destructive"
      });
    } finally {
      setIsTriggering(false);
    }
  };

  return {
    triggerSkillAlerts,
    isTriggering
  };
};
