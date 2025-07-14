import React, { useState } from 'react';
import { KeyRound, Eye, EyeOff, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SetPasswordStepProps {
  consultantId: string;
  email: string;
  fullName: string;
  onComplete: () => void;
}

export const SetPasswordStep: React.FC<SetPasswordStepProps> = ({
  consultantId,
  email,
  fullName,
  onComplete
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userEmail, setUserEmail] = useState(email === 'Not specified' ? '' : email);
  const [showPassword, setShowPassword] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const handleCreateAccount = async () => {
    if (!userEmail || !userEmail.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are identical",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsCreating(true);

      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userEmail,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/my-profile`
        }
      });

      if (authError) {
        throw authError;
      }

      if (authData.user) {
        // Update consultant profile with user_id
        const { error: updateError } = await supabase
          .from('consultants')
          .update({ 
            user_id: authData.user.id,
            updated_at: new Date().toISOString()
          })
          .eq('id', consultantId);

        if (updateError) {
          console.error('Error linking consultant to user:', updateError);
        }

        // Auto sign in first so user is authenticated for profile creation
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: userEmail,
          password
        });

        if (signInError) {
          console.error('Error signing in:', signInError);
        } else {
          // Now create user profile after user is authenticated
          try {
            const { error: profileError } = await supabase
              .from('user_profiles')
              .insert({
                user_id: authData.user.id,
                email: userEmail,
                full_name: fullName,
                availability: 'Available'
              });

            if (profileError) {
              console.error('Error creating user profile:', profileError);
            }
          } catch (profileErr) {
            console.error('Profile creation failed:', profileErr);
          }
        }

        // Send registration emails
        try {
          await supabase.functions.invoke('consultant-registration', {
            body: {
              email: userEmail,
              full_name: fullName,
              password,
              consultant_id: consultantId
            }
          });
          console.log('Registration emails sent successfully');
        } catch (emailError) {
          console.error('Error sending registration emails:', emailError);
          // Don't fail the registration if emails fail
        }

        toast({
          title: "Account created!",
          description: "You can now log in with your email and password. Check your inbox for welcome email!",
        });

        // Redirect to my-profile since user is a consultant
        setTimeout(() => {
          window.location.href = '/my-profile';
        }, 1000);

        // Complete the process
        onComplete();
      }
    } catch (error: any) {
      console.error('Error creating account:', error);
      
      let errorMessage = "Could not create your account. Please try again.";
      
      if (error.code === 'over_email_send_rate_limit' || error.message?.includes('you can only request this after')) {
        errorMessage = "Too many attempts. Please wait a minute and try again.";
      } else if (error.code === 'validation_failed' && error.message?.includes('email address')) {
        errorMessage = "Please enter a valid email address.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Account creation failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <KeyRound className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Create your account
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Set a password to access your profile
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Type password again"
              />
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Your account gives you access to:</p>
                <ul className="mt-2 space-y-1 text-blue-700">
                  <li>• Your personal profile at /my-profile</li>
                  <li>• Edit and update your information</li>
                  <li>• Control visibility in the network</li>
                  <li>• View your AI-generated insights</li>
                </ul>
              </div>
            </div>
          </div>

          <Button
            onClick={handleCreateAccount}
            disabled={!userEmail || !password || !confirmPassword || isCreating}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isCreating ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating account...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span>Create account & log in</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </Button>

          <p className="text-xs text-center text-gray-500">
            By creating an account you agree to our terms of service
          </p>
        </CardContent>
      </Card>
    </div>
  );
};