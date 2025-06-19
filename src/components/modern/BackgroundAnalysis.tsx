
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
        console.log('🚀 Starting comprehensive background analysis');
        console.log('📄 File:', file.name, 'Size:', file.size);
        console.log('🔗 LinkedIn URL:', linkedinUrl);

        // Step 1: CV Analysis
        console.log('📄 Starting CV parsing...');
        const formData = new FormData();
        formData.append('file', file);

        const cvResponse = await supabase.functions.invoke('parse-cv', {
          body: formData
        });

        console.log('📊 CV Response:', cvResponse);

        if (cvResponse.error) {
          console.error('❌ CV analysis failed:', cvResponse.error);
          throw new Error(`CV analysis failed: ${cvResponse.error.message}`);
        }

        if (!cvResponse.data || !cvResponse.data.success) {
          console.error('❌ CV analysis returned unsuccessful:', cvResponse.data);
          throw new Error('CV analysis was not successful');
        }

        console.log('✅ CV analysis complete:', cvResponse.data.analysis);

        // Step 2: LinkedIn Analysis (if URL provided)
        let linkedinData = null;
        if (linkedinUrl && linkedinUrl.trim() && linkedinUrl.includes('linkedin.com')) {
          console.log('🔗 Starting LinkedIn analysis...');
          
          const linkedinResponse = await supabase.functions.invoke('analyze-linkedin', {
            body: { linkedinUrl: linkedinUrl.trim() }
          });

          console.log('📊 LinkedIn Response:', linkedinResponse);

          if (linkedinResponse.error) {
            console.warn('⚠️ LinkedIn analysis failed, continuing with CV only:', linkedinResponse.error);
            toast({
              title: "LinkedIn analysis failed",
              description: "Continuing with CV analysis only",
              variant: "default",
            });
          } else if (linkedinResponse.data && linkedinResponse.data.success) {
            linkedinData = linkedinResponse.data.analysis;
            console.log('✅ LinkedIn analysis complete:', linkedinData);
          } else {
            console.warn('⚠️ LinkedIn analysis was not successful:', linkedinResponse.data);
          }
        } else {
          console.log('⏭️ Skipping LinkedIn analysis - no valid URL provided');
        }

        // Step 3: Create consultant profile
        const cvData = cvResponse.data.analysis;
        const detectedInfo = cvResponse.data.detectedInformation;
        
        console.log('🔍 Extracted CV data:', cvData);
        console.log('🔍 Detected info:', detectedInfo);
        
        // Extract skills with robust handling
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
        
        // Clean and filter skills
        allSkills = allSkills.filter(skill => 
          skill && 
          skill.length > 0 && 
          skill.trim() !== '' &&
          skill !== 'Ej specificerat' && 
          skill !== 'Not specified' &&
          skill !== 'N/A'
        );

        console.log('🎯 Processed skills:', allSkills);

        // Extract experience years with fallbacks
        let experienceYears = 0;
        if (cvData?.experience?.years) {
          const years = cvData.experience.years.toString();
          const match = years.match(/\d+/);
          experienceYears = match ? parseInt(match[0]) : 0;
        } else if (cvData?.professionalSummary?.yearsOfExperience) {
          const years = cvData.professionalSummary.yearsOfExperience.toString();
          const match = years.match(/\d+/);
          experienceYears = match ? parseInt(match[0]) : 0;
        }

        console.log('📅 Experience years:', experienceYears);

        // Extract personal info with smart fallbacks
        const extractedName = detectedInfo?.names?.[0] || cvData?.personalInfo?.name || 'Professional Consultant';
        const extractedEmail = detectedInfo?.emails?.[0] || cvData?.personalInfo?.email || 'temp@temp.com';
        const extractedPhone = detectedInfo?.phones?.[0] || cvData?.personalInfo?.phone || '';
        const extractedLocation = cvData?.personalInfo?.location || '';

        console.log('👤 Extracted personal info:', {
          name: extractedName,
          email: extractedEmail,
          phone: extractedPhone,
          location: extractedLocation
        });

        // Create consultant data
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

        console.log('💾 Creating consultant profile:', consultantData);

        const { data: insertedConsultant, error: insertError } = await supabase
          .from('consultants')
          .insert([consultantData])
          .select()
          .single();

        if (insertError) {
          console.error('❌ Database insert error:', insertError);
          throw new Error(`Failed to create consultant: ${insertError.message}`);
        }

        console.log('✅ Consultant created successfully:', insertedConsultant);

        // Return complete results
        const results = {
          cvAnalysis: cvResponse.data,
          linkedinAnalysis: linkedinData,
          consultant: insertedConsultant
        };

        console.log('🎉 Analysis complete, calling onComplete with:', results);
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
