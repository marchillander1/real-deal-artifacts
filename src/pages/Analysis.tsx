
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, TrendingUp, Star, Target, Users, Briefcase, Award, BookOpen, DollarSign, BarChart3, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import jsPDF from 'jspdf';
import Logo from '@/components/Logo';

export default function Analysis() {
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
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
        title: "Could not fetch analysis",
        description: "Please ensure you have completed an analysis",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    const profile = analysisData.user_profiles;
    const analysis = analysisData.analysis_data;
    const doc = new jsPDF();
    
    // Add MatchWise logo/header
    doc.setFillColor(59, 130, 246); // Blue color
    doc.rect(0, 0, 210, 25, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('MatchWise', 15, 16);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('AI Career Analysis Report', 15, 22);
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    let yPos = 40;
    
    // Profile Header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(profile?.full_name || 'Professional Analysis', 15, yPos);
    yPos += 8;
    
    if (profile?.title) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(profile.title, 15, yPos);
      yPos += 15;
    } else {
      yPos += 10;
    }
    
    // Key Metrics
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Key Performance Metrics', 15, yPos);
    yPos += 10;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Market Position Score: ${analysisData.thought_leadership_score}/100`, 15, yPos);
    yPos += 6;
    doc.text(`Years of Experience: ${profile?.years_of_experience || 5}+`, 15, yPos);
    yPos += 6;
    doc.text(`Market Rate: $${analysis?.market_analysis?.hourly_rate_optimized || 950}/hr`, 15, yPos);
    yPos += 15;
    
    // Core Values
    if (analysisData.top_values?.length > 0) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Core Values', 15, yPos);
      yPos += 8;
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      const values = analysisData.top_values.join(', ');
      doc.text(values, 15, yPos, { maxWidth: 180 });
      yPos += 12;
    }
    
    // Technical Skills
    if (analysisData.tech_stack_primary?.length > 0) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Core Technology Stack', 15, yPos);
      yPos += 8;
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      analysisData.tech_stack_primary.forEach((skill: string) => {
        doc.text(`• ${skill}`, 15, yPos);
        yPos += 5;
      });
      yPos += 8;
    }
    
    // Personality Traits
    if (analysisData.personality_traits?.length > 0) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Personality Traits', 15, yPos);
      yPos += 8;
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      const traits = analysisData.personality_traits.join(', ');
      doc.text(traits, 15, yPos, { maxWidth: 180 });
      yPos += 12;
    }
    
    // Communication Style
    if (analysisData.communication_style) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Communication Style', 15, yPos);
      yPos += 8;
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(analysisData.communication_style, 15, yPos, { maxWidth: 180 });
      yPos += 15;
    }
    
    // Check if we need a new page
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    // Industry Expertise
    if (analysisData.industries?.length > 0) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Industry Expertise', 15, yPos);
      yPos += 8;
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      const industries = analysisData.industries.join(', ');
      doc.text(industries, 15, yPos, { maxWidth: 180 });
      yPos += 12;
    }
    
    // Certifications
    if (analysisData.certifications?.length > 0) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Current Certifications', 15, yPos);
      yPos += 8;
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      analysisData.certifications.forEach((cert: string) => {
        doc.text(`• ${cert}`, 15, yPos);
        yPos += 5;
      });
      yPos += 8;
    }
    
    // Career Recommendations
    if (analysisData.cv_tips?.length > 0 || analysisData.linkedin_tips?.length > 0) {
      if (yPos > 200) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Career Development Recommendations', 15, yPos);
      yPos += 12;
      
      if (analysisData.cv_tips?.length > 0) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('CV Enhancement Tips:', 15, yPos);
        yPos += 6;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        analysisData.cv_tips.forEach((tip: string) => {
          doc.text(`• ${tip}`, 15, yPos, { maxWidth: 180 });
          yPos += 6;
        });
        yPos += 8;
      }
      
      if (analysisData.linkedin_tips?.length > 0) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('LinkedIn Optimization:', 15, yPos);
        yPos += 6;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        analysisData.linkedin_tips.forEach((tip: string) => {
          doc.text(`• ${tip}`, 15, yPos, { maxWidth: 180 });
          yPos += 6;
        });
      }
    }
    
    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(`Generated by MatchWise AI - Page ${i} of ${pageCount}`, 15, 290);
      doc.text(`Report generated on ${new Date().toLocaleDateString()}`, 150, 290);
    }
    
    // Save the PDF
    const fileName = `${profile?.full_name?.replace(/[^a-z0-9]/gi, '_') || 'MatchWise'}_AI_Analysis.pdf`;
    doc.save(fileName);
    
    toast({
      title: "PDF Downloaded",
      description: "Your AI analysis has been saved as a PDF",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-16 w-16 text-blue-500 animate-pulse mx-auto mb-4" />
          <p className="text-lg text-slate-600">Loading your career analysis...</p>
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <Card className="max-w-md text-center p-8">
          <Brain className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">No analysis found</h2>
          <p className="text-slate-600">Upload your CV to get an AI-driven career analysis.</p>
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Brain className="h-8 w-8 text-blue-500" />
              <div>
                <h1 className="text-2xl font-bold text-slate-900">AI Career Analysis</h1>
                <p className="text-slate-600">Deep insights into your professional profile</p>
              </div>
            </div>
            <Button 
              onClick={generatePDF}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Download className="h-4 w-4" />
              Download PDF Report
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Executive Summary */}
        <Card className="mb-8 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl">{profile?.full_name}</CardTitle>
            <p className="text-lg opacity-90">{profile?.title}</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <TrendingUp className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">{analysisData.thought_leadership_score}/100</div>
                <div className="text-sm text-slate-600">Market Position</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <Star className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">{profile?.years_of_experience || 5}+</div>
                <div className="text-sm text-slate-600">Years Experience</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <Target className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">95%</div>
                <div className="text-sm text-slate-600">Profile Strength</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-xl">
                <DollarSign className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-600">${analysis?.market_analysis?.hourly_rate_optimized || 950}/hr</div>
                <div className="text-sm text-slate-600">Market Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Technical Skills Analysis */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Technical Competency Matrix
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Core Technology Stack</h4>
                  <div className="space-y-2">
                    {(analysisData.tech_stack_primary || []).map((skill: string, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <Badge variant="default" className="bg-blue-100 text-blue-800">{skill}</Badge>
                        <div className="flex items-center gap-2 flex-1 ml-4">
                          <Progress value={85 + (index * 3)} className="flex-1 h-2" />
                          <span className="text-sm text-slate-600">{85 + (index * 3)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 mt-4">Supporting Technologies</h4>
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

          {/* Market Analysis */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Market Analysis & Positioning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Current Market Rate</span>
                    <span className="text-lg font-bold text-green-600">${analysis?.market_analysis?.hourly_rate_current || 800}/hr</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Optimized Rate Potential</span>
                    <span className="text-lg font-bold text-blue-600">${analysis?.market_analysis?.hourly_rate_optimized || 950}/hr</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Market Demand</span>
                    <Badge variant="default" className="bg-green-500">{analysis?.market_analysis?.demand_level || 'High'}</Badge>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Competitive Advantages</h4>
                  <ul className="space-y-1">
                    {(analysis?.market_analysis?.competitive_advantages || ['Full-stack expertise', 'Leadership experience']).map((advantage: string, index: number) => (
                      <li key={index} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        {advantage}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Profile */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Professional Profile & Values
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Core Values</h4>
                  <div className="flex flex-wrap gap-2">
                    {(analysisData.top_values || []).map((value: string, index: number) => (
                      <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                        {value}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Personality Traits</h4>
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
                    <h4 className="font-semibold mb-2">Communication Style</h4>
                    <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                      {analysisData.communication_style}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Industry Expertise */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Industry Expertise & Credentials
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Industry Sectors</h4>
                  <div className="flex flex-wrap gap-2">
                    {(analysisData.industries || []).map((industry: string, index: number) => (
                      <Badge key={index} variant="default" className="bg-orange-100 text-orange-800">
                        {industry}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Certifications</h4>
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
        </div>

        {/* Career Development Recommendations */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Career Development & Optimization Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2 text-blue-600">CV Enhancement</h4>
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
                <h4 className="font-semibold mb-2 text-green-600">LinkedIn Optimization</h4>
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
                <h4 className="font-semibold mb-2 text-purple-600">Recommended Certifications</h4>
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

        {/* LinkedIn Engagement Analysis */}
        {analysisData.linkedin_engagement_level && (
          <Card className="mt-8 shadow-lg">
            <CardHeader>
              <CardTitle>Professional Brand & Online Presence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">LinkedIn Engagement Level</h4>
                  <p className="text-lg text-blue-600 font-medium mb-4">{analysisData.linkedin_engagement_level}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Thought Leadership Score</span>
                      <span className="text-sm font-medium">{analysisData.thought_leadership_score}/100</span>
                    </div>
                    <Progress value={analysisData.thought_leadership_score} className="h-2" />
                  </div>
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
