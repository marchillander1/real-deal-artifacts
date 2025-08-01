
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAiMatching = () => {
  const [isMatching, setIsMatching] = useState(false);

  const performAiMatching = async (assignment: any) => {
    setIsMatching(true);
    
    try {
      console.log('🤖 Starting AI matching for assignment:', assignment.id);
      toast.info('🤖 AI is matching consultants...');
      
      const { data, error } = await supabase.functions.invoke('ai-matching', {
        body: { assignment }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message);
      }

      console.log('AI matching function response:', data);

      if (data && data.matches) {
        toast.success('AI matching complete!');
        return data;
      } else {
        throw new Error('AI matching failed - no matches returned');
      }
      
    } catch (error) {
      console.error('AI matching error:', error);
      const errorMessage = error instanceof Error ? error.message : 'AI matching failed';
      toast.error(`AI matching error: ${errorMessage}`);
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
