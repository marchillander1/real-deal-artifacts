
export interface Assignment {
  id: number | string;
  title: string;
  description: string;
  company: string;
  clientLogo?: string;
  requiredSkills: string[];
  workload: string;
  duration: string;
  location?: string;
  urgency: 'Low' | 'Medium' | 'High';
  budget: string;
  hourlyRate?: number;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  matchedConsultants?: number;
  createdAt: string;
  remote?: string;
  teamSize?: string;
  teamCulture?: string;
  industry?: string;
  startDate?: string;
  desiredCommunicationStyle?: string;
  requiredValues?: string[];
  leadershipLevel?: number;
  teamDynamics?: string;
}
