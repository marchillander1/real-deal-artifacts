
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
    question: 'När ska denna automation starta? (Trigger)',
    placeholder: 'T.ex. "När en ny konsult registrerar sig", "Varje måndag kl 09:00", "När ett uppdrag skapas"...'
  },
  {
    key: 'steps',
    question: 'Vad ska hända, i vilken ordning? (Steg-för-steg flöde)',
    placeholder: 'Beskriv alla steg som ska utföras automatiskt...'
  },
  {
    key: 'systems',
    question: 'Vilka system, verktyg eller appar vill du inkludera? (System)',
    placeholder: 'T.ex. "MatchWise-plattformen, Slack, e-post, CRM, LinkedIn"...'
  },
  {
    key: 'errorHandling',
    question: 'Vad ska hända om något går fel? (Felhantering)',
    placeholder: 'T.ex. "Skicka notifikation till admin", "Försök igen om 5 minuter", "Stoppa och logga fel"...'
  },
  {
    key: 'output',
    question: 'Vad ska slutresultatet vara? (Output)',
    placeholder: 'T.ex. "Matchade konsulter i systemet", "Rapport skickad till teamet", "Uppdaterad databas"...'
  }
];

const optionalQuestions = [
  {
    key: 'notifications',
    question: 'Hur vill du bli notifierad när det är klart? (Notifikationer)',
    placeholder: 'T.ex. "E-post till mig", "Slack-meddelande", "Dashboard-uppdatering"...'
  },
  {
    key: 'conditions',
    question: 'Några specifika villkor eller undantag?',
    placeholder: 'T.ex. "Bara under arbetstid", "Endast för vissa typer av uppdrag"...'
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
      toast.error('Beskriv kort vad du vill automatisera först');
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
**Automation Mål:** ${automationData.description}

**Trigger:** ${automationData.trigger}

**Processflöde:**
${automationData.steps}

**Integrerade System:**
${automationData.systems}

**Felhantering:**
${automationData.errorHandling}

**Förväntad Output:**
${automationData.output}

${automationData.notifications ? `**Notifikationer:** ${automationData.notifications}` : ''}

${automationData.conditions ? `**Villkor & Undantag:** ${automationData.conditions}` : ''}

**Sammanfattning:**
Detta automation kommer att streamline processen för ${automationData.description.toLowerCase()} genom att automatiskt trigga när ${automationData.trigger.toLowerCase()}. Systemet kommer att utföra definierade steg och leverera ${automationData.output.toLowerCase()} med robust felhantering på plats.
      `.trim();

      setFinalGoal(goal);
      setIsCompleted(true);
      setIsGenerating(false);
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(finalGoal);
    toast.success('Automation kopierad till urklipp!');
  };

  const downloadPDF = () => {
    toast.success('PDF nedladdning påbörjad!');
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
                Automatisera din konsultmatchning
              </h1>
              
              <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
                Beskriv ditt arbetsflöde till vår AI-agent och få en personlig automation-blueprint — på bara några minuter.
              </p>
              
              <div className="max-w-2xl mx-auto">
                <Textarea
                  value={automationData.description}
                  onChange={(e) => setAutomationData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Hej! 👋 Vad skulle du vilja automatisera idag? Beskriv det kort med dina egna ord..."
                  className="h-24 text-lg bg-white/90 border-0 shadow-xl"
                />
                
                <Button 
                  onClick={handleStart}
                  size="lg"
                  className="mt-6 bg-white text-blue-600 hover:bg-white/90 text-lg px-8 py-3 h-auto"
                >
                  Starta din automation-resa
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
              Varför automatisera?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Spara tid, minska manuella fel och matcha snabbare. Automation ger dig möjlighet att fokusera på riktig mänsklig kontakt istället för repetitiva uppgifter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Spara Tid</h3>
                <p className="text-slate-600">Automatisera repetitiva uppgifter och fokusera på värdeskapande aktiviteter.</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Bättre Matchning</h3>
                <p className="text-slate-600">AI-driven precision för perfekta konsult-uppdrag matchningar.</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Mänsklig Fokus</h3>
                <p className="text-slate-600">Låt tekniken hantera processen så du kan fokusera på relationer.</p>
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
              Din automation-blueprint är klar! 🎉
            </h1>
            <p className="text-slate-600">
              Ladda ner som PDF, kopiera, eller boka en session med vårt team för att förvandla den till en fullt fungerande lösning.
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-blue-600" />
                Din Kompletta Automation
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
              Ladda ner PDF
            </Button>
            
            <Button onClick={copyToClipboard} variant="outline">
              <Copy className="mr-2 h-4 w-4" />
              Kopiera till urklipp
            </Button>
            
            <Button 
              onClick={() => window.open('https://calendly.com/marc-hillander-rbak/30min', '_blank')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Boka möte med vårt team
            </Button>
          </div>

          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Behöver du hjälp med implementering?</h3>
              <p className="text-slate-600 mb-4">
                Boka en gratis konsultation med våra automation-strateger idag.
              </p>
              <Button 
                onClick={() => window.open('https://calendly.com/marc-hillander-rbak/30min', '_blank')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Boka gratis konsultation
              </Button>
            </CardContent>
          </Card>

          <div className="text-center mt-6 text-sm text-slate-500">
            Om du behöver hjälp med att implementera denna automation eller lansera din sida, kan du boka en gratis konsultation med vårt team!
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
              {showOptional ? 'Valfria frågor' : `Steg ${currentStep + 1} av ${questions.length}`}
            </Badge>
          </div>
          
          <Progress value={progress} className="h-2" />
          
          <div className="mt-2 text-sm text-slate-600">
            {Math.round(progress)}% genomfört
          </div>
        </div>

        {isGenerating ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Bot className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-pulse" />
              <h2 className="text-xl font-semibold mb-2">AI genererar din automation...</h2>
              <p className="text-slate-600 mb-4">Detta tar vanligtvis 10-30 sekunder</p>
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
      toast.error('Vänligen ange ett svar');
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
          Nästa
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
          <Badge variant="secondary" className="ml-2">Valfri</Badge>
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
            {isLast ? 'Slutför & Generera' : 'Nästa'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          
          <Button onClick={onSkip} variant="outline">
            {isLast ? 'Generera utan detta' : 'Hoppa över'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
