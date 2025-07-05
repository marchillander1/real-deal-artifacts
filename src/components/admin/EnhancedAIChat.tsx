
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  BarChart3,
  Users,
  Target,
  Loader2,
  Brain
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  context?: 'analytics' | 'user_management' | 'consultant_management' | 'general';
}

interface ChatProps {
  consultants?: any[];
  assignments?: any[];
  matches?: any[];
}

export const EnhancedAIChat: React.FC<ChatProps> = ({ 
  consultants = [], 
  assignments = [], 
  matches = [] 
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: `Hej! Jag är din AI-assistent för admin-portalen 🤖\n\nJag kan hjälpa dig med:\n• 📊 Analys av plattformsdata och trender\n• 👥 Användarhantering och roller\n• 🎯 Konsulthantering och optimeringar\n• 📈 Rapporter och insikter\n• 🔧 Plattformsadministration\n\nVad kan jag hjälpa dig med idag?`,
      timestamp: new Date(),
      context: 'general'
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Generate context-aware responses based on admin data
  const generateContextualResponse = async (message: string): Promise<string> => {
    const messageLower = message.toLowerCase();
    
    // Analytics queries
    if (messageLower.includes('statistik') || messageLower.includes('analys') || messageLower.includes('rapport')) {
      const stats = {
        totalConsultants: consultants.length,
        activeConsultants: consultants.filter(c => c.availability === 'Available').length,
        totalAssignments: assignments.length,
        totalMatches: matches.length,
        successfulMatches: matches.filter(m => m.status === 'accepted').length,
        avgMatchScore: matches.length > 0 ? Math.round(matches.reduce((sum, m) => sum + (m.match_score || 0), 0) / matches.length) : 0
      };

      return `📊 **Plattformsstatistik**\n\n🏢 **Konsulter:** ${stats.totalConsultants} totalt (${stats.activeConsultants} aktiva)\n📋 **Uppdrag:** ${stats.totalAssignments} skapade\n🎯 **Matchningar:** ${stats.totalMatches} totalt (${stats.successfulMatches} lyckade)\n📈 **Framgångsgrad:** ${stats.totalMatches > 0 ? Math.round((stats.successfulMatches / stats.totalMatches) * 100) : 0}%\n⭐ **Snitt matchning:** ${stats.avgMatchScore} poäng\n\nVill du ha mer detaljerad analys av något specifikt område?`;
    }

    // User management queries
    if (messageLower.includes('användare') || messageLower.includes('user') || messageLower.includes('hantera')) {
      return `👥 **Användarhantering**\n\nHär är vad du kan göra:\n• Lägga till nya användare\n• Ändra användarroller (admin/user)\n• Inaktivera användarkonton\n• Se användaraktivitet\n\nVill du att jag guidar dig genom någon specifik åtgärd?`;
    }

    // Consultant management queries
    if (messageLower.includes('konsult') || messageLower.includes('publicera') || messageLower.includes('profil')) {
      const publishedCount = consultants.filter(c => c.is_published).length;
      const unpublishedCount = consultants.length - publishedCount;
      
      return `🎯 **Konsulthantering**\n\n📊 Status:\n• ${publishedCount} publicerade profiler\n• ${unpublishedCount} opublicerade profiler\n\nDu kan:\n• Publicera/dölja konsultprofiler\n• Ta bort inaktiva konsulter\n• Granska profilkvalitet\n• Exportera konsultlistor\n\nVill du se specifika rekommendationer?`;
    }

    // Skills and technology queries
    if (messageLower.includes('kompetens') || messageLower.includes('teknik') || messageLower.includes('skill')) {
      const topSkills = consultants
        .flatMap(c => c.skills || [])
        .reduce((acc, skill) => {
          acc[skill] = (acc[skill] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
      
      const sortedSkills = Object.entries(topSkills)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);

      return `🔧 **Kompetensanalys**\n\nPopuläraste kompetenser:\n${sortedSkills.map(([skill, count], index) => `${index + 1}. ${skill} (${count} konsulter)`).join('\n')}\n\nDetta kan hjälpa dig att:\n• Identifiera kompetensbrister\n• Fokusera rekrytering\n• Förstå marknadstrender\n\nVill du se mer detaljerad kompetensfördelning?`;
    }

    // Optimization suggestions
    if (messageLower.includes('förbättra') || messageLower.includes('optimera') || messageLower.includes('tips')) {
      const suggestions = [];
      
      if (matches.length > 0) {
        const avgScore = matches.reduce((sum, m) => sum + (m.match_score || 0), 0) / matches.length;
        if (avgScore < 80) {
          suggestions.push('🎯 Förbättra matchningsalgoritmen - snittet är ' + Math.round(avgScore) + '%');
        }
      }
      
      const unpublished = consultants.filter(c => !c.is_published).length;
      if (unpublished > 0) {
        suggestions.push(`📝 ${unpublished} konsulter behöver publiceras`);
      }
      
      const incompleteProfiles = consultants.filter(c => !c.skills || c.skills.length < 3).length;
      if (incompleteProfiles > 0) {
        suggestions.push(`✏️ ${incompleteProfiles} profiler behöver kompletteras`);
      }

      return `💡 **Optimeringsförslag**\n\n${suggestions.length > 0 ? suggestions.join('\n') : '🎉 Allt ser bra ut! Plattformen fungerar optimalt.'}\n\nVill du att jag hjälper dig implementera någon av dessa förbättringar?`;
    }

    // Fallback to AI assistant
    try {
      const context = {
        platformStats: {
          consultants: consultants.length,
          assignments: assignments.length,
          matches: matches.length
        },
        isAdmin: true,
        currentPage: 'admin'
      };

      const { data, error } = await supabase.functions.invoke('matchwise-chat', {
        body: {
          message: message,
          context: context,
          role: 'admin_assistant'
        }
      });

      if (error) throw error;
      return data.response || 'Jag har problem att svara just nu. Prova att ställa en mer specifik fråga om plattformen.';
    } catch (error) {
      return `Som admin-assistent kan jag hjälpa dig med:\n\n📊 **Analytics**: "Visa statistik", "Analys av matchningar"\n👥 **Användare**: "Hantera användare", "Användarroller"\n🎯 **Konsulter**: "Konsulthantering", "Publicerade profiler"\n🔧 **Optimering**: "Förbättringsförslag", "Plattformstips"\n\nVad vill du veta mer om?`;
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
      const response = await generateContextualResponse(currentMessage);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response,
        timestamp: new Date(),
        context: currentMessage.toLowerCase().includes('statistik') ? 'analytics' : 'general'
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Fel vid kommunikation med AI-assistenten');
      
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

  const quickActions = [
    { label: 'Visa statistik', icon: BarChart3 },
    { label: 'Hantera användare', icon: Users },
    { label: 'Konsulthantering', icon: Target },
    { label: 'Förbättringsförslag', icon: Sparkles }
  ];

  return (
    <Card className="h-[700px] flex flex-col">
      <CardHeader className="flex-shrink-0 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-slate-200">
        <CardTitle className="flex items-center gap-3">
          <div className="relative">
            <Brain className="h-6 w-6 text-blue-600" />
            <Sparkles className="h-3 w-3 text-purple-500 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
            AI Admin-Assistent
          </span>
        </CardTitle>
        <p className="text-sm text-slate-600 font-medium">
          Intelligent support för plattformsadministration
        </p>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Quick Actions */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, index) => {
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

        {/* Messages */}
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
                  <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-md ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
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
                      : 'bg-white text-slate-900 border-slate-200'
                  }`}>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className={`text-xs opacity-75 ${
                        message.type === 'user' ? 'text-blue-100' : 'text-slate-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                      {message.context && message.type === 'bot' && (
                        <Badge variant="secondary" className="text-xs">
                          {message.context}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center justify-center shadow-md">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                      <span>AI-assistenten tänker...</span>
                      <Sparkles className="h-4 w-4 text-purple-500 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        {/* Input */}
        <div className="border-t border-slate-200 p-4 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex gap-3">
            <Input
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Fråga om analytics, användarhantering, optimering..."
              disabled={isLoading}
              className="flex-1 border-slate-300 focus:border-blue-400 focus:ring-blue-400 bg-white"
            />
            <Button 
              onClick={sendMessage}
              disabled={!currentMessage.trim() || isLoading}
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md border-0 px-6"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <div className="mt-3 text-xs text-slate-500 bg-slate-100 rounded-lg p-2 border border-slate-200">
            💡 Fråga: "Visa statistik", "Hantera användare", "Förbättringsförslag" eller "Konsulthantering"
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
