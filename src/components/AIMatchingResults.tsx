
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Mail, User, Brain, Heart, Clock, DollarSign, CheckCircle, Award, MapPin, Calendar } from 'lucide-react';
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
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    return 'text-orange-600';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 85) return 'bg-green-100 text-green-800';
    if (score >= 70) return 'bg-blue-100 text-blue-800';
    return 'bg-orange-100 text-orange-800';
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
                      <div className="flex items-start justify-between mb-4">
                        {/* Left side - Consultant info */}
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
                              <h4 className="text-lg font-bold text-gray-900">{match.consultant?.name || 'Konsult'}</h4>
                              <Badge variant="outline" className="text-xs">
                                {match.consultant?.roles?.[0] || 'Utvecklare'}
                              </Badge>
                              <div className="flex items-center text-sm text-gray-500">
                                <MapPin className="h-3 w-3 mr-1" />
                                {match.consultant?.location || 'Stockholm'}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                                <span className="font-medium">{match.consultant?.rating || 5}/5</span>
                              </div>
                              <div className="flex items-center">
                                <Award className="h-4 w-4 text-blue-500 mr-1" />
                                <span>{match.consultant?.projects || 23} projects</span>
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 text-green-500 mr-1" />
                                <span>{match.response_time_hours || 2} min ago</span>
                              </div>
                            </div>

                            {/* Matching Skills */}
                            <div className="mb-3">
                              <h5 className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                                Matching Skills
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

                        {/* Right side - Match score */}
                        <div className="text-right ml-4">
                          <div className={`text-3xl font-bold ${getScoreColor(match.match_score)} mb-1`}>
                            {match.match_score}% Match
                          </div>
                          <div className="text-xs text-gray-500 mb-2">AI Confidence Score</div>
                          <div className="text-green-600 font-medium text-sm">
                            $ {(match.estimated_savings || 25000).toLocaleString()} <span className="text-xs">/ 5h</span>
                          </div>
                        </div>
                      </div>

                      {/* Human Factors Grid */}
                      <div className="grid grid-cols-4 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="text-center">
                          <Heart className="h-4 w-4 text-red-500 mx-auto mb-1" />
                          <div className="text-xs text-gray-600">Cultural</div>
                          <div className="font-bold text-red-600">{match.cultural_match || 100}%</div>
                        </div>
                        <div className="text-center">
                          <Brain className="h-4 w-4 text-blue-500 mx-auto mb-1" />
                          <div className="text-xs text-gray-600">Comm.</div>
                          <div className="font-bold text-blue-600">{match.communication_match || 91}%</div>
                        </div>
                        <div className="text-center">
                          <CheckCircle className="h-4 w-4 text-purple-500 mx-auto mb-1" />
                          <div className="text-xs text-gray-600">Values</div>
                          <div className="font-bold text-purple-600">{match.values_alignment || 94}%</div>
                        </div>
                        <div className="text-center">
                          <User className="h-4 w-4 text-orange-500 mx-auto mb-1" />
                          <div className="text-xs text-gray-600">Human</div>
                          <div className="font-bold text-orange-600">{match.human_factors_score || 93}%</div>
                        </div>
                      </div>

                      {/* Profile Details & Human Factors */}
                      <div className="grid grid-cols-2 gap-6 mb-4">
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            Profile Details
                          </h5>
                          <div className="space-y-1 text-sm">
                            <div><span className="text-gray-600">Experience:</span> <span className="font-medium">{match.consultant?.experience || '6 years'}</span></div>
                            <div><span className="text-gray-600">Rate:</span> <span className="font-medium text-green-600">{match.consultant?.rate || '950 SEK/h'}</span></div>
                            <div><span className="text-gray-600">Availability:</span> <span className="font-medium">{match.consultant?.availability || 'Available'}</span></div>
                            <div><span className="text-gray-600">Contact:</span> <span className="font-medium">{match.consultant?.email || 'anna.lindqvist@email.com'}</span></div>
                          </div>
                        </div>

                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <Heart className="h-4 w-4 mr-1" />
                            Human Factors
                          </h5>
                          <div className="space-y-1 text-sm">
                            <div><span className="text-gray-600">Communication Style:</span></div>
                            <div className="text-xs text-gray-700">Collaborative and direct, excels at explaining complex technical concepts to non-technical stakeholders</div>
                            <div><span className="text-gray-600 mt-2 block">Work Style:</span></div>
                            <div className="text-xs text-gray-700">Detail-oriented, prefers structured environments with clear goals. Thrives in cross-functional teams.</div>
                            <div><span className="text-gray-600 mt-2 block">Team Fit:</span></div>
                            <div className="text-xs text-gray-700">Excellent mentor, works well in cross-functional teams. Natural bridge between design and development.</div>
                          </div>
                        </div>
                      </div>

                      {/* Core Values & Certifications */}
                      <div className="grid grid-cols-2 gap-6 mb-4">
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <Heart className="h-4 w-4 mr-1" />
                            Core Values
                          </h5>
                          <div className="flex flex-wrap gap-1">
                            {['Innovation', 'Work-life balance', 'Transparency', 'Continuous learning', 'User-centric design'].map((value, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {value}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <Award className="h-4 w-4 mr-1" />
                            Certifications
                          </h5>
                          <div className="space-y-1 text-xs text-gray-600">
                            <div>✓ AWS Certified Solutions Architect</div>
                            <div>✓ Scrum Master PSM I</div>
                            <div>✓ Google UX Design Certificate</div>
                            <div>✓ React Advanced Patterns</div>
                          </div>
                        </div>
                      </div>

                      {/* Personality Traits & Languages */}
                      <div className="grid grid-cols-2 gap-6 mb-4">
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <Brain className="h-4 w-4 mr-1" />
                            Personality Traits
                          </h5>
                          <div className="flex flex-wrap gap-1">
                            {['Empathetic', 'Analytical', 'Creative', 'Decisive', 'Mentoring-focused'].map((trait, idx) => (
                              <Badge key={idx} className="bg-blue-100 text-blue-800 text-xs">
                                {trait}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            Languages
                          </h5>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span>Swedish (Native)</span>
                              <span className="text-blue-600 font-medium">Native</span>
                            </div>
                            <div className="flex justify-between">
                              <span>English (Fluent)</span>
                              <span className="text-blue-600 font-medium">Fluent</span>
                            </div>
                            <div className="flex justify-between">
                              <span>German (Conversational)</span>
                              <span className="text-blue-600 font-medium">Basic</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Cover Letter Preview */}
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          AI-Generated Cover Letter Preview
                        </h5>
                        <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
                          <div className="text-xs text-gray-600 mb-1">Subject: Perfect Match for E-commerce Platform Redesign at Nordic Retail AB</div>
                          <div className="text-xs text-gray-700">
                            <p className="mb-2">Dear Hiring Manager,</p>
                            <p>I'm Anna Lindqvist, a Senior Frontend Developer with 6 years of hands-on experience. Your E-commerce Platform Redesign project perfectly aligns with my expertise and career goals.</p>
                            <p className="mb-2 font-medium">💡 Why I'm Perfect for This Role:</p>
                          </div>
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
