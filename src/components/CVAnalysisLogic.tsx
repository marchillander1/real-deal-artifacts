
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CVAnalysisLogicProps {
  cvFile: File | null;
  linkedinUrl: string;
  formEmail?: string; // Add form email prop
  formName?: string;  // Add form name prop
  onAnalysisComplete: (analysis: any) => void;
  onError: (message: string) => void;
  onAnalysisStart?: () => void;
  onAnalysisProgress?: (progress: number) => void;
}

export const CVAnalysisLogic: React.FC<CVAnalysisLogicProps> = ({
  cvFile,
  linkedinUrl,
  formEmail,
  formName,
  onAnalysisComplete,
  onError,
  onAnalysisStart,
  onAnalysisProgress
}) => {
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  useEffect(() => {
    // Only start analysis when both CV file and LinkedIn URL are provided
    if (cvFile && linkedinUrl && linkedinUrl.trim() !== '' && !hasAnalyzed) {
      analyzeCVAndLinkedIn();
    }
  }, [cvFile, linkedinUrl, hasAnalyzed]);

  const analyzeCVAndLinkedIn = async () => {
    if (!cvFile) return;

    try {
      setHasAnalyzed(true);
      onAnalysisStart?.();
      onAnalysisProgress?.(10);

      console.log('🚀 Starting comprehensive CV and LinkedIn analysis...');

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', cvFile);
      formData.append('comprehensive', 'true');

      onAnalysisProgress?.(30);

      // Analyze CV using FormData
      console.log('📄 Calling parse-cv function with FormData...');
      const { data: cvAnalysisData, error: cvError } = await supabase.functions.invoke('parse-cv', {
        body: formData
      });

      if (cvError) {
        console.error('❌ CV analysis error:', cvError);
        // Don't throw error, continue with form data
        console.log('⚠️ CV analysis failed, using form data instead');
      }

      console.log('✅ CV analysis completed:', cvAnalysisData);
      onAnalysisProgress?.(60);

      // Analyze LinkedIn if URL provided - but don't let it block the process
      let linkedinAnalysisData = null;
      if (linkedinUrl && linkedinUrl.includes('linkedin.com')) {
        console.log('🔗 Analyzing LinkedIn profile...');
        try {
          const { data: linkedinData, error: linkedinError } = await supabase.functions.invoke('analyze-linkedin', {
            body: {
              linkedinUrl: linkedinUrl,
              cvData: cvAnalysisData
            }
          });

          if (!linkedinError && linkedinData) {
            linkedinAnalysisData = linkedinData;
            console.log('✅ LinkedIn analysis completed:', linkedinAnalysisData);
          } else {
            console.warn('⚠️ LinkedIn analysis failed, continuing without it:', linkedinError);
          }
        } catch (linkedinError) {
          console.warn('⚠️ LinkedIn analysis failed, continuing without it:', linkedinError);
        }
      } else {
        console.warn('⚠️ Invalid LinkedIn URL, skipping LinkedIn analysis');
      }

      onAnalysisProgress?.(80);

      // Use form data as primary source, CV analysis as secondary
      const analysis = cvAnalysisData?.analysis || {};
      const personalInfo = analysis?.personalInfo || {};
      const professionalSummary = analysis?.professionalSummary || {};
      const technicalExpertise = analysis?.technicalExpertise || {};
      const technicalSkillsAnalysis = analysis?.technicalSkillsAnalysis || {};
      const education = analysis?.education || {};
      const marketPositioning = analysis?.marketPositioning || {};
      const personalityTraits = analysis?.personalityTraits || {};
      
      // CRITICAL: Prioritize form data over CV analysis data
      const extractedName = formName || 
        (personalInfo?.name && personalInfo.name !== 'Analysis in progress' ? personalInfo.name : 'Network Consultant');
      
      const extractedEmail = formEmail || 
        (personalInfo?.email && personalInfo.email !== 'analysis@example.com' ? personalInfo.email : '');
      
      const extractedPhone = personalInfo?.phone || '';
      const extractedLocation = personalInfo?.location || 'Sweden';
      
      // Extract skills from multiple sources in the analysis
      const extractedSkills = [
        ...(technicalSkillsAnalysis?.programmingLanguages?.expert || []),
        ...(technicalSkillsAnalysis?.programmingLanguages?.proficient || []),
        ...(technicalSkillsAnalysis?.frontendTechnologies?.frameworks || []),
        ...(technicalSkillsAnalysis?.backendTechnologies?.frameworks || []),
        ...(technicalSkillsAnalysis?.cloudAndInfrastructure?.platforms || []),
        ...(technicalExpertise?.frameworks || []),
        ...(technicalExpertise?.programmingLanguages?.expert || []),
        ...(technicalExpertise?.programmingLanguages?.proficient || [])
      ].filter(Boolean);

      // Extract roles and certifications
      const extractedRoles = professionalSummary?.specializations || 
                           (professionalSummary?.currentRole ? [professionalSummary.currentRole] : ['Consultant']);
      
      const extractedCertifications = education?.certifications || [];
      const extractedLanguages = personalInfo?.languages || ['Swedish', 'English'];

      // Create comprehensive consultant profile - CRITICAL: This MUST be a network consultant
      const consultantData = {
        name: extractedName,
        email: extractedEmail,
        phone: extractedPhone,
        location: extractedLocation,
        linkedin_url: linkedinUrl || '',
        skills: extractedSkills.length > 0 ? extractedSkills : ['JavaScript', 'React', 'Node.js'],
        experience_years: parseInt(professionalSummary?.yearsOfExperience) || 5,
        hourly_rate: marketPositioning?.hourlyRateEstimate?.recommended || 800,
        availability: 'Available',
        roles: extractedRoles,
        certifications: extractedCertifications,
        languages: extractedLanguages,
        communication_style: linkedinAnalysisData?.analysis?.communicationStyle || 
                           personalityTraits?.communicationStyle || 'Professional',
        work_style: personalityTraits?.workStyle || 'Collaborative',
        values: personalityTraits?.teamOrientation ? ['Team collaboration'] : [],
        personality_traits: [
          personalityTraits?.problemSolvingApproach,
          personalityTraits?.adaptability,
          personalityTraits?.innovationMindset
        ].filter(Boolean),
        team_fit: personalityTraits?.teamOrientation || 'High collaboration potential',
        cultural_fit: linkedinAnalysisData?.analysis?.culturalFit || 5,
        adaptability: linkedinAnalysisData?.analysis?.adaptability || 5,
        leadership: linkedinAnalysisData?.analysis?.leadership || 3,
        rating: 5.0,
        projects_completed: 0,
        last_active: 'Today',
        type: 'new', // ⭐ CRITICAL: This MUST be 'new' for Network Consultants
        user_id: null // ⭐ CRITICAL: This MUST be null for Network Consultants
      };

      console.log('🔥 CREATING NETWORK CONSULTANT with these CRITICAL fields:');
      console.log('📌 type:', consultantData.type);
      console.log('📌 user_id:', consultantData.user_id);
      console.log('📌 email:', consultantData.email);
      console.log('📌 Full consultant data:', consultantData);

      const { data: consultant, error: consultantError } = await supabase
        .from('consultants')
        .insert(consultantData)
        .select()
        .single();

      if (consultantError) {
        console.error('❌ Error creating consultant:', consultantError);
        throw new Error('Failed to create consultant profile: ' + consultantError.message);
      }

      console.log('🎉 Network consultant created successfully:', consultant);
      console.log('✅ Consultant has type:', consultant.type);
      console.log('✅ Consultant has user_id:', consultant.user_id);
      
      onAnalysisProgress?.(90);

      // Send welcome email - CRITICAL: Use the email we have
      const emailToSend = formEmail || extractedEmail;
      console.log('📧 Attempting to send welcome email...');
      console.log('📧 formEmail provided:', formEmail);
      console.log('📧 extractedEmail from CV:', extractedEmail);
      console.log('📧 Final email to use:', emailToSend);

      if (emailToSend && emailToSend.trim() !== '') {
        try {
          console.log(`📨 Sending welcome email to: ${emailToSend} for consultant: ${extractedName}`);
          const { data: emailResponse, error: emailError } = await supabase.functions.invoke('send-welcome-email', {
            body: {
              consultantName: extractedName,
              consultantEmail: emailToSend,
              isMyConsultant: false // This is a network consultant, not my consultant
            }
          });

          if (emailError) {
            console.error('❌ Failed to send welcome email:', emailError);
          } else {
            console.log('🎉 Welcome email sent successfully:', emailResponse);
          }
        } catch (emailError) {
          console.error('❌ Error sending welcome email:', emailError);
        }
      } else {
        console.warn('⚠️ No email available for welcome email - formEmail:', formEmail, 'extractedEmail:', extractedEmail);
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

      console.log('✅ Analysis complete, calling onAnalysisComplete with:', analysisResults);
      onAnalysisComplete(analysisResults);

    } catch (error) {
      console.error('❌ Analysis failed:', error);
      setHasAnalyzed(false);
      onError(error instanceof Error ? error.message : 'Analysis failed');
    }
  };

  return null;
};
