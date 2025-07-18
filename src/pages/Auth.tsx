
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import Logo from '@/components/Logo';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Crown, Loader2 } from 'lucide-react';

export default function Auth() {
  const { signIn, signUp, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Check if user came from pricing page with valid payment
  const packageInfo = location.state;
  const hasValidPayment = packageInfo?.paymentComplete;

  // Let ConsultantGuard handle redirect after authentication
  useEffect(() => {
    if (!authLoading && user) {
      // ConsultantGuard will handle the appropriate redirect
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  const sendRegistrationNotification = async (userEmail: string, userName?: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-registration-notification', {
        body: {
          userEmail,
          userName,
        },
      });
      
      if (error) {
        console.error('Error sending registration notification:', error);
      }
    } catch (error) {
      console.error('Error invoking registration notification function:', error);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    const { error } = await signIn(email, password);
    
    if (error) {
      console.error('Sign in error:', error);
      if (error.message?.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please check your credentials.');
      } else if (error.message?.includes('Email not confirmed')) {
        setError('Please confirm your email address before signing in.');
      } else {
        setError(error.message || 'Sign in failed. Please try again.');
      }
    } else {
      setMessage('Sign in successful! Redirecting...');
      // Redirect will be handled by onAuthStateChange in useAuth
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    const { error } = await signUp(email, password, fullName);
    
    if (error) {
      console.error('Sign up error:', error);
      if (error.message?.includes('User already registered')) {
        setError('An account with this email already exists. Please sign in instead.');
      } else {
        setError(error.message || 'Registration failed. Please try again.');
      }
    } else {
      // Send registration notification
      await sendRegistrationNotification(email, fullName);
      setMessage('Account created! Check your email to confirm your account.');
    }
    setLoading(false);
  };

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="absolute top-4 left-4 p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          
          {hasValidPayment && packageInfo && (
            <Badge className="mb-2 bg-green-100 text-green-800">
              <Crown className="h-3 w-3 mr-1" />
              {packageInfo.packageName} Package Selected
            </Badge>
          )}
          
          <CardTitle>Welcome to MatchWise AI</CardTitle>
          <CardDescription>
            {hasValidPayment 
              ? `Complete your registration to access your ${packageInfo?.packageName} features`
              : 'Sign in to your account or create a new one'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {message && (
                  <Alert>
                    <AlertDescription className="text-green-600">{message}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-fullname">Full Name (Optional)</Label>
                  <Input
                    id="signup-fullname"
                    type="text"
                    placeholder="Your name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {message && (
                  <Alert>
                    <AlertDescription className="text-green-600">{message}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
