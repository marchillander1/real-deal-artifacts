
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Bot, 
  Zap, 
  Download, 
  Copy, 
  Calendar,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Clock,
  Settings,
  Users,
  Target
} from 'lucide-react';
import { toast } from 'sonner';

interface AutomationData {
  description: string;
  trigger: string;
  steps: string;
  systems: string;
  errorHandling: string;
  output: string;
  notifications?: string;
  conditions?: string;
}

const questions = [
  {
    key: 'trigger',
    question: 'When should this automation start? (Trigger)',
    placeholder: 'E.g. "When a new consultant registers", "Every Monday at 09:00", "When an assignment is created"...'
  },
  {
    key: 'steps',
    question: 'What should happen, in which order? (Step-by-step flow)',
    placeholder: 'Describe all steps that should be executed automatically...'
  },
  {
    key: 'systems',
    question: 'Which systems, tools, or apps do you want to include? (Systems)',
    placeholder: 'E.g. "MatchWise platform, Slack, email, CRM, LinkedIn"...'
  },
  {
    key: 'errorHandling',
    question: 'What should happen if something goes wrong? (Error handling)',
    placeholder: 'E.g. "Send notification to admin", "Retry after 5 minutes", "Stop and log error"...'
  },
  {
    key: 'output',
    question: 'What should the final result be? (Output)',
    placeholder: 'E.g. "Matched consultants in system", "Report sent to team", "Updated database"...'
  }
];

const optionalQuestions = [
  {
    key: 'notifications',
    question: 'How do you want to be notified when it\'s done? (Notifications)',
    placeholder: 'E.g. "Email to me", "Slack message", "Dashboard update"...'
  },
  {
    key: 'conditions',
    question: 'Any specific conditions or exceptions?',
    placeholder: 'E.g. "Only during business hours", "Only for certain types of assignments"...'
  }
];

export default function Automations() {
  const [currentStep, setCurrentStep] = useState(0);
  const [automationData, setAutomationData] = useState<AutomationData>({
    description: '',
    trigger: '',
    steps: '',
    systems: '',
    errorHandling: '',
    output: '',
    notifications: '',
    conditions: ''
  });
  const [isStarted, setIsStarted] = useState(false);
  const [showOptional, setShowOptional] = useState(false);
  const [optionalStep, setOptionalStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalGoal, setFinalGoal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleStart = () => {
    if (!automationData.description.trim()) {
      toast.error('Please describe what you want to automate first');
      return;
    }
    setIsStarted(true);
  };

  const handleAnswer = (answer: string) => {
    const questionKey = questions[currentStep].key as keyof AutomationData;
    setAutomationData(prev => ({
      ...prev,
      [questionKey]: answer
    }));

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowOptional(true);
    }
  };

  const handleOptionalAnswer = (answer: string) => {
    const questionKey = optionalQuestions[optionalStep].key as keyof AutomationData;
    setAutomationData(prev => ({
      ...prev,
      [questionKey]: answer
    }));

    if (optionalStep < optionalQuestions.length - 1) {
      setOptionalStep(optionalStep + 1);
    } else {
      generateFinalGoal();
    }
  };

  const skipOptional = () => {
    generateFinalGoal();
  };

  const generateFinalGoal = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation (replace with actual OpenAI API call)
    setTimeout(() => {
      const goal = `
**Automation Goal:** ${automationData.description}

**Trigger:** ${automationData.trigger}

**Process Flow:**
${automationData.steps}

**Integrated Systems:**
${automationData.systems}

**Error Handling:**
${automationData.errorHandling}

**Expected Output:**
${automationData.output}

${automationData.notifications ? `**Notifications:** ${automationData.notifications}` : ''}

${automationData.conditions ? `**Conditions & Exceptions:** ${automationData.conditions}` : ''}

**Summary:**
This automation will streamline the process for ${automationData.description.toLowerCase()} by automatically triggering when ${automationData.trigger.toLowerCase()}. The system will execute the defined steps and deliver ${automationData.output.toLowerCase()} with robust error handling in place.
      `.trim();

      setFinalGoal(goal);
      setIsCompleted(true);
      setIsGenerating(false);
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(finalGoal);
    toast.success('Automation copied to clipboard!');
  };

  const downloadPDF = () => {
    toast.success('PDF download started!');
    // Implement PDF generation
  };

  const progress = isStarted ? ((currentStep + 1) / questions.length) * 100 : 0;

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-7xl mx-auto px-6 py-20">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <Zap className="h-16 w-16 mb-4" />
                  <Sparkles className="h-6 w-6 text-yellow-400 absolute -top-1 -right-1 animate-bounce" />
                </div>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Automate your workflow
              </h1>
              
              <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
                Describe your workflow to our AI agent and get a personalized automation blueprint — in just a few minutes.
              </p>
              
              <div className="max-w-2xl mx-auto">
                <Textarea
                  value={automationData.description}
                  onChange={(e) => setAutomationData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Hi! 👋 What would you like to automate today? Describe it briefly in your own words..."
                  className="h-24 text-lg bg-white/90 border-0 shadow-xl"
                />
                
                <Button 
                  onClick={handleStart}
                  size="lg"
                  className="mt-6 bg-white text-blue-600 hover:bg-white/90 text-lg px-8 py-3 h-auto"
                >
                  Start your automation journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Why Automate Section */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Why automate?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Save time, reduce manual errors, and match faster. Automation empowers you to focus on real human connection instead of repetitive tasks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Save Time</h3>
                <p className="text-slate-600">Automate repetitive tasks and focus on value-creating activities.</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Better Matching</h3>
                <p className="text-slate-600">AI-driven precision for perfect workflow matching.</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Human Focus</h3>
                <p className="text-slate-600">Let technology handle the process so you can focus on relationships.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Your automation blueprint is ready! 🎉
            </h1>
            <p className="text-slate-600">
              Download as PDF, copy, or book a session with our team to turn it into a fully working solution.
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-blue-600" />
                Your Complete Automation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 rounded-lg p-6 whitespace-pre-wrap text-sm">
                {finalGoal}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <Button onClick={downloadPDF} className="bg-blue-600 hover:bg-blue-700">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            
            <Button onClick={copyToClipboard} variant="outline">
              <Copy className="mr-2 h-4 w-4" />
              Copy to clipboard
            </Button>
            
            <Button 
              onClick={() => window.open('https://calendly.com/marc-hillander-rbak/30min', '_blank')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Book meeting with our team
            </Button>
          </div>

          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Need help with implementation?</h3>
              <p className="text-slate-600 mb-4">
                Book a free consultation with our automation strategists today.
              </p>
              <Button 
                onClick={() => window.open('https://calendly.com/marc-hillander-rbak/30min', '_blank')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Book free consultation
              </Button>
            </CardContent>
          </Card>

          <div className="text-center mt-6 text-sm text-slate-500">
            If you need help implementing this automation or launching your site, you can book a free consultation with our team!
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-slate-900">Automation Wizard</h1>
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              {showOptional ? 'Optional questions' : `Step ${currentStep + 1} of ${questions.length}`}
            </Badge>
          </div>
          
          <Progress value={progress} className="h-2" />
          
          <div className="mt-2 text-sm text-slate-600">
            {Math.round(progress)}% completed
          </div>
        </div>

        {isGenerating ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Bot className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-pulse" />
              <h2 className="text-xl font-semibold mb-2">AI is generating your automation...</h2>
              <p className="text-slate-600 mb-4">This usually takes 10-30 seconds</p>
              <div className="flex items-center justify-center gap-2">
                <div className="animate-bounce">🤖</div>
                <div className="animate-bounce delay-100">💭</div>
                <div className="animate-bounce delay-200">⚡</div>
              </div>
            </CardContent>
          </Card>
        ) : showOptional ? (
          <OptionalQuestionCard
            question={optionalQuestions[optionalStep]}
            onAnswer={handleOptionalAnswer}
            onSkip={skipOptional}
            isLast={optionalStep === optionalQuestions.length - 1}
          />
        ) : (
          <QuestionCard
            question={questions[currentStep]}
            onAnswer={handleAnswer}
          />
        )}
      </div>
    </div>
  );
}

interface QuestionCardProps {
  question: {
    key: string;
    question: string;
    placeholder: string;
  };
  onAnswer: (answer: string) => void;
}

function QuestionCard({ question, onAnswer }: QuestionCardProps) {
  const [answer, setAnswer] = useState('');

  const handleSubmit = () => {
    if (!answer.trim()) {
      toast.error('Please provide an answer');
      return;
    }
    onAnswer(answer);
    setAnswer('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-blue-600" />
          {question.question}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={question.placeholder}
          className="h-32"
        />
        
        <Button onClick={handleSubmit} className="w-full">
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

interface OptionalQuestionCardProps {
  question: {
    key: string;
    question: string;
    placeholder: string;
  };
  onAnswer: (answer: string) => void;
  onSkip: () => void;
  isLast: boolean;
}

function OptionalQuestionCard({ question, onAnswer, onSkip, isLast }: OptionalQuestionCardProps) {
  const [answer, setAnswer] = useState('');

  const handleSubmit = () => {
    onAnswer(answer);
    setAnswer('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          {question.question}
          <Badge variant="secondary" className="ml-2">Optional</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={question.placeholder}
          className="h-32"
        />
        
        <div className="flex gap-2">
          <Button onClick={handleSubmit} className="flex-1">
            {isLast ? 'Complete & Generate' : 'Next'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          
          <Button onClick={onSkip} variant="outline">
            {isLast ? 'Generate without this' : 'Skip'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
