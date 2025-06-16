
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Users, Code, Brain, BarChart3, Loader2, TrendingUp, Award, Target, Star } from 'lucide-react';

interface AnalysisResultsProps {
  analysisResults: any;
  isAnalyzing: boolean;
  analysisProgress: number;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  analysisResults,
  isAnalyzing,
  analysisProgress
}) => {
  if (isAnalyzing) {
    return (
      <Card className="shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-4">
            <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold mb-4">Analyzing your CV & LinkedIn...</h3>
          <Progress value={analysisProgress} className="w-full mb-4" />
          <p className="text-gray-600">
            Our AI is performing comprehensive analysis of your CV and LinkedIn profile, 
            extracting technical skills, soft skills, leadership qualities and creating your complete professional profile.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!analysisResults) {
    return null;
  }

  const cvAnalysis = analysisResults.cvAnalysis;
  const linkedinAnalysis = analysisResults.linkedinAnalysis;
  const improvementTips = analysisResults.improvementTips;

  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-green-600 flex items-center justify-center gap-2">
            <CheckCircle2 className="h-6 w-6" />
            Comprehensive Analysis Complete!
          </CardTitle>
          <CardDescription>
            Your CV and LinkedIn have been analyzed successfully. Review your results and complete the form to join our network.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Professional Summary */}
      {cvAnalysis?.professionalSummary && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Professional Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Level:</span>
                <p className="font-semibold">{cvAnalysis.professionalSummary.seniorityLevel}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Experience:</span>
                <p className="font-semibold">{cvAnalysis.professionalSummary.yearsOfExperience}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Role:</span>
                <p className="font-semibold">{cvAnalysis.professionalSummary.currentRole}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Trajectory:</span>
                <p className="font-semibold text-green-600">{cvAnalysis.professionalSummary.careerTrajectory}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Technical Expertise */}
      {cvAnalysis?.technicalExpertise && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5 text-purple-500" />
              Technical Expertise
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cvAnalysis.technicalExpertise.programmingLanguages?.expert && (
              <div>
                <span className="text-sm font-medium text-gray-700">Expert Skills:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {cvAnalysis.technicalExpertise.programmingLanguages.expert.map((skill: string, idx: number) => (
                    <Badge key={idx} className="bg-green-100 text-green-800">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}
            {cvAnalysis.technicalExpertise.cloudAndInfrastructure?.platforms && (
              <div className="mt-3">
                <span className="text-sm font-medium text-gray-700">Cloud Platforms:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {cvAnalysis.technicalExpertise.cloudAndInfrastructure.platforms.map((platform: string, idx: number) => (
                    <Badge key={idx} className="bg-blue-100 text-blue-800">{platform}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Leadership Analysis */}
      {linkedinAnalysis && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-500" />
              Communication & Leadership
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Communication Style:</span>
                <p className="font-semibold">{linkedinAnalysis.communicationStyle}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Leadership Approach:</span>
                <p className="font-semibold">{linkedinAnalysis.leadershipStyle}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="text-center">
                  <p className="text-xs text-gray-600">Cultural Fit</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: `${(linkedinAnalysis.culturalFit/5)*100}%`}}></div>
                  </div>
                  <p className="text-xs font-bold text-blue-600 mt-1">{linkedinAnalysis.culturalFit}/5</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600">Leadership</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-orange-600 h-2 rounded-full" style={{width: `${(linkedinAnalysis.leadership/5)*100}%`}}></div>
                  </div>
                  <p className="text-xs font-bold text-orange-600 mt-1">{linkedinAnalysis.leadership}/5</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600">Innovation</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: `${((linkedinAnalysis.innovation || 4)/5)*100}%`}}></div>
                  </div>
                  <p className="text-xs font-bold text-green-600 mt-1">{linkedinAnalysis.innovation || 4}/5</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Market Positioning */}
      {cvAnalysis?.marketPositioning && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              Market Positioning
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-sm text-gray-600">Unique Value:</span>
              <p className="text-sm font-medium">{cvAnalysis.marketPositioning.uniqueValueProposition}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Competitiveness:</span>
              <p className="text-sm font-semibold text-blue-600">{cvAnalysis.marketPositioning.competitiveness}</p>
            </div>
            {cvAnalysis.marketPositioning.salaryBenchmarks && (
              <div className="space-y-2">
                <span className="text-sm font-medium text-gray-700">Salary Range:</span>
                <div className="text-center p-2 bg-blue-50 rounded">
                  <p className="text-xs text-gray-600">Stockholm Market</p>
                  <p className="text-sm font-bold text-blue-600">{cvAnalysis.marketPositioning.salaryBenchmarks.stockholm}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Improvement Tips */}
      {improvementTips && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Personalized Improvement Tips
            </CardTitle>
            <CardDescription>
              Based on your CV and LinkedIn analysis, here are specific recommendations to enhance your profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-1 gap-6">
              {/* CV Tips */}
              {improvementTips.cvTips && improvementTips.cvTips.length > 0 && (
                <div>
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Award className="h-5 w-5 text-blue-500" />
                    CV Improvements
                  </h4>
                  <div className="space-y-3">
                    {improvementTips.cvTips.map((tip: any, idx: number) => (
                      <div key={idx} className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-3 rounded-r-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={tip.priority === 'High' ? 'destructive' : 'secondary'}>
                            {tip.priority}
                          </Badge>
                          <span className="font-medium text-blue-800">{tip.category}</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{tip.tip}</p>
                        {tip.action && (
                          <p className="text-xs text-blue-600 font-medium">Action: {tip.action}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* LinkedIn Tips */}
              {improvementTips.linkedinTips && improvementTips.linkedinTips.length > 0 && (
                <div>
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-500" />
                    LinkedIn Improvements
                  </h4>
                  <div className="space-y-3">
                    {improvementTips.linkedinTips.map((tip: any, idx: number) => (
                      <div key={idx} className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-3 rounded-r-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={tip.priority === 'High' ? 'destructive' : 'secondary'}>
                            {tip.priority}
                          </Badge>
                          <span className="font-medium text-purple-800">{tip.category}</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{tip.tip}</p>
                        {tip.action && (
                          <p className="text-xs text-purple-600 font-medium">Action: {tip.action}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Overall Strategy */}
              {improvementTips.overallStrategy && improvementTips.overallStrategy.length > 0 && (
                <div>
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-500" />
                    Overall Strategy
                  </h4>
                  <div className="space-y-3">
                    {improvementTips.overallStrategy.map((tip: any, idx: number) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                        <Star className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={tip.priority === 'High' ? 'destructive' : 'secondary'}>
                              {tip.priority}
                            </Badge>
                            <span className="font-medium text-green-800">{tip.category}</span>
                          </div>
                          <p className="text-sm text-gray-700 mb-1">{tip.tip}</p>
                          {tip.action && (
                            <p className="text-xs text-green-600 font-medium">Action: {tip.action}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
