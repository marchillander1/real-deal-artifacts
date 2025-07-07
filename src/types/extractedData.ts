
export interface ExtractedData {
  name: string;
  email: string;
  phone: string;
  location: string;
  skills: string[];
  experience: string;
  education: string[];
  workHistory: any[];
  languages: string[];
  linkedin?: string;
  // Additional fields for enhanced confirmation
  yearsOfExperience?: number;
  currentRole?: string;
  industries?: string[];
  certifications?: string[];
}
