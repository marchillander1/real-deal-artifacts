
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, User, Briefcase, MapPin, Clock, Award, TrendingUp, FileText, Linkedin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface CVAnalysisResult {
  personalInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
  };
  professionalSummary?: {
    currentRole?: string;
    yearsOfExperience?: number;
    industryExpertise?: string[];
  };
  technicalExpertise?: {
    programmingLanguages?: {
      expert?: string[];
      intermediate?: string[];
      beginner?: string[];
    };
    frameworks?: string[];
    databases?: string[];
    cloudPlatforms?: string[];
    devOps?: string[];
  };
  marketPositioning?: {
    hourlyRateEstimate?: {
      recommended?: number;
      range?: {
        min: number;
        max: number;
      };
    };
    competitiveAdvantages?: string[];
    improvementAreas?: string[];
  };
  certifications?: string[];
  education?: Array<{
    degree?: string;
    institution?: string;
    year?: string;
  }>;
}

const CVUploadComplete: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [analysis, setAnalysis] = useState<CVAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const sessionToken = searchParams.get('session');

  useEffect(() => {
    if (sessionToken) {
      loadAnalysisResults();
    } else {
      setLoading(false);
    }
  }, [sessionToken]);

  const loadAnalysisResults = async () => {
    try {
      const { data, error } = await supabase
        .from('analysis_sessions')
        .select('*')
        .eq('session_token', sessionToken)
        .single();

      if (error) throw error;

      if (data?.consultant_id) {
        const { data: consultant, error: consultantError } = await supabase
          .from('consultants')
          .select('cv_analysis_data')
          .eq('id', data.consultant_id)
          .single();

        if (consultantError) throw consultantError;

        if (consultant?.cv_analysis_data) {
          setAnalysis(consultant.cv_analysis_data);
        }
      }
    } catch (error) {
      console.error('Error loading analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToMyConsultants = async () => {
    if (!analysis?.personalInfo?.name || !sessionToken) return;

    setSaving(true);
    try {
      // Get current user and their profile
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        toast({
          title: "Authentication required",
          description: "Please log in to save consultants to your team",
          variant: "destructive",
        });
        return;
      }

      // Get user's profile to get company info
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('company')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      }

      // Get the existing consultant data from the session
      const { data: sessionData } = await supabase
        .from('analysis_sessions')
        .select('consultant_id')
        .eq('session_token', sessionToken)
        .single();

      if (sessionData?.consultant_id) {
        // Update existing consultant to link to current user and set company_id
        const { error: updateError } = await supabase
          .from('consultants')
          .update({
            user_id: user.id,
            company_id: profile?.company || null,
            type: 'existing',
            updated_at: new Date().toISOString(),
          })
          .eq('id', sessionData.consultant_id);

        if (updateError) throw updateError;

        toast({
          title: "✅ Consultant saved to your team!",
          description: `${analysis.personalInfo.name} has been added to your team's consultant database`,
        });

        // Navigate back to consultants with success
        navigate('/matchwiseai?tab=consultants&success=team-member-added');
      }
    } catch (error: any) {
      console.error('Error saving consultant:', error);
      toast({
        title: "Save failed",
        description: error.message || "Failed to save consultant to your team",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Analysis not found</h1>
          <Button onClick={() => navigate('/cv-upload')}>Upload New CV</Button>
        </div>
      </div>
    );
  }

  const personalInfo = analysis.personalInfo || {};
  const professionalSummary = analysis.professionalSummary || {};
  const technicalExpertise = analysis.technicalExpertise || {};
  const marketPositioning = analysis.marketPositioning || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">CV Analysis Complete!</h1>
          <p className="text-slate-600">We've analyzed the CV and extracted key information</p>
        </div>

        {/* Analysis Results */}
        <div className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600">Name</p>
                  <p className="font-semibold text-lg">{personalInfo.name || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Email</p>
                  <p className="font-medium">{personalInfo.email || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Phone</p>
                  <p className="font-medium">{personalInfo.phone || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Location</p>
                  <p className="font-medium flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {personalInfo.location || 'Not specified'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Professional Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600">Current Role</p>
                  <p className="font-semibold">{professionalSummary.currentRole || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 flex items-center gap-1 mb-2">
                    <Clock className="h-4 w-4" />
                    Years of Experience
                  </p>
                  <Badge variant="secondary">
                    {professionalSummary.yearsOfExperience || 0} years
                  </Badge>
                </div>
                {professionalSummary.industryExpertise && professionalSummary.industryExpertise.length > 0 && (
                  <div>
                    <p className="text-sm text-slate-600 mb-2">Industry Expertise</p>
                    <div className="flex flex-wrap gap-2">
                      {professionalSummary.industryExpertise.map((industry, index) => (
                        <Badge key={index} variant="outline">{industry}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Technical Skills */}
          {technicalExpertise.programmingLanguages?.expert && technicalExpertise.programmingLanguages.expert.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Technical Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-600 mb-2">Expert Level</p>
                    <div className="flex flex-wrap gap-2">
                      {technicalExpertise.programmingLanguages.expert.map((skill, index) => (
                        <Badge key={index} className="bg-green-100 text-green-800">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  {technicalExpertise.programmingLanguages.intermediate && technicalExpertise.programmingLanguages.intermediate.length > 0 && (
                    <div>
                      <p className="text-sm text-slate-600 mb-2">Intermediate Level</p>
                      <div className="flex flex-wrap gap-2">
                        {technicalExpertise.programmingLanguages.intermediate.map((skill, index) => (
                          <Badge key={index} className="bg-yellow-100 text-yellow-800">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Market Positioning */}
          {marketPositioning.hourlyRateEstimate && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Market Positioning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-600">Recommended Hourly Rate</p>
                    <p className="text-2xl font-bold text-green-600">
                      {marketPositioning.hourlyRateEstimate.recommended} SEK/hour
                    </p>
                    {marketPositioning.hourlyRateEstimate.range && (
                      <p className="text-sm text-slate-500">
                        Range: {marketPositioning.hourlyRateEstimate.range.min} - {marketPositioning.hourlyRateEstimate.range.max} SEK/hour
                      </p>
                    )}
                  </div>
                  {marketPositioning.competitiveAdvantages && marketPositioning.competitiveAdvantages.length > 0 && (
                    <div>
                      <p className="text-sm text-slate-600 mb-2">Competitive Advantages</p>
                      <div className="flex flex-wrap gap-2">
                        {marketPositioning.competitiveAdvantages.map((advantage, index) => (
                          <Badge key={index} className="bg-blue-100 text-blue-800">{advantage}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center mt-8">
          <Button
            onClick={handleSaveToMyConsultants}
            disabled={saving}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
          >
            {saving ? 'Saving...' : 'Save to My Team'}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/matchwiseai?tab=consultants')}
            className="px-8 py-3"
          >
            View All Consultants
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CVUploadComplete;
