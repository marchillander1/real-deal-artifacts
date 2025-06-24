
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
  
  // Ratings and stats
  rating: number;
  projects: number;
  rate: string;
  hourly_rate?: number;
  
  // Availability
  availability: string;
  lastActive: string;
  last_active?: string;
  
  // Analysis data
  cvAnalysis?: any;
  linkedinAnalysis?: any;
  
  // Metadata
  type: 'existing' | 'new';
  created_at?: string;
  updated_at?: string;
  visibility_status?: string;
  is_published?: boolean;
  
  // Additional fields
  values?: string[];
  personality_traits?: string[];
  industries?: string[];
  linkedin_url?: string;
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
