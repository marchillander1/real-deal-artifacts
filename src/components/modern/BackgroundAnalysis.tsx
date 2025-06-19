
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

        // Step 3: Create consultant profile with enhanced data extraction
        const cvData = cvResponse.data.analysis;
        const detectedInfo = cvResponse.data.detectedInformation;
        
        console.log('🔍 Extracted CV data:', cvData);
        console.log('🔍 Detected info:', detectedInfo);
        
        // Enhanced personal info extraction with better validation
        let extractedName = 'Professional Consultant';
        if (detectedInfo?.names?.[0] && 
            detectedInfo.names[0] !== 'Ej specificerat' && 
            detectedInfo.names[0] !== 'Not specified' &&
            detectedInfo.names[0] !== 'Subtype Image' &&
            detectedInfo.names[0].length > 2 &&
            !detectedInfo.names[0].includes('PDF') &&
            !detectedInfo.names[0].includes('Type') &&
            !detectedInfo.names[0].includes('obj')) {
          extractedName = detectedInfo.names[0];
        } else if (cvData?.personalInfo?.name && 
                   cvData.personalInfo.name !== 'Ej specificerat' && 
                   cvData.personalInfo.name !== 'Not specified' &&
                   cvData.personalInfo.name !== 'Subtype Image' &&
                   cvData.personalInfo.name.length > 2 &&
                   !cvData.personalInfo.name.includes('PDF') &&
                   !cvData.personalInfo.name.includes('Type') &&
                   !cvData.personalInfo.name.includes('obj')) {
          extractedName = cvData.personalInfo.name;
        }
        
        let extractedEmail = '';
        if (detectedInfo?.emails?.[0] && 
            detectedInfo.emails[0].includes('@') && 
            detectedInfo.emails[0] !== 'Ej specificerat' && 
            detectedInfo.emails[0] !== 'Not specified' &&
            detectedInfo.emails[0] !== 'Ej funnen') {
          extractedEmail = detectedInfo.emails[0];
        } else if (cvData?.personalInfo?.email && 
                   cvData.personalInfo.email.includes('@') && 
                   cvData.personalInfo.email !== 'Ej specificerat' && 
                   cvData.personalInfo.email !== 'Not specified' &&
                   cvData.personalInfo.email !== 'Ej funnen') {
          extractedEmail = cvData.personalInfo.email;
        }
        
        let extractedPhone = '';
        if (detectedInfo?.phones?.[0] && 
            detectedInfo.phones[0] !== 'Ej specificerat' && 
            detectedInfo.phones[0] !== 'Not specified' &&
            detectedInfo.phones[0] !== 'Ej funnen' &&
            detectedInfo.phones[0].length > 5) {
          extractedPhone = detectedInfo.phones[0];
        } else if (cvData?.personalInfo?.phone && 
                   cvData.personalInfo.phone !== 'Ej specificerat' && 
                   cvData.personalInfo.phone !== 'Not specified' &&
                   cvData.personalInfo.phone !== 'Ej funnen' &&
                   cvData.personalInfo.phone.length > 5) {
          extractedPhone = cvData.personalInfo.phone;
        }
        
        let extractedLocation = '';
        if (cvData?.personalInfo?.location && 
            cvData.personalInfo.location !== 'Ej specificerat' && 
            cvData.personalInfo.location !== 'Not specified') {
          extractedLocation = cvData.personalInfo.location;
        }

        // Extract skills with robust handling and better filtering
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
        
        // Clean and filter skills more thoroughly
        allSkills = allSkills.filter(skill => 
          skill && 
          skill.length > 1 && 
          skill.trim() !== '' &&
          skill !== 'Ej specificerat' && 
          skill !== 'Not specified' &&
          skill !== 'N/A' &&
          skill !== 'null' &&
          skill !== 'undefined' &&
          !skill.includes('PDF') &&
          !skill.includes('Type') &&
          !skill.includes('obj')
        ).map(skill => skill.trim());
        
        // Remove duplicates
        allSkills = [...new Set(allSkills)];

        console.log('🎯 Processed skills:', allSkills);

        // Extract experience years with better parsing and validation
        let experienceYears = 0;
        
        // Try multiple sources for experience years
        if (cvData?.experience?.years) {
          const yearsStr = cvData.experience.years.toString();
          const match = yearsStr.match(/(\d+)/);
          if (match) {
            const years = parseInt(match[1]);
            if (years >= 0 && years <= 50) {
              experienceYears = years;
            }
          }
        } else if (cvData?.professionalSummary?.yearsOfExperience) {
          const yearsStr = cvData.professionalSummary.yearsOfExperience.toString();
          const match = yearsStr.match(/(\d+)/);
          if (match) {
            const years = parseInt(match[1]);
            if (years >= 0 && years <= 50) {
              experienceYears = years;
            }
          }
        } else if (cvData?.workHistory && Array.isArray(cvData.workHistory)) {
          // Try to calculate from work history
          let totalYears = 0;
          cvData.workHistory.forEach((job: any) => {
            if (job.duration) {
              const durationMatch = job.duration.match(/(\d+)/);
              if (durationMatch) {
                const jobYears = parseInt(durationMatch[1]);
                if (jobYears >= 0 && jobYears <= 20) {
                  totalYears += jobYears;
                }
              }
            }
          });
          if (totalYears >= 0 && totalYears <= 50) {
            experienceYears = totalYears;
          }
        }

        console.log('📅 Experience years:', experienceYears);
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
          hourly_rate: 1200,
          availability: 'Available',
          cv_file_path: file.name,
          communication_style: linkedinData?.communicationStyle || 'Professional communication',
          rating: 4.8,
          projects_completed: 0,
          roles: cvData?.workHistory?.map((exp: any) => exp.role).filter((role: string) => role && role.length > 0) || ['Consultant'],
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
