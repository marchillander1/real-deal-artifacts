
import { useState } from 'react';
import { parseCV, saveConsultantToDatabase } from '@/utils/cvParsingService';
import { useToast } from '@/hooks/use-toast';

export const useCVUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const uploadCV = async (file: File, linkedinUrl: string = '') => {
    try {
      setIsUploading(true);
      setUploadProgress(10);

      console.log('🚀 Starting CV upload process:', file.name);

      // Parse CV with Groq AI
      const parseResult = await parseCV(file, linkedinUrl);
      setUploadProgress(50);

      if (!parseResult.success) {
        throw new Error(parseResult.error || 'CV parsing failed');
      }

      console.log('✅ CV parsed successfully:', parseResult.analysis);

      // Prepare consultant data
      const consultantData = {
        name: parseResult.analysis.personalInfo?.name || 'Unknown Consultant',
        email: parseResult.analysis.personalInfo?.email || 'temp@temp.com',
        phone: parseResult.analysis.personalInfo?.phone || '',
        location: parseResult.analysis.personalInfo?.location || 'Sweden',
        skills: [
          ...(parseResult.analysis.skills?.technical || []),
          ...(parseResult.analysis.skills?.languages || []),
          ...(parseResult.analysis.skills?.tools || [])
        ].filter(skill => skill && skill !== 'Ej specificerat'),
        experience_years: parseInt(parseResult.analysis.experience?.years?.toString().match(/\d+/)?.[0] || '5'),
        hourly_rate: 1000,
        availability: 'Available',
        cv_file_path: file.name,
        communication_style: 'Professional',
        rating: 4.8,
        projects_completed: 0,
        roles: parseResult.analysis.workHistory?.map((exp: any) => exp.role).filter((role: string) => role && role !== 'Ej specificerat') || ['Consultant'],
        certifications: [],
        type: 'existing', // My consultant
        user_id: 'temp-user-id',
        languages: ['English', 'Swedish'],
        work_style: 'Collaborative',
        values: ['Professional development', 'Innovation'],
        personality_traits: ['Problem-solving', 'Analytical'],
        team_fit: 'Team player',
        cultural_fit: 5,
        adaptability: 5,
        leadership: 3,
        linkedin_url: linkedinUrl || '',
        cv_analysis_data: parseResult,
        linkedin_analysis_data: null
      };

      setUploadProgress(75);

      // Save to database
      const saveResult = await saveConsultantToDatabase(consultantData);
      setUploadProgress(100);

      console.log('💾 Consultant saved successfully:', saveResult.consultant);

      toast({
        title: "CV Upload Successful! 🎉",
        description: `${consultantData.name} has been added to your team`,
      });

      return {
        success: true,
        consultant: saveResult.consultant,
        analysis: parseResult.analysis
      };

    } catch (error: any) {
      console.error('❌ CV upload failed:', error);
      
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload CV. Please try again.",
        variant: "destructive",
      });

      return {
        success: false,
        error: error.message
      };
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return {
    uploadCV,
    isUploading,
    uploadProgress
  };
};
