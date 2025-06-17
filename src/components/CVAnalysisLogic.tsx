
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CVAnalysisLogicProps {
  cvFile: File | null;
  linkedinUrl: string;
  formEmail?: string;
  formName?: string;
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

  // Reset hasAnalyzed when key inputs change
  useEffect(() => {
    setHasAnalyzed(false);
  }, [cvFile, linkedinUrl]);

  // Check if we can start analysis
  const canStartAnalysis = cvFile && linkedinUrl && linkedinUrl.includes('linkedin.com') && !hasAnalyzed;

  useEffect(() => {
    if (canStartAnalysis) {
      console.log('🚀 Starting analysis with:', { 
        hasFile: !!cvFile, 
        hasLinkedIn: !!linkedinUrl, 
        linkedinValid: linkedinUrl.includes('linkedin.com'),
        hasAnalyzed 
      });
      analyzeCVAndLinkedIn();
    }
  }, [canStartAnalysis]);

  const sendWelcomeEmail = async (consultantName: string, consultantEmail: string, isMyConsultant: boolean) => {
    try {
      console.log(`📧 Sending welcome email to: ${consultantEmail}`);
      
      const { data: emailResponse, error: emailError } = await supabase.functions.invoke('send-welcome-email', {
        body: {
          consultantName: consultantName,
          consultantEmail: consultantEmail,
          isMyConsultant: isMyConsultant
        }
      });

      if (emailError) {
        console.error('❌ Welcome email failed:', emailError);
        throw emailError;
      } else {
        console.log('✅ Welcome email sent successfully:', emailResponse);
      }
    } catch (error) {
      console.error('❌ Exception sending welcome email:', error);
      throw error;
    }
  };

  const sendRegistrationNotification = async (consultantName: string, consultantEmail: string, isMyConsultant: boolean) => {
    try {
      console.log(`📧 Sending registration notification for: ${consultantName}`);
      
      const { data: notificationResponse, error: notificationError } = await supabase.functions.invoke('send-registration-notification', {
        body: {
          consultantName: consultantName,
          consultantEmail: consultantEmail,
          isMyConsultant: isMyConsultant
        }
      });

      if (notificationError) {
        console.error('❌ Registration notification failed:', notificationError);
      } else {
        console.log('✅ Registration notification sent successfully:', notificationResponse);
      }
    } catch (error) {
      console.error('❌ Exception sending registration notification:', error);
    }
  };

  const analyzeCVAndLinkedIn = async () => {
    if (!cvFile || hasAnalyzed) return;

    try {
      setHasAnalyzed(true);
      onAnalysisStart?.();
      onAnalysisProgress?.(10);

      console.log('🚀 Starting comprehensive CV and LinkedIn analysis...');
      console.log('📧 Form email provided:', formEmail);
      console.log('👤 Form name provided:', formName);

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
      
      // Always prioritize form data over CV analysis data for network consultants
      const extractedName = formName && formName.trim() !== '' ? formName : 
        (personalInfo?.name && personalInfo.name !== 'Analysis in progress' ? personalInfo.name : 'Consultant');
      
      // ALWAYS use formEmail first, never fall back to placeholder emails
      const extractedEmail = formEmail && formEmail.trim() !== '' ? formEmail : '';
      
      console.log('📝 Final consultant data being used:');
      console.log('📌 Name:', extractedName, '(from form:', formName, ', from CV:', personalInfo?.name, ')');
      console.log('📌 Email:', extractedEmail, '(from form:', formEmail, ', from CV:', personalInfo?.email, ')');
      
      // If no valid email, throw error early
      if (!extractedEmail || extractedEmail.trim() === '') {
        throw new Error('No valid email provided - cannot create consultant without email');
      }
      
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

      // Network consultants should be type 'new', not 'existing'
      const isMyConsultant = false; // Network consultants are external

      // Get current user for proper user_id assignment
      const { data: { user } } = await supabase.auth.getUser();

      // Create consultant data with REQUIRED fields including all analysis data
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
        
        // Store analysis data for display in consultant cards
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
        type: 'new', // Network consultants are type 'new'
        user_id: null, // Network consultants don't have user_id
      };

      console.log('🔥 CREATING NETWORK CONSULTANT with these CRITICAL fields:');
      console.log('📌 type:', consultantData.type);
      console.log('📌 user_id:', consultantData.user_id);
      console.log('📌 email:', consultantData.email);
      console.log('📌 name:', consultantData.name);
      console.log('📌 isMyConsultant:', isMyConsultant);

      // Create consultant in database
      const { data: consultant, error: consultantError } = await supabase
        .from('consultants')
        .insert(consultantData)
        .select()
        .single();

      if (consultantError) {
        console.error('❌ Error creating consultant:', consultantError);
        throw new Error('Failed to create consultant profile: ' + consultantError.message);
      }

      console.log('🎉 Network consultant created successfully!');
      console.log('✅ Consultant ID:', consultant.id);
      console.log('✅ Consultant type:', consultant.type);
      console.log('✅ Consultant user_id:', consultant.user_id);
      console.log('✅ Consultant email:', consultant.email);
      
      onAnalysisProgress?.(90);

      // Send emails - Now we have guaranteed valid email
      try {
        // Send welcome email to consultant
        await sendWelcomeEmail(extractedName, extractedEmail, isMyConsultant);
        
        // Send registration notification to admin
        await sendRegistrationNotification(extractedName, extractedEmail, isMyConsultant);
        
        console.log('✅ All emails sent successfully!');
        
      } catch (emailError) {
        console.error('❌ Email sending failed:', emailError);
        // Don't throw error - consultant is already created, just log the email failure
      }

      onAnalysisProgress?.(100);

      // Return analysis results with enhanced consultant data including the full analysis objects
      const analysisResults = {
        cvAnalysis: cvAnalysisData,
        linkedinAnalysis: linkedinAnalysisData,
        consultant: {
          ...consultant,
          // Include the full analysis objects for display in ConsultantAnalysisCard
          cvAnalysis: cvAnalysisData?.analysis,
          linkedinAnalysis: linkedinAnalysisData?.analysis
        }
      };

      console.log('✅ Analysis complete, calling onAnalysisComplete with full analysis data');
      onAnalysisComplete(analysisResults);

    } catch (error) {
      console.error('❌ Analysis failed:', error);
      setHasAnalyzed(false);
      onError(error instanceof Error ? error.message : 'Analysis failed');
    }
  };

  return null;
};
