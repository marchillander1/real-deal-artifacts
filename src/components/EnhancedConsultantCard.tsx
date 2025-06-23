
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Star, MapPin, Clock, Eye, Award, Brain, Users, TrendingUp } from 'lucide-react';
import { Consultant } from '@/types/consultant';

interface EnhancedConsultantCardProps {
  consultant: Consultant;
  isOwned?: boolean;
  onViewAnalysis?: (consultant: Consultant) => void;
}

export const EnhancedConsultantCard: React.FC<EnhancedConsultantCardProps> = ({ 
  consultant, 
  isOwned = false,
  onViewAnalysis 
}) => {
  // Calculate scores for display
  const culturalMatch = consultant.culturalFit ? Math.round((consultant.culturalFit / 5) * 100) : 85;
  const leadershipScore = consultant.leadership ? Math.round((consultant.leadership / 5) * 100) : 80;
  const adaptabilityScore = consultant.adaptability ? Math.round((consultant.adaptability / 5) * 100) : 90;

  const hasAnalysis = consultant.cvAnalysis || consultant.linkedinAnalysis;

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg font-semibold">{consultant.name}</CardTitle>
              {isOwned && (
                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                  Min konsult
                </Badge>
              )}
              {hasAnalysis && (
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                  <Brain className="h-3 w-3 mr-1" />
                  AI-analyserad
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-3 w-3" />
              <span>{consultant.location}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">{consultant.rating}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Experience & Rate */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Erfarenhet:</span>
            <p className="font-medium">{consultant.experience}</p>
          </div>
          <div>
            <span className="text-gray-600">Timpris:</span>
            <p className="font-medium">{consultant.rate}</p>
          </div>
        </div>

        {/* Skills */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Teknisk expertis</h4>
          <div className="flex flex-wrap gap-1">
            {consultant.skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {consultant.skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{consultant.skills.length - 3} fler
              </Badge>
            )}
          </div>
        </div>

        {/* Analysis Scores (if available) */}
        {hasAnalysis && (
          <div className="bg-gray-50 p-3 rounded-lg space-y-2">
            <h5 className="text-xs font-medium text-gray-700 mb-2">AI-analys</h5>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">Kulturell passform:</span>
                <div className="flex items-center gap-2">
                  <Progress value={culturalMatch} className="w-12 h-1" />
                  <span className="text-xs font-medium">{culturalMatch}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">Ledarskap:</span>
                <div className="flex items-center gap-2">
                  <Progress value={leadershipScore} className="w-12 h-1" />
                  <span className="text-xs font-medium">{leadershipScore}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">Anpassningsförmåga:</span>
                <div className="flex items-center gap-2">
                  <Progress value={adaptabilityScore} className="w-12 h-1" />
                  <span className="text-xs font-medium">{adaptabilityScore}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Availability */}
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-green-500" />
          <span className="text-sm text-green-600 font-medium">{consultant.availability}</span>
        </div>

        {/* Actions */}
        <div className="pt-2 space-y-2">
          {onViewAnalysis && hasAnalysis && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => onViewAnalysis(consultant)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Visa fullständig analys
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
