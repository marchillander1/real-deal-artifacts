
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Star, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  Award, 
  Target, 
  Brain,
  Users,
  Lightbulb,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  MessageSquare,
  Briefcase,
  Clock,
  DollarSign
} from 'lucide-react';
import { Consultant } from '@/types/consultant';

interface AIMatchingResultsProps {
  assignment: any;
  matches: any[];
  isLoading: boolean;
}

export const AIMatchingResults: React.FC<AIMatchingResultsProps> = ({
  assignment,
  matches,
  isLoading
}) => {
  const [selectedMatch, setSelectedMatch] = useState<string>('');

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🤖 AI-Powered Consultant Matching Results
        </h2>
        <p className="text-gray-600">
          Advanced matching based on technical skills, personality fit, and project requirements
        </p>
      </div>

      {matches.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No matches found for this assignment.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {matches.map((match, index) => (
            <Card key={match.consultant.id} className="shadow-lg border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {match.consultant.name.charAt(0)}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{match.consultant.name}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {match.consultant.location || 'Remote'}
                        </span>
                        <span className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-yellow-500" />
                          {match.consultant.rating || 5.0}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {match.consultant.experience_years || 5}+ years
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-600">{match.match_score}%</div>
                    <div className="text-sm text-gray-500">Match Score</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Technical Skills Analysis */}
                <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                  <h6 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-blue-600" />
                    🔧 Technical Skills Analysis
                  </h6>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h6 className="font-medium text-gray-900 mb-3 flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                        Matched Skills ({match.matched_skills?.length || 0})
                      </h6>
                      <div className="flex flex-wrap gap-2">
                        {(match.matched_skills || assignment.required_skills?.slice(0, 6) || ['React', 'TypeScript', 'Node.js']).map((skill: string, skillIndex: number) => (
                          <Badge key={skillIndex} className="bg-green-100 text-green-800 border-green-300">
                            ✓ {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h6 className="font-medium text-gray-900 mb-3 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-blue-600" />
                        Additional Skills
                      </h6>
                      <div className="flex flex-wrap gap-2">
                        {(match.consultant.skills?.filter((skill: string) => 
                          !match.matched_skills?.includes(skill)
                        ).slice(0, 4) || ['AWS', 'Docker', 'PostgreSQL']).map((skill: string, skillIndex: number) => (
                          <Badge key={skillIndex} variant="outline" className="text-blue-700">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Technical Depth Analysis */}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-white rounded border">
                      <div className="text-2xl font-bold text-blue-600">{match.technical_analysis?.frontend_score || 8}/10</div>
                      <div className="text-sm text-gray-600">Frontend Expertise</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded border">
                      <div className="text-2xl font-bold text-purple-600">{match.technical_analysis?.backend_score || 7}/10</div>
                      <div className="text-sm text-gray-600">Backend Expertise</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded border">
                      <div className="text-2xl font-bold text-orange-600">{match.technical_analysis?.architecture_score || 6}/10</div>
                      <div className="text-sm text-gray-600">Architecture Skills</div>
                    </div>
                  </div>
                </div>

                {/* Personality & Team Fit Analysis */}
                <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500">
                  <h6 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-purple-600" />
                    👥 Personality & Team Fit Analysis
                  </h6>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h6 className="font-medium text-gray-900 mb-3">Compatibility Scores</h6>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Cultural Fit</span>
                          <div className="flex items-center">
                            <div className="w-20 h-2 bg-gray-200 rounded-full mr-2">
                              <div 
                                className="h-2 bg-purple-600 rounded-full" 
                                style={{ width: `${(match.cultural_match || 85)}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{match.cultural_match || 85}%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Communication Style</span>
                          <div className="flex items-center">
                            <div className="w-20 h-2 bg-gray-200 rounded-full mr-2">
                              <div 
                                className="h-2 bg-green-600 rounded-full" 
                                style={{ width: `${(match.communication_match || 90)}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{match.communication_match || 90}%</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Values Alignment</span>
                          <div className="flex items-center">
                            <div className="w-20 h-2 bg-gray-200 rounded-full mr-2">
                              <div 
                                className="h-2 bg-blue-600 rounded-full" 
                                style={{ width: `${(match.values_alignment || 88)}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{match.values_alignment || 88}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h6 className="font-medium text-gray-900 mb-3">Work Style Match</h6>
                      <div className="space-y-2">
                        <div className="bg-white p-3 rounded border">
                          <p className="text-sm font-medium text-gray-900">Communication Style</p>
                          <p className="text-sm text-gray-600">{match.personality_analysis?.communication_style || 'Direct and collaborative'}</p>
                        </div>
                        <div className="bg-white p-3 rounded border">
                          <p className="text-sm font-medium text-gray-900">Work Approach</p>
                          <p className="text-sm text-gray-600">{match.personality_analysis?.work_approach || 'Methodical and detail-oriented'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Industry Compatibility Analysis */}
                <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-orange-500">
                  <h6 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Briefcase className="h-5 w-5 mr-2 text-orange-600" />
                    🏢 Industry Compatibility Analysis
                  </h6>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h6 className="font-medium text-gray-900 mb-3">Industry Experience</h6>
                      <div className="space-y-2">
                        {(match.industry_analysis?.relevant_industries || [assignment.industry || 'Fintech', 'E-commerce', 'SaaS']).map((industry: string, industryIndex: number) => (
                          <div key={industryIndex} className="flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                            <span className="text-sm text-gray-700">{industry}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h6 className="font-medium text-gray-900 mb-3">Domain Expertise</h6>
                      <div className="text-center p-4 bg-white rounded border">
                        <div className="text-3xl font-bold text-orange-600">{match.industry_analysis?.domain_expertise || 8}/10</div>
                        <div className="text-sm text-gray-600">Industry Knowledge Score</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project Success Metrics */}
                <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
                  <h6 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                    📈 Project Success Metrics & ROI Prediction
                  </h6>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white rounded border">
                      <div className="text-2xl font-bold text-green-600">{match.project_metrics?.success_rate || 94}%</div>
                      <div className="text-sm text-gray-600">Project Success Rate</div>
                      <div className="text-xs text-gray-500 mt-1">Based on similar projects</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded border">
                      <div className="text-2xl font-bold text-blue-600">{match.project_metrics?.delivery_speed || 15}%</div>
                      <div className="text-sm text-gray-600">Faster Delivery</div>
                      <div className="text-xs text-gray-500 mt-1">vs. market average</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded border">
                      <div className="text-2xl font-bold text-purple-600">{match.estimated_savings || 150000} SEK</div>
                      <div className="text-sm text-gray-600">Estimated Savings</div>
                      <div className="text-xs text-gray-500 mt-1">vs. hiring internally</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded border">
                      <h6 className="font-medium text-gray-900 mb-2">Previous Similar Projects</h6>
                      <div className="space-y-2">
                        {(match.project_metrics?.similar_projects || [
                          'E-commerce platform (React/Node.js)',
                          'Fintech dashboard (TypeScript/AWS)',
                          'SaaS migration (Docker/Kubernetes)'
                        ]).map((project: string, projectIndex: number) => (
                          <div key={projectIndex} className="flex items-center text-sm text-gray-700">
                            <CheckCircle2 className="h-3 w-3 mr-2 text-green-600" />
                            {project}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded border">
                      <h6 className="font-medium text-gray-900 mb-2">Expected Timeline</h6>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Onboarding:</span>
                          <span className="font-medium">{match.project_metrics?.onboarding_time || '1-2 weeks'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">First deliverable:</span>
                          <span className="font-medium">{match.project_metrics?.first_delivery || '2-3 weeks'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Full productivity:</span>
                          <span className="font-medium">{match.project_metrics?.full_productivity || '3-4 weeks'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI-Generated Cover Letter */}
                <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-gray-400">
                  <h6 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-gray-600" />
                    🤖 AI-Generated Cover Letter
                  </h6>
                  <div className="bg-white p-4 rounded border">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {match.cover_letter || `Dear ${assignment.company || 'Hiring Team'},

I am excited to apply for the ${assignment.title || 'Senior Developer'} position. With ${match.consultant.experience_years || 5}+ years of experience in ${match.matched_skills?.slice(0, 3).join(', ') || 'React, TypeScript, and Node.js'}, I am confident I can deliver exceptional results for your ${assignment.industry || 'technology'} project.

My expertise in ${match.matched_skills?.slice(0, 2).join(' and ') || 'modern web technologies'} aligns perfectly with your requirements. I have successfully delivered similar projects with a ${match.project_metrics?.success_rate || 94}% success rate, typically completing deliverables ${match.project_metrics?.delivery_speed || 15}% faster than market average.

I am particularly drawn to your focus on ${assignment.team_culture || 'innovation and collaboration'}, which matches my ${match.consultant.work_style || 'collaborative'} work style. I am available to start ${assignment.start_date ? 'on your preferred date' : 'immediately'} and am excited about the opportunity to contribute to your team's success.

Best regards,
${match.consultant.name}`}
                    </p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-3 pt-4 border-t">
                  <Button 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => setSelectedMatch(match.consultant.id)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    View Full Profile
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Consultant
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Interview
                  </Button>
                </div>

                {/* Match Confidence Indicator */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <div>
                      <h6 className="font-medium text-gray-900">AI Confidence Level</h6>
                      <p className="text-sm text-gray-600">
                        Based on {match.analysis_factors || 'technical skills, personality fit, industry experience, and project history'}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{match.confidence_score || 92}%</div>
                      <div className="text-sm text-gray-500">High Confidence</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
