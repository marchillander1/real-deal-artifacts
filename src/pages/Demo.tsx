
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CreateAssignmentForm from '@/components/CreateAssignmentForm';
import { useAiMatching } from '@/hooks/useAiMatching';
import { Assignment } from '@/types/consultant';
import { ArrowLeft, Star, MapPin, Clock, CheckCircle, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import { useSupabaseConsultantsWithDemo } from '@/hooks/useSupabaseConsultantsWithDemo';

export default function Demo() {
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { performAiMatching, isMatching } = useAiMatching();
  const { consultants } = useSupabaseConsultantsWithDemo();

  const handleAssignmentCreated = async (newAssignment: Assignment) => {
    console.log('Demo: Assignment created:', newAssignment);
    setAssignment(newAssignment);
    setShowForm(false);
    
    try {
      // Use real consultants from the database for demo matching
      const networkConsultants = consultants.filter(c => c.type === 'new');
      
      // Create mock matches using real consultant data
      const mockMatches = networkConsultants.slice(0, 3).map((consultant, index) => ({
        consultant: {
          ...consultant,
          // Anonymize for demo
          name: `Consultant ${String.fromCharCode(65 + index)}`,
          email: 'contact@matchwiseai.com',
          phone: 'Available after signup',
        },
        matchScore: 95 - (index * 3),
        matchedSkills: newAssignment.requiredSkills || [],
        reasoning: `Strong match based on ${consultant.skills.slice(0, 3).join(', ')} experience and ${consultant.experience} in the field.`,
        coverLetter: `Based on our AI analysis, this consultant is an excellent match for your ${newAssignment.title} position. Their technical expertise and experience align perfectly with your requirements.`
      }));

      setMatches(mockMatches);
      setShowResults(true);
    } catch (error) {
      console.error('Demo matching error:', error);
    }
  };

  const handleStartOver = () => {
    setAssignment(null);
    setMatches([]);
    setShowResults(false);
    setShowForm(false);
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Header */}
        <nav className="bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Logo size="md" variant="full" />
              <div className="flex items-center space-x-4">
                <Badge className="bg-emerald-600/20 text-emerald-300 border-emerald-500/30">
                  Demo Mode
                </Badge>
                <Link to="/pricing-auth">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Get Full Access
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8">
          {/* Results Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-emerald-400 mr-3" />
              <h1 className="text-3xl font-bold text-white">Demo Results</h1>
            </div>
            <p className="text-slate-300 text-lg mb-4">
              We found {matches.length} excellent matches for your assignment
            </p>
            <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-blue-200 text-sm">
                🎯 This is a demo showing anonymized consultant profiles. 
                <Link to="/pricing-auth" className="text-blue-400 hover:underline ml-1">
                  Sign up to see full profiles and contact information.
                </Link>
              </p>
            </div>
          </div>

          {/* Assignment Summary */}
          <Card className="bg-slate-800/50 border-slate-600 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                Your Assignment: {assignment?.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-slate-300">
                <div>
                  <span className="text-slate-400">Company:</span> {assignment?.company}
                </div>
                <div>
                  <span className="text-slate-400">Duration:</span> {assignment?.duration}
                </div>
                <div className="md:col-span-2">
                  <span className="text-slate-400">Required Skills:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {assignment?.requiredSkills?.map((skill, idx) => (
                      <Badge key={idx} variant="outline" className="text-blue-300 border-blue-500/30">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Matching Results */}
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3 mb-8">
            {matches.map((match, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-600 hover:bg-slate-800/70 transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {match.consultant.name.charAt(match.consultant.name.length - 1)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{match.consultant.name}</h3>
                        <p className="text-slate-400 text-sm">{match.consultant.roles?.[0] || 'Consultant'}</p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-600/20 text-emerald-300 border-emerald-500/30">
                      {match.matchScore}% Match
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Skills */}
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Key Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {match.consultant.skills?.slice(0, 4).map((skill: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="text-xs text-blue-300 border-blue-500/30">
                          {skill}
                        </Badge>
                      ))}
                      {match.consultant.skills?.length > 4 && (
                        <Badge variant="outline" className="text-xs text-slate-400 border-slate-500/30">
                          +{match.consultant.skills.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Experience & Rating */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center text-sm text-slate-300">
                        <Clock className="h-4 w-4 mr-1" />
                        {match.consultant.experience || '5+'} years
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center text-sm text-slate-300">
                        <Star className="h-4 w-4 mr-1 text-yellow-400" />
                        {match.consultant.rating || 4.8}/5.0
                      </div>
                    </div>
                  </div>

                  {/* AI Analysis Preview */}
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <Brain className="h-4 w-4 text-purple-400 mr-2" />
                      <span className="text-sm font-medium text-slate-300">AI Analysis</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {match.reasoning}
                    </p>
                  </div>

                  {/* Contact (Anonymized) */}
                  <div className="pt-4 border-t border-slate-600">
                    <p className="text-sm text-slate-400 mb-2">Contact Information</p>
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <p className="text-xs text-slate-500 text-center">
                        Full contact details available after signup
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                Ready to Connect with These Consultants?
              </h2>
              <p className="text-slate-200 mb-6 max-w-2xl mx-auto">
                Sign up now to access full consultant profiles, contact information, and our complete consultant network.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/pricing-auth">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Get Full Access
                  </Button>
                </Link>
                <Button 
                  onClick={handleStartOver} 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Try Another Search
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <CreateAssignmentForm 
          onAssignmentCreated={handleAssignmentCreated}
          onCancel={() => setShowForm(false)}
          onClose={() => setShowForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <nav className="bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Logo size="md" variant="full" />
            <div className="flex items-center space-x-4">
              <Badge className="bg-blue-600/20 text-blue-300 border-blue-500/30">
                Demo Mode
              </Badge>
              <Link to="/">
                <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-800">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Try MatchWise AI for Free
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Test our AI matching platform by creating an assignment. We'll show you anonymized profiles 
            of consultants that match your requirements.
          </p>
          <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-blue-200 text-sm">
              🎯 This demo uses real consultant data but shows anonymized profiles. 
              Sign up to access full profiles and contact information.
            </p>
          </div>
        </div>

        {/* Assignment Form Card */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card className="bg-slate-800/50 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white text-center">
                Create Your Assignment
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-300 mb-6">
                Fill out the assignment details and our AI will instantly find matching consultants.
              </p>
              <Button 
                onClick={() => setShowForm(true)}
                disabled={isMatching}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isMatching ? "Finding Matches..." : "Start AI Matching"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <Card className="bg-slate-800/30 border-slate-600">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">AI-Powered Matching</h3>
              <p className="text-slate-300 text-sm">
                Our advanced AI analyzes both technical skills and soft factors for perfect matches.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/30 border-slate-600">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Instant Results</h3>
              <p className="text-slate-300 text-sm">
                Get matched with top consultants in seconds, not weeks of manual searching.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/30 border-slate-600">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Secure & Private</h3>
              <p className="text-slate-300 text-sm">
                All data is handled securely and consultant information is protected until signup.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
