
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

      // Try to fetch related consultant data if consultant_id exists in analysis_data
      let consultant = {};
      const consultantId = aiAnalysis.analysis_data?.consultant_id;
      if (consultantId) {
        const { data: consultantData } = await supabase
          .from('consultants')
          .select('*')
          .eq('id', consultantId)
          .single();
        consultant = consultantData || {};
      }

      // Fetch user profile if available
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', aiAnalysis.user_profile_id || '')
        .single();

      setAnalysisData({
        id: analysisId,
        consultant: consultant,
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
  const consultant = analysisData.consultant || {};

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
                <h3 className="font-semibold text-slate-900">{analysis?.full_name || consultant?.name || 'Professional'}</h3>
                <p className="text-slate-600">{analysis?.title || consultant?.title || 'Consultant'}</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-500" />
                <span className="text-slate-600">{analysis?.email || consultant?.email || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-500" />
                <span className="text-slate-600">{analysis?.phone || consultant?.phone || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-500" />
                <span className="text-slate-600">{analysis?.location || consultant?.location || 'Sweden'}</span>
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
                    {(analysis?.tech_stack_primary || consultant?.primary_tech_stack || ['React', 'TypeScript', 'Node.js']).slice(0, 6).map((skill: string, index: number) => (
                      <Badge key={index} variant="default">{skill}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Tools & Platforms</h4>
                  <div className="flex flex-wrap gap-2">
                    {(analysis?.tech_stack_secondary || consultant?.secondary_tech_stack || ['AWS', 'Docker', 'Git']).slice(0, 6).map((tool: string, index: number) => (
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
                  <span className="font-semibold">{analysis?.years_of_experience || consultant?.experience_years || 5} years</span>
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
