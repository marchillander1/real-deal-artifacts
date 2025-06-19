
import React, { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BackgroundAnalysisProps {
  file: File;
  linkedinUrl: string;
  onComplete: (results: any) => void;
}

export const BackgroundAnalysis: React.FC<BackgroundAnalysisProps> = ({
  file,
  linkedinUrl,
  onComplete
}) => {
  const { toast } = useToast();

  useEffect(() => {
    const runAnalysis = async () => {
      try {
        console.log('🚀 Starting background analysis');

        // Step 1: CV Analysis
        const formData = new FormData();
        formData.append('file', file);

        const cvResponse = await supabase.functions.invoke('parse-cv', {
          body: formData
        });

        if (cvResponse.error) {
          throw new Error(`CV analysis failed: ${cvResponse.error.message}`);
        }

        console.log('✅ CV analysis complete');

        // Step 2: LinkedIn Analysis (if URL provided)
        let linkedinData = null;
        if (linkedinUrl && linkedinUrl.includes('linkedin.com')) {
          console.log('🔗 Starting LinkedIn analysis');
          
          const linkedinResponse = await supabase.functions.invoke('analyze-linkedin', {
            body: { linkedinUrl: linkedinUrl.trim() }
          });

          if (linkedinResponse.error) {
            console.warn('⚠️ LinkedIn analysis failed:', linkedinResponse.error);
          } else {
            linkedinData = linkedinResponse.data;
            console.log('✅ LinkedIn analysis complete');
          }
        }

        // Step 3: Create consultant profile
        const cvData = cvResponse.data.analysis;
        const detectedInfo = cvResponse.data.detectedInformation;
        
        // Extract skills
        let allSkills: string[] = [];
        if (cvData?.skills) {
          allSkills = [
            ...(cvData.skills.technical || []),
            ...(cvData.skills.languages || []),
            ...(cvData.skills.tools || [])
          ];
        } else if (cvData?.technicalExpertise) {
          const tech = cvData.technicalExpertise;
          allSkills = [
            ...(tech.programmingLanguages?.expert || []),
            ...(tech.programmingLanguages?.proficient || []),
            ...(tech.frameworks || []),
            ...(tech.tools || []),
            ...(tech.databases || [])
          ];
        }
        
        allSkills = allSkills.filter(skill => 
          skill && skill.length > 0 && 
          skill !== 'Ej specificerat' && 
          skill !== 'Not specified'
        );

        // Extract experience years
        let experienceYears = 0;
        if (cvData?.experience?.years) {
          experienceYears = parseInt(cvData.experience.years.toString().match(/\d+/)?.[0] || '0');
        } else if (cvData?.professionalSummary?.yearsOfExperience) {
          experienceYears = parseInt(cvData.professionalSummary.yearsOfExperience.toString().match(/\d+/)?.[0] || '0');
        }

        // Extract personal info with smart fallbacks
        const extractedName = detectedInfo?.names?.[0] || cvData?.personalInfo?.name || 'Professional Consultant';
        const extractedEmail = detectedInfo?.emails?.[0] || cvData?.personalInfo?.email || 'temp@temp.com';
        const extractedPhone = detectedInfo?.phones?.[0] || cvData?.personalInfo?.phone || '';
        const extractedLocation = cvData?.personalInfo?.location || '';

        // Create consultant
        const consultantData = {
          name: extractedName,
          email: extractedEmail,
          phone: extractedPhone,
          location: extractedLocation,
          skills: allSkills,
          experience_years: experienceYears,
          hourly_rate: 1000,
          availability: 'Available',
          cv_file_path: file.name,
          communication_style: linkedinData?.communicationStyle || 'Professional communication',
          rating: 4.8,
          projects_completed: 0,
          roles: cvData?.workHistory?.map((exp: any) => exp.role).filter((role: string) => role) || ['Consultant'],
          certifications: cvData?.education?.certifications || [],
          type: 'new',
          user_id: null,
          languages: cvData?.languages || ['English'],
          work_style: linkedinData?.teamFitAssessment?.workStyle || 'Collaborative',
          values: ['Professional development', 'Innovation'],
          personality_traits: linkedinData?.contentAnalysisInsights?.professionalValues || ['Problem-oriented', 'Analytical'],
          team_fit: linkedinData?.teamFitAssessment?.workStyle || 'Team player',
          cultural_fit: linkedinData?.culturalFit || 5,
          adaptability: linkedinData?.adaptability || 5,
          leadership: Math.min(experienceYears >= 5 ? 4 : 3, 5),
          linkedin_url: linkedinUrl || '',
          cv_analysis_data: cvResponse.data,
          linkedin_analysis_data: linkedinData
        };

        console.log('💾 Creating consultant profile');

        const { data: insertedConsultant, error: insertError } = await supabase
          .from('consultants')
          .insert([consultantData])
          .select()
          .single();

        if (insertError) {
          throw new Error(`Failed to create consultant: ${insertError.message}`);
        }

        console.log('✅ Consultant created successfully');

        // Return complete results
        const results = {
          cvAnalysis: cvResponse.data,
          linkedinAnalysis: linkedinData,
          consultant: insertedConsultant
        };

        onComplete(results);

      } catch (error: any) {
        console.error('❌ Background analysis failed:', error);
        toast({
          title: "Analysis failed",
          description: error.message || "Please try again.",
          variant: "destructive",
        });
      }
    };

    runAnalysis();
  }, [file, linkedinUrl, onComplete, toast]);

  return null; // This component only handles background processing
};
