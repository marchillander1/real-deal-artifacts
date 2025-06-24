
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Users, MessageSquare, Lightbulb } from 'lucide-react';

interface SoftSkillsSectionProps {
  consultant: any;
}

export const SoftSkillsSection: React.FC<SoftSkillsSectionProps> = ({ consultant }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Personliga egenskaper & arbetsstil</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Values */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Heart className="h-5 w-5 text-red-500" />
              Kärnvärderingar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {consultant.values?.map((value: string, index: number) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="bg-red-100 text-red-800"
                >
                  {value}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-gray-600">
              Grundläggande värderingar som styr arbetsmetoder och beslut
            </p>
          </CardContent>
        </Card>

        {/* Personality Traits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Personlighetsdrag
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {consultant.personality_traits?.map((trait: string, index: number) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="bg-yellow-100 text-yellow-800"
                >
                  {trait}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-gray-600">
              Naturliga egenskaper som påverkar arbetsstil och teamdynamik
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Communication & Work Style */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              Kommunikationsstil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{consultant.communication_style}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-green-500" />
              Arbetsstil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{consultant.work_style}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
