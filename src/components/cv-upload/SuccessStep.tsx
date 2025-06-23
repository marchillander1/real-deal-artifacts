
import React from 'react';
import { CheckCircle, Mail, User, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface SuccessStepProps {
  consultant: any;
}

export const SuccessStep: React.FC<SuccessStepProps> = ({ consultant }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center">
        <div className="mb-8">
          <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Välkommen till MatchWise! 🎉
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Du är nu en del av vårt expertnatverk och kommer att matchas med spännande uppdrag.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardContent className="p-6 text-center">
              <Mail className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Kolla Din Email
              </h3>
              <p className="text-blue-700">
                Vi har skickat inloggningsuppgifter och välkomstinformation till din email.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 bg-purple-50">
            <CardContent className="p-6 text-center">
              <User className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-purple-900 mb-2">
                Din Profil
              </h3>
              <p className="text-purple-700">
                Din analys och profil är nu tillgänglig i vårt system för matchning.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-bold text-slate-900 mb-4">
            Vad händer nu?
          </h3>
          <div className="space-y-3 text-left max-w-2xl mx-auto">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <p className="text-slate-700">
                <strong>Profilering:</strong> Du syns nu i vårt konsultnätverk under /matchwiseai
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <p className="text-slate-700">
                <strong>Matchning:</strong> Vårt AI-system matchar dig automatiskt med relevanta uppdrag
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              <p className="text-slate-700">
                <strong>Tillgång:</strong> Logga in på /myprofile för att hantera din profil och se uppdrag
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => window.location.href = '/matchwiseai'}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl"
          >
            Se Konsultnätverket
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
          
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
            className="px-6 py-3 rounded-xl"
          >
            Tillbaka till Startsidan
          </Button>
        </div>

        <div className="mt-8 p-4 bg-slate-50 rounded-xl">
          <p className="text-sm text-slate-600">
            <strong>Kontakt:</strong> Vid frågor, kontakta oss på 
            <a href="mailto:marc@matchwise.tech" className="text-blue-600 hover:underline ml-1">
              marc@matchwise.tech
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
