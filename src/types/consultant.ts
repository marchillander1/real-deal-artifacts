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
  type: 'existing' | 'new';
  languages: string[];
  workStyle?: string;
  values?: string[];
  personalityTraits?: string[];
  teamFit?: string;
  culturalFit?: number;
  adaptability?: number;
  leadership?: number;
  linkedinUrl?: string;
  cvAnalysis?: {
    experience: string;
    seniorityLevel: string;
    strengths: string[];
    marketPosition: string;
    technicalDepth: string;
    improvementAreas: string[];
  };
  linkedinAnalysis?: {
    communicationStyle: string;
    leadershipStyle: string;
    culturalFit: number;
    leadership: number;
    innovation: number;
    problemSolving: string;
    businessAcumen: string;
    teamCollaboration: string;
  };
}

export interface Assignment {
  id: string | number;
  title: string;
  description: string;
  requiredSkills: string[];
  startDate: string;
  duration: string;
  workload: string;
  budget: string;
  company: string;
  industry: string;
  teamSize: string;
  remote: string;
  urgency: string;
  clientLogo: string;
  teamCulture: string;
  desiredCommunicationStyle: string;
  requiredValues: string[];
  leadershipLevel: number;
  teamDynamics: string;
}

export interface Match {
  consultant: Consultant;
  score: number;
  matchedSkills: string[];
  estimatedSavings: number;
  responseTime: number;
  humanFactorsScore: number;
  culturalMatch: number;
  communicationMatch: number;
  valuesAlignment: number;
  letter: string;
}
