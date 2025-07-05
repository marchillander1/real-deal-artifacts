
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Lightbulb, CheckCircle } from 'lucide-react';

interface AutocompletionSuggestion {
  field: string;
  suggestions: string[];
  confidence: number;
}

interface AIAutocompletionSuggestionsProps {
  suggestions: AutocompletionSuggestion[];
  onApplySuggestion: (field: string, value: string) => void;
  isGenerating: boolean;
}

export const AIAutocompletionSuggestions: React.FC<AIAutocompletionSuggestionsProps> = ({
  suggestions,
  onApplySuggestion,
  isGenerating
}) => {
  const getFieldDisplayName = (field: string) => {
    switch (field) {
      case 'requiredSkills': return 'Föreslagna kompetenser';
      case 'teamCulture': return 'Teamkultur';
      case 'desiredCommunicationStyle': return 'Kommunikationsstil';
      default: return field;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (isGenerating) {
    return (
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-blue-600 animate-pulse" />
            <span className="text-sm text-gray-600">AI genererar smarta förslag...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (suggestions.length === 0) return null;

  return (
    <Card className="border-l-4 border-l-purple-500">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="h-5 w-5 text-purple-600" />
          AI-förslag för ditt uppdrag
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">
                {getFieldDisplayName(suggestion.field)}
              </h4>
              <Badge 
                className={getConfidenceColor(suggestion.confidence)}
                variant="secondary"
              >
                {Math.round(suggestion.confidence * 100)}% säkerhet
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestion.suggestions.map((item, itemIndex) => (
                <Button
                  key={itemIndex}
                  variant="outline"
                  size="sm"
                  onClick={() => onApplySuggestion(suggestion.field, item)}
                  className="text-xs hover:bg-purple-50 hover:border-purple-300"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {item}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
