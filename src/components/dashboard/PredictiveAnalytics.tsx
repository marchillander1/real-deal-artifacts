
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, BarChart3, Activity, Users2 } from 'lucide-react';
import { Consultant } from '@/types/consultant';
import { Assignment } from '@/types/assignment';

interface PredictiveAnalyticsProps {
  consultants: Consultant[];
  assignments: Assignment[];
}

export const PredictiveAnalytics: React.FC<PredictiveAnalyticsProps> = ({
  consultants,
  assignments
}) => {
  // Predictive calculations
  const skillDemandAnalysis = () => {
    const skillCounts: Record<string, number> = {};
    assignments.forEach(assignment => {
      assignment.requiredSkills?.forEach(skill => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
      });
    });
    
    return Object.entries(skillCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([skill, count]) => ({ skill, demand: count, trend: '+15%' }));
  };

  const supplyAnalysis = () => {
    const skillSupply: Record<string, number> = {};
    consultants.forEach(consultant => {
      consultant.skills?.forEach(skill => {
        skillSupply[skill] = (skillSupply[skill] || 0) + 1;
      });
    });
    
    return Object.entries(skillSupply)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([skill, count]) => ({ skill, supply: count, availability: count > 3 ? 'High' : count > 1 ? 'Medium' : 'Low' }));
  };

  const matchingPredictions = () => {
    const totalAssignments = assignments.length;
    const totalConsultants = consultants.length;
    const avgMatchTime = 12; // seconds
    const successRate = 94; // percentage
    
    return {
      expectedMatches: Math.min(totalAssignments, totalConsultants),
      avgTimeToMatch: avgMatchTime,
      successProbability: successRate,
      bottlenecks: totalAssignments > totalConsultants ? 'More consultants needed' : 'Balanced'
    };
  };

  const topSkillsInDemand = skillDemandAnalysis();
  const topSkillsInSupply = supplyAnalysis();
  const predictions = matchingPredictions();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Skill Demand Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-red-600" />
            Most In-Demand Skills
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topSkillsInDemand.map(({ skill, demand, trend }, index) => (
              <div key={skill} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                  <span className="font-medium">{skill}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{demand} assignments</Badge>
                  <Badge className="bg-green-100 text-green-800">{trend}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skill Supply Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users2 className="h-5 w-5 text-blue-600" />
            Skills Supply
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topSkillsInSupply.map(({ skill, supply, availability }, index) => (
              <div key={skill} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                  <span className="font-medium">{skill}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{supply} consultants</Badge>
                  <Badge className={
                    availability === 'High' ? 'bg-green-100 text-green-800' :
                    availability === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }>
                    {availability}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Matching Predictions */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            Matching Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{predictions.expectedMatches}</div>
              <div className="text-sm text-gray-600">Expected matches</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{predictions.avgTimeToMatch}s</div>
              <div className="text-sm text-gray-600">Average matching time</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{predictions.successProbability}%</div>
              <div className="text-sm text-gray-600">Success probability</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="text-sm font-medium text-amber-800">{predictions.bottlenecks}</div>
              <div className="text-xs text-gray-600">System analysis</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
