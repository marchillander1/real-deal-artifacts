import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, Users, Briefcase, Zap, Star, Download, Plus, Search, Filter, BarChart3, TrendingUp, Clock, DollarSign, CheckCircle, Phone, Mail, MapPin, Calendar, Target, ArrowRight, Award, Sparkles } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Dashboard from '../components/Dashboard';
import ConsultantsTab from '../components/ConsultantsTab';
import CreateAssignmentForm from '../components/CreateAssignmentForm';
import { useConsultants } from '../hooks/useConsultants';
import { Assignment, Match, Stats } from '../types/consultant';
import { calculateMatch, generateMotivationLetter } from '../utils/matching';

const ConsultantMatcher = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { toast } = useToast();
  const { consultants, existingConsultants, newConsultants, addConsultant } = useConsultants();
  
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: 1,
      title: 'Senior React Developer - E-commerce Platform',
      description: 'We need a skilled React developer to build a modern e-commerce platform with advanced UI components and performance optimization.',
      requiredSkills: ['React', 'TypeScript', 'GraphQL', 'AWS', 'Performance Optimization'],
      startDate: '2024-02-01',
      duration: '6 months',
      workload: '100%',
      budget: '65000 SEK/month',
      company: 'TechStore Nordic AB',
      industry: 'E-commerce',
      teamSize: '8 developers',
      remote: 'Hybrid',
      urgency: 'High',
      clientLogo: '🛒'
    },
    {
      id: 2,
      title: 'DevOps Engineer - Cloud Migration Project',
      description: 'Looking for an experienced DevOps engineer to lead our infrastructure migration to the cloud and implement modern CI/CD practices.',
      requiredSkills: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'Jenkins', 'Python'],
      startDate: '2024-01-15',
      duration: '4 months',
      workload: '75%',
      budget: '55000 SEK/month',
      company: 'CloudFirst Solutions',
      industry: 'FinTech',
      teamSize: '12 engineers',
      remote: 'Remote',
      urgency: 'Medium',
      clientLogo: '☁️'
    },
    {
      id: 3,
      title: 'Java Architect - Microservices Platform',
      description: 'Seeking a senior Java architect to design and implement a scalable microservices architecture for our enterprise platform.',
      requiredSkills: ['Java', 'Spring Boot', 'Microservices', 'Kafka', 'Docker', 'Azure'],
      startDate: '2024-02-15',
      duration: '8 months',
      workload: '100%',
      budget: '75000 SEK/month',
      company: 'Enterprise Solutions Group',
      industry: 'Enterprise Software',
      teamSize: '15 developers',
      remote: 'On-site',
      urgency: 'High',
      clientLogo: '🏢'
    }
  ]);

  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [stats, setStats] = useState<Stats>({
    totalConsultants: 247,
    activeAssignments: 23,
    successfulMatches: 156,
    avgMatchTime: '12 seconds',
    clientSatisfaction: 96,
    timeSaved: '847 hours',
    revenue: '2.4M SEK'
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalConsultants: prev.totalConsultants + Math.floor(Math.random() * 3),
        timeSaved: `${(parseInt(prev.timeSaved.split(' ')[0]) + Math.floor(Math.random() * 5))} hours`
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const runMatching = async (assignment: Assignment) => {
    setIsMatching(true);
    setSelectedAssignment(assignment);
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const matchResults = consultants.map(consultant => {
      const score = calculateMatch(consultant, assignment);
      const letter = generateMotivationLetter(consultant, assignment, score);
      
      return {
        consultant,
        score,
        letter,
        matchedSkills: consultant.skills.filter(skill => 
          assignment.requiredSkills.some(req => 
            skill.toLowerCase().includes(req.toLowerCase()) || 
            req.toLowerCase().includes(skill.toLowerCase())
          )
        ),
        estimatedSavings: Math.floor(score * 100 + Math.random() * 500),
        responseTime: Math.floor(Math.random() * 24) + 1
      };
    }).sort((a, b) => b.score - a.score);
    
    setMatches(matchResults);
    setIsMatching(false);
    setActiveTab('matches');
    
    // Update stats
    setStats(prev => ({
      ...prev,
      successfulMatches: prev.successfulMatches + 1,
      timeSaved: `${parseInt(prev.timeSaved.split(' ')[0]) + Math.floor(Math.random() * 10 + 5)} hours`
    }));

    toast({
      title: "AI Matching Complete!",
      description: `Found ${matchResults.length} qualified consultants for ${assignment.title}`,
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setIsMatching(true);
      setTimeout(() => {
        const newConsultant = {
          id: consultants.length + 1,
          name: file.name.replace('.pdf', '').replace(/[^a-zA-Z ]/g, ''),
          skills: ['JavaScript', 'React', 'Node.js', 'SQL', 'Git'],
          experience: `${3 + Math.floor(Math.random() * 8)} years`,
          roles: ['Full-Stack Developer'],
          location: 'Stockholm',
          rate: `${700 + Math.floor(Math.random() * 400)} SEK/hour`,
          availability: 'Available',
          phone: '+46 70 XXX XXXX',
          email: 'extracted@email.com',
          projects: Math.floor(Math.random() * 20) + 5,
          rating: 4.2 + Math.random() * 0.7,
          lastActive: 'Just now',
          cv: 'CV content extracted and analyzed by AI...',
          certifications: ['Scrum Master'],
          languages: ['Swedish', 'English'],
          type: 'new' as const
        };
        addConsultant(newConsultant);
        setStats(prev => ({ ...prev, totalConsultants: prev.totalConsultants + 1 }));
        setIsMatching(false);
        toast({
          title: "CV Processed Successfully!",
          description: "AI extracted skills, experience, and contact details.",
        });
      }, 2000);
    } else {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF file",
        variant: "destructive"
      });
    }
  };

  const fileInputRef = useRef(null);

  const handleMatch = async (matches: Match[], assignment: Assignment) => {
    setMatches(matches);
    setSelectedAssignment(assignment);
    setActiveTab('matches');
  };

  const handleCreateAssignment = (newAssignment: Assignment) => {
    setAssignments(prev => [...prev, newAssignment]);
    setShowCreateForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ConsultMatch AI</h1>
                <p className="text-sm text-gray-500">Intelligent consultant matching platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-1 text-green-600">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live</span>
                </div>
                <span className="text-gray-500">{stats.totalConsultants} Active Consultants</span>
              </div>
              <a 
                href="/cv-upload"
                className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all text-sm font-medium"
              >
                Join Network
              </a>
              <button 
                onClick={() => setDemoMode(!demoMode)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  demoMode ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {demoMode ? '🎬 Demo Mode' : '💼 Live Mode'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-white rounded-xl shadow-sm p-1">
          <nav className="flex space-x-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'consultants', label: 'Consultants', icon: Users },
              { id: 'assignments', label: 'Assignments', icon: Briefcase },
              { id: 'matches', label: 'AI Matches', icon: Star }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <Dashboard 
            consultants={consultants}
            onMatch={handleMatch}
          />
        )}

        {activeTab === 'consultants' && (
          <ConsultantsTab
            existingConsultants={existingConsultants}
            newConsultants={newConsultants}
            isMatching={isMatching}
            onFileUpload={handleFileUpload}
          />
        )}

        {activeTab === 'assignments' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Client Assignments</h2>
                <p className="text-gray-600">Active projects seeking qualified consultants</p>
              </div>
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Add Assignment</span>
              </button>
            </div>

            {showCreateForm && (
              <CreateAssignmentForm
                onAssignmentCreated={handleCreateAssignment}
                onCancel={() => setShowCreateForm(false)}
              />
            )}

            <div className="grid gap-6 lg:grid-cols-2">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{assignment.clientLogo}</div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                        <p className="text-sm text-gray-600">{assignment.company} • {assignment.industry}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        assignment.urgency === 'High' ? 'bg-red-100 text-red-800' :
                        assignment.urgency === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {assignment.urgency} Priority
                      </span>
                      <button
                        onClick={() => runMatching(assignment)}
                        disabled={isMatching}
                        className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 shadow-lg"
                      >
                        <Zap className="h-4 w-4" />
                        <span>{isMatching ? 'Matching...' : 'AI Match'}</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{assignment.description}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-gray-500">Duration:</p>
                        <p className="font-medium">{assignment.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-gray-500">Workload:</p>
                        <p className="font-medium">{assignment.workload}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-gray-500">Start Date:</p>
                        <p className="font-medium">{assignment.startDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-gray-500">Budget:</p>
                        <p className="font-medium text-green-600">{assignment.budget}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-700">Project Details:</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Team Size:</span>
                        <span className="ml-2 font-medium">{assignment.teamSize}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Work Style:</span>
                        <span className="ml-2 font-medium">{assignment.remote}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Required Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {assignment.requiredSkills.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-md font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'matches' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">AI Matching Results</h2>
                {selectedAssignment && (
                  <p className="text-gray-600">Results for: <span className="font-medium">{selectedAssignment.title}</span></p>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Filter className="h-4 w-4" />
                  <span>Sorted by AI confidence score</span>
                </div>
                {matches.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                    <p className="text-green-800 text-sm font-medium">
                      ⚡ Matched {matches.length} consultants in {stats.avgMatchTime}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {isMatching ? (
              <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                <div className="inline-flex items-center space-x-4 mb-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  <span className="text-xl text-gray-700">AI is analyzing consultants...</span>
                </div>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>🔍 Scanning consultant database</p>
                  <p>🎯 Calculating skill compatibility scores</p>
                  <p>✍️ Generating personalized cover letters</p>
                  <p>📊 Ranking matches by confidence</p>
                </div>
                <div className="mt-6 bg-blue-50 rounded-lg p-4">
                  <p className="text-blue-800 font-medium">Processing {consultants.length} consultant profiles...</p>
                </div>
              </div>
            ) : matches.length > 0 ? (
              <div className="space-y-6">
                {matches.map((match, index) => (
                  <div key={match.consultant.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-all">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-3">
                            <div className={`text-2xl font-bold px-3 py-1 rounded-lg ${
                              index === 0 ? 'bg-yellow-100 text-yellow-800' : 
                              index === 1 ? 'bg-gray-100 text-gray-700' :
                              index === 2 ? 'bg-amber-100 text-amber-800' :
                              'bg-blue-50 text-blue-600'
                            }`}>
                              #{index + 1}
                            </div>
                            <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold">{match.consultant.name.split(' ').map(n => n[0]).join('')}</span>
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900">{match.consultant.name}</h3>
                              <p className="text-gray-600">{match.consultant.roles[0]} • {match.consultant.location}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-lg font-bold ${
                              match.score >= 90 ? 'bg-green-100 text-green-800' :
                              match.score >= 75 ? 'bg-blue-100 text-blue-800' :
                              match.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              <Star className="h-5 w-5" />
                              <span>{match.score}% Match</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">AI Confidence Score</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1 space-y-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                              <Target className="h-4 w-4 mr-2 text-green-600" />
                              Matching Skills
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {match.matchedSkills.map((skill, skillIndex) => (
                                <span key={skillIndex} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                                  ✓ {skill}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Experience:</span>
                              <span className="font-medium">{match.consultant.experience}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Projects:</span>
                              <span className="font-medium">{match.consultant.projects} completed</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Rating:</span>
                              <div className="flex items-center space-x-1">
                                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                <span className="font-medium">{match.consultant.rating}/5.0</span>
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Rate:</span>
                              <span className="font-medium text-green-600">{match.consultant.rate}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Availability:</span>
                              <span className={`font-medium ${match.consultant.availability === 'Available' ? 'text-green-600' : 'text-yellow-600'}`}>
                                {match.consultant.availability}
                              </span>
                            </div>
                          </div>

                          <div className="bg-blue-50 rounded-lg p-4">
                            <h5 className="font-medium text-blue-900 mb-2">Estimated Impact</h5>
                            <div className="space-y-1 text-sm">
                              <p className="text-blue-800">💰 Cost savings: {match.estimatedSavings} SEK/month</p>
                              <p className="text-blue-800">⚡ Expected response: {match.responseTime}h</p>
                              <p className="text-blue-800">📊 Success probability: {Math.min(match.score + 5, 99)}%</p>
                            </div>
                          </div>
                        </div>

                        <div className="lg:col-span-2">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-gray-900 flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-purple-600" />
                              AI-Generated Cover Letter
                            </h4>
                            <div className="flex items-center space-x-2">
                              <button 
                                onClick={() => toast({ title: "PDF Export", description: "Cover letter exported successfully!" })}
                                className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1 bg-blue-50 px-3 py-1 rounded-lg"
                              >
                                <Download className="h-3 w-3" />
                                <span>Export PDF</span>
                              </button>
                              <button 
                                onClick={() => toast({ title: "Email Sent", description: "Cover letter sent to client!" })}
                                className="text-purple-600 hover:text-purple-800 text-sm flex items-center space-x-1 bg-purple-50 px-3 py-1 rounded-lg"
                              >
                                <Mail className="h-3 w-3" />
                                <span>Send Email</span>
                              </button>
                            </div>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto">
                            <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed">{match.letter}</pre>
                          </div>
                          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                            <span>✨ Generated by AI in 0.3 seconds</span>
                            <span>📝 {match.letter.length} characters • Ready to send</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                <div className="mb-6">
                  <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Ready to Find Perfect Matches</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Select an assignment from the Assignments tab and click "AI Match" to discover the best consultants for your project.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('assignments')}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  <ArrowRight className="h-4 w-4" />
                  <span>Browse Assignments</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultantMatcher;
