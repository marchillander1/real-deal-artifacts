
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface AutocompletionSuggestion {
  field: string;
  suggestions: string[];
  confidence: number;
}

export const useAIAutocompletions = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<AutocompletionSuggestion[]>([]);
  const { toast } = useToast();

  const generateSuggestions = async (assignmentData: any) => {
    setIsGenerating(true);
    
    try {
      console.log('🤖 Generating AI autocompletions for assignment...');
      
      const { data, error } = await supabase.functions.invoke('ai-autocompletions', {
        body: { 
          assignmentData,
          fields: ['requiredSkills', 'teamCulture', 'desiredCommunicationStyle']
        }
      });

      if (error) {
        console.error('AI autocompletion error:', error);
        throw new Error(error.message);
      }

      if (data && data.suggestions) {
        setSuggestions(data.suggestions);
        toast({
          title: "AI-förslag genererade! 🤖",
          description: `Hittade ${data.suggestions.length} smarta förslag för ditt uppdrag`
        });
        return data.suggestions;
      }
      
    } catch (error) {
      console.error('Autocompletion generation failed:', error);
      toast({
        title: "AI-förslag misslyckades",
        description: "Kunde inte generera förslag just nu",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const clearSuggestions = () => {
    setSuggestions([]);
  };

  return {
    generateSuggestions,
    isGenerating,
    suggestions,
    clearSuggestions
  };
};
