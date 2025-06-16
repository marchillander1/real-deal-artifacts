
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Users, Target, TrendingUp, Star, Award } from 'lucide-react';
import { Consultant } from '@/types/consultant';

interface ConsultantAnalysisCardProps {
  consultant: Consultant;
}

export const ConsultantAnalysisCard: React.FC<ConsultantAnalysisCardProps> = ({ consultant }) => {
  return (
    <div className="space-y-4">
      {/* CV Analysis */}
      {consultant.cvAnalysis && (
        <Card className="border border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-blue-800 flex items-center gap-2">
              <Brain className="h-4 w-4" />
              CV Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-medium text-gray-700">Experience:</span>
                <div className="text-blue-700 font-medium">{consultant.cvAnalysis.experience}</div>
              </div>
              <div>
                <span className="font-medium text-gray-700">Level:</span>
                <div className="text-blue-700 font-medium">{consultant.cvAnalysis.seniorityLevel}</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-xs text-gray-700 mb-1">Key Strengths</h4>
              <div className="flex flex-wrap gap-1">
                {consultant.cvAnalysis.strengths?.slice(0, 3).map((strength, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {strength}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-xs text-gray-700 mb-1">Market Position</h4>
              <p className="text-xs text-gray-600">{consultant.cvAnalysis.marketPosition}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* LinkedIn Analysis */}
      {consultant.linkedinAnalysis && (
        <Card className="border border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-green-800 flex items-center gap-2">
              <Users className="h-4 w-4" />
              LinkedIn Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-medium text-xs text-gray-700 mb-1">Communication Style</h4>
              <p className="text-xs text-gray-600">{consultant.linkedinAnalysis.communicationStyle}</p>
            </div>
            <div>
              <h4 className="font-medium text-xs text-gray-700 mb-1">Leadership Style</h4>
              <p className="text-xs text-gray-600">{consultant.linkedinAnalysis.leadershipStyle}</p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="font-medium text-gray-700">Cultural Fit:</span>
                <div className="flex items-center gap-1">
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div 
                      className="bg-green-600 h-1 rounded-full" 
                      style={{ width: `${(consultant.linkedinAnalysis.culturalFit / 5) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs">{consultant.linkedinAnalysis.culturalFit}/5</span>
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-700">Leadership:</span>
                <div className="flex items-center gap-1">
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div 
                      className="bg-orange-600 h-1 rounded-full" 
                      style={{ width: `${(consultant.linkedinAnalysis.leadership / 5) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs">{consultant.linkedinAnalysis.leadership}/5</span>
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-700">Innovation:</span>
                <div className="flex items-center gap-1">
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div 
                      className="bg-purple-600 h-1 rounded-full" 
                      style={{ width: `${(consultant.linkedinAnalysis.innovation / 5) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs">{consultant.linkedinAnalysis.innovation}/5</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Work Preferences */}
      {(consultant.workStyle || consultant.values?.length > 0) && (
        <Card className="border border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-purple-800 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Work Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {consultant.workStyle && (
              <div>
                <h4 className="font-medium text-xs text-gray-700 mb-1">Work Style</h4>
                <p className="text-xs text-gray-600">{consultant.workStyle}</p>
              </div>
            )}
            {consultant.values && consultant.values.length > 0 && (
              <div>
                <h4 className="font-medium text-xs text-gray-700 mb-1">Values</h4>
                <div className="flex flex-wrap gap-1">
                  {consultant.values.slice(0, 4).map((value, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {value}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
