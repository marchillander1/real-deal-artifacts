
import React, { useState } from 'react';
import { Network, Mail, User, TrendingUp, Award, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { EmailService } from '../email/EmailService';

interface JoinNetworkStepProps {
  analysisResult: {
    consultant: any;
    cvAnalysis: any;
    linkedinAnalysis: any;
    extractedPersonalInfo: any;
  };
  onJoinNetwork: () => void;
}

export const JoinNetworkStep: React.FC<JoinNetworkStepProps> = ({
  analysisResult,
  onJoinNetwork
}) => {
  const [isJoining, setIsJoining] = useState(false);
  const { toast } = useToast();
  const { consultant, cvAnalysis, extractedPersonalInfo } = analysisResult;

  const handleJoinNetwork = async () => {
    setIsJoining(true);
    
    try {
      console.log('🚀 Joining network process started');

      // Send welcome email to consultant
      await EmailService.sendWelcomeEmail({
        consultantId: consultant.id,
        email: extractedPersonalInfo.email,
        name: extractedPersonalInfo.name,
        isMyConsultant: false // Network consultant
      });

      // Send notification to Marc
      await EmailService.sendAdminNotification({
        name: extractedPersonalInfo.name,
        email: extractedPersonalInfo.email,
        isMyConsultant: false // Network consultant
      });

      toast({
        title: "Välkommen till nätverket! 🎉",
        description: `Välkomstmail skickat till ${extractedPersonalInfo.email}`,
      });

      onJoinNetwork();

    } catch (error: any) {
      console.error('❌ Join network failed:', error);
      toast({
        title: "Anslutning misslyckades",
        description: error.message || "Ett fel inträffade vid anslutning till nätverket",
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
  };

  const getTopSkills = () => {
    const skills = [
      ...(cvAnalysis?.skills?.technical || []),
      ...(cvAnalysis?.skills?.languages || []),
      ...(cvAnalysis?.skills?.tools || [])
    ];
    return skills.slice(0, 6);
  };

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-green-600';
    if (score >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white text-center">
          <Network className="h-16 w-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">
            Grattis! Din Analys är Klar
          </h2>
          <p className="text-xl opacity-90">
            Bli en del av MatchWise konsultnätverket och få tillgång till spännande uppdrag
          </p>
        </div>

        <div className="p-8">
          {/* Analysis Summary */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Profile Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profilsammanfattning
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold text-lg">{extractedPersonalInfo.name}</p>
                  <p className="text-slate-600">{extractedPersonalInfo.email}</p>
                  <p className="text-slate-600">{extractedPersonalInfo.location}</p>
                </div>
                
                <div>
                  <p className="font-medium mb-2">Toppfärdigheter:</p>
                  <div className="flex flex-wrap gap-2">
                    {getTopSkills().map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="font-medium">Erfarenhet:</p>
                  <p className="text-slate-600">
                    {cvAnalysis?.experience?.years} år • {cvAnalysis?.experience?.level}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Scores */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  AI Bedömning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(cvAnalysis?.scores || {}).map(([key, value]) => {
                    const score = typeof value === 'number' ? value : 0;
                    return (
                      <div key={key} className="flex justify-between items-center">
                        <span className="capitalize font-medium">
                          {key === 'leadership' ? 'Ledarskap' :
                           key === 'innovation' ? 'Innovation' :
                           key === 'adaptability' ? 'Anpassningsförmåga' :
                           key === 'culturalFit' ? 'Kulturell Passform' :
                           key === 'communication' ? 'Kommunikation' :
                           key === 'teamwork' ? 'Teamwork' : key}
                        </span>
                        <span className={`font-bold ${getScoreColor(score)}`}>
                          {score}/5
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Market Analysis */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Marknadsanalys
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="font-medium mb-2">Rekommenderat Timpris:</p>
                  <div className="text-2xl font-bold text-green-600">
                    {cvAnalysis?.marketAnalysis?.hourlyRate?.optimized || 950} SEK/tim
                  </div>
                  <p className="text-sm text-slate-600">
                    {cvAnalysis?.marketAnalysis?.hourlyRate?.explanation}
                  </p>
                </div>
                
                <div>
                  <p className="font-medium mb-2">Konkurrensfördelar:</p>
                  <ul className="space-y-1">
                    {(cvAnalysis?.marketAnalysis?.competitiveAdvantages || []).slice(0, 3).map((advantage: string, index: number) => (
                      <li key={index} className="text-sm text-slate-600 flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        {advantage}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Join Network CTA */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-6">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Gå Med i MatchWise Nätverket
              </h3>
              <div className="grid md:grid-cols-3 gap-4 mb-6 text-sm">
                <div className="bg-white p-4 rounded-xl">
                  <Mail className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="font-medium">Du får inloggningsuppgifter</p>
                  <p className="text-slate-600">Åtkomst till /myprofile</p>
                </div>
                <div className="bg-white p-4 rounded-xl">
                  <Network className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <p className="font-medium">Syns i vårt nätverk</p>
                  <p className="text-slate-600">Matchas med uppdrag</p>
                </div>
                <div className="bg-white p-4 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <p className="font-medium">Karriärutveckling</p>
                  <p className="text-slate-600">Kontinuerlig analys</p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleJoinNetwork}
              disabled={isJoining}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl"
            >
              {isJoining ? 'Ansluter...' : 'Gå Med i Nätverket'}
            </Button>
            
            <p className="text-sm text-slate-600 mt-4">
              Genom att gå med godkänner du våra villkor och integritetspolicy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
