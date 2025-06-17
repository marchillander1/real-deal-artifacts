
import React, { useState } from 'react';
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
  const { toast } = useToast();

  const handleAnalysis = async () => {
    if (!file) {
      onError('No file selected');
      return;
    }

    try {
      console.log('🚀 Starting CV and LinkedIn analysis...');
      setIsAnalyzing(true);
      onAnalysisStart();
      onAnalysisProgress(10);

      // Step 1: Upload CV file
      console.log('📄 Uploading CV file...');
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('cv-files')
        .upload(fileName, file);

      if (uploadError) {
        console.error('❌ Upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      console.log('✅ File uploaded successfully:', uploadData);
      onAnalysisProgress(30);

      // Step 2: Analyze CV
      console.log('🔍 Analyzing CV...');
      const cvResponse = await supabase.functions.invoke('parse-cv', {
        body: { 
          fileName: fileName,
          originalName: file.name 
        }
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

      // Step 4: Create consultant profile in database
      console.log('💾 Creating consultant profile...');
      const consultantData = {
        name: formName || cvResponse.data?.name || 'Unknown Name',
        email: formEmail || cvResponse.data?.email || '',
        phone: cvResponse.data?.phone || '',
        location: cvResponse.data?.location || 'Location not specified',
        skills: cvResponse.data?.skills || [],
        experience_years: cvResponse.data?.experience_years || 5,
        hourly_rate: cvResponse.data?.hourly_rate || 800,
        availability: 'Available',
        cv_file_path: fileName,
        communication_style: cvResponse.data?.communication_style || '',
        rating: 4.8,
        projects_completed: 0,
        roles: cvResponse.data?.roles || ['Consultant'],
        certifications: cvResponse.data?.certifications || [],
        type: 'new', // This is a network consultant
        languages: cvResponse.data?.languages || [],
        work_style: cvResponse.data?.work_style || '',
        values: cvResponse.data?.values || [],
        personality_traits: cvResponse.data?.personality_traits || [],
        team_fit: cvResponse.data?.team_fit || '',
        cultural_fit: cvResponse.data?.cultural_fit || 5,
        adaptability: cvResponse.data?.adaptability || 5,
        leadership: cvResponse.data?.leadership || 3,
        linkedin_url: linkedinUrl || '',
        // 🔥 NEW: Save analysis data to database
        cv_analysis: cvResponse.data,
        linkedin_analysis: linkedinData
      };

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

      // Step 5: Send notifications
      console.log('📧 Sending notifications...');
      try {
        // Send welcome email to consultant
        await supabase.functions.invoke('send-welcome-email', {
          body: {
            consultantEmail: formEmail,
            consultantName: formName
          }
        });

        // Send registration notification to admin
        await supabase.functions.invoke('send-registration-notification', {
          body: {
            consultantName: formName,
            consultantEmail: formEmail,
            isMyConsultant: false
          }
        });

        console.log('✅ Notifications sent successfully');
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
        description: "Your profile has been created and analysis is complete.",
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
