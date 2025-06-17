
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
    // Reset hasAnalyzed when CV file or LinkedIn URL changes to allow re-analysis
    setHasAnalyzed(false);
  }, [cvFile, linkedinUrl]);

  useEffect(() => {
    // Only start analysis when both CV file and LinkedIn URL are provided and we haven't analyzed yet
    if (cvFile && linkedinUrl && linkedinUrl.trim() !== '' && !hasAnalyzed) {
      analyzeCVAndLinkedIn();
    }
  }, [cvFile, linkedinUrl, hasAnalyzed]);

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
    if (!cvFile) return;

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
      
      // 🎯 CRITICAL: Always prioritize form data over CV analysis data
      const extractedName = formName && formName.trim() !== '' ? formName : 
        (personalInfo?.name && personalInfo.name !== 'Analysis in progress' ? personalInfo.name : 'Network Consultant');
      
      // 🔥 CRITICAL FIX: Ensure we always have a valid email for welcome email
      const extractedEmail = formEmail && formEmail.trim() !== '' ? formEmail : 
        (personalInfo?.email && personalInfo.email !== 'analysis@example.com' ? personalInfo.email : '');
      
      console.log('📝 Final consultant data being used:');
      console.log('📌 Name:', extractedName, '(from form:', formName, ', from CV:', personalInfo?.name, ')');
      console.log('📌 Email:', extractedEmail, '(from form:', formEmail, ', from CV:', personalInfo?.email, ')');
      
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

      // 🎯 CRITICAL: ALLA konsulter ska vara "My Consultants" nu
      // Ta bort source parameter check - alla ska hamna under My Consultants
      const isMyConsultant = true; // Alla nya konsulter ska vara "My Consultants"

      // 🎯 CRITICAL: Get current user for proper user_id assignment
      const { data: { user } } = await supabase.auth.getUser();

      // 🔥 CRITICAL: Create consultant data with REQUIRED fields including all analysis data
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
        
        // 🎯 Store analysis data for display in consultant cards
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
        type: 'existing', // 🎯 CRITICAL: Alla konsulter ska vara "existing" (My Consultants)
        user_id: user?.id || null, // 🎯 CRITICAL: Sätt user_id för alla nya konsulter
      };

      console.log('🔥 CREATING CONSULTANT with these CRITICAL fields:');
      console.log('📌 type:', consultantData.type);
      console.log('📌 user_id:', consultantData.user_id);
      console.log('📌 email:', consultantData.email);
      console.log('📌 name:', consultantData.name);
      console.log('📌 isMyConsultant:', isMyConsultant);

      // 🎯 Create consultant in database
      const { data: consultant, error: consultantError } = await supabase
        .from('consultants')
        .insert(consultantData)
        .select()
        .single();

      if (consultantError) {
        console.error('❌ Error creating consultant:', consultantError);
        throw new Error('Failed to create consultant profile: ' + consultantError.message);
      }

      console.log('🎉 Consultant created successfully!');
      console.log('✅ Consultant ID:', consultant.id);
      console.log('✅ Consultant type:', consultant.type);
      console.log('✅ Consultant user_id:', consultant.user_id);
      console.log('✅ Consultant email:', consultant.email);
      
      onAnalysisProgress?.(90);

      // 📧 Send emails - ALWAYS try to send even if analysis failed
      if (extractedEmail && extractedEmail.trim() !== '') {
        try {
          // Send welcome email to consultant
          await sendWelcomeEmail(extractedName, extractedEmail, isMyConsultant);
          
          // Send registration notification to admin
          await sendRegistrationNotification(extractedName, extractedEmail, isMyConsultant);
          
        } catch (emailError) {
          console.error('❌ Email sending failed but continuing:', emailError);
          // Don't throw error, just log it - emails shouldn't block the process
        }
      } else {
        console.error('❌ No valid email available for emails');
        console.error('❌ extractedEmail:', extractedEmail);
        console.error('❌ formEmail:', formEmail);
        console.error('❌ personalInfo?.email:', personalInfo?.email);
      }

      onAnalysisProgress?.(100);

      // Return analysis results with enhanced consultant data including the full analysis objects
      const analysisResults = {
        cvAnalysis: cvAnalysisData,
        linkedinAnalysis: linkedinAnalysisData,
        consultant: {
          ...consultant,
          // 🎯 Include the full analysis objects for display in ConsultantAnalysisCard
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
