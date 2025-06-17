
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
import ListSkills from './ListSkills';
import ListValues from './ListValues';
import ListLanguages from './ListLanguages';
import ListPersonalityTraits from './ListPersonalityTraits';
import ListCertifications from './ListCertifications';
import ListRoles from './ListRoles';

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
  const [hasTriggeredAnalysis, setHasTriggeredAnalysis] = useState(false);
  const { toast } = useToast();

  // Check if we're uploading for "My Consultants"
  const isMyConsultant = new URLSearchParams(window.location.search).get('source') === 'my-consultants';

  // Debug logging
  useEffect(() => {
    console.log('🔍 CVAnalysisLogic state check:', {
      hasFile: !!file,
      fileName: file?.name,
      hasLinkedinUrl: !!linkedinUrl,
      linkedinUrl,
      isAnalyzing,
      hasTriggeredAnalysis,
      hasAnalysis: !!analysis,
      formEmail,
      formName
    });
  }, [file, linkedinUrl, isAnalyzing, hasTriggeredAnalysis, analysis, formEmail, formName]);

  // Auto-trigger analysis when both file and LinkedIn URL are present
  useEffect(() => {
    console.log('🤖 Auto-trigger effect running...', {
      hasFile: !!file,
      hasLinkedinUrl: !!linkedinUrl && linkedinUrl.trim() !== '',
      isAnalyzing,
      hasTriggeredAnalysis,
      hasAnalysis: !!analysis
    });

    if (file && linkedinUrl && linkedinUrl.trim() !== '' && !isAnalyzing && !hasTriggeredAnalysis && !analysis) {
      console.log('🚀 Auto-triggering analysis with file and LinkedIn URL');
      setHasTriggeredAnalysis(true);
      handleAnalysis();
    } else {
      console.log('⏳ Not auto-triggering because:', {
        missingFile: !file,
        missingLinkedIn: !linkedinUrl || linkedinUrl.trim() === '',
        isAlreadyAnalyzing: isAnalyzing,
        alreadyTriggered: hasTriggeredAnalysis,
        alreadyHasAnalysis: !!analysis
      });
    }
  }, [file, linkedinUrl, isAnalyzing, hasTriggeredAnalysis, analysis]);

  // Reset trigger when file or URL changes
  useEffect(() => {
    console.log('🔄 Resetting analysis trigger due to file/URL change');
    setHasTriggeredAnalysis(false);
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

    try {
      console.log('🚀 Starting CV and LinkedIn analysis...');
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

      // Step 4: Create consultant profile in database with correct type
      console.log(`💾 Creating ${isMyConsultant ? 'my' : 'network'} consultant profile...`);
      const consultantData = {
        name: formName || cvResponse.data?.analysis?.personalInfo?.name || 'Unknown Name',
        email: formEmail || cvResponse.data?.analysis?.personalInfo?.email || '',
        phone: cvResponse.data?.analysis?.personalInfo?.phone || '',
        location: cvResponse.data?.analysis?.personalInfo?.location || 'Location not specified',
        skills: cvResponse.data?.analysis?.technicalExpertise?.programmingLanguages?.expert || [],
        experience_years: parseInt(cvResponse.data?.analysis?.professionalSummary?.yearsOfExperience) || 5,
        hourly_rate: cvResponse.data?.analysis?.marketPositioning?.hourlyRateEstimate?.recommended || 800,
        availability: 'Available',
        cv_file_path: file.name,
        communication_style: cvResponse.data?.analysis?.softSkills?.communication?.[0] || '',
        rating: 4.8,
        projects_completed: 0,
        roles: cvResponse.data?.analysis?.technicalExpertise?.frameworks || ['Consultant'],
        certifications: cvResponse.data?.analysis?.education?.certifications || [],
        type: isMyConsultant ? 'existing' : 'new', // Set type based on source
        user_id: null, // Both types start with no user_id
        languages: cvResponse.data?.analysis?.languages || [],
        work_style: cvResponse.data?.analysis?.softSkills?.teamwork?.[0] || '',
        values: cvResponse.data?.analysis?.softSkills?.leadership || [],
        personality_traits: cvResponse.data?.analysis?.softSkills?.problemSolving || [],
        team_fit: cvResponse.data?.analysis?.softSkills?.teamwork?.[0] || '',
        cultural_fit: 5,
        adaptability: 5,
        leadership: 3,
        linkedin_url: linkedinUrl || ''
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

      console.log(`✅ ${isMyConsultant ? 'My' : 'Network'} consultant created successfully:`, insertedConsultant);
      setCreatedConsultant(insertedConsultant);
      onAnalysisProgress(90);

      // Step 5: Send notifications using the FORM EMAIL (not CV email)
      console.log('📧 Sending notifications to form email:', formEmail);
      try {
        // Send welcome email to the email address from the form
        await supabase.functions.invoke('send-welcome-email', {
          body: {
            consultantEmail: formEmail, // Use form email, not CV email
            consultantName: formName || cvResponse.data?.analysis?.personalInfo?.name || 'Unknown Name'
          }
        });

        // Send registration notification to admin
        await supabase.functions.invoke('send-registration-notification', {
          body: {
            consultantName: formName || cvResponse.data?.analysis?.personalInfo?.name || 'Unknown Name',
            consultantEmail: formEmail, // Use form email for admin notification too
            isMyConsultant: isMyConsultant // Pass the correct flag
          }
        });

        console.log('✅ Notifications sent successfully to:', formEmail);
      } catch (emailError) {
        console.warn('⚠️ Email sending failed:', emailError);
        // Don't fail the whole process if emails fail
      }

      onAnalysisProgress(100);

      // Call the completion callback
      onAnalysisComplete({
        cvAnalysis: cvResponse.data,
        linkedinAnalysis: linkedinData,
        consultant: insertedConsultant
      });

      toast({
        title: "Analysis completed successfully!",
        description: isMyConsultant 
          ? "Consultant has been added to your team."
          : "Your profile has been added to our network of consultants.",
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
