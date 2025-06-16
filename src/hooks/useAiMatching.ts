
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAiMatching = () => {
  const [isMatching, setIsMatching] = useState(false);

  const performAiMatching = async (assignmentId: string) => {
    setIsMatching(true);
    
    try {
      console.log('🤖 Starting AI matching for assignment:', assignmentId);
      toast.info('🤖 AI matchar konsulter...');
      
      const { data, error } = await supabase.functions.invoke('ai-matching', {
        body: { assignmentId }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message);
      }

      console.log('AI matching function response:', data);

      if (data && data.success) {
        toast.success(data.message || 'AI-matchning klar!');
        return data;
      } else {
        throw new Error(data?.error || 'AI-matchning misslyckades');
      }
      
    } catch (error) {
      console.error('AI matching error:', error);
      const errorMessage = error instanceof Error ? error.message : 'AI-matchning misslyckades';
      toast.error(`Fel vid AI-matchning: ${errorMessage}`);
      throw error;
    } finally {
      setIsMatching(false);
    }
  };

  return {
    performAiMatching,
    isMatching
  };
};
