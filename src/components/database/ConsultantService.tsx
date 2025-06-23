
import { supabase } from '@/integrations/supabase/client';

interface CreateConsultantParams {
  cvAnalysis: any;
  linkedinData?: any;
  extractedPersonalInfo: any;
  personalDescription?: string;
  file: File;
  linkedinUrl?: string;
  isMyConsultant?: boolean;
}

export class ConsultantService {
  static async createConsultant({
    cvAnalysis,
    linkedinData,
    extractedPersonalInfo,
    personalDescription = '',
    file,
    linkedinUrl = '',
    isMyConsultant = false
  }: CreateConsultantParams) {
    console.log('🏗️ Creating consultant profile with enhanced data');
    console.log('📝 Personal description included:', !!personalDescription);

    try {
      // Prepare consultant data with all analysis results
      const consultantData = {
        name: extractedPersonalInfo.name,
        email: extractedPersonalInfo.email,
        phone: extractedPersonalInfo.phone || '',
        location: extractedPersonalInfo.location || 'Sweden',
        linkedin_url: linkedinUrl,
        
        // Enhanced analysis results including personal description insights
        cv_analysis_data: cvAnalysis,
        linkedin_analysis_data: linkedinData,
        analysis_results: cvAnalysis,
        self_description: personalDescription,
        
        // Type assignment based on source
        type: isMyConsultant ? 'existing' : 'new',
        
        // Skills and experience from analysis
        skills: cvAnalysis?.skills?.technical || [],
        primary_tech_stack: cvAnalysis?.skills?.technical?.slice(0, 5) || [],
        secondary_tech_stack: cvAnalysis?.skills?.tools || [],
        languages: cvAnalysis?.skills?.languages || [],
        certifications: cvAnalysis?.education?.map((edu: any) => edu.degree || edu.certification).filter(Boolean) || [],
        
        // Experience data
        experience_years: parseInt(cvAnalysis?.experience?.years?.toString() || '0'),
        title: cvAnalysis?.experience?.currentRole || 'Consultant',
        
        // Behavioral scores from enhanced analysis
        leadership: cvAnalysis?.scores?.leadership || 4,
        adaptability: cvAnalysis?.scores?.adaptability || 4,
        cultural_fit: cvAnalysis?.scores?.culturalFit || 4,
        
        // Market analysis
        hourly_rate: cvAnalysis?.marketAnalysis?.hourlyRate?.current || 800,
        market_rate_current: cvAnalysis?.marketAnalysis?.hourlyRate?.current || 800,
        market_rate_optimized: cvAnalysis?.marketAnalysis?.hourlyRate?.optimized || 950,
        
        // Soft skills from enhanced analysis including personal description
        communication_style: cvAnalysis?.softSkills?.communicationStyle || 'Professional and collaborative',
        work_style: cvAnalysis?.softSkills?.workStyle || 'Team-oriented and adaptable',
        personality_traits: cvAnalysis?.softSkills?.personalityTraits || ['Analytical', 'Detail-oriented'],
        values: cvAnalysis?.softSkills?.values || ['Quality', 'Innovation', 'Collaboration'],
        
        // Status and visibility
        availability: 'Available',
        visibility_status: 'public',
        is_published: true,
        
        // Metadata
        source_cv_raw_text: true,
        source_linkedin_parsed: !!linkedinData,
        analysis_timestamp: new Date().toISOString(),
        profile_completeness: 85
      };

      const { data: consultant, error } = await supabase
        .from('consultants')
        .insert([consultantData])
        .select()
        .single();

      if (error) {
        console.error('❌ Failed to create consultant:', error);
        throw new Error(`Failed to create consultant profile: ${error.message}`);
      }

      console.log('✅ Consultant profile created successfully:', consultant.id);
      return consultant;

    } catch (error: any) {
      console.error('❌ ConsultantService error:', error);
      throw error;
    }
  }
}
