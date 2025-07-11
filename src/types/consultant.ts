
// Centralized type definitions for consultants
export interface Consultant {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
  location: string;
  title?: string;
  tagline?: string;
  
  // Skills and experience
  skills: string[];
  roles: string[];
  experience: string;
  experience_years?: number;
  certifications: string[];
  languages?: string[];
  
  // Ratings and stats
  rating: number;
  projects: number;
  rate: string;
  hourly_rate?: number;
  
  // Availability
  availability: string;
  lastActive: string;
  last_active?: string;
  
  // Communication and work style
  cv?: string;
  communicationStyle?: string;
  communication_style?: string;
  workStyle?: string;
  work_style?: string;
  teamFit?: string;
  team_fit?: string;
  
  // Personality and cultural fit
  culturalFit?: number;
  cultural_fit?: number;
  adaptability?: number;
  leadership?: number;
  personalityTraits?: string[];
  personality_traits?: string[];
  values?: string[];
  
  // Analysis data
  cvAnalysis?: any;
  linkedinAnalysis?: any;
  linkedin_url?: string;
  thought_leadership_score?: number;
  
  // Metadata - Updated to include my/network types
  type: 'existing' | 'new' | 'my' | 'network';
  created_at?: string;
  updated_at?: string;
  visibility_status?: string;
  is_published?: boolean;
  user_id?: string;
  company_id?: string;
  
  // Company contact fields (when consultant is uploaded by company)
  contactPerson?: string;
  isCompanyConsultant?: boolean;
  
  // Additional fields
  industries?: string[];
}

export interface Assignment {
  id: string | number;
  title: string;
  description: string;
  company: string;
  industry?: string;
  requiredSkills: string[];
  required_skills?: string[];
  duration?: string;
  workload?: string;
  budget?: string;
  budget_min?: number;
  budget_max?: number;
  budget_currency?: string;
  start_date?: string;
  remote?: string;
  remote_type?: string;
  location?: string;
  team_size?: string;
  urgency?: string;
  status?: string;
  hourlyRate?: number;
  matchedConsultants?: number;
  
  // Team and culture requirements
  teamCulture?: string;
  team_culture?: string;
  desiredCommunicationStyle?: string;
  desired_communication_style?: string;
  requiredValues?: string[];
  required_values?: string[];
  teamDynamics?: string;
  team_dynamics?: string;
  leadership_level?: number;
  leadershipLevel?: number;
  
  // Metadata
  created_by?: string;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  client_logo?: string;
  clientLogo?: string;
}

export interface Match {
  id: string | number;
  consultant: Consultant;
  assignment: Assignment;
  matchScore: number;
  match_score?: number;
  technicalFit?: number;
  culturalFit?: number;
  cultural_fit?: number;
  matchedSkills: string[];
  matched_skills?: string[];
  reasoning: string;
  coverLetter?: string;
  cover_letter?: string;
  created_at?: string;
  status?: string;
}

export interface CVAnalysisResult {
  consultant: Consultant;
  cvAnalysis: any;
  linkedinAnalysis?: any;
  extractedPersonalInfo: {
    name: string;
    email: string;
    phone?: string;
    location: string;
    personalDescription?: string;
  };
}

export interface UploadData {
  file: File;
  linkedinUrl: string;
  personalDescription: string;
}
