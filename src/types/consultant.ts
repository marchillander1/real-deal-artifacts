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
  user_id?: string | null; // Add the missing user_id property
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
    technicalSkillsAnalysis?: {
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
        testingFrameworks?: string[];
      };
      backendTechnologies?: {
        frameworks?: string[];
        databases?: string[];
        messageQueues?: string[];
        caching?: string[];
        apiDesign?: string[];
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
        mobile?: string[];
        dataEngineering?: string[];
      };
      technicalDepthAssessment?: string;
      emergingTechAdoption?: string;
    };
    leadershipCapabilities?: {
      technicalLeadership?: {
        architecturalDecisions?: string;
        codeReviewAndMentoring?: string;
        technicalVision?: string;
      };
      teamLeadership?: {
        teamSize?: string;
        projectManagement?: string;
        crossFunctionalCollaboration?: string;
        conflictResolution?: string;
      };
      strategicLeadership?: {
        businessAlignment?: string;
        stakeholderManagement?: string;
        changeManagement?: string;
        innovationDriving?: string;
      };
      leadershipStyle?: string;
      leadershipPotential?: string;
    };
    personalityTraits?: {
      problemSolvingApproach?: string;
      communicationStyle?: string;
      workStyle?: string;
      adaptability?: string;
      initiativeTaking?: string;
      attentionToDetail?: string;
      continuousLearning?: string;
      stressHandling?: string;
      teamOrientation?: string;
      innovationMindset?: string;
    };
    careerPotential?: {
      currentLevel?: string;
      experienceProgression?: string;
      nextCareerSteps?: string[];
      leadershipReadiness?: number;
      specialistVsGeneralist?: string;
      marketValue?: string;
      growthTrajectory?: string;
      competitiveAdvantages?: string[];
      developmentAreas?: string[];
      salaryProgression?: string;
    };
    professionalSummary?: {
      yearsOfExperience?: string;
      seniorityLevel?: string;
      industryFocus?: string[];
      specializations?: string[];
      careerTrajectory?: string;
      currentRole?: string;
      uniqueValueProposition?: string;
    };
    workExperience?: Array<{
      title?: string;
      company?: string;
      duration?: string;
      responsibilities?: string[];
      achievements?: string[];
      technologies?: string[];
      teamSize?: string;
      impact?: string;
    }>;
    projects?: Array<{
      name?: string;
      description?: string;
      technologies?: string[];
      role?: string;
      impact?: string;
      challenges?: string;
      learnings?: string;
    }>;
    education?: {
      formal?: Array<{
        degree?: string;
        institution?: string;
        year?: string;
        relevantCourses?: string[];
        thesis?: string;
      }>;
      certifications?: string[];
      continuousLearning?: string[];
      professionalDevelopment?: string[];
    };
    marketPositioning?: {
      uniqueValueProposition?: string;
      competitiveAdvantages?: string[];
      targetRoles?: string[];
      salaryBenchmarks?: {
        stockholm?: string;
        gothenburg?: string;
        malmo?: string;
        remote?: string;
      };
      hourlyRateEstimate?: {
        min: number;
        max: number;
        recommended: number;
        currency: string;
      };
      marketReadiness?: number;
      competitiveness?: string;
      demandLevel?: string;
      growthPotential?: string;
    };
    consultingReadiness?: {
      independentWorkAbility?: string;
      clientCommunication?: string;
      problemSolvingInNewEnvironments?: string;
      adaptabilityToClientCultures?: string;
      businessAcumen?: string;
      deliveryFocus?: string;
      consultingExperience?: string;
    };
    // Legacy properties for backward compatibility
    experience?: string;
    seniorityLevel?: string;
    strengths?: string[];
    marketPosition?: string;
    technicalDepth?: string;
    improvementAreas?: string[];
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
  technicalAnalysis?: {
    matchedSkills: string[];
    unmatchedSkills: string[];
    technicalDepth: string;
    skillMatchPercentage: number;
    experienceLevel: string;
    certifications: string[];
    learningRecommendations: string[];
  };
  personalityAnalysis?: {
    workStyleCompatibility: number;
    communicationAlignment: number;
    teamFitScore: number;
    leadershipPotential: number;
    adaptabilityScore: number;
    personalityTraits: string[];
    workStyle: string;
    communicationStyle: string;
    culturalValues: string[];
    strengthsForRole: string[];
  };
  industryAnalysis?: {
    industryExperience: boolean;
    industryKnowledgeScore: number;
    relevantProjects: number;
    industrySpecificSkills: string[];
    marketUnderstanding: number;
    clientTypeExperience: string[];
    regulatoryKnowledge: string;
  };
  projectMetrics?: {
    successRate: string;
    completedProjects: number;
    averageProjectDuration: string;
    clientSatisfactionScore: string;
    repeatClientRate: string;
    timeToProductivity: string;
    budgetAccuracy: string;
    deliveryTimeliness: string;
  };
}
