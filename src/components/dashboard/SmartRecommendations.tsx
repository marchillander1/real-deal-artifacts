
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Target, Users, TrendingUp, Clock, Star } from 'lucide-react';
import { Consultant } from '@/types/consultant';
import { Assignment } from '@/types/assignment';

interface SmartRecommendationsProps {
  consultants: Consultant[];
  assignments: Assignment[];
  onCreateAssignment: () => void;
}

export const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({
  consultants,
  assignments,
  onCreateAssignment
}) => {
  // Smart recommendation logic
  const generateRecommendations = () => {
    const recommendations = [];
    
    // Recommendation 1: Underutilized high-skill consultants
    const highSkillAvailable = consultants.filter(c => 
      c.availability === 'Available' && 
      c.skills && c.skills.length > 8 &&
      c.rating && c.rating >= 4.5
    );
    
    if (highSkillAvailable.length > 0) {
      recommendations.push({
        id: 1,
        type: 'opportunity',
        icon: Star,
        title: 'Underutilized top consultants',
        description: `${highSkillAvailable.length} highly skilled consultants (4.5+ rating) waiting for assignments`,
        action: 'Create premium assignment',
        priority: 'high',
        impact: 'High revenue & satisfaction',
        consultants: highSkillAvailable.slice(0, 3),
        onClick: onCreateAssignment
      });
    }

    // Recommendation 2: Skills gap analysis
    const demandedSkills = assignments.flatMap(a => a.requiredSkills || []);
    const availableSkills = consultants.flatMap(c => c.skills || []);
    const skillsGap = demandedSkills.filter(skill => 
      !availableSkills.includes(skill)
    );
    
    if (skillsGap.length > 0) {
      recommendations.push({
        id: 2,
        type: 'gap',
        icon: Target,
        title: 'Skills gap identified',
        description: `${skillsGap.length} demanded skills are missing in the network`,
        action: 'Recruit expertise',
        priority: 'high',
        impact: 'Cover market needs',
        skills: skillsGap.slice(0, 5)
      });
    }

    // Recommendation 3: Optimal timing for assignments
    const currentHour = new Date().getHours();
    const isOptimalTime = currentHour >= 9 && currentHour <= 16;
    
    if (isOptimalTime && assignments.filter(a => a.status === 'open').length > 0) {
      recommendations.push({
        id: 3,
        type: 'timing',
        icon: Clock,
        title: 'Optimal matching time',
        description: 'Consultants are most active now - perfect for quick matching',
        action: 'Start matching',
        priority: 'medium',
        impact: '3x faster response',
        timing: 'Now'
      });
    }

    // Recommendation 4: Network growth opportunity
    const networkConsultants = consultants.filter(c => c.type === 'new');
    if (networkConsultants.length > 5) {
      recommendations.push({
        id: 4,
        type: 'growth',
        icon: Users,
        title: 'Network growth',
        description: `${networkConsultants.length} new consultants waiting for evaluation`,
        action: 'Review profiles',
        priority: 'medium',
        impact: 'Expand capacity',
        growth: `+${Math.round(networkConsultants.length / consultants.length * 100)}%`
      });
    }

    return recommendations;
  };

  const recommendations = generateRecommendations();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge className="bg-red-100 text-red-800">High priority</Badge>;
      case 'medium': return <Badge className="bg-yellow-100 text-yellow-800">Medium priority</Badge>;
      case 'low': return <Badge className="bg-green-100 text-green-800">Low priority</Badge>;
      default: return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-indigo-600" />
          Smart Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec) => {
            const IconComponent = rec.icon;
            return (
              <div
                key={rec.id}
                className={`p-4 border-l-4 rounded-r-lg ${getPriorityColor(rec.priority)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-5 w-5 text-indigo-600" />
                    <div>
                      <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                      <p className="text-sm text-gray-600">{rec.description}</p>
                    </div>
                  </div>
                  {getPriorityBadge(rec.priority)}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-indigo-600 font-medium">Impact: {rec.impact}</span>
                    {rec.timing && (
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        {rec.timing}
                      </Badge>
                    )}
                    {rec.growth && (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">
                        {rec.growth} growth
                      </Badge>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={rec.onClick}
                  >
                    {rec.action}
                  </Button>
                </div>

                {/* Additional details */}
                {rec.consultants && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-2">Top consultants:</p>
                    <div className="flex gap-2">
                      {rec.consultants.map((consultant, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {consultant.name} ({consultant.rating}⭐)
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {rec.skills && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-2">Missing skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {rec.skills.map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs bg-red-50 text-red-700">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {recommendations.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Sparkles className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p>No recommendations right now. System is analyzing data...</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
