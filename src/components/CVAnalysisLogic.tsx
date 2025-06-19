
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

      // Create consultant profile using REAL data from CV analysis
      const cvPersonalInfo = cvAnalysisData?.personalInfo || {};
      const cvProfessionalSummary = cvAnalysisData?.professionalSummary || {};
      const cvTechnicalExpertise = cvAnalysisData?.technicalExpertise || {};
      
      // Use REAL data or form data, avoiding mock data
      const finalName = formName || 
                       (cvPersonalInfo.name !== 'Not specified' ? cvPersonalInfo.name : '') || 
                       'Consultant';
      
      const finalEmail = formEmail || 
                        (cvPersonalInfo.email !== 'Not specified' ? cvPersonalInfo.email : '') || 
                        'temp@temp.com';
      
      const finalPhone = cvPersonalInfo.phone !== 'Not specified' ? cvPersonalInfo.phone : '';
      const finalLocation = cvPersonalInfo.location !== 'Not specified' ? cvPersonalInfo.location : '';
      
      // Extract real skills, avoiding empty arrays
      const allSkills = [
        ...(cvTechnicalExpertise.programmingLanguages?.expert || []),
        ...(cvTechnicalExpertise.programmingLanguages?.proficient || []),
        ...(cvTechnicalExpertise.frameworks || []),
        ...(cvTechnicalExpertise.tools || [])
      ].filter(skill => skill && skill.length > 0);
      
      // Extract real roles from work experience
      const realRoles = cvAnalysisData?.workExperience?.map(exp => exp.role).filter(role => role && role !== 'Not specified') || [];
      const finalRoles = realRoles.length > 0 ? realRoles : [cvProfessionalSummary.currentRole || 'Consultant'];
      
      // Calculate experience years
      const experienceYears = parseInt(cvProfessionalSummary.yearsOfExperience?.match(/(\d+)/)?.[1] || '3');
      
      console.log('💾 Creating consultant profile with REAL extracted data:', {
        finalName,
        finalEmail,
        finalPhone,
        finalLocation,
        skillsCount: allSkills.length,
        rolesCount: finalRoles.length,
        experienceYears,
        isMyConsultant
      });

      const consultantData = {
        name: finalName,
        email: finalEmail,
        phone: finalPhone,
        location: finalLocation,
        skills: allSkills,
        experience_years: experienceYears,
        hourly_rate: cvAnalysisData?.marketPositioning?.hourlyRateEstimate?.recommended || 800,
        availability: 'Available',
        cv_file_path: file.name,
        communication_style: cvAnalysisData?.softSkills?.communication?.[0] || 'Professional communication',
        rating: 4.8,
        projects_completed: 0,
        roles: finalRoles,
        certifications: cvAnalysisData?.education?.certifications || [],
        type: isMyConsultant ? 'existing' : 'new',
        user_id: isMyConsultant ? 'temp-user-id' : null,
        languages: cvAnalysisData?.languages || ['English'],
        work_style: cvAnalysisData?.softSkills?.teamwork?.[0] || 'Collaborative',
        values: cvAnalysisData?.softSkills?.leadership || ['Professional growth'],
        personality_traits: cvAnalysisData?.softSkills?.problemSolving || ['Problem-oriented'],
        team_fit: cvAnalysisData?.softSkills?.teamwork?.[0] || 'Team player',
        cultural_fit: 5,
        adaptability: 5,
        leadership: Math.min(experienceYears >= 5 ? 4 : 3, 5),
        linkedin_url: linkedinUrl || '',
        cv_analysis_data: cvResponse.data,
        linkedin_analysis_data: linkedinData
      };

      console.log('💾 Inserting consultant data with real information:', consultantData);

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

      // Send emails immediately after successful creation
      console.log('📧 🚨 SENDING WELCOME EMAILS IMMEDIATELY WITH REAL DATA');
      try {
        await EmailNotificationHandler.sendWelcomeEmails({
          consultantId: insertedConsultant.id,
          finalEmail: finalEmail,
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
