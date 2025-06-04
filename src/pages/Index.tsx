
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Users, Target, TrendingUp, CheckCircle, ArrowRight, Star, Heart, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  const handleSubscribe = () => {
    toast({
      title: "Tack för din anmälan!",
      description: "Vi kommer att kontakta dig snart med mer information.",
    });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Meddelande skickat!",
      description: "Vi återkommer till dig inom 24 timmar.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Star className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                StartupHub
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#overview" className="text-gray-600 hover:text-blue-600 transition-colors">Översikt</a>
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Funktioner</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">Kontakt</a>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Kom igång
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Framtidens Startup
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Revolutionera din bransch med vår innovativa plattform som förenar teknologi, kreativitet och affärsframgång.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6">
                Starta din resa
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 hover:border-blue-600 hover:text-blue-600">
                Se demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users, value: "10K+", label: "Aktiva användare" },
              { icon: TrendingUp, value: "250%", label: "Tillväxt per år" },
              { icon: Target, value: "98%", label: "Nöjda kunder" },
              { icon: CheckCircle, value: "500+", label: "Genomförda projekt" }
            ].map((stat, index) => (
              <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <stat.icon className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-4" id="overview">
        <div className="container mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-12 bg-white/80 backdrop-blur-sm">
              <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
                Översikt
              </TabsTrigger>
              <TabsTrigger value="features" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
                Funktioner
              </TabsTrigger>
              <TabsTrigger value="roadmap" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
                Roadmap
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="animate-fade-in">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-4xl font-bold mb-6 text-gray-900">
                    Innovation som driver framgång
                  </h2>
                  <p className="text-lg text-gray-600 mb-8">
                    Vår plattform kombinerar avancerad AI-teknologi med intuitiv användarupplevelse för att 
                    skapa lösningar som verkligen gör skillnad. Vi hjälper företag att växa snabbare och smartare.
                  </p>
                  <div className="space-y-4">
                    {[
                      "AI-driven affärsanalys",
                      "Realtidssamarbete",
                      "Automatiserade workflows",
                      "Avancerad rapportering"
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <div className="bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl p-8 text-white">
                    <h3 className="text-2xl font-bold mb-4">Resultat som talar</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Produktivitetsökning</span>
                        <span className="font-bold">+340%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tidsbesparingar</span>
                        <span className="font-bold">15h/vecka</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ROI inom</span>
                        <span className="font-bold">3 månader</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="features" className="animate-fade-in">
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Smart Analytics",
                    description: "Avancerade analyser som ger djupa insikter i din verksamhet",
                    icon: TrendingUp,
                    color: "from-blue-500 to-cyan-500"
                  },
                  {
                    title: "Team Collaboration",
                    description: "Samarbeta sömlöst med ditt team i realtid",
                    icon: Users,
                    color: "from-purple-500 to-pink-500"
                  },
                  {
                    title: "Project Management",
                    description: "Hantera projekt effektivt med våra kraftfulla verktyg",
                    icon: Target,
                    color: "from-green-500 to-emerald-500"
                  }
                ].map((feature, index) => (
                  <Card key={index} className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-600">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="roadmap" className="animate-fade-in">
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-center mb-12">Vår utvecklingsresa</h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    {
                      phase: "Q1 2024",
                      title: "Foundation",
                      status: "Klar",
                      items: ["Grundplattform", "Användarautentisering", "Grundläggande funktioner"]
                    },
                    {
                      phase: "Q2 2024",
                      title: "Growth",
                      status: "Pågående",
                      items: ["AI-integration", "Mobilapp", "Avancerade analyser"]
                    },
                    {
                      phase: "Q3 2024",
                      title: "Scale",
                      status: "Planerat",
                      items: ["API-ekosystem", "Enterprise-funktioner", "Global expansion"]
                    }
                  ].map((phase, index) => (
                    <Card key={index} className="relative overflow-hidden">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{phase.phase}</CardTitle>
                          <Badge variant={phase.status === "Klar" ? "default" : phase.status === "Pågående" ? "secondary" : "outline"}>
                            {phase.status}
                          </Badge>
                        </div>
                        <CardDescription className="text-xl font-semibold">
                          {phase.title}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {phase.items.map((item, i) => (
                            <li key={i} className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Håll dig uppdaterad
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Få de senaste nyheterna och uppdateringarna direkt i din inkorg. 
            Var först med att veta om nya funktioner och möjligheter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input 
              placeholder="Din e-postadress" 
              className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
            />
            <Button 
              onClick={handleSubscribe}
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Prenumerera
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4" id="contact">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl font-bold mb-6">Låt oss prata</h2>
              <p className="text-lg text-gray-600 mb-8">
                Har du frågor eller vill diskutera hur vi kan hjälpa ditt företag? 
                Vi ser fram emot att höra från dig.
              </p>
              <div className="space-y-6">
                {[
                  { icon: MessageCircle, title: "Chatta med oss", desc: "Få svar på dina frågor direkt" },
                  { icon: Calendar, title: "Boka ett möte", desc: "Schemalägg en demo" },
                  { icon: Heart, title: "Community", desc: "Gå med i vår utvecklargemenskap" }
                ].map((contact, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <contact.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{contact.title}</h3>
                      <p className="text-gray-600">{contact.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Card className="shadow-2xl">
              <CardHeader>
                <CardTitle>Skicka ett meddelande</CardTitle>
                <CardDescription>
                  Fyll i formuläret så återkommer vi till dig inom 24 timmar.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Förnamn</Label>
                      <Input id="firstName" placeholder="Ditt förnamn" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Efternamn</Label>
                      <Input id="lastName" placeholder="Ditt efternamn" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">E-post</Label>
                    <Input id="email" type="email" placeholder="din@email.com" />
                  </div>
                  <div>
                    <Label htmlFor="company">Företag</Label>
                    <Input id="company" placeholder="Ditt företag" />
                  </div>
                  <div>
                    <Label htmlFor="message">Meddelande</Label>
                    <Textarea id="message" placeholder="Berätta om ditt projekt..." rows={4} />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Skicka meddelande
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">StartupHub</span>
              </div>
              <p className="text-gray-400">
                Revolutionerar affärsvärlden med innovativ teknologi och smarta lösningar.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Produkter</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Collaboration</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Project Management</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Företag</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Om oss</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Karriär</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Dokumentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kontakt</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 StartupHub. Alla rättigheter förbehållna.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
