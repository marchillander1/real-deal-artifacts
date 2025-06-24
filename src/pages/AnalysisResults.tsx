
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Brain, User, TrendingUp, Star, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface AnalysisData {
  id: string;
  consultant: any;
  ai_analysis: any;
  user_profile: any;
}

export const AnalysisResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const analysisId = searchParams.get('id');

  useEffect(() => {
    if (!analysisId) {
      toast.error('No analysis ID provided');
      navigate('/');
      return;
    }
    fetchAnalysisData();
  }, [analysisId]);

  const fetchAnalysisData = async () => {
    try {
      // Fetch AI analysis data
      const { data: aiAnalysis, error: aiError } = await supabase
        .from('ai_analysis')
        .select('*')
        .eq('id', analysisId)
        .single();

      if (aiError) throw aiError;

      // Fetch related consultant data
      const { data: consultant, error: consultantError } = await supabase
        .from('consultants')
        .select('*')
        .eq('id', aiAnalysis.consultant_id || '')
        .single();

      // Fetch user profile if available
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', aiAnalysis.user_profile_id || '')
        .single();

      setAnalysisData({
        id: analysisId,
        consultant: consultant || {},
        ai_analysis: aiAnalysis,
        user_profile: userProfile || {}
      });
    } catch (error: any) {
      console.error('Error fetching analysis data:', error);
      toast.error('Failed to load analysis data');
    } finally {
      setLoading(false);
    }
  };

  const handlePublishProfile = () => {
    navigate(`/publish-profile?analysis_id=${analysisId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-lg text-slate-600">Loading analysis results...</p>
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-slate-600">Analysis not found</p>
          <Button onClick={() => navigate('/')} className="mt-4">
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  const analysis = analysisData.ai_analysis.analysis_data || {};
  const consultant = analysisData.consultant;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            🎉 Your AI Analysis is Complete!
          </h1>
          <p className="text-lg text-slate-600">
            Here's your comprehensive professional analysis and recommendations
          </p>
        </div>

        {/* Personal Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <h3 className="font-semibold text-slate-900">{consultant?.name || 'Professional'}</h3>
                <p className="text-slate-600">{consultant?.title || 'Consultant'}</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-500" />
                <span className="text-slate-600">{consultant?.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-500" />
                <span className="text-slate-600">{consultant?.phone || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-500" />
                <span className="text-slate-600">{consultant?.location || 'Sweden'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills & Experience */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Technical Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Primary Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {(analysis?.skills?.technical || consultant?.primary_tech_stack || []).slice(0, 6).map((skill: string, index: number) => (
                      <Badge key={index} variant="default">{skill}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Tools & Platforms</h4>
                  <div className="flex flex-wrap gap-2">
                    {(analysis?.skills?.tools || consultant?.secondary_tech_stack || []).slice(0, 6).map((tool: string, index: number) => (
                      <Badge key={index} variant="secondary">{tool}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Experience & Market Position</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Experience Level</span>
                  <span className="font-semibold">{consultant?.experience_years || 0} years</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Current Market Rate</span>
                  <span className="font-semibold">{consultant?.market_rate_current || consultant?.hourly_rate || 800} SEK/h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Optimized Rate</span>
                  <span className="font-semibold text-green-600">{consultant?.market_rate_optimized || 950} SEK/h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Profile Completeness</span>
                  <span className="font-semibold">{Math.round(consultant?.profile_completeness || 85)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Soft Skills & Values */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Soft Skills & Values</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Communication Style</h4>
                <p className="text-slate-600 mb-4">
                  {analysis?.softSkills?.communicationStyle || consultant?.communication_style || 'Professional and collaborative approach to communication'}
                </p>
                <h4 className="font-medium mb-3">Work Style</h4>
                <p className="text-slate-600">
                  {analysis?.softSkills?.workStyle || consultant?.work_style || 'Structured and goal-oriented with focus on quality delivery'}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-3">Core Values</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(analysis?.softSkills?.values || consultant?.values || ['Quality', 'Innovation', 'Teamwork']).map((value: string, index: number) => (
                    <Badge key={index} variant="outline">{value}</Badge>
                  ))}
                </div>
                <h4 className="font-medium mb-3">Personality Traits</h4>
                <div className="flex flex-wrap gap-2">
                  {(analysis?.softSkills?.personalityTraits || consultant?.personality_traits || ['Analytical', 'Problem-solver']).map((trait: string, index: number) => (
                    <Badge key={index} variant="outline">{trait}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market Analysis */}
        {analysis?.marketAnalysis && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Market Analysis & Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Competitive Advantages</h4>
                  <ul className="list-disc list-inside text-slate-600 space-y-1">
                    {(analysis.marketAnalysis.competitiveAdvantages || []).map((advantage: string, index: number) => (
                      <li key={index}>{advantage}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Recommended Focus Areas</h4>
                  <p className="text-slate-600">{analysis.marketAnalysis.recommendedFocus}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <Button 
            onClick={handlePublishProfile}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-3 text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Publish My Profile to Network
          </Button>
          <div className="flex justify-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/')}>
              Return Home
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              Download Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;
