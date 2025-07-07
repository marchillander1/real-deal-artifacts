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
  Loader2
} from 'lucide-react';
import { Assignment } from '@/types/assignment';
import { Consultant } from '@/types/consultant';
import { generateGeminiMatches } from '@/utils/geminiMatchingEngine';
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

  useEffect(() => {
    if (open && assignment) {
      fetchExistingMatches();
    }
  }, [open, assignment]);

  const fetchExistingMatches = async () => {
    setIsLoading(true);
    try {
      console.log('🔍 Fetching existing AI matches for assignment:', assignment.title);
      
      // Fetch matches from database
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

      console.log('Found existing matches:', dbMatches);

      if (dbMatches && dbMatches.length > 0) {
        // Transform database matches to expected format
        const formattedMatches = dbMatches.map(match => ({
          consultant: match.consultants,
          technicalFit: Math.round(match.match_score * 0.7), // Approximate technical score
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
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Matching Results for "{assignment.title}"
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
              <p className="text-lg font-medium">Analyzing consultants...</p>
              <p className="text-sm text-gray-600">Using AI to find the best matches</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Assignment Summary */}
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-purple-800">Assignment Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-purple-700">
                      <strong>Skills:</strong> {assignment.requiredSkills.join(', ')}
                    </p>
                    <p className="text-sm text-purple-700 mt-1">
                      <strong>Team Culture:</strong> {assignment.teamCulture || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-purple-700">
                      <strong>Budget:</strong> {assignment.budget}
                    </p>
                    <p className="text-sm text-purple-700 mt-1">
                      <strong>Duration:</strong> {assignment.duration}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Matches Results */}
            {matches.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Top Matches ({matches.length})
                </h3>
                
                <div className="grid gap-4">
                  {matches.map((match, index) => (
                    <Card key={match.consultant.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                              {match.consultant.name.split(' ').map((n: string) => n[0]).join('')}
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold">{match.consultant.name}</h4>
                              <p className="text-gray-600">{match.consultant.title}</p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                <span>📍 {match.consultant.location}</span>
                                <span>💼 {match.consultant.experience}</span>
                                <span>⭐ {match.consultant.rating}/5</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <Badge className={`${getMatchScoreColor(match.totalMatchScore)} font-bold text-lg px-3 py-1`}>
                              {match.totalMatchScore}% Match
                            </Badge>
                            <p className="text-sm text-gray-600 mt-1">
                              {match.responseTime} response time
                            </p>
                          </div>
                        </div>

                        {/* Match Details */}
                        <div className="grid md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Technical Fit</p>
                            <Progress value={match.technicalFit} className="h-2 mb-1" />
                            <p className="text-xs text-gray-600">{match.technicalFit}%</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Cultural Fit</p>
                            <Progress value={match.culturalFit} className="h-2 mb-1" />
                            <p className="text-xs text-gray-600">{match.culturalFit}%</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Success Probability</p>
                            <Progress value={match.successProbability} className="h-2 mb-1" />
                            <p className="text-xs text-gray-600">{Math.round(match.successProbability)}%</p>
                          </div>
                        </div>

                        {/* Matched Skills & Values */}
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Matched Skills</p>
                            <div className="flex flex-wrap gap-1">
                              {match.matchedSkills.map((skill: string, idx: number) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Aligned Values</p>
                            <div className="flex flex-wrap gap-1">
                              {match.matchedValues?.map((value: string, idx: number) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {value}
                                </Badge>
                              )) || <span className="text-xs text-gray-500">No values matched</span>}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              {match.estimatedSavings}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {match.responseTime}
                            </span>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedMatch(match)}
                            >
                              <Mail className="h-4 w-4 mr-1" />
                              View Match Letter
                            </Button>
                            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                              Contact Consultant
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No matches found</h3>
                <p className="text-gray-600">
                  Try adjusting the assignment requirements or check back later for new consultants.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Match Letter Modal */}
        {selectedMatch && (
          <Dialog open={!!selectedMatch} onOpenChange={() => setSelectedMatch(null)}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>AI Generated Match Letter</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  value={selectedMatch.matchLetter}
                  readOnly
                  className="min-h-[400px] font-mono text-sm"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => copyMatchLetter(selectedMatch.matchLetter)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Letter
                  </Button>
                  <Button onClick={() => setSelectedMatch(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
};
