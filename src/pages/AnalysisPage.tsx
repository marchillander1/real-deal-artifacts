
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ModernNavbar } from '@/components/modern/ModernNavbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { MatchWiseChat } from '@/components/MatchWiseChat';
import { EmailNotificationHandler } from '@/components/EmailNotificationHandler';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase, 
  DollarSign, 
  TrendingUp, 
  Star, 
  Award,
  Target,
  BookOpen,
  Lightbulb,
  Eye,
  MessageSquare,
  BarChart3,
  Users,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Network
} from 'lucide-react';

const AnalysisPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const consultantId = searchParams.get('id');
  const [showChat, setShowChat] = React.useState(false);
  const [isJoining, setIsJoining] = React.useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: consultant, isLoading, error } = useQuery({
    queryKey: ['consultant', consultantId],
    queryFn: async () => {
      if (!consultantId) throw new Error('No consultant ID provided');
      
      const { data, error } = await supabase
        .from('consultants')
        .select('*')
        .eq('id', consultantId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!consultantId,
  });

  const handleJoinNetwork = async () => {
    if (!consultant) return;
    
    setIsJoining(true);
    
    try {
      console.log('🌐 Joining network for consultant:', consultantId);
      console.log('📋 Consultant data:', consultant);
      
      // Update consultant type to 'new' to show in Network Consultants
      const { error: updateError } = await supabase
        .from('consultants')
        .update({ type: 'new' })
        .eq('id', consultantId);

      if (updateError) {
        throw updateError;
      }

      console.log('✅ Consultant type updated to "new"');

      // Send welcome email using EmailNotificationHandler
      const emailResult = await EmailNotificationHandler.sendWelcomeEmails({
        consultantId: consultantId,
        finalEmail: consultant.email,
        finalName: consultant.name,
        isMyConsultant: false,
        toast: toast
      });

      console.log('📧 Email sending result:', emailResult);

      toast({
        title: "Welcome to the Network!",
        description: "You're now part of our exclusive consultant network. Check your email for welcome information.",
        variant: "default",
      });
      
      navigate(`/network-success?consultant=${consultantId}`);
      
    } catch (error: any) {
      console.error('❌ Error joining network:', error);
      toast({
        title: "Network join failed",
        description: error.message || "There was an error joining the network. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
        <ModernNavbar />
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading your analysis...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !consultant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
        <ModernNavbar />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Analysis Not Found</h1>
            <p className="text-slate-600">The analysis you're looking for could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced data extraction from CV analysis
  const cvAnalysis = consultant.cv_analysis_data as any;
  const linkedinAnalysis = consultant.linkedin_analysis_data as any;
  
  console.log('📊 Raw CV Analysis Data:', cvAnalysis);
  console.log('🔗 Raw LinkedIn Analysis Data:', linkedinAnalysis);

  // Extract data with better fallback logic
  const analysisData = cvAnalysis?.analysis || {};
  
  // Get personal info with smart fallback
  const personalInfo = analysisData.personalInfo || {};
  const detectedInfo = cvAnalysis?.detectedInformation || {};
  
  // Extract experience with enhanced logic
  let yearsOfExperience = consultant.experience_years || 0;
  
  // Try to get from CV analysis first
  if (analysisData.experience?.years && analysisData.experience.years !== 'Ej specificerat') {
    const match = String(analysisData.experience.years).match(/(\d+)/);
    if (match) {
      yearsOfExperience = parseInt(match[1]);
    }
  } else if (analysisData.professionalSummary?.yearsOfExperience) {
    const match = String(analysisData.professionalSummary.yearsOfExperience).match(/(\d+)/);
    if (match) {
      yearsOfExperience = parseInt(match[1]);
    }
  }

  // Get current role with fallback
  const currentRole = analysisData.experience?.currentRole || 
                     analysisData.professionalSummary?.currentRole || 
                     personalInfo.currentRole || 
                     'Consultant';

  // Calculate seniority level
  const seniorityLevel = analysisData.experience?.level || 
                        analysisData.professionalSummary?.seniorityLevel || 
                        (yearsOfExperience >= 7 ? 'Senior' : yearsOfExperience >= 3 ? 'Mid-level' : 'Junior');

  // Enhanced technical skills extraction
  let technicalSkills = consultant.skills || [];
  
  // Extract from CV analysis with multiple sources
  if (analysisData.skills) {
    const skillsData = analysisData.skills;
    const extractedSkills = [
      ...(skillsData.technical || []),
      ...(skillsData.languages || []),
      ...(skillsData.tools || [])
    ].filter(skill => skill && skill.trim() !== '' && skill !== 'Ej specificerat');
    
    technicalSkills = [...technicalSkills, ...extractedSkills];
  }

  // Also check if there's a technicalExpertise section
  if (analysisData.technicalExpertise) {
    const techExp = analysisData.technicalExpertise;
    const extractedSkills = [
      ...(techExp.programmingLanguages?.expert || []),
      ...(techExp.programmingLanguages?.proficient || []),
      ...(techExp.programmingLanguages?.familiar || []),
      ...(techExp.frameworks || []),
      ...(techExp.tools || []),
      ...(techExp.databases || [])
    ].filter(skill => skill && skill.trim() !== '' && skill !== 'Ej specificerat');
    
    technicalSkills = [...technicalSkills, ...extractedSkills];
  }

  // Remove duplicates and clean up
  technicalSkills = [...new Set(technicalSkills)].filter(skill => 
    skill && 
    skill.trim().length > 0 && 
    skill !== 'Ej specificerat' &&
    skill !== 'Not specified'
  );

  console.log('🎯 Processed technical skills:', technicalSkills);

  // Market analysis and rate calculation
  const hourlyRate = consultant.hourly_rate || 1200;
  const rateRange = {
    minimum: Math.round(hourlyRate * 0.8),
    recommended: hourlyRate,
    maximum: Math.round(hourlyRate * 1.3)
  };

  // Extract work history
  const workHistory = analysisData.workHistory || analysisData.workExperience || [];

  // LinkedIn insights
  const communicationStyle = linkedinAnalysis?.communicationStyle || 'Professional';
  const networkingPotential = linkedinAnalysis?.overallConsultantReadiness ? 
    (linkedinAnalysis.overallConsultantReadiness >= 8 ? 'Excellent' : 
     linkedinAnalysis.overallConsultantReadiness >= 6 ? 'Good' : 'Developing') : 'Good';

  // Strengths and improvement areas
  const strengthsData = linkedinAnalysis?.bioAnalysis?.keyStrengths || [];
  const improvementAreas = linkedinAnalysis?.recommendedImprovements || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
      <ModernNavbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
              Your Comprehensive Analysis
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              AI-powered insights into your consulting potential, market value, and growth opportunities
            </p>
          </div>

          {/* Join Network CTA */}
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-blue-600 to-green-600 text-white border-0 shadow-xl">
              <CardContent className="p-8 text-center">
                <Network className="h-12 w-12 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">Ready to Join Our Network?</h2>
                <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                  Connect with premium clients and unlock exclusive consulting opportunities. 
                  Join our network of top-tier consultants today.
                </p>
                <Button
                  onClick={handleJoinNetwork}
                  disabled={isJoining}
                  className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg font-semibold"
                >
                  {isJoining ? 'Joining Network...' : 'Join Network'}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Personal Profile */}
              <Card className="shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <User className="h-8 w-8" />
                    Professional Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-slate-500" />
                        <div>
                          <p className="text-sm text-slate-500">Name</p>
                          <p className="font-semibold text-slate-900">{consultant.name}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-slate-500" />
                        <div>
                          <p className="text-sm text-slate-500">Email</p>
                          <p className="font-semibold text-slate-900">{consultant.email}</p>
                        </div>
                      </div>
                      
                      {consultant.phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-slate-500" />
                          <div>
                            <p className="text-sm text-slate-500">Phone</p>
                            <p className="font-semibold text-slate-900">{consultant.phone}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      {consultant.location && (
                        <div className="flex items-center gap-3">
                          <MapPin className="h-5 w-5 text-slate-500" />
                          <div>
                            <p className="text-sm text-slate-500">Location</p>
                            <p className="font-semibold text-slate-900">{consultant.location}</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-3">
                        <Briefcase className="h-5 w-5 text-slate-500" />
                        <div>
                          <p className="text-sm text-slate-500">Current Role</p>
                          <p className="font-semibold text-slate-900">{currentRole}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-slate-500" />
                        <div>
                          <p className="text-sm text-slate-500">Experience</p>
                          <p className="font-semibold text-slate-900">{yearsOfExperience} years ({seniorityLevel})</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Technical Skills */}
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-slate-900">
                    <Award className="h-6 w-6" />
                    Technical Expertise
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="flex flex-wrap gap-2">
                    {technicalSkills.length > 0 ? (
                      technicalSkills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-slate-500">Technical skills will be extracted from your CV analysis</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Market Valuation */}
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-slate-900">
                    <DollarSign className="h-6 w-6" />
                    Market Valuation
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-500 mb-1">Minimum Rate</p>
                      <p className="text-2xl font-bold text-slate-900">{rateRange.minimum} SEK/h</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg border-2 border-green-200">
                      <p className="text-sm text-green-600 mb-1">Recommended Rate</p>
                      <p className="text-2xl font-bold text-green-700">{rateRange.recommended} SEK/h</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-600 mb-1">Premium Rate</p>
                      <p className="text-2xl font-bold text-blue-700">{rateRange.maximum} SEK/h</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                    <h4 className="font-semibold text-slate-900 mb-2">Rate Justification</h4>
                    <p className="text-slate-700">
                      Based on your {yearsOfExperience} years of experience as a {seniorityLevel.toLowerCase()} {currentRole.toLowerCase()}, 
                      your market rate reflects your technical expertise and professional background. 
                      {technicalSkills.length > 0 && ` Your skills in ${technicalSkills.slice(0, 3).join(', ')} are particularly valuable in the current market.`}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* How You're Perceived */}
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-slate-900">
                    <Eye className="h-6 w-6" />
                    How You're Perceived
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        CV Impression
                      </h4>
                      <div className="space-y-2">
                        <p className="text-slate-700">
                          <strong>Professional Level:</strong> {seniorityLevel} professional
                        </p>
                        <p className="text-slate-700">
                          <strong>Technical Depth:</strong> {technicalSkills.length > 10 ? 'Broad technical expertise' : technicalSkills.length > 5 ? 'Solid technical foundation' : 'Focused technical skills'}
                        </p>
                        <p className="text-slate-700">
                          <strong>Experience Depth:</strong> {yearsOfExperience >= 7 ? 'Senior expert' : yearsOfExperience >= 3 ? 'Experienced professional' : 'Emerging talent'}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        LinkedIn Presence
                      </h4>
                      <div className="space-y-2">
                        <p className="text-slate-700">
                          <strong>Communication Style:</strong> {communicationStyle}
                        </p>
                        <p className="text-slate-700">
                          <strong>Networking Potential:</strong> {networkingPotential}
                        </p>
                        <p className="text-slate-700">
                          <strong>Professional Brand:</strong> {linkedinAnalysis ? 'Well-established online presence' : 'Developing online presence'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Work Experience */}
              {workHistory.length > 0 && (
                <Card className="shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-slate-900">
                      <Briefcase className="h-6 w-6" />
                      Professional Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="space-y-4">
                      {workHistory.slice(0, 3).map((job: any, index: number) => (
                        <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                          <h4 className="font-semibold text-slate-900">{job.role || job.title}</h4>
                          <p className="text-slate-600">{job.company}</p>
                          <p className="text-sm text-slate-500">{job.duration || job.period}</p>
                          {job.description && (
                            <p className="text-sm text-slate-700 mt-2">{job.description.substring(0, 200)}...</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-green-700">
                      <CheckCircle className="h-6 w-6" />
                      Key Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {strengthsData.length > 0 ? (
                        strengthsData.map((strength: string, index: number) => (
                          <div key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <p className="text-slate-700 text-sm">{strength}</p>
                          </div>
                        ))
                      ) : (
                        <>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <p className="text-slate-700 text-sm">{yearsOfExperience} years of professional experience</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <p className="text-slate-700 text-sm">Diverse technical skill set</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <p className="text-slate-700 text-sm">{seniorityLevel} level expertise</p>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-orange-600">
                      <AlertTriangle className="h-6 w-6" />
                      Growth Areas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {improvementAreas.length > 0 ? (
                        improvementAreas.map((area: string, index: number) => (
                          <div key={index} className="flex items-start gap-2">
                            <ArrowRight className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            <p className="text-slate-700 text-sm">{area}</p>
                          </div>
                        ))
                      ) : (
                        <>
                          <div className="flex items-start gap-2">
                            <ArrowRight className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            <p className="text-slate-700 text-sm">Expand LinkedIn networking presence</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <ArrowRight className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            <p className="text-slate-700 text-sm">Consider additional certifications</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <ArrowRight className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            <p className="text-slate-700 text-sm">Enhance consulting-specific skills</p>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Plan */}
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-slate-900">
                    <Target className="h-6 w-6" />
                    Recommended Action Plan
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">Immediate Actions (Next 30 days)</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <p className="text-sm text-slate-700">Update LinkedIn profile with key achievements</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <p className="text-sm text-slate-700">Set competitive hourly rate ({rateRange.recommended} SEK/h)</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <p className="text-sm text-slate-700">Join relevant professional networks</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">Long-term Growth (3-6 months)</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <p className="text-sm text-slate-700">Pursue strategic certifications</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <p className="text-sm text-slate-700">Build thought leadership content</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <p className="text-sm text-slate-700">Expand consulting skill set</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Quick Stats */}
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-slate-900">
                    <BarChart3 className="h-6 w-6" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Market Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-semibold">{consultant.rating || 4.5}/5</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Experience Level</span>
                      <Badge variant="secondary">{seniorityLevel}</Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Skills Count</span>
                      <span className="font-semibold">{technicalSkills.length}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Hourly Rate</span>
                      <span className="font-semibold text-green-600">{hourlyRate} SEK</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Certification Recommendations */}
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-slate-900">
                    <BookOpen className="h-6 w-6" />
                    Recommended Certs
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {technicalSkills.includes('AWS') || technicalSkills.includes('Cloud') ? (
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <p className="font-medium text-orange-900">AWS Solutions Architect</p>
                        <p className="text-sm text-orange-700">High demand, +25% rate increase</p>
                      </div>
                    ) : null}
                    
                    {technicalSkills.includes('React') || technicalSkills.includes('JavaScript') ? (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="font-medium text-blue-900">React Professional</p>
                        <p className="text-sm text-blue-700">Frontend specialization</p>
                      </div>
                    ) : null}
                    
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="font-medium text-purple-900">Agile/Scrum Master</p>
                      <p className="text-sm text-purple-700">Universal consulting skill</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Assistant */}
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-slate-900">
                    <Lightbulb className="h-6 w-6" />
                    AI Career Coach
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-slate-600 text-sm mb-4">
                    Get personalized advice about your consulting career
                  </p>
                  <Button 
                    onClick={() => setShowChat(true)}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    Chat with AI Coach
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <MatchWiseChat 
              analysisResults={{
                cvAnalysis: cvAnalysis,
                linkedinAnalysis: linkedinAnalysis
              }}
              isMinimized={false}
              onToggleMinimize={() => setShowChat(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisPage;
