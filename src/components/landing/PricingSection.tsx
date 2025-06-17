
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">💰 Enkel, Transparent Prissättning</h2>
          <p className="text-xl text-slate-300">Välj den plan som passar ditt företags behov</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Basic Plan */}
          <Card className="bg-slate-800/50 border-slate-600 hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-blue-600 rounded"></div>
                <h3 className="text-xl font-bold text-white">Basic Plan</h3>
              </div>
              <p className="text-slate-400 mb-6">För 1-3 användare</p>
              <div className="text-3xl font-bold text-white mb-6">€99<span className="text-lg text-slate-400">/månad</span></div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                  Analysera dina egna konsulter
                </li>
                <li className="flex items-center text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                  AI-driven analys av CV och profiler
                </li>
                <li className="flex items-center text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                  Detaljerade konsultprofiler
                </li>
                <li className="flex items-center text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                  Spara favoriter & ladda ner CV
                </li>
                <li className="flex items-center text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                  1 admin + 2 standardanvändare
                </li>
                <li className="flex items-center text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                  Email support
                </li>
              </ul>

              <Button variant="outline" className="w-full border-slate-600 text-white hover:bg-slate-800">
                Starta Gratis Provperiod
              </Button>
            </CardContent>
          </Card>

          {/* Team Plan */}
          <Card className="bg-slate-800/50 border-emerald-500 relative hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-emerald-600 text-white">Mest Populär</Badge>
            </div>
            <CardContent className="p-8">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-emerald-600 rounded"></div>
                <h3 className="text-xl font-bold text-white">Team Plan</h3>
              </div>
              <p className="text-slate-400 mb-6">För 3-10 användare</p>
              <div className="text-3xl font-bold text-white mb-6">€199<span className="text-lg text-slate-400">/månad</span></div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                  Allt i Basic, plus:
                </li>
                <li className="flex items-center text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                  Tillgång till nätverkskonsulter
                </li>
                <li className="flex items-center text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                  Utökad användaråtkomst (3-10 användare)
                </li>
                <li className="flex items-center text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                  Rollbaserad åtkomstkontroll
                </li>
                <li className="flex items-center text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                  Prioriterad email support
                </li>
                <li className="flex items-center text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                  Exportera konsultlistor
                </li>
              </ul>

              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                Starta Gratis Provperiod
              </Button>
            </CardContent>
          </Card>

          {/* Enterprise Plan */}
          <Card className="bg-slate-800/50 border-red-600 hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-red-600 rounded"></div>
                <h3 className="text-xl font-bold text-white">Enterprise</h3>
              </div>
              <p className="text-slate-400 mb-6">Obegränsat antal användare</p>
              <div className="text-3xl font-bold text-white mb-6">€599<span className="text-lg text-slate-400">/månad</span></div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                  Obegränsade sökningar i hela konsultdatabasen
                </li>
                <li className="flex items-center text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                  Direkt tillgång till inkommande freelance CV
                </li>
                <li className="flex items-center text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                  Premium synlighet för dina uppdrag
                </li>
                <li className="flex items-center text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                  API-åtkomst och integrationsmöjligheter
                </li>
                <li className="flex items-center text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                  Dedikerad onboarding
                </li>
                <li className="flex items-center text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                  SLA-garanterad support
                </li>
                <li className="flex items-center text-slate-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                  Obegränsat antal användare
                </li>
              </ul>

              <Button variant="outline" className="w-full border-slate-600 text-white hover:bg-slate-800">
                Kontakta Försäljning
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
