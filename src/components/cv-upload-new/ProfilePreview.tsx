
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, MapPin, Mail, Phone, Star, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { EmailNotificationHandler } from '@/components/EmailNotificationHandler';

interface ProfilePreviewProps {
  analysisResult: {
    sessionId: string;
    profileId: string;
    analysisData: any;
  };
  onComplete: () => void;
}

export const ProfilePreview: React.FC<ProfilePreviewProps> = ({
  analysisResult,
  onComplete
}) => {
  const { analysisData } = analysisResult;
  const { toast } = useToast();

  const handleJoinNetwork = async () => {
    try {
      console.log('🚀 Starting network join process...');
      
      // Create user profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          full_name: analysisData?.full_name || 'Konsultnamn',
          email: analysisData?.email || 'email@exempel.se',
          phone: analysisData?.phone || null,
          title: analys
Data?.title || 'Senior Konsult',
          personal_tagline: analysisData?.personal_tagline || null,
          years_of_experience: analysisData?.years_of_experience || 5,
          availability: 'Available'
        })
        .select()
        .single();

      if (profileError) {
        throw new Error('Kunde inte skapa användarprofil');
      }

      // Create AI analysis record
      const { data: analysisRecord, error: analysisError } = await supabase
        .from('ai_analysis')
        .insert({
          user_profile_id: profileData.id,
          upload_session_id: analysisResult.sessionId,
          analysis_data: analysisData,
          tech_stack_primary: analysisData?.tech_stack_primary || [],
          tech_stack_secondary: analysisData?.tech_stack_secondary || [],
          certifications: analysisData?.certifications || [],
          industries: analysisData?.industries || [],
          top_values: analysisData?.top_values || [],
          personality_traits: analysisData?.personality_traits || [],
          communication_style: analysisData?.communication_style || null,
          tone_of_voice: analysisData?.tone_of_voice || null,
          thought_leadership_score: analysisData?.thought_leadership_score || 0,
          linkedin_engagement_level: analysisData?.linkedin_engagement_level || null,
          brand_themes: analysisData?.brand_themes || [],
          cv_tips: analysisData?.cv_tips || [],
          linkedin_tips: analysisData?.linkedin_tips || [],
          certification_recommendations: analysisData?.certification_recommendations || [],
          suggested_learning_paths: analysisData?.suggested_learning_paths || []
        })
        .select()
        .single();

      if (analysisError) {
        throw new Error('Kunde inte spara AI-analys');
      }

      // Publish profile
      const { error: publishError } = await supabase
        .from('published_profiles')
        .insert({
          user_profile_id: profileData.id,
          ai_analysis_id: analysisRecord.id,
          is_active: true,
          visibility_status: 'public'
        });

      if (publishError) {
        throw new Error('Kunde inte publicera profil');
      }

      // Send welcome emails
      await EmailNotificationHandler.sendWelcomeEmails({
        consultantId: profileData.id,
        finalEmail: analysisData?.email || 'email@exempel.se',
        finalName: analysisData?.full_name || 'Konsultnamn',
        isMyConsultant: false,
        toast
      });

      // Log successful registration
      await supabase
        .from('event_log')
        .insert({
          session_token: analysisResult.sessionId,
          event_type: 'profile_published',
          event_data: {
            profile_id: profileData.id,
            analysis_id: analysisRecord.id
          }
        });

      console.log('✅ Network join completed successfully');
      onComplete();

    } catch (error: any) {
      console.error('❌ Network join failed:', error);
      toast({
        title: "Något gick fel",
        description: error.message || "Ett oväntat fel inträffade",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="text-3xl font-bold mb-4">
            Din Konsultprofil
          </CardTitle>
          <p className="text-lg opacity-90">
            Förhandsgranska din profil innan du går med i nätverket
          </p>
        </CardHeader>

        <CardContent className="p-8">
          {/* Profile Card Preview */}
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 mb-8 border-2 border-blue-200">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-white" />
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  {analysisData?.full_name || 'Konsultnamn'}
                </h2>
                <p className="text-lg text-blue-600 font-semibold mb-3">
                  {analysisData?.title || 'Senior Konsult'}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {(analysisData?.tech_stack_primary || []).slice(0, 5).map((skill: string, index: number) => (
                    <Badge key={index} variant="default" className="bg-blue-100 text-blue-800">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{analysisData?.location || 'Sverige'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="h-4 w-4" />
                    <span>{analysisData?.years_of_experience || '5+'} års erfarenhet</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>4.8/5</span>
                  </div>
                </div>
              </div>
            </div>

            {analysisData?.personal_tagline && (
              <div className="mt-4 p-4 bg-white/80 rounded-lg border border-blue-100">
                <p className="text-slate-700 italic">"{analysisData.personal_tagline}"</p>
              </div>
            )}
          </div>

          {/* Profile Details */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 mb-3">Kontaktinformation</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-500" />
                  <span className="text-sm">{analysisData?.email || 'email@exempel.se'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-500" />
                  <span className="text-sm">{analysisData?.phone || '+46 70 123 45 67'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 mb-3">Profil Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Synlighet:</span>
                  <Badge variant="outline" className="text-green-600 border-green-200">Publik</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Tillgänglighet:</span>
                  <Badge variant="outline" className="text-blue-600 border-blue-200">Tillgänglig</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Join Network Button */}
          <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Redo att gå med i MatchWise-nätverket?
            </h3>
            <p className="text-slate-600 mb-4">
              Din profil kommer att bli synlig för potentiella kunder och du får tillgång till exklusiva uppdrag.
            </p>
            <Button 
              onClick={handleJoinNetwork}
              size="lg"
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-3"
            >
              Gå med i nätverket nu
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
