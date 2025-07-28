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
    console.log('🔍 AuthGuard: Checking user type and permissions for:', user?.email);
    const checkUserTypeAndPermissions = async () => {
      if (!user) {
        console.log('🔍 AuthGuard: No user found');
        setLoading(false);
        return;
      }

      try {
        // Check if user is consultant
        console.log('🔍 AuthGuard: Checking consultant for user_id:', user.id);
        const { data: consultant, error: consultantError } = await supabase
          .from('consultants')
          .select('id')
          .eq('user_id', user.id)
          .limit(1)
          .maybeSingle();

        console.log('🔍 AuthGuard: Consultant query result:', { consultant, consultantError });
        if (consultant) {
          console.log('🔍 AuthGuard: User is a consultant');
          setUserType('consultant');
          setLoading(false);
          return;
        }

        // Check if user is admin
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        if (profile?.role === 'admin') {
          console.log('🔍 AuthGuard: User is admin');
          setUserType('admin');
          setLoading(false);
          return;
        }

        // Check user permissions from user_management
        const { data: userMgmt } = await supabase
          .from('user_management')
          .select('access_matchwiseai, access_talent_activation')
          .eq('email', user.email)
          .maybeSingle();

        if (userMgmt) {
          console.log('🔍 AuthGuard: User is business user with permissions:', userMgmt);
          setUserType('business');
          setPermissions({
            access_matchwiseai: userMgmt.access_matchwiseai || false,
            access_talent_activation: userMgmt.access_talent_activation || false
          });
        } else {
          console.log('🔍 AuthGuard: User not found in user_management, defaulting to business');
          setUserType('business');
          setPermissions({
            access_matchwiseai: false,
            access_talent_activation: false
          });
        }
      } catch (error) {
        console.error('🔍 AuthGuard: Error checking user type:', error);
        setUserType('business');
        setPermissions({
          access_matchwiseai: false,
          access_talent_activation: false
        });
      } finally {
        console.log('🔍 AuthGuard: Check complete, loading finished');
        setLoading(false);
      }
    };

    if (!authLoading) {
      checkUserTypeAndPermissions();
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    console.log('🔍 AuthGuard: Still loading...', { authLoading, loading });
    return <div>Loading...</div>;
  }

  // Allow access to public pages for everyone
  const publicPaths = ['/auth', '/', '/landing', '/how-it-works', '/cv-upload', '/cv-upload-new', '/aipowerbriefing', '/icp-outreach'];
  if (publicPaths.includes(location.pathname)) {
    return <>{children}</>;
  }

  // If user is a consultant, allow access to /my-profile and /aipowerbriefing
  if (userType === 'consultant' && location.pathname !== '/my-profile' && location.pathname !== '/aipowerbriefing') {
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