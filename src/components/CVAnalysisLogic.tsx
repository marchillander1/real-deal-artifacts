
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
  const [analysisCompleted, setAnalysisCompleted] = useState(false);
  const { toast } = useToast();

  const isValidLinkedInUrl = (url: string) => {
    if (!url || url.trim() === '') return false;
    return url.includes('linkedin.com');
  };

  // Auto-trigger analysis när båda file och LinkedIn URL finns
  useEffect(() => {
    const hasValidLinkedIn = isValidLinkedInUrl(linkedinUrl);
    const shouldStartAnalysis = file && hasValidLinkedIn && !isAnalyzing && !analysisCompleted;
    
    console.log('🤖 Auto-trigger check:', {
      hasFile: !!file,
      hasValidLinkedIn,
      isAnalyzing,
      analysisCompleted,
      shouldStartAnalysis
    });

    if (shouldStartAnalysis) {
      console.log('🚀 Auto-triggering analysis');
      handleAnalysis();
    }
  }, [file, linkedinUrl, isAnalyzing, analysisCompleted]);

  // Reset analysis när file eller URL ändras
  useEffect(() => {
    console.log('🔄 Resetting analysis due to input change');
    setAnalysisCompleted(false);
  }, [file, linkedinUrl]);

  const handleAnalysis = async () => {
    if (!file) {
      console.error('❌ No file selected');
      onError('Ingen fil vald');
      return;
    }

    if (!isValidLinkedInUrl(linkedinUrl)) {
      console.error('❌ Invalid LinkedIn URL');
      onError('Giltig LinkedIn URL krävs');
      return;
    }

    try {
      console.log('🚀 Starting comprehensive analysis');
      setIsAnalyzing(true);
      onAnalysisStart();
      onAnalysisProgress(10);

      // Steg 1: CV-analys
      const formData = new FormData();
      formData.append('file', file);

      console.log('📄 CV parsing:', file.name);
      
      const cvResponse = await supabase.functions.invoke('parse-cv', {
        body: formData
      });

      console.log('📊 CV response:', cvResponse);
      
      if (cvResponse.error) {
        console.error('❌ CV analysis error:', cvResponse.error);
        throw new Error(`CV-analys misslyckades: ${cvResponse.error.message}`);
      }

      const cvAnalysisData = cvResponse.data.analysis;
      const detectedInfo = cvResponse.data.detectedInformation;
      
      console.log('📋 CV analysis data:', {
        analysis: cvAnalysisData,
        detected: detectedInfo
      });
      
      onAnalysisProgress(50);

      // Steg 2: LinkedIn-analys
      let linkedinData = null;
      if (linkedinUrl && linkedinUrl.trim()) {
        console.log('🔗 LinkedIn analysis:', linkedinUrl);
        const linkedinResponse = await supabase.functions.invoke('analyze-linkedin', {
          body: { linkedinUrl: linkedinUrl.trim() }
        });

        console.log('📊 LinkedIn response:', linkedinResponse);
        
        if (linkedinResponse.error) {
          console.warn('⚠️ LinkedIn analysis failed:', linkedinResponse.error);
          toast({
            title: "LinkedIn-analys misslyckades",
            description: "Fortsätter med endast CV-analys",
            variant: "default",
          });
        } else {
          linkedinData = linkedinResponse.data;
          console.log('✅ LinkedIn analysis completed');
        }
      }

      onAnalysisProgress(75);

      // Steg 3: Extrahera personlig info med smart fallback
      const personalInfo = cvAnalysisData?.personalInfo || {};
      
      // Smart extraktion med prioritet: detekterad -> CV-analys -> form data
      const extractedName = (detectedInfo?.names?.[0] && detectedInfo.names[0] !== 'Ej specificerat') 
        ? detectedInfo.names[0] 
        : (personalInfo.name && personalInfo.name !== 'Ej specificerat') 
        ? personalInfo.name 
        : formName || 'Professionell konsult';
        
      const extractedEmail = (detectedInfo?.emails?.[0] && detectedInfo.emails[0] !== 'Ej specificerat' && detectedInfo.emails[0].includes('@')) 
        ? detectedInfo.emails[0] 
        : (personalInfo.email && personalInfo.email !== 'Ej specificerat' && personalInfo.email.includes('@')) 
        ? personalInfo.email 
        : formEmail || 'temp@temp.com';
        
      const extractedPhone = (detectedInfo?.phones?.[0] && detectedInfo.phones[0] !== 'Ej specificerat') 
        ? detectedInfo.phones[0] 
        : (personalInfo.phone && personalInfo.phone !== 'Ej specificerat') 
        ? personalInfo.phone 
        : '';
        
      const extractedLocation = personalInfo.location !== 'Ej specificerat' ? personalInfo.location : '';
      
      console.log('🎯 Extracted values for consultant creation:', {
        extractedName,
        extractedEmail,
        extractedPhone,
        extractedLocation
      });

      // Steg 4: Skapa konsult
      const urlParams = new URLSearchParams(window.location.search);
      const isMyConsultant = urlParams.get('source') === 'my-consultants';

      // Skills extraktion - handle both old and new structure
      let allSkills = [];
      if (cvAnalysisData?.skills) {
        allSkills = [
          ...(cvAnalysisData.skills.technical || []),
          ...(cvAnalysisData.skills.languages || []),
          ...(cvAnalysisData.skills.tools || [])
        ];
      } else if (cvAnalysisData?.technicalExpertise) {
        // Handle new structure
        const tech = cvAnalysisData.technicalExpertise;
        allSkills = [
          ...(tech.programmingLanguages?.expert || []),
          ...(tech.programmingLanguages?.proficient || []),
          ...(tech.programmingLanguages?.familiar || []),
          ...(tech.frameworks || []),
          ...(tech.tools || []),
          ...(tech.databases || [])
        ];
      }
      
      allSkills = allSkills.filter(skill => skill && skill.length > 0 && skill !== 'Ej specificerat');
      
      // Experience years - handle both old and new structure
      let experienceYears = 5;
      if (cvAnalysisData?.experience?.years && cvAnalysisData.experience.years !== 'Ej specificerat') {
        experienceYears = parseInt(cvAnalysisData.experience.years.toString().match(/\d+/)?.[0] || '5');
      } else if (cvAnalysisData?.professionalSummary?.yearsOfExperience && cvAnalysisData.professionalSummary.yearsOfExperience !== 'Not specified') {
        experienceYears = parseInt(cvAnalysisData.professionalSummary.yearsOfExperience.toString().match(/\d+/)?.[0] || '5');
      }
      
      const hourlyRate = 1000; // Default hourly rate
      
      console.log('💾 Creating consultant with data:', {
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
        communication_style: linkedinData?.communicationStyle || 'Professionell kommunikation',
        rating: 4.8,
        projects_completed: 0,
        roles: cvAnalysisData?.workHistory?.map((exp: any) => exp.role).filter((role: string) => role && role !== 'Ej specificerat') || [cvAnalysisData?.experience?.currentRole || cvAnalysisData?.professionalSummary?.currentRole || 'Konsult'],
        certifications: [],
        type: isMyConsultant ? 'existing' : 'new',
        user_id: isMyConsultant ? 'temp-user-id' : null,
        languages: ['English', 'Swedish'],
        work_style: linkedinData?.teamFitAssessment?.workStyle || 'Kollaborativ',
        values: ['Professionell utveckling', 'Innovation'],
        personality_traits: linkedinData?.contentAnalysisInsights?.professionalValues || ['Problemorienterad', 'Analytisk'],
        team_fit: linkedinData?.teamFitAssessment?.workStyle || 'Teamspelare',
        cultural_fit: linkedinData?.culturalFit || 5,
        adaptability: linkedinData?.adaptability || 5,
        leadership: linkedinData?.leadership || Math.min(experienceYears >= 5 ? 4 : 3, 5),
        linkedin_url: linkedinUrl || '',
        cv_analysis_data: cvResponse.data,
        linkedin_analysis_data: linkedinData
      };

      console.log('💾 Inserting consultant to database');

      const { data: insertedConsultant, error: insertError } = await supabase
        .from('consultants')
        .insert([consultantData])
        .select()
        .single();

      if (insertError) {
        console.error('❌ Database insert error:', insertError);
        throw new Error(`Misslyckades spara konsult: ${insertError.message}`);
      }

      console.log('✅ Consultant created successfully:', insertedConsultant.id);
      onAnalysisProgress(90);

      // 🔥 VIKTIGT: Skicka välkomstmail INNAN vi slutför analysen
      console.log('📧 🚨 SENDING WELCOME EMAILS NOW - BEFORE COMPLETING ANALYSIS');
      console.log('📧 🎯 Email will be sent to:', extractedEmail);
      console.log('📧 📝 Consultant name for email:', extractedName);
      
      try {
        const emailResult = await EmailNotificationHandler.sendWelcomeEmails({
          consultantId: insertedConsultant.id,
          finalEmail: extractedEmail, // 🔥 Använd extracted email 
          finalName: extractedName,   // 🔥 Använd extracted name
          isMyConsultant: isMyConsultant,
          toast: toast
        });
        
        if (emailResult.success) {
          console.log('✅ 📧 Welcome emails sent successfully!');
          toast({
            title: "Välkomstmail skickat! ✅",
            description: `Mail skickat till ${extractedEmail}`,
            variant: "default",
          });
        } else {
          console.error('❌ 📧 Welcome email failed:', emailResult.error);
          toast({
            title: "Registrering lyckades",
            description: "Profil skapad men välkomstmail misslyckades",
            variant: "default",
          });
        }
      } catch (emailError) {
        console.error('❌ Email sending failed with exception:', emailError);
        toast({
          title: "Registrering lyckades", 
          description: "Profil skapad men e-postnotifiering misslyckades",
          variant: "default",
        });
      }

      onAnalysisProgress(100);

      // Slutför analysresultat
      const completeAnalysisResults = {
        cvAnalysis: cvResponse.data,
        linkedinAnalysis: linkedinData,
        consultant: insertedConsultant,
        extractedPersonalInfo: {
          name: extractedName,
          email: extractedEmail,
          phone: extractedPhone,
          location: extractedLocation
        }
      };

      setAnalysisCompleted(true);
      onAnalysisComplete(completeAnalysisResults);

      toast({
        title: "Analys slutförd! 🎉",
        description: `Profil skapad för ${extractedName}`,
      });

    } catch (error: any) {
      console.error('❌ Analysis failed:', error);
      onError(error.message || 'Analys misslyckades');
      toast({
        title: "Analys misslyckades",
        description: error.message || "Ett oväntat fel inträffade",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return null;
};

export default CVAnalysisLogic;
