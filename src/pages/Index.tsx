
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, BarChart3, Users, Target, Brain, Zap } from 'lucide-react';
import Logo from '@/components/Logo';
import Navbar from '@/components/Navbar';

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <Logo size="xl" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            AI-Driven <span className="text-blue-600">Konsultanalys</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Få djupgående insikter om dina tekniska färdigheter, marknadsvärde och karriärmöjligheter 
            genom vår avancerade AI-analys av ditt CV och LinkedIn-profil.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/cv-upload">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                <Upload className="mr-2 h-5 w-5" />
                Börja din analys
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg">
                <BarChart3 className="mr-2 h-5 w-5" />
                Se Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>AI-Driven Analys</CardTitle>
              <CardDescription>
                Avancerad Gemini AI analyserar ditt CV och LinkedIn för djupgående karriärinsikter
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Marknadsvärdering</CardTitle>
              <CardDescription>
                Få realtidsdata om ditt marknadsvärde och optimering av löneförhandlingar
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Konsultnätverk</CardTitle>
              <CardDescription>
                Gå med i vårt exklusiva nätverk och få tillgång till högkvalitativa uppdrag
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle>Snabb Analys</CardTitle>
              <CardDescription>
                Få din kompletta karriäranalys på under 2 minuter med AI-teknik
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle>Utvecklingsroadmap</CardTitle>
              <CardDescription>
                Personliga rekommendationer för certifieringar och kompetensutveckling
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-indigo-600" />
              </div>
              <CardTitle>GDPR-Säker</CardTitle>
              <CardDescription>
                All databehandling följer GDPR och din integritet är vår högsta prioritet
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-2xl p-12 shadow-lg">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Redo att ta nästa steg i din karriär?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Få din personliga AI-analys och upptäck nya möjligheter inom 2 minuter.
          </p>
          <Link to="/cv-upload">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-lg">
              <Upload className="mr-2 h-5 w-5" />
              Starta din analys nu
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
