
import { useState, useEffect } from 'react';
import { Assignment } from '@/types/consultant';
import { demoAssignments } from '@/data/demoAssignments';

export const useDemoAssignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time to make it feel realistic
    const timer = setTimeout(() => {
      setAssignments(demoAssignments);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const addAssignment = (newAssignment: Assignment) => {
    setAssignments(prev => [...prev, newAssignment]);
  };

  return {
    assignments,
    isLoading,
    addAssignment
  };
};
