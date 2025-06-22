
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  CheckCircle, 
  Star, 
  MapPin, 
  Clock, 
  DollarSign,
  User,
  MessageSquare,
  Calendar,
  TrendingUp,
  Award,
  Target,
  Zap
} from 'lucide-react';
import { Assignment } from '@/types/consultant';

interface AIMatchingResultsProps {
  assignment: Assignment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AIMatchingResults: React.FC<AIMatchingResultsProps> = ({
  assignment,
  open,
  onOpenChange,
}) => {
  // Mock matching results based on the images
  const mockMatches = [
    {
      id: 1,
      name: "Og Gup",
      role: "Senior Full-Stack Developer",
      avatar: "O",
      rating: 4.8,
      experience: "5+ years",
      location: "Ej specificerat",
      matchScore: 95,
      technicalSkills: {
        matched: ["React", "TypeScript", "GraphQL", "Node.js", "PostgreSQL"],
        additional: ["Vue.js", "Python", "Docker"]
      },
      skillScores: {
        frontend: 8,
        backend: 7,
        architecture: 6
      },
      personalityFit: {
        culturalFit: 85,
        communicationStyle: 90,
        valuesAlignment: 88
      },
      workStyle: {
        communicationStyle: "Direct and collaborative",
        workApproach: "Methodical and detail-oriented"
      },
      industryExperience: ["E-commerce", "SaaS"],
      projectMetrics: {
        successRate: 94,
        fasterDelivery: 15,
        estimatedSavings: 150000
      },
      timeline: {
        onboarding: "1-2 weeks",
        firstDeliverable: "2-3 weeks",
        fullProductivity: "3-4 weeks"
      },
      coverLetter: "Dear TechStart AB, I am excited to apply for the Senior React Developer for E-commerce Platform position. With 5+ years of experience in React, TypeScript, GraphQL, I am confident I can deliver exceptional results for your E-commerce project. My expertise in React and TypeScript aligns perfectly with your requirements. I have successfully delivered similar projects with a 94% success rate, typically completing deliverables 15% faster than market average. I am particularly drawn to your focus on innovation and collaboration, which matches my collaborative work style. I am available to start immediately and am excited about the opportunity to contribute to your team's success. Best regards, Og Gup",
      confidenceLevel: 92
    }
  ];

  const match = mockMatches[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI-Powered Consultant Matching Results
          </DialogTitle>
          <p className="text-sm text-gray-600">
            Advanced matching based on technical skills, personality fit, and project requirements
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Match Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-l-4 border-blue-500">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {match.avatar}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{match.name}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-3 w-3" />
                  <span>{match.location}</span>
                  <Star className="h-3 w-3 text-yellow-400" />
                  <span>{match.rating}</span>
                  <Clock className="h-3 w-3" />
                  <span>{match.experience}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">{match.matchScore}%</div>
              <div className="text-sm text-gray-600">Match Score</div>
            </div>
          </div>

          {/* Technical Skills Analysis */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold">Technical Skills Analysis</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Matched Skills ({match.technicalSkills.matched.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {match.technicalSkills.matched.map((skill, index) => (
                      <Badge key={index} className="bg-green-100 text-green-800">
                        ✓ {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Additional Skills</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {match.technicalSkills.additional.map((skill, index) => (
                      <Badge key={index} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{match.skillScores.frontend}/10</div>
                  <div className="text-sm text-gray-600">Frontend Expertise</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{match.skillScores.backend}/10</div>
                  <div className="text-sm text-gray-600">Backend Expertise</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{match.skillScores.architecture}/10</div>
                  <div className="text-sm text-gray-600">Architecture Skills</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personality & Team Fit Analysis */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-purple-600" />
                <h4 className="font-semibold">Personality & Team Fit Analysis</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium mb-3">Compatibility Scores</h5>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Cultural Fit</span>
                        <span>{match.personalityFit.culturalFit}%</span>
                      </div>
                      <Progress value={match.personalityFit.culturalFit} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Communication Style</span>
                        <span>{match.personalityFit.communicationStyle}%</span>
                      </div>
                      <Progress value={match.personalityFit.communicationStyle} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Values Alignment</span>
                        <span>{match.personalityFit.valuesAlignment}%</span>
                      </div>
                      <Progress value={match.personalityFit.valuesAlignment} className="h-2" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium mb-3">Work Style Match</h5>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium">Communication Style</span>
                      <p className="text-sm text-gray-600">{match.workStyle.communicationStyle}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Work Approach</span>
                      <p className="text-sm text-gray-600">{match.workStyle.workApproach}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Industry Compatibility Analysis */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Award className="h-5 w-5 text-orange-600" />
                <h4 className="font-semibold">Industry Compatibility Analysis</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium mb-3">Industry Experience</h5>
                  <div className="space-y-2">
                    {match.industryExperience.map((industry, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{industry}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">8/10</div>
                  <div className="text-sm text-gray-600">Industry Knowledge Score</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Success Metrics & ROI Prediction */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold">Project Success Metrics & ROI Prediction</h4>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{match.projectMetrics.successRate}%</div>
                  <div className="text-sm text-gray-600">Project Success Rate</div>
                  <div className="text-xs text-gray-500">Based on similar projects</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{match.projectMetrics.fasterDelivery}%</div>
                  <div className="text-sm text-gray-600">Faster Delivery</div>
                  <div className="text-xs text-gray-500">vs. market average</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{match.projectMetrics.estimatedSavings.toLocaleString()} SEK</div>
                  <div className="text-sm text-gray-600">Estimated Savings</div>
                  <div className="text-xs text-gray-500">vs. hiring internally</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium mb-3">Previous Similar Projects</h5>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">E-commerce platform (React/Node.js)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Fintech dashboard (TypeScript/AWS)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">SaaS migration (Docker/Kubernetes)</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium mb-3">Expected Timeline</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Onboarding:</span>
                      <span className="text-sm font-medium">{match.timeline.onboarding}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">First deliverable:</span>
                      <span className="text-sm font-medium">{match.timeline.firstDeliverable}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Full productivity:</span>
                      <span className="text-sm font-medium">{match.timeline.fullProductivity}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI-Generated Cover Letter */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold">AI-Generated Cover Letter</h4>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm leading-relaxed">{match.coverLetter}</p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">AI Confidence Level</span>
              <Badge className="bg-green-100 text-green-800">
                {match.confidenceLevel}% High Confidence
              </Badge>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline">
                <User className="h-4 w-4 mr-2" />
                View Full Profile
              </Button>
              <Button variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Consultant
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Interview
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
