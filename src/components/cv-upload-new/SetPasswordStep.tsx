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
  const [showPassword, setShowPassword] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const handleCreateAccount = async () => {
    if (password !== confirmPassword) {
      toast({
        title: "Lösenorden matchar inte",
        description: "Se till att båda lösenorden är identiska",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Lösenordet är för kort",
        description: "Lösenordet måste vara minst 6 tecken",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsCreating(true);

      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
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

        // Create user profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: authData.user.id,
            email,
            full_name: fullName,
            availability: 'Available'
          });

        if (profileError) {
          console.error('Error creating user profile:', profileError);
        }

        // Send registration emails
        try {
          await supabase.functions.invoke('consultant-registration', {
            body: {
              email,
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
          title: "Konto skapat!",
          description: "Du kan nu logga in med din e-post och lösenord. Kolla din inkorg för välkomstmejl!",
        });

        // Auto sign in and complete
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (!signInError) {
          onComplete();
        }
      }
    } catch (error: any) {
      console.error('Error creating account:', error);
      toast({
        title: "Fel vid kontoskapande",
        description: error.message || "Kunde inte skapa ditt konto. Försök igen.",
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
              Skapa ditt konto
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Sätt ett lösenord för att komma åt din profil
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="password">Lösenord</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minst 6 tecken"
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
              <Label htmlFor="confirmPassword">Bekräfta lösenord</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Skriv lösenordet igen"
              />
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Ditt konto ger dig tillgång till:</p>
                <ul className="mt-2 space-y-1 text-blue-700">
                  <li>• Din personliga profil på /my-profile</li>
                  <li>• Redigera och uppdatera din information</li>
                  <li>• Kontrollera synlighet i nätverket</li>
                  <li>• Se dina AI-genererade insikter</li>
                </ul>
              </div>
            </div>
          </div>

          <Button
            onClick={handleCreateAccount}
            disabled={!password || !confirmPassword || isCreating}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isCreating ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Skapar konto...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span>Skapa konto & logga in</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </Button>

          <p className="text-xs text-center text-gray-500">
            Genom att skapa ett konto godkänner du våra användarvillkor
          </p>
        </CardContent>
      </Card>
    </div>
  );
};