
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CVAnalysisLogicProps {
  cvFile: File | null;
  linkedinUrl: string;
  onAnalysisComplete: (analysis: any) => void;
  onError: (message: string) => void;
  onAnalysisStart?: () => void;
  onAnalysisProgress?: (progress: number) => void;
}

export const CVAnalysisLogic: React.FC<CVAnalysisLogicProps> = ({
  cvFile,
  linkedinUrl,
  onAnalysisComplete,
  onError,
  onAnalysisStart,
  onAnalysisProgress
}) => {
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  useEffect(() => {
    if (cvFile && !hasAnalyzed) {
      analyzeCVAndLinkedIn();
    }
  }, [cvFile, hasAnalyzed]);

  const analyzeCVAndLinkedIn = async () => {
    if (!cvFile) return;

    try {
      setHasAnalyzed(true);
      onAnalysisStart?.();
      onAnalysisProgress?.(10);

      console.log('Starting comprehensive CV and LinkedIn analysis...');

      // Convert file to base64
      const fileReader = new FileReader();
      const fileBase64 = await new Promise<string>((resolve, reject) => {
        fileReader.onload = () => {
          const result = fileReader.result as string;
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        fileReader.onerror = reject;
        fileReader.readAsDataURL(cvFile);
      });

      onAnalysisProgress?.(30);

      // Analyze CV
      console.log('Calling parse-cv function...');
      const { data: cvAnalysisData, error: cvError } = await supabase.functions.invoke('parse-cv', {
        body: {
          file: fileBase64,
          filename: cvFile.name,
          comprehensive: true
        }
      });

      if (cvError) {
        console.error('CV analysis error:', cvError);
        throw new Error('Failed to analyze CV');
      }

      console.log('CV analysis completed:', cvAnalysisData);
      onAnalysisProgress?.(60);

      // Analyze LinkedIn if URL provided
      let linkedinAnalysisData = null;
      if (linkedinUrl) {
        console.log('Analyzing LinkedIn profile...');
        const { data: linkedinData, error: linkedinError } = await supabase.functions.invoke('analyze-linkedin', {
          body: {
            linkedinUrl: linkedinUrl,
            cvData: cvAnalysisData
          }
        });

        if (!linkedinError && linkedinData) {
          linkedinAnalysisData = linkedinData;
          console.log('LinkedIn analysis completed:', linkedinAnalysisData);
        }
      }

      onAnalysisProgress?.(80);

      // Extract name and email from CV analysis
      const extractedName = cvAnalysisData?.analysis?.personalInfo?.name || 'Unknown Professional';
      const extractedEmail = cvAnalysisData?.analysis?.personalInfo?.email || '';

      // Create consultant profile using correct column names
      const consultantData = {
        name: extractedName,
        email: extractedEmail,
        phone: cvAnalysisData?.analysis?.personalInfo?.phone || '',
        linkedin_url: linkedinUrl || '',
        skills: cvAnalysisData?.analysis?.technicalExpertise?.frameworks || [],
        experience_years: parseInt(cvAnalysisData?.analysis?.professionalSummary?.yearsOfExperience) || 0,
        hourly_rate: cvAnalysisData?.analysis?.marketPositioning?.hourlyRateEstimate?.recommended || 800,
        availability: 'Available',
        communication_style: linkedinAnalysisData?.analysis?.communicationStyle || 'Professional',
        cultural_fit: linkedinAnalysisData?.analysis?.culturalFit || 5,
        adaptability: linkedinAnalysisData?.analysis?.adaptability || 5,
        leadership: linkedinAnalysisData?.analysis?.leadership || 3
      };

      console.log('Creating consultant profile with data:', consultantData);

      const { data: consultant, error: consultantError } = await supabase
        .from('consultants')
        .insert(consultantData)
        .select()
        .single();

      if (consultantError) {
        console.error('Error creating consultant:', consultantError);
        throw new Error('Failed to create consultant profile');
      }

      console.log('Consultant created successfully:', consultant);
      onAnalysisProgress?.(90);

      // Send welcome email with correct parameters
      try {
        const { error: emailError } = await supabase.functions.invoke('send-welcome-email', {
          body: {
            consultantName: extractedName,
            consultantEmail: extractedEmail,
            isMyConsultant: false
          }
        });

        if (emailError) {
          console.warn('Failed to send welcome email:', emailError);
        } else {
          console.log('Welcome email sent successfully to:', extractedEmail);
        }
      } catch (emailError) {
        console.warn('Error sending welcome email:', emailError);
      }

      onAnalysisProgress?.(100);

      // Return analysis results
      const analysisResults = {
        cvAnalysis: cvAnalysisData,
        linkedinAnalysis: linkedinAnalysisData,
        consultant: consultant
      };

      console.log('Analysis complete, calling onAnalysisComplete with:', analysisResults);
      onAnalysisComplete(analysisResults);

    } catch (error) {
      console.error('Analysis failed:', error);
      setHasAnalyzed(false);
      onError(error instanceof Error ? error.message : 'Analysis failed');
    }
  };

  return null;
};
