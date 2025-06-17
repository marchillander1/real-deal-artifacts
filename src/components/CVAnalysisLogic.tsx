import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ListSkills } from './ListSkills';
import { ListValues } from './ListValues';
import { ListLanguages } from './ListLanguages';
import { ListPersonalityTraits } from './ListPersonalityTraits';
import { ListCertifications } from './ListCertifications';
import { ListRoles } from './ListRoles';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast"

interface CVAnalysisLogicProps {
  file: File | null;
  onAnalysisComplete: (data: any) => void;
  onError: (message: string) => void;
  isMyConsultant?: boolean;
  onSuccess?: () => void;
}

interface ExtractedConsultantData {
  name: string;
  email: string;
  phone: string;
  location: string;
  skills: string[];
  experienceYears: number;
  hourlyRate: number;
  availability: string;
  cvPath: string;
  communicationStyle: string;
  languages: string[];
  values: string[];
  personalityTraits: string[];
  certifications: string[];
  roles: string[];
  linkedinUrl: string;
}

export const CVAnalysisLogic: React.FC<CVAnalysisLogicProps> = ({
  file,
  onAnalysisComplete,
  onError,
  isMyConsultant = false,
  onSuccess
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedConsultantData>({
    name: '',
    email: '',
    phone: '',
    location: '',
    skills: [],
    experienceYears: 5,
    hourlyRate: 800,
    availability: 'Available',
    cvPath: '',
    communicationStyle: '',
    languages: [],
    values: [],
    personalityTraits: [],
    certifications: [],
    roles: [],
    linkedinUrl: '',
  });

  const handleAnalysisComplete = async (
    cvAnalysis: any,
    linkedinAnalysis: any,
    extractedData: ExtractedConsultantData
  ) => {
    try {
      console.log('🎯 Analysis complete, preparing to save consultant...');
      console.log('📊 CV Analysis:', cvAnalysis);
      console.log('🔗 LinkedIn Analysis:', linkedinAnalysis);
      console.log('📋 Extracted Data:', extractedData);
      console.log('👥 Is My Consultant:', isMyConsultant);

      const consultantData = {
        name: extractedData.name || 'Unknown Name',
        email: extractedData.email || 'no-email@example.com',
        phone: extractedData.phone || '',
        location: extractedData.location || 'Location not specified',
        skills: extractedData.skills || [],
        experience_years: extractedData.experienceYears || 5,
        hourly_rate: extractedData.hourlyRate || 800,
        availability: extractedData.availability || 'Available',
        cv_file_path: extractedData.cvPath || '',
        communication_style: extractedData.communicationStyle || '',
        languages: extractedData.languages || [],
        values: extractedData.values || [],
        personality_traits: extractedData.personalityTraits || [],
        certifications: extractedData.certifications || [],
        roles: extractedData.roles || ['Consultant'],
        linkedin_url: extractedData.linkedinUrl || '',
        type: isMyConsultant ? 'existing' : 'new',
        // 🔥 NEW: Save analysis data to database
        cv_analysis: cvAnalysis,
        linkedin_analysis: linkedinAnalysis,
      };

      console.log('💾 About to save consultant to database...');

      const { data: savedConsultant, error: saveError } = await supabase
        .from('consultants')
        .insert([consultantData])
        .select()
        .single();

      if (saveError) {
        console.error('❌ Error saving consultant:', saveError);
        throw saveError;
      }

      console.log('✅ Consultant saved successfully:', savedConsultant.id);

      // Send welcome email
      console.log('📧 About to send welcome email...');
      console.log('📧 Email details:', {
        name: extractedData.name,
        email: extractedData.email,
        isMyConsultant
      });

      try {
        const emailResponse = await supabase.functions.invoke('send-welcome-email', {
          body: {
            consultantName: extractedData.name,
            consultantEmail: extractedData.email,
            isMyConsultant: isMyConsultant
          }
        });

        console.log('📧 Welcome email response:', emailResponse);

        if (emailResponse.error) {
          console.error('❌ Welcome email error:', emailResponse.error);
        } else {
          console.log('✅ Welcome email sent successfully!');
        }
      } catch (emailError) {
        console.error('❌ Error calling welcome email function:', emailError);
      }

      // Send registration notification
      console.log('🔔 About to send registration notification...');
      try {
        const notificationResponse = await supabase.functions.invoke('send-registration-notification', {
          body: {
            consultantName: extractedData.name,
            consultantEmail: extractedData.email,
            isMyConsultant: isMyConsultant
          }
        });

        console.log('🔔 Registration notification response:', notificationResponse);

        if (notificationResponse.error) {
          console.error('❌ Registration notification error:', notificationResponse.error);
        } else {
          console.log('✅ Registration notification sent successfully!');
        }
      } catch (notificationError) {
        console.error('❌ Error calling registration notification function:', notificationError);
      }

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }

      // Call analysis complete callback
      onAnalysisComplete({
        cvAnalysis,
        linkedinAnalysis,
        consultant: {
          id: savedConsultant.id,
          name: extractedData.name || 'Unknown',
          email: extractedData.email || '',
          phone: extractedData.phone || '',
          location: extractedData.location || '',
          skills: extractedData.skills || [],
          experience: `${extractedData.experienceYears || 5} years`,
          rate: `${extractedData.hourlyRate || 800} SEK/hour`,
          availability: extractedData.availability || 'Available',
          cv: extractedData.cvPath || '',
          communicationStyle: extractedData.communicationStyle || '',
          rating: 4.8,
          projects: 0,
          lastActive: 'Recently',
          roles: extractedData.roles || ['Consultant'],
          certifications: extractedData.certifications || [],
          type: isMyConsultant ? 'existing' : 'new',
          user_id: null,
          languages: extractedData.languages || [],
          workStyle: '',
          values: extractedData.values || [],
          personalityTraits: extractedData.personalityTraits || [],
          teamFit: '',
          culturalFit: 5,
          adaptability: 5,
          leadership: 3,
          linkedinUrl: extractedData.linkedinUrl || '',
          cvAnalysis,
          linkedinAnalysis,
        }
      });

    } catch (error) {
      console.error('❌ Error in handleAnalysisComplete:', error);
      onError('Failed to save consultant data');
    }
  };

  const analyzeCVContent = async () => {
    if (!file) {
      onError('No file selected');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Upload file to Supabase storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from('cv-files')
        .upload(`${file.name}`, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (storageError) {
        console.error('❌ Error uploading file to Supabase storage:', storageError);
        throw storageError;
      }

      console.log('✅ File uploaded to Supabase storage:', storageData);

      const cvPath = `https://xbliknlrikolcjjfhxqa.supabase.co/storage/v1/object/public/${storageData.Key}`;

      // Call CV analysis function
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('cv-analysis', {
        body: {
          fileUrl: cvPath
        }
      });

      if (analysisError) {
        console.error('❌ Error calling CV analysis function:', analysisError);
        throw analysisError;
      }

      console.log('📊 CV analysis data:', analysisData);

      // Call LinkedIn analysis function
      const { data: linkedinData, error: linkedinError } = await supabase.functions.invoke('linkedin-analysis', {
        body: {
          linkedinUrl: extractedData.linkedinUrl
        }
      });

      if (linkedinError) {
        console.error('❌ Error calling LinkedIn analysis function:', linkedinError);
        // Don't throw error, continue with CV analysis data
      }

      console.log('🔗 LinkedIn analysis data:', linkedinData);

      // Extract relevant data from analysis
      const extractedConsultantData: ExtractedConsultantData = {
        name: analysisData?.name || 'Unknown Name',
        email: analysisData?.email || 'no-email@example.com',
        phone: analysisData?.phone || '',
        location: analysisData?.location || 'Location not specified',
        skills: analysisData?.skills || [],
        experienceYears: analysisData?.experience_years || 5,
        hourlyRate: analysisData?.hourly_rate || 800,
        availability: analysisData?.availability || 'Available',
        cvPath: cvPath,
        communicationStyle: analysisData?.communication_style || '',
        languages: analysisData?.languages || [],
        values: analysisData?.values || [],
        personalityTraits: analysisData?.personality_traits || [],
        certifications: analysisData?.certifications || [],
        roles: analysisData?.roles || ['Consultant'],
        linkedinUrl: extractedData.linkedinUrl || '',
      };

      setExtractedData(extractedConsultantData);

      // Call handleAnalysisComplete with analysis data
      await handleAnalysisComplete(analysisData, linkedinData, extractedConsultantData);

    } catch (error: any) {
      console.error('❌ Error analyzing CV content:', error);
      onError(error.message || 'Failed to analyze CV content');
      toast({
        title: "Upload failed!",
        description: error.message || 'Failed to analyze CV content',
      })
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Card className="w-[550px]">
        <CardHeader>
          <CardTitle>CV Analysis</CardTitle>
          <CardDescription>Upload a CV to extract consultant data</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full name</Label>
            <Input
              type="text"
              id="name"
              value={extractedData.name}
              onChange={(e) => setExtractedData({ ...extractedData, name: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              value={extractedData.email}
              onChange={(e) => setExtractedData({ ...extractedData, email: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              type="text"
              id="phone"
              value={extractedData.phone}
              onChange={(e) => setExtractedData({ ...extractedData, phone: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              type="text"
              id="location"
              value={extractedData.location}
              onChange={(e) => setExtractedData({ ...extractedData, location: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
            <Input
              type="text"
              id="linkedinUrl"
              value={extractedData.linkedinUrl}
              onChange={(e) => setExtractedData({ ...extractedData, linkedinUrl: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="communicationStyle">Communication Style</Label>
            <Textarea
              id="communicationStyle"
              placeholder="Enter communication style"
              value={extractedData.communicationStyle}
              onChange={(e) => setExtractedData({ ...extractedData, communicationStyle: e.target.value })}
            />
          </div>
          <ListSkills
            skills={extractedData.skills}
            setSkills={(skills: string[]) => setExtractedData({ ...extractedData, skills })}
          />
          <ListValues
            values={extractedData.values}
            setValues={(values: string[]) => setExtractedData({ ...extractedData, values })}
          />
          <ListLanguages
            languages={extractedData.languages}
            setLanguages={(languages: string[]) => setExtractedData({ ...extractedData, languages })}
          />
          <ListPersonalityTraits
            personalityTraits={extractedData.personalityTraits}
            setPersonalityTraits={(personalityTraits: string[]) => setExtractedData({ ...extractedData, personalityTraits })}
          />
          <ListCertifications
            certifications={extractedData.certifications}
            setCertifications={(certifications: string[]) => setExtractedData({ ...extractedData, certifications })}
          />
           <ListRoles
            roles={extractedData.roles}
            setRoles={(roles: string[]) => setExtractedData({ ...extractedData, roles })}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button onClick={analyzeCVContent} disabled={isLoading}>
            {isLoading ? "Analyzing..." : "Analyze"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
