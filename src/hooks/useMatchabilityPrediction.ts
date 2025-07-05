
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface MatchabilityScore {
  totalScore: number;
  availableCandidates: number;
  matchQuality: 'High' | 'Medium' | 'Low';
  insights: string[];
  recommendations: string[];
}

export const useMatchabilityPrediction = () => {
  const [isPredicting, setIsPredicting] = useState(false);
  const [prediction, setPrediction] = useState<MatchabilityScore | null>(null);
  const { toast } = useToast();

  const predictMatchability = async (assignmentData: any) => {
    setIsPredicting(true);
    
    try {
      console.log('🎯 Analyzing assignment matchability...');
      
      const { data, error } = await supabase.functions.invoke('predict-matchability', {
        body: { assignmentData }
      });

      if (error) {
        console.error('Matchability prediction error:', error);
        throw new Error(error.message);
      }

      if (data && data.prediction) {
        setPrediction(data.prediction);
        toast({
          title: "Matchbarhet analyserad! 🎯",
          description: `${data.prediction.matchQuality} matchningspotential med ${data.prediction.availableCandidates} kandidater`
        });
        return data.prediction;
      }
      
    } catch (error) {
      console.error('Matchability prediction failed:', error);
      toast({
        title: "Matchbarhetsanalys misslyckades",
        description: "Kunde inte analysera matchningspotential",
        variant: "destructive"
      });
    } finally {
      setIsPredicting(false);
    }
  };

  const clearPrediction = () => {
    setPrediction(null);
  };

  return {
    predictMatchability,
    isPredicting,
    prediction,
    clearPrediction
  };
};
