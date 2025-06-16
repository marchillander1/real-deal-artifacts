
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
    personalInfo?: {
      name?: string;
      email?: string;
      phone?: string;
      location?: string;
      linkedinProfile?: string;
      githubProfile?: string;
      portfolio?: string;
      languages?: string[];
    };
    professionalSummary?: {
      yearsOfExperience?: string;
      seniorityLevel?: string;
      industryFocus?: string[];
      specializations?: string[];
      careerTrajectory?: string;
      currentRole?: string;
    };
    technicalExpertise?: {
      programmingLanguages?: {
        expert?: string[];
        proficient?: string[];
        familiar?: string[];
      };
      frontendTechnologies?: {
        frameworks?: string[];
        styling?: string[];
        stateManagement?: string[];
        buildTools?: string[];
      };
      backendTechnologies?: {
        frameworks?: string[];
        databases?: string[];
        messageQueues?: string[];
        caching?: string[];
      };
      cloudAndInfrastructure?: {
        platforms?: string[];
        containerization?: string[];
        cicd?: string[];
        monitoring?: string[];
        iac?: string[];
      };
      specializedSkills?: {
        aiMl?: string[];
        security?: string[];
        testing?: string[];
        apiDesign?: string[];
      };
    };
    detailedStrengthsAnalysis?: {
      category: string;
      description: string;
      evidence: string[];
      marketValue: string;
      competitiveDifferentiator: string;
      growthPotential: string;
    }[];
    comprehensiveImprovementAreas?: {
      area: string;
      currentState: string;
      improvementPriority: string;
      timeToImplement: string;
      detailedTips: string[];
      expectedImpact: string;
      resources: string[];
    }[];
    marketPositioning?: {
      uniqueValueProposition?: string;
      competitiveAdvantages?: string[];
      targetRoles?: string[];
      salaryBenchmarks?: {
        stockholm?: string;
        europeanTech?: string;
        remoteGlobal?: string;
      };
      competitiveness?: string;
      marketReadiness?: string;
      growthTrajectory?: string;
    };
    softSkills?: {
      leadership?: string[];
      communication?: string[];
      problemSolving?: string[];
      adaptability?: string[];
    };
    workPreferences?: {
      workStyle?: string;
      teamEnvironment?: string;
      projectTypes?: string;
      remoteWork?: string;
      travelWillingness?: string;
      workLifeBalance?: string;
      companySize?: string;
      industryPreferences?: string[];
    };
    certifications?: {
      cloud?: string[];
      development?: string[];
      management?: string[];
      security?: string[];
    };
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
    adaptability?: number;
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
