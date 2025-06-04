
import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, Users, Briefcase, Zap, Star, Download, Plus, Search, Filter, BarChart3, TrendingUp, Clock, DollarSign, CheckCircle, Phone, Mail, MapPin, Calendar, Target, ArrowRight, Award, Sparkles } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const ConsultantMatcher = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { toast } = useToast();
  
  const [consultants, setConsultants] = useState([
    {
      id: 1,
      name: 'Anna Lindqvist',
      skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL', 'GraphQL', 'Docker'],
      experience: '8 years',
      roles: ['Senior Frontend Developer', 'Full-Stack Architect'],
      location: 'Stockholm',
      rate: '950 SEK/hour',
      availability: 'Available',
      phone: '+46 70 123 4567',
      email: 'anna.lindqvist@email.com',
      projects: 23,
      rating: 4.9,
      lastActive: '2 hours ago',
      cv: 'Senior developer with expertise in modern web technologies, led 15+ projects for Fortune 500 companies...',
      certifications: ['AWS Certified', 'React Advanced'],
      languages: ['Swedish', 'English', 'German']
    },
    {
      id: 2,
      name: 'Erik Johansson',
      skills: ['Python', 'Django', 'Docker', 'Kubernetes', 'GCP', 'Terraform', 'Jenkins', 'MongoDB'],
      experience: '10 years',
      roles: ['Senior DevOps Engineer', 'Cloud Architect'],
      location: 'Göteborg',
      rate: '1100 SEK/hour',
      availability: 'Available',
      phone: '+46 70 234 5678',
      email: 'erik.johansson@email.com',
      projects: 31,
      rating: 4.8,
      lastActive: '1 hour ago',
      cv: 'Experienced DevOps specialist with 10+ years in cloud infrastructure and automation...',
      certifications: ['GCP Professional', 'Kubernetes Certified'],
      languages: ['Swedish', 'English']
    },
    {
      id: 3,
      name: 'Maria Andersson',
      skills: ['Java', 'Spring Boot', 'Microservices', 'Azure', 'MongoDB', 'Kafka', 'Redis'],
      experience: '12 years',
      roles: ['Tech Lead', 'Enterprise Architect'],
      location: 'Malmö',
      rate: '1200 SEK/hour',
      availability: 'Partially Available',
      phone: '+46 70 345 6789',
      email: 'maria.andersson@email.com',
      projects: 45,
      rating: 5.0,
      lastActive: '30 minutes ago',
      cv: 'Technical lead with extensive experience in enterprise solutions and team leadership...',
      certifications: ['Java Expert', 'Azure Solutions Architect'],
      languages: ['Swedish', 'English', 'Spanish']
    },
    {
      id: 4,
      name: 'Johan Nilsson',
      skills: ['Angular', 'Vue.js', 'JavaScript', 'SASS', 'Figma', 'UX Design'],
      experience: '6 years',
      roles: ['Frontend Developer', 'UX Designer'],
      location: 'Stockholm',
      rate: '850 SEK/hour',
      availability: 'Available',
      phone: '+46 70 456 7890',
      email: 'johan.nilsson@email.com',
      projects: 18,
      rating: 4.7,
      lastActive: '4 hours ago',
      cv: 'Creative frontend developer with strong UX background...',
      certifications: ['Adobe Certified', 'Google UX Design'],
      languages: ['Swedish', 'English']
    }
  ]);

  const [assignments, setAssignments] = useState([
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

  const [matches, setMatches] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [isMatching, setIsMatching] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [stats, setStats] = useState({
    totalConsultants: 247,
    activeAssignments: 23,
    successfulMatches: 156,
    avgMatchTime: '12 seconds',
    clientSatisfaction: 96,
    timeSaved: '847 hours',
    revenue: '2.4M SEK'
  });
  
  const fileInputRef = useRef(null);

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

  const calculateMatch = (consultant, assignment) => {
    const consultantSkills = consultant.skills.map(s => s.toLowerCase());
    const requiredSkills = assignment.requiredSkills.map(s => s.toLowerCase());
    
    const matchingSkills = consultantSkills.filter(skill => 
      requiredSkills.some(required => 
        skill.includes(required.toLowerCase()) || required.toLowerCase().includes(skill)
      )
    );
    
    const skillScore = (matchingSkills.length / requiredSkills.length) * 60;
    const experienceScore = Math.min(parseInt(consultant.experience) * 2.5, 25);
    const availabilityScore = consultant.availability === 'Available' ? 10 : 5;
    const ratingScore = consultant.rating * 1;
    
    return Math.min(Math.round(skillScore + experienceScore + availabilityScore + ratingScore), 98);
  };

  const generateMotivationLetter = (consultant, assignment, matchScore) => {
    const templates = [
      `Subject: Application for ${assignment.title} - ${consultant.name}

Dear Hiring Team at ${assignment.company},

I am excited to apply for the ${assignment.title} position. With my ${consultant.experience} of experience and proven track record of ${consultant.projects} successful projects, I am confident I can deliver exceptional value to your ${assignment.industry.toLowerCase()} initiative.

🔧 Technical Alignment:
My expertise in ${consultant.skills.filter(skill => 
  assignment.requiredSkills.some(req => skill.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(skill.toLowerCase()))
).join(', ')} directly matches your technical requirements. I have successfully delivered similar solutions for enterprise clients, maintaining a ${consultant.rating}/5.0 client satisfaction rating.

💼 Project Experience:
• ${consultant.projects} completed projects with 100% delivery rate
• Specialized in ${consultant.roles[0].toLowerCase()} roles
• ${consultant.certifications.join(' and ')} certified
• Fluent in ${consultant.languages.join(', ')}

📍 Logistics:
• Location: ${consultant.location} (${assignment.remote} compatible)
• Availability: ${consultant.availability} from ${assignment.startDate}
• Rate: ${consultant.rate} (within your ${assignment.budget} budget)
• Team collaboration: Experienced with ${assignment.teamSize} teams

I am available for an immediate interview and can start on your preferred timeline. My recent work includes similar ${assignment.industry.toLowerCase()} projects where I delivered measurable ROI through technical excellence.

Thank you for considering my application. I look forward to contributing to ${assignment.company}'s success.

Best regards,
${consultant.name}
📧 ${consultant.email}
📱 ${consultant.phone}

---
Generated by AI in 0.3 seconds | Match Score: ${matchScore}% | Last updated: ${consultant.lastActive}`,

      `Application: ${assignment.title} | ${consultant.name}

Hello ${assignment.company} Team! 👋

I'm ${consultant.name}, a ${consultant.roles[0]} with ${consultant.experience} of hands-on experience. Your ${assignment.title} project perfectly aligns with my expertise and career goals.

🎯 Why I'm Perfect for This Role:

Technical Match (${matchScore}%):
✅ ${consultant.skills.filter(skill => 
  assignment.requiredSkills.some(req => skill.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(skill.toLowerCase()))
).map(skill => `Expert in ${skill}`).join('\n✅ ')}

Track Record:
• ${consultant.projects} projects delivered on-time and on-budget
• ${consultant.rating}/5.0 average client rating
• ${consultant.certifications.join(' & ')} certified professional
• Based in ${consultant.location}, available for ${assignment.remote.toLowerCase()} work

Project Fit:
• Duration: ${assignment.duration} ✅ (I specialize in ${assignment.duration.includes('6') ? 'medium-term' : 'long-term'} engagements)
• Workload: ${assignment.workload} ✅ (Currently ${consultant.availability.toLowerCase()})
• Industry: ${assignment.industry} ✅ (Previous experience with similar solutions)
• Team Size: ${assignment.teamSize} ✅ (Love collaborative environments)

🚀 What I Bring Beyond Technical Skills:
• Proactive communication and regular progress updates
• Documentation and knowledge transfer focus
• Mentoring junior developers when needed
• Business-oriented approach to technical decisions

💰 Investment: ${consultant.rate} (fits within your ${assignment.budget} budget)
📅 Start Date: Ready for ${assignment.startDate}
⚡ Response Time: Active ${consultant.lastActive}

I'd love to discuss how my experience can accelerate your project timeline and ensure technical excellence. Available for a call this week!

Cheers,
${consultant.name}

Contact: ${consultant.email} | ${consultant.phone}
Portfolio: Available upon request

P.S. - This personalized application was generated by AI but reflects my genuine interest and qualifications! 🤖✨`
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
  };

  const runMatching = async (assignment) => {
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

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
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
          languages: ['Swedish', 'English']
        };
        setConsultants([...consultants, newConsultant]);
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

  const StatCard = ({ icon: Icon, title, value, change, color = "blue" }) => (
    <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <p className="text-sm text-green-600 mt-1 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              {change}
            </p>
          )}
        </div>
        <div className={`bg-${color}-100 p-3 rounded-lg`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

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
                <span className="text-gray-500">247 Active Consultants</span>
              </div>
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
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Platform Overview</h2>
                <p className="text-gray-600">Real-time insights and performance metrics</p>
              </div>
              {demoMode && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <p className="text-orange-800 text-sm font-medium">🎬 Demo Mode Active - Data refreshes automatically</p>
                </div>
              )}
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                icon={Users} 
                title="Active Consultants" 
                value={stats.totalConsultants} 
                change="+12 this week"
                color="blue" 
              />
              <StatCard 
                icon={Briefcase} 
                title="Open Assignments" 
                value={stats.activeAssignments} 
                change="+5 today"
                color="green" 
              />
              <StatCard 
                icon={CheckCircle} 
                title="Successful Matches" 
                value={stats.successfulMatches} 
                change="+23 this month"
                color="purple" 
              />
              <StatCard 
                icon={Clock} 
                title="Avg Match Time" 
                value={stats.avgMatchTime} 
                change="67% faster"
                color="orange" 
              />
            </div>

            {/* ROI Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Time Saved</p>
                    <p className="text-3xl font-bold">{stats.timeSaved}</p>
                    <p className="text-green-200 text-sm mt-1">≈ 2.1M SEK in cost savings</p>
                  </div>
                  <Clock className="h-8 w-8 text-green-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Client Satisfaction</p>
                    <p className="text-3xl font-bold">{stats.clientSatisfaction}%</p>
                    <p className="text-blue-200 text-sm mt-1">+8% vs manual matching</p>
                  </div>
                  <Star className="h-8 w-8 text-blue-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Platform Revenue</p>
                    <p className="text-3xl font-bold">{stats.revenue}</p>
                    <p className="text-purple-200 text-sm mt-1">Monthly recurring</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-purple-200" />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent AI Matches</h3>
              <div className="space-y-3">
                {[
                  { consultant: 'Anna Lindqvist', assignment: 'React Developer', score: 94, time: '2 min ago' },
                  { consultant: 'Erik Johansson', assignment: 'DevOps Engineer', score: 89, time: '15 min ago' },
                  { consultant: 'Maria Andersson', assignment: 'Java Architect', score: 96, time: '1 hour ago' }
                ].map((match, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">{match.consultant.split(' ')[0][0]}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{match.consultant}</p>
                        <p className="text-sm text-gray-600">matched to {match.assignment}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm font-medium">
                        {match.score}% match
                      </span>
                      <span className="text-gray-500 text-sm">{match.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'consultants' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Consultant Database</h2>
                <p className="text-gray-600">AI-powered consultant profiles with automated skill extraction</p>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  ref={fileInputRef}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isMatching}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
                >
                  <Upload className="h-4 w-4" />
                  <span>{isMatching ? 'Processing...' : 'Upload CV'}</span>
                </button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {consultants.map((consultant) => (
                <div key={consultant.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">{consultant.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{consultant.name}</h3>
                        <p className="text-sm text-gray-600">{consultant.roles[0]}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-700">{consultant.rating}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Experience:</span>
                      <span className="font-medium">{consultant.experience}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Projects:</span>
                      <span className="font-medium">{consultant.projects} completed</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Rate:</span>
                      <span className="font-medium text-green-600">{consultant.rate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{consultant.location}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Status:</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        consultant.availability === 'Available' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {consultant.availability}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Last active: {consultant.lastActive}</p>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Top Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {consultant.skills.slice(0, 5).map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">
                          {skill}
                        </span>
                      ))}
                      {consultant.skills.length > 5 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                          +{consultant.skills.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Mail className="h-3 w-3" />
                      <span>Contact</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Award className="h-3 w-3 text-blue-500" />
                      <span className="text-blue-600 font-medium">{consultant.certifications[0]}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'assignments' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Client Assignments</h2>
                <p className="text-gray-600">Active projects seeking qualified consultants</p>
              </div>
              <button
                onClick={() => {
                  const title = prompt('Assignment title:');
                  if (title) {
                    const newAssignment = {
                      id: assignments.length + 1,
                      title,
                      description: 'New assignment description - seeking qualified professional...',
                      requiredSkills: ['JavaScript', 'React', 'Problem Solving'],
                      startDate: '2024-02-01',
                      duration: '3 months',
                      workload: '100%',
                      budget: '45000 SEK/month',
                      company: 'New Client AB',
                      industry: 'Technology',
                      teamSize: '5-10 people',
                      remote: 'Hybrid',
                      urgency: 'Medium',
                      clientLogo: '🚀'
                    };
                    setAssignments([...assignments, newAssignment]);
                    toast({
                      title: "Assignment Added!",
                      description: `${title} has been added to the platform.`,
                    });
                  }
                }}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Add Assignment</span>
              </button>
            </div>

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
