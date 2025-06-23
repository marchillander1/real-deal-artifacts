
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, UserCheck, Upload, Bell } from 'lucide-react';

interface ConsultantStatsProps {
  totalConsultants: number;
  teamConsultants: number;
  networkConsultants: number;
}

export const ConsultantStats: React.FC<ConsultantStatsProps> = ({
  totalConsultants,
  teamConsultants,
  networkConsultants
}) => {
  return (
    <div className="grid md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Total Consultants</p>
              <p className="text-2xl font-bold">{totalConsultants}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <UserCheck className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Team Consultants</p>
              <p className="text-2xl font-bold">{teamConsultants}</p>
              <p className="text-xs text-green-600">Shared with team</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Upload className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Network Consultants</p>
              <p className="text-2xl font-bold">{networkConsultants}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-orange-600" />
            <div>
              <p className="text-sm text-gray-600">Live Updates</p>
              <p className="text-2xl font-bold">ON</p>
              <p className="text-xs text-orange-600">Real-time notifications</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
