
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  TrendingUp, 
  Users, 
  Lightbulb, 
  Target, 
  Clock,
  ArrowRight,
  Zap,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Consultant } from '@/types/consultant';
import { Assignment } from '@/types/assignment';

interface AIInsightsSectionProps {
  consultants: Consultant[];
  assignments: Assignment[];
  onCreateAssignment: () => void;
}

export const AIInsightsSection: React.FC<AIInsightsSectionProps> = ({
  consultants,
  assignments,
  onCreateAssignment
}) => {
  // AI Analysis Logic
  const availableConsultants = consultants.filter(c => c.availability === 'Available');
  const highSkillConsultants = consultants.filter(c => c.skills && c.skills.length > 8);
  const recentConsultants = consultants.filter(c => c.last_active === 'Today' || c.last_active === 'Yesterday');
  const openAssignments = assignments.filter(a => a.status === 'open');
  const highPriorityAssignments = assignments.filter(a => a.urgency === 'High');

  // Predictive Insights
  const insights = [
    {
      id: 1,
      type: 'opportunity',
      icon: Target,
      title: 'High matching potential identified',
      description: `${highSkillConsultants.length} consultants with broad expertise are available right now`,
      action: 'Create new assignment',
      urgency: 'medium',
      prediction: '85% probability for quick matching',
      onClick: onCreateAssignment
    },
    {
      id: 2,
      type: 'trend',
      icon: TrendingUp,
      title: 'Demand for React developers increasing',
      description: 'AI predicts 40% increase next month based on market data',
      action: 'Recruit more React developers',
      urgency: 'high',
      prediction: 'Market trend ongoing'
    },
    {
      id: 3,
      type: 'efficiency',
      icon: Zap,
      title: 'Optimize your matching',
      description: `${recentConsultants.length} active consultants waiting for assignments`,
      action: 'Show active consultants',
      urgency: 'medium',
      prediction: '3x faster matching possible'
    }
  ];

  // Nudges based on current state
  const nudges = [
    {
      id: 1,
      type: 'action',
      icon: AlertTriangle,
      title: 'Urgent assignments need attention',
      description: `${highPriorityAssignments.length} high priority assignments waiting for matching`,
      cta: 'Match now',
      severity: 'high'
    },
    {
      id: 2,
      type: 'opportunity',
      icon: Users,
      title: 'New consultants in network',
      description: `${consultants.filter(c => c.type === 'new').length} new profiles to evaluate`,
      cta: 'Review profiles',
      severity: 'medium'
    },
    {
      id: 3,
      type: 'success',
      icon: CheckCircle,
      title: 'Strong matching history',
      description: 'Your latest matching received 95% satisfaction',
      cta: 'See details',
      severity: 'low'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'high': return <Badge className="bg-red-100 text-red-800">High priority</Badge>;
      case 'medium': return <Badge className="bg-yellow-100 text-yellow-800">Medium priority</Badge>;
      case 'low': return <Badge className="bg-green-100 text-green-800">Low priority</Badge>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Insights & Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {insights.map((insight) => {
              const IconComponent = insight.icon;
              return (
                <div
                  key={insight.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  onClick={insight.onClick}
                >
                  <div className="flex items-start justify-between mb-3">
                    <IconComponent className="h-5 w-5 text-purple-600" />
                    {getUrgencyBadge(insight.urgency)}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{insight.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                  <p className="text-xs text-purple-600 font-medium mb-3">{insight.prediction}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    {insight.action}
                    <ArrowRight className="h-3 w-3 ml-2" />
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Smart Nudges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-600" />
            Smart Reminders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {nudges.map((nudge) => {
              const IconComponent = nudge.icon;
              return (
                <div
                  key={nudge.id}
                  className={`p-4 border rounded-lg ${getSeverityColor(nudge.severity)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-5 w-5" />
                      <div>
                        <h4 className="font-medium text-gray-900">{nudge.title}</h4>
                        <p className="text-sm text-gray-600">{nudge.description}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      {nudge.cta}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Performance & Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">12s</div>
              <div className="text-sm text-gray-600">Average matching time</div>
              <div className="text-xs text-green-600">↓ 67% faster</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">94%</div>
              <div className="text-sm text-gray-600">Matching success</div>
              <div className="text-xs text-green-600">↑ +12% this month</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{availableConsultants.length}</div>
              <div className="text-sm text-gray-600">Available now</div>
              <div className="text-xs text-blue-600">Ready for assignments</div>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">{openAssignments.length}</div>
              <div className="text-sm text-gray-600">Open assignments</div>
              <div className="text-xs text-gray-600">Waiting for matching</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
