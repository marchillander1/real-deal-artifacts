
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CVParser } from './CVParser';
import { LinkedInAnalyzer } from './LinkedInAnalyzer';
import { ConsultantService } from '../database/ConsultantService';
import { EmailService } from '../email/EmailService';
import { NavigationService } from '../routing/NavigationService';

interface CVUploadFlowProps {
  file: File;
  linkedinUrl: string;
  personalDescription?: string;
  onProgress?: (progress: number) => void;
  onComplete?: (consultant: any) => void;
  onError?: (error: string) => void;
}

export const CVUploadFlow: React.FC<CVUploadFlowProps> = ({
  file,
  linkedinUrl,
  personalDescription = '',
  onProgress,
  onComplete,
  onError
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const extractPersonalInfo = (cvAnalysis: any, detectedInfo: any) => {
    const personalInfo = cvAnalysis?.personalInfo || {};
    
    return {
      name: detectedInfo?.names?.[0] || personalInfo.name || 'Professional Consultant',
      email: detectedInfo?.emails?.[0] || personalInfo.email || 'temp@example.com',
      phone: detectedInfo?.phones?.[0] || personalInfo.phone || '',
      location: personalInfo.location || 'Sweden'
    };
  };

  const processUpload = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    onProgress?.(10);

    try {
      console.log('🚀 Starting CV upload flow for:', file.name);
      console.log('📝 Personal description included:', !!personalDescription);

      // Step 1: Parse CV with personal description
      const { analysis: cvAnalysis, detectedInfo } = await CVParser.parseCV(file, personalDescription);
      onProgress?.(40);

      console.log('📊 CV analysis completed with personal description:', {
        hasPersonalInfo: !!cvAnalysis.personalInfo,
        hasExperience: !!cvAnalysis.experience,
        skillsCount: Object.values(cvAnalysis.skills || {}).reduce((sum: number, arr: any) => sum + (Array.isArray(arr) ? arr.length : 0), 0),
        hasPersonalDescription: !!personalDescription,
        softSkillsIncluded: !!cvAnalysis.softSkills
      });

      // Step 2: Analyze LinkedIn (optional)
      let linkedinData = null;
      if (linkedinUrl && linkedinUrl.includes('linkedin.com')) {
        linkedinData = await LinkedInAnalyzer.analyzeLinkedIn(linkedinUrl);
      }
      onProgress?.(60);

      // Step 3: Extract personal info with improved logic
      const extractedPersonalInfo = extractPersonalInfo(cvAnalysis, detectedInfo);

      // Step 4: Create consultant profile with enhanced analysis
      const isMyConsultant = new URLSearchParams(window.location.search).get('source') === 'my-consultants';
      
      const consultant = await ConsultantService.createConsultant({
        cvAnalysis,
        linkedinData,
        extractedPersonalInfo,
        personalDescription,
        file,
        linkedinUrl,
        isMyConsultant
      });
      onProgress?.(80);

      // Step 5: Send welcome email with better error handling
      try {
        console.log('📧 Attempting to send welcome email...');
        
        await EmailService.sendWelcomeEmail({
          consultantId: consultant.id,
          email: extractedPersonalInfo.email,
          name: extractedPersonalInfo.name,
          isMyConsultant
        });

        await EmailService.sendAdminNotification({
          name: extractedPersonalInfo.name,
          email: extractedPersonalInfo.email,
          isMyConsultant
        });

        toast({
          title: "Profile created successfully! 🎉",
          description: `Welcome email sent to ${extractedPersonalInfo.email}`,
        });
        
        console.log('✅ Email notifications sent successfully');
        
      } catch (emailError: any) {
        console.warn('⚠️ Email sending failed:', emailError);
        toast({
          title: "Profile created! ✅",
          description: "Profile created successfully, but email notification failed. Check logs for details.",
          variant: "default",
        });
      }

      onProgress?.(100);
      onComplete?.(consultant);

      // Navigate to analysis page after short delay
      setTimeout(() => {
        NavigationService.redirectToAnalysis(consultant.id);
      }, 2000);

    } catch (error: any) {
      console.error('❌ CV upload flow failed:', error);
      const errorMessage = error.message || 'Upload failed. Please try again.';
      onError?.(errorMessage);
      
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Auto-start processing when component mounts
  React.useEffect(() => {
    processUpload();
  }, [file, linkedinUrl, personalDescription]);

  return null; // This component only handles background processing
};
