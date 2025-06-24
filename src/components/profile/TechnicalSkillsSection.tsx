
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code, Wrench, Award } from 'lucide-react';

interface TechnicalSkillsSectionProps {
  consultant: any;
}

export const TechnicalSkillsSection: React.FC<TechnicalSkillsSectionProps> = ({ consultant }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Teknisk kompetens</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Primary Tech Stack */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Code className="h-5 w-5 text-blue-600" />
              Huvudteknologier
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {consultant.primary_tech_stack?.map((tech: string, index: number) => (
                <Badge 
                  key={index} 
                  variant="default" 
                  className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                >
                  {tech}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-3">
              Expertis inom dessa teknologier med djup förståelse och praktisk erfarenhet
            </p>
          </CardContent>
        </Card>

        {/* Secondary Tech Stack */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Wrench className="h-5 w-5 text-green-600" />
              Kompletterande teknologier
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {consultant.secondary_tech_stack?.map((tech: string, index: number) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="bg-green-100 text-green-800 hover:bg-green-200"
                >
                  {tech}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-3">
              Stödjande teknologier och verktyg som förstärker huvudkompetensen
            </p>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Award className="h-5 w-5 text-purple-600" />
              Certifieringar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {consultant.certifications?.map((cert: string, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">{cert}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-3">
              Validerad expertis genom branscherkända certifieringar
            </p>
          </CardContent>
        </Card>
      </div>

      {/* All Skills Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Alla tekniska färdigheter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {consultant.skills?.map((skill: string, index: number) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="hover:bg-gray-100"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
