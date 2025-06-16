
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Code, Users, Brain, DollarSign, TrendingUp, Award, Target, Star, CheckCircle2, Loader2, Zap, Trophy, Lightbulb, BookOpen, Briefcase } from 'lucide-react';

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
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
            AI Analysis in Progress
          </CardTitle>
          <CardDescription>
            Analyzing your CV and LinkedIn profile for comprehensive insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>{analysisProgress}%</span>
            </div>
            <Progress value={analysisProgress} className="w-full" />
            <div className="text-sm text-gray-600">
              {analysisProgress < 30 && "Processing CV file..."}
              {analysisProgress >= 30 && analysisProgress < 60 && "Extracting professional information..."}
              {analysisProgress >= 60 && analysisProgress < 80 && "Analyzing LinkedIn profile..."}
              {analysisProgress >= 80 && "Generating insights and recommendations..."}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysisResults) {
    return (
      <Card className="shadow-lg border-dashed">
        <CardHeader className="text-center">
          <CardTitle className="text-gray-500">AI Analysis</CardTitle>
          <CardDescription>
            Upload your CV to start comprehensive analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Brain className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Waiting for CV upload...</p>
        </CardContent>
      </Card>
    );
  }

  const cvAnalysis = analysisResults.cvAnalysis;
  const linkedinAnalysis = analysisResults.linkedinAnalysis;
  const improvementTips = analysisResults.improvementTips;

  return (
    <div className="space-y-6">
      {/* Analysis Complete Header */}
      <Card className="shadow-lg border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
          <CardTitle className="text-green-700">Analysis Complete!</CardTitle>
          <CardDescription className="text-green-600">
            Your comprehensive professional profile has been analyzed
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Market Rate Estimate */}
      {cvAnalysis?.marketPositioning?.hourlyRateEstimate && (
        <Card className="shadow-lg border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              Market Rate Estimate
            </CardTitle>
            <CardDescription>
              Based on your skills, experience, and market demand
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {cvAnalysis.marketPositioning.hourlyRateEstimate.recommended} {cvAnalysis.marketPositioning.hourlyRateEstimate.currency}/h
                </div>
                <div className="text-lg text-gray-600 mb-2">
                  Range: {cvAnalysis.marketPositioning.hourlyRateEstimate.min} - {cvAnalysis.marketPositioning.hourlyRateEstimate.max} {cvAnalysis.marketPositioning.hourlyRateEstimate.currency}/h
                </div>
                <p className="text-sm text-gray-500 italic max-w-md mx-auto">
                  {cvAnalysis.marketPositioning.hourlyRateEstimate.explanation}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Professional Summary */}
      {cvAnalysis?.professionalSummary && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Professional Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
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
                <span className="text-sm text-gray-600">Career Development:</span>
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
              Technical Skills Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cvAnalysis.technicalExpertise.programmingLanguages?.expert && (
              <div>
                <span className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  Expert Level Skills:
                </span>
                <div className="flex flex-wrap gap-2">
                  {cvAnalysis.technicalExpertise.programmingLanguages.expert.map((skill: string, idx: number) => (
                    <Badge key={idx} className="bg-green-100 text-green-800">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}
            {cvAnalysis.technicalExpertise.programmingLanguages?.proficient && (
              <div>
                <span className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                  <Star className="h-4 w-4 text-blue-500" />
                  Proficient Skills:
                </span>
                <div className="flex flex-wrap gap-2">
                  {cvAnalysis.technicalExpertise.programmingLanguages.proficient.map((skill: string, idx: number) => (
                    <Badge key={idx} className="bg-blue-100 text-blue-800">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}
            {cvAnalysis.technicalExpertise.frameworks && (
              <div>
                <span className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                  <Briefcase className="h-4 w-4 text-purple-500" />
                  Frameworks & Tools:
                </span>
                <div className="flex flex-wrap gap-2">
                  {cvAnalysis.technicalExpertise.frameworks.map((framework: string, idx: number) => (
                    <Badge key={idx} className="bg-purple-100 text-purple-800">{framework}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Career Potential & Growth */}
      {cvAnalysis?.careerPotential && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              Career Potential Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Current Level:</span>
                <p className="font-semibold text-orange-600">{cvAnalysis.careerPotential.currentLevel}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Growth Potential:</span>
                <p className="font-semibold text-green-600">{cvAnalysis.careerPotential.growthPotential || 'High'}</p>
              </div>
            </div>
            {cvAnalysis.careerPotential.nextSteps && (
              <div>
                <span className="text-sm font-medium text-gray-700 mb-2 block">Recommended Next Steps:</span>
                <div className="flex flex-wrap gap-2">
                  {cvAnalysis.careerPotential.nextSteps.map((step: string, idx: number) => (
                    <Badge key={idx} variant="outline" className="text-orange-700 border-orange-300">{step}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* LinkedIn Analysis */}
      {linkedinAnalysis && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-500" />
              Leadership & Communication Analysis
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
              <div>
                <span className="text-sm text-gray-600">Problem Solving:</span>
                <p className="font-semibold">{linkedinAnalysis.problemSolving}</p>
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

      {/* Personality Traits */}
      {cvAnalysis?.softSkills && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Personality Traits & Soft Skills
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cvAnalysis.softSkills.communication && (
              <div>
                <span className="text-sm font-medium text-gray-700 mb-2 block">Communication Strengths:</span>
                <div className="flex flex-wrap gap-2">
                  {cvAnalysis.softSkills.communication.map((trait: string, idx: number) => (
                    <Badge key={idx} className="bg-blue-100 text-blue-800">{trait}</Badge>
                  ))}
                </div>
              </div>
            )}
            {cvAnalysis.softSkills.leadership && (
              <div>
                <span className="text-sm font-medium text-gray-700 mb-2 block">Leadership Qualities:</span>
                <div className="flex flex-wrap gap-2">
                  {cvAnalysis.softSkills.leadership.map((trait: string, idx: number) => (
                    <Badge key={idx} className="bg-orange-100 text-orange-800">{trait}</Badge>
                  ))}
                </div>
              </div>
            )}
            {cvAnalysis.softSkills.problemSolving && (
              <div>
                <span className="text-sm font-medium text-gray-700 mb-2 block">Problem-Solving Approach:</span>
                <div className="flex flex-wrap gap-2">
                  {cvAnalysis.softSkills.problemSolving.map((trait: string, idx: number) => (
                    <Badge key={idx} className="bg-green-100 text-green-800">{trait}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Improvement Tips Summary */}
      {improvementTips && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Quick Wins & Priority Actions
            </CardTitle>
            <CardDescription>
              High-impact improvements to boost your consulting profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {improvementTips.cvTips?.slice(0, 2).map((tip: any, idx: number) => (
                <div key={idx} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                  <Award className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-blue-800 text-sm">{tip.category}</div>
                    <div className="text-sm text-gray-600">{tip.tip}</div>
                  </div>
                </div>
              ))}
              {improvementTips.linkedinTips?.slice(0, 1).map((tip: any, idx: number) => (
                <div key={idx} className="flex items-start gap-2 p-3 bg-purple-50 rounded-lg">
                  <Brain className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-purple-800 text-sm">{tip.category}</div>
                    <div className="text-sm text-gray-600">{tip.tip}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
