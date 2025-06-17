
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
  // 🔥 NEW: Add analysis data
  cvAnalysis?: any;
  linkedinAnalysis?: any;
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
}

export interface MatchResult {
  consultant: Consultant;
  matchScore: number;
  matchedSkills: string[];
  reasoning: string;
  coverLetter?: string;
}
