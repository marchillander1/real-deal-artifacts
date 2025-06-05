import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload, Star, Mail, Award, Linkedin, Brain, Users, MessageCircle, FileText } from "lucide-react";
import { useSupabaseConsultants } from "@/hooks/useSupabaseConsultants";
import { generateMotivationLetter } from "@/utils/matching";

export const ConsultantsTab = () => {
  const { consultants, isLoading, error } = useSupabaseConsultants();
  const [analyzingLinkedIn, setAnalyzingLinkedIn] = useState<number | null>(null);
  const [linkedInAnalysis, setLinkedInAnalysis] = useState<{[key: number]: any}>({});

  // Demo LinkedIn analysis data for existing consultants
  useEffect(() => {
    const demoAnalysis = {
      1: {
        communicationStyle: "Direct and collaborative",
        workStyle: "Agile and iterative", 
        values: ["Innovation", "Quality", "Teamwork", "Learning"],
        personalityTraits: ["Analytical", "Creative", "Leadership-oriented", "Tech-savvy"],
        teamFit: "Excellent team player with strong mentoring abilities",
        culturalFit: 4.5,
        adaptability: 4.3,
        leadership: 4.2
      },
      2: {
        communicationStyle: "Empathetic and detail-oriented",
        workStyle: "Structured and methodical",
        values: ["Quality", "Reliability", "User-focus", "Continuous improvement"],
        personalityTraits: ["Detail-focused", "Empathetic", "Problem-solver", "Collaborative"],
        teamFit: "Strong collaborator focused on user experience",
        culturalFit: 4.7,
        adaptability: 4.1,
        leadership: 3.8
      },
      3: {
        communicationStyle: "Strategic and visionary",
        workStyle: "Results-driven and scalable",
        values: ["Scalability", "Performance", "Innovation", "Excellence"],
        personalityTraits: ["Strategic", "Technical", "Innovative", "Results-oriented"],
        teamFit: "Technical leader with strong architecture skills",
        culturalFit: 4.3,
        adaptability: 4.6,
        leadership: 4.8
      },
      4: {
        communicationStyle: "Analytical and systematic",
        workStyle: "Data-driven and security-focused",
        values: ["Security", "Data integrity", "Precision", "Best practices"],
        personalityTraits: ["Analytical", "Security-minded", "Systematic", "Reliable"],
        teamFit: "Backend specialist with strong security awareness",
        culturalFit: 4.4,
        adaptability: 4.0,
        leadership: 3.9
      },
      5: {
        communicationStyle: "Creative and user-centric",
        workStyle: "Design-thinking and iterative",
        values: ["User experience", "Creativity", "Accessibility", "Innovation"],
        personalityTraits: ["Creative", "User-focused", "Intuitive", "Collaborative"],
        teamFit: "UX-focused developer bridging design and development",
        culturalFit: 4.6,
        adaptability: 4.4,
        leadership: 4.0
      }
    };
    setLinkedInAnalysis(demoAnalysis);
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      console.log('CV file uploaded:', files[0].name);
      // TODO: Implement CV processing
    }
  };

  const handleLinkedInAnalysis = async (consultantId: number, linkedinUrl: string) => {
    setAnalyzingLinkedIn(consultantId);
    
    try {
      const response = await fetch('https://xbliknlrikolcjjfhxqa.supabase.co/functions/v1/analyze-linkedin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ linkedinUrl }),
      });

      const data = await response.json();
      
      if (data.success) {
        setLinkedInAnalysis(prev => ({
          ...prev,
          [consultantId]: data.analysis
        }));
      }
    } catch (error) {
      console.error('LinkedIn analysis failed:', error);
    } finally {
      setAnalyzingLinkedIn(null);
    }
  };

  const generateCoverLetter = (consultant: any) => {
    // Mock assignment data for demo purposes with all required properties
    const mockAssignment = {
      id: 1,
      title: "Senior React Developer",
      description: "We are looking for an experienced React developer to join our team",
      requiredSkills: ["React", "TypeScript", "Node.js"],
      startDate: "2024-02-01",
      duration: "6 months",
      workload: "Full-time",
      budget: "800-1200 SEK/hour",
      company: "TechCorp AB",
      industry: "E-handel",
      teamSize: "5-10 people",
      remote: "Hybrid (2 days office)",
      urgency: "High",
      clientLogo: "" // Adding the missing required property
    };

    return generateMotivationLetter(consultant, mockAssignment, 92);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Laddar konsulter...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Fel vid hämtning av konsulter</div>
      </div>
    );
  }

  const existingConsultants = consultants.filter(c => c.type === 'existing');
  const networkConsultants = consultants.filter(c => c.type === 'new');

  const renderConsultantCard = (consultant: any, isNetwork = false) => {
    const borderColor = isNetwork ? 'border-2 border-green-300' : 'border border-gray-200';
    const badgeColor = isNetwork ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-600';
    const badgeText = isNetwork ? 'Network Member' : 'Our Team';
    const avatarColor = isNetwork ? 'bg-green-600' : 'bg-blue-500';
    const skillsColor = isNetwork ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200';
    const experienceYears = consultant.experience_years || consultant.experience?.replace(/\D/g, '') || '0';
    const analysis = linkedInAnalysis[consultant.id];

    return (
      <Card key={consultant.id} className={`${borderColor} hover:shadow-lg transition-all duration-200 ${isNetwork ? 'bg-green-50/30' : ''}`}>
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 ${avatarColor} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                {getInitials(consultant.name)}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{consultant.name}</h4>
                <p className="text-gray-600">{consultant.roles?.[0] || 'Consultant'}</p>
                <Badge className={badgeColor}>
                  {badgeText}
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="font-semibold">{consultant.rating || 4.5}</span>
            </div>
          </div>

          {/* Basic Info */}
          <div className="space-y-3 mb-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Experience:</span>
              <span className="font-medium">{experienceYears} years</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Projects:</span>
              <span className="font-medium">{consultant.projects_completed || consultant.projects || 0} completed</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Rate:</span>
              <span className="font-medium text-green-600">{consultant.hourly_rate || consultant.rate || 'N/A'} SEK/hour</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Location:</span>
              <span className="font-medium">{consultant.location || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status:</span>
              <Badge className="bg-green-100 text-green-800">
                {consultant.availability || 'Available'}
              </Badge>
            </div>
          </div>

          {/* LinkedIn Analysis Section */}
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Linkedin className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">LinkedIn Analysis</span>
              </div>
              {consultant.linkedinUrl && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 px-2 text-xs"
                  onClick={() => handleLinkedInAnalysis(consultant.id, consultant.linkedinUrl)}
                  disabled={analyzingLinkedIn === consultant.id}
                >
                  {analyzingLinkedIn === consultant.id ? '🤖 Analyzing...' : '🔍 Analyze'}
                </Button>
              )}
            </div>
            
            {analysis ? (
              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-blue-700 font-medium">Communication:</span>
                    <p className="text-blue-600">{analysis.communicationStyle}</p>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Work Style:</span>
                    <p className="text-blue-600">{analysis.workStyle}</p>
                  </div>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Values:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {analysis.values?.map((value: string, idx: number) => (
                      <Badge key={idx} className="bg-blue-100 text-blue-700 text-xs">
                        {value}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Personality:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {analysis.personalityTraits?.map((trait: string, idx: number) => (
                      <Badge key={idx} className="bg-purple-100 text-purple-700 text-xs">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-blue-200">
                  <div className="text-center">
                    <div className="text-sm font-bold text-blue-600">{analysis.culturalFit || 4.2}/5</div>
                    <div className="text-xs text-blue-500">Cultural Fit</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-blue-600">{analysis.adaptability || 4.3}/5</div>
                    <div className="text-xs text-blue-500">Adaptability</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-blue-600">{analysis.leadership || 4.0}/5</div>
                    <div className="text-xs text-blue-500">Leadership</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-blue-600">
                {existingConsultants.includes(consultant) ? 'Demo data loaded - Click Analyze for real analysis' : 'No LinkedIn URL provided'}
              </div>
            )}
          </div>

          {/* Human Factors Section */}
          <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">Human Factors</span>
            </div>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-purple-700 font-medium">Communication Style:</span>
                <p className="text-purple-600">{consultant.communication_style || consultant.communicationStyle || analysis?.communicationStyle || 'Collaborative'}</p>
              </div>
              <div>
                <span className="text-purple-700 font-medium">Work Style:</span>
                <p className="text-purple-600">{consultant.work_style || consultant.workStyle || analysis?.workStyle || 'Agile'}</p>
              </div>
              <div>
                <span className="text-purple-700 font-medium">Team Fit:</span>
                <p className="text-purple-600">{consultant.team_fit || consultant.teamFit || analysis?.teamFit || 'Strong team player'}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-purple-200">
                <div className="text-center">
                  <div className="text-sm font-bold text-purple-600">{consultant.cultural_fit || consultant.culturalFit || analysis?.culturalFit || 4.5}/5</div>
                  <div className="text-xs text-purple-500">Cultural</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-purple-600">{consultant.adaptability || analysis?.adaptability || 4.3}/5</div>
                  <div className="text-xs text-purple-500">Adaptable</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-purple-600">{consultant.leadership || analysis?.leadership || 4.0}/5</div>
                  <div className="text-xs text-purple-500">Leadership</div>
                </div>
              </div>
            </div>
          </div>

          {/* Values & Personality */}
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Values & Personality</span>
            </div>
            <div className="space-y-2">
              <div>
                <span className="text-xs text-gray-600">Core Values:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {(consultant.values || analysis?.values || ['Quality', 'Innovation']).map((value: string, idx: number) => (
                    <Badge key={idx} className="bg-green-100 text-green-800 text-xs">
                      {value}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-xs text-gray-600">Personality Traits:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {(consultant.personality_traits || analysis?.personalityTraits || ['Analytical', 'Creative']).map((trait: string, idx: number) => (
                    <Badge key={idx} className="bg-orange-100 text-orange-800 text-xs">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Technical Skills */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Technical Skills:</p>
            <div className="flex flex-wrap gap-2">
              {consultant.skills?.slice(0, 4).map((skill: string, index: number) => (
                <Badge key={index} className={`${skillsColor} border`}>
                  {skill}
                </Badge>
              ))}
              {consultant.skills?.length > 4 && (
                <Badge className="bg-gray-100 text-gray-600">
                  +{consultant.skills.length - 4} more
                </Badge>
              )}
            </div>
          </div>

          {/* AI Cover Letter Section */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">AI-Generated Cover Letter</span>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="h-6 px-2 text-xs">
                    🤖 Generate & View
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>AI-Generated Cover Letter for {consultant.name}</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">
                    <pre className="whitespace-pre-wrap text-sm font-mono bg-gray-50 p-4 rounded-lg border overflow-x-auto">
                      {generateCoverLetter(consultant)}
                    </pre>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Advanced AI-generated personalized cover letter based on consultant profile and assignment requirements
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Mail className="h-3 w-3" />
              <span>Contact</span>
            </div>
            <div className="flex items-center space-x-1">
              <Award className="h-3 w-3 text-blue-500" />
              <span className="text-blue-600 font-medium text-sm">{consultant.certifications?.[0] || 'Certified'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Consultant Database</h2>
          <p className="text-gray-600 mt-1">
            ✅ AI-powered consultant profiles with LinkedIn analysis
            <br />
            ✅ Values & Personality Analysis - Communication style, work approach, and personal values
            <br />
            ✅ Cultural Fit Scoring - Team dynamics, leadership style, and adaptability matching
            <br />
            ✅ AI-Generated Cover Letters - Personalized motivation letters for each assignment
          </p>
        </div>
        <div className="relative">
          <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
            <Upload className="h-4 w-4" />
            Upload CV
          </Button>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>

      {/* Our Consultants */}
      <div>
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Award className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Our Consultants</h3>
            <p className="text-gray-600">Our established team with full AI analysis</p>
          </div>
          <Badge className="bg-blue-100 text-blue-600">
            {existingConsultants.length} consultants
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {existingConsultants.map((consultant) => renderConsultantCard(consultant, false))}
        </div>
      </div>

      {/* Network Consultants */}
      <div>
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <Users className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Network Consultants</h3>
            <p className="text-gray-600">External consultants uploaded via CV-upload with AI-enhanced profiles</p>
          </div>
          <Badge className="bg-green-100 text-green-600">
            {networkConsultants.length} network members
          </Badge>
        </div>
        
        {networkConsultants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {networkConsultants.map((consultant) => renderConsultantCard(consultant, true))}
          </div>
        ) : (
          <div className="text-center py-12 bg-green-50 rounded-lg border-2 border-dashed border-green-200">
            <Users className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Network Consultants Yet</h4>
            <p className="text-gray-600 mb-4">
              Network consultants will appear here when CVs are uploaded via the CV Upload page.
            </p>
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => window.location.href = '/cv-upload'}
            >
              <Upload className="h-4 w-4 mr-2" />
              Go to CV Upload
            </Button>
          </div>
        )}
      </div>

      {consultants.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No consultants found</div>
          <p className="text-gray-400 mt-2">Upload consultants to get started</p>
        </div>
      )}
    </div>
  );
};
