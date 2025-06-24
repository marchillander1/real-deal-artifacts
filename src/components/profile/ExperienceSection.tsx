
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Globe, Calendar } from 'lucide-react';

interface ExperienceSectionProps {
  consultant: any;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ consultant }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Erfarenhet & bakgrund</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Industries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building className="h-5 w-5 text-indigo-600" />
              Branschområden
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {consultant.industries?.map((industry: string, index: number) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="bg-indigo-100 text-indigo-800"
                >
                  {industry}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-gray-600">
              Bred branschexpertis inom flera sektorer ger djup förståelse för olika affärsmodeller
            </p>
          </CardContent>
        </Card>

        {/* Experience Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-orange-600" />
              Karriärsammanfattning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total erfarenhet:</span>
                <span className="text-sm text-gray-600">{consultant.experience_years} år</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Projekt genomförda:</span>
                <span className="text-sm text-gray-600">{consultant.projects_completed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Nuvarande roll:</span>
                <span className="text-sm text-gray-600">{consultant.title}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Specialisering:</span>
                <span className="text-sm text-gray-600">Fullstack utveckling</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
