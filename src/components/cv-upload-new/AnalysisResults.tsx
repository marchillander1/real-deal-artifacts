
import React from 'react';
import { CheckCircle, User, Star, TrendingUp, MapPin, Mail, Phone, Globe, Award, Code, Languages, Briefcase, Target, BookOpen, Lightbulb, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AnalysisResultsProps {
  analysisData: any;
  onViewResults: () => void;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  analysisData,
  onViewResults
}) => {
  const personalInfo = analysisData?.personalInfo || {};
  const skills = analysisData?.skills || {};
  const experience = analysisData?.experience || {};
  const marketAnalysis = analysisData?.marketAnalysis || {};
  const softSkills = analysisData?.softSkills || {};
  const careerCoaching = analysisData?.careerCoaching || {};
  const analysisInsights = analysisData?.analysisInsights || {};
  const suggestedLearningPaths = analysisData?.suggestedLearningPaths || [];

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-16 w-16" />
          </div>
          <CardTitle className="text-3xl font-bold mb-4">
            Analysis Complete! 🎉
          </CardTitle>
          <p className="text-lg opacity-90">
            Comprehensive AI analysis of your professional profile
          </p>
        </CardHeader>

        <CardContent className="p-8">
          {/* Personal Information Summary */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {personalInfo.name || 'Professional Consultant'}
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              {experience.currentRole || 'Consultant'} • {experience.level || 'Senior Level'}
            </p>
            <div className="flex justify-center space-x-4 text-sm text-gray-500">
              <span>{personalInfo.location || 'Location not specified'}</span>
              <span>•</span>
              <span>{experience.years || 0}+ years experience</span>
              <span>•</span>
              <span>{marketAnalysis?.hourlyRate?.optimized || 800} SEK/h recommended</span>
            </div>
          </div>

          {/* Analysis Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardContent className="p-6 text-center">
                <Code className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Technical Skills</h3>
                <p className="text-blue-700">{(skills.technical || []).length} skills identified</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 bg-purple-50">
              <CardContent className="p-6 text-center">
                <User className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-purple-900 mb-2">Soft Skills</h3>
                <p className="text-purple-700">Leadership & communication analyzed</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 bg-green-50">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-green-900 mb-2">Market Valuation</h3>
                <p className="text-green-700">Optimized rate calculated</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-200 bg-orange-50">
              <CardContent className="p-6 text-center">
                <Target className="h-12 w-12 text-orange-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-orange-900 mb-2">Career Development</h3>
                <p className="text-orange-700">Growth opportunities identified</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analysis Sections */}
          <div className="space-y-8">
            {/* Technical Skills Section */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-900">
                  <Code className="h-6 w-6 mr-3" />
                  Technical Skills Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Programming Languages & Frameworks</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(skills.technical || []).slice(0, 8).map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Tools & Platforms</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(skills.tools || []).slice(0, 6).map((tool: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-gray-50 text-gray-700">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Experience Level</h4>
                    <p className="text-gray-600">{experience.level || 'Senior'} • {experience.years || 0}+ years</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Certifications</h4>
                    <p className="text-gray-600">{(analysisData.certifications || []).length} certifications identified</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Soft Skills Section */}
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-900">
                  <User className="h-6 w-6 mr-3" />
                  Soft Skills Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Communication Style</h4>
                    <p className="text-gray-600 mb-4">{softSkills.communicationStyle || 'Professional and collaborative approach'}</p>
                    
                    <h4 className="font-semibold text-gray-800 mb-3">Leadership Abilities</h4>
                    <p className="text-gray-600">{softSkills.leadershipStyle || 'Experienced team leadership and mentoring'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Teamwork & Cultural Fit</h4>
                    <p className="text-gray-600 mb-4">{softSkills.workStyle || 'Strong collaborative working style'}</p>
                    
                    <h4 className="font-semibold text-gray-800 mb-3">Key Values</h4>
                    <div className="flex flex-wrap gap-2">
                      {(softSkills.values || ['Quality', 'Innovation', 'Collaboration']).map((value: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-purple-50 text-purple-700">
                          {value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Market Valuation Section */}
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="flex items-center text-green-900">
                  <TrendingUp className="h-6 w-6 mr-3" />
                  Market Valuation & Positioning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Current Market Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{marketAnalysis?.hourlyRate?.current || 800} SEK/h</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg border-2 border-green-200">
                    <p className="text-sm text-green-600 mb-2">Optimized Rate</p>
                    <p className="text-2xl font-bold text-green-700">{marketAnalysis?.hourlyRate?.optimized || 950} SEK/h</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600 mb-2">Potential Increase</p>
                    <p className="text-2xl font-bold text-blue-700">
                      +{((marketAnalysis?.hourlyRate?.optimized || 950) - (marketAnalysis?.hourlyRate?.current || 800))} SEK/h
                    </p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Competitive Advantages</h4>
                    <ul className="space-y-2 text-gray-600">
                      {(marketAnalysis?.competitiveAdvantages || ['Strong technical expertise', 'Proven track record']).map((advantage: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          {advantage}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Market Demand</h4>
                    <p className="text-gray-600">{marketAnalysis?.marketDemand || 'High demand for your skill set in the current market'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Career Development Section */}
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-900">
                  <Target className="h-6 w-6 mr-3" />
                  Career Development Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Development Areas</h4>
                    <ul className="space-y-2 text-gray-600 mb-4">
                      {(analysisInsights?.developmentAreas || ['Cloud architecture', 'Team leadership']).map((area: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="text-orange-500 mr-2">•</span>
                          {area}
                        </li>
                      ))}
                    </ul>
                    
                    <h4 className="font-semibold text-gray-800 mb-3">CV Optimization Tips</h4>
                    <ul className="space-y-2 text-gray-600">
                      {(careerCoaching?.cvOptimizationTips || ['Highlight quantifiable achievements', 'Emphasize leadership experience']).slice(0, 3).map((tip: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Recommended Learning Paths</h4>
                    <div className="space-y-3 mb-4">
                      {suggestedLearningPaths.slice(0, 3).map((path: any, index: number) => (
                        <div key={index} className="p-3 bg-orange-50 rounded-lg">
                          <h5 className="font-medium text-orange-900">{path.path}</h5>
                          <p className="text-sm text-orange-700">{path.reasoning}</p>
                          <span className="text-xs text-orange-600">Priority: {path.priority}</span>
                        </div>
                      ))}
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-3">Next Career Step</h4>
                    <p className="text-gray-600">{careerCoaching?.careerTrajectory || 'Focus on senior technical leadership roles'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Button */}
          <div className="text-center mt-8">
            <Button
              onClick={onViewResults}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-lg font-semibold rounded-xl"
            >
              <Star className="h-5 w-5 mr-2" />
              Continue to Profile Setup
            </Button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm text-blue-700 text-center">
              🎯 Next: Review and customize your consultant profile before joining the network
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
