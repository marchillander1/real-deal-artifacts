
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Eye, 
  MessageSquare, 
  FileText,
  UserPlus,
  TrendingUp
} from 'lucide-react';

interface RecentActivityProps {
  consultant: any;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ consultant }) => {
  const activities = [
    {
      id: 1,
      type: 'profile_view',
      icon: Eye,
      title: 'Profil visad',
      description: '3 potentiella kunder tittade på din profil',
      time: '2 timmar sedan',
      count: 3
    },
    {
      id: 2,
      type: 'message',
      icon: MessageSquare,
      title: 'Nytt meddelande',
      description: 'Förfrågan om konsultuppdrag inom React utveckling',
      time: '5 timmar sedan',
      urgent: true
    },
    {
      id: 3,
      type: 'profile_update',
      icon: FileText,
      title: 'Profil uppdaterad',
      description: 'Du lade till nya färdigheter i TypeScript',
      time: '1 dag sedan'
    },
    {
      id: 4,
      type: 'network',
      icon: UserPlus,
      title: 'Ny kontakt',
      description: 'Anna Andersson la till dig i sitt nätverk',
      time: '2 dagar sedan'
    },
    {
      id: 5,
      type: 'market_update',
      icon: TrendingUp,
      title: 'Marknadstrender',
      description: 'Efterfrågan på React-utvecklare ökade med 15%',
      time: '3 dagar sedan'
    }
  ];

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'profile_view': return 'text-blue-600';
      case 'message': return 'text-green-600';
      case 'profile_update': return 'text-purple-600';
      case 'network': return 'text-orange-600';
      case 'market_update': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Senaste aktivitet
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`p-2 rounded-full bg-gray-100 ${getActivityColor(activity.type)}`}>
                  <Icon className="h-4 w-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900 truncate">
                      {activity.title}
                      {activity.count && (
                        <Badge variant="secondary" className="ml-2">
                          {activity.count}
                        </Badge>
                      )}
                      {activity.urgent && (
                        <Badge variant="destructive" className="ml-2">
                          Brådskande
                        </Badge>
                      )}
                    </p>
                    <span className="text-sm text-gray-500">{activity.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t text-center">
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            Visa all aktivitet
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
