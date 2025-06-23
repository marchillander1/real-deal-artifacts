
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Mail, Users, Briefcase, ArrowRight } from 'lucide-react';

export const JoinNetworkSuccess: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader className="text-center bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-20 w-20 animate-pulse" />
          </div>
          <CardTitle className="text-3xl font-bold mb-4">
            Välkommen till MatchWise! 🎉
          </CardTitle>
          <p className="text-lg opacity-90">
            Din profil har publicerats och du är nu en del av vårt exklusiva konsultnätverk
          </p>
        </CardHeader>

        <CardContent className="p-8">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-semibold text-green-800 mb-2">
                Din profil är nu aktiv!
              </h2>
              <p className="text-green-700">
                Vi har skickat ett välkomstmail med inloggningsuppgifter till din e-post.
              </p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
              <Mail className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="font-semibold text-slate-800 mb-2">Kolla din e-post</h3>
              <p className="text-sm text-slate-600">
                Vi har skickat inloggningsuppgifter och nästa steg
              </p>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-xl border border-purple-200">
              <Users className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="font-semibold text-slate-800 mb-2">Utforska nätverket</h3>
              <p className="text-sm text-slate-600">
                Anslut med andra konsulter och bygg ditt nätverk
              </p>
            </div>

            <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
              <Briefcase className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold text-slate-800 mb-2">Första uppdraget</h3>
              <p className="text-sm text-slate-600">
                Vi matchar dig automatiskt med relevanta uppdrag
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center p-6 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-4">
              Vad händer nu?
            </h3>
            <div className="space-y-3 text-left max-w-2xl mx-auto mb-6">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <p className="text-slate-700">Vi notifierar marc@matchwise.tech om din registrering</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <p className="text-slate-700">Din profil blir synlig för kunder inom 24 timmar</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <p className="text-slate-700">Du får notifikationer om matchande uppdrag direkt i inkorgen</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.location.href = '/my-profile'}
                size="lg"
                className="bg-blue-500 hover:bg-blue-600"
              >
                Gå till Min Profil
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button 
                onClick={() => window.location.href = '/dashboard'}
                variant="outline"
                size="lg"
              >
                Tillbaka till Dashboard
              </Button>
            </div>
          </div>

          {/* Support Information */}
          <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-sm text-slate-600 text-center">
              <strong>Behöver du hjälp?</strong> Kontakta oss på support@matchwise.tech eller ring 08-123 45 67
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
