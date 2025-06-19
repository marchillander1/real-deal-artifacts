
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
  Sparkles
} from 'lucide-react';

interface ConsultantData {
  id: string;
  name: string;
  email: string;
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
      // Update consultant to be visible in network
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
          email: consultant.email,
          name: consultant.name,
          consultantId: consultant.id
        }
      });

      if (emailError) {
        console.warn('Email sending failed:', emailError);
        // Don't fail the whole process if email fails
      }

      toast({
        title: "Welcome to MatchWise Network! 🎉",
        description: "You're now visible to potential clients. Check your email for next steps.",
      });

      // Redirect to success page or back to main app
      setTimeout(() => {
        navigate('/');
      }, 2000);

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
  const hourlyRateData = cvData?.marketPositioning?.hourlyRateEstimate;
  const optimizedRate = hourlyRateData ? Math.round(hourlyRateData.recommended * 1.2) : Math.round(consultant.hourly_rate * 1.2);

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
              🎯 Your Personalized Consultant Analysis
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              This report is based on your current profile. It gives you concrete actions to improve your visibility, raise your rate, and find better gigs – faster.
            </p>
          </div>

          {/* Profile Summary */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 mb-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">{consultant.name}</h2>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {consultant.skills.slice(0, 6).map((skill, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
              <p className="text-lg text-slate-600">
                {consultant.experience_years}+ years experience | {consultant.location}
              </p>
            </div>
          </div>

          {/* Market Value */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 mb-8">
            <div className="flex items-center mb-6">
              <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
              <h3 className="text-2xl font-bold text-slate-900">Market Value Estimation</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-xl p-6">
                <h4 className="font-bold text-blue-900 mb-2">Current estimated rate</h4>
                <p className="text-3xl font-bold text-blue-600 mb-2">
                  ${consultant.hourly_rate}/hour
                </p>
                <p className="text-sm text-blue-700">
                  Based on your current profile and market demand
                </p>
              </div>
              
              <div className="bg-green-50 rounded-xl p-6">
                <h4 className="font-bold text-green-900 mb-2">Optimized potential</h4>
                <p className="text-3xl font-bold text-green-600 mb-2">
                  ${optimizedRate}/hour
                </p>
                <p className="text-sm text-green-700">
                  After implementing our recommendations
                </p>
              </div>
            </div>
          </div>

          {/* Action Plan */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 mb-8">
            <div className="flex items-center mb-6">
              <Lightbulb className="h-8 w-8 text-yellow-600 mr-3" />
              <h3 className="text-2xl font-bold text-slate-900">Action Plan – Improve Your CV & LinkedIn</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-900">Update headline to focus on outcomes</h4>
                  <p className="text-slate-600">Example: "Scales Python APIs for 10M+ users" instead of just "Python Developer"</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-900">Reorder achievements to show impact first</h4>
                  <p className="text-slate-600">Lead with quantified results and business value delivered</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-900">Use keywords aligned with top gig searches</h4>
                  <p className="text-slate-600">Include technologies and methodologies that clients actively search for</p>
                </div>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 mb-8">
            <div className="flex items-center mb-6">
              <Award className="h-8 w-8 text-purple-600 mr-3" />
              <h3 className="text-2xl font-bold text-slate-900">Suggested Certifications</h3>
            </div>
            
            <p className="text-slate-600 mb-6">Boost your credibility and rate with:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                <h4 className="font-bold text-orange-900 mb-2">AWS Certified Solutions Architect</h4>
                <p className="text-sm text-orange-700">High-demand cloud certification</p>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <h4 className="font-bold text-blue-900 mb-2">Kubernetes CKA</h4>
                <p className="text-sm text-blue-700">Container orchestration expertise</p>
              </div>
              
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <h4 className="font-bold text-green-900 mb-2">Google Cloud Professional</h4>
                <p className="text-sm text-green-700">Multi-cloud capabilities</p>
              </div>
            </div>
          </div>

          {/* Skill Development */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 mb-8">
            <div className="flex items-center mb-6">
              <Brain className="h-8 w-8 text-indigo-600 mr-3" />
              <h3 className="text-2xl font-bold text-slate-900">Skill Development Roadmap</h3>
            </div>
            
            <p className="text-slate-600 mb-6">To move up in market value:</p>
            
            <div className="space-y-4">
              <div className="bg-indigo-50 rounded-xl p-4">
                <h4 className="font-semibold text-indigo-900 mb-2">Deepen skills in:</h4>
                <div className="flex flex-wrap gap-2">
                  {['TypeScript', 'Terraform', 'Cloud Security', 'Microservices'].map((skill, index) => (
                    <span key={index} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="bg-green-50 rounded-xl p-4">
                <h4 className="font-semibold text-green-900 mb-2">Explore emerging areas:</h4>
                <div className="flex flex-wrap gap-2">
                  {['DevOps Leadership', 'Cost Optimization', 'AI/ML Integration'].map((skill, index) => (
                    <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Branding */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 mb-8">
            <div className="flex items-center mb-6">
              <Sparkles className="h-8 w-8 text-pink-600 mr-3" />
              <h3 className="text-2xl font-bold text-slate-900">Branding & Thought Leadership</h3>
            </div>
            
            <p className="text-slate-600 mb-6">Stand out in your niche by:</p>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <ArrowRight className="h-5 w-5 text-pink-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-900">Writing on LinkedIn 1–2x/month</h4>
                  <p className="text-slate-600">Share insights about your technical domain and industry trends</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <ArrowRight className="h-5 w-5 text-pink-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-900">Sharing learnings from complex projects</h4>
                  <p className="text-slate-600">Demonstrate your problem-solving capabilities and expertise</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <ArrowRight className="h-5 w-5 text-pink-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-900">Publishing simple case studies</h4>
                  <p className="text-slate-600">Show concrete results and business impact you've delivered</p>
                </div>
              </div>
            </div>
          </div>

          {/* Join Network CTA */}
          <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl shadow-xl p-8 text-center text-white mb-8">
            <div className="flex justify-center mb-4">
              <Users className="h-12 w-12" />
            </div>
            
            <h3 className="text-3xl font-bold mb-4">Ready to be seen by the right clients?</h3>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join the MatchWise Network and get featured among top consultants on our platform. 
              We match you based on skills, soft values and timing – not just titles.
            </p>
            
            <button
              onClick={handleJoinNetwork}
              disabled={isJoining}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {isJoining ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>Joining Network...</span>
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
