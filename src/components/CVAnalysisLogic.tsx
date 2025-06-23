
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
  personalDescription: string;
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
  personalDescription,
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

  // Auto-trigger analysis when both file and LinkedIn URL are available
  useEffect(() => {
    const hasValidLinkedIn = isValidLinkedInUrl(linkedinUrl);
    const shouldStartAnalysis = file && hasValidLinkedIn && !isAnalyzing && !analysisCompleted;
    
    if (shouldStartAnalysis) {
      console.log('🚀 Auto-triggering enhanced analysis with personal description');
      handleAnalysis();
    }
  }, [file, linkedinUrl, isAnalyzing, analysisCompleted]);

  // Reset analysis when file or URL changes
  useEffect(() => {
    setAnalysisCompleted(false);
  }, [file, linkedinUrl]);

  const extractPersonalInfo = (cvAnalysisData: any, detectedInfo: any) => {
    console.log('📋 Extracting personal info with enhanced logic');
    
    const personalInfo = cvAnalysisData?.personalInfo || {};
    
    const extractedName = (detectedInfo?.names?.[0] && detectedInfo.names[0] !== 'Not specified') 
      ? detectedInfo.names[0] 
      : (personalInfo.name && personalInfo.name !== 'Not specified') 
      ? personalInfo.name 
      : formName || 'Professional consultant';
      
    const extractedEmail = (detectedInfo?.emails?.[0] && detectedInfo.emails[0] !== 'Not specified' && detectedInfo.emails[0].includes('@')) 
      ? detectedInfo.emails[0] 
      : (personalInfo.email && personalInfo.email !== 'Not specified' && personalInfo.email.includes('@')) 
      ? personalInfo.email 
      : formEmail || 'temp@temp.com';
      
    const extractedPhone = (detectedInfo?.phones?.[0] && detectedInfo.phones[0] !== 'Not specified') 
      ? detectedInfo.phones[0] 
      : (personalInfo.phone && personalInfo.phone !== 'Not specified') 
      ? personalInfo.phone 
      : '';
      
    const extractedLocation = personalInfo.location !== 'Not specified' ? personalInfo.location : '';
    
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
          title: "Welcome email sent! ✅",
          description: `Email sent to ${personalInfo.email}`,
          variant: "default",
        });
      } else {
        toast({
          title: "Registration successful",
          description: "Profile created but welcome email failed",
          variant: "default",
        });
      }
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError);
      toast({
        title: "Registration successful", 
        description: "Profile created but email notification failed",
        variant: "default",
      });
    }
  };

  const handleAnalysis = async () => {
    if (!file) {
      onError('No file selected');
      return;
    }

    if (!isValidLinkedInUrl(linkedinUrl)) {
      onError('Valid LinkedIn URL required');
      return;
    }

    try {
      setIsAnalyzing(true);
      onAnalysisStart();
      onAnalysisProgress(10);

      console.log('🚀 Starting enhanced CV analysis workflow with personal description');

      // Step 1: Enhanced CV analysis with personal description
      const { analysis: cvAnalysisData, detectedInfo } = await CVParser.parseCV(file);
      onAnalysisProgress(50);

      console.log('📊 CV analysis completed with personal description:', {
        hasPersonalInfo: !!cvAnalysisData.personalInfo,
        hasExperience: !!cvAnalysisData.experience,
        skillsCount: Object.values(cvAnalysisData.skills || {}).reduce((sum: number, arr: any) => sum + (Array.isArray(arr) ? arr.length : 0), 0),
        hasPersonalDescription: !!personalDescription
      });

      // Step 2: LinkedIn analysis
      const linkedinData = await LinkedInAnalyzer.analyzeLinkedIn(linkedinUrl);
      onAnalysisProgress(75);

      // Step 3: Extract personal info with improved logic
      const extractedPersonalInfo = extractPersonalInfo(cvAnalysisData, detectedInfo);
      
      // Step 4: Create consultant with standardized data structure
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

      // Send welcome email
      await sendWelcomeEmail(insertedConsultant, extractedPersonalInfo, isMyConsultant);

      onAnalysisProgress(100);

      // Complete analysis results with standardized structure
      const completeAnalysisResults = {
        cvAnalysis: cvAnalysisData,
        linkedinAnalysis: linkedinData,
        consultant: insertedConsultant,
        extractedPersonalInfo
      };

      setAnalysisCompleted(true);
      onAnalysisComplete(completeAnalysisResults);

      toast({
        title: "Enhanced analysis completed! 🎉",
        description: `Enhanced profile created for ${extractedPersonalInfo.name}`,
      });

    } catch (error: any) {
      console.error('❌ Enhanced analysis failed:', error);
      onError(error.message || 'Enhanced analysis failed');
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
