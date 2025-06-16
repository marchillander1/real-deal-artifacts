
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, Bot, User, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface MatchWiseChatProps {
  analysisResults?: any;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

export const MatchWiseChat: React.FC<MatchWiseChatProps> = ({ 
  analysisResults, 
  isMinimized = false, 
  onToggleMinimize 
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hej! Jag är MatchWise AI-assistenten. Jag kan hjälpa dig med frågor om MatchWise och ge tips för att förbättra ditt CV. Vad kan jag hjälpa dig med?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Prepare context from analysis results
      let context = '';
      if (analysisResults?.cvAnalysis) {
        const cv = analysisResults.cvAnalysis;
        context = `CV laddat upp. `;
        if (cv.professionalSummary?.currentRole) {
          context += `Nuvarande roll: ${cv.professionalSummary.currentRole}. `;
        }
        if (cv.professionalSummary?.yearsOfExperience) {
          context += `Erfarenhet: ${cv.professionalSummary.yearsOfExperience}. `;
        }
        if (cv.technicalExpertise?.programmingLanguages?.expert?.length > 0) {
          context += `Expertkunskaper: ${cv.technicalExpertise.programmingLanguages.expert.join(', ')}. `;
        }
      }

      const { data, error } = await supabase.functions.invoke('matchwise-chat', {
        body: { 
          message: inputMessage,
          context: context 
        }
      });

      if (error) throw error;

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Kunde inte skicka meddelandet. Försök igen.');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Ursäkta, jag kunde inte svara just nu. Försök igen senare.',
        sender: 'bot',
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
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "Vad är MatchWise?",
    "Hur fungerar CV-analysen?",
    "Tips för att förbättra mitt CV",
    "Vad händer efter jag skickat in mitt CV?",
    "Hur matchar ni konsulter med uppdrag?"
  ];

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={onToggleMinimize}
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-full w-14 h-14 shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <Card className="h-96 flex flex-col shadow-xl">
      <CardHeader className="border-b flex flex-row items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-purple-600" />
          <CardTitle className="text-lg">MatchWise AI-assistent</CardTitle>
        </div>
        {onToggleMinimize && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleMinimize}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="flex items-start gap-2">
                  {message.sender === 'bot' && (
                    <Bot className="h-4 w-4 mt-0.5 text-purple-600" />
                  )}
                  {message.sender === 'user' && (
                    <User className="h-4 w-4 mt-0.5" />
                  )}
                  <div className="text-sm">{message.text}</div>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-purple-600" />
                  <div className="text-sm text-gray-600">Skriver...</div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <div className="p-4 border-t bg-gray-50">
            <p className="text-xs text-gray-600 mb-2">Vanliga frågor:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickQuestion(question)}
                  className="text-xs h-7"
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Skriv din fråga här..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
