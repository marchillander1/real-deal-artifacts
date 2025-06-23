
import { supabase } from '@/integrations/supabase/client';

export class CVParser {
  static async parseCV(file: File) {
    console.log('📄 Starting enhanced CV parsing for:', file.name);
    
    const formData = new FormData();
    formData.append('file', file);

    const cvResponse = await supabase.functions.invoke('parse-cv', {
      body: formData
    });

    if (cvResponse.error) {
      throw new Error(`CV-analys misslyckades: ${cvResponse.error.message}`);
    }

    // Standardize the response structure
    const standardizedAnalysis = this.standardizeAnalysisData(cvResponse.data);
    
    return {
      analysis: standardizedAnalysis.analysis,
      detectedInfo: standardizedAnalysis.detectedInfo
    };
  }

  private static standardizeAnalysisData(data: any) {
    console.log('🔧 Standardizing CV analysis data structure');
    
    // Ensure consistent structure for analysis
    const standardAnalysis = {
      personalInfo: {
        name: data.analysis?.personalInfo?.name || 'Ej specificerat',
        email: data.analysis?.personalInfo?.email || 'Ej specificerat',
        phone: data.analysis?.personalInfo?.phone || 'Ej specificerat',
        location: data.analysis?.personalInfo?.location || 'Ej specificerat'
      },
      experience: {
        years: data.analysis?.experience?.years || 'Ej specificerat',
        currentRole: data.analysis?.experience?.currentRole || 'Ej specificerat',
        level: data.analysis?.experience?.level || 'Ej specificerat'
      },
      skills: {
        technical: data.analysis?.skills?.technical || [],
        languages: data.analysis?.skills?.languages || [],
        tools: data.analysis?.skills?.tools || []
      },
      workHistory: data.analysis?.workHistory || [],
      education: data.analysis?.education || []
    };

    // Clean up detected info
    const standardDetectedInfo = {
      emails: data.detectedInformation?.emails || [],
      phones: data.detectedInformation?.phones || [],
      names: data.detectedInformation?.names || [],
      locations: data.detectedInformation?.locations || []
    };

    console.log('✅ Data structure standardized:', {
      hasPersonalInfo: !!standardAnalysis.personalInfo,
      hasExperience: !!standardAnalysis.experience,
      hasSkills: !!standardAnalysis.skills,
      detectedItemsCount: Object.values(standardDetectedInfo).reduce((sum, arr) => sum + arr.length, 0)
    });

    return {
      analysis: standardAnalysis,
      detectedInfo: standardDetectedInfo
    };
  }
}
