
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Briefcase, 
  DollarSign, 
  TrendingUp, 
  Award,
  Clock,
  Target
} from 'lucide-react';

interface ProfileStatsProps {
  consultant: any;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({ consultant }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Experience */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Briefcase className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {consultant.experience_years}
              </div>
              <div className="text-sm text-gray-600">År erfarenhet</div>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Seniornivå med bred teknisk expertis
          </div>
        </CardContent>
      </Card>

      {/* Hourly Rate */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                {consultant.hourly_rate} SEK
              </div>
              <div className="text-sm text-gray-600">Per timme</div>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Konkurrenskraftig marknadsnivå
          </div>
        </CardContent>
      </Card>

      {/* Thought Leadership Score */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">
                {consultant.thought_leadership_score}%
              </div>
              <div className="text-sm text-gray-600">Thought Leadership</div>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Stark synlighet och expertis
          </div>
        </CardContent>
      </Card>

      {/* Availability */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-orange-600">
                {consultant.availability}
              </div>
              <div className="text-sm text-gray-600">Status</div>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Senast aktiv: {consultant.last_active}
          </div>
        </CardContent>
      </Card>

      {/* Projects Completed */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Target className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-indigo-600">
                {consultant.projects_completed}
              </div>
              <div className="text-sm text-gray-600">Projekt klara</div>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Genomsnittlig projektlängd: 3-6 månader
          </div>
        </CardContent>
      </Card>

      {/* Market Position */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-teal-100 rounded-lg">
              <Award className="h-6 w-6 text-teal-600" />
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-teal-600">
                Top 10%
              </div>
              <div className="text-sm text-gray-600">Marknadsposition</div>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Högt värderad inom sitt område
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
