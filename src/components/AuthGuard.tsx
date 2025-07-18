import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const [userType, setUserType] = useState<'consultant' | 'business' | 'admin' | null>(null);
  const [permissions, setPermissions] = useState<{
    access_matchwiseai: boolean;
    access_talent_activation: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserTypeAndPermissions = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Check if user is consultant
        const { data: consultant } = await supabase
          .from('consultants')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (consultant) {
          setUserType('consultant');
          setLoading(false);
          return;
        }

        // Check if user is admin
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profile?.role === 'admin') {
          setUserType('admin');
          setLoading(false);
          return;
        }

        // Check user permissions from user_management
        const { data: userMgmt } = await supabase
          .from('user_management')
          .select('access_matchwiseai, access_talent_activation')
          .eq('email', user.email)
          .single();

        if (userMgmt) {
          setUserType('business');
          setPermissions({
            access_matchwiseai: userMgmt.access_matchwiseai || false,
            access_talent_activation: userMgmt.access_talent_activation || false
          });
        } else {
          setUserType('business');
          setPermissions({
            access_matchwiseai: false,
            access_talent_activation: false
          });
        }
      } catch (error) {
        console.error('Error checking user type:', error);
        setUserType('business');
        setPermissions({
          access_matchwiseai: false,
          access_talent_activation: false
        });
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      checkUserTypeAndPermissions();
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return <div>Loading...</div>;
  }

  // Allow access to public pages for everyone
  const publicPaths = ['/auth', '/', '/landing', '/how-it-works', '/cv-upload', '/cv-upload-new'];
  if (publicPaths.includes(location.pathname)) {
    return <>{children}</>;
  }

  // If user is a consultant, only allow access to /my-profile
  if (userType === 'consultant' && location.pathname !== '/my-profile') {
    return <Navigate to="/my-profile" replace />;
  }

  // If user tries to access /my-profile but is not a consultant, redirect them
  if (userType !== 'consultant' && location.pathname === '/my-profile') {
    if (userType === 'admin') {
      return <Navigate to="/admin" replace />;
    } else {
      // Business user - redirect to their allowed service
      if (permissions?.access_matchwiseai) {
        return <Navigate to="/matchwiseai" replace />;
      } else if (permissions?.access_talent_activation) {
        return <Navigate to="/talent-activation" replace />;
      } else {
        return <Navigate to="/auth" replace />;
      }
    }
  }

  // Check business user permissions
  if (userType === 'business') {
    if (location.pathname === '/matchwiseai' && !permissions?.access_matchwiseai) {
      if (permissions?.access_talent_activation) {
        return <Navigate to="/talent-activation" replace />;
      } else {
        return <Navigate to="/auth" replace />;
      }
    }

    if (location.pathname === '/talent-activation' && !permissions?.access_talent_activation) {
      if (permissions?.access_matchwiseai) {
        return <Navigate to="/matchwiseai" replace />;
      } else {
        return <Navigate to="/auth" replace />;
      }
    }
  }

  // Admin access
  if (userType === 'admin' && location.pathname === '/admin') {
    return <>{children}</>;
  }

  return <>{children}</>;
};