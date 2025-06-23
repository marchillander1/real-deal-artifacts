
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, TrendingUp, Star, Target, Users, Briefcase, Award, BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function Analysis() {
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchLatestAnalysis();
  }, []);

  const fetchLatestAnalysis = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_analysis')
        .select(`
          *,
          user_profiles (*)
        `)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      setAnalysisData(data);
    } catch (error: any) {
      console.error('Error fetching analysis:', error);
      toast({
        title: "Kunde inte hämta analys",
        description: "Kontrollera att du har en genomförd analys",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-16 w-16 text-blue-500 animate-pulse mx-auto mb-4" />
          <p className="text-lg text-slate-600">Laddar din karriäranalys...</p>
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <Card className="max-w-md text-center p-8">
          <Brain className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Ingen analys hittad</h2>
          <p className="text-slate-600">Ladda upp ditt CV för att få en AI-driven karriäranalys.</p>
        </Card>
      </div>
    );
  }

  const profile = analysisData.user_profiles;
  const analysis = analysisData.analysis_data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Brain className="h-8 w-8 text-blue-500" />
            <div>
              <h1 className="text-2xl font-bold text-slate-900">AI Karriäranalys</h1>
              <p className="text-slate-600">Djupgående insikter om din professionella profil</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Profile Overview */}
        <Card className="mb-8 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl">{profile?.full_name}</CardTitle>
            <p className="text-lg opacity-90">{profile?.title}</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <TrendingUp className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">{analysisData.thought_leadership_score}/100</div>
                <div className="text-sm text-slate-600">Thought Leadership</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <Star className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">{profile?.years_of_experience || 5}+</div>
                <div className="text-sm text-slate-600">År Erfarenhet</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <Target className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">95%</div>
                <div className="text-sm text-slate-600">Profil Komplett</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Technical Skills */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Teknisk Kompetens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Primär Teknikstack</h4>
                  <div className="flex flex-wrap gap-2">
                    {(analysisData.tech_stack_primary || []).map((skill: string, index: number) => (
                      <Badge key={index} variant="default" className="bg-blue-100 text-blue-800">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Sekundär Teknikstack</h4>
                  <div className="flex flex-wrap gap-2">
                    {(analysisData.tech_stack_secondary || []).map((skill: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-slate-600">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Soft Skills & Values */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Mjuka Värden & Personlighet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Kärnvärden</h4>
                  <div className="flex flex-wrap gap-2">
                    {(analysisData.top_values || []).map((value: string, index: number) => (
                      <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                        {value}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Personlighetsdrag</h4>
                  <div className="flex flex-wrap gap-2">
                    {(analysisData.personality_traits || []).map((trait: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-purple-600">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </div>
                {analysisData.communication_style && (
                  <div>
                    <h4 className="font-semibold mb-2">Kommunikationsstil</h4>
                    <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                      {analysisData.communication_style}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Industry Experience */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Branschexpertis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Branschområden</h4>
                  <div className="flex flex-wrap gap-2">
                    {(analysisData.industries || []).map((industry: string, index: number) => (
                      <Badge key={index} variant="default" className="bg-orange-100 text-orange-800">
                        {industry}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Certifieringar</h4>
                  <div className="flex flex-wrap gap-2">
                    {(analysisData.certifications || []).map((cert: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-blue-600">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Development Recommendations */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Utvecklingsrekommendationer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">CV-förbättringar</h4>
                  <ul className="space-y-1">
                    {(analysisData.cv_tips || []).map((tip: string, index: number) => (
                      <li key={index} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">LinkedIn-optimering</h4>
                  <ul className="space-y-1">
                    {(analysisData.linkedin_tips || []).map((tip: string, index: number) => (
                      <li key={index} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Rekommenderade Certifieringar</h4>
                  <ul className="space-y-1">
                    {(analysisData.certification_recommendations || []).map((cert: string, index: number) => (
                      <li key={index} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className="text-purple-500 mt-1">•</span>
                        {cert}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* LinkedIn Engagement */}
        {analysisData.linkedin_engagement_level && (
          <Card className="mt-8 shadow-lg">
            <CardHeader>
              <CardTitle>LinkedIn Engagement & Synlighet</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Engagement Level</h4>
                  <p className="text-lg text-blue-600 font-medium">{analysisData.linkedin_engagement_level}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Brand Themes</h4>
                  <div className="flex flex-wrap gap-2">
                    {(analysisData.brand_themes || []).map((theme: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {theme}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
