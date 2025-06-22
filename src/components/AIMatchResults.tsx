
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Star, Mail, User, Target, MessageSquare, Heart, Clock, DollarSign, X } from 'lucide-react';
import { Assignment, Consultant } from '@/types/consultant';

interface MatchResult {
  consultant: Consultant;
  technicalFit: number;
  culturalFit: number;
  totalMatchScore: number;
  matchedSkills: string[];
  matchedValues: string[];
  matchLetter: string;
  estimatedSavings: string;
  responseTime: string;
  successProbability: number;
}

interface AIMatchResultsProps {
  assignment: Assignment;
  matches: MatchResult[];
  onClose: () => void;
  onContactConsultant: (consultant: Consultant) => void;
}

export const AIMatchResults: React.FC<AIMatchResultsProps> = ({
  assignment,
  matches,
  onClose,
  onContactConsultant
}) => {
  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(null);
  const [showMatchLetter, setShowMatchLetter] = useState(false);

  const getMatchColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-blue-600 bg-blue-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getMatchLabel = (score: number) => {
    if (score >= 90) return 'Excellent Match';
    if (score >= 80) return 'Strong Match';
    if (score >= 70) return 'Good Match';
    return 'Potential Match';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">AI Match Results</h2>
              <p className="text-gray-600">
                Found {matches.length} consultant matches for "{assignment.title}"
              </p>
            </div>
            <Button variant="ghost" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-4">
            {matches.map((match, index) => (
              <Card key={match.consultant.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{match.consultant.name}</h3>
                        <p className="text-gray-600">{match.consultant.roles?.[0] || 'Consultant'}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm">{match.consultant.rating || 5.0}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm text-gray-600">{match.consultant.experience}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm text-gray-600">{match.consultant.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getMatchColor(match.totalMatchScore)}`}>
                        {match.totalMatchScore}% Match
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {getMatchLabel(match.totalMatchScore)}
                      </p>
                    </div>
                  </div>

                  {/* Match Breakdown */}
                  <div className="grid md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Target className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Technical</span>
                      </div>
                      <div className="text-lg font-bold text-blue-600">{match.technicalFit}%</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Heart className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium">Cultural</span>
                      </div>
                      <div className="text-lg font-bold text-purple-600">{match.culturalFit}%</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Clock className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Response</span>
                      </div>
                      <div className="text-lg font-bold text-green-600">{match.responseTime}</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <DollarSign className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm font-medium">Savings</span>
                      </div>
                      <div className="text-lg font-bold text-yellow-600">{match.estimatedSavings}</div>
                    </div>
                  </div>

                  {/* Skills & Values */}
                  <div className="space-y-3 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Matched Skills</h4>
                      <div className="flex flex-wrap gap-1">
                        {match.matchedSkills.map(skill => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {match.matchedValues.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Aligned Values</h4>
                        <div className="flex flex-wrap gap-1">
                          {match.matchedValues.map(value => (
                            <Badge key={value} variant="outline" className="text-xs">
                              {value}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        setSelectedMatch(match);
                        setShowMatchLetter(true);
                      }}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <MessageSquare className="h-4 w-4" />
                      View AI Match Letter
                    </Button>
                    <Button
                      onClick={() => onContactConsultant(match.consultant)}
                      className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Mail className="h-4 w-4" />
                      Contact Consultant
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Match Letter Dialog */}
          <Dialog open={showMatchLetter} onOpenChange={setShowMatchLetter}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  AI Match Letter - {selectedMatch?.consultant.name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-2">
                    Subject: Match Recommendation – {selectedMatch?.consultant.name} for {assignment.title}
                  </div>
                  <div className="whitespace-pre-line text-sm leading-relaxed">
                    {selectedMatch?.matchLetter}
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowMatchLetter(false)}>
                    Close
                  </Button>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => selectedMatch && onContactConsultant(selectedMatch.consultant)}
                  >
                    Contact This Consultant
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};
