
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { EmailNotificationHandler } from './EmailNotificationHandler';

export interface CVAnalysisLogicProps {
  file: File | null;
  linkedinUrl: string;
  formEmail: string;
  formName: string;
  onAnalysisComplete: (analysis: { cvAnalysis: any; linkedinAnalysis: any; consultant: any; enhancedAnalysisResults?: any }) => void;
  onError: (message: string) => void;
  onAnalysisStart: () => void;
  onAnalysisProgress: (progress: number) => void;
}

export const CVAnalysisLogic: React.FC<CVAnalysisLogicProps> = ({
  file,
  linkedinUrl,
  formEmail,
  formName,
  onAnalysisComplete,
  onError,
  onAnalysisStart,
  onAnalysisProgress
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const { toast } = useToast();

  // Debug logging
  useEffect(() => {
    console.log('🔍 CVAnalysisLogic state:', {
      hasFile: !!file,
      fileName: file?.name,
      hasLinkedinUrl: !!linkedinUrl,
      linkedinUrl,
      isAnalyzing,
      hasAnalysis: !!analysis,
      formEmail,
      formName
    });
  }, [file, linkedinUrl, isAnalyzing, analysis, formEmail, formName]);

  const isValidLinkedInUrl = (url: string) => {
    if (!url || url.trim() === '') return false;
    return url.includes('linkedin.com');
  };

  // Auto-trigger analysis
  useEffect(() => {
    const hasValidLinkedIn = isValidLinkedInUrl(linkedinUrl);
    const shouldStartAnalysis = file && hasValidLinkedIn && !isAnalyzing && !analysis;
    
    console.log('🤖 Auto-trigger check:', {
      hasFile: !!file,
      hasValidLinkedIn,
      isAnalyzing,
      hasAnalysis: !!analysis,
      shouldStartAnalysis
    });

    if (shouldStartAnalysis) {
      console.log('🚀 Auto-triggering analysis');
      handleAnalysis();
    }
  }, [file, linkedinUrl, isAnalyzing, analysis]);

  // Reset analysis when file or URL changes
  useEffect(() => {
    console.log('🔄 Resetting analysis');
    setAnalysis(null);
  }, [file, linkedinUrl]);

  const safeGetString = (value: any, defaultValue: string = ''): string => {
    if (typeof value === 'string' && value !== 'Not specified' && value.trim() !== '') {
      return value;
    }
    return defaultValue;
  };

  const safeParseInt = (value: any, defaultValue: number = 0): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string' && value !== 'Not specified' && value.trim() !== '') {
      const parsed = parseInt(value.match(/(\d+)/)?.[1] || defaultValue.toString());
      return isNaN(parsed) ? defaultValue : parsed;
    }
    return defaultValue;
  };

  const handleAnalysis = async () => {
    if (!file) {
      console.error('❌ No file selected');
      onError('No file selected');
      return;
    }

    if (!isValidLinkedInUrl(linkedinUrl)) {
      console.error('❌ Invalid LinkedIn URL');
      onError('Valid LinkedIn URL required');
      return;
    }

    try {
      console.log('🚀 Starting analysis');
      setIsAnalyzing(true);
      onAnalysisStart();
      onAnalysisProgress(10);

      // Step 1: Parse CV
      const formData = new FormData();
      formData.append('file', file);

      console.log('📄 Parsing CV:', file.name);
      
      const cvResponse = await supabase.functions.invoke('parse-cv', {
        body: formData
      });

      console.log('📊 CV response:', cvResponse);
      
      if (cvResponse.error) {
        console.error('❌ CV analysis error:', cvResponse.error);
        throw new Error(`CV analysis failed: ${cvResponse.error.message}`);
      }

      const cvAnalysisData = cvResponse.data.analysis;
      const enhancedAnalysisResults = cvResponse.data.enhancedAnalysisResults;
      
      console.log('📋 CV analysis data:', {
        personalInfo: cvAnalysisData?.personalInfo,
        professionalSummary: cvAnalysisData?.professionalSummary,
        technicalExpertise: cvAnalysisData?.technicalExpertise
      });
      
      setAnalysis(cvResponse.data);
      onAnalysisProgress(50);

      // Step 2: LinkedIn Analysis
      let linkedinData = null;
      if (linkedinUrl && linkedinUrl.trim()) {
        console.log('🔗 Analyzing LinkedIn:', linkedinUrl);
        const linkedinResponse = await supabase.functions.invoke('analyze-linkedin', {
          body: { linkedinUrl: linkedinUrl.trim() }
        });

        console.log('📊 LinkedIn response:', linkedinResponse);
        
        if (linkedinResponse.error) {
          console.warn('⚠️ LinkedIn analysis failed:', linkedinResponse.error);
          toast({
            title: "LinkedIn analysis failed",
            description: "Continuing with CV analysis only",
            variant: "default",
          });
        } else {
          linkedinData = linkedinResponse.data;
          console.log('✅ LinkedIn analysis completed');
        }
      }

      onAnalysisProgress(75);

      // Step 3: Extract and map data intelligently
      const cvPersonalInfo = cvAnalysisData?.personalInfo || {};
      const detectedInfo = enhancedAnalysisResults?.detectedInformation || {};
      
      console.log('📝 Data extraction:', {
        cvPersonalInfo,
        detectedInfo
      });
      
      // Smart data extraction with priority
      let extractedName = safeGetString(cvPersonalInfo.name);
      if (!extractedName && detectedInfo.names && detectedInfo.names.length > 0) {
        extractedName = detectedInfo.names.find(name => 
          name && name.length > 2 && !name.includes('If Gt') && !name.includes('Analysis')
        ) || '';
      }
      
      let extractedEmail = safeGetString(cvPersonalInfo.email);
      if (!extractedEmail && detectedInfo.emails && detectedInfo.emails.length > 0) {
        extractedEmail = detectedInfo.emails.find(email => 
          email && email.includes('@') && email.includes('.') && 
          !email.includes('example.com') && !email.includes('temp.com')
        ) || '';
      }
      
      let extractedPhone = safeGetString(cvPersonalInfo.phone);
      if (!extractedPhone && detectedInfo.phones && detectedInfo.phones.length > 0) {
        extractedPhone = detectedInfo.phones.find(phone => 
          phone && phone.length > 5 && !phone.includes('0000000000') && !phone.includes('123')
        ) || '';
      }
      
      let extractedLocation = safeGetString(cvPersonalInfo.location);
      if (!extractedLocation && detectedInfo.locations && detectedInfo.locations.length > 0) {
        extractedLocation = detectedInfo.locations[0] || '';
      }
      
      // Final values with intelligent fallbacks
      const finalName = extractedName || formName || 'Professional Consultant';
      const finalEmail = extractedEmail || formEmail || 'temp@temp.com';
      const finalPhone = extractedPhone;
      const finalLocation = extractedLocation;
      
      console.log('🎯 Final extracted values:', {
        finalName,
        finalEmail,
        finalPhone,
        finalLocation
      });

      // Step 4: Create consultant
      const urlParams = new URLSearchParams(window.location.search);
      const isMyConsultant = urlParams.get('source') === 'my-consultants';

      // Extract comprehensive skills
      const cvSkills = [
        ...(cvAnalysisData?.technicalExpertise?.programmingLanguages?.expert || []),
        ...(cvAnalysisData?.technicalExpertise?.programmingLanguages?.proficient || []),
        ...(cvAnalysisData?.technicalExpertise?.programmingLanguages?.familiar || []),
        ...(cvAnalysisData?.technicalExpertise?.frameworks || []),
        ...(cvAnalysisData?.technicalExpertise?.tools || []),
        ...(cvAnalysisData?.technicalExpertise?.databases || [])
      ].filter(skill => skill && skill.length > 0);
      
      const detectedSkills = detectedInfo.skills || [];
      const allSkills = [...new Set([...cvSkills, ...detectedSkills])];
      
      const realRoles = cvAnalysisData?.workExperience?.map(exp => exp.role).filter(role => role && role !== 'Not specified') || [];
      const finalRoles = realRoles.length > 0 ? realRoles : [safeGetString(cvAnalysisData?.professionalSummary?.currentRole, 'Consultant')];
      
      const experienceYears = safeParseInt(cvAnalysisData?.professionalSummary?.yearsOfExperience, 5);
      const hourlyRate = safeParseInt(cvAnalysisData?.marketPositioning?.hourlyRateEstimate?.recommended, 1000);
      
      console.log('💾 Creating consultant with extracted data:', {
        finalName,
        finalEmail,
        finalPhone,
        finalLocation,
        skillsCount: allSkills.length,
        rolesCount: finalRoles.length,
        experienceYears,
        hourlyRate
      });

      const consultantData = {
        name: finalName,
        email: finalEmail,
        phone: finalPhone,
        location: finalLocation,
        skills: allSkills,
        experience_years: experienceYears,
        hourly_rate: hourlyRate,
        availability: 'Available',
        cv_file_path: file.name,
        communication_style: linkedinData?.communicationStyle || cvAnalysisData?.softSkills?.communication?.[0] || 'Professional communication',
        rating: 4.8,
        projects_completed: 0,
        roles: finalRoles,
        certifications: cvAnalysisData?.education?.certifications || [],
        type: isMyConsultant ? 'existing' : 'new',
        user_id: isMyConsultant ? 'temp-user-id' : null,
        languages: cvAnalysisData?.languages || ['English', 'Swedish'],
        work_style: linkedinData?.teamFitAssessment?.workStyle || cvAnalysisData?.softSkills?.teamwork?.[0] || 'Collaborative',
        values: cvAnalysisData?.softSkills?.leadership || ['Professional growth', 'Innovation'],
        personality_traits: linkedinData?.contentAnalysisInsights?.professionalValues || cvAnalysisData?.softSkills?.problemSolving || ['Problem-oriented', 'Analytical'],
        team_fit: linkedinData?.teamFitAssessment?.workStyle || cvAnalysisData?.softSkills?.teamwork?.[0] || 'Team player',
        cultural_fit: linkedinData?.culturalFit || 5,
        adaptability: linkedinData?.adaptability || 5,
        leadership: linkedinData?.leadership || Math.min(experienceYears >= 5 ? 4 : 3, 5),
        linkedin_url: linkedinUrl || '',
        cv_analysis_data: cvResponse.data,
        linkedin_analysis_data: linkedinData
      };

      console.log('💾 Inserting consultant');

      const { data: insertedConsultant, error: insertError } = await supabase
        .from('consultants')
        .insert([consultantData])
        .select()
        .single();

      if (insertError) {
        console.error('❌ Database insert error:', insertError);
        throw new Error(`Failed to save consultant: ${insertError.message}`);
      }

      console.log('✅ Consultant created successfully');
      onAnalysisProgress(90);

      // Send emails
      console.log('📧 Sending welcome emails');
      try {
        await EmailNotificationHandler.sendWelcomeEmails({
          consultantId: insertedConsultant.id,
          finalEmail: finalEmail,
          finalName: finalName,
          isMyConsultant: isMyConsultant,
          toast: toast
        });
        console.log('✅ Welcome emails sent');
      } catch (emailError) {
        console.error('❌ Email sending failed:', emailError);
        toast({
          title: "Registration successful",
          description: "Profile created but email notification failed",
          variant: "default",
        });
      }

      onAnalysisProgress(100);

      // Complete analysis results
      const completeAnalysisResults = {
        cvAnalysis: cvResponse.data,
        linkedinAnalysis: linkedinData,
        consultant: insertedConsultant,
        enhancedAnalysisResults: enhancedAnalysisResults || null,
        extractedPersonalInfo: {
          name: extractedName,
          email: extractedEmail,
          phone: extractedPhone,
          location: extractedLocation
        }
      };

      onAnalysisComplete(completeAnalysisResults);

      toast({
        title: "Analysis completed!",
        description: `Profile created: ${finalName}`,
      });

    } catch (error: any) {
      console.error('❌ Analysis failed:', error);
      onError(error.message || 'Analysis failed');
      toast({
        title: "Analysis failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return null;
};

export default CVAnalysisLogic;
