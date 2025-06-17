
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CVAnalysisLogicProps {
  cvFile: File | null;
  linkedinUrl: string;
  onAnalysisComplete: (analysis: any) => void;
  onError: (message: string) => void;
  onAnalysisStart?: () => void;
  onAnalysisProgress?: (progress: number) => void;
}

export const CVAnalysisLogic: React.FC<CVAnalysisLogicProps> = ({
  cvFile,
  linkedinUrl,
  onAnalysisComplete,
  onError,
  onAnalysisStart,
  onAnalysisProgress
}) => {
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  useEffect(() => {
    if (cvFile && !hasAnalyzed) {
      analyzeCVAndLinkedIn();
    }
  }, [cvFile, hasAnalyzed]);

  const analyzeCVAndLinkedIn = async () => {
    if (!cvFile) return;

    try {
      setHasAnalyzed(true);
      onAnalysisStart?.();
      onAnalysisProgress?.(10);

      console.log('Starting comprehensive CV and LinkedIn analysis...');

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', cvFile);
      formData.append('comprehensive', 'true');

      onAnalysisProgress?.(30);

      // Analyze CV using FormData
      console.log('Calling parse-cv function with FormData...');
      const { data: cvAnalysisData, error: cvError } = await supabase.functions.invoke('parse-cv', {
        body: formData
      });

      if (cvError) {
        console.error('CV analysis error:', cvError);
        throw new Error('Failed to analyze CV');
      }

      console.log('CV analysis completed:', cvAnalysisData);
      onAnalysisProgress?.(60);

      // Analyze LinkedIn if URL provided
      let linkedinAnalysisData = null;
      if (linkedinUrl) {
        console.log('Analyzing LinkedIn profile...');
        const { data: linkedinData, error: linkedinError } = await supabase.functions.invoke('analyze-linkedin', {
          body: {
            linkedinUrl: linkedinUrl,
            cvData: cvAnalysisData
          }
        });

        if (!linkedinError && linkedinData) {
          linkedinAnalysisData = linkedinData;
          console.log('LinkedIn analysis completed:', linkedinAnalysisData);
        }
      }

      onAnalysisProgress?.(80);

      // Extract comprehensive data from CV analysis
      const extractedName = cvAnalysisData?.analysis?.personalInfo?.name || 'Network Consultant';
      const extractedEmail = cvAnalysisData?.analysis?.personalInfo?.email || '';
      const extractedPhone = cvAnalysisData?.analysis?.personalInfo?.phone || '';
      const extractedLocation = cvAnalysisData?.analysis?.personalInfo?.location || '';
      
      // Extract skills from multiple sources in the analysis
      const extractedSkills = [
        ...(cvAnalysisData?.analysis?.technicalSkillsAnalysis?.programmingLanguages?.expert || []),
        ...(cvAnalysisData?.analysis?.technicalSkillsAnalysis?.programmingLanguages?.proficient || []),
        ...(cvAnalysisData?.analysis?.technicalSkillsAnalysis?.frontendTechnologies?.frameworks || []),
        ...(cvAnalysisData?.analysis?.technicalSkillsAnalysis?.backendTechnologies?.frameworks || []),
        ...(cvAnalysisData?.analysis?.technicalSkillsAnalysis?.cloudAndInfrastructure?.platforms || []),
        ...(cvAnalysisData?.analysis?.technicalExpertise?.frameworks || [])
      ].filter(Boolean);

      // Extract roles and certifications
      const extractedRoles = cvAnalysisData?.analysis?.professionalSummary?.specializations || 
                           [cvAnalysisData?.analysis?.professionalSummary?.currentRole || 'Consultant'];
      
      const extractedCertifications = cvAnalysisData?.analysis?.education?.certifications || [];
      const extractedLanguages = cvAnalysisData?.analysis?.personalInfo?.languages || ['Swedish', 'English'];

      // Create comprehensive consultant profile
      const consultantData = {
        name: extractedName,
        email: extractedEmail,
        phone: extractedPhone,
        location: extractedLocation,
        linkedin_url: linkedinUrl || '',
        skills: extractedSkills,
        experience_years: parseInt(cvAnalysisData?.analysis?.professionalSummary?.yearsOfExperience) || 0,
        hourly_rate: cvAnalysisData?.analysis?.marketPositioning?.hourlyRateEstimate?.recommended || 800,
        availability: 'Available',
        roles: extractedRoles,
        certifications: extractedCertifications,
        languages: extractedLanguages,
        communication_style: linkedinAnalysisData?.analysis?.communicationStyle || 
                           cvAnalysisData?.analysis?.personalityTraits?.communicationStyle || 'Professional',
        work_style: cvAnalysisData?.analysis?.personalityTraits?.workStyle || 'Collaborative',
        values: cvAnalysisData?.analysis?.personalityTraits?.teamOrientation ? ['Team collaboration'] : [],
        personality_traits: [
          cvAnalysisData?.analysis?.personalityTraits?.problemSolvingApproach,
          cvAnalysisData?.analysis?.personalityTraits?.adaptability,
          cvAnalysisData?.analysis?.personalityTraits?.innovationMindset
        ].filter(Boolean),
        team_fit: cvAnalysisData?.analysis?.personalityTraits?.teamOrientation || 'High collaboration potential',
        cultural_fit: linkedinAnalysisData?.analysis?.culturalFit || 5,
        adaptability: linkedinAnalysisData?.analysis?.adaptability || 5,
        leadership: linkedinAnalysisData?.analysis?.leadership || 3,
        rating: 5.0,
        projects_completed: 0,
        last_active: 'Today',
        type: 'new',
        user_id: null // Network consultant should have null user_id
      };

      console.log('Creating comprehensive consultant profile with data:', consultantData);

      const { data: consultant, error: consultantError } = await supabase
        .from('consultants')
        .insert(consultantData)
        .select()
        .single();

      if (consultantError) {
        console.error('Error creating consultant:', consultantError);
        throw new Error('Failed to create consultant profile');
      }

      console.log('Consultant created successfully:', consultant);
      onAnalysisProgress?.(90);

      // Send welcome email with correct parameters
      try {
        const { error: emailError } = await supabase.functions.invoke('send-welcome-email', {
          body: {
            consultantName: extractedName,
            consultantEmail: extractedEmail,
            isMyConsultant: false
          }
        });

        if (emailError) {
          console.warn('Failed to send welcome email:', emailError);
        } else {
          console.log('Welcome email sent successfully to:', extractedEmail);
        }
      } catch (emailError) {
        console.warn('Error sending welcome email:', emailError);
      }

      onAnalysisProgress?.(100);

      // Return analysis results with enhanced consultant data
      const analysisResults = {
        cvAnalysis: cvAnalysisData,
        linkedinAnalysis: linkedinAnalysisData,
        consultant: {
          ...consultant,
          cvAnalysis: cvAnalysisData?.analysis,
          linkedinAnalysis: linkedinAnalysisData?.analysis
        }
      };

      console.log('Analysis complete, calling onAnalysisComplete with:', analysisResults);
      onAnalysisComplete(analysisResults);

    } catch (error) {
      console.error('Analysis failed:', error);
      setHasAnalyzed(false);
      onError(error instanceof Error ? error.message : 'Analysis failed');
    }
  };

  return null;
};
