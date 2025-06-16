
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Mail, User, Brain, Heart, Clock, DollarSign, CheckCircle, Award, MapPin, Calendar, Percent, TrendingUp, Target, Users, Lightbulb, BarChart3, Trophy, Zap } from 'lucide-react';
import { Assignment, Consultant, Match } from '@/types/consultant';
import { toast } from 'sonner';
import { useAiMatching } from '@/hooks/useAiMatching';
import { findMatches } from '@/utils/matching';
import { useSupabaseConsultantsWithDemo } from '@/hooks/useSupabaseConsultantsWithDemo';

interface AIMatchingResultsProps {
  assignment: Assignment;
  onClose: () => void;
}

export const AIMatchingResults: React.FC<AIMatchingResultsProps> = ({ assignment, onClose }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState<string | null>(null);
  const { performAiMatching, isMatching } = useAiMatching();
  const { consultants } = useSupabaseConsultantsWithDemo();

  const performMatching = async () => {
    try {
      console.log('Starting AI matching for assignment:', assignment.id);
      
      // Use the enhanced matching algorithm from utils/matching.ts
      const enhancedMatches = findMatches(consultants, assignment);
      console.log('Enhanced matches generated:', enhancedMatches);
      
      setMatches(enhancedMatches);
      toast.success(`Found ${enhancedMatches.length} consultant matches with detailed analysis`);
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

  const renderDetailedAnalysis = (match: Match) => {
    if (showDetailedAnalysis !== match.consultant.id) return null;

    return (
      <div className="mt-6 space-y-6 border-t pt-6">
        {/* Technical Analysis */}
        {match.technicalAnalysis && (
          <div className="bg-blue-50 rounded-lg p-6">
            <h6 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              Teknisk Analys ({match.technicalAnalysis.skillMatchPercentage}% match)
            </h6>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h7 className="text-sm font-medium text-blue-800 mb-2">Matchade Färdigheter</h7>
                <div className="space-y-1">
                  {match.technicalAnalysis.matchedSkills.map((skill, idx) => (
                    <Badge key={idx} className="bg-green-100 text-green-800 mr-1 mb-1">
                      ✓ {skill}
                    </Badge>
                  ))}
                </div>
                
                <h7 className="text-sm font-medium text-blue-800 mb-2 mt-4">Utvecklingsområden</h7>
                <div className="space-y-1">
                  {match.technicalAnalysis.unmatchedSkills.slice(0, 3).map((skill, idx) => (
                    <Badge key={idx} variant="outline" className="text-orange-600 mr-1 mb-1">
                      📚 {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700">Teknisk Djup:</span>
                  <span className="text-sm font-medium">{match.technicalAnalysis.technicalDepth}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700">Erfarenhet:</span>
                  <span className="text-sm font-medium">{match.technicalAnalysis.experienceLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700">Certifieringar:</span>
                  <span className="text-sm font-medium">{match.technicalAnalysis.certifications.length} st</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Personality Analysis */}
        {match.personalityAnalysis && (
          <div className="bg-purple-50 rounded-lg p-6">
            <h6 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
              <Heart className="h-5 w-5 mr-2" />
              Personlighetsanalys & Teampassning
            </h6>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h7 className="text-sm font-medium text-purple-800 mb-2">Arbetsstil & Kommunikation</h7>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Arbetsstil:</span> {match.personalityAnalysis.workStyle}
                  </div>
                  <div>
                    <span className="font-medium">Kommunikation:</span> {match.personalityAnalysis.communicationStyle}
                  </div>
                </div>
                
                <h7 className="text-sm font-medium text-purple-800 mb-2 mt-4">Personlighetsdrag</h7>
                <div className="flex flex-wrap gap-1">
                  {match.personalityAnalysis.personalityTraits.map((trait, idx) => (
                    <Badge key={idx} className="bg-purple-100 text-purple-800 text-xs">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-purple-700">Teampassning:</span>
                  <span className="text-sm font-medium">{match.personalityAnalysis.teamFitScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-purple-700">Ledarskap:</span>
                  <span className="text-sm font-medium">{match.personalityAnalysis.leadershipPotential}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-purple-700">Anpassningsförmåga:</span>
                  <span className="text-sm font-medium">{match.personalityAnalysis.adaptabilityScore}/5</span>
                </div>
                
                <h7 className="text-sm font-medium text-purple-800 mb-2 mt-4">Styrkor för denna roll</h7>
                <div className="space-y-1">
                  {match.personalityAnalysis.strengthsForRole.slice(0, 3).map((strength, idx) => (
                    <div key={idx} className="text-xs text-purple-700">• {strength}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Industry Analysis */}
        {match.industryAnalysis && (
          <div className="bg-green-50 rounded-lg p-6">
            <h6 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Branschanalys & Marknadsförståelse
            </h6>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h7 className="text-sm font-medium text-green-800 mb-2">Branschspecifika Färdigheter</h7>
                <div className="flex flex-wrap gap-1 mb-4">
                  {match.industryAnalysis.industrySpecificSkills.map((skill, idx) => (
                    <Badge key={idx} className="bg-green-100 text-green-800 text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
                
                <h7 className="text-sm font-medium text-green-800 mb-2">Klienttyp Erfarenhet</h7>
                <div className="space-y-1">
                  {match.industryAnalysis.clientTypeExperience.slice(0, 3).map((client, idx) => (
                    <div key={idx} className="text-xs text-green-700">• {client}</div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-green-700">Branschkunskap:</span>
                  <span className="text-sm font-medium">{match.industryAnalysis.industryKnowledgeScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-green-700">Relevanta Projekt:</span>
                  <span className="text-sm font-medium">{match.industryAnalysis.relevantProjects} st</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-green-700">Regelkunskap:</span>
                  <span className="text-sm font-medium">{match.industryAnalysis.regulatoryKnowledge}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-green-700">Marknadsförståelse:</span>
                  <span className="text-sm font-medium">{match.industryAnalysis.marketUnderstanding}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Project Metrics */}
        {match.projectMetrics && (
          <div className="bg-orange-50 rounded-lg p-6">
            <h6 className="text-lg font-semibold text-orange-900 mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Projektframgång & Leveranshistorik
            </h6>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-700">{match.projectMetrics.successRate}</div>
                <div className="text-xs text-orange-600">Framgångsgrad</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-700">{match.projectMetrics.completedProjects}</div>
                <div className="text-xs text-orange-600">Projekt</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-700">{match.projectMetrics.clientSatisfactionScore}</div>
                <div className="text-xs text-orange-600">Kundnöjdhet</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-700">{match.projectMetrics.timeToProductivity}</div>
                <div className="text-xs text-orange-600">Till produktivitet</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              <div className="flex justify-between text-sm">
                <span className="text-orange-700">Återkommande klienter:</span>
                <span className="font-medium">{match.projectMetrics.repeatClientRate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-orange-700">Budgetnoggrannhet:</span>
                <span className="font-medium">{match.projectMetrics.budgetAccuracy}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-orange-700">Leveranspunktlighet:</span>
                <span className="font-medium">{match.projectMetrics.deliveryTimeliness}</span>
              </div>
            </div>
          </div>
        )}

        {/* AI Tips & Recommendations */}
        <div className="bg-yellow-50 rounded-lg p-6">
          <h6 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center">
            <Lightbulb className="h-5 w-5 mr-2" />
            AI-rekommendationer & Tips
          </h6>
          
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-yellow-800">Matchningsfördelar:</span>
              <ul className="text-sm text-yellow-700 mt-1 ml-4">
                <li>• Stark teknisk överensstämmelse med {assignment.requiredSkills.slice(0, 2).join(' och ')}</li>
                <li>• Kulturell passning för {assignment.teamCulture.toLowerCase()} miljö</li>
                <li>• Erfarenhet från {assignment.industry} branschen</li>
              </ul>
            </div>
            
            <div>
              <span className="text-sm font-medium text-yellow-800">Utvecklingsområden:</span>
              <ul className="text-sm text-yellow-700 mt-1 ml-4">
                {match.technicalAnalysis?.learningRecommendations.map((rec, idx) => (
                  <li key={idx}>• Fördjupning inom {rec} kan stärka matchningen</li>
                ))}
              </ul>
            </div>
            
            <div>
              <span className="text-sm font-medium text-yellow-800">Framgångsfaktorer:</span>
              <ul className="text-sm text-yellow-700 mt-1 ml-4">
                <li>• Förväntad tidsbesparingar: {match.estimatedSavings.toLocaleString()} SEK</li>
                <li>• Snabb uppstart: {match.responseTime}h responstid</li>
                <li>• Hög sannolikhet för projektframgång baserat på historik</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Brain className="h-6 w-6 mr-2 text-purple-600" />
                AI Matching Results - Detaljerad Analys
              </h2>
              <p className="text-gray-600 mt-1">
                Resultat för <span className="font-semibold">{assignment.title}</span> på {assignment.company}
              </p>
            </div>
            <Button variant="outline" onClick={onClose}>Stäng</Button>
          </div>
        </div>

        <div className="p-6">
          {matches.length === 0 && !isMatching && (
            <div className="text-center py-12">
              <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Redo för AI Matching</h3>
              <p className="text-gray-600 mb-6">
                Vår AI analyserar tekniska färdigheter, personlighet, branschpassning och projekthistorik
              </p>
              <Button onClick={performMatching} className="bg-purple-600 hover:bg-purple-700">
                <Brain className="h-5 w-5 mr-2" />
                Starta Detaljerad AI Matching
              </Button>
            </div>
          )}

          {isMatching && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI analyserar matcher...</h3>
              <p className="text-gray-600">Utvärderar tekniska färdigheter, personlighet, branschpassning och projekthistorik</p>
            </div>
          )}

          {matches.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <h3 className="text-lg font-semibold">
                    <Badge className="bg-green-100 text-green-800 mr-2">
                      <Trophy className="h-4 w-4 mr-1" />
                      Sorterat efter AI-matchningspoäng
                    </Badge>
                    {matches.length} konsulter matchade med detaljerad analys
                  </h3>
                </div>
                <Button onClick={performMatching} variant="outline" size="sm" disabled={isMatching}>
                  <Brain className="h-4 w-4 mr-2" />
                  Kör Om Matching
                </Button>
              </div>

              <div className="space-y-4">
                {matches.map((match, index) => (
                  <Card key={match.consultant.id || index} className="border hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      {/* Header with consultant info and match score */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="relative">
                            <Badge className={`absolute -top-2 -left-2 px-2 py-1 text-xs font-bold ${getScoreBadgeColor(match.score)}`}>
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
                                <span>{match.consultant?.projects || 15} projekt</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 text-green-500 mr-1" />
                                <span>{match.responseTime || 2}h responstid</span>
                              </div>
                            </div>

                            {/* Matching Skills */}
                            <div className="mb-3">
                              <h5 className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                                Matchande Färdigheter ({match.technicalAnalysis?.skillMatchPercentage || 85}% teknisk match)
                              </h5>
                              <div className="flex flex-wrap gap-1">
                                {(match.matchedSkills || []).slice(0, 4).map((skill, idx) => (
                                  <Badge key={idx} className="bg-green-100 text-green-800 text-xs">
                                    ✓ {skill}
                                  </Badge>
                                ))}
                                {(match.matchedSkills || []).length > 4 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{(match.matchedSkills || []).length - 4} fler
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Match Score Display */}
                        <div className="text-right ml-4">
                          <div className={`text-3xl font-bold ${getScoreColor(match.score)} mb-1 flex items-center`}>
                            {match.score}%
                            <Percent className="h-6 w-6 ml-1" />
                          </div>
                          <div className="text-xs text-gray-500 mb-1">{getMatchLevel(match.score)}</div>
                          <div className="text-green-600 font-medium text-sm">
                            {(match.estimatedSavings || 25000).toLocaleString()} SEK besparingar
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Match Breakdown */}
                      <div className="grid grid-cols-4 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="text-center">
                          <Brain className="h-4 w-4 text-blue-500 mx-auto mb-1" />
                          <div className="text-xs text-gray-600">Teknisk</div>
                          <div className="font-bold text-blue-600">{match.technicalAnalysis?.skillMatchPercentage || 85}%</div>
                        </div>
                        <div className="text-center">
                          <Heart className="h-4 w-4 text-red-500 mx-auto mb-1" />
                          <div className="text-xs text-gray-600">Personlighet</div>
                          <div className="font-bold text-red-600">{match.personalityAnalysis?.teamFitScore || 90}%</div>
                        </div>
                        <div className="text-center">
                          <Target className="h-4 w-4 text-green-500 mx-auto mb-1" />
                          <div className="text-xs text-gray-600">Bransch</div>
                          <div className="font-bold text-green-600">{match.industryAnalysis?.industryKnowledgeScore || 88}%</div>
                        </div>
                        <div className="text-center">
                          <BarChart3 className="h-4 w-4 text-orange-500 mx-auto mb-1" />
                          <div className="text-xs text-gray-600">Projektframgång</div>
                          <div className="font-bold text-orange-600">{match.projectMetrics?.successRate || '94%'}</div>
                        </div>
                      </div>

                      {/* Enhanced AI-Generated Cover Letter */}
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          AI-Genererat Personligt Brev
                        </h5>
                        <div className="bg-blue-50 rounded-lg p-4 max-h-48 overflow-y-auto border-l-4 border-blue-500">
                          <div className="text-xs text-blue-600 mb-2 font-medium">
                            Anpassat efter konsultens färdigheter, personlighet, branschkunskap och projekthistorik
                          </div>
                          <div className="text-sm text-gray-700 whitespace-pre-line">
                            {match.letter?.substring(0, 600) || 'Genererar personligt brev...'}
                            {(match.letter?.length || 0) > 600 && '...'}
                          </div>
                          {match.letter && (
                            <Button variant="link" size="sm" className="p-0 h-auto text-blue-600 mt-2">
                              Visa Komplett Brev →
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setShowDetailedAnalysis(
                              showDetailedAnalysis === match.consultant.id ? null : match.consultant.id
                            )}
                          >
                            <Brain className="h-4 w-4 mr-1" />
                            {showDetailedAnalysis === match.consultant.id ? 'Dölj' : 'Visa'} Detaljerad Analys
                          </Button>
                          <Button variant="outline" size="sm">
                            <Mail className="h-4 w-4 mr-1" />
                            Skicka Meddelande
                          </Button>
                          <Button variant="outline" size="sm">
                            Ladda ner CV
                          </Button>
                        </div>
                        <Button 
                          onClick={() => handleSelectConsultant(match)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          ✓ Välj Denna Match
                        </Button>
                      </div>

                      {/* Detailed Analysis Section */}
                      {renderDetailedAnalysis(match)}
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
