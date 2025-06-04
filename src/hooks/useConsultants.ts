
import { useState, useEffect } from 'react';
import { Consultant } from '../types/consultant';

const initialConsultants: Consultant[] = [
  {
    id: 1,
    name: 'Anna Lindqvist',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL', 'GraphQL', 'Docker'],
    experience: '8 years',
    roles: ['Senior Frontend Developer', 'Full-Stack Architect'],
    location: 'Stockholm',
    rate: '950 SEK/hour',
    availability: 'Available',
    phone: '+46 70 123 4567',
    email: 'anna.lindqvist@email.com',
    projects: 23,
    rating: 4.9,
    lastActive: '2 hours ago',
    cv: 'Senior developer with expertise in modern web technologies, led 15+ projects for Fortune 500 companies...',
    certifications: ['AWS Certified', 'React Advanced'],
    languages: ['Swedish', 'English', 'German'],
    type: 'existing'
  },
  {
    id: 2,
    name: 'Erik Johansson',
    skills: ['Python', 'Django', 'Docker', 'Kubernetes', 'GCP', 'Terraform', 'Jenkins', 'MongoDB'],
    experience: '10 years',
    roles: ['Senior DevOps Engineer', 'Cloud Architect'],
    location: 'Göteborg',
    rate: '1100 SEK/hour',
    availability: 'Available',
    phone: '+46 70 234 5678',
    email: 'erik.johansson@email.com',
    projects: 31,
    rating: 4.8,
    lastActive: '1 hour ago',
    cv: 'Experienced DevOps specialist with 10+ years in cloud infrastructure and automation...',
    certifications: ['GCP Professional', 'Kubernetes Certified'],
    languages: ['Swedish', 'English'],
    type: 'existing'
  },
  {
    id: 3,
    name: 'Maria Andersson',
    skills: ['Java', 'Spring Boot', 'Microservices', 'Azure', 'MongoDB', 'Kafka', 'Redis'],
    experience: '12 years',
    roles: ['Tech Lead', 'Enterprise Architect'],
    location: 'Malmö',
    rate: '1200 SEK/hour',
    availability: 'Partially Available',
    phone: '+46 70 345 6789',
    email: 'maria.andersson@email.com',
    projects: 45,
    rating: 5.0,
    lastActive: '30 minutes ago',
    cv: 'Technical lead with extensive experience in enterprise solutions and team leadership...',
    certifications: ['Java Expert', 'Azure Solutions Architect'],
    languages: ['Swedish', 'English', 'Spanish'],
    type: 'existing'
  },
  {
    id: 4,
    name: 'Johan Nilsson',
    skills: ['Angular', 'Vue.js', 'JavaScript', 'SASS', 'Figma', 'UX Design'],
    experience: '6 years',
    roles: ['Frontend Developer', 'UX Designer'],
    location: 'Stockholm',
    rate: '850 SEK/hour',
    availability: 'Available',
    phone: '+46 70 456 7890',
    email: 'johan.nilsson@email.com',
    projects: 18,
    rating: 4.7,
    lastActive: '4 hours ago',
    cv: 'Creative frontend developer with strong UX background...',
    certifications: ['Adobe Certified', 'Google UX Design'],
    languages: ['Swedish', 'English'],
    type: 'existing'
  }
];

export const useConsultants = () => {
  const [consultants, setConsultants] = useState<Consultant[]>(initialConsultants);

  useEffect(() => {
    const uploadedConsultants = JSON.parse(localStorage.getItem('uploadedConsultants') || '[]');
    if (uploadedConsultants.length > 0) {
      const newConsultants = uploadedConsultants.map((consultant: any) => ({ ...consultant, type: 'new' }));
      setConsultants(prev => [...prev, ...newConsultants]);
    }
  }, []);

  const addConsultant = (consultant: Consultant) => {
    setConsultants(prev => [...prev, consultant]);
  };

  const existingConsultants = consultants.filter(c => c.type === 'existing');
  const newConsultants = consultants.filter(c => c.type === 'new');

  return {
    consultants,
    existingConsultants,
    newConsultants,
    addConsultant
  };
};
