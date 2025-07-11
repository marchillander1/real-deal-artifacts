
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
  Target,
  TrendingUp,
  Shield,
  Heart,
  Mail,
  UserCheck,
  FileText,
  BarChart3
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
    question: '1️⃣ When should your automation start?',
    subtitle: 'Trigger',
    placeholder: 'E.g. "When a new consultant registers", "Every Monday at 09:00", "When an assignment is created"...',
    icon: Zap
  },
  {
    key: 'steps',
    question: '2️⃣ What should happen, step by step?',
    subtitle: 'Flow',
    placeholder: 'Describe all steps that should be executed automatically...',
    icon: ArrowRight
  },
  {
    key: 'systems',
    question: '3️⃣ What tools or systems do you want to include?',
    subtitle: 'Systems',
    placeholder: 'E.g. "MatchWise platform, Slack, email, CRM, LinkedIn"...',
    icon: Settings
  },
  {
    key: 'errorHandling',
    question: '4️⃣ What should happen if something goes wrong?',
    subtitle: 'Error handling',
    placeholder: 'E.g. "Send notification to admin", "Retry after 5 minutes", "Stop and log error"...',
    icon: Shield
  },
  {
    key: 'output',
    question: '5️⃣ What should the final result be?',
    subtitle: 'Result',
    placeholder: 'E.g. "Matched consultants in system", "Report sent to team", "Updated database"...',
    icon: Target
  }
];

const optionalQuestions = [
  {
    key: 'notifications',
    question: 'Do you want notifications when it\'s done?',
    subtitle: 'Notifications',
    placeholder: 'E.g. "Email to me", "Slack message", "Dashboard update"...',
    icon: Mail
  },
  {
    key: 'conditions',
    question: 'Are there any special rules or conditions?',
    subtitle: 'Conditions',
    placeholder: 'E.g. "Only during business hours", "Only for certain types of assignments"...',
    icon: FileText
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
        <div className="relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-7xl mx-auto px-6 py-24">
            <div className="text-center">
              <div className="flex items-center justify-center mb-8">
                <div className="relative">
                  <Sparkles className="h-20 w-20 mb-4 text-yellow-300 animate-pulse" />
                  <div className="absolute -inset-2 bg-yellow-300/20 rounded-full animate-ping"></div>
                </div>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                Create more time for 
                <span className="block text-yellow-300">what truly matters</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-4xl mx-auto mb-12 leading-relaxed">
                Automate your workflows, free up energy, and focus on what actually drives impact.
              </p>
              
              <div className="max-w-2xl mx-auto">
                <Textarea
                  value={automationData.description}
                  onChange={(e) => setAutomationData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Hi! 👋 What would you like to automate today? Describe it briefly in your own words..."
                  className="h-28 text-lg bg-white/95 border-0 shadow-2xl rounded-2xl p-6 placeholder:text-muted-foreground/70"
                />
                
                <Button 
                  onClick={handleStart}
                  size="lg"
                  className="mt-8 bg-white text-primary hover:bg-white/90 text-lg px-12 py-4 h-auto rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
                >
                  Explore your possibilities
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Why Automate Section */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
              Why automation?
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                We often say we want more time. But in reality, we get stuck in manual lists, unnecessary clicks, and repetitive tasks.
              </p>
              <p className="text-xl md:text-2xl text-foreground font-medium mt-4 leading-relaxed">
                With true automation, you don't just save hours — you create space for ideas, people, and growth.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-primary/20">
              <CardContent className="pt-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <Clock className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">Save time</h3>
                <p className="text-muted-foreground leading-relaxed">Reclaim hours every week for strategic thinking and meaningful conversations.</p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-primary/20">
              <CardContent className="pt-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <Shield className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">Reduce errors</h3>
                <p className="text-muted-foreground leading-relaxed">Eliminate human mistakes and ensure consistent, reliable results every time.</p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-primary/20">
              <CardContent className="pt-6">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <TrendingUp className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">Scale faster</h3>
                <p className="text-muted-foreground leading-relaxed">Handle more work without proportionally increasing effort or headcount.</p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-primary/20">
              <CardContent className="pt-6">
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <Heart className="h-10 w-10 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">Focus on real value</h3>
                <p className="text-muted-foreground leading-relaxed">Spend energy on creative work, relationships, and decisions that truly matter.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Use Cases Section */}
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                What can you automate?
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Here are a few examples our customers love:
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <span className="text-lg text-foreground leading-relaxed">
                  Automatically send personalized welcome emails to new leads — no manual follow-ups needed.
                </span>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <span className="text-lg text-foreground leading-relaxed">
                  Move new form submissions or signups directly into your CRM, project management tool, or Slack — instantly.
                </span>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <span className="text-lg text-foreground leading-relaxed">
                  Auto-generate weekly reports (e.g., sales, marketing, or project status) and send them to your team on Monday mornings.
                </span>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <span className="text-lg text-foreground leading-relaxed">
                  Collect feedback from customers after meetings or projects, and automatically summarize it into a simple report.
                </span>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <span className="text-lg text-foreground leading-relaxed">
                  Schedule and publish social media posts across different platforms in one click.
                </span>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <span className="text-lg text-foreground leading-relaxed">
                  Sync invoices or payment confirmations to your finance tool without needing to touch Excel manually.
                </span>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <span className="text-lg text-foreground leading-relaxed">
                  Create daily task lists or priority boards automatically based on data from different systems.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30">
        <div className="max-w-5xl mx-auto px-6 py-16">
          {/* Summary Section */}
          <div className="text-center mb-12">
            <div className="relative mb-8">
              <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-6" />
              <div className="absolute -inset-4 bg-green-100/50 rounded-full animate-pulse"></div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Your automation idea is ready!
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Download your plan as a PDF, copy it, or book a call — we'll help you turn your idea into reality.
            </p>
          </div>

          <Card className="mb-12 border-2 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Bot className="h-8 w-8 text-primary" />
                Your Complete Automation Blueprint
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="bg-muted/30 rounded-2xl p-8 whitespace-pre-wrap text-base leading-relaxed">
                {finalGoal}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-6 justify-center mb-16">
            <Button 
              onClick={downloadPDF} 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-lg px-8 py-4 h-auto rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <Download className="mr-3 h-5 w-5" />
              Download PDF
            </Button>
            
            <Button 
              onClick={copyToClipboard} 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-4 h-auto rounded-xl border-2 hover:bg-secondary/50 transition-all"
            >
              <Copy className="mr-3 h-5 w-5" />
              Copy to clipboard
            </Button>
            
            <Button 
              onClick={() => window.open('https://calendly.com/marc-hillander-rbak/30min', '_blank')}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-lg px-8 py-4 h-auto rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <Calendar className="mr-3 h-5 w-5" />
              Book a meeting
            </Button>
          </div>

          {/* Final CTA */}
          <Card className="bg-gradient-to-br from-primary/10 via-secondary/20 to-primary/5 border-2 border-primary/20">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Ready to make it real?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                We help you build smart workflows that free up time and create real value — for you and your team.
              </p>
              <Button 
                onClick={() => window.open('https://calendly.com/marc-hillander-rbak/30min', '_blank')}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-lg px-12 py-4 h-auto rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105"
              >
                <Calendar className="mr-3 h-6 w-6" />
                Let's build it together
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Step-by-Step Guide</h1>
              <p className="text-lg text-muted-foreground">Let's build your automation together</p>
            </div>
            <Badge variant="outline" className="text-primary border-primary/50 px-4 py-2 text-base">
              {showOptional ? 'Optional questions' : `Step ${currentStep + 1} of ${questions.length}`}
            </Badge>
          </div>
          
          <div className="space-y-4">
            <Progress value={progress} className="h-3 bg-secondary" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{Math.round(progress)}% completed</span>
              <span>{showOptional ? 'Almost done!' : `${questions.length - currentStep - 1} questions remaining`}</span>
            </div>
          </div>
        </div>

        {isGenerating ? (
          <Card className="border-2 shadow-2xl">
            <CardContent className="p-16 text-center">
              <div className="relative mb-8">
                <Bot className="h-20 w-20 text-primary mx-auto mb-6 animate-pulse" />
                <div className="absolute -inset-4 bg-primary/10 rounded-full animate-ping"></div>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">AI is generating your automation...</h2>
              <p className="text-lg text-muted-foreground mb-8">This usually takes 10-30 seconds</p>
              <div className="flex items-center justify-center gap-4 text-2xl">
                <div className="animate-bounce">🤖</div>
                <div className="animate-bounce delay-100">💭</div>
                <div className="animate-bounce delay-200">⚡</div>
                <div className="animate-bounce delay-300">✨</div>
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
    subtitle: string;
    placeholder: string;
    icon: any;
  };
  onAnswer: (answer: string) => void;
}

function QuestionCard({ question, onAnswer }: QuestionCardProps) {
  const [answer, setAnswer] = useState('');
  const IconComponent = question.icon;

  const handleSubmit = () => {
    if (!answer.trim()) {
      toast.error('Please provide an answer');
      return;
    }
    onAnswer(answer);
    setAnswer('');
  };

  return (
    <Card className="border-2 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 pb-6">
        <div className="flex items-start gap-4">
          <div className="bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl p-4 flex-shrink-0">
            <IconComponent className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-2xl font-bold text-foreground mb-2">
              {question.question}
            </CardTitle>
            <p className="text-lg text-muted-foreground capitalize">
              {question.subtitle}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        <Textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={question.placeholder}
          className="h-40 text-base resize-none border-2 focus:border-primary/50 rounded-xl p-4"
        />
        
        <Button 
          onClick={handleSubmit} 
          size="lg"
          className="w-full bg-primary hover:bg-primary/90 text-lg py-4 h-auto rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
        >
          Continue to next step
          <ArrowRight className="ml-3 h-6 w-6" />
        </Button>
      </CardContent>
    </Card>
  );
}

interface OptionalQuestionCardProps {
  question: {
    key: string;
    question: string;
    subtitle: string;
    placeholder: string;
    icon: any;
  };
  onAnswer: (answer: string) => void;
  onSkip: () => void;
  isLast: boolean;
}

function OptionalQuestionCard({ question, onAnswer, onSkip, isLast }: OptionalQuestionCardProps) {
  const [answer, setAnswer] = useState('');
  const IconComponent = question.icon;

  const handleSubmit = () => {
    onAnswer(answer);
    setAnswer('');
  };

  return (
    <Card className="border-2 shadow-xl hover:shadow-2xl transition-all duration-300 border-dashed border-purple-200">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 pb-6">
        <div className="flex items-start gap-4">
          <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl p-4 flex-shrink-0">
            <IconComponent className="h-8 w-8 text-purple-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-2xl font-bold text-foreground">
                {question.question}
              </h3>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 px-3 py-1">
                Optional
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground capitalize">
              {question.subtitle}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        <Textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={question.placeholder}
          className="h-40 text-base resize-none border-2 focus:border-purple-300 rounded-xl p-4"
        />
        
        <div className="flex gap-4">
          <Button 
            onClick={handleSubmit} 
            size="lg"
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-lg py-4 h-auto rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            {isLast ? '✨ Complete & Generate' : 'Continue'}
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
          
          <Button 
            onClick={onSkip} 
            variant="outline" 
            size="lg"
            className="px-8 py-4 h-auto rounded-xl border-2 text-lg hover:bg-secondary/50 transition-all"
          >
            {isLast ? 'Generate without this' : 'Skip for now'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
