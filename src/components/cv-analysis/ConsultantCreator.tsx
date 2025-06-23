
import { supabase } from '@/integrations/supabase/client';

interface CreateConsultantParams {
  cvAnalysis: any;
  linkedinData: any;
  extractedPersonalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  file: File;
  linkedinUrl: string;
  isMyConsultant: boolean;
}

export class ConsultantCreator {
  static async createConsultant({
    cvAnalysis,
    linkedinData,
    extractedPersonalInfo,
    file,
    linkedinUrl,
    isMyConsultant
  }: CreateConsultantParams) {
    console.log('💾 Creating consultant with extracted data:', extractedPersonalInfo);

    // Extract skills and experience
    let allSkills = [];
    if (cvAnalysis?.skills) {
      allSkills = [
        ...(cvAnalysis.skills.technical || []),
        ...(cvAnalysis.skills.languages || []),
        ...(cvAnalysis.skills.tools || [])
      ];
    } else if (cvAnalysis?.technicalExpertise) {
      const tech = cvAnalysis.technicalExpertise;
      allSkills = [
        ...(tech.programmingLanguages?.expert || []),
        ...(tech.programmingLanguages?.proficient || []),
        ...(tech.programmingLanguages?.familiar || []),
        ...(tech.frameworks || []),
        ...(tech.tools || []),
        ...(tech.databases || [])
      ];
    }
    
    allSkills = allSkills.filter(skill => skill && skill.length > 0 && skill !== 'Not specified');
    
    // Extract experience years
    let experienceYears = 5;
    if (cvAnalysis?.experience?.years && cvAnalysis.experience.years !== 'Not specified') {
      experienceYears = parseInt(cvAnalysis.experience.years.toString().match(/\d+/)?.[0] || '5');
    } else if (cvAnalysis?.professionalSummary?.yearsOfExperience && cvAnalysis.professionalSummary.yearsOfExperience !== 'Not specified') {
      experienceYears = parseInt(cvAnalysis.professionalSummary.yearsOfExperience.toString().match(/\d+/)?.[0] || '5');
    }
    
    const consultantData = {
      name: extractedPersonalInfo.name,
      email: extractedPersonalInfo.email,
      phone: extractedPersonalInfo.phone,
      location: extractedPersonalInfo.location,
      skills: allSkills,
      experience_years: experienceYears,
      hourly_rate: 1000,
      availability: 'Available',
      cv_file_path: file.name,
      communication_style: linkedinData?.communicationStyle || 'Professional communication',
      rating: 4.8,
      projects_completed: 0,
      roles: cvAnalysis?.workHistory?.map((exp: any) => exp.role).filter((role: string) => role && role !== 'Not specified') || [cvAnalysis?.experience?.currentRole || cvAnalysis?.professionalSummary?.currentRole || 'Consultant'],
      certifications: [],
      type: isMyConsultant ? 'existing' : 'new',
      user_id: isMyConsultant ? 'temp-user-id' : null,
      languages: ['English', 'Swedish'],
      work_style: linkedinData?.teamFitAssessment?.workStyle || 'Collaborative',
      values: ['Professional development', 'Innovation'],
      personality_traits: linkedinData?.contentAnalysisInsights?.professionalValues || ['Problem-solving', 'Analytical'],
      team_fit: linkedinData?.teamFitAssessment?.workStyle || 'Team player',
      cultural_fit: linkedinData?.culturalFit || 5,
      adaptability: linkedinData?.adaptability || 5,
      leadership: linkedinData?.leadership || Math.min(experienceYears >= 5 ? 4 : 3, 5),
      linkedin_url: linkedinUrl || '',
      cv_analysis_data: { analysis: cvAnalysis },
      linkedin_analysis_data: linkedinData
    };

    const { data: insertedConsultant, error: insertError } = await supabase
      .from('consultants')
      .insert([consultantData])
      .select()
      .single();

    if (insertError) {
      throw new Error(`Failed to save consultant: ${insertError.message}`);
    }

    return insertedConsultant;
  }
}
