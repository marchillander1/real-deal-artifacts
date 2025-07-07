
import { Consultant } from '@/types/consultant';

export const demoConsultants: Consultant[] = [
  {
    id: 'demo-network-1',
    name: 'Erik Lundberg',
    email: 'erik.lundberg@example.com',
    phone: '+46 70 123 4567',
    location: 'Stockholm, Sweden',
    skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'GraphQL'],
    certifications: ['AWS Solutions Architect', 'React Professional'],
    languages: ['Swedish', 'English'],
    roles: ['Frontend Developer', 'Full Stack Developer'],
    values: ['Innovation', 'Quality', 'Teamwork'],
    experience: '8 years experience',
    rating: 4.8,
    projects: 45,
    rate: '850 SEK/h',
    availability: 'Available',
    lastActive: 'Today',
    communicationStyle: 'Professional',
    workStyle: 'Collaborative',
    personalityTraits: ['Analytical', 'Creative', 'Team Player'],
    teamFit: '4.5',
    adaptability: 4,
    leadership: 3,
    type: 'network',
    title: 'Senior Frontend Developer',
    // Add AI analysis data for network consultant
    cvAnalysis: {
      personalInfo: {
        name: 'Erik Lundberg',
        email: 'erik.lundberg@example.com',
        phone: '+46 70 123 4567',
        location: 'Stockholm, Sweden'
      },
      skills: {
        technical: ['React', 'TypeScript', 'Node.js', 'AWS', 'GraphQL', 'JavaScript', 'CSS', 'HTML'],
        soft: ['Team Leadership', 'Problem Solving', 'Communication', 'Mentoring']
      },
      experience: {
        totalYears: 8,
        roles: [
          {
            title: 'Senior Frontend Developer',
            company: 'TechCorp AB',
            duration: '3 years',
            description: 'Led frontend development for large-scale React applications'
          },
          {
            title: 'Full Stack Developer',
            company: 'StartupLab',
            duration: '2 years',
            description: 'Built complete web applications using modern JavaScript stack'
          }
        ]
      },
      marketValue: {
        currentRate: 850,
        recommendedRate: 950,
        marketPosition: 'Senior Level'
      },
      certifications: ['AWS Solutions Architect', 'React Professional', 'TypeScript Expert'],
      strengthAreas: ['Frontend Architecture', 'React Ecosystem', 'TypeScript', 'Team Leadership'],
      improvementAreas: ['Backend Systems', 'DevOps', 'Mobile Development'],
      careerRecommendations: [
        'Consider AWS certification to increase cloud expertise',
        'Explore React Native for mobile development',
        'Build thought leadership through technical writing'
      ]
    },
    linkedinAnalysis: {
      profileStrength: 85,
      connectionCount: 500,
      engagementLevel: 'High',
      thoughtLeadership: 'Active',
      endorsements: 45,
      recommendations: 12
    }
  },
  {
    id: 'demo-network-2',
    name: 'Anna Karlsson',
    email: 'anna.karlsson@example.com',
    phone: '+46 70 987 6543',
    location: 'Gothenburg, Sweden',
    skills: ['Python', 'Django', 'PostgreSQL', 'Docker', 'Kubernetes'],
    certifications: ['AWS Certified Developer', 'Kubernetes Administrator'],
    languages: ['Swedish', 'English', 'German'],
    roles: ['Backend Developer', 'DevOps Engineer'],
    values: ['Security', 'Reliability', 'Innovation'],
    experience: '6 years experience',
    rating: 4.7,
    projects: 32,
    rate: '800 SEK/h',
    availability: 'Available from March',
    lastActive: 'Yesterday',
    communicationStyle: 'Technical',
    workStyle: 'Independent',
    personalityTraits: ['Detail-oriented', 'Systematic', 'Problem Solver'],
    teamFit: '4.2',
    adaptability: 5,
    leadership: 4,
    type: 'network',
    title: 'Senior Backend Developer',
    // Add AI analysis data for network consultant
    cvAnalysis: {
      personalInfo: {
        name: 'Anna Karlsson',
        email: 'anna.karlsson@example.com',
        phone: '+46 70 987 6543',
        location: 'Gothenburg, Sweden'
      },
      skills: {
        technical: ['Python', 'Django', 'PostgreSQL', 'Docker', 'Kubernetes', 'Redis', 'Celery'],
        soft: ['System Design', 'Code Review', 'Mentoring', 'Technical Writing']
      },
      experience: {
        totalYears: 6,
        roles: [
          {
            title: 'Senior Backend Developer',
            company: 'CloudTech Solutions',
            duration: '2.5 years',
            description: 'Designed and implemented scalable backend systems'
          },
          {
            title: 'DevOps Engineer',
            company: 'DataFlow AB',
            duration: '2 years',
            description: 'Managed cloud infrastructure and CI/CD pipelines'
          }
        ]
      },
      marketValue: {
        currentRate: 800,
        recommendedRate: 900,
        marketPosition: 'Senior Level'
      },
      certifications: ['AWS Certified Developer', 'Kubernetes Administrator', 'Docker Certified'],
      strengthAreas: ['Backend Architecture', 'Cloud Infrastructure', 'Database Design', 'DevOps'],
      improvementAreas: ['Frontend Technologies', 'Machine Learning', 'Microservices'],
      careerRecommendations: [
        'Explore microservices architecture patterns',
        'Consider machine learning integration',
        'Build expertise in cloud-native technologies'
      ]
    },
    linkedinAnalysis: {
      profileStrength: 78,
      connectionCount: 350,
      engagementLevel: 'Medium',
      thoughtLeadership: 'Occasional',
      endorsements: 32,
      recommendations: 8
    }
  }
];
