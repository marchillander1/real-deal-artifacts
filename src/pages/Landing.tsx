
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, Users, Clock, Target, Zap, Star, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/hooks/useAuth';

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Logo />
          <div className="flex items-center space-x-4">
            {user ? (
              <Link to="/matchwiseai">
                <Button>
                  Gå till Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="outline">Logga in</Button>
                </Link>
                <Link to="/auth">
                  <Button>
                    Kom igång
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
            <Sparkles className="w-3 h-3 mr-1" />
            AI-driven matchmaking
          </Badge>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Revolutionera din
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 block">
              konsultmatchning
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            MatchWise AI använder avancerad artificiell intelligens för att matcha rätt konsult 
            med rätt uppdrag på sekunder. Spara tid, minska kostnader och öka nöjdheten.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {!user && (
              <Link to="/auth">
                <Button size="lg" className="px-8 py-3 text-lg">
                  Starta gratis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            )}
            <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
              Se demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">12s</div>
              <div className="text-gray-600">Genomsnittlig matchtid</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">96%</div>
              <div className="text-gray-600">Kundnöjdhet</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">850h</div>
              <div className="text-gray-600">Sparad tid/månad</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">2.4M</div>
              <div className="text-gray-600">SEK i besparingar</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Varför välja MatchWise AI?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Vår plattform kombinerar AI-teknik med djup förståelse för konsultbranschen
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Blixtsnabb matchning</CardTitle>
                <CardDescription>
                  AI analyserar tusentals faktorer på sekunder för att hitta den perfekta matchen
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Tekniska kompetenser
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Mjuka egenskaper
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Kulturell passform
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Holistisk analys</CardTitle>
                <CardDescription>
                  Går bortom CV:t och analyserar kommunikationsstil, värderingar och teamdynamik
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Personlighetsanalys
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Arbetsstil
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Adaptabilitet
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Kontinuerlig lärning</CardTitle>
                <CardDescription>
                  AI:n blir bättre för varje matchning och lär sig av framgångar och utmaningar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Feedback-loop
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Prediktiv analys
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Optimering
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Redo att revolutionera din konsultverksamhet?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Gå med idag och upplev kraften med AI-driven konsultmatchning
          </p>
          
          {!user && (
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="px-8 py-3 text-lg">
                Kom igång gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Logo variant="light" />
              <p className="text-gray-400 mt-2">AI-driven konsultmatchning</p>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 MatchWise AI. Alla rättigheter förbehållna.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
