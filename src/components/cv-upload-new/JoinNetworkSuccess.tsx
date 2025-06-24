
import React from 'react';
import { CheckCircle, User, Mail, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface JoinNetworkSuccessProps {
  profileId: string;
  onRestart: () => void;
}

export const JoinNetworkSuccess: React.FC<JoinNetworkSuccessProps> = ({
  profileId,
  onRestart
}) => {
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader className="text-center bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-16 w-16 animate-pulse" />
          </div>
          <CardTitle className="text-3xl font-bold mb-4">
            Välkommen till MatchWise! 🎉
          </CardTitle>
          <p className="text-lg opacity-90">
            Din konsultprofil har skapats och publicerats i vårt nätverk
          </p>
        </CardHeader>

        <CardContent className="p-8">
          {/* Success Message */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Grattis! Du är nu del av MatchWise-nätverket
            </h2>
            <p className="text-lg text-slate-600 mb-6">
              Din AI-analyserade profil är nu synlig för potentiella kunder och du kommer att få tillgång till skräddarsydda uppdrag som matchar dina färdigheter.
            </p>
          </div>

          {/* Next Steps */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
              <User className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-800 mb-2">Profil Aktiv</h3>
              <p className="text-sm text-slate-600">
                Din profil är nu synlig för kunder som söker konsulter med dina färdigheter
              </p>
            </div>

            <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
              <Mail className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-800 mb-2">E-post skickat</h3>
              <p className="text-sm text-slate-600">
                Du kommer att få en välkomstmail med dina inloggningsuppgifter
              </p>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-xl border border-purple-200">
              <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-800 mb-2">Matchning startar</h3>
              <p className="text-sm text-slate-600">
                Vår AI börjar matcha dig med relevanta uppdrag inom 24 timmar
              </p>
            </div>
          </div>

          {/* What Happens Next */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-8 border border-indigo-200">
            <h3 className="text-lg font-semibold text-indigo-800 mb-4">
              Vad händer härnäst?
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <p className="text-sm text-indigo-700">
                  <strong>Inom 1 timme:</strong> Du får en välkomstmail med dina inloggningsuppgifter och en länk till din profilsida
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <p className="text-sm text-indigo-700">
                  <strong>Inom 24 timmar:</strong> Vår AI-matchning börjar arbeta och du kan få ditt första uppdragsförslag
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <p className="text-sm text-indigo-700">
                  <strong>Löpande:</strong> Du får notifieringar om nya uppdrag som matchar din profil och dina önskemål
                </p>
              </div>
            </div>
          </div>

          {/* Benefits Reminder */}
          <div className="bg-slate-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Dina fördelar som MatchWise-konsult
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-slate-700">AI-driven matchning med rätt uppdrag</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-slate-700">Transparent prismodell utan dolda avgifter</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-slate-700">Kontinuerlig karriärutveckling och coaching</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-slate-700">Kvalitetssäkrade kunder och uppdrag</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-slate-700">Flexibel arbetssätt som passar dig</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-slate-700">Community med andra erfarna konsulter</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => window.open(`/my-profile?id=${profileId}`, '_blank')}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 flex items-center gap-2"
            >
              Visa min profil
              <ArrowRight className="h-4 w-4" />
            </Button>
            
            <Button
              onClick={onRestart}
              variant="outline"
              size="lg"
              className="px-6 py-3"
            >
              Skapa ny profil
            </Button>
          </div>

          {/* Support Info */}
          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200 text-center">
            <p className="text-sm text-blue-700">
              <strong>Behöver du hjälp?</strong> Kontakta oss på{' '}
              <a href="mailto:support@matchwise.se" className="underline">
                support@matchwise.se
              </a>{' '}
              eller ring{' '}
              <a href="tel:+46701234567" className="underline">
                070-123 45 67
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
