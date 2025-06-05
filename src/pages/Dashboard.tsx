
import React, { useState } from "react";
import { Assignment } from "../types/consultant";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Users, Briefcase, TrendingUp, Clock } from "lucide-react";
import CreateAssignmentForm from "../components/CreateAssignmentForm";
import { useSupabaseConsultants } from "@/hooks/useSupabaseConsultants";

interface DashboardProps {
  assignments: Assignment[];
  onMatch: (assignment: Assignment) => void;
  onAssignmentCreated: (assignment: Assignment) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  assignments,
  onMatch,
  onAssignmentCreated,
  onFileUpload,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [matchResults, setMatchResults] = useState<any[]>([]);
  const [showMatchResults, setShowMatchResults] = useState(false);
  const { consultants } = useSupabaseConsultants();

  // Dashboard stats
  const totalConsultants = consultants.length || 5;
  const activeAssignments = assignments.length || 2;
  const successfulMatches = 156;
  const avgMatchTime = "12 seconds";

  const handleMatch = (assignment: Assignment) => {
    // Mock AI matching results with detailed soft values
    const mockResults = [
      {
        id: 1,
        name: "Erik Andersson",
        role: "Senior Full-Stack Developer",
        overallMatch: 96,
        technicalMatch: 94,
        culturalFit: 98,
        communicationMatch: 92,
        valuesAlignment: 95,
        skills: ["React", "TypeScript", "Node.js", "AWS"],
        experience: "8 years",
        rate: "950 SEK/hour",
        availability: "Available",
        location: "Stockholm",
        
        // Human Factors
        communicationStyle: "Direct and collaborative",
        workStyle: "Agile-focused with strong problem-solving",
        values: ["Innovation", "Quality", "Team collaboration"],
        personalityTraits: ["Analytical", "Proactive", "Empathetic"],
        teamFit: 4.8,
        adaptability: 4.6,
        leadership: 4.2,
        
        // AI Insights
        culturalFitReason: "Perfect match for innovative and fast-paced environment",
        communicationReason: "Direct communication style aligns with team preferences",
        valuesReason: "Strong alignment on innovation and quality focus",
        
        // Estimated Impact
        costSavings: "~45K SEK",
        responseTime: "8 seconds",
        successProbability: 94,
        
        // AI Cover Letter
        coverLetter: `Based on our AI analysis, Erik is an exceptional match for this ${assignment.title} position. His technical expertise in React and TypeScript combined with his collaborative communication style makes him ideal for your team dynamic. Erik's proven track record in agile environments and his strong focus on code quality align perfectly with your project requirements.`
      },
      {
        id: 2,
        name: "Maria Lindqvist",
        role: "Senior Frontend Developer",
        overallMatch: 89,
        technicalMatch: 91,
        culturalFit: 87,
        communicationMatch: 88,
        valuesAlignment: 90,
        skills: ["Vue.js", "JavaScript", "CSS", "Figma"],
        experience: "6 years",
        rate: "850 SEK/hour",
        availability: "Partially Available",
        location: "Göteborg",
        
        // Human Factors
        communicationStyle: "Diplomatic and detail-oriented",
        workStyle: "Design-focused with user-centric approach",
        values: ["User experience", "Attention to detail", "Continuous learning"],
        personalityTraits: ["Creative", "Methodical", "User-focused"],
        teamFit: 4.3,
        adaptability: 4.5,
        leadership: 3.8,
        
        // AI Insights
        culturalFitReason: "Great fit for structured and detail-oriented projects",
        communicationReason: "Diplomatic style works well with diverse teams",
        valuesReason: "Strong UX focus aligns with user-centered development",
        
        // Estimated Impact
        costSavings: "~38K SEK",
        responseTime: "12 seconds",
        successProbability: 87,
        
        // AI Cover Letter
        coverLetter: `Maria brings exceptional frontend expertise with a strong design sensibility to your ${assignment.title} project. Her diplomatic communication style and attention to detail make her particularly well-suited for projects requiring close collaboration with design teams. Her user-centric approach ensures deliverables that exceed expectations.`
      }
    ];

    setMatchResults(mockResults);
    setShowMatchResults(true);
    onMatch(assignment);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">AI-Driven Consultant Matching Platform</h1>
          <p className="text-gray-600 mt-1">Match consultants with assignments using advanced AI that analyzes both technical skills and soft factors</p>
          
          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex space-x-8">
              <button className="text-blue-600 font-medium border-b-2 border-blue-600 pb-2">Dashboard</button>
              <button className="text-gray-500 hover:text-gray-700 pb-2">Consultants</button>
              <button className="text-gray-500 hover:text-gray-700 pb-2">Assignments</button>
            </div>
            <div className="flex space-x-3">
              <div className="relative">
                <Button variant="outline" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload CV
                </Button>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={onFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                onClick={() => setShowCreateForm(true)}
              >
                <Briefcase className="h-4 w-4" />
                New Assignment
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Platform Overview Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Platform Overview</h2>
          <p className="text-gray-600 mb-6">Real-time insights and performance metrics</p>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{totalConsultants}</div>
                <div className="text-sm font-medium text-gray-900 mb-1">Active Consultants</div>
                <div className="text-sm text-green-600">↗ +12 this week</div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Briefcase className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{activeAssignments}</div>
                <div className="text-sm font-medium text-gray-900 mb-1">Open Assignments</div>
                <div className="text-sm text-green-600">↗ +5 today</div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{successfulMatches}</div>
                <div className="text-sm font-medium text-gray-900 mb-1">Successful Matches</div>
                <div className="text-sm text-green-600">↗ +23 this month</div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{avgMatchTime}</div>
                <div className="text-sm font-medium text-gray-900 mb-1">Avg Match Time</div>
                <div className="text-sm text-green-600">↗ 67% faster</div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Clock className="h-8 w-8 text-green-100" />
                </div>
                <div className="text-3xl font-bold mb-2">850 hours</div>
                <div className="text-lg font-medium mb-1">Time Saved</div>
                <div className="text-green-100">≈ 2.1M SEK in cost savings</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="h-8 w-8 text-blue-100" />
                </div>
                <div className="text-3xl font-bold mb-2">96%</div>
                <div className="text-lg font-medium mb-1">Client Satisfaction</div>
                <div className="text-blue-100">+8% vs manual matching</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Briefcase className="h-8 w-8 text-purple-100" />
                </div>
                <div className="text-3xl font-bold mb-2">2.4M SEK</div>
                <div className="text-lg font-medium mb-1">Platform Revenue</div>
                <div className="text-purple-100">Monthly recurring</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* AI Match Results Modal */}
      {showMatchResults && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">🤖 AI Matching Results</h2>
                  <p className="text-gray-600">Analysis completed in 12 seconds • 2 perfect matches found</p>
                </div>
                <button
                  onClick={() => setShowMatchResults(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {matchResults.map((consultant) => (
                <div key={consultant.id} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {consultant.name.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{consultant.name}</h3>
                        <p className="text-gray-600">{consultant.role}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>📍 {consultant.location}</span>
                          <span>💰 {consultant.rate}</span>
                          <span>⏰ {consultant.experience}</span>
                          <span className={`px-2 py-1 rounded-full ${consultant.availability === 'Available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {consultant.availability}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-600">{consultant.overallMatch}%</div>
                      <div className="text-sm text-gray-500">Overall Match</div>
                    </div>
                  </div>

                  {/* Match Scores */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg p-4 text-center border">
                      <div className="text-2xl font-bold text-blue-600">{consultant.technicalMatch}%</div>
                      <div className="text-sm text-gray-600">Technical Skills</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center border">
                      <div className="text-2xl font-bold text-purple-600">{consultant.culturalFit}%</div>
                      <div className="text-sm text-gray-600">Cultural Fit</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center border">
                      <div className="text-2xl font-bold text-green-600">{consultant.communicationMatch}%</div>
                      <div className="text-sm text-gray-600">Communication</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center border">
                      <div className="text-2xl font-bold text-orange-600">{consultant.valuesAlignment}%</div>
                      <div className="text-sm text-gray-600">Values Alignment</div>
                    </div>
                  </div>

                  {/* Detailed Analysis */}
                  <div className="grid lg:grid-cols-2 gap-6 mb-6">
                    {/* Human Factors */}
                    <div className="bg-white rounded-lg p-4 border">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        🧠 Human Factors
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div><strong>Communication Style:</strong> {consultant.communicationStyle}</div>
                        <div><strong>Work Style:</strong> {consultant.workStyle}</div>
                        <div><strong>Values:</strong> {consultant.values.join(', ')}</div>
                        <div><strong>Personality:</strong> {consultant.personalityTraits.join(', ')}</div>
                        <div className="flex justify-between mt-3">
                          <span>Team Fit: ⭐ {consultant.teamFit}/5</span>
                          <span>Adaptability: 🔄 {consultant.adaptability}/5</span>
                          <span>Leadership: 👑 {consultant.leadership}/5</span>
                        </div>
                      </div>
                    </div>

                    {/* AI Insights */}
                    <div className="bg-white rounded-lg p-4 border">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        🤖 AI Insights
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div><strong>Cultural Fit:</strong> {consultant.culturalFitReason}</div>
                        <div><strong>Communication:</strong> {consultant.communicationReason}</div>
                        <div><strong>Values:</strong> {consultant.valuesReason}</div>
                      </div>
                    </div>
                  </div>

                  {/* Estimated Impact */}
                  <div className="bg-white rounded-lg p-4 border mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      📊 Estimated Impact
                    </h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-xl font-bold text-green-600">{consultant.costSavings}</div>
                        <div className="text-sm text-gray-600">Cost Savings</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-blue-600">{consultant.responseTime}</div>
                        <div className="text-sm text-gray-600">Response Time</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-purple-600">{consultant.successProbability}%</div>
                        <div className="text-sm text-gray-600">Success Probability</div>
                      </div>
                    </div>
                  </div>

                  {/* AI Cover Letter */}
                  <div className="bg-white rounded-lg p-4 border mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      ✍️ AI-Generated Cover Letter
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{consultant.coverLetter}</p>
                  </div>

                  {/* Skills */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">🛠️ Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {consultant.skills.map((skill: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                      📄 Export PDF
                    </button>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm">
                      📧 Send Email
                    </button>
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm">
                      💬 Start Chat
                    </button>
                    <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm">
                      👁️ View Full Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create Assignment Modal */}
      {showCreateForm && (
        <CreateAssignmentForm
          onAssignmentCreated={(assignment) => {
            onAssignmentCreated(assignment);
            setShowCreateForm(false);
          }}
          onCancel={() => setShowCreateForm(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
