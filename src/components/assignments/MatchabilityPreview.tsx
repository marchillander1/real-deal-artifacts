
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, Users, TrendingUp, AlertCircle } from 'lucide-react';

interface MatchabilityScore {
  totalScore: number;
  availableCandidates: number;
  matchQuality: 'High' | 'Medium' | 'Low';
  insights: string[];
  recommendations: string[];
}

interface MatchabilityPreviewProps {
  prediction: MatchabilityScore | null;
  isPredicting: boolean;
}

export const MatchabilityPreview: React.FC<MatchabilityPreviewProps> = ({
  prediction,
  isPredicting
}) => {
  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'High': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isPredicting) {
    return (
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-600 animate-pulse" />
            <span className="text-sm text-gray-600">Analyserar matchningspotential...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!prediction) return null;

  return (
    <Card className="border-l-4 border-l-green-500">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Target className="h-5 w-5 text-green-600" />
          Matchbarhetsanalys
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score Overview */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Matchningspoäng</span>
              <span className={`text-lg font-bold ${getScoreColor(prediction.totalScore)}`}>
                {prediction.totalScore}/100
              </span>
            </div>
            <Progress value={prediction.totalScore} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Tillgängliga kandidater</span>
            </div>
            <span className="text-2xl font-bold text-blue-600">
              {prediction.availableCandidates}
            </span>
          </div>
        </div>

        {/* Quality Badge */}
        <div className="flex items-center gap-2">
          <Badge className={getQualityColor(prediction.matchQuality)} variant="secondary">
            <TrendingUp className="h-3 w-3 mr-1" />
            {prediction.matchQuality} matchningskvalitet
          </Badge>
        </div>

        {/* Insights */}
        {prediction.insights.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Insikter</h4>
            <ul className="space-y-1">
              {prediction.insights.map((insight, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                  <AlertCircle className="h-3 w-3 mt-0.5 text-blue-500 flex-shrink-0" />
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendations */}
        {prediction.recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Rekommendationer</h4>
            <ul className="space-y-1">
              {prediction.recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                  <TrendingUp className="h-3 w-3 mt-0.5 text-green-500 flex-shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
