
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

  // Helper function to safely convert to integer
  const safeParseInt = (value: any, defaultValue: number = 0): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string' && value !== 'Not specified' && value.trim() !== '') {
      const parsed = parseInt(value.match(/(\d+)/)?.[1] || defaultValue.toString());
      return isNaN(parsed) ? defaultValue : parsed;
    }
    return defaultValue;
  };

  // Helper function to safely get string value
  const safeGetString = (value: any, defaultValue: string = ''): string => {
    if (typeof value === 'string' && value !== 'Not specified' && value.trim() !== '') {
      return value;
    }
    return defaultValue;
  };

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
      console.log('🚀 Starting comprehensive CV and LinkedIn analysis');
      setIsAnalyzing(true);
      onAnalysisStart();
      onAnalysisProgress(10);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);

      console.log('📄 Uploading and analyzing CV file:', file.name, 'Size:', file.size, 'Type:', file.type);
      
      // Call parse-cv function with FormData
      const cvResponse = await supabase.functions.invoke('parse-cv', {
        body: formData
      });

      console.log('📊 CV analysis response:', cvResponse);
      
      if (cvResponse.error) {
        console.error('❌ CV analysis error:', cvResponse.error);
        throw new Error(`CV analysis failed: ${cvResponse.error.message}`);
      }

      // Extract analysis data with comprehensive handling
      const cvAnalysisData = cvResponse.data.analysis;
      const enhancedAnalysisResults = cvResponse.data.enhancedAnalysisResults;
      
      console.log('📋 Full CV analysis data extracted:', {
        personalInfo: cvAnalysisData?.personalInfo,
        professionalSummary: cvAnalysisData?.professionalSummary,
        technicalExpertise: cvAnalysisData?.technicalExpertise,
        workExperience: cvAnalysisData?.workExperience?.length,
        education: cvAnalysisData?.education,
        marketPositioning: cvAnalysisData?.marketPositioning,
        detectedInfo: enhancedAnalysisResults?.detectedInformation,
        extractionStats: enhancedAnalysisResults?.extractionStats
      });
      
      setAnalysis(cvResponse.data);
      onAnalysisProgress(50);

      // Step 3: Comprehensive LinkedIn Analysis
      let linkedinData = null;
      if (linkedinUrl && linkedinUrl.trim()) {
        console.log('🔗 Starting comprehensive LinkedIn profile analysis:', linkedinUrl);
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
          console.log('✅ LinkedIn analysis completed:', {
            communicationStyle: linkedinData?.communicationStyle,
            leadershipStyle: linkedinData?.leadershipStyle,
            consultantReadiness: linkedinData?.overallConsultantReadiness,
            recommendations: linkedinData?.recommendedImprovements?.length
          });
          
          // Merge LinkedIn analysis into enhanced results
          if (enhancedAnalysisResults) {
            enhancedAnalysisResults.linkedinAnalysis = linkedinData;
          }
        }
      }

      onAnalysisProgress(75);

      // Determine if this is My Consultant based on URL parameter
      const urlParams = new URLSearchParams(window.location.search);
      const isMyConsultant = urlParams.get('source') === 'my-consultants';

      // 🔥 COMPREHENSIVE DATA EXTRACTION: Use all available sources with intelligent priority
      const cvPersonalInfo = cvAnalysisData?.personalInfo || {};
      const cvProfessionalSummary = cvAnalysisData?.professionalSummary || {};
      const cvTechnicalExpertise = cvAnalysisData?.technicalExpertise || {};
      const cvMarketPositioning = cvAnalysisData?.marketPositioning || {};
      const detectedInfo = enhancedAnalysisResults?.detectedInformation || {};
      
      // 📝 SMART DATA EXTRACTION with multiple fallback layers
      let extractedName = safeGetString(cvPersonalInfo.name);
      if (!extractedName && detectedInfo.names && detectedInfo.names.length > 0) {
        extractedName = detectedInfo.names.find(name => 
          name && name.length > 2 && !name.includes('If Gt') && !name.includes('Analysis')
        ) || '';
      }
      
      let extractedEmail = safeGetString(cvPersonalInfo.email);
      if (!extractedEmail && detectedInfo.emails && detectedInfo.emails.length > 0) {
        extractedEmail = detectedInfo.emails.find(email => 
          email && email.includes('@') && email.includes('.') && 
          !email.includes('example.com') && !email.includes('temp.com')
        ) || '';
      }
      
      let extractedPhone = safeGetString(cvPersonalInfo.phone);
      if (!extractedPhone && detectedInfo.phones && detectedInfo.phones.length > 0) {
        extractedPhone = detectedInfo.phones.find(phone => 
          phone && phone.length > 5 && !phone.includes('0000000000') && !phone.includes('123')
        ) || '';
      }
      
      let extractedLocation = safeGetString(cvPersonalInfo.location);
      if (!extractedLocation && detectedInfo.locations && detectedInfo.locations.length > 0) {
        extractedLocation = detectedInfo.locations[0] || '';
      }
      
      // 🎯 FINAL VALUES with intelligent fallbacks
      const finalName = extractedName || formName || 'Professional Consultant';
      const finalEmail = extractedEmail || formEmail || 'temp@temp.com';
      const finalPhone = extractedPhone;
      const finalLocation = extractedLocation;
      
      // Extract comprehensive skills from all sources
      const cvSkills = [
        ...(cvTechnicalExpertise.programmingLanguages?.expert || []),
        ...(cvTechnicalExpertise.programmingLanguages?.proficient || []),
        ...(cvTechnicalExpertise.programmingLanguages?.familiar || []),
        ...(cvTechnicalExpertise.frameworks || []),
        ...(cvTechnicalExpertise.tools || []),
        ...(cvTechnicalExpertise.databases || []),
        ...(cvTechnicalExpertise.cloudPlatforms || []),
        ...(cvTechnicalExpertise.methodologies || [])
      ].filter(skill => skill && skill.length > 0);
      
      const detectedSkills = detectedInfo.skills || [];
      const allSkills = [...new Set([...cvSkills, ...detectedSkills])];
      
      // Extract real roles from work experience
      const realRoles = cvAnalysisData?.workExperience?.map(exp => exp.role).filter(role => role && role !== 'Not specified') || [];
      const finalRoles = realRoles.length > 0 ? realRoles : [safeGetString(cvProfessionalSummary.currentRole, 'Consultant')];
      
      // Calculate experience years and hourly rate
      const experienceYears = safeParseInt(cvProfessionalSummary.yearsOfExperience, 5);
      const hourlyRate = safeParseInt(cvMarketPositioning?.hourlyRateEstimate?.recommended, 1000);
      
      console.log('💾 Creating consultant with COMPREHENSIVE extracted data:', {
        finalName,
        finalEmail,
        finalPhone,
        finalLocation,
        skillsCount: allSkills.length,
        rolesCount: finalRoles.length,
        experienceYears,
        hourlyRate,
        certifications: cvAnalysisData?.education?.certifications?.length || 0,
        workExperience: cvAnalysisData?.workExperience?.length || 0,
        isMyConsultant
      });

      const consultantData = {
        name: finalName,
        email: finalEmail,
        phone: finalPhone,
        location: finalLocation,
        skills: allSkills,
        experience_years: experienceYears,
        hourly_rate: hourlyRate,
        availability: 'Available',
        cv_file_path: file.name,
        communication_style: linkedinData?.communicationStyle || cvAnalysisData?.softSkills?.communication?.[0] || 'Professional communication',
        rating: 4.8,
        projects_completed: 0,
        roles: finalRoles,
        certifications: cvAnalysisData?.education?.certifications || [],
        type: isMyConsultant ? 'existing' : 'new',
        user_id: isMyConsultant ? 'temp-user-id' : null,
        languages: cvAnalysisData?.languages || ['English', 'Swedish'],
        work_style: linkedinData?.teamFitAssessment?.workStyle || cvAnalysisData?.softSkills?.teamwork?.[0] || 'Collaborative',
        values: cvAnalysisData?.softSkills?.leadership || ['Professional growth', 'Innovation'],
        personality_traits: linkedinData?.contentAnalysisInsights?.professionalValues || cvAnalysisData?.softSkills?.problemSolving || ['Problem-oriented', 'Analytical'],
        team_fit: linkedinData?.teamFitAssessment?.workStyle || cvAnalysisData?.softSkills?.teamwork?.[0] || 'Team player',
        cultural_fit: linkedinData?.culturalFit || 5,
        adaptability: linkedinData?.adaptability || 5,
        leadership: linkedinData?.leadership || Math.min(experienceYears >= 5 ? 4 : 3, 5),
        linkedin_url: linkedinUrl || '',
        cv_analysis_data: cvResponse.data,
        linkedin_analysis_data: linkedinData
      };

      console.log('💾 Inserting comprehensive consultant data');

      const { data: insertedConsultant, error: insertError } = await supabase
        .from('consultants')
        .insert([consultantData])
        .select()
        .single();

      if (insertError) {
        console.error('❌ Database insert error:', insertError);
        throw new Error(`Failed to save consultant: ${insertError.message}`);
      }

      console.log('✅ Consultant created successfully with comprehensive data');
      setCreatedConsultant(insertedConsultant);
      onAnalysisProgress(90);

      // Send emails immediately after successful creation
      console.log('📧 Sending welcome emails');
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
        toast({
          title: "Registration successful",
          description: "Profile created but email notification failed. Please contact support.",
          variant: "default",
        });
      }

      onAnalysisProgress(100);

      // 🔥 COMPLETE ANALYSIS RESULTS with all data
      const completeAnalysisResults = {
        cvAnalysis: cvResponse.data,
        linkedinAnalysis: linkedinData,
        consultant: insertedConsultant,
        enhancedAnalysisResults: enhancedAnalysisResults || null,
        extractedPersonalInfo: {
          name: extractedName,
          email: extractedEmail,
          phone: extractedPhone,
          location: extractedLocation
        }
      };

      // Call the completion callback with comprehensive results
      onAnalysisComplete(completeAnalysisResults);

      toast({
        title: "Comprehensive analysis completed!",
        description: `Profile created with full CV and LinkedIn analysis: ${finalName}`,
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
