
import React from 'react';
import { 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Target, 
  TrendingUp, 
  Users, 
  Star,
  Zap,
  Shield,
  BarChart3,
  PlayCircle,
  Calendar,
  Heart,
  Brain,
  MessageSquare
} from 'lucide-react';
import Logo from '../components/Logo';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="bg-gray-900 border-b border-gray-800 fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo size="md" />
            <div className="hidden md:flex items-center space-x-8">
              <a href="#solution" className="text-gray-300 hover:text-white transition-colors">Lösning</a>
              <a href="#benefits" className="text-gray-300 hover:text-white transition-colors">Fördelar</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Priser</a>
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity">
                Boka Demo
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-blue-900/50 text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-blue-800">
                <Heart className="h-4 w-4 mr-2" />
                Human-First AI Matchning
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Matcha på
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent block">
                  Hela Människan
                </span>
                inte bara CV:t
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                MatchWise AI revolutionerar konsultmatchning genom att analysera både tekniska färdigheter 
                OCH mjuka faktorer som värderingar, kommunikationsstil och personlig passform.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center">
                  <PlayCircle className="h-5 w-5 mr-2" />
                  Se Demo
                </button>
                <button className="border border-gray-600 text-gray-300 px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Boka Möte
                </button>
              </div>
              
              <div className="flex items-center space-x-8 text-sm text-gray-400">
                <div className="flex items-center">
                  <Heart className="h-5 w-5 text-pink-400 mr-2" />
                  Human-First Matchning
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-blue-400 mr-2" />
                  12 Sekunders Analys
                </div>
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-purple-400 mr-2" />
                  GDPR Säker
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Live Human-First Demo</h3>
                  <div className="flex items-center text-green-400">
                    <div className="h-2 w-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    Aktiv
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        A
                      </div>
                      <div>
                        <p className="font-medium text-white">Anna Lindqvist</p>
                        <p className="text-sm text-gray-400">React Developer • Empatisk • Teamspelare</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-green-400">95%</span>
                      <p className="text-xs text-gray-500">human match</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                        M
                      </div>
                      <div>
                        <p className="font-medium text-white">Marcus Johansson</p>
                        <p className="text-sm text-gray-400">UX Designer • Kreativ • Strukturerad</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-green-400">92%</span>
                      <p className="text-xs text-gray-500">human match</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-400">Analyserade mjuka faktorer på 12 sekunder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              CV-baserad Matchning Missar Helheten
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Traditionella metoder fokuserar bara på tekniska färdigheter och missar de mjuka faktorer som avgör projektframgång
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-red-900/30 border border-red-800 rounded-xl p-6">
              <div className="text-red-400 mb-4">
                <Brain className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Bara Tekniska Skills</h3>
              <p className="text-gray-300">Missar värderingar, kommunikationsstil och personlig passform som är avgörande</p>
            </div>
            
            <div className="bg-orange-900/30 border border-orange-800 rounded-xl p-6">
              <div className="text-orange-400 mb-4">
                <MessageSquare className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Dålig Teamkemi</h3>
              <p className="text-gray-300">60% av projektproblem beror på dålig personlig passform, inte tekniska brister</p>
            </div>
            
            <div className="bg-yellow-900/30 border border-yellow-800 rounded-xl p-6">
              <div className="text-yellow-400 mb-4">
                <BarChart3 className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Höga Kostnader</h3>
              <p className="text-gray-300">Dålig human-passform kostar 2.5M SEK årligen i omstart och förseningar</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Human-First AI Som Verkligen Förstår
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              MatchWise AI analyserar hela människan - både tekniska färdigheter och mjuka faktorer för perfekt passform
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-pink-900/50 p-3 rounded-lg border border-pink-800">
                  <Heart className="h-6 w-6 text-pink-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Värderingar & Personlighet
                  </h3>
                  <p className="text-gray-300">
                    AI analyserar kommunikationsstil, arbetssätt och personliga värderingar för djup kompatibilitet
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-blue-900/50 p-3 rounded-lg border border-blue-800">
                  <Brain className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Kulturell Passform
                  </h3>
                  <p className="text-gray-300">
                    Avancerade algoritmer matchar teamdynamik, ledarskap och anpassningsförmåga
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-purple-900/50 p-3 rounded-lg border border-purple-800">
                  <MessageSquare className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Kommunikationsstil
                  </h3>
                  <p className="text-gray-300">
                    Identifierar och matchar kommunikationstyper för optimal teamharmoni och produktivitet
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800 to-purple-900/50 rounded-2xl p-8 border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-6">Så Funkar Det</h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Ladda upp CV & Krav</h4>
                    <p className="text-sm text-gray-300">Definiera både tekniska och mjuka krav för projektet</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Human-First AI Analys</h4>
                    <p className="text-sm text-gray-300">AI analyserar värderingar, kommunikation och personlighet</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Perfekt Human Match</h4>
                    <p className="text-sm text-gray-300">Få rankade kandidater baserat på helhetsbild</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Bevisad ROI Som Talar för Sig Själv
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-8 text-white text-center">
              <Heart className="h-12 w-12 mx-auto mb-4 opacity-80" />
              <h3 className="text-4xl font-bold mb-2">850+</h3>
              <p className="text-green-100 mb-1">Timmar Sparade Årligen</p>
              <p className="text-sm text-green-200">≈ 2.1M SEK i kostnadsbesparingar</p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl p-8 text-white text-center">
              <Star className="h-12 w-12 mx-auto mb-4 opacity-80" />
              <h3 className="text-4xl font-bold mb-2">96%</h3>
              <p className="text-blue-100 mb-1">Kundnöjdhet</p>
              <p className="text-sm text-blue-200">+36% vs manuell matchning</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-600 to-pink-700 rounded-xl p-8 text-white text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-80" />
              <h3 className="text-4xl font-bold mb-2">75x</h3>
              <p className="text-purple-100 mb-1">Snabbare Matchning</p>
              <p className="text-sm text-purple-200">12 sekunder vs 15 timmar</p>
            </div>
          </div>

          <div className="bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Vad Våra Kunder Säger
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="border-l-4 border-blue-500 pl-6">
                <p className="text-gray-300 mb-4 italic">
                  "MatchWise AI förstår inte bara tekniska skills utan också om personen passar vårt team. 
                  Teamkemin blev 95% bättre jämfört med tidigare 60%."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    E
                  </div>
                  <div>
                    <p className="font-semibold text-white">Erik Svensson</p>
                    <p className="text-sm text-gray-400">CTO, TechCorp AB</p>
                  </div>
                </div>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-6">
                <p className="text-gray-300 mb-4 italic">
                  "ROI:n är otrolig. Vi sparade 2.1M SEK första året genom bättre human-passform 
                  och minskade projektförseningar."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    M
                  </div>
                  <div>
                    <p className="font-semibold text-white">Maria Lundberg</p>
                    <p className="text-sm text-gray-400">HR-chef, Innovation Labs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Enkla, Transparenta Priser
            </h2>
            <p className="text-xl text-gray-300">
              Välj den plan som passar ditt företags behov
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="border border-gray-700 rounded-xl p-8 bg-gray-800">
              <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
              <p className="text-gray-400 mb-6">Perfekt för små team</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">5,000</span>
                <span className="text-gray-400"> SEK/månad</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-gray-300">Upp till 10 matchningar/månad</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-gray-300">Grundläggande human-analys</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-gray-300">E-postsupport</span>
                </li>
              </ul>
              <button className="w-full border border-gray-600 text-gray-300 py-3 rounded-lg hover:bg-gray-700 transition-colors">
                Starta Gratis Test
              </button>
            </div>
            
            <div className="border-2 border-blue-500 rounded-xl p-8 relative bg-gray-800">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Mest Populär
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Professional</h3>
              <p className="text-gray-400 mb-6">För växande företag</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">15,000</span>
                <span className="text-gray-400"> SEK/månad</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-gray-300">Upp till 50 matchningar/månad</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-gray-300">Avancerad human-analys</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-gray-300">Prioriterad support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-gray-300">Anpassade integrationer</span>
                </li>
              </ul>
              <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors">
                Starta Gratis Test
              </button>
            </div>
            
            <div className="border border-gray-700 rounded-xl p-8 bg-gray-800">
              <h3 className="text-xl font-bold text-white mb-2">Enterprise</h3>
              <p className="text-gray-400 mb-6">För stora organisationer</p>
              <div className="mb-6">
                <span className="text-2xl font-bold text-white">Anpassat</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-gray-300">Obegränsade matchningar</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-gray-300">Anpassad human-analys</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-gray-300">Dedikerad support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                  <span className="text-gray-300">White-label lösning</span>
                </li>
              </ul>
              <button className="w-full border border-gray-600 text-gray-300 py-3 rounded-lg hover:bg-gray-700 transition-colors">
                Kontakta Försäljning
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-700 to-purple-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Redo att Transformera Din Konsultmatchning?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Gå med ledande företag som sparar 2.1M SEK årligen med 95% human-passform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center">
              <PlayCircle className="h-5 w-5 mr-2" />
              Se 2-Min Demo
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-700 transition-colors flex items-center justify-center">
              <Calendar className="h-5 w-5 mr-2" />
              Boka Möte
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Logo size="md" className="mb-4" />
              <p className="text-gray-400 mb-4">
                Human-first AI-matchning som levererar 95% passform på 12 sekunder.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Produkt</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Funktioner</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Priser</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Företag</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Om Oss</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Karriär</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kontakt</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Juridik</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Integritet</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Villkor</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 MatchWise AI. Alla rättigheter förbehållna.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
