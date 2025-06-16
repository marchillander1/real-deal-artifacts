
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Consultant } from '@/types/consultant';

export const useSupabaseConsultants = () => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('consultants')
          .select('*')
          .order('rating', { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          // Filter and limit consultants to exactly what we want in demo
          const networkConsultants = data.filter(c => c.type === 'new').slice(0, 1); // Only 1 network consultant
          const myConsultants = data.filter(c => c.type === 'existing').slice(0, 5); // Only 5 my consultants
          
          const limitedConsultants = [...networkConsultants, ...myConsultants];
          setConsultants(limitedConsultants);
        }
      } catch (err) {
        console.error('Error fetching consultants:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConsultants();
  }, []);

  return { consultants, isLoading, error };
};
