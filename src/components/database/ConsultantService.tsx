
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

export class ConsultantService {
  static async createConsultant(params: CreateConsultantParams) {
    const { cvAnalysis, linkedinData, extractedPersonalInfo, file, linkedinUrl, isMyConsultant } = params;
    
    console.log('💾 Creating consultant profile for:', extractedPersonalInfo.name);

    try {
      // Extract and normalize skills
      const allSkills = this.extractSkills(cvAnalysis);
      const experienceYears = this.extractExperienceYears(cvAnalysis);

      const consultantData = {
        name: extractedPersonalInfo.name,
        email: extractedPersonalInfo.email,
        phone: extractedPersonalInfo.phone || '',
        location: extractedPersonalInfo.location || 'Sweden',
        skills: allSkills,
        experience_years: experienceYears,
        hourly_rate: this.calculateHourlyRate(experienceYears),
        availability: 'Available',
        cv_file_path: file.name,
        communication_style: linkedinData?.communicationStyle || 'Professional',
        rating: 4.8,
        projects_completed: 0,
        roles: this.extractRoles(cvAnalysis),
        certifications: [],
        type: isMyConsultant ? 'existing' : 'new',
        user_id: isMyConsultant ? 'temp-user-id' : null,
        languages: ['English', 'Swedish'],
        work_style: linkedinData?.teamFitAssessment?.workStyle || 'Collaborative',
        values: ['Professional development', 'Innovation'],
        personality_traits: linkedinData?.contentAnalysisInsights?.professionalValues || ['Problem-solving'],
        team_fit: linkedinData?.teamFitAssessment?.workStyle || 'Team player',
        cultural_fit: linkedinData?.culturalFit || 5,
        adaptability: linkedinData?.adaptability || 5,
        leadership: this.calculateLeadershipScore(experienceYears),
        linkedin_url: linkedinUrl || '',
        cv_analysis_data: { analysis: cvAnalysis },
        linkedin_analysis_data: linkedinData,
        visibility_status: 'public',
        is_published: true
      };

      const { data: consultant, error } = await supabase
        .from('consultants')
        .insert([consultantData])
        .select()
        .single();

      if (error) {
        console.error('❌ Database insert error:', error);
        throw new Error(`Failed to create consultant profile: ${error.message}`);
      }

      console.log('✅ Consultant profile created successfully:', consultant.id);
      return consultant;

    } catch (error: any) {
      console.error('❌ Consultant creation failed:', error);
      throw error;
    }
  }

  private static extractSkills(cvAnalysis: any): string[] {
    let skills: string[] = [];
    
    if (cvAnalysis?.skills) {
      skills = [
        ...(cvAnalysis.skills.technical || []),
        ...(cvAnalysis.skills.languages || []),
        ...(cvAnalysis.skills.tools || [])
      ];
    } else if (cvAnalysis?.technicalExpertise) {
      const tech = cvAnalysis.technicalExpertise;
      skills = [
        ...(tech.programmingLanguages?.expert || []),
        ...(tech.programmingLanguages?.proficient || []),
        ...(tech.frameworks || []),
        ...(tech.tools || []),
        ...(tech.databases || [])
      ];
    }
    
    return skills.filter(skill => skill && skill.length > 0 && skill !== 'Not specified').slice(0, 20);
  }

  private static extractExperienceYears(cvAnalysis: any): number {
    if (cvAnalysis?.experience?.years && cvAnalysis.experience.years !== 'Not specified') {
      return parseInt(cvAnalysis.experience.years.toString().match(/\d+/)?.[0] || '5');
    }
    if (cvAnalysis?.professionalSummary?.yearsOfExperience) {
      return parseInt(cvAnalysis.professionalSummary.yearsOfExperience.toString().match(/\d+/)?.[0] || '5');
    }
    return 5;
  }

  private static extractRoles(cvAnalysis: any): string[] {
    if (cvAnalysis?.workHistory?.length > 0) {
      return cvAnalysis.workHistory
        .map((exp: any) => exp.role)
        .filter((role: string) => role && role !== 'Not specified')
        .slice(0, 5);
    }
    return [cvAnalysis?.experience?.currentRole || 'Consultant'];
  }

  private static calculateHourlyRate(experienceYears: number): number {
    if (experienceYears >= 10) return 1200;
    if (experienceYears >= 7) return 1100;
    if (experienceYears >= 5) return 1000;
    if (experienceYears >= 3) return 900;
    return 800;
  }

  private static calculateLeadershipScore(experienceYears: number): number {
    return Math.min(experienceYears >= 5 ? 4 : 3, 5);
  }
}
