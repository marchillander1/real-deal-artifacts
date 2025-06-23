
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { EmailNotificationHandler } from './EmailNotificationHandler';
import { CVParser } from './cv-analysis/CVParser';
import { LinkedInAnalyzer } from './cv-analysis/LinkedInAnalyzer';
import { ConsultantCreator } from './cv-analysis/ConsultantCreator';

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
    
    if (shouldStartAnalysis) {
      console.log('🚀 Auto-triggering enhanced analysis');
      handleAnalysis();
    }
  }, [file, linkedinUrl, isAnalyzing, analysisCompleted]);

  // Reset analysis när file eller URL ändras
  useEffect(() => {
    setAnalysisCompleted(false);
  }, [file, linkedinUrl]);

  const extractPersonalInfo = (cvAnalysisData: any, detectedInfo: any) => {
    console.log('📋 Extracting personal info with enhanced logic');
    
    const personalInfo = cvAnalysisData?.personalInfo || {};
    
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
    
    const result = {
      name: extractedName,
      email: extractedEmail,
      phone: extractedPhone,
      location: extractedLocation
    };

    console.log('✅ Personal info extracted:', result);
    return result;
  };

  const sendWelcomeEmail = async (consultant: any, personalInfo: any, isMyConsultant: boolean) => {
    try {
      const emailResult = await EmailNotificationHandler.sendWelcomeEmails({
        consultantId: consultant.id,
        finalEmail: personalInfo.email,
        finalName: personalInfo.name,
        isMyConsultant: isMyConsultant,
        toast: toast
      });
      
      if (emailResult.success) {
        toast({
          title: "Välkomstmail skickat! ✅",
          description: `Mail skickat till ${personalInfo.email}`,
          variant: "default",
        });
      } else {
        toast({
          title: "Registrering lyckades",
          description: "Profil skapad men välkomstmail misslyckades",
          variant: "default",
        });
      }
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError);
      toast({
        title: "Registrering lyckades", 
        description: "Profil skapad men e-postnotifiering misslyckades",
        variant: "default",
      });
    }
  };

  const handleAnalysis = async () => {
    if (!file) {
      onError('Ingen fil vald');
      return;
    }

    if (!isValidLinkedInUrl(linkedinUrl)) {
      onError('Giltig LinkedIn URL krävs');
      return;
    }

    try {
      setIsAnalyzing(true);
      onAnalysisStart();
      onAnalysisProgress(10);

      console.log('🚀 Starting enhanced CV analysis workflow');

      // Steg 1: Enhanced CV-analys
      const { analysis: cvAnalysisData, detectedInfo } = await CVParser.parseCV(file);
      onAnalysisProgress(50);

      console.log('📊 CV analysis completed:', {
        hasPersonalInfo: !!cvAnalysisData.personalInfo,
        hasExperience: !!cvAnalysisData.experience,
        skillsCount: Object.values(cvAnalysisData.skills || {}).reduce((sum: number, arr: any) => sum + (Array.isArray(arr) ? arr.length : 0), 0)
      });

      // Steg 2: LinkedIn-analys
      const linkedinData = await LinkedInAnalyzer.analyzeLinkedIn(linkedinUrl);
      onAnalysisProgress(75);

      // Steg 3: Extrahera personlig info med förbättrad logik
      const extractedPersonalInfo = extractPersonalInfo(cvAnalysisData, detectedInfo);
      
      // Steg 4: Skapa konsult med standardiserad datastruktur
      const urlParams = new URLSearchParams(window.location.search);
      const isMyConsultant = urlParams.get('source') === 'my-consultants';

      const insertedConsultant = await ConsultantCreator.createConsultant({
        cvAnalysis: cvAnalysisData,
        linkedinData,
        extractedPersonalInfo,
        file,
        linkedinUrl,
        isMyConsultant
      });

      onAnalysisProgress(90);

      // Skicka välkomstmail
      await sendWelcomeEmail(insertedConsultant, extractedPersonalInfo, isMyConsultant);

      onAnalysisProgress(100);

      // Slutför analysresultat med standardiserad struktur
      const completeAnalysisResults = {
        cvAnalysis: cvAnalysisData,
        linkedinAnalysis: linkedinData,
        consultant: insertedConsultant,
        extractedPersonalInfo
      };

      setAnalysisCompleted(true);
      onAnalysisComplete(completeAnalysisResults);

      toast({
        title: "Enhanced analys slutförd! 🎉",
        description: `Förbättrad profil skapad för ${extractedPersonalInfo.name}`,
      });

    } catch (error: any) {
      console.error('❌ Enhanced analysis failed:', error);
      onError(error.message || 'Förbättrad analys misslyckades');
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
