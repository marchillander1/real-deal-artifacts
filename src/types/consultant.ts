
export interface Consultant {
  id: number;
  name: string;
  skills: string[];
  experience: string;
  roles: string[];
  location: string;
  rate: string;
  availability: string;
  phone: string;
  email: string;
  projects: number;
  rating: number;
  lastActive: string;
  cv: string;
  certifications: string[];
  languages: string[];
  type: 'existing' | 'new';
}

export interface Assignment {
  id: number;
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
}

export interface Match {
  consultant: Consultant;
  score: number;
  letter: string;
  matchedSkills: string[];
  estimatedSavings: number;
  responseTime: number;
}

export interface Stats {
  totalConsultants: number;
  activeAssignments: number;
  successfulMatches: number;
  avgMatchTime: string;
  clientSatisfaction: number;
  timeSaved: string;
  revenue: string;
}
