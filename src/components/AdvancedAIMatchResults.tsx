
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Star, 
  MapPin, 
  Clock, 
  Brain,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Target,
  Users,
  MessageSquare,
  Award,
  Lightbulb,
  BarChart3
} from 'lucide-react';

interface AdvancedMatchResult {
  consultant: any;
  technicalFit: number;
  culturalFit: number;
  experienceMatch: number;
  availabilityScore: number;
  communicationFit: number;
  industryExperience: number;
  totalMatchScore: number;
  confidenceLevel: number;
  matchedSkills: string[];
  matchedValues: string[];
  strengthAreas: string[];
  developmentAreas: string[];
  matchReasoning: string;
  riskFactors: string[];
  successPrediction: number;
  estimatedOnboardingTime: string;
  culturalAdaptation: number;
}

interface AdvancedAIMatchResultsProps {
  matches: AdvancedMatchResult[];
  assignment: any;
  onSelectConsultant: (consultant: any) => void;
}

export const AdvancedAIMatchResults: React.FC<AdvancedAIMatchResultsProps> = ({
  matches,
  assignment,
  onSelectConsultant
}) => {
  const getMatchQuality = (score: number) => {
    if (score >= 90) return { label: 'Excellent', color: 'bg-green-500', textColor: 'text-green-700' };
    if (score >= 80) return { label: 'Mycket bra', color: 'bg-blue-500', textColor: 'text-blue-700' };
    if (score >= 70) return { label: 'Bra', color: 'bg-yellow-500', textColor: 'text-yellow-700' };
    return { label: 'Godkänd', color: 'bg-gray-500', textColor: 'text-gray-700' };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">
          AI-matchning: {matches.length} kandidater hittades
        </h3>
        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
          <Brain className="h-4 w-4 mr-1" />
          Avancerad AI-analys
        </Badge>
      </div>

      <div className="grid gap-6">
        {matches.map((match, index) => {
          const matchQuality = getMatchQuality(match.totalMatchScore);
          
          return (
            <Card key={match.consultant.id} className="overflow-hidden border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">{match.consultant.name}</CardTitle>
                        <Badge className={`${matchQuality.color} text-white`}>
                          #{index + 1} Match
                        </Badge>
                        <Badge variant="outline" className={matchQuality.textColor}>
                          {match.totalMatchScore}% match
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{match.consultant.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span>{match.consultant.rating}/5</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{match.consultant.availability}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-3">{match.matchReasoning}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {match.successPrediction}%
                    </div>
                    <div className="text-xs text-gray-500">Success Prediction</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Match Score Breakdown */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Teknisk passform</span>
                      <span className="font-medium">{match.technicalFit}%</span>
                    </div>
                    <Progress value={match.technicalFit} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Kulturell passform</span>
                      <span className="font-medium">{match.culturalFit}%</span>
                    </div>
                    <Progress value={match.culturalFit} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Erfarenhetsmatch</span>
                      <span className="font-medium">{match.experienceMatch}%</span>
                    </div>
                    <Progress value={match.experienceMatch} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Tillgänglighet</span>
                      <span className="font-medium">{match.availabilityScore}%</span>
                    </div>
                    <Progress value={match.availabilityScore} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Kommunikation</span>
                      <span className="font-medium">{match.communicationFit}%</span>
                    </div>
                    <Progress value={match.communicationFit} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Branschkännedom</span>
                      <span className="font-medium">{match.industryExperience}%</span>
                    </div>
                    <Progress value={match.industryExperience} className="h-2" />
                  </div>
                </div>

                {/* Matched Skills and Values */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Matchade färdigheter ({match.matchedSkills.length})
                    </h5>
                    <div className="flex flex-wrap gap-1">
                      {match.matchedSkills.slice(0, 6).map((skill, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs bg-green-100 text-green-800">
                          {skill}
                        </Badge>
                      ))}
                      {match.matchedSkills.length > 6 && (
                        <Badge variant="outline" className="text-xs">
                          +{match.matchedSkills.length - 6} fler
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2 flex items-center">
                      <Users className="h-4 w-4 mr-2 text-blue-500" />
                      Gemensamma värderingar ({match.matchedValues.length})
                    </h5>
                    <div className="flex flex-wrap gap-1">
                      {match.matchedValues.map((value, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                          {value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Strengths and Development Areas */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2 flex items-center">
                      <Award className="h-4 w-4 mr-2 text-purple-500" />
                      Styrkor
                    </h5>
                    <ul className="space-y-1">
                      {match.strengthAreas.map((strength, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start">
                          <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {match.developmentAreas.length > 0 && (
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2 flex items-center">
                        <Lightbulb className="h-4 w-4 mr-2 text-orange-500" />
                        Utvecklingsområden
                      </h5>
                      <ul className="space-y-1">
                        {match.developmentAreas.map((area, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start">
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {area}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Risk Factors */}
                {match.riskFactors.length > 0 && (
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <h5 className="font-medium text-gray-700 mb-2 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
                      Riskfaktorer att beakta
                    </h5>
                    <ul className="space-y-1">
                      {match.riskFactors.map((risk, idx) => (
                        <li key={idx} className="text-sm text-yellow-700 flex items-start">
                          <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Key Metrics */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-blue-600">{match.confidenceLevel}%</div>
                      <div className="text-xs text-gray-600">Säkerhetsnivå</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-purple-600">{match.estimatedOnboardingTime}</div>
                      <div className="text-xs text-gray-600">Uppstartstid</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-600">{match.culturalAdaptation}%</div>
                      <div className="text-xs text-gray-600">Kulturell anpassning</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-orange-600">{match.consultant.rate}</div>
                      <div className="text-xs text-gray-600">Timkostnad</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    onClick={() => onSelectConsultant(match.consultant)}
                    className="flex-1"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Kontakta kandidat
                  </Button>
                  
                  <Button variant="outline" className="flex-1">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Detaljerad analys
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
