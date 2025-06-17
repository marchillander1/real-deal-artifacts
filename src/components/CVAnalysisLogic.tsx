
import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Upload, FileText, User, MapPin, Phone, Mail, Briefcase, Star, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface CVAnalysisLogicProps {
  file: File | null;
  linkedinUrl: string;
  formEmail: string;
  formName: string;
  onAnalysisComplete: (analysis: { cvAnalysis: any; linkedinAnalysis: any; consultant: any }) => void;
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
  const [linkedinAnalysis, setLinkedinAnalysis] = useState<any>(null);
  const [createdConsultant, setCreatedConsultant] = useState<any>(null);
  const { toast } = useToast();

  // Debug logging
  useEffect(() => {
    console.log('🔍 CVAnalysisLogic state check:', {
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

  // Enhanced LinkedIn validation
  const isValidLinkedInUrl = (url: string) => {
    if (!url || url.trim() === '') return false;
    return url.includes('linkedin.com');
  };

  // Auto-trigger analysis when both file and LinkedIn URL are present
  useEffect(() => {
    const hasValidLinkedIn = isValidLinkedInUrl(linkedinUrl);
    const shouldStartAnalysis = file && hasValidLinkedIn && !isAnalyzing && !analysis;
    
    console.log('🤖 Auto-trigger effect running...', {
      hasFile: !!file,
      hasValidLinkedIn,
      isAnalyzing,
      hasAnalysis: !!analysis,
      shouldStartAnalysis
    });

    if (shouldStartAnalysis) {
      console.log('🚀 Auto-triggering analysis with file and LinkedIn URL');
      handleAnalysis();
    } else {
      console.log('⏳ Not auto-triggering because:', {
        missingFile: !file,
        invalidLinkedIn: !hasValidLinkedIn,
        isAlreadyAnalyzing: isAnalyzing,
        alreadyHasAnalysis: !!analysis
      });
    }
  }, [file, linkedinUrl, isAnalyzing, analysis]);

  // Reset analysis when file or URL changes
  useEffect(() => {
    console.log('🔄 Resetting analysis due to file/URL change');
    setAnalysis(null);
    setLinkedinAnalysis(null);
    setCreatedConsultant(null);
  }, [file, linkedinUrl]);

  const handleAnalysis = async () => {
    if (!file) {
      console.error('❌ No file selected for analysis');
      onError('No file selected');
      return;
    }

    if (!isValidLinkedInUrl(linkedinUrl)) {
      console.error('❌ Invalid LinkedIn URL provided:', linkedinUrl);
      onError('A valid LinkedIn URL is required for analysis');
      return;
    }

    try {
      console.log('🚀 Starting CV and LinkedIn analysis');
      setIsAnalyzing(true);
      onAnalysisStart();
      onAnalysisProgress(10);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);

      console.log('📄 Uploading and analyzing CV file...');
      
      // Call parse-cv function with FormData
      const cvResponse = await supabase.functions.invoke('parse-cv', {
        body: formData
      });

      console.log('📊 CV analysis response:', cvResponse);
      
      if (cvResponse.error) {
        console.error('❌ CV analysis error:', cvResponse.error);
        throw new Error(`CV analysis failed: ${cvResponse.error.message}`);
      }

      setAnalysis(cvResponse.data);
      onAnalysisProgress(60);

      // Step 3: Analyze LinkedIn (if URL provided)
      let linkedinData = null;
      if (linkedinUrl && linkedinUrl.trim()) {
        console.log('🔗 Analyzing LinkedIn profile...');
        const linkedinResponse = await supabase.functions.invoke('analyze-linkedin', {
          body: { linkedinUrl: linkedinUrl.trim() }
        });

        console.log('📊 LinkedIn analysis response:', linkedinResponse);
        
        if (linkedinResponse.error) {
          console.warn('⚠️ LinkedIn analysis failed:', linkedinResponse.error);
          toast({
            title: "LinkedIn analysis failed",
            description: "Continuing with CV analysis only",
            variant: "default",
          });
        } else {
          linkedinData = linkedinResponse.data;
          setLinkedinAnalysis(linkedinData);
        }
      }

      onAnalysisProgress(80);

      // 🔥 CRITICAL FIX: Always use FORM EMAIL as the primary email for everything
      const cvData = cvResponse.data?.analysis;
      const finalName = formName || cvData?.personalInfo?.name || 'Unknown Name';
      
      // 🚨 ALWAYS USE FORM EMAIL - Never fall back to CV email for notifications
      const finalEmail = formEmail || 'analysis@example.com';
      
      console.log('📧 EMAIL ROUTING - CRITICAL CHECK:', {
        formEmailProvided: !!formEmail,
        formEmail: formEmail,
        cvEmail: cvData?.personalInfo?.email,
        finalEmailForNotifications: finalEmail,
        willSendNotificationsTo: finalEmail
      });

      // Step 4: Create consultant profile in database - ALL analyses go to Network Consultants
      console.log('💾 Creating network consultant profile...');
      const consultantData = {
        name: finalName,
        email: finalEmail, // 🔥 ALWAYS use form email for database
        phone: cvData?.personalInfo?.phone || '',
        location: cvData?.personalInfo?.location || 'Location not specified',
        skills: cvData?.technicalExpertise?.programmingLanguages?.expert || [],
        experience_years: parseInt(cvData?.professionalSummary?.yearsOfExperience) || 5,
        hourly_rate: cvData?.marketPositioning?.hourlyRateEstimate?.recommended || 800,
        availability: 'Available',
        cv_file_path: file.name,
        communication_style: cvData?.softSkills?.communication?.[0] || '',
        rating: 4.8,
        projects_completed: 0,
        roles: cvData?.technicalExpertise?.frameworks || ['Consultant'],
        certifications: cvData?.education?.certifications || [],
        type: 'new', // ALL analyses go to Network Consultants
        user_id: null,
        languages: cvData?.languages || [],
        work_style: cvData?.softSkills?.teamwork?.[0] || '',
        values: cvData?.softSkills?.leadership || [],
        personality_traits: cvData?.softSkills?.problemSolving || [],
        team_fit: cvData?.softSkills?.teamwork?.[0] || '',
        cultural_fit: 5,
        adaptability: 5,
        leadership: 3,
        linkedin_url: linkedinUrl || '',
        // Save analysis data as JSON in database
        cv_analysis_data: cvResponse.data,
        linkedin_analysis_data: linkedinData
      };

      console.log('💾 Inserting consultant data:', consultantData);

      const { data: insertedConsultant, error: insertError } = await supabase
        .from('consultants')
        .insert([consultantData])
        .select()
        .single();

      if (insertError) {
        console.error('❌ Database insert error:', insertError);
        throw new Error(`Failed to save consultant: ${insertError.message}`);
      }

      console.log('✅ Network consultant created successfully:', insertedConsultant);
      setCreatedConsultant(insertedConsultant);
      onAnalysisProgress(90);

      // Step 5: Send notifications using FORM EMAIL ONLY - FINAL FIX
      console.log('📧 🚨 FINAL EMAIL CHECK - Starting email sending process...');
      console.log('📧 🔥 Will send welcome email to FORM EMAIL ONLY:', finalEmail);
      console.log('📧 📝 Consultant name for email:', finalName);
      console.log('📧 ⚠️ CV email will be IGNORED:', cvData?.personalInfo?.email);

      try {
        // 🔥 🚨 Send welcome email to the FORM EMAIL address ONLY
        console.log('📧 🚀 Calling send-welcome-email function with FORM EMAIL...');
        const welcomeEmailResponse = await supabase.functions.invoke('send-welcome-email', {
          body: {
            consultantEmail: finalEmail, // 🔥 🚨 ALWAYS use form email
            consultantName: finalName,
            isMyConsultant: false
          }
        });

        console.log('📧 Welcome email full response:', JSON.stringify(welcomeEmailResponse, null, 2));

        if (welcomeEmailResponse.error) {
          console.error('❌ Welcome email error details:', welcomeEmailResponse.error);
          toast({
            title: "Welcome email failed",
            description: `Failed to send welcome email: ${welcomeEmailResponse.error.message || 'Unknown error'}`,
            variant: "destructive",
          });
        } else if (welcomeEmailResponse.data) {
          console.log('✅ Welcome email sent successfully!');
          console.log('📧 Email response data:', welcomeEmailResponse.data);
          toast({
            title: "Welcome email sent!",
            description: `Welcome email sent to ${finalEmail}`,
            variant: "default",
          });
        } else {
          console.warn('⚠️ Welcome email response has no data or error');
          toast({
            title: "Email status unclear",
            description: "Welcome email may not have been sent properly",
            variant: "default",
          });
        }

        // Send registration notification to admin
        console.log('📧 Sending admin notification...');
        const adminNotificationResponse = await supabase.functions.invoke('send-registration-notification', {
          body: {
            consultantName: finalName,
            consultantEmail: finalEmail, // 🔥 🚨 ALWAYS use form email
            isMyConsultant: false
          }
        });

        console.log('📧 Admin notification response:', adminNotificationResponse);

        if (adminNotificationResponse.error) {
          console.error('❌ Admin notification error:', adminNotificationResponse.error);
        } else {
          console.log('✅ Admin notification sent successfully');
        }

      } catch (emailError) {
        console.error('❌ Email sending failed with exception:', emailError);
        console.error('❌ Email error stack:', emailError.stack);
        toast({
          title: "Email sending failed",
          description: `Could not send welcome email: ${emailError.message}`,
          variant: "destructive",
        });
      }

      onAnalysisProgress(100);

      // Call the completion callback
      onAnalysisComplete({
        cvAnalysis: cvResponse.data,
        linkedinAnalysis: linkedinData,
        consultant: insertedConsultant
      });

      toast({
        title: "Analysis completed!",
        description: `Profile created for ${finalName}`,
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

  return null; // This component only handles logic, no UI
};

export default CVAnalysisLogic;
