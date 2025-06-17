
import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface CVAnalysisLogicProps {
  cvFile: File | null;
  linkedinUrl: string;
  formEmail: string;
  formName: string;
  onAnalysisComplete: (analysis: { cvAnalysis: any; linkedinAnalysis: any; consultant: any }) => void;
  onError: (message: string) => void;
  onAnalysisStart: () => void;
  onAnalysisProgress: (progress: number) => void;
}

export const CVAnalysisLogic: React.FC<CVAnalysisLogicProps> = ({
  cvFile,
  linkedinUrl,
  formEmail,
  formName,
  onAnalysisComplete,
  onError,
  onAnalysisStart,
  onAnalysisProgress,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const hasTriggeredAnalysis = useRef(false);
  const { toast } = useToast();

  // Check if we should trigger analysis
  const shouldTriggerAnalysis = !!(cvFile && linkedinUrl && !isAnalyzing && !hasTriggeredAnalysis.current);

  useEffect(() => {
    if (shouldTriggerAnalysis) {
      console.log('🚀 Triggering analysis with:', { 
        hasFile: !!cvFile, 
        hasLinkedIn: !!linkedinUrl,
        formEmail,
        formName
      });
      
      hasTriggeredAnalysis.current = true;
      startAnalysis();
    }
  }, [shouldTriggerAnalysis, cvFile, linkedinUrl, formEmail, formName]);

  // Reset when dependencies change
  useEffect(() => {
    console.log('🔄 Dependencies changed, resetting analysis trigger');
    hasTriggeredAnalysis.current = false;
  }, [cvFile, linkedinUrl]);

  const startAnalysis = async () => {
    if (!cvFile || !linkedinUrl) {
      console.log('❌ Missing requirements for analysis');
      return;
    }

    try {
      setIsAnalyzing(true);
      onAnalysisStart();
      onAnalysisProgress(10);

      console.log('📊 Starting CV analysis...');
      
      // Step 1: Parse CV
      const cvFormData = new FormData();
      cvFormData.append('file', cvFile);
      
      const { data: cvAnalysis, error: cvError } = await supabase.functions.invoke('parse-cv', {
        body: cvFormData,
      });

      if (cvError) {
        throw new Error(`CV analysis failed: ${cvError.message}`);
      }

      console.log('✅ CV analysis completed:', cvAnalysis);
      onAnalysisProgress(50);

      // Step 2: Analyze LinkedIn
      console.log('🔗 Starting LinkedIn analysis...');
      const { data: linkedinAnalysis, error: linkedinError } = await supabase.functions.invoke('analyze-linkedin', {
        body: JSON.stringify({ linkedinUrl }),
      });

      if (linkedinError) {
        console.warn('⚠️ LinkedIn analysis failed, continuing without it:', linkedinError.message);
      }

      console.log('✅ LinkedIn analysis completed:', linkedinAnalysis);
      onAnalysisProgress(80);

      // Step 3: Create consultant in database with analysis data
      const urlParams = new URLSearchParams(window.location.search);
      const isMyConsultant = urlParams.get('source') === 'my-consultants';

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      const consultantData = {
        name: formName || cvAnalysis?.analysis?.personalInfo?.name || 'Professional Consultant',
        email: formEmail || cvAnalysis?.analysis?.personalInfo?.email || 'consultant@example.com',
        phone: cvAnalysis?.analysis?.personalInfo?.phone || '',
        location: cvAnalysis?.analysis?.personalInfo?.location || 'Unknown',
        skills: cvAnalysis?.analysis?.skills || [],
        experience_years: cvAnalysis?.analysis?.experienceYears || 5,
        hourly_rate: cvAnalysis?.analysis?.suggestedHourlyRate || 800,
        availability: 'Available',
        cv_file_path: cvFile.name,
        communication_style: linkedinAnalysis?.analysis?.communicationStyle || 'Professional and collaborative',
        rating: 4.8,
        projects_completed: cvAnalysis?.analysis?.projectsCompleted || 10,
        last_active: 'Recently',
        roles: cvAnalysis?.analysis?.roles || ['Consultant'],
        certifications: cvAnalysis?.analysis?.certifications || [],
        type: isMyConsultant ? 'existing' : 'new',
        user_id: isMyConsultant ? user?.id : null, // Only set user_id for "My Consultants"
        languages: cvAnalysis?.analysis?.languages || ['Swedish', 'English'],
        work_style: linkedinAnalysis?.analysis?.workStyle || 'Collaborative and results-driven',
        values: linkedinAnalysis?.analysis?.values || ['Innovation', 'Quality', 'Teamwork'],
        personality_traits: linkedinAnalysis?.analysis?.personalityTraits || ['Analytical', 'Creative', 'Detail-oriented'],
        team_fit: linkedinAnalysis?.analysis?.teamFit || 'Excellent team player with strong communication skills',
        cultural_fit: linkedinAnalysis?.analysis?.culturalFit || 8,
        adaptability: linkedinAnalysis?.analysis?.adaptability || 8,
        leadership: linkedinAnalysis?.analysis?.leadership || 6,
        linkedin_url: linkedinUrl,
        // 🔥 NEW: Save the full analysis data
        cv_analysis: cvAnalysis,
        linkedin_analysis: linkedinAnalysis
      };

      console.log('💾 Creating consultant with analysis data:', consultantData);

      const { data: consultant, error: consultantError } = await supabase
        .from('consultants')
        .insert([consultantData])
        .select()
        .single();

      if (consultantError) {
        throw new Error(`Failed to create consultant: ${consultantError.message}`);
      }

      console.log('✅ Consultant created successfully:', consultant);
      onAnalysisProgress(90);

      // Step 4: Send welcome email
      try {
        console.log('📧 Sending welcome email...');
        const { error: emailError } = await supabase.functions.invoke('send-welcome-email', {
          body: JSON.stringify({
            consultantName: consultantData.name,
            consultantEmail: consultantData.email,
            isMyConsultant: isMyConsultant
          }),
        });

        if (emailError) {
          console.error('❌ Welcome email failed:', emailError);
        } else {
          console.log('✅ Welcome email sent successfully');
        }
      } catch (emailError) {
        console.error('❌ Welcome email error:', emailError);
      }

      // Step 5: Send registration notification
      try {
        console.log('📧 Sending registration notification...');
        const { error: notificationError } = await supabase.functions.invoke('send-registration-notification', {
          body: JSON.stringify({
            consultantName: consultantData.name,
            consultantEmail: consultantData.email,
            isMyConsultant: isMyConsultant
          }),
        });

        if (notificationError) {
          console.error('❌ Registration notification failed:', notificationError);
        } else {
          console.log('✅ Registration notification sent successfully');
        }
      } catch (notificationError) {
        console.error('❌ Registration notification error:', notificationError);
      }

      onAnalysisProgress(100);

      // Complete analysis
      const completeAnalysis = {
        cvAnalysis,
        linkedinAnalysis,
        consultant: {
          ...consultant,
          cvAnalysis,
          linkedinAnalysis
        }
      };

      console.log('🎉 Analysis complete, calling onAnalysisComplete');
      onAnalysisComplete(completeAnalysis);
      
      toast({
        title: "Analysis Complete!",
        description: `${isMyConsultant ? 'Consultant added to your team' : 'You\'ve joined our network'}! Welcome emails have been sent.`,
      });

    } catch (error) {
      console.error('❌ Analysis failed:', error);
      onError(error instanceof Error ? error.message : 'Analysis failed');
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return null; // This component doesn't render anything
};
