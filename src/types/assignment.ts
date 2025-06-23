
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
  urgency: "High" | "Medium" | "Low";
  budget: string;
  hourlyRate: number;
  status: "open" | "in_progress" | "completed" | "cancelled";
  matchedConsultants: number;
  createdAt: string;
  remote: string;
  teamSize: string;
  teamCulture: string;
  industry: string;
}
