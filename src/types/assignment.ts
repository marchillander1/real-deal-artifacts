
export interface Assignment {
  id: number;
  title: string;
  description: string;
  company: string;
  clientLogo: string;
  requiredSkills: string[];
  workload: string;
  duration: string;
  location: string;
  urgency: string;
  budget: string;
  hourlyRate: number;
  status: string;
  matchedConsultants: number;
  createdAt: string;
  remote: boolean;
  teamSize: string;
  teamCulture: string;
  industry: string;
}
