
import { useState, useEffect } from 'react';
import { Consultant } from '@/types/consultant';
import { demoConsultants } from '@/data/demoConsultants';

export const useDemoConsultants = () => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time to make it feel realistic
    const timer = setTimeout(() => {
      setConsultants(demoConsultants);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const updateConsultant = (updatedConsultant: Consultant) => {
    setConsultants(prev => 
      prev.map(consultant => 
        consultant.id === updatedConsultant.id ? updatedConsultant : consultant
      )
    );
  };

  return {
    consultants,
    isLoading,
    updateConsultant
  };
};
