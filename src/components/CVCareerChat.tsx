
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Minimize2, User, Bot, Loader2, Brain, Sparkles, Upload, FileText, Lightbulb, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface CVCareerChatProps {
  analysisResults?: any;
  isMinimized?: boolean;
  currentStep?: 'upload' | 'analyzing' | 'complete';
  onToggleMinimize?: () => void;
}

export const CVCareerChat: React.FC<CVCareerChatProps> = ({ 
  analysisResults, 
  isMinimized = false,
  currentStep = 'upload',
  onToggleMinimize
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [minimized, setMinimized] = useState(isMinimized);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Dynamic welcome message based on current step
    const getWelcomeMessage = () => {
      switch (currentStep) {
        case 'upload':
          return `Hej! Jag är din AI-karriärcoach på MatchWise.tech 🚀\n\nJag är här för att hjälpa dig genom hela CV-uppladdnings- och analysprocessen!\n\nUnder tiden du laddar upp ditt CV kan du fråga mig om:\n• 📋 Analysprocessen och vad som händer\n• 💼 Karriärrådgivning och vägledning\n• 📈 Tips för CV-optimering\n• 🎯 LinkedIn-profilförbättringar\n• 📊 Marknadsinsikter och positionering\n• 🔍 Vad du kan förvänta dig av analysen\n\nVad undrar du över? Jag är här för att hjälpa dig lyckas!`;
        
        case 'analyzing':
          return `Nu analyserar vår AI ditt CV och LinkedIn-profil! 🤖⚡\n\nUnder tiden kan jag hjälpa dig med:\n• 🎯 Vad händer under analysen\n• 📊 Vilken typ av insikter du kommer få\n• 💰 Tips för att maximera din marknadsvärde\n• 🚀 Hur du kan förbättra dina karriärmöjligheter\n• 📝 Nästa steg efter analysen\n\nAnalysen tar vanligtvis 30-60 sekunder. Vad vill du veta mer om?`;
          
        case 'complete':
          return `Grattis! Din analys är klar! 🎉\n\nJag har nu tillgång till dina personliga karriärinsikter och kan ge dig riktade råd baserat på:\n• 📊 Din kompetensprofil och marknadsposition\n• 💰 Dina lönepotentialer och optimeringsmöjligheter\n• 🎯 Certifieringsrekommendationer för dig\n• 📈 Karriärutvecklingsvägar som passar dig\n• 💼 Hur du kan stärka din profil\n\nVad vill du fokusera på först för att ta din karriär till nästa nivå?`;
          
        default:
          return `Hej! Jag är din AI-karriärcoach 🚀\n\nHur kan jag hjälpa dig idag?`;
      }
    };

    if (messages.length === 0) {
      setMessages([{
        id: '1',
        type: 'bot',
        content: getWelcomeMessage(),
        timestamp: new Date()
      }]);
    }
  }, [currentStep, messages.length]);

  const generateSmartResponse = async (message: string): Promise<string> => {
    const messageLower = message.toLowerCase();
    
    // Step-specific responses for upload phase
    if (currentStep === 'upload') {
      if (messageLower.includes('vad händer') || messageLower.includes('analys') || messageLower.includes('process')) {
        return `🔍 **Vår AI-analysprocess**\n\nNär du laddar upp ditt CV händer följande:\n\n1. **📄 CV-parsing** - Vi extraherar all text och struktur\n2. **🧠 AI-analys** - Gemini AI analyserar dina kompetenser\n3. **💼 LinkedIn-koppling** - Vi anrikar med LinkedIn-data\n4. **💰 Marknadsvärdering** - Beräknar ditt marknadsvärde\n5. **🎯 Personlig profil** - Skapar din unika konsultprofil\n\nVill du veta mer om någon specifik del?`;
      }
      
      if (messageLower.includes('cv') && (messageLower.includes('tips') || messageLower.includes('förbättra'))) {
        return `📝 **CV-optimeringstips**\n\n• **Tydlig struktur** - Använd rubriker och punktlistor\n• **Kvantifiera resultat** - "Ökade försäljningen med 25%"\n• **Nyckelord** - Inkludera relevanta tekniska termer\n• **Senaste först** - Omvänd kronologisk ordning\n• **Konkreta exempel** - Visa vad du åstadkommit\n• **Rätt längd** - 1-2 sidor för erfarna, max 1 för nybörjare\n\nVill du ha specifika tips för din bransch?`;
      }
      
      if (messageLower.includes('linkedin')) {
        return `🎯 **LinkedIn-optimering**\n\n• **Professionell profilbild** - Ökar visningar med 21x\n• **Övertygande rubrik** - Mer än bara jobbtitel\n• **Sammanfattning** - Berätta din historia i 3-5 meningar\n• **Kompetenser** - Lägg till minst 5 relevanta skills\n• **Rekommendationer** - Be kollegor om endorsements\n• **Aktivitet** - Dela insikter och kommentera inlägg\n\nVill du ha konkreta exempel på rubriker eller sammanfattningar?`;
      }
    }
    
    // Step-specific responses for analyzing phase
    if (currentStep === 'analyzing') {
      if (messageLower.includes('vad händer') || messageLower.includes('analys')) {
        return `⚡ **Pågående AI-analys**\n\nJust nu arbetar vår AI med:\n\n🔍 **Kompetensextraktion** - Identifierar dina tekniska färdigheter\n💰 **Marknadsvärdering** - Jämför med marknadsdata\n🎯 **Profilmatchning** - Analyserar mot jobbmarknadens behov\n📊 **Certifieringsanalys** - Föreslår värdefulla certifieringar\n🚀 **Karriärvägar** - Kartlägger utvecklingsmöjligheter\n\nAnalysen är snart klar! Vad är du mest nyfiken på?`;
      }
      
      if (messageLower.includes('hur lång') || messageLower.includes('tid')) {
        return `⏱️ **Analystid**\n\nVår avancerade AI-analys tar vanligtvis:\n• **30-60 sekunder** för grundanalys\n• **Extra tid** om du har mycket erfarenhet\n• **LinkedIn-anrikning** kan ta ytterligare 15-30 sek\n\nJu mer data du ger oss, desto bättre blir resultatet! Tålamod - det blir värt väntan! 🎯`;
      }
    }
    
    // Step-specific responses for complete phase
    if (currentStep === 'complete' && analysisResults) {
      if (messageLower.includes('lön') || messageLower.includes('marknadsvärde') || messageLower.includes('ersättning')) {
        const currentRate = analysisResults.consultant?.market_rate_current || 'ej beräknad';
        const optimizedRate = analysisResults.consultant?.market_rate_optimized || 'ej beräknad';
        
        return `💰 **Din marknadsvärdering**\n\n📊 **Nuvarande marknadsvärde:** ${currentRate !== 'ej beräknad' ? currentRate + ' kr/tim' : 'Behöver mer data'}\n🚀 **Optimerat värde:** ${optimizedRate !== 'ej beräknad' ? optimizedRate + ' kr/tim' : 'Kräver certifieringar'}\n\n**Tips för att öka ditt värde:**\n• Skaffa relevanta certifieringar\n• Bygg upp thought leadership\n• Specialisera dig inom efterfrågade områden\n• Dokumentera dina framgångar bättre\n\nVill du ha specifika råd för din situation?`;
      }
      
      if (messageLower.includes('certifiering') || messageLower.includes('utbildning')) {
        const certs = analysisResults.consultant?.certification_recommendations || [];
        
        return `🎓 **Rekommenderade certifieringar för dig**\n\n${certs.length > 0 ? 
          certs.slice(0, 5).map((cert, i) => `${i + 1}. ${cert}`).join('\n') : 
          '• AWS Solutions Architect\n• Microsoft Azure Fundamentals\n• Google Cloud Professional\n• Scrum Master Certification\n• ITIL Foundation'
        }\n\n**Varför certifieringar?**\n• Ökar din marknadslön\n• Visar upp-to-date kunskaper\n• Ger konkurrensfördel\n• Öppnar nya möjligheter\n\nVill du veta mer om någon specifik certifiering?`;
      }
      
      if (messageLower.includes('styrkor') || messageLower.includes('kompetens') || messageLower.includes('skills')) {
        const skills = analysisResults.consultant?.skills || analysisResults.consultant?.primary_tech_stack || [];
        
        return `💪 **Dina identifierade styrkor**\n\n🎯 **Tekniska kompetenser:**\n${skills.slice(0, 8).map((skill, i) => `• ${skill}`).join('\n')}\n\n**Så använder du detta:**\n• Framhäv dessa i din LinkedIn-profil\n• Använd som nyckelord i jobbansökningar\n• Bygg vidare på dina starkaste områden\n• Kombinera för unika specialiseringar\n\nVill du veta hur du kan utveckla någon av dessa kompetenser vidare?`;
      }
    }
    
    // General career advice
    if (messageLower.includes('karriär') || messageLower.includes('utveckling') || messageLower.includes('framtid')) {
      return `🚀 **Karriärutveckling inom tech**\n\n**Trender 2024-2025:**\n• AI/ML-kompetens - Enormt efterfrågat\n• Cloud-arkitektur - Fortsatt stark tillväxt\n• DevSecOps - Säkerhet integrerat i utveckling\n• Data Engineering - Mer kritiskt än någonsin\n• Sustainability Tech - Växande fokusområde\n\n**Utvecklingsstrategier:**\n• Specialisera dig inom 2-3 områden\n• Kombinera teknisk och business-förståelse\n• Bygg ett starkt nätverk\n• Dokumentera dina framgångar\n\nVilken riktning känns mest intressant för dig?`;
    }
    
    if (messageLower.includes('nätverk') || messageLower.includes('kontakter')) {
      return `🤝 **Nätverksbyggande för konsulter**\n\n**Digitala kanaler:**\n• LinkedIn - Delta i diskussioner, dela insikter\n• GitHub - Visa upp dina projekt\n• Meetups - Träffa likasinnade utvecklare\n• Konferenser - Både fysiska och virtuella\n\n**Offline-strategier:**\n• User groups inom din teknik\n• Branschföreningar\n• Mentorskap - både som mentor och mentee\n• Tidigare kollegor - håll kontakten\n\n**Pro-tips:**\n• Ge värde först, fråga om hjälp senare\n• Följ upp konversationer\n• Var äkta och genuin\n\nVill du ha hjälp att identifiera relevanta nätverk för din profil?`;
    }

    // Fallback to AI assistant for complex queries
    try {
      const context = {
        analysisResults,
        currentStep,
        hasAnalysis: !!analysisResults,
        profileSummary: analysisResults?.consultant ? {
          name: analysisResults.consultant.name,
          title: analysisResults.consultant.title,
          experience_years: analysisResults.consultant.experience_years,
          skills: analysisResults.consultant.primary_tech_stack || analysisResults.consultant.skills,
          market_rate: analysisResults.consultant.market_rate_current,
          certifications: analysisResults.consultant.certification_recommendations,
          thought_leadership: analysisResults.consultant.thought_leadership_score
        } : null
      };

      const { data, error } = await supabase.functions.invoke('matchwise-chat', {
        body: {
          message: message,
          context: context,
          role: 'cv_career_coach'
        }
      });

      if (error) throw error;
      return data.response || 'Jag har lite problem att svara just nu. Kan du ställa frågan på ett annat sätt?';
    } catch (error: any) {
      console.error('Chat error:', error);
      return `Som din karriärcoach kan jag hjälpa dig med:\n\n📋 **CV & Profil** - Optimering och förbättringar\n💰 **Marknadsvärde** - Löneförhandling och positionering\n🎓 **Kompetensutveckling** - Certifieringar och utbildning\n🚀 **Karriärplanering** - Nästa steg i din utveckling\n🤝 **Nätverksbyggande** - Strategier för att bygga kontakter\n\nVad vill du fokusera på?`;
    }
  };

  const sendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      const response = await generateSmartResponse(currentMessage);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error: any) {
      console.error('Chat error:', error);
      toast.error('Fel vid kommunikation med AI-karriärcoachen');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Ursäkta, jag har problem att svara just nu. Försök igen om en stund.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleMinimizeToggle = () => {
    if (onToggleMinimize) {
      onToggleMinimize();
    } else {
      setMinimized(!minimized);
    }
  };

  // Quick action suggestions based on current step
  const getQuickActions = () => {
    switch (currentStep) {
      case 'upload':
        return [
          { label: 'Analysprocessen', icon: Brain },
          { label: 'CV-tips', icon: FileText },
          { label: 'LinkedIn-optimering', icon: TrendingUp }
        ];
      case 'analyzing':
        return [
          { label: 'Vad händer nu?', icon: Brain },
          { label: 'Hur lång tid tar det?', icon: Upload },
          { label: 'Vad får jag för resultat?', icon: Lightbulb }
        ];
      case 'complete':
        return [
          { label: 'Mitt marknadsvärde', icon: TrendingUp },
          { label: 'Certifieringsråd', icon: FileText },
          { label: 'Karriärutveckling', icon: Lightbulb }
        ];
      default:
        return [
          { label: 'Karriärrådgivning', icon: TrendingUp },
          { label: 'Kompetensutveckling', icon: Brain },
          { label: 'Nätverksbyggande', icon: Lightbulb }
        ];
    }
  };

  if (minimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={handleMinimizeToggle}
          className="rounded-full w-16 h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 hover:from-blue-700 hover:via-purple-700 hover:to-emerald-700 text-white shadow-2xl border-2 border-white/20 backdrop-blur-sm"
        >
          <MessageCircle className="h-7 w-7" />
        </Button>
      </div>
    );
  }

  return (
    <Card className="h-[650px] flex flex-col shadow-2xl border-0 bg-gradient-to-br from-white to-slate-50/50 backdrop-blur-xl">
      <CardHeader className="flex-shrink-0 bg-gradient-to-r from-blue-50 via-purple-50 to-emerald-50 border-b border-slate-200/50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <div className="relative">
              <Brain className="h-6 w-6 text-blue-600" />
              <Sparkles className="h-3 w-3 text-emerald-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent font-bold">
              AI Karriärcoach
            </span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMinimizeToggle}
            className="hover:bg-white/60 rounded-full"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-slate-600 font-medium">
          {currentStep === 'upload' && 'Redo att hjälpa dig genom CV-analysen'}
          {currentStep === 'analyzing' && 'Analyserar din profil med AI...'}
          {currentStep === 'complete' && 'Personlig karriärvägledning baserat på din analys'}
        </p>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Quick Actions */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex flex-wrap gap-2">
            {getQuickActions().map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentMessage(action.label)}
                  className="flex items-center gap-2 text-xs"
                >
                  <Icon className="h-3 w-3" />
                  {action.label}
                </Button>
              );
            })}
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div className={`flex gap-3 max-w-[85%] ${
                  message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}>
                  <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-lg ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                      : 'bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 text-white'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  
                  <div className={`p-4 rounded-2xl shadow-sm border ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white ml-auto border-blue-200'
                      : 'bg-white text-slate-900 border-slate-200/60 backdrop-blur-sm'
                  }`}>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>
                    <div className={`text-xs mt-2 opacity-75 ${
                      message.type === 'user' ? 'text-blue-100' : 'text-slate-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 text-white flex items-center justify-center shadow-lg">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/60 shadow-sm backdrop-blur-sm">
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                      <span>Karriärcoachen tänker...</span>
                      <Sparkles className="h-4 w-4 text-emerald-500 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <div className="border-t border-slate-200/50 p-4 flex-shrink-0 bg-gradient-to-r from-slate-50/50 to-white/50 backdrop-blur-sm">
          <div className="flex gap-3">
            <Input
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Fråga om din karriärutveckling..."
              disabled={isLoading}
              className="flex-1 border-slate-300/60 focus:border-blue-400 focus:ring-blue-400/20 bg-white/80 backdrop-blur-sm"
            />
            <Button 
              onClick={sendMessage}
              disabled={!currentMessage.trim() || isLoading}
              size="sm"
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 hover:from-blue-700 hover:via-purple-700 hover:to-emerald-700 text-white shadow-lg border-0 px-6"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <div className="mt-3 text-xs text-slate-500 bg-slate-100/60 rounded-lg p-2 border border-slate-200/40">
            💡 Tips: Fråga om "CV-optimering", "Marknadsvärde" eller "Certifieringar"
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
