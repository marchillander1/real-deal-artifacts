
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Brain, FileText, Linkedin, Star, TrendingUp, Users, Target, Heart, Zap, Award } from 'lucide-react';
import { Consultant } from '@/types/consultant';

interface ConsultantAnalysisModalProps {
  consultant: Consultant;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ConsultantAnalysisModal: React.FC<ConsultantAnalysisModalProps> = ({
  consultant,
  open,
  onOpenChange
}) => {
  const cvAnalysis = consultant.cvAnalysis?.analysis;
  const linkedinAnalysis = consultant.linkedinAnalysis?.analysis;

  const getSkillLevel = (score: number) => {
    if (score >= 90) return { label: 'Expert', color: 'text-green-600 bg-green-50' };
    if (score >= 75) return { label: 'Advanced', color: 'text-blue-600 bg-blue-50' };
    if (score >= 60) return { label: 'Intermediate', color: 'text-yellow-600 bg-yellow-50' };
    return { label: 'Beginner', color: 'text-gray-600 bg-gray-50' };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Brain className="h-5 w-5 text-purple-600" />
            </div>
            AI Analys - {consultant.name}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Översikt</TabsTrigger>
            <TabsTrigger value="technical">Teknisk</TabsTrigger>
            <TabsTrigger value="soft-skills">Mjuka värden</TabsTrigger>
            <TabsTrigger value="market">Marknad</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* CV Analysis Status */}
              {consultant.cvAnalysis && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-green-600" />
                      CV Analys Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Profil komplett:</span>
                        <span className="font-medium">{consultant.profile_completeness || 85}%</span>
                      </div>
                      <Progress value={consultant.profile_completeness || 85} className="h-2" />
                      
                      {cvAnalysis?.professionalSummary && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm font-medium text-blue-900 mb-1">Professionell sammanfattning:</p>
                          <p className="text-sm text-blue-800">{cvAnalysis.professionalSummary.summary}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* LinkedIn Analysis Status */}
              {consultant.linkedinAnalysis && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Linkedin className="h-4 w-4 text-blue-600" />
                      LinkedIn Analys Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Engagemang nivå:</span>
                        <Badge variant="outline" className="text-xs">
                          {consultant.linkedin_engagement_level || 'Medium'}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Thought Leadership:</span>
                        <span className="font-medium">{consultant.thought_leadership_score || 7.2}/10</span>
                      </div>
                      <Progress value={(consultant.thought_leadership_score || 7.2) * 10} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Key Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  Nyckelinsikter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Star className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-sm font-medium">Expertområde</p>
                    <p className="text-xs text-gray-600">{consultant.skills[0] || 'Fullstack Development'}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="text-sm font-medium">Team Fit</p>
                    <p className="text-xs text-gray-600">{consultant.teamFit || 'Utmärkt'}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <TrendingUp className="h-6 w-6 text-purple-600" />
                    </div>
                    <p className="text-sm font-medium">Marknadsposition</p>
                    <p className="text-xs text-gray-600">Premium tier</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technical" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  Tekniska Färdigheter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Primary Tech Stack */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Primär Tech Stack</h4>
                    <div className="grid gap-2">
                      {(consultant.primary_tech_stack || consultant.skills.slice(0, 5)).map((skill, index) => {
                        const score = 85 + Math.random() * 15; // Simulera score
                        const level = getSkillLevel(score);
                        return (
                          <div key={index} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">{skill}</Badge>
                              <Badge className={level.color}>{level.label}</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Progress value={score} className="w-20 h-2" />
                              <span className="text-xs text-gray-500">{Math.round(score)}%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Secondary Tech Stack */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Sekundär Tech Stack</h4>
                    <div className="flex flex-wrap gap-1">
                      {(consultant.secondary_tech_stack || consultant.skills.slice(5, 10)).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  {consultant.certifications.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Certifieringar</h4>
                      <div className="space-y-2">
                        {consultant.certifications.map((cert, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                            <Award className="h-4 w-4 text-green-600" />
                            <span className="text-sm">{cert}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="soft-skills" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Core Values */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Heart className="h-4 w-4 text-red-600" />
                    Kärnvärden
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {(consultant.top_values || consultant.values).map((value, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{value}</span>
                        <Progress value={80 + Math.random() * 20} className="w-16 h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Personality Traits */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-blue-600" />
                    Personlighetsdrag
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {consultant.personalityTraits.map((trait, index) => (
                      <Badge key={index} variant="outline" className="mr-1 mb-1">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Communication & Work Style */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Kommunikationsstil</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Badge variant="secondary">{consultant.communicationStyle || 'Direkt och tydlig'}</Badge>
                    <p className="text-xs text-gray-600">
                      Föredrar strukturerad kommunikation med tydliga mål och förväntningar.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Arbetsstil</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Badge variant="secondary">{consultant.workStyle || 'Självständig'}</Badge>
                    <p className="text-xs text-gray-600">
                      Trivs med autonomi men arbetar också bra i team när det behövs.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Leadership & Adaptability */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Ledarskap & Anpassningsförmåga</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm font-medium">Kulturell fit</p>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <Progress value={consultant.culturalFit * 20} className="w-16 h-2" />
                      <span className="text-xs">{consultant.culturalFit}/5</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">Anpassningsförmåga</p>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <Progress value={consultant.adaptability * 20} className="w-16 h-2" />
                      <span className="text-xs">{consultant.adaptability}/5</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">Ledarskap</p>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <Progress value={consultant.leadership * 20} className="w-16 h-2" />
                      <span className="text-xs">{consultant.leadership}/5</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="market" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Market Positioning */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    Marknadspositionering
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Nuvarande timtaxa:</span>
                      <span className="font-medium text-blue-600">
                        {consultant.market_rate_current || parseInt(consultant.rate)} SEK/h
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Optimerad timtaxa:</span>
                      <span className="font-medium text-green-600">
                        {consultant.market_rate_optimized || (parseInt(consultant.rate) * 1.2)} SEK/h
                      </span>
                    </div>
                    <div className="p-2 bg-green-50 rounded">
                      <p className="text-xs text-green-800">
                        Potential för {Math.round(((consultant.market_rate_optimized || (parseInt(consultant.rate) * 1.2)) - parseInt(consultant.rate)) / parseInt(consultant.rate) * 100)}% höjning
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Industries */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Target className="h-4 w-4 text-purple-600" />
                    Branschområden
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {(consultant.industries || ['Fintech', 'E-commerce', 'SaaS']).map((industry, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {industry}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">AI Rekommendationer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* CV Tips */}
                  {consultant.cv_tips && consultant.cv_tips.length > 0 && (
                    <div>
                      <h5 className="text-xs font-medium text-gray-700 mb-1">CV Förbättringar:</h5>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {consultant.cv_tips.slice(0, 3).map((tip, index) => (
                          <li key={index} className="flex items-start gap-1">
                            <span>•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Learning Paths */}
                  {consultant.suggested_learning_paths && consultant.suggested_learning_paths.length > 0 && (
                    <div>
                      <h5 className="text-xs font-medium text-gray-700 mb-1">Föreslagna utvecklingsområden:</h5>
                      <div className="flex flex-wrap gap-1">
                        {consultant.suggested_learning_paths.slice(0, 4).map((path, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {path}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
