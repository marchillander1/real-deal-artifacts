import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, Bot, User, X, Sparkles, Zap } from 'lucide-react';
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
  // Clean up the text and convert markdown to JSX
  return text
    // Remove excessive formatting symbols
    .replace(/#{1,6}\s*/g, '')
    .replace(/\*{2,}/g, '')
    .replace(/_{2,}/g, '')
    
    // Convert headers to clean formatting
    .replace(/^(.+)$/gm, (match, p1) => {
      if (p1.trim().length < 50 && !p1.includes('.') && !p1.includes(',')) {
        return `<h3 class="text-md font-semibold text-gray-800 mb-2 mt-3">${p1.trim()}</h3>`;
      }
      return match;
    })
    
    // Clean bullet points with emojis
    .replace(/^[✅🔗🎯📈💬🧩🚀🤝👑🏢🔍📊🧠💡💰🏆📱🔑📖🔄💼🤖]\s*(.*$)/gm, '<li class="ml-4 mb-1 text-gray-700">• $1</li>')
    .replace(/^-\s*(.*$)/gm, '<li class="ml-4 mb-1 text-gray-700">• $1</li>')
    
    // Clean horizontal rules
    .replace(/^---+$/gm, '<hr class="my-3 border-gray-200">')
    
    // Convert line breaks
    .replace(/\n\n/g, '</p><p class="mb-2 text-gray-700">')
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
      text: `👋 **Welcome to MatchWise AI!**

I'm your personal consultant career advisor, powered by advanced AI.

**🚀 What I can help you with:**

💼 **Career Development** - Technical progression strategies  
💰 **Market Positioning** - Competitive rates & negotiation  
📊 **Profile Optimization** - CV and LinkedIn enhancement  
🎯 **Skill Development** - High-value certifications & technologies  
🤝 **Client Relations** - Business development strategies

*Ask me anything about advancing your consulting career!*`,
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

  // Auto-fill context from analysis results
  useEffect(() => {
    if (analysisResults?.cvAnalysis && messages.length === 1) {
      const cv = analysisResults.cvAnalysis;
      let contextMessage = "🎉 **Analysis Complete!** ";
      
      if (cv.personalInfo?.name) {
        contextMessage += `Welcome ${cv.personalInfo.name}! `;
      }
      
      if (cv.professionalSummary?.currentRole) {
        contextMessage += `\n\nAs a **${cv.professionalSummary.currentRole}** `;
      }
      
      if (cv.professionalSummary?.yearsOfExperience) {
        contextMessage += `with ${cv.professionalSummary.yearsOfExperience} years of experience, `;
      }
      
      if (cv.marketPositioning?.hourlyRateEstimate?.recommended) {
        contextMessage += `\n\n💰 **Your market rate:** ${cv.marketPositioning.hourlyRateEstimate.recommended} SEK/hour\n`;
      }
      
      contextMessage += "\n🎯 **Ready to help you maximize your consulting potential!**\n\n*What would you like to focus on first?*";
      
      const contextMsg: Message = {
        id: '2',
        text: contextMessage,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, contextMsg]);
    }
  }, [analysisResults]);

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
      // Prepare detailed context from analysis results
      let context = '';
      if (analysisResults?.cvAnalysis) {
        const cv = analysisResults.cvAnalysis;
        context += `User's CV data: `;
        
        if (cv.personalInfo?.name) context += `Name: ${cv.personalInfo.name}. `;
        if (cv.personalInfo?.email) context += `Email: ${cv.personalInfo.email}. `;
        if (cv.personalInfo?.location) context += `Location: ${cv.personalInfo.location}. `;
        
        if (cv.professionalSummary?.currentRole) {
          context += `Current role: ${cv.professionalSummary.currentRole}. `;
        }
        if (cv.professionalSummary?.yearsOfExperience) {
          context += `Experience: ${cv.professionalSummary.yearsOfExperience} years. `;
        }
        if (cv.professionalSummary?.seniorityLevel) {
          context += `Seniority level: ${cv.professionalSummary.seniorityLevel}. `;
        }
        
        if (cv.technicalSkillsAnalysis?.programmingLanguages?.expert?.length > 0) {
          context += `Expert skills: ${cv.technicalSkillsAnalysis.programmingLanguages.expert.join(', ')}. `;
        }
        if (cv.technicalSkillsAnalysis?.programmingLanguages?.proficient?.length > 0) {
          context += `Proficient skills: ${cv.technicalSkillsAnalysis.programmingLanguages.proficient.join(', ')}. `;
        }
        
        if (cv.marketPositioning?.hourlyRateEstimate?.recommended) {
          context += `Recommended hourly rate: ${cv.marketPositioning.hourlyRateEstimate.recommended} SEK/hour. `;
        }
        
        if (cv.careerPotential?.currentLevel) {
          context += `Career level: ${cv.careerPotential.currentLevel}. `;
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
        text: 'Sorry, I could not respond right now. Please try again later.',
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
    "What can you do?"
  ];

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={onToggleMinimize}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full w-16 h-16 shadow-xl border-4 border-white/30 transition-all duration-300 hover:scale-110 hover:shadow-2xl"
        >
          <div className="relative">
            <MessageCircle className="h-6 w-6" />
            <Sparkles className="h-3 w-3 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
          </div>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="h-[600px] flex flex-col shadow-2xl border-0 bg-white backdrop-blur-sm overflow-hidden">
        <CardHeader className="border-b bg-gradient-to-r from-purple-600 to-blue-600 text-white flex flex-row items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">MatchWise AI</CardTitle>
              <p className="text-xs text-purple-100 font-medium">Your Career Advisor</p>
            </div>
            <Zap className="h-4 w-4 text-yellow-300 animate-pulse ml-2" />
          </div>
          {onToggleMinimize && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleMinimize}
              className="h-8 w-8 p-0 hover:bg-white/20 text-white rounded-full transition-colors"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0 bg-gradient-to-b from-gray-50/50 to-white">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 transition-all duration-200 hover:shadow-lg ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-900 border border-gray-100 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {message.sender === 'bot' && (
                      <div className="relative flex-shrink-0">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                          <Bot className="h-4 w-4 text-purple-600" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full"></div>
                      </div>
                    )}
                    {message.sender === 'user' && (
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 opacity-90" />
                      </div>
                    )}
                    <div 
                      className="text-sm leading-relaxed flex-1"
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
                <div className="bg-white border border-gray-100 rounded-2xl p-4 max-w-[85%] shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length <= 2 && (
            <div className="p-4 border-t bg-gradient-to-r from-gray-50 to-purple-50/30">
              <p className="text-xs text-gray-600 mb-3 font-medium flex items-center gap-2">
                <Sparkles className="h-3 w-3 text-purple-500" />
                Quick start questions:
              </p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickQuestion(question)}
                    className="text-xs h-8 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 transition-all duration-200 hover:shadow-sm rounded-full"
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
                placeholder="Ask me about your consulting career..."
                disabled={isLoading}
                className="flex-1 border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-full h-12 px-4"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6 transition-all duration-200 hover:shadow-lg rounded-full h-12"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
