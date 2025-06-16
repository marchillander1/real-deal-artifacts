
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

const formatMarkdown = (text: string) => {
  // Convert markdown to JSX
  return text
    // Headers
    .replace(/^# (.*$)/gm, '<h1 class="text-xl font-bold text-gray-900 mb-3">$1</h1>')
    .replace(/^## (.*$)/gm, '<h2 class="text-lg font-semibold text-gray-800 mb-2 mt-4">$1</h2>')
    .replace(/^### (.*$)/gm, '<h3 class="text-md font-medium text-gray-700 mb-2 mt-3">$1</h3>')
    
    // Bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    
    // Bullet points
    .replace(/^- (.*$)/gm, '<li class="ml-4 mb-1">• $1</li>')
    .replace(/^✅ (.*$)/gm, '<li class="ml-4 mb-1 text-green-700">✅ $1</li>')
    .replace(/^🔗 (.*$)/gm, '<li class="ml-4 mb-1 text-blue-700">🔗 $1</li>')
    .replace(/^🎯 (.*$)/gm, '<li class="ml-4 mb-1 text-purple-700">🎯 $1</li>')
    .replace(/^📈 (.*$)/gm, '<li class="ml-4 mb-1 text-green-700">📈 $1</li>')
    .replace(/^💬 (.*$)/gm, '<li class="ml-4 mb-1 text-blue-700">💬 $1</li>')
    .replace(/^🧩 (.*$)/gm, '<li class="ml-4 mb-1 text-purple-700">🧩 $1</li>')
    .replace(/^🚀 (.*$)/gm, '<li class="ml-4 mb-1 text-orange-700">🚀 $1</li>')
    .replace(/^🤝 (.*$)/gm, '<li class="ml-4 mb-1 text-green-700">🤝 $1</li>')
    .replace(/^👑 (.*$)/gm, '<li class="ml-4 mb-1 text-yellow-700">👑 $1</li>')
    .replace(/^🏢 (.*$)/gm, '<li class="ml-4 mb-1 text-gray-700">🏢 $1</li>')
    .replace(/^🔍 (.*$)/gm, '<li class="ml-4 mb-1 text-blue-700">🔍 $1</li>')
    .replace(/^📊 (.*$)/gm, '<li class="ml-4 mb-1 text-green-700">📊 $1</li>')
    .replace(/^🧠 (.*$)/gm, '<li class="ml-4 mb-1 text-purple-700">🧠 $1</li>')
    .replace(/^💡 (.*$)/gm, '<li class="ml-4 mb-1 text-yellow-700">💡 $1</li>')
    .replace(/^💰 (.*$)/gm, '<li class="ml-4 mb-1 text-green-700">💰 $1</li>')
    .replace(/^🏆 (.*$)/gm, '<li class="ml-4 mb-1 text-yellow-700">🏆 $1</li>')
    .replace(/^📱 (.*$)/gm, '<li class="ml-4 mb-1 text-blue-700">📱 $1</li>')
    .replace(/^🔑 (.*$)/gm, '<li class="ml-4 mb-1 text-orange-700">🔑 $1</li>')
    .replace(/^📖 (.*$)/gm, '<li class="ml-4 mb-1 text-gray-700">📖 $1</li>')
    .replace(/^🔄 (.*$)/gm, '<li class="ml-4 mb-1 text-blue-700">🔄 $1</li>')
    .replace(/^💼 (.*$)/gm, '<li class="ml-4 mb-1 text-gray-700">💼 $1</li>')
    .replace(/^🤖 (.*$)/gm, '<li class="ml-4 mb-1 text-purple-700">🤖 $1</li>')
    
    // Horizontal rules
    .replace(/^---$/gm, '<hr class="my-4 border-gray-200">')
    
    // Line breaks
    .replace(/\n\n/g, '</p><p class="mb-2">')
    .replace(/\n/g, '<br>');
};

export const MatchWiseChat: React.FC<MatchWiseChatProps> = ({ 
  analysisResults, 
  isMinimized = false, 
  onToggleMinimize 
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `# Hello! I'm the MatchWise AI assistant 🤖

I can help you with questions about MatchWise and give tips to improve your CV and LinkedIn profile.

**What can I help you with today?**`,
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
        context = `CV uploaded. `;
        if (cv.professionalSummary?.currentRole) {
          context += `Current role: ${cv.professionalSummary.currentRole}. `;
        }
        if (cv.professionalSummary?.yearsOfExperience) {
          context += `Experience: ${cv.professionalSummary.yearsOfExperience}. `;
        }
        if (cv.technicalExpertise?.programmingLanguages?.expert?.length > 0) {
          context += `Expert skills: ${cv.technicalExpertise.programmingLanguages.expert.join(', ')}. `;
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
      toast.error('Could not send message. Please try again.');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I couldn\'t respond right now. Please try again later.',
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
    "What is MatchWise?",
    "How does the CV analysis work?",
    "Tips to improve my CV",
    "What happens after I submit my CV?",
    "How do you match consultants with assignments?"
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
          <CardTitle className="text-lg">MatchWise AI Assistant</CardTitle>
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
                className={`max-w-[85%] rounded-lg p-4 ${
                  message.sender === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-50 text-gray-900 border'
                }`}
              >
                <div className="flex items-start gap-3">
                  {message.sender === 'bot' && (
                    <Bot className="h-5 w-5 mt-1 text-purple-600 flex-shrink-0" />
                  )}
                  {message.sender === 'user' && (
                    <User className="h-5 w-5 mt-1 flex-shrink-0" />
                  )}
                  <div 
                    className="text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: message.sender === 'bot' ? formatMarkdown(message.text) : message.text 
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-50 border rounded-lg p-4 max-w-[85%]">
                <div className="flex items-center gap-3">
                  <Bot className="h-5 w-5 text-purple-600" />
                  <div className="text-sm text-gray-600">Thinking...</div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <div className="p-4 border-t bg-gray-50">
            <p className="text-xs text-gray-600 mb-3 font-medium">Popular questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickQuestion(question)}
                  className="text-xs h-8 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200"
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t bg-white">
          <div className="flex gap-3">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about MatchWise..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-purple-600 hover:bg-purple-700 px-4"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
