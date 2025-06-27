
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Users, TrendingUp, Calendar, Star } from 'lucide-react';
import { Consultant } from '@/types/consultant';
import { Assignment } from '@/types/assignment';

interface ActivityFeedProps {
  consultants: Consultant[];
  assignments: Assignment[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ consultants, assignments }) => {
  const networkConsultants = consultants.filter(c => c.type === 'network');
  const availableConsultants = consultants.filter(c => c.availability === 'Available');
  const highPriorityAssignments = assignments.filter(a => a.urgency === 'High');

  const activities = [
    {
      id: 1,
      type: 'new_consultants',
      icon: Users,
      title: `${networkConsultants.length} new consultants available in network`,
      description: 'Review their profiles to find potential matches',
      action: 'View Network',
      color: 'blue',
      count: networkConsultants.length
    },
    {
      id: 2,
      type: 'available_consultants',
      icon: Calendar,
      title: `${availableConsultants.length} consultants became available`,
      description: 'Ready for new assignments',
      action: 'View Available',
      color: 'green',
      count: availableConsultants.length
    },
    {
      id: 3,
      type: 'high_priority',
      icon: TrendingUp,
      title: `${highPriorityAssignments.length} high priority assignments`,
      description: 'Need immediate attention for matching',
      action: 'Review',
      color: 'red',
      count: highPriorityAssignments.length
    },
    {
      id: 4,
      type: 'ai_suggestions',
      icon: Star,
      title: 'AI matching suggestions ready',
      description: '3 potential matches identified for your open roles',
      action: 'View Matches',
      color: 'purple',
      count: 3
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-50 text-blue-900 border-blue-200';
      case 'green': return 'bg-green-50 text-green-900 border-green-200';
      case 'red': return 'bg-red-50 text-red-900 border-red-200';
      case 'purple': return 'bg-purple-50 text-purple-900 border-purple-200';
      default: return 'bg-gray-50 text-gray-900 border-gray-200';
    }
  };

  const getIconColor = (color: string) => {
    switch (color) {
      case 'blue': return 'text-blue-600';
      case 'green': return 'text-green-600';
      case 'red': return 'text-red-600';
      case 'purple': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Activity & Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities
            .filter(activity => activity.count > 0)
            .map((activity) => {
              const IconComponent = activity.icon;
              return (
                <div
                  key={activity.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${getColorClasses(activity.color)}`}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent className={`h-5 w-5 ${getIconColor(activity.color)}`} />
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm opacity-80">{activity.description}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    {activity.action}
                  </Button>
                </div>
              );
            })}
          
          {activities.every(activity => activity.count === 0) && (
            <div className="text-center py-8 text-gray-500">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p>No recent activity. Upload consultants or create assignments to get started!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
