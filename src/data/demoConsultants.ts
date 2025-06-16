
import { Consultant } from '@/types/consultant';

export const demoConsultants: Consultant[] = [
  {
    id: 1,
    name: "Erik Andersson",
    email: "erik.andersson@example.com",
    phone: "+46 70 123 4567",
    skills: ["React", "TypeScript", "Node.js", "AWS", "GraphQL"],
    experience: 8,
    hourlyRate: 950,
    availability: "available",
    location: "Stockholm",
    type: "existing",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    bio: "Senior Full-Stack Developer with expertise in React and Node.js",
    linkedinUrl: "https://linkedin.com/in/erik-andersson",
    portfolioUrl: "https://erikandersson.dev",
    languages: ["Swedish", "English"],
    cvAnalysis: {
      personalInfo: {
        name: "Erik Andersson",
        email: "erik.andersson@example.com",
        phone: "+46 70 123 4567",
        location: "Stockholm, Sweden",
        linkedinProfile: "https://linkedin.com/in/erik-andersson",
        githubProfile: "https://github.com/erikandersson",
        portfolio: "https://erikandersson.dev",
        languages: ["Swedish", "English", "German"]
      },
      technicalSkillsAnalysis: {
        primarySkills: ["React", "TypeScript", "Node.js"],
        secondarySkills: ["AWS", "GraphQL", "Docker"],
        frameworks: ["React", "Express.js", "Next.js"],
        databases: ["PostgreSQL", "MongoDB", "Redis"],
        tools: ["Git", "Docker", "Kubernetes", "Jenkins"],
        certifications: ["AWS Solutions Architect", "React Certified Developer"],
        skillLevel: "Senior",
        yearsOfExperience: 8
      },
      workExperience: [
        {
          company: "Tech Solutions AB",
          position: "Senior Full-Stack Developer",
          duration: "2019-2024",
          responsibilities: ["Led development of React applications", "Mentored junior developers"],
          technologies: ["React", "Node.js", "AWS"]
        }
      ],
      education: [
        {
          institution: "KTH Royal Institute of Technology",
          degree: "Master of Science in Computer Science",
          year: "2016",
          gpa: "4.2/5.0"
        }
      ],
      projects: [
        {
          name: "E-commerce Platform",
          description: "Built scalable e-commerce solution",
          technologies: ["React", "Node.js", "PostgreSQL"],
          role: "Lead Developer"
        }
      ],
      softSkills: ["Leadership", "Problem-solving", "Communication", "Team collaboration"],
      personalityTraits: {
        communicationStyle: "Direct and collaborative",
        workStyle: "Agile-focused with strong problem-solving",
        teamFit: 4.8,
        adaptability: 4.6,
        leadership: 4.2
      },
      improvementAreas: ["DevOps automation", "Cloud architecture patterns"]
    }
  },
  {
    id: 2,
    name: "Maria Lindqvist",
    email: "maria.lindqvist@example.com",
    phone: "+46 70 234 5678",
    skills: ["Vue.js", "JavaScript", "CSS", "Figma", "UX Design"],
    experience: 6,
    hourlyRate: 850,
    availability: "partially_available",
    location: "Göteborg",
    type: "existing",
    profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b765?w=150&h=150&fit=crop&crop=face",
    bio: "Senior Frontend Developer with strong UX focus",
    linkedinUrl: "https://linkedin.com/in/maria-lindqvist",
    portfolioUrl: "https://marialindqvist.design",
    languages: ["Swedish", "English", "Danish"],
    cvAnalysis: {
      personalInfo: {
        name: "Maria Lindqvist",
        email: "maria.lindqvist@example.com",
        phone: "+46 70 234 5678",
        location: "Göteborg, Sweden",
        linkedinProfile: "https://linkedin.com/in/maria-lindqvist",
        portfolio: "https://marialindqvist.design",
        languages: ["Swedish", "English", "Danish"]
      },
      technicalSkillsAnalysis: {
        primarySkills: ["Vue.js", "JavaScript", "CSS"],
        secondarySkills: ["Figma", "Adobe XD", "Sass"],
        frameworks: ["Vue.js", "Nuxt.js", "Vuetify"],
        tools: ["Figma", "Adobe Creative Suite", "Git", "Webpack"],
        skillLevel: "Senior",
        yearsOfExperience: 6
      },
      workExperience: [
        {
          company: "Design Studio Nordic",
          position: "Senior Frontend Developer",
          duration: "2018-2024",
          responsibilities: ["UI/UX design and development", "Client consultation"],
          technologies: ["Vue.js", "CSS", "Figma"]
        }
      ],
      education: [
        {
          institution: "Chalmers University of Technology",
          degree: "Bachelor in Interaction Design",
          year: "2018"
        }
      ],
      softSkills: ["Creative thinking", "User empathy", "Detail-oriented", "Client communication"],
      personalityTraits: {
        communicationStyle: "Diplomatic and detail-oriented",
        workStyle: "Design-focused with user-centric approach",
        teamFit: 4.3,
        adaptability: 4.5,
        leadership: 3.8
      },
      improvementAreas: ["Backend development", "Mobile app development"]
    }
  },
  {
    id: 3,
    name: "Johan Svensson",
    email: "johan.svensson@example.com",
    phone: "+46 70 345 6789",
    skills: ["Python", "Django", "PostgreSQL", "Docker", "AWS"],
    experience: 10,
    hourlyRate: 1100,
    availability: "available",
    location: "Malmö",
    type: "existing",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    bio: "Backend specialist with extensive Python and cloud experience",
    linkedinUrl: "https://linkedin.com/in/johan-svensson",
    githubUrl: "https://github.com/johansvensson",
    languages: ["Swedish", "English"],
    cvAnalysis: {
      personalInfo: {
        name: "Johan Svensson",
        email: "johan.svensson@example.com",
        phone: "+46 70 345 6789",
        location: "Malmö, Sweden",
        linkedinProfile: "https://linkedin.com/in/johan-svensson",
        githubProfile: "https://github.com/johansvensson",
        languages: ["Swedish", "English"]
      },
      technicalSkillsAnalysis: {
        primarySkills: ["Python", "Django", "PostgreSQL"],
        secondarySkills: ["Docker", "AWS", "Redis"],
        frameworks: ["Django", "FastAPI", "Flask"],
        databases: ["PostgreSQL", "MongoDB", "Redis"],
        tools: ["Docker", "Kubernetes", "Git", "Jenkins"],
        certifications: ["AWS Solutions Architect Professional"],
        skillLevel: "Expert",
        yearsOfExperience: 10
      },
      workExperience: [
        {
          company: "CloudTech Solutions",
          position: "Senior Backend Developer",
          duration: "2014-2024",
          responsibilities: ["System architecture", "Performance optimization"],
          technologies: ["Python", "Django", "AWS"]
        }
      ],
      education: [
        {
          institution: "Lund University",
          degree: "Master of Science in Computer Science",
          year: "2014"
        }
      ],
      softSkills: ["System thinking", "Performance optimization", "Mentoring", "Architecture design"],
      personalityTraits: {
        communicationStyle: "Technical and precise",
        workStyle: "Architecture-focused with performance mindset",
        teamFit: 4.6,
        adaptability: 4.4,
        leadership: 4.7
      },
      improvementAreas: ["Frontend frameworks", "Mobile development"]
    }
  }
];
