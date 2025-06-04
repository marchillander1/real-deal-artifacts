
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

export const useConsultants = () => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load consultants from localStorage and merge with initial consultants
  useEffect(() => {
    const uploadedConsultants = JSON.parse(localStorage.getItem('uploadedConsultants') || '[]');
    const allConsultants = [...initialConsultants, ...uploadedConsultants];
    setConsultants(allConsultants);
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
