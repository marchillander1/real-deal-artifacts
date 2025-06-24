
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, BookOpen, Trophy, TrendingUp } from 'lucide-react';

interface CareerInsightsSectionProps {
  consultant: any;
}

export const CareerInsightsSection: React.FC<CareerInsightsSectionProps> = ({ consultant }) => {
  // Mock data for AI recommendations
  const mockRecommendations = {
    cv_tips: [
      "Lägg till fler kvantifierbara resultat från tidigare projekt",
      "Inkludera specifika teknologiversioner och kompetensnivåer", 
      "Framhäv ledarskapsroller och teamledningserfarenhet",
      "Lägg till branschspecifika prestationer och erkännanden"
    ],
    linkedin_tips: [
      "Dela fler tekniska insights och thought leadership-artiklar",
      "Engagera dig mer aktivt i relevanta professionella grupper",
      "Posta case studies och framgångshistorier från projekt",
      "Koppla upp dig med branschledare och potentiella klienter"
    ],
    certification_recommendations: [
      "AWS Solutions Architect Professional",
      "Google Cloud Professional Cloud Architect",
      "Certified Kubernetes Administrator (CKA)",
      "PMP - Project Management Professional"
    ],
    suggested_learning_paths: [
      "Avancerad molnarkitektur och mikroservices",
      "AI/ML-integration i affärsapplikationer", 
      "DevOps och Site Reliability Engineering",
      "Strategisk teknologiledarskap"
    ]
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">AI-rekommendationer & karriärutveckling</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CV Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              CV-förbättringar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockRecommendations.cv_tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm">{tip}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* LinkedIn Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              LinkedIn-optimering
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockRecommendations.linkedin_tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm">{tip}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Certification Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trophy className="h-5 w-5 text-purple-500" />
              Rekommenderade certifieringar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockRecommendations.certification_recommendations.map((cert, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="w-full justify-start p-3 h-auto hover:bg-purple-50"
                >
                  <Trophy className="h-4 w-4 mr-2 text-purple-500" />
                  {cert}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Learning Paths */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-green-500" />
              Föreslagna utbildningsvägar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockRecommendations.suggested_learning_paths.map((path, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="w-full justify-start p-3 h-auto hover:bg-green-50"
                >
                  <BookOpen className="h-4 w-4 mr-2 text-green-500" />
                  {path}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
