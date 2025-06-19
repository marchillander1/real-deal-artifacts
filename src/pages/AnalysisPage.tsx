
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ModernNavbar } from '@/components/modern/ModernNavbar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Target, 
  TrendingUp, 
  Award, 
  Lightbulb, 
  Brain, 
  Users,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Code,
  Briefcase,
  Star,
  MapPin,
  Mail,
  Phone,
  Eye,
  MessageSquare
} from 'lucide-react';

interface ConsultantData {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  experience_years: number;
  hourly_rate: number;
  location: string;
  cv_analysis_data: any;
  linkedin_analysis_data: any;
}

const AnalysisPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const consultantId = searchParams.get('id');
  const [consultant, setConsultant] = useState<ConsultantData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (consultantId) {
      fetchConsultantData();
    }
  }, [consultantId]);

  const fetchConsultantData = async () => {
    try {
      const { data, error } = await supabase
        .from('consultants')
        .select('*')
        .eq('id', consultantId)
        .single();

      if (error) throw error;
      
      setConsultant(data);
    } catch (error: any) {
      console.error('Error fetching consultant:', error);
      toast({
        title: "Error loading analysis",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinNetwork = async () => {
    if (!consultant) return;
    
    setIsJoining(true);
    
    try {
      const { error: updateError } = await supabase
        .from('consultants')
        .update({ 
          type: 'network',
          updated_at: new Date().toISOString()
        })
        .eq('id', consultant.id);

      if (updateError) throw updateError;

      // Send welcome email
      const { error: emailError } = await supabase.functions.invoke('send-welcome-email', {
        body: {
          consultantEmail: consultant.email,
          consultantName: consultant.name,
          isMyConsultant: false
        }
      });

      if (emailError) {
        console.warn('Email sending failed:', emailError);
      }

      toast({
        title: "Welcome to MatchWise Network! 🎉",
        description: "You're now visible to potential clients. Check your email for next steps.",
      });

      // Navigate to success page instead of home
      navigate(`/network-success?consultant=${consultant.id}`);

    } catch (error: any) {
      console.error('Error joining network:', error);
      toast({
        title: "Failed to join network",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
      setIsJoining(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
        <ModernNavbar />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading your personalized analysis...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!consultant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
        <ModernNavbar />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Analysis not found</h1>
            <p className="text-slate-600">Please try uploading your CV again.</p>
          </div>
        </div>
      </div>
    );
  }

  const cvData = consultant.cv_analysis_data?.analysis;
  const linkedinData = consultant.linkedin_analysis_data;
  
  // Extract technical skills from CV analysis
  const extractTechnicalSkills = () => {
    const skills = [];
    if (cvData?.technicalExpertise) {
      const tech = cvData.technicalExpertise;
      if (tech.programmingLanguages) {
        skills.push(...(tech.programmingLanguages.expert || []));
        skills.push(...(tech.programmingLanguages.proficient || []));
        skills.push(...(tech.programmingLanguages.familiar || []));
      }
      skills.push(...(tech.frameworks || []));
      skills.push(...(tech.tools || []));
      skills.push(...(tech.databases || []));
    }
    if (cvData?.skills) {
      skills.push(...(cvData.skills.technical || []));
      skills.push(...(cvData.skills.languages || []));
      skills.push(...(cvData.skills.tools || []));
    }
    // Also include skills from consultant profile
    skills.push(...(consultant.skills || []));
    
    return [...new Set(skills.filter(skill => skill && skill.trim() !== ''))];
  };

  const technicalSkills = extractTechnicalSkills();
  
  // Extract work experience
  const workExperience = cvData?.workExperience || [];
  
  // Calculate experience years
  const experienceYears = consultant.experience_years || 
    (cvData?.professionalSummary?.yearsOfExperience ? 
     parseInt(cvData.professionalSummary.yearsOfExperience.toString()) || 0 : 0);

  // Market rate estimation
  const currentRate = consultant.hourly_rate;
  const recommendedRate = cvData?.marketPositioning?.hourlyRateEstimate?.recommended || 0;
  const optimizedRate = Math.max(currentRate * 1.2, recommendedRate * 1.1, 1200);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
      <ModernNavbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 p-3 rounded-full">
                <Target className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              🎯 Your Personal Consultant Analysis
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              This comprehensive report analyzes your current profile and provides actionable insights to improve your visibility, increase your hourly rate, and find better assignments faster.
            </p>
          </div>

          {/* Profile Summary */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-6 md:mb-0">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">{consultant.name}</h2>
                <div className="flex items-center gap-4 text-slate-600 mb-4">
                  {consultant.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{consultant.location}</span>
                    </div>
                  )}
                  {consultant.email && consultant.email !== 'Not specified' && (
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      <span>{consultant.email}</span>
                    </div>
                  )}
                  {consultant.phone && consultant.phone !== 'Not specified' && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span>{consultant.phone}</span>
                    </div>
                  )}
                </div>
                <p className="text-lg text-slate-600">
                  {experienceYears > 0 ? `${experienceYears}+ years of experience` : 'Experienced consultant'}
                  {cvData?.professionalSummary?.currentRole && 
                    ` • ${cvData.professionalSummary.currentRole}`}
                </p>
              </div>
              <div className="text-center md:text-right">
                <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-xl">
                  <div className="text-sm opacity-90">Current hourly rate</div>
                  <div className="text-2xl font-bold">{currentRate} SEK/hour</div>
                </div>
              </div>
            </div>
          </div>

          {/* How You're Perceived - NEW ANALYSIS */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 mb-8">
            <div className="flex items-center mb-6">
              <Eye className="h-8 w-8 text-indigo-600 mr-3" />
              <h3 className="text-2xl font-bold text-slate-900">How You're Perceived</h3>
            </div>
            
            <div className="grid grid-cols-1 md: grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">CV Perception</h4>
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-blue-800 mb-2">
                      <strong>Professional Image:</strong> {cvData?.professionalSummary?.seniorityLevel || 'Mid-Senior'} level consultant
                    </p>
                    <p className="text-blue-700 text-sm">
                      Your CV presents you as {experienceYears >= 7 ? 'a highly experienced' : experienceYears >= 3 ? 'an experienced' : 'an emerging'} professional with 
                      {technicalSkills.length > 10 ? ' diverse technical expertise' : ' solid technical skills'}.
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Market Positioning</h4>
                  <div className="bg-green-50 rounded-xl p-4">
                    <p className="text-green-800 mb-2">
                      <strong>Competitive Level:</strong> {currentRate >= 1500 ? 'Premium' : currentRate >= 1000 ? 'Mid-Market' : 'Entry-Level'} pricing
                    </p>
                    <p className="text-green-700 text-sm">
                      Based on your profile, you're positioned in the {currentRate >= 1200 ? 'upper' : 'middle'} tier of the consultant market.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {linkedinData && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">LinkedIn Presence</h4>
                    <div className="bg-purple-50 rounded-xl p-4">
                      <p className="text-purple-800 mb-2">
                        <strong>Communication Style:</strong> {linkedinData.communicationStyle || 'Professional'}
                      </p>
                      <p className="text-purple-700 text-sm">
                        Your LinkedIn profile suggests {linkedinData.overallConsultantReadiness >= 7 ? 'strong' : 'moderate'} consultant readiness with 
                        {linkedinData.leadership >= 4 ? ' strong leadership qualities' : ' good collaborative skills'}.
                      </p>
                    </div>
                  </div>
                )}
                
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">First Impression</h4>
                  <div className="bg-orange-50 rounded-xl p-4">
                    <p className="text-orange-800 mb-2">
                      <strong>Client Perception:</strong> {technicalSkills.length >= 8 ? 'Technical Expert' : 'Specialized Professional'}
                    </p>
                    <p className="text-orange-700 text-sm">
                      Clients likely see you as {experienceYears >= 5 ? 'a seasoned consultant' : 'a capable professional'} with 
                      {cvData?.professionalSummary?.industryFocus ? ` ${cvData.professionalSummary.industryFocus} expertise` : ' broad technical capabilities'}.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Skills Analysis */}
          {technicalSkills.length > 0 && (
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 mb-8">
              <div className="flex items-center mb-6">
                <Code className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-2xl font-bold text-slate-900">Technical Expertise</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Identified Skills ({technicalSkills.length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {technicalSkills.slice(0, 12).map((skill, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                    {technicalSkills.length > 12 && (
                      <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm">
                        +{technicalSkills.length - 12} more
                      </span>
                    )}
                  </div>
                </div>
                
                {cvData?.professionalSummary?.industryFocus && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Industry Focus</h4>
                    <p className="text-slate-600">{cvData.professionalSummary.industryFocus}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <h4 className="font-semibold text-blue-900 mb-2">Skill Assessment</h4>
                <p className="text-blue-800">
                  Your technical profile shows {technicalSkills.length >= 15 ? 'exceptional breadth' : technicalSkills.length >= 8 ? 'solid diversity' : 'focused expertise'} 
                  {cvData?.technicalExpertise?.programmingLanguages?.expert?.length > 0 && ` with expert-level knowledge in ${cvData.technicalExpertise.programmingLanguages.expert.join(', ')}`}.
                </p>
              </div>
            </div>
          )}

          {/* Work Experience */}
          {workExperience.length > 0 && (
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 mb-8">
              <div className="flex items-center mb-6">
                <Briefcase className="h-8 w-8 text-purple-600 mr-3" />
                <h3 className="text-2xl font-bold text-slate-900">Professional Experience</h3>
              </div>
              
              <div className="space-y-4">
                {workExperience.slice(0, 5).map((exp: any, index: number) => (
                  <div key={index} className="border-l-4 border-purple-200 pl-4">
                    <h4 className="font-semibold text-slate-900">{exp.role || exp.title}</h4>
                    {exp.company && <p className="text-purple-600 font-medium">{exp.company}</p>}
                    {exp.duration && <p className="text-slate-500 text-sm">{exp.duration}</p>}
                    {exp.description && (
                      <p className="text-slate-600 text-sm mt-1">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-purple-50 rounded-xl">
                <h4 className="font-semibold text-purple-900 mb-2">Experience Analysis</h4>
                <p className="text-purple-800">
                  Your {experienceYears} years of experience across {workExperience.length} roles demonstrates 
                  {workExperience.length >= 4 ? ' strong career progression' : ' solid professional development'} and 
                  {cvData?.professionalSummary?.seniorityLevel === 'Senior' ? ' senior-level expertise' : ' growing expertise'}.
                </p>
              </div>
            </div>
          )}

          {/* Market Value & Rate Analysis */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 mb-8">
            <div className="flex items-center mb-6">
              <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
              <h3 className="text-2xl font-bold text-slate-900">Market Valuation & Rate Optimization</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-xl p-6">
                <h4 className="font-bold text-blue-900 mb-2">Current Rate</h4>
                <p className="text-3xl font-bold text-blue-600 mb-2">
                  {currentRate} SEK/h
                </p>
                <p className="text-sm text-blue-700">
                  Your current positioning in the market
                </p>
              </div>
              
              <div className="bg-green-50 rounded-xl p-6">
                <h4 className="font-bold text-green-900 mb-2">Market Rate</h4>
                <p className="text-3xl font-bold text-green-600 mb-2">
                  {recommendedRate > 0 ? recommendedRate : Math.round(currentRate * 1.15)} SEK/h
                </p>
                <p className="text-sm text-green-700">
                  Competitive rate for your profile
                </p>
              </div>
              
              <div className="bg-orange-50 rounded-xl p-6">
                <h4 className="font-bold text-orange-900 mb-2">Optimized Rate</h4>
                <p className="text-3xl font-bold text-orange-600 mb-2">
                  {Math.round(optimizedRate)} SEK/h
                </p>
                <p className="text-sm text-orange-700">
                  After implementing improvements
                </p>
                <div className="mt-2">
                  <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded text-xs font-medium">
                    +{Math.round(((optimizedRate - currentRate) / currentRate) * 100)}% potential increase
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-slate-50 rounded-xl">
              <h4 className="font-semibold text-slate-900 mb-2">Rate Justification Strategy</h4>
              <ul className="text-slate-700 text-sm space-y-1">
                <li>• Highlight your {experienceYears}+ years of experience and {technicalSkills.length} technical skills</li>
                <li>• Emphasize {cvData?.professionalSummary?.industryFocus ? `your ${cvData.professionalSummary.industryFocus} specialization` : 'your broad technical expertise'}</li>
                <li>• Showcase {workExperience.length > 3 ? 'diverse project experience' : 'focused expertise'} across different organizations</li>
                {linkedinData?.leadership >= 4 && <li>• Leverage your demonstrated leadership capabilities</li>}
              </ul>
            </div>
          </div>

          {/* LinkedIn Analysis */}
          {linkedinData && (
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 mb-8">
              <div className="flex items-center mb-6">
                <Star className="h-8 w-8 text-indigo-600 mr-3" />
                <h3 className="text-2xl font-bold text-slate-900">LinkedIn Profile Analysis</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Communication Style</h4>
                    <p className="text-slate-600 text-sm bg-slate-50 p-3 rounded-lg">{linkedinData.communicationStyle}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Leadership Level</h4>
                    <div className="flex items-center gap-2">
                      <div className="bg-indigo-100 rounded-full px-3 py-1">
                        <span className="text-indigo-800 font-medium">{linkedinData.leadership}/5</span>
                      </div>
                      <span className="text-slate-600 text-sm">{linkedinData.leadershipStyle}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Consultant Readiness</h4>
                    <div className="flex items-center gap-2">
                      <div className="bg-green-100 rounded-full px-3 py-1">
                        <span className="text-green-800 font-medium">{linkedinData.overallConsultantReadiness}/10</span>
                      </div>
                      <span className="text-slate-600 text-sm">Ready for consulting work</span>
                    </div>
                  </div>
                  
                  {linkedinData.contentAnalysisInsights?.primaryExpertiseAreas && (
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Primary Expertise Areas</h4>
                      <div className="flex flex-wrap gap-1">
                        {linkedinData.contentAnalysisInsights.primaryExpertiseAreas.map((area: string, index: number) => (
                          <span key={index} className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {linkedinData.recommendedImprovements && (
                <div className="mt-6 p-4 bg-indigo-50 rounded-xl">
                  <h4 className="font-semibold text-indigo-900 mb-2">LinkedIn Optimization Suggestions</h4>
                  <ul className="text-indigo-800 text-sm space-y-1">
                    {linkedinData.recommendedImprovements.slice(0, 4).map((improvement: string, index: number) => (
                      <li key={index}>• {improvement}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Action Plan */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 mb-8">
            <div className="flex items-center mb-6">
              <Lightbulb className="h-8 w-8 text-yellow-600 mr-3" />
              <h3 className="text-2xl font-bold text-slate-900">Comprehensive Action Plan</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-900">Optimize CV Presentation</h4>
                  <p className="text-slate-600">Focus on business impact and results rather than just technical skills. Quantify achievements where possible.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-900">Enhance LinkedIn Profile</h4>
                  <p className="text-slate-600">Update headline and summary to showcase your consulting potential and thought leadership.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-900">Rate Optimization Strategy</h4>
                  <p className="text-slate-600">Gradually increase rates by {Math.round(((optimizedRate - currentRate) / currentRate) * 100)}% over 6 months, supported by case studies and testimonials.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-900">Build Thought Leadership</h4>
                  <p className="text-slate-600">Share insights about {cvData?.professionalSummary?.industryFocus || 'your expertise'} through articles and posts to establish authority.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Certifications */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 mb-8">
            <div className="flex items-center mb-6">
              <Award className="h-8 w-8 text-purple-600 mr-3" />
              <h3 className="text-2xl font-bold text-slate-900">Strategic Certifications</h3>
            </div>
            
            <p className="text-slate-600 mb-6">Strengthen your credibility and justify higher rates with these certifications:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                <h4 className="font-bold text-orange-900 mb-2">AWS Solutions Architect</h4>
                <p className="text-sm text-orange-700 mb-3">High-demand cloud certification</p>
                <div className="text-xs text-orange-600">
                  <p>• Potential rate increase: +200-300 SEK/h</p>
                  <p>• ROI timeline: 3-6 months</p>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <h4 className="font-bold text-blue-900 mb-2">Azure Fundamentals</h4>
                <p className="text-sm text-blue-700 mb-3">Microsoft cloud platform</p>
                <div className="text-xs text-blue-600">
                  <p>• Potential rate increase: +150-250 SEK/h</p>
                  <p>• ROI timeline: 2-4 months</p>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <h4 className="font-bold text-green-900 mb-2">Certified Scrum Master</h4>
                <p className="text-sm text-green-700 mb-3">Agile project management</p>
                <div className="text-xs text-green-600">
                  <p>• Potential rate increase: +100-200 SEK/h</p>
                  <p>• ROI timeline: 1-3 months</p>
                </div>
              </div>
            </div>
          </div>

          {/* Join Network CTA */}
          <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl shadow-xl p-8 text-center text-white mb-8">
            <div className="flex justify-center mb-4">
              <Users className="h-12 w-12" />
            </div>
            
            <h3 className="text-3xl font-bold mb-4">Ready to be discovered by the right clients?</h3>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join the MatchWise Network and be featured among top consultants on our platform. 
              We match you based on skills, values, and timing – not just titles.
            </p>
            
            <button
              onClick={handleJoinNetwork}
              disabled={isJoining}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {isJoining ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>Joining network...</span>
                </div>
              ) : (
                'Join MatchWise Network'
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
