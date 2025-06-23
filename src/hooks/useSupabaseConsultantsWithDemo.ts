
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Consultant } from '@/types/consultant';

export const useSupabaseConsultantsWithDemo = () => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        setIsLoading(true);
        
        // Fetch real consultants from Supabase
        const { data: realConsultants, error: supabaseError } = await supabase
          .from('consultants')
          .select('*')
          .order('created_at', { ascending: false });

        if (supabaseError) {
          console.error('Error fetching consultants:', supabaseError);
          setError('Failed to fetch consultants');
          return;
        }

        // Transform the data to match our Consultant interface
        const transformedConsultants: Consultant[] = (realConsultants || []).map((consultant) => {
          // Type cast the JSONB data safely
          const cvAnalysisData = consultant.cv_analysis_data as any;
          const linkedinAnalysisData = consultant.linkedin_analysis_data as any;

          return {
            id: consultant.id,
            name: consultant.name || 'Unknown Consultant',
            email: consultant.email || '',
            phone: consultant.phone || '',
            location: consultant.location || 'Sweden',
            skills: consultant.skills || [],
            experience: `${consultant.experience_years || 5} år`,
            rate: consultant.hourly_rate ? `${consultant.hourly_rate} SEK/h` : '1000 SEK/h',
            availability: consultant.availability || 'Available',
            cv: consultant.cv_file_path || '',
            communicationStyle: consultant.communication_style || 'Professional',
            rating: Number(consultant.rating) || 4.8,
            projects: consultant.projects_completed || 0,
            lastActive: 'Today',
            roles: consultant.roles || ['Consultant'],
            certifications: consultant.certifications || [],
            type: consultant.type as 'new' | 'existing' || 'existing',
            user_id: consultant.user_id,
            languages: consultant.languages || ['Swedish', 'English'],
            workStyle: consultant.work_style || 'Collaborative',
            values: consultant.values || [],
            personalityTraits: consultant.personality_traits || [],
            teamFit: consultant.team_fit || 'Team player',
            culturalFit: consultant.cultural_fit || 5,
            adaptability: consultant.adaptability || 5,
            leadership: consultant.leadership || 3,
            linkedinUrl: consultant.linkedin_url || '',
            // Transform the standardized analysis data with safe type casting
            cvAnalysis: cvAnalysisData ? {
              personalInfo: {
                name: cvAnalysisData.personalInfo?.name || consultant.name || 'Unknown',
                email: cvAnalysisData.personalInfo?.email || consultant.email || '',
                phone: cvAnalysisData.personalInfo?.phone || consultant.phone || '',
                location: cvAnalysisData.personalInfo?.location || consultant.location || ''
              },
              experience: {
                years: cvAnalysisData.experience?.years || `${consultant.experience_years || 5} år`,
                currentRole: cvAnalysisData.experience?.currentRole || 'Consultant',
                level: cvAnalysisData.experience?.level || 'Senior'
              },
              skills: {
                technical: cvAnalysisData.skills?.technical || consultant.skills?.slice(0, 5) || [],
                languages: cvAnalysisData.skills?.languages || ['Swedish', 'English'],
                tools: cvAnalysisData.skills?.tools || []
              },
              workHistory: cvAnalysisData.workHistory || [],
              education: cvAnalysisData.education || []
            } : undefined,
            linkedinAnalysis: linkedinAnalysisData ? {
              communicationStyle: linkedinAnalysisData.communicationStyle || 'Professional',
              leadershipStyle: linkedinAnalysisData.leadershipStyle || 'Collaborative',
              innovation: linkedinAnalysisData.innovation || 4,
              leadership: linkedinAnalysisData.leadership || consultant.leadership || 3,
              adaptability: linkedinAnalysisData.adaptability || consultant.adaptability || 5,
              culturalFit: linkedinAnalysisData.culturalFit || consultant.cultural_fit || 5,
              marketPositioning: linkedinAnalysisData.marketPositioning || {
                uniqueValueProposition: 'Experienced IT consultant',
                competitiveAdvantages: ['Technical expertise', 'Strong communication']
              }
            } : undefined,
            // Enhanced analysis fields
            profile_completeness: consultant.profile_completeness,
            linkedin_engagement_level: consultant.linkedin_engagement_level,
            thought_leadership_score: consultant.thought_leadership_score,
            primary_tech_stack: consultant.primary_tech_stack,
            secondary_tech_stack: consultant.secondary_tech_stack,
            top_values: consultant.top_values,
            industries: consultant.industries,
            market_rate_current: consultant.market_rate_current,
            market_rate_optimized: consultant.market_rate_optimized,
            cv_tips: consultant.cv_tips,
            suggested_learning_paths: consultant.suggested_learning_paths
          };
        });

        setConsultants(transformedConsultants);
        setError(null);
      } catch (err) {
        console.error('Error in useSupabaseConsultantsWithDemo:', err);
        setError('Failed to load consultants');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConsultants();
  }, []);

  const updateConsultant = async (consultant: Consultant) => {
    try {
      const { error } = await supabase
        .from('consultants')
        .update({
          name: consultant.name,
          email: consultant.email,
          phone: consultant.phone,
          location: consultant.location,
          skills: consultant.skills,
          experience_years: consultant.experience ? parseInt(consultant.experience) : null,
          hourly_rate: consultant.rate ? parseInt(consultant.rate) : null,
          availability: consultant.availability,
          cv_file_path: consultant.cv,
          communication_style: consultant.communicationStyle,
        })
        .eq('id', String(consultant.id));

      if (error) throw error;

      // Update local state
      setConsultants(prev => 
        prev.map(c => c.id === consultant.id ? consultant : c)
      );
    } catch (err) {
      console.error('Error updating consultant:', err);
      throw err;
    }
  };

  return { consultants, isLoading, error, updateConsultant };
};
