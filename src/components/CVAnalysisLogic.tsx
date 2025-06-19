
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { EmailNotificationHandler } from './EmailNotificationHandler';

export interface CVAnalysisLogicProps {
  file: File | null;
  linkedinUrl: string;
  formEmail: string;
  formName: string;
  onAnalysisComplete: (analysis: { cvAnalysis: any; linkedinAnalysis: any; consultant: any; extractedPersonalInfo?: any }) => void;
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

  const isValidLinkedInUrl = (url: string) => {
    if (!url || url.trim() === '') return false;
    return url.includes('linkedin.com');
  };

  // Auto-trigger analysis when file and LinkedIn URL are available
  useEffect(() => {
    const hasValidLinkedIn = isValidLinkedInUrl(linkedinUrl);
    const shouldStartAnalysis = file && hasValidLinkedIn && !isAnalyzing && !analysis;
    
    console.log('🤖 Enhanced auto-trigger check:', {
      hasFile: !!file,
      hasValidLinkedIn,
      isAnalyzing,
      hasAnalysis: !!analysis,
      shouldStartAnalysis
    });

    if (shouldStartAnalysis) {
      console.log('🚀 Auto-triggering enhanced analysis');
      handleEnhancedAnalysis();
    }
  }, [file, linkedinUrl, isAnalyzing, analysis]);

  // Reset analysis when file or URL changes
  useEffect(() => {
    console.log('🔄 Resetting analysis due to input change');
    setAnalysis(null);
  }, [file, linkedinUrl]);

  const handleEnhancedAnalysis = async () => {
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
      console.log('🚀 Starting enhanced comprehensive analysis');
      setIsAnalyzing(true);
      onAnalysisStart();
      onAnalysisProgress(10);

      // Step 1: Enhanced CV parsing
      const formData = new FormData();
      formData.append('file', file);

      console.log('📄 Enhanced CV parsing:', file.name);
      
      const cvResponse = await supabase.functions.invoke('parse-cv', {
        body: formData
      });

      console.log('📊 Enhanced CV response:', cvResponse);
      
      if (cvResponse.error) {
        console.error('❌ Enhanced CV analysis error:', cvResponse.error);
        throw new Error(`Enhanced CV analysis failed: ${cvResponse.error.message}`);
      }

      const cvAnalysisData = cvResponse.data.analysis;
      const detectedInfo = cvResponse.data.detectedInformation;
      const extractionStats = cvResponse.data.extractionStats;
      
      console.log('📋 Enhanced CV analysis data:', {
        analysis: cvAnalysisData,
        detected: detectedInfo,
        stats: extractionStats
      });
      
      setAnalysis({ cvAnalysis: cvResponse.data });
      onAnalysisProgress(50);

      // Step 2: LinkedIn Analysis
      let linkedinData = null;
      if (linkedinUrl && linkedinUrl.trim()) {
        console.log('🔗 Enhanced LinkedIn analysis:', linkedinUrl);
        const linkedinResponse = await supabase.functions.invoke('analyze-linkedin', {
          body: { linkedinUrl: linkedinUrl.trim() }
        });

        console.log('📊 Enhanced LinkedIn response:', linkedinResponse);
        
        if (linkedinResponse.error) {
          console.warn('⚠️ LinkedIn analysis failed:', linkedinResponse.error);
          toast({
            title: "LinkedIn analysis failed",
            description: "Continuing with enhanced CV analysis only",
            variant: "default",
          });
        } else {
          linkedinData = linkedinResponse.data;
          console.log('✅ Enhanced LinkedIn analysis completed');
        }
      }

      onAnalysisProgress(75);

      // Step 3: Enhanced data extraction with smart fallbacks
      const personalInfo = cvAnalysisData?.personalInfo || {};
      
      // Smart extraction with multiple sources
      const detectedName = detectedInfo?.names?.[0] || personalInfo.name;
      const detectedEmail = detectedInfo?.emails?.[0] || personalInfo.email;
      const detectedPhone = detectedInfo?.phones?.[0] || personalInfo.phone;
      
      const extractedName = (detectedName && detectedName !== 'Not specified') ? detectedName : formName || 'Professional Consultant';
      const extractedEmail = (detectedEmail && detectedEmail !== 'Not specified' && detectedEmail.includes('@')) ? detectedEmail : formEmail || 'temp@temp.com';
      const extractedPhone = (detectedPhone && detectedPhone !== 'Not specified') ? detectedPhone : '';
      const extractedLocation = personalInfo.location !== 'Not specified' ? personalInfo.location : '';
      
      console.log('🎯 Enhanced extracted values:', {
        detectedName,
        detectedEmail, 
        detectedPhone,
        extractedName,
        extractedEmail,
        extractedPhone,
        extractedLocation
      });

      // Step 4: Create consultant with enhanced data
      const urlParams = new URLSearchParams(window.location.search);
      const isMyConsultant = urlParams.get('source') === 'my-consultants';

      // Enhanced skills extraction
      const allSkills = [
        ...(cvAnalysisData?.technicalExpertise?.programmingLanguages?.expert || []),
        ...(cvAnalysisData?.technicalExpertise?.programmingLanguages?.proficient || []),
        ...(cvAnalysisData?.technicalExpertise?.programmingLanguages?.familiar || []),
        ...(cvAnalysisData?.technicalExpertise?.frameworks || []),
        ...(cvAnalysisData?.technicalExpertise?.tools || []),
        ...(cvAnalysisData?.technicalExpertise?.databases || [])
      ].filter(skill => skill && skill.length > 0);
      
      const experienceYears = cvAnalysisData?.professionalSummary?.yearsOfExperience !== 'Not specified' 
        ? parseInt(cvAnalysisData.professionalSummary.yearsOfExperience.toString().match(/\d+/)?.[0] || '5') 
        : 5;
      
      const hourlyRate = cvAnalysisData?.marketPositioning?.hourlyRateEstimate?.recommended || 1000;
      
      console.log('💾 Creating consultant with enhanced data:', {
        name: extractedName,
        email: extractedEmail,
        phone: extractedPhone,
        location: extractedLocation,
        skillsCount: allSkills.length,
        experienceYears,
        hourlyRate
      });

      const consultantData = {
        name: extractedName,
        email: extractedEmail,
        phone: extractedPhone,
        location: extractedLocation,
        skills: allSkills,
        experience_years: experienceYears,
        hourly_rate: hourlyRate,
        availability: 'Available',
        cv_file_path: file.name,
        communication_style: linkedinData?.communicationStyle || 'Professional communication',
        rating: 4.8,
        projects_completed: 0,
        roles: cvAnalysisData?.workExperience?.map((exp: any) => exp.role).filter((role: string) => role && role !== 'Not specified') || [cvAnalysisData?.professionalSummary?.currentRole || 'Consultant'],
        certifications: cvAnalysisData?.education?.certifications || [],
        type: isMyConsultant ? 'existing' : 'new',
        user_id: isMyConsultant ? 'temp-user-id' : null,
        languages: cvAnalysisData?.languages || ['English', 'Swedish'],
        work_style: linkedinData?.teamFitAssessment?.workStyle || 'Collaborative',
        values: ['Professional growth', 'Innovation'],
        personality_traits: linkedinData?.contentAnalysisInsights?.professionalValues || ['Problem-oriented', 'Analytical'],
        team_fit: linkedinData?.teamFitAssessment?.workStyle || 'Team player',
        cultural_fit: linkedinData?.culturalFit || 5,
        adaptability: linkedinData?.adaptability || 5,
        leadership: linkedinData?.leadership || Math.min(experienceYears >= 5 ? 4 : 3, 5),
        linkedin_url: linkedinUrl || '',
        cv_analysis_data: cvResponse.data,
        linkedin_analysis_data: linkedinData
      };

      console.log('💾 Inserting enhanced consultant to database');

      const { data: insertedConsultant, error: insertError } = await supabase
        .from('consultants')
        .insert([consultantData])
        .select()
        .single();

      if (insertError) {
        console.error('❌ Database insert error:', insertError);
        throw new Error(`Failed to save consultant: ${insertError.message}`);
      }

      console.log('✅ Enhanced consultant created successfully:', insertedConsultant.id);
      onAnalysisProgress(90);

      // Send emails
      console.log('📧 Sending enhanced welcome emails');
      try {
        await EmailNotificationHandler.sendWelcomeEmails({
          consultantId: insertedConsultant.id,
          finalEmail: extractedEmail,
          finalName: extractedName,
          isMyConsultant: isMyConsultant,
          toast: toast
        });
        console.log('✅ Enhanced welcome emails sent');
      } catch (emailError) {
        console.error('❌ Email sending failed:', emailError);
        toast({
          title: "Registration successful",
          description: "Enhanced profile created but email notification failed",
          variant: "default",
        });
      }

      onAnalysisProgress(100);

      // Complete enhanced analysis results
      const completeAnalysisResults = {
        cvAnalysis: cvResponse.data,
        linkedinAnalysis: linkedinData,
        consultant: insertedConsultant,
        extractedPersonalInfo: {
          name: extractedName,
          email: extractedEmail,
          phone: extractedPhone,
          location: extractedLocation
        },
        enhancedAnalysisResults: {
          detectedInformation: detectedInfo,
          extractionStats: extractionStats
        }
      };

      onAnalysisComplete(completeAnalysisResults);

      toast({
        title: "Enhanced analysis completed! 🎉",
        description: `Enhanced profile created for ${extractedName}`,
      });

    } catch (error: any) {
      console.error('❌ Enhanced analysis failed:', error);
      onError(error.message || 'Enhanced analysis failed');
      toast({
        title: "Enhanced analysis failed",
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
