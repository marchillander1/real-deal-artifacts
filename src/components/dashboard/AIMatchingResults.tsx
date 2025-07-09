
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { 
  Brain, 
  Star, 
  Users, 
  TrendingUp, 
  Clock, 
  DollarSign,
  Mail,
  Copy,
  Loader2,
  User,
  MapPin,
  Award,
  Target,
  Lightbulb,
  CheckCircle,
  MessageSquare,
  Phone,
  LinkedinIcon,
  BookOpen,
  Zap,
  Heart,
  Globe
} from 'lucide-react';
import { Assignment } from '@/types/assignment';
import { Consultant } from '@/types/consultant';
import { useSupabaseConsultantsWithDemo } from '@/hooks/useSupabaseConsultantsWithDemo';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AIMatchingResultsProps {
  assignment: Assignment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AIMatchingResults: React.FC<AIMatchingResultsProps> = ({
  assignment,
  open,
  onOpenChange
}) => {
  const { consultants } = useSupabaseConsultantsWithDemo();
  const [matches, setMatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [selectedConsultant, setSelectedConsultant] = useState<any>(null);

  useEffect(() => {
    if (open && assignment) {
      fetchExistingMatches();
    }
  }, [open, assignment]);

  const fetchExistingMatches = async () => {
    setIsLoading(true);
    try {
      console.log('🔍 Fetching existing AI matches for assignment:', assignment.title);
      
      // Check if assignment ID is a UUID (from database) or demo ID
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(assignment.id));
      
      if (isUUID) {
        // Fetch matches from database for real assignments
        const { data: dbMatches, error } = await supabase
          .from('matches')
          .select(`
            *,
            consultants (*)
          `)
          .eq('assignment_id', String(assignment.id))
          .order('match_score', { ascending: false });

        if (error) {
          console.error('Error fetching matches:', error);
          toast.error('Failed to load matches');
          return;
        }

        if (dbMatches && dbMatches.length > 0) {
          // Transform database matches to expected format
          const formattedMatches = dbMatches.map(match => ({
            consultant: match.consultants,
            technicalFit: Math.round(match.match_score * 0.7),
            culturalFit: match.cultural_match || Math.round(match.match_score * 0.3),
            totalMatchScore: match.match_score,
            matchedSkills: match.matched_skills || [],
            matchLetter: match.cover_letter || 'No match letter available',
            successProbability: Math.min(95, match.match_score + 5),
            estimatedSavings: `${match.estimated_savings || 0} SEK/h`,
            responseTime: `${match.response_time_hours || 24}h`,
            communicationMatch: match.communication_match || 85,
            valuesAlignment: match.values_alignment || 80
          }));

          setMatches(formattedMatches);
          toast.success(`Loaded ${formattedMatches.length} AI matches!`);
        } else {
          // No existing matches, trigger new matching
          await performNewMatching();
        }
      } else {
        // For demo assignments, perform new matching directly
        await performNewMatching();
      }
    } catch (error) {
      console.error('Error loading matches:', error);
      toast.error('Failed to load AI matches');
    } finally {
      setIsLoading(false);
    }
  };

  const performNewMatching = async () => {
    try {
      console.log('🤖 Performing new AI matching...');
      
      const { data, error } = await supabase.functions.invoke('ai-matching', {
        body: { assignment }
      });

      if (error) {
        console.error('AI matching error:', error);
        throw error;
      }

      if (data.success && data.matches.length > 0) {
        setMatches(data.matches);
        toast.success(`Found ${data.matches.length} new AI matches!`);
      } else {
        toast.info('No suitable matches found for this assignment');
      }
      
    } catch (error) {
      console.error('Error during new matching:', error);
      toast.error('Failed to perform AI matching');
    }
  };

  const copyMatchLetter = (matchLetter: string) => {
    navigator.clipboard.writeText(matchLetter);
    toast.success('Match letter copied to clipboard!');
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-100 border-green-200';
    if (score >= 75) return 'text-blue-600 bg-blue-100 border-blue-200';
    if (score >= 65) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-red-600 bg-red-100 border-red-200';
  };

  const handleViewProfile = (consultant: any) => {
    setSelectedConsultant(consultant);
  };

  const handleContactConsultant = (consultant: any) => {
    toast.success(`Kontaktar ${consultant.name}...`);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <Brain className="h-6 w-6 text-purple-600" />
              AI Matchningsresultat för "{assignment.title}"
            </DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin mx-auto mb-6 text-purple-600" />
                <p className="text-xl font-medium mb-2">🧠 Analyserar konsulter...</p>
                <p className="text-gray-600">Vår AI jämför tekniska färdigheter, kulturell passform och framgångspotential</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Assignment Summary */}
              <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-purple-800 flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Uppdragsprofil
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-purple-700">Tekniska krav:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {assignment.requiredSkills?.map((skill, idx) => (
                              <Badge key={idx} className="bg-purple-100 text-purple-800 border-purple-200">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-purple-700">Teamkultur:</span>
                          <p className="text-gray-700 mt-1">{assignment.teamCulture || 'Kollaborativ och innovationsfokuserad'}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-purple-700">Budget:</span>
                          <p className="text-gray-700 mt-1">{assignment.budget}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-purple-700">Varaktighet:</span>
                          <p className="text-gray-700 mt-1">{assignment.duration}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-purple-700">Arbetssätt:</span>
                          <p className="text-gray-700 mt-1">{assignment.remote || 'Hybrid'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Matches Results */}
              {matches.length > 0 ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold flex items-center gap-3">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                      Toppmatchningar ({matches.length})
                    </h3>
                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 px-4 py-2">
                      <Zap className="h-4 w-4 mr-2" />
                      AI-Analyserad
                    </Badge>
                  </div>
                  
                  <div className="grid gap-6">
                    {matches.map((match, index) => (
                      <Card key={match.consultant.id} className="overflow-hidden border-l-4 border-l-blue-500 hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-8">
                          {/* Header Section */}
                          <div className="flex justify-between items-start mb-6">
                            <div className="flex items-start gap-6">
                              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                {match.consultant.name?.split(' ').map((n: string) => n[0]).join('') || 'C'}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-4 mb-3">
                                  <h4 className="text-2xl font-bold text-gray-900">{match.consultant.name}</h4>
                                  <Badge className={`${getMatchScoreColor(match.totalMatchScore)} font-bold text-lg px-4 py-2 border`}>
                                    #{index + 1} • {match.totalMatchScore}% Match
                                  </Badge>
                                </div>
                                <p className="text-lg text-gray-600 mb-3">{match.consultant.title || 'Senior Konsult'}</p>
                                
                                <div className="flex items-center gap-6 text-sm text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>{match.consultant.location || 'Sverige'}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Award className="h-4 w-4" />
                                    <span>{match.consultant.experience_years || 5}+ års erfarenhet</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                    <span>{match.consultant.rating || 4.8}/5.0</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4" />
                                    <span>{match.consultant.hourly_rate || 850} SEK/h</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="text-3xl font-bold text-green-600 mb-2">
                                {match.successProbability || 92}%
                              </div>
                              <div className="text-sm text-gray-500">Framgångssannolikhet</div>
                            </div>
                          </div>

                          {/* AI Analysis Section */}
                          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
                            <div className="flex items-center mb-4">
                              <Brain className="h-5 w-5 text-purple-600 mr-3" />
                              <span className="font-semibold text-purple-800">AI-Analys & Matchningsinsikter</span>
                            </div>
                            
                            {/* Match Scores */}
                            <div className="grid md:grid-cols-4 gap-6 mb-6">
                              <div>
                                <div className="flex justify-between text-sm mb-2">
                                  <span className="font-medium">Teknisk passform</span>
                                  <span className="font-bold text-blue-600">{match.technicalFit || 85}%</span>
                                </div>
                                <Progress value={match.technicalFit || 85} className="h-3" />
                              </div>
                              
                              <div>
                                <div className="flex justify-between text-sm mb-2">
                                  <span className="font-medium">Kulturell matchning</span>
                                  <span className="font-bold text-green-600">{match.culturalFit || 78}%</span>
                                </div>
                                <Progress value={match.culturalFit || 78} className="h-3" />
                              </div>
                              
                              <div>
                                <div className="flex justify-between text-sm mb-2">
                                  <span className="font-medium">Kommunikation</span>
                                  <span className="font-bold text-purple-600">{match.communicationMatch || 88}%</span>
                                </div>
                                <Progress value={match.communicationMatch || 88} className="h-3" />
                              </div>
                              
                              <div>
                                <div className="flex justify-between text-sm mb-2">
                                  <span className="font-medium">Värderingar</span>
                                  <span className="font-bold text-orange-600">{match.valuesAlignment || 82}%</span>
                                </div>
                                <Progress value={match.valuesAlignment || 82} className="h-3" />
                              </div>
                            </div>

                            {/* Enhanced Skills & Insights */}
                            <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                  Matchade kärnkompetenser ({match.matchedSkills?.length || 4})
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                  {(match.matchedSkills || ['React', 'TypeScript', 'Node.js', 'AWS']).map((skill: string, idx: number) => (
                                    <Badge key={idx} className="bg-green-100 text-green-800 border-green-200">
                                      ✓ {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                                  <Lightbulb className="h-4 w-4 mr-2 text-blue-500" />
                                  Unika styrkor & differentiering
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                  {(match.consultant.personality_traits || ['Problemlösare', 'Teamledare', 'Mentorskap', 'Innovation']).slice(0, 4).map((trait: string, idx: number) => (
                                    <Badge key={idx} variant="outline" className="text-blue-700 border-blue-300">
                                      {trait}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Detailed Consultant Info */}
                          <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                              <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                                <BookOpen className="h-4 w-4 mr-2 text-purple-500" />
                                Expertområden & Branschkännedom
                              </h5>
                              <div className="space-y-2">
                                {(match.consultant.industries || ['Fintech', 'E-commerce', 'Startup']).map((industry: string, idx: number) => (
                                  <div key={idx} className="flex items-center text-sm text-gray-700">
                                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                                    {industry}
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                                <Heart className="h-4 w-4 mr-2 text-red-500" />
                                Arbetsstil & Värderingar
                              </h5>
                              <div className="space-y-2">
                                {(match.consultant.top_values || ['Kvalitet', 'Innovation', 'Samarbete']).map((value: string, idx: number) => (
                                  <div key={idx} className="flex items-center text-sm text-gray-700">
                                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                                    {value}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Key Metrics & Timeline */}
                          <div className="bg-gray-50 rounded-lg p-6 mb-6">
                            <h5 className="font-semibold text-gray-800 mb-4 flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-orange-500" />
                              Projektdetaljer & Timing
                            </h5>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                              <div>
                                <div className="text-2xl font-bold text-blue-600">{match.responseTime || '12h'}</div>
                                <div className="text-xs text-gray-600">Svarstid</div>
                              </div>
                              <div>
                                <div className="text-2xl font-bold text-green-600">2-3 v</div>
                                <div className="text-xs text-gray-600">Uppstartstid</div>
                              </div>
                              <div>
                                <div className="text-2xl font-bold text-purple-600">{match.estimatedSavings || '150 SEK/h'}</div>
                                <div className="text-xs text-gray-600">Potentiell besparing</div>
                              </div>
                              <div>
                                <div className="text-2xl font-bold text-orange-600">Tillgänglig</div>
                                <div className="text-xs text-gray-600">Status</div>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-4 pt-4 border-t">
                            <Button 
                              onClick={() => handleViewProfile(match.consultant)}
                              variant="outline"
                              className="flex-1 border-2 border-blue-200 hover:bg-blue-50"
                            >
                              <User className="h-4 w-4 mr-2" />
                              Se fullständig profil
                            </Button>
                            
                            <Button 
                              onClick={() => setSelectedMatch(match)}
                              variant="outline"
                              className="flex-1 border-2 border-purple-200 hover:bg-purple-50"
                            >
                              <Mail className="h-4 w-4 mr-2" />
                              Visa AI-matchningsbrev
                            </Button>
                            
                            <Button 
                              onClick={() => handleContactConsultant(match.consultant)}
                              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Kontakta konsult
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                  <h3 className="text-xl font-medium text-gray-900 mb-3">Inga matchningar hittades</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Försök justera uppdragskraven eller kontakta oss för att utöka sökområdet.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Match Letter Modal */}
          {selectedMatch && (
            <Dialog open={!!selectedMatch} onOpenChange={() => setSelectedMatch(null)}>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    AI-Genererat Matchningsbrev
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Detta brev är automatiskt genererat baserat på djupgående AI-analys av både konsultens profil och uppdragskrav.
                    </p>
                  </div>
                  <Textarea
                    value={selectedMatch.matchLetter}
                    readOnly
                    className="min-h-[400px] font-mono text-sm"
                  />
                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => copyMatchLetter(selectedMatch.matchLetter)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Kopiera brev
                    </Button>
                    <Button onClick={() => setSelectedMatch(null)}>
                      Stäng
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </DialogContent>
      </Dialog>

      {/* Consultant Profile Modal */}
      {selectedConsultant && (
        <Dialog open={!!selectedConsultant} onOpenChange={() => setSelectedConsultant(null)}>
          <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-xl">
                <User className="h-6 w-6 text-blue-600" />
                Konsultprofil: {selectedConsultant.name}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <User className="h-10 w-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">{selectedConsultant.name}</h2>
                    <p className="text-xl opacity-90 mb-3">{selectedConsultant.title || 'Senior Konsult'}</p>
                    <div className="flex flex-wrap gap-3">
                      <Badge className="bg-white/20 text-white border-white/30">
                        {selectedConsultant.experience_years || 5}+ års erfarenhet
                      </Badge>
                      <Badge className="bg-white/20 text-white border-white/30">
                        {selectedConsultant.hourly_rate || 850} SEK/tim
                      </Badge>
                      <Badge className="bg-white/20 text-white border-white/30">
                        ⭐ {selectedConsultant.rating || 4.8}/5
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact & Availability */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-blue-600" />
                      Kontaktinformation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{selectedConsultant.email || 'contact@matchwiseai.com'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{selectedConsultant.phone || 'Tillgänglig efter registrering'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{selectedConsultant.location || 'Sverige'}</span>
                    </div>
                    {selectedConsultant.linkedin_url && (
                      <div className="flex items-center gap-3">
                        <LinkedinIcon className="h-4 w-4 text-gray-500" />
                        <a href={selectedConsultant.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          LinkedIn Profil
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-green-600" />
                      Tillgänglighet & Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Status:</span>
                      <Badge className="bg-green-100 text-green-800">
                        {selectedConsultant.availability || 'Tillgänglig'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Uppstartstid:</span>
                      <span>2-3 veckor</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Tidzon:</span>
                      <span>CET (Stockholm)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Språk:</span>
                      <span>Svenska, Engelska</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Skills & Expertise */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-purple-600" />
                    Teknisk kompetens & Expertområden
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Huvudkompetenser</h4>
                      <div className="flex flex-wrap gap-2">
                        {(selectedConsultant.skills || ['React', 'TypeScript', 'Node.js', 'AWS', 'Docker']).map((skill: string, idx: number) => (
                          <Badge key={idx} className="bg-blue-100 text-blue-800">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Certifieringar</h4>
                      <div className="flex flex-wrap gap-2">
                        {(selectedConsultant.certifications || ['AWS Solutions Architect', 'React Specialist']).map((cert: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-purple-700 border-purple-300">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Analysis Insights */}
              {selectedConsultant.analysis_results && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-purple-600" />
                      AI-Analysinsikter
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {selectedConsultant.thought_leadership_score || 75}%
                        </div>
                        <div className="text-sm text-gray-600">Thought Leadership</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {selectedConsultant.cultural_fit || 85}%
                        </div>
                        <div className="text-sm text-gray-600">Kulturell passform</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {selectedConsultant.adaptability || 90}%
                        </div>
                        <div className="text-sm text-gray-600">Anpassningsförmåga</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={() => handleContactConsultant(selectedConsultant)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Kontakta konsult
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedConsultant(null)}
                  className="px-8"
                >
                  Stäng
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
