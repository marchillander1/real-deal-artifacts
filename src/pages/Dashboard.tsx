
import React from 'react';
import Dashboard from '../components/Dashboard';
import { Consultant, Assignment } from '../types/consultant';

const DashboardPage = () => {
  // Mock data for now - will be replaced with real data from Supabase
  const mockConsultants: Consultant[] = [
    {
      id: '1',
      name: 'Anna Lindqvist',
      email: 'anna@example.com',
      skills: ['React', 'TypeScript', 'Node.js'],
      experience: 5,
      availability: 'available',
      personality: 'analytical'
    },
    {
      id: '2',
      name: 'Marcus Johansson',
      email: 'marcus@example.com',
      skills: ['UX Design', 'Figma', 'User Research'],
      experience: 3,
      availability: 'available',
      personality: 'creative'
    }
  ];

  const mockAssignments: Assignment[] = [
    {
      id: '1',
      title: 'React Developer',
      description: 'Frontend utvecklare för e-commerce projekt',
      skills: ['React', 'TypeScript'],
      duration: '6 månader',
      location: 'Stockholm',
      startDate: '2024-07-01',
      client: 'TechCorp AB'
    },
    {
      id: '2',
      title: 'UX Designer',
      description: 'Designa användarvänlig mobilapp',
      skills: ['UX Design', 'Prototyping'],
      duration: '3 månader',
      location: 'Göteborg',
      startDate: '2024-06-15',
      client: 'DesignStudio'
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
