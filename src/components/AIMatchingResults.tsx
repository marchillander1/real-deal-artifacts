
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Mail, User, Brain, Heart, Clock, DollarSign, CheckCircle } from 'lucide-react';
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
      toast.error('AI-matchning misslyckades');
      setMatches([]);
    }
  };

  const handleSelectConsultant = async (match: Match) => {
    try {
      toast.success(`${match.consultant?.name || 'Konsult'} har kontaktats`);
      setSelectedMatch(match);
    } catch (error) {
      console.error('Contact error:', error);
      toast.error('Kunde inte kontakta konsult');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AI Matching Results</h2>
              <p className="text-gray-600">{assignment.title} at {assignment.company}</p>
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
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Top Matches ({matches.length})</h3>
                <Button onClick={performMatching} variant="outline" size="sm" disabled={isMatching}>
                  <Brain className="h-4 w-4 mr-2" />
                  Re-run Matching
                </Button>
              </div>

              <div className="grid gap-6">
                {matches.map((match, index) => (
                  <Card key={match.consultant_id || index} className="border-2 hover:border-purple-200 transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-lg">
                                {match.consultant?.name?.split(' ').map(n => n[0]).join('') || 'C'}
                              </span>
                            </div>
                            <div className="absolute -top-2 -right-2">
                              <Badge className={`px-2 py-1 font-bold ${getScoreColor(match.match_score)}`}>
                                {match.match_score}%
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-gray-900">{match.consultant?.name || 'Konsult'}</h4>
                            <p className="text-gray-600">{match.consultant?.roles?.[0] || 'Utvecklare'}</p>
                            <div className="flex items-center mt-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium ml-1">{match.consultant?.rating || 5}/5</span>
                              <span className="text-sm text-gray-500 ml-2">• {match.consultant?.experience || '5+ years'} experience</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">#{index + 1}</div>
                          <div className="text-sm text-gray-500">Match Rank</div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Skills Match */}
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          Technical Skills Match
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {(match.matched_skills || []).map((skill, idx) => (
                            <Badge key={idx} className="bg-blue-100 text-blue-800">
                              {skill}
                            </Badge>
                          ))}
                          {(!match.matched_skills || match.matched_skills.length === 0) && (
                            <span className="text-gray-500 text-sm">Analyzing skills...</span>
                          )}
                        </div>
                      </div>

                      {/* Human Factors */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-1">
                            <Heart className="h-4 w-4 text-red-500 mr-1" />
                            <span className="text-sm font-medium">Cultural Fit</span>
                          </div>
                          <div className="text-lg font-bold">{match.cultural_match || 4}/5</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-1">
                            <Brain className="h-4 w-4 text-purple-500 mr-1" />
                            <span className="text-sm font-medium">Communication</span>
                          </div>
                          <div className="text-lg font-bold">{match.communication_match || 4}/5</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-1">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-sm font-medium">Values</span>
                          </div>
                          <div className="text-lg font-bold">{match.values_alignment || 4}/5</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-1">
                            <Clock className="h-4 w-4 text-orange-500 mr-1" />
                            <span className="text-sm font-medium">Response</span>
                          </div>
                          <div className="text-lg font-bold">{match.response_time_hours || 12}h</div>
                        </div>
                      </div>

                      {/* AI Generated Cover Letter Preview */}
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">AI-Generated Motivation Letter</h5>
                        <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
                          <p className="text-sm text-gray-700 whitespace-pre-line">
                            {match.cover_letter ? 
                              (match.cover_letter.length > 300 ? 
                                match.cover_letter.substring(0, 300) + '...' : 
                                match.cover_letter
                              ) : 
                              'Generating personalized cover letter...'
                            }
                          </p>
                        </div>
                      </div>

                      {/* Value Proposition */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-sm font-medium">Est. Savings: {match.estimated_savings || 25000} SEK/month</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {match.consultant?.location || 'Stockholm'} • {match.consultant?.availability || 'Available'}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            View Full Profile
                          </Button>
                          <Button 
                            onClick={() => handleSelectConsultant(match)}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Contact Consultant
                          </Button>
                        </div>
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
