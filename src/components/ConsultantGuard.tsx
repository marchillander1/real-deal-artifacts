import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface ConsultantGuardProps {
  children: React.ReactNode;
}

export const ConsultantGuard: React.FC<ConsultantGuardProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const [isConsultant, setIsConsultant] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserType = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data: consultant } = await supabase
          .from('consultants')
          .select('id')
          .eq('user_id', user.id)
          .single();

        setIsConsultant(!!consultant);
      } catch (error) {
        setIsConsultant(false);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      checkUserType();
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return <div>Loading...</div>;
  }

  // Allow access to auth page and public pages for everyone
  const publicPaths = ['/auth', '/', '/landing', '/how-it-works', '/cv-upload', '/cv-upload-new'];
  if (publicPaths.includes(location.pathname)) {
    return <>{children}</>;
  }

  // If user is a consultant, only allow access to /my-profile
  if (isConsultant && location.pathname !== '/my-profile') {
    return <Navigate to="/my-profile" replace />;
  }

  // If user is not a consultant but tries to access /my-profile, redirect to dashboard
  if (!isConsultant && location.pathname === '/my-profile') {
    return <Navigate to="/matchwiseai" replace />;
  }

  return <>{children}</>;
};