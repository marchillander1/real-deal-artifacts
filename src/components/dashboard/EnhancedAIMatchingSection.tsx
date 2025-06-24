import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Target, TrendingUp } from 'lucide-react';
import { useAdvancedAiMatching } from '@/hooks/useAdvancedAiMatching';
import { AdvancedAIMatchResults } from '@/components/AdvancedAIMatchResults';
import { useSupabaseConsultants } from '@/hooks/useSupabaseConsultants';

interface EnhancedAIMatchingSectionProps {
  selectedAssignment: any;
  onSelectConsultant: (consultant: any) => void;
}

export const EnhancedAIMatchingSection: React.FC<EnhancedAIMatchingSectionProps> = ({
  selectedAssignment,
  onSelectConsultant
}) => {
  const { performAdvancedAiMatching, isMatching, matchResults } = useAdvancedAiMatching();
  const { consultants } = useSupabaseConsultants();
  const [showResults, setShowResults] = useState(false);

  const handleAdvancedMatching = async () => {
    if (!selectedAssignment) return;
    
    try {
      const result = await performAdvancedAiMatching(selectedAssignment, consultants);
      if (result.matches.length > 0) {
        setShowResults(true);
      }
    } catch (error) {
      console.error('Advanced matching failed:', error);
    }
  };

  if (showResults && matchResults.length > 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => setShowResults(false)}
          >
            ← Tillbaka till matchning
          </Button>
          
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            <Brain className="h-4 w-4 mr-1" />
            Avancerad AI-analys aktiverad
          </Badge>
        </div>
        
        <AdvancedAIMatchResults
          matches={matchResults}
          assignment={selectedAssignment}
          onSelectConsultant={onSelectConsultant}
        />
      </div>
    );
  }

  return (
    <Card className="border-l-4 border-l-purple-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-purple-600" />
          Avancerad AI-matchning
        </CardTitle>
        <p className="text-sm text-gray-600">
          Använd vår mest avancerade AI för djupgående kandidatanalys med framgångsprediktion
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Target className="h-4 w-4 text-blue-500" />
              <span>Multi-dimensionell matchning</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span>Framgångsprediktion</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span>Riskanalys & mitigation</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Brain className="h-4 w-4 text-purple-500" />
              <span>Kulturell passformsanalys</span>
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="pt-4 border-t">
          <Button 
            onClick={handleAdvancedMatching}
            disabled={!selectedAssignment || isMatching}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            size="lg"
          >
            {isMatching ? (
              <>
                <Brain className="h-5 w-5 mr-2 animate-pulse" />
                Analyserar kandidater...
              </>
            ) : (
              <>
                <Brain className="h-5 w-5 mr-2" />
                Starta avancerad AI-matchning
              </>
            )}
          </Button>
          
          {!selectedAssignment && (
            <p className="text-xs text-gray-500 mt-2 text-center">
              Välj ett uppdrag för att starta matchning
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
