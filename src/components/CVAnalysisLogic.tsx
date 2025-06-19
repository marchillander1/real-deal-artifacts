
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

      // Extract both basic analysis and enhanced results
      const cvAnalysisData = cvResponse.data.analysis;
      const enhancedAnalysisResults = cvResponse.data.enhancedAnalysisResults;
      
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
          
          // Merge LinkedIn analysis into enhanced results
          if (enhancedAnalysisResults) {
            enhancedAnalysisResults.linkedinAnalysis = linkedinData;
          }
        }
      }

      onAnalysisProgress(80);

      // Determine if this is My Consultant based on URL parameter
      const urlParams = new URLSearchParams(window.location.search);
      const isMyConsultant = urlParams.get('source') === 'my-consultants';

      // 🔥 UPDATED: Create consultant profile AND send emails immediately
      const finalName = formName || cvAnalysisData?.personalInfo?.name || 'Unnamed Consultant';
      const finalEmail = formEmail || cvAnalysisData?.personalInfo?.email || 'temp@analysis.com';
      
      console.log('💾 Creating consultant profile with real data and sending emails:', {
        finalName,
        finalEmail,
        isMyConsultant
      });

      const consultantData = {
        name: finalName,
        email: finalEmail, // 🔥 Use REAL email from form
        phone: cvAnalysisData?.personalInfo?.phone || '',
        location: cvAnalysisData?.personalInfo?.location || 'Location not specified',
        skills: cvAnalysisData?.technicalExpertise?.programmingLanguages?.expert || [],
        experience_years: parseInt(cvAnalysisData?.professionalSummary?.yearsOfExperience) || 5,
        hourly_rate: cvAnalysisData?.marketPositioning?.hourlyRateEstimate?.recommended || 800,
        availability: 'Available',
        cv_file_path: file.name,
        communication_style: cvAnalysisData?.softSkills?.communication?.[0] || '',
        rating: 4.8,
        projects_completed: 0,
        roles: cvAnalysisData?.technicalExpertise?.frameworks || ['Consultant'],
        certifications: cvAnalysisData?.education?.certifications || [],
        type: isMyConsultant ? 'existing' : 'new', // 🔥 Set correct type
        user_id: isMyConsultant ? 'temp-user-id' : null, // 🔥 Set user_id for My Consultants
        languages: cvAnalysisData?.languages || [],
        work_style: cvAnalysisData?.softSkills?.teamwork?.[0] || '',
        values: cvAnalysisData?.softSkills?.leadership || [],
        personality_traits: cvAnalysisData?.softSkills?.problemSolving || [],
        team_fit: cvAnalysisData?.softSkills?.teamwork?.[0] || '',
        cultural_fit: 5,
        adaptability: 5,
        leadership: 3,
        linkedin_url: linkedinUrl || '',
        cv_analysis_data: cvResponse.data,
        linkedin_analysis_data: linkedinData
      };

      console.log('💾 Inserting consultant data with real email:', consultantData);

      const { data: insertedConsultant, error: insertError } = await supabase
        .from('consultants')
        .insert([consultantData])
        .select()
        .single();

      if (insertError) {
        console.error('❌ Database insert error:', insertError);
        throw new Error(`Failed to save consultant: ${insertError.message}`);
      }

      console.log('✅ Consultant created successfully:', insertedConsultant);
      setCreatedConsultant(insertedConsultant);
      onAnalysisProgress(90);

      // 🔥 SEND EMAILS IMMEDIATELY AFTER SUCCESSFUL CREATION
      console.log('📧 🚨 SENDING WELCOME EMAILS IMMEDIATELY WITH REAL DATA');
      try {
        await EmailNotificationHandler.sendWelcomeEmails({
          consultantId: insertedConsultant.id,
          finalEmail: finalEmail, // 🔥 Use REAL email from form
          finalName: finalName,
          isMyConsultant: isMyConsultant,
          toast: toast
        });
        console.log('✅ Welcome emails sent successfully!');
      } catch (emailError) {
        console.error('❌ Email sending failed:', emailError);
        // Don't fail the whole process if email fails
        toast({
          title: "Registration successful",
          description: "Profile created but email notification failed. Please contact support.",
          variant: "default",
        });
      }

      onAnalysisProgress(100);

      // Call the completion callback with enhanced results
      onAnalysisComplete({
        cvAnalysis: cvResponse.data,
        linkedinAnalysis: linkedinData,
        consultant: insertedConsultant,
        enhancedAnalysisResults: enhancedAnalysisResults || null
      });

      toast({
        title: "Analysis and registration completed!",
        description: `Welcome emails sent to ${finalEmail}`,
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
