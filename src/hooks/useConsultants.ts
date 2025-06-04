
import { useState, useEffect } from 'react';
import { Consultant } from '../types/consultant';

const initialConsultants: Consultant[] = [
  {
    id: 1,
    name: "Anna Andersson",
    skills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS", "Docker"],
    experience: "8 years",
    roles: ["Senior Frontend Developer", "Tech Lead"],
    location: "Stockholm",
    rate: "950 SEK/hour",
    availability: "Available now",
    phone: "+46 70 123 4567",
    email: "anna.andersson@email.com",
    projects: 23,
    rating: 4.9,
    lastActive: "2 hours ago",
    cv: "Experienced frontend developer with strong leadership skills and passion for clean code.",
    certifications: ["AWS Certified", "React Advanced"],
    languages: ["Swedish", "English", "German"],
    type: 'existing',
    communicationStyle: "Direct and collaborative",
    workStyle: "Agile and iterative",
    values: ["Innovation", "Quality", "Teamwork", "Continuous Learning"],
    personalityTraits: ["Analytical", "Creative", "Leadership-oriented", "Detail-focused"],
    teamFit: "Excellent mentor and team player",
    culturalFit: 4.8,
    adaptability: 4.7,
    leadership: 4.9
  },
  {
    id: 2,
    name: "Erik Johansson",
    skills: ["Python", "Django", "PostgreSQL", "Redis", "Kubernetes", "Machine Learning"],
    experience: "6 years",
    roles: ["Backend Developer", "DevOps Engineer"],
    location: "Göteborg",
    rate: "850 SEK/hour",
    availability: "From March 1st",
    phone: "+46 70 234 5678",
    email: "erik.johansson@email.com",
    projects: 18,
    rating: 4.7,
    lastActive: "1 day ago",
    cv: "Backend specialist with deep expertise in scalable systems and cloud architecture.",
    certifications: ["Kubernetes Administrator", "Python Expert"],
    languages: ["Swedish", "English"],
    type: 'existing',
    communicationStyle: "Analytical and thoughtful",
    workStyle: "Structured and methodical",
    values: ["Reliability", "Technical Excellence", "Problem Solving", "Innovation"],
    personalityTraits: ["Logical", "Patient", "Systematic", "Collaborative"],
    teamFit: "Strong technical contributor",
    culturalFit: 4.5,
    adaptability: 4.6,
    leadership: 4.2
  },
  {
    id: 3,
    name: "Maria Nilsson",
    skills: ["UX/UI Design", "Figma", "Adobe Creative Suite", "Prototyping", "User Research"],
    experience: "5 years",
    roles: ["UX Designer", "Design Lead"],
    location: "Malmö",
    rate: "750 SEK/hour",
    availability: "Available now",
    phone: "+46 70 345 6789",
    email: "maria.nilsson@email.com",
    projects: 15,
    rating: 4.8,
    lastActive: "3 hours ago",
    cv: "Creative UX designer with strong user empathy and business understanding.",
    certifications: ["Google UX Certificate", "Design Thinking"],
    languages: ["Swedish", "English", "Spanish"],
    type: 'existing',
    communicationStyle: "Empathetic and visual",
    workStyle: "User-centered and iterative",
    values: ["User Experience", "Creativity", "Empathy", "Innovation"],
    personalityTraits: ["Creative", "Empathetic", "Detail-oriented", "Collaborative"],
    teamFit: "Bridge between tech and business",
    culturalFit: 4.9,
    adaptability: 4.8,
    leadership: 4.4
  }
];

const demoUploadedConsultants: Consultant[] = [
  {
    id: 1001,
    name: "Lars Svensson",
    skills: ["Python", "FastAPI", "PostgreSQL", "Docker", "AWS"],
    experience: "4 years",
    roles: ["Backend Developer"],
    location: "Uppsala",
    rate: "700-850 SEK/hour",
    availability: "Available in 3 weeks",
    phone: "+46 70 456 7890",
    email: "lars.svensson@email.com",
    projects: 12,
    rating: 4.3,
    lastActive: "CV uploaded",
    cv: "Experienced backend developer with focus on API development and cloud solutions.",
    certifications: ["AWS Solutions Architect"],
    languages: ["Swedish", "English"],
    type: 'new',
    communicationStyle: "Clear and structured",
    workStyle: "Detail-oriented and systematic",
    values: ["Quality", "Technical Excellence", "Reliability"],
    personalityTraits: ["Analytical", "Thorough", "Team-oriented"],
    teamFit: "Strong backend contributor",
    culturalFit: 4.1,
    adaptability: 4.3,
    leadership: 3.9
  },
  {
    id: 1002,
    name: "Emma Lindström",
    skills: ["Vue.js", "JavaScript", "Sass", "Webpack", "Jest"],
    experience: "3 years",
    roles: ["Frontend Developer"],
    location: "Helsingborg",
    rate: "600-750 SEK/hour",
    availability: "Available now",
    phone: "+46 70 567 8901",
    email: "emma.lindstrom@email.com",
    projects: 8,
    rating: 4.1,
    lastActive: "CV uploaded",
    cv: "Frontend developer with strong design sense and modern framework expertise.",
    certifications: ["Vue.js Certification"],
    languages: ["Swedish", "English", "French"],
    type: 'new',
    communicationStyle: "Creative and collaborative",
    workStyle: "Agile and user-focused",
    values: ["Innovation", "User Experience", "Learning"],
    personalityTraits: ["Creative", "Adaptable", "Communicative"],
    teamFit: "Great UI/UX collaborator",
    culturalFit: 4.4,
    adaptability: 4.6,
    leadership: 3.7
  },
  {
    id: 1003,
    name: "David Karlsson",
    skills: ["DevOps", "Kubernetes", "CI/CD", "Terraform", "Monitoring"],
    experience: "6 years",
    roles: ["DevOps Engineer"],
    location: "Lund",
    rate: "850-950 SEK/hour",
    availability: "From July 15th",
    phone: "+46 70 678 9012",
    email: "david.karlsson@email.com",
    projects: 16,
    rating: 4.6,
    lastActive: "CV uploaded",
    cv: "DevOps specialist with extensive experience in cloud infrastructure and automation.",
    certifications: ["Kubernetes Administrator", "Terraform Associate"],
    languages: ["Swedish", "English"],
    type: 'new',
    communicationStyle: "Technical and precise",
    workStyle: "Process-driven and efficient",
    values: ["Automation", "Reliability", "Continuous Improvement"],
    personalityTraits: ["Systematic", "Problem-solver", "Reliable"],
    teamFit: "Infrastructure backbone",
    culturalFit: 4.2,
    adaptability: 4.4,
    leadership: 4.1
  },
  {
    id: 1004,
    name: "Sofia Persson",
    skills: ["Product Management", "Agile", "Analytics", "Stakeholder Management"],
    experience: "5 years",
    roles: ["Product Manager"],
    location: "Växjö",
    rate: "800-1000 SEK/hour",
    availability: "Available now",
    phone: "+46 70 789 0123",
    email: "sofia.persson@email.com",
    projects: 11,
    rating: 4.5,
    lastActive: "CV uploaded",
    cv: "Product manager with strong analytical skills and stakeholder management experience.",
    certifications: ["Certified Scrum Product Owner", "Google Analytics"],
    languages: ["Swedish", "English", "Danish"],
    type: 'new',
    communicationStyle: "Strategic and engaging",
    workStyle: "Data-driven and collaborative",
    values: ["User Focus", "Innovation", "Results", "Teamwork"],
    personalityTraits: ["Strategic", "Communicative", "Results-oriented"],
    teamFit: "Bridge between business and tech",
    culturalFit: 4.7,
    adaptability: 4.8,
    leadership: 4.6
  }
];

export const useConsultants = () => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load consultants from localStorage and merge with initial consultants
  useEffect(() => {
    const existingUploaded = JSON.parse(localStorage.getItem('uploadedConsultants') || '[]');
    
    // If no uploaded consultants exist, add demo ones
    if (existingUploaded.length === 0) {
      localStorage.setItem('uploadedConsultants', JSON.stringify(demoUploadedConsultants));
      const allConsultants = [...initialConsultants, ...demoUploadedConsultants];
      setConsultants(allConsultants);
    } else {
      const allConsultants = [...initialConsultants, ...existingUploaded];
      setConsultants(allConsultants);
    }
  }, []);

  const uploadCV = async (file: File): Promise<void> => {
    setIsProcessing(true);
    
    try {
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate AI extraction results with human factors
      const newConsultant: Consultant = {
        id: Date.now(),
        name: file.name.replace('.pdf', '').replace(/[_-]/g, ' '),
        skills: ["JavaScript", "React", "Problem Solving", "Communication"],
        experience: "3-5 years",
        roles: ["Frontend Developer"],
        location: "Stockholm",
        rate: "600-800 SEK/hour",
        availability: "Available in 2 weeks",
        phone: "+46 70 XXX XXXX",
        email: "consultant@email.com",
        projects: Math.floor(Math.random() * 20) + 5,
        rating: 4.0 + Math.random() * 0.9,
        lastActive: "Just uploaded",
        cv: "Talented consultant with strong technical skills and excellent communication abilities.",
        certifications: ["React Certification"],
        languages: ["Swedish", "English"],
        type: 'new',
        communicationStyle: "Open and collaborative",
        workStyle: "Flexible and adaptive",
        values: ["Learning", "Quality", "Innovation", "Teamwork"],
        personalityTraits: ["Eager", "Collaborative", "Growth-minded", "Reliable"],
        teamFit: "Adaptable team member",
        culturalFit: 4.2,
        adaptability: 4.5,
        leadership: 3.8
      };
      
      // Update both state and localStorage
      setConsultants(prev => [...prev, newConsultant]);
      
      // Also save to localStorage so it persists
      const existingUploaded = JSON.parse(localStorage.getItem('uploadedConsultants') || '[]');
      existingUploaded.push(newConsultant);
      localStorage.setItem('uploadedConsultants', JSON.stringify(existingUploaded));
      
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    consultants,
    isProcessing,
    uploadCV
  };
};
