
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { generateAdvancedAIMatches } from '@/utils/advancedMatchingEngine';
import { toast } from 'sonner';

export const useAdvancedAiMatching = () => {
  const [isMatching, setIsMatching] = useState(false);
  const [matchResults, setMatchResults] = useState<any[]>([]);

  const performAdvancedAiMatching = async (assignment: any, consultants: any[]) => {
    setIsMatching(true);
    
    try {
      console.log('🤖 Starting advanced AI matching for assignment:', assignment.id);
      toast.info('🧠 Avancerad AI-matchning pågår...', {
        description: 'Analyserar teknisk passform, kulturell alignment och framgångsprediktion'
      });
      
      // Use local advanced matching engine
      const matches = await generateAdvancedAIMatches(assignment, consultants);
      
      console.log('Advanced AI matching results:', matches);
      setMatchResults(matches);

      if (matches && matches.length > 0) {
        toast.success(`🎯 Avancerad AI-matchning klar!`, {
          description: `Hittade ${matches.length} kvalificerade kandidater med detaljerad analys`
        });
        return { matches };
      } else {
        toast.warning('Inga matchningar hittades', {
          description: 'Prova att justera kraven eller utöka sökområdet'
        });
        return { matches: [] };
      }
      
    } catch (error) {
      console.error('Advanced AI matching error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Avancerad AI-matchning misslyckades';
      toast.error(`AI-matchningsfel: ${errorMessage}`);
      throw error;
    } finally {
      setIsMatching(false);
    }
  };

  const clearMatchResults = () => {
    setMatchResults([]);
  };

  return {
    performAdvancedAiMatching,
    isMatching,
    matchResults,
    clearMatchResults
  };
};
