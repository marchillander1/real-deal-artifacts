
import React from 'react';
import Dashboard from '../components/Dashboard';
import { Consultant, Assignment } from '../types/consultant';

const DashboardPage = () => {
  // Mock data for now - will be replaced with real data from Supabase
  const mockConsultants: Consultant[] = [
    {
      id: 1,
      name: 'Anna Lindqvist',
      email: 'anna@example.com',
      skills: ['React', 'TypeScript', 'Node.js'],
      experience: '5 years',
      availability: 'Available',
      roles: ['Senior Frontend Developer'],
      location: 'Stockholm',
      rate: '950 SEK/hour',
      phone: '+46 70 123 4567',
      projects: 23,
      rating: 4.8,
      lastActive: '2 hours ago',
      cv: 'Experienced frontend developer with strong leadership skills and passion for clean code.',
      certifications: ['AWS Certified', 'React Advanced'],
      languages: ['Swedish', 'English', 'German'],
      type: 'existing',
      communicationStyle: 'Direct and collaborative',
      workStyle: 'Agile and iterative',
      values: ['Innovation', 'Quality', 'Teamwork', 'Continuous Learning'],
      personalityTraits: ['Analytical', 'Creative', 'Leadership-oriented', 'Detail-focused'],
      teamFit: 'Excellent mentor and team player',
      culturalFit: 4.8,
      adaptability: 4.7,
      leadership: 4.9
    },
    {
      id: 2,
      name: 'Marcus Johansson',
      email: 'marcus@example.com',
      skills: ['UX Design', 'Figma', 'User Research'],
      experience: '3 years',
      availability: 'Available',
      roles: ['UX Designer', 'Design Lead'],
      location: 'Gothenburg',
      rate: '750 SEK/hour',
      phone: '+46 70 234 5678',
      projects: 15,
      rating: 4.6,
      lastActive: '1 day ago',
      cv: 'Creative UX designer with strong user empathy and business understanding.',
      certifications: ['Google UX Certificate', 'Design Thinking'],
      languages: ['Swedish', 'English', 'Spanish'],
      type: 'existing',
      communicationStyle: 'Empathetic and visual',
      workStyle: 'User-centered and iterative',
      values: ['User Experience', 'Creativity', 'Empathy', 'Innovation'],
      personalityTraits: ['Creative', 'Empathetic', 'Detail-oriented', 'Collaborative'],
      teamFit: 'Bridge between tech and business',
      culturalFit: 4.9,
      adaptability: 4.8,
      leadership: 4.4
    }
  ];

  const mockAssignments: Assignment[] = [
    {
      id: 1,
      title: 'React Developer',
      description: 'Frontend developer for e-commerce project',
      requiredSkills: ['React', 'TypeScript'],
      duration: '6 months',
      startDate: '2024-07-01',
      workload: 'Full-time',
      budget: '800-1000 SEK/hour',
      company: 'TechCorp AB',
      industry: 'E-commerce',
      teamSize: '8 people',
      remote: 'Hybrid',
      urgency: 'Medium',
      clientLogo: '🛍️',
      desiredCommunicationStyle: 'Collaborative and direct',
      teamCulture: 'Agile, innovation-focused',
      requiredValues: ['Innovation', 'Quality'],
      leadershipLevel: 3,
      teamDynamics: 'Cross-functional team'
    },
    {
      id: 2,
      title: 'UX Designer',
      description: 'Design user-friendly mobile app',
      requiredSkills: ['UX Design', 'Prototyping'],
      duration: '3 months',
      startDate: '2024-06-15',
      workload: 'Part-time',
      budget: '600-800 SEK/hour',
      company: 'DesignStudio',
      industry: 'Mobile Apps',
      teamSize: '5 people',
      remote: 'Remote',
      urgency: 'High',
      clientLogo: '🎨',
      desiredCommunicationStyle: 'Creative and collaborative',
      teamCulture: 'Design-focused, flexible',
      requiredValues: ['Creativity', 'User Focus'],
      leadershipLevel: 2,
      teamDynamics: 'Small design team'
    }
  ];

  const handleMatch = (assignment: Assignment) => {
    console.log('Matching assignment:', assignment);
    // TODO: Implement actual matching logic with Supabase
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File uploaded:', event.target.files?.[0]);
    // TODO: Implement CV upload with Supabase
  };

  const handleAssignmentCreated = (assignment: Assignment) => {
    console.log('Assignment created:', assignment);
    // TODO: Save to Supabase database
  };

  return (
    <Dashboard
      consultants={mockConsultants}
      assignments={mockAssignments}
      onMatch={handleMatch}
      onFileUpload={handleFileUpload}
      onAssignmentCreated={handleAssignmentCreated}
    />
  );
};

export default DashboardPage;
