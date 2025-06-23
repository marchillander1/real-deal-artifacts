
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Minimize2, User, Bot, Loader2, Brain, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface MatchWiseChatProps {
  analysisResults?: any;
  isMinimized?: boolean;
  showWelcome?: boolean;
  onToggleMinimize?: () => void;
}

export const MatchWiseChat: React.FC<MatchWiseChatProps> = ({ 
  analysisResults, 
  isMinimized = false,
  showWelcome = false,
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
    const welcomeMessage = showWelcome ? 
      `Hi! I'm your AI Career Coach at MatchWise.tech 🚀\n\nI'm here to help you throughout your CV upload and analysis journey!\n\nWhile you're uploading your CV, feel free to ask me:\n• Questions about the analysis process\n• Career advice and guidance\n• Tips for CV optimization\n• LinkedIn profile improvements\n• Market insights and positioning\n\nOnce your analysis is complete, I'll have even more personalized insights to share with you!` :
      `Hi! I'm your AI Career Coach at MatchWise.tech 🚀\n\nI've analyzed your profile and I'm here to provide personalized career guidance based on your specific skills, experience, and goals.\n\nWhat would you like to know? I can help with:\n• Career progression advice\n• Certification recommendations\n• Market rate optimization\n• Skills development planning\n• LinkedIn profile tips\n• Professional perception insights`;

    if (messages.length === 0) {
      setMessages([{
        id: '1',
        type: 'bot',
        content: welcomeMessage,
        timestamp: new Date()
      }]);
    }
  }, [showWelcome, messages.length]);

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
      const context = {
        analysisResults,
        hasAnalysis: !!analysisResults,
        profileSummary: analysisResults?.consultant ? {
          name: analysisResults.consultant.name,
          title: analysisResults.consultant.title,
          experience_years: analysisResults.consultant.experience_years,
          skills: analysisResults.consultant.primary_tech_stack || analysisResults.consultant.skills,
          market_rate: analysisResults.consultant.market_rate_current,
          thought_leadership: analysisResults.consultant.thought_leadership_score,
          values: analysisResults.consultant.top_values,
          personality: analysisResults.consultant.personality_traits,
          professional_perception: analysisResults.consultant.cv_analysis_data?.professionalPerception,
          profile_optimization: analysisResults.consultant.cv_analysis_data?.profileOptimization
        } : null
      };

      const { data, error } = await supabase.functions.invoke('matchwise-chat', {
        body: {
          message: currentMessage,
          context: context,
          role: 'career_coach'
        }
      });

      if (error) throw error;

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: data.response || 'I apologize, but I encountered an issue. Please try asking your question again.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error: any) {
      console.error('Chat error:', error);
      toast.error('Failed to get response from AI coach');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.',
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
              AI Career Coach
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
          {showWelcome ? 'Ready to help with your CV analysis journey' : 'Personalized career guidance powered by Gemini AI'}
        </p>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
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
                      <span>AI Coach is thinking...</span>
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
              placeholder="Ask me about your career development..."
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
            💡 Try asking: "How can I improve my market rate?" or "What certifications should I prioritize?"
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
