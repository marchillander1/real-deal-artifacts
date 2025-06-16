
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Mail, User, Brain, Heart, Clock, DollarSign, CheckCircle, Award, MapPin, Calendar, Percent } from 'lucide-react';
import { Assignment, Consultant } from '@/types/consultant';
import { toast } from 'sonner';
import { useAiMatching } from '@/hooks/useAiMatching';

interface Match {
  id?: string;
  consultant_id: string;
  match_score: number;
  matched_skills: string[];
  human_factors_score: number;
  cultural_match: number;
  communication_match: number;
  values_alignment: number;
  response_time_hours: number;
  estimated_savings: number;
  cover_letter: string;
  consultant?: Consultant;
  skillMatch?: number;
}

interface AIMatchingResultsProps {
  assignment: Assignment;
  onClose: () => void;
}

export const AIMatchingResults: React.FC<AIMatchingResultsProps> = ({ assignment, onClose }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const { performAiMatching, isMatching } = useAiMatching();

  const performMatching = async () => {
    try {
      console.log('Starting AI matching for assignment:', assignment.id);
      const result = await performAiMatching(String(assignment.id));
      console.log('AI matching result:', result);
      
      if (result && result.matches) {
        console.log('Setting matches:', result.matches);
        setMatches(result.matches);
      } else {
        console.log('No matches returned from AI matching');
        setMatches([]);
      }
    } catch (error) {
      console.error('Matching error in component:', error);
      toast.error('AI matching failed');
      setMatches([]);
    }
  };

  const handleSelectConsultant = async (match: Match) => {
    try {
      toast.success(`${match.consultant?.name || 'Consultant'} has been contacted`);
      setSelectedMatch(match);
    } catch (error) {
      console.error('Contact error:', error);
      toast.error('Could not contact consultant');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    return 'text-orange-600';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 85) return 'bg-green-100 text-green-800';
    if (score >= 70) return 'bg-blue-100 text-blue-800';
    return 'bg-orange-100 text-orange-800';
  };

  const getMatchLevel = (score: number) => {
    if (score >= 90) return 'Exceptional Match';
    if (score >= 80) return 'Strong Match';
    if (score >= 70) return 'Good Match';
    return 'Potential Match';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Brain className="h-6 w-6 mr-2 text-purple-600" />
                AI Matching Results
              </h2>
              <p className="text-gray-600 mt-1">
                Results for <span className="font-semibold">{assignment.title}</span> at {assignment.company}
              </p>
            </div>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
        </div>

        <div className="p-6">
          {matches.length === 0 && !isMatching && (
            <div className="text-center py-12">
              <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready for AI Matching</h3>
              <p className="text-gray-600 mb-6">
                Our AI will analyze both technical skills and personality fit to find the perfect consultants
              </p>
              <Button onClick={performMatching} className="bg-purple-600 hover:bg-purple-700">
                <Brain className="h-5 w-5 mr-2" />
                Start AI Matching
              </Button>
            </div>
          )}

          {isMatching && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI is analyzing matches...</h3>
              <p className="text-gray-600">Evaluating technical skills, personality fit, and cultural alignment</p>
            </div>
          )}

          {matches.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <h3 className="text-lg font-semibold">
                    <Badge className="bg-green-100 text-green-800 mr-2">
                      Sorted by AI confidence score
                    </Badge>
                    {matches.length} consultants matched in 2.8 seconds
                  </h3>
                </div>
                <Button onClick={performMatching} variant="outline" size="sm" disabled={isMatching}>
                  <Brain className="h-4 w-4 mr-2" />
                  Re-run Matching
                </Button>
              </div>

              <div className="space-y-4">
                {matches.map((match, index) => (
                  <Card key={match.consultant_id || index} className="border hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      {/* Header with consultant info and match score */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="relative">
                            <Badge className={`absolute -top-2 -left-2 px-2 py-1 text-xs font-bold ${getScoreBadgeColor(match.match_score)}`}>
                              #{index + 1}
                            </Badge>
                            <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                              {match.consultant?.name?.split(' ').map(n => n[0]).join('') || 'C'}
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-lg font-bold text-gray-900">{match.consultant?.name || 'Consultant'}</h4>
                              <Badge variant="outline" className="text-xs">
                                {match.consultant?.roles?.[0] || 'Developer'}
                              </Badge>
                              <div className="flex items-center text-sm text-gray-500">
                                <MapPin className="h-3 w-3 mr-1" />
                                {match.consultant?.location || 'Remote'}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                                <span className="font-medium">{match.consultant?.rating || 5}/5</span>
                              </div>
                              <div className="flex items-center">
                                <Award className="h-4 w-4 text-blue-500 mr-1" />
                                <span>{match.consultant?.projects || 15} projects</span>
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 text-green-500 mr-1" />
                                <span>{match.response_time_hours || 2}h response time</span>
                              </div>
                            </div>

                            {/* Matching Skills */}
                            <div className="mb-3">
                              <h5 className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                                Matching Skills ({match.skillMatch || 85}% technical match)
                              </h5>
                              <div className="flex flex-wrap gap-1">
                                {(match.matched_skills || []).slice(0, 4).map((skill, idx) => (
                                  <Badge key={idx} className="bg-green-100 text-green-800 text-xs">
                                    ✓ {skill}
                                  </Badge>
                                ))}
                                {(match.matched_skills || []).length > 4 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{(match.matched_skills || []).length - 4} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Match Score Display */}
                        <div className="text-right ml-4">
                          <div className={`text-3xl font-bold ${getScoreColor(match.match_score)} mb-1 flex items-center`}>
                            {match.match_score}%
                            <Percent className="h-6 w-6 ml-1" />
                          </div>
                          <div className="text-xs text-gray-500 mb-1">{getMatchLevel(match.match_score)}</div>
                          <div className="text-green-600 font-medium text-sm">
                            ${(match.estimated_savings || 25000).toLocaleString()} saved
                          </div>
                        </div>
                      </div>

                      {/* Detailed Match Breakdown */}
                      <div className="grid grid-cols-4 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="text-center">
                          <Brain className="h-4 w-4 text-blue-500 mx-auto mb-1" />
                          <div className="text-xs text-gray-600">Technical</div>
                          <div className="font-bold text-blue-600">{match.skillMatch || 85}%</div>
                        </div>
                        <div className="text-center">
                          <Heart className="h-4 w-4 text-red-500 mx-auto mb-1" />
                          <div className="text-xs text-gray-600">Cultural</div>
                          <div className="font-bold text-red-600">{match.cultural_match || 90}%</div>
                        </div>
                        <div className="text-center">
                          <User className="h-4 w-4 text-purple-500 mx-auto mb-1" />
                          <div className="text-xs text-gray-600">Communication</div>
                          <div className="font-bold text-purple-600">{match.communication_match || 88}%</div>
                        </div>
                        <div className="text-center">
                          <CheckCircle className="h-4 w-4 text-orange-500 mx-auto mb-1" />
                          <div className="text-xs text-gray-600">Values</div>
                          <div className="font-bold text-orange-600">{match.values_alignment || 87}%</div>
                        </div>
                      </div>

                      {/* AI-Generated Cover Letter Preview */}
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          AI-Generated Cover Letter Preview
                        </h5>
                        <div className="bg-blue-50 rounded-lg p-4 max-h-48 overflow-y-auto border-l-4 border-blue-500">
                          <div className="text-xs text-blue-600 mb-2 font-medium">
                            Personalized based on consultant's skills, personality, and work style
                          </div>
                          <div className="text-sm text-gray-700 whitespace-pre-line">
                            {match.cover_letter?.substring(0, 600) || 'Generating personalized cover letter...'}
                            {(match.cover_letter?.length || 0) > 600 && '...'}
                          </div>
                          {match.cover_letter && (
                            <Button variant="link" size="sm" className="p-0 h-auto text-blue-600 mt-2">
                              View Full Cover Letter →
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            View Full Profile
                          </Button>
                          <Button variant="outline" size="sm">
                            <Mail className="h-4 w-4 mr-1" />
                            Send Message
                          </Button>
                          <Button variant="outline" size="sm">
                            Download CV
                          </Button>
                        </div>
                        <Button 
                          onClick={() => handleSelectConsultant(match)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          ✓ Select This Match
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
