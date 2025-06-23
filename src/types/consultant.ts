
export interface Consultant {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  location: string;
  skills: string[];
  experience: string;
  rate: string;
  availability: string;
  cv: string;
  communicationStyle: string;
  rating: number;
  projects: number;
  lastActive: string;
  roles: string[];
  certifications: string[];
  type: 'new' | 'existing';
  user_id?: string | null;
  languages: string[];
  workStyle: string;
  values: string[];
  personalityTraits: string[];
  teamFit: string;
  culturalFit: number;
  adaptability: number;
  leadership: number;
  linkedinUrl: string;
  // Standardized analysis data structure
  cvAnalysis?: {
    personalInfo: {
      name: string;
      email: string;
      phone: string;
      location: string;
    };
    experience: {
      years: string;
      currentRole: string;
      level: string;
    };
    skills: {
      technical: string[];
      languages: string[];
      tools: string[];
    };
    workHistory: Array<{
      company: string;
      role: string;
      duration: string;
      description: string;
    }>;
    education: Array<{
      institution: string;
      degree: string;
      year: string;
    }>;
    softSkills: {
      communicationStyle: string;
      leadershipStyle: string;
      workStyle: string;
      values: string[];
      personalityTraits: string[];
    };
    scores: {
      leadership: number;
      innovation: number;
      adaptability: number;
      culturalFit: number;
      communication: number;
      teamwork: number;
    };
    marketAnalysis: {
      hourlyRate: {
        current: number;
        optimized: number;
        explanation: string;
      };
      competitiveAdvantages: string[];
      marketDemand: string;
      recommendedFocus: string;
    };
    analysisInsights: {
      strengths: string[];
      developmentAreas: string[];
      careerTrajectory: string;
      consultingReadiness: string;
    };
  };
  linkedinAnalysis?: {
    communicationStyle: string;
    leadershipStyle: string;
    innovation: number;
    leadership: number;
    adaptability: number;
    culturalFit: number;
    marketPositioning: {
      uniqueValueProposition: string;
      competitiveAdvantages: string[];
    };
  };
  // Enhanced analysis fields from database
  profile_completeness?: number;
  linkedin_engagement_level?: string;
  thought_leadership_score?: number;
  primary_tech_stack?: string[];
  secondary_tech_stack?: string[];
  top_values?: string[];
  industries?: string[];
  market_rate_current?: number;
  market_rate_optimized?: number;
  cv_tips?: string[];
  suggested_learning_paths?: string[];
}

export interface Assignment {
  id: string | number;
  title: string;
  description: string;
  company: string;
  clientLogo: string;
  requiredSkills: string[];
  workload: string;
  duration: string;
  budget: string;
  remote: string;
  urgency: 'Low' | 'Medium' | 'High';
  teamSize: string;
  teamCulture: string;
  industry: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  startDate?: string;
  desiredCommunicationStyle?: string;
  requiredValues?: string[];
  leadershipLevel?: number;
  teamDynamics?: string;
}

export interface MatchResult {
  consultant: Consultant;
  matchScore: number;
  matchedSkills: string[];
  reasoning: string;
  coverLetter?: string;
}

export interface Match {
  consultant: Consultant;
  matchScore: number;
  matchedSkills: string[];
  reasoning: string;
  coverLetter?: string;
}
