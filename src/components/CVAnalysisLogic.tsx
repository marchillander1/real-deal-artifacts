
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

  // Auto-trigger analysis när båda file och LinkedIn URL finns
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

  // Reset analysis när file eller URL ändras
  useEffect(() => {
    console.log('🔄 Resetting analysis due to input change');
    setAnalysis(null);
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
      
      setAnalysis({ cvAnalysis: cvResponse.data });
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
      
      console.log('🎯 Extracted values:', {
        extractedName,
        extractedEmail,
        extractedPhone,
        extractedLocation
      });

      // Steg 4: Skapa konsult
      const urlParams = new URLSearchParams(window.location.search);
      const isMyConsultant = urlParams.get('source') === 'my-consultants';

      // Skills extraktion
      const allSkills = [
        ...(cvAnalysisData?.skills?.technical || []),
        ...(cvAnalysisData?.skills?.languages || []),
        ...(cvAnalysisData?.skills?.tools || [])
      ].filter(skill => skill && skill.length > 0 && skill !== 'Ej specificerat');
      
      const experienceYears = cvAnalysisData?.experience?.years !== 'Ej specificerat' 
        ? parseInt(cvAnalysisData.experience.years.toString().match(/\d+/)?.[0] || '5') 
        : 5;
      
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
        roles: cvAnalysisData?.workHistory?.map((exp: any) => exp.role).filter((role: string) => role && role !== 'Ej specificerat') || [cvAnalysisData?.experience?.currentRole || 'Konsult'],
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

      // Skicka e-post
      console.log('📧 Sending welcome emails');
      try {
        await EmailNotificationHandler.sendWelcomeEmails({
          consultantId: insertedConsultant.id,
          finalEmail: extractedEmail,
          finalName: extractedName,
          isMyConsultant: isMyConsultant,
          toast: toast
        });
        console.log('✅ Welcome emails sent');
      } catch (emailError) {
        console.error('❌ Email sending failed:', emailError);
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
