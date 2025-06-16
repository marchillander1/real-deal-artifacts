
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
      text: `Hello! I'm the MatchWise AI Assistant 🤖

I help you with consulting and career development.

**What can I help you with?**
- Career development and technical progression
- Pricing and negotiation strategies
- CV and LinkedIn optimization  
- Client relations and networking
- MatchWise platform guidance`,
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
      let contextMessage = "👋 I see you've uploaded your CV! ";
      
      if (cv.personalInfo?.name) {
        contextMessage += `Hello ${cv.personalInfo.name}! `;
      }
      
      if (cv.professionalSummary?.currentRole) {
        contextMessage += `As a ${cv.professionalSummary.currentRole} `;
      }
      
      if (cv.professionalSummary?.yearsOfExperience) {
        contextMessage += `with ${cv.professionalSummary.yearsOfExperience} of experience `;
      }
      
      contextMessage += "I can provide you with tailored advice for your career and consulting business.";
      
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
          context += `Experience: ${cv.professionalSummary.yearsOfExperience}. `;
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
    "How to increase my hourly rate?",
    "Tips for improving my CV",
    "Which certifications should I get?",
    "How does MatchWise work?",
    "Career development in tech"
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
          <CardTitle className="text-lg">MatchWise AI</CardTitle>
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
              placeholder="Ask me about consulting..."
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
