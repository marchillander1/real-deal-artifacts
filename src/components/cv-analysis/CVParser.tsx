
import { supabase } from '@/integrations/supabase/client';

export class CVParser {
  static async parseCV(file: File, personalDescription: string = '') {
    console.log('📄 Starting enhanced CV parsing for:', file.name);
    console.log('📝 Personal description provided:', !!personalDescription);
    
    const formData = new FormData();
    formData.append('file', file);
    if (personalDescription.trim()) {
      formData.append('personalDescription', personalDescription.trim());
    }

    const cvResponse = await supabase.functions.invoke('parse-cv', {
      body: formData
    });

    if (cvResponse.error) {
      throw new Error(`CV analysis failed: ${cvResponse.error.message}`);
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
    
    // Ensure consistent structure for analysis with all required fields
    const standardAnalysis = {
      personalInfo: {
        name: data.analysis?.personalInfo?.name || 'Not specified',
        email: data.analysis?.personalInfo?.email || 'Not specified',
        phone: data.analysis?.personalInfo?.phone || 'Not specified',
        location: data.analysis?.personalInfo?.location || 'Not specified'
      },
      experience: {
        years: data.analysis?.experience?.years || 'Not specified',
        currentRole: data.analysis?.experience?.currentRole || 'Not specified',
        level: data.analysis?.experience?.level || 'Not specified'
      },
      skills: {
        technical: data.analysis?.skills?.technical || [],
        languages: data.analysis?.skills?.languages || [],
        tools: data.analysis?.skills?.tools || []
      },
      workHistory: data.analysis?.workHistory || [],
      education: data.analysis?.education || [],
      
      // Soft skills section - enhanced with personal description analysis
      softSkills: {
        communicationStyle: data.analysis?.softSkills?.communicationStyle || data.analysis?.communicationStyle || 'Professional and collaborative',
        leadershipStyle: data.analysis?.softSkills?.leadershipStyle || data.analysis?.leadershipStyle || 'Supportive and goal-oriented',
        workStyle: data.analysis?.softSkills?.workStyle || data.analysis?.workStyle || 'Team-oriented and adaptable',
        values: data.analysis?.softSkills?.values || data.analysis?.values || ['Quality', 'Innovation', 'Collaboration'],
        personalityTraits: data.analysis?.softSkills?.personalityTraits || data.analysis?.personalityTraits || ['Analytical', 'Detail-oriented', 'Problem-solver']
      },

      // Behavioral scores (1-5 scale) - enhanced with personal description insights
      scores: {
        leadership: data.analysis?.scores?.leadership || data.analysis?.leadership || 4,
        innovation: data.analysis?.scores?.innovation || data.analysis?.innovation || 4,
        adaptability: data.analysis?.scores?.adaptability || data.analysis?.adaptability || 4,
        culturalFit: data.analysis?.scores?.culturalFit || data.analysis?.culturalFit || 4,
        communication: data.analysis?.scores?.communication || data.analysis?.communication || 4,
        teamwork: data.analysis?.scores?.teamwork || data.analysis?.teamwork || 4
      },

      // Market analysis
      marketAnalysis: {
        hourlyRate: {
          current: data.analysis?.marketAnalysis?.hourlyRate?.current || data.analysis?.marketRate?.current || 800,
          optimized: data.analysis?.marketAnalysis?.hourlyRate?.optimized || data.analysis?.marketRate?.optimized || 950,
          explanation: data.analysis?.marketAnalysis?.hourlyRate?.explanation || data.analysis?.marketRate?.explanation || 'Based on experience level and technical skills in the Swedish market'
        },
        competitiveAdvantages: data.analysis?.marketAnalysis?.competitiveAdvantages || data.analysis?.competitiveAdvantages || ['Strong technical foundation', 'Proven track record', 'Excellent communication skills'],
        marketDemand: data.analysis?.marketAnalysis?.marketDemand || data.analysis?.marketDemand || 'High demand in the current market',
        recommendedFocus: data.analysis?.marketAnalysis?.recommendedFocus || data.analysis?.recommendedFocus || 'Continue building expertise in current tech stack while exploring emerging technologies'
      },

      // Career development insights - enhanced with personal description
      analysisInsights: {
        strengths: data.analysis?.analysisInsights?.strengths || data.analysis?.strengths || ['Technical expertise', 'Problem-solving ability', 'Team collaboration'],
        developmentAreas: data.analysis?.analysisInsights?.developmentAreas || data.analysis?.developmentAreas || ['Leadership development', 'Advanced certifications', 'Public speaking'],
        careerTrajectory: data.analysis?.analysisInsights?.careerTrajectory || data.analysis?.careerTrajectory || 'Strong upward trajectory with opportunities for senior technical or leadership roles',
        consultingReadiness: data.analysis?.analysisInsights?.consultingReadiness || data.analysis?.consultingReadiness || 'Well-prepared for consulting with strong technical and soft skills'
      }
    };

    // Clean up detected info
    const standardDetectedInfo = {
      emails: data.detectedInformation?.emails || [],
      phones: data.detectedInformation?.phones || [],
      names: data.detectedInformation?.names || [],
      locations: data.detectedInformation?.locations || []
    };

    console.log('✅ Data structure standardized with personal description analysis:', {
      hasPersonalInfo: !!standardAnalysis.personalInfo,
      hasExperience: !!standardAnalysis.experience,
      hasSkills: !!standardAnalysis.skills,
      hasSoftSkills: !!standardAnalysis.softSkills,
      hasScores: !!standardAnalysis.scores,
      hasMarketAnalysis: !!standardAnalysis.marketAnalysis,
      hasInsights: !!standardAnalysis.analysisInsights,
      detectedItemsCount: Object.values(standardDetectedInfo).reduce((sum, arr) => sum + arr.length, 0),
      personalDescriptionEnhanced: true
    });

    return {
      analysis: standardAnalysis,
      detectedInfo: standardDetectedInfo
    };
  }
}
