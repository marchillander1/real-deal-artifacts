import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Code, Users, Brain, DollarSign, TrendingUp, Award, Target, Star, CheckCircle2, Loader2, Zap, Trophy, Lightbulb, BookOpen, Briefcase, Building, Rocket, TrendingDown, Clock, ArrowUp } from 'lucide-react';

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
            Enhanced AI Analysis in Progress
          </CardTitle>
          <CardDescription>
            Analyzing CV, LinkedIn profile, market positioning, and team fit
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
              {analysisProgress >= 60 && analysisProgress < 80 && "Analyzing LinkedIn profile and market positioning..."}
              {analysisProgress >= 80 && "Generating insights, ROI predictions, and recommendations..."}
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
          <CardTitle className="text-gray-500">Enhanced AI Analysis</CardTitle>
          <CardDescription>
            Upload your CV to start comprehensive analysis with market insights
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
  const roiPredictions = analysisResults.roiPredictions;
  const certificationRecommendations = analysisResults.certificationRecommendations;

  return (
    <div className="space-y-6">
      {/* Analysis Complete Header */}
      <Card className="shadow-lg border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
          <CardTitle className="text-green-700">Enhanced Analysis Complete!</CardTitle>
          <CardDescription className="text-green-600">
            Comprehensive professional profile with market insights and ROI predictions
          </CardDescription>
        </CardHeader>
      </Card>

      {/* ROI Predictions - New Feature */}
      {roiPredictions && (
        <Card className="shadow-lg border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-green-500" />
              Market Value & Growth Potential
            </CardTitle>
            <CardDescription>
              Current market positioning and improvement potential
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Current Market Value</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Hourly Rate:</span>
                    <span className="font-bold text-green-600">{roiPredictions.currentMarketValue.hourlyRate} SEK/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Monthly Potential:</span>
                    <span className="font-semibold">{roiPredictions.currentMarketValue.monthlyPotential.toLocaleString()} SEK</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Growth Trajectory</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">6 months:</span>
                    <div className="flex items-center gap-1">
                      <ArrowUp className="h-3 w-3 text-green-500" />
                      <span className="font-semibold text-green-600">{roiPredictions.improvementPotential.with6MonthsImprovement.hourlyRate} SEK/h</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">1 year:</span>
                    <div className="flex items-center gap-1">
                      <ArrowUp className="h-3 w-3 text-green-500" />
                      <span className="font-semibold text-green-600">{roiPredictions.improvementPotential.with1YearImprovement.hourlyRate} SEK/h</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">2 years:</span>
                    <div className="flex items-center gap-1">
                      <ArrowUp className="h-3 w-3 text-green-500" />
                      <span className="font-semibold text-green-600">{roiPredictions.improvementPotential.with2YearImprovement.hourlyRate} SEK/h</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Fit Assessment - New Feature */}
      {linkedinAnalysis?.teamFitAssessment && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Team Fit & Client Compatibility
            </CardTitle>
            <CardDescription>
              How well you fit with different team structures and client types
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Work Style:</span>
                <p className="font-semibold">{linkedinAnalysis.teamFitAssessment.workStyle}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Communication:</span>
                <p className="font-semibold">{linkedinAnalysis.teamFitAssessment.communicationPreference}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Decision Making:</span>
                <p className="font-semibold">{linkedinAnalysis.teamFitAssessment.decisionMaking}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Project Approach:</span>
                <p className="font-semibold">{linkedinAnalysis.teamFitAssessment.projectApproach}</p>
              </div>
            </div>
            
            {roiPredictions?.teamFitValue && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-semibold text-gray-800 mb-3">Client Type Compatibility</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">Startup Fit</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{width: `${(roiPredictions.teamFitValue.startupFit/5)*100}%`}}></div>
                    </div>
                    <p className="text-xs font-bold text-purple-600 mt-1">{roiPredictions.teamFitValue.startupFit}/5</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">Enterprise Fit</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: `${(roiPredictions.teamFitValue.enterpriseFit/5)*100}%`}}></div>
                    </div>
                    <p className="text-xs font-bold text-blue-600 mt-1">{roiPredictions.teamFitValue.enterpriseFit}/5</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">Consulting Ready</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{width: `${(roiPredictions.teamFitValue.consultingReadiness/10)*100}%`}}></div>
                    </div>
                    <p className="text-xs font-bold text-green-600 mt-1">{roiPredictions.teamFitValue.consultingReadiness}/10</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Market Positioning - New Feature */}
      {linkedinAnalysis?.marketPositioning && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-orange-500" />
              Market Positioning & Competitive Edge
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-sm font-medium text-gray-700 mb-2 block">Unique Value Proposition:</span>
              <p className="text-gray-800">{linkedinAnalysis.marketPositioning.uniqueValueProposition}</p>
            </div>
            
            <div>
              <span className="text-sm font-medium text-gray-700 mb-2 block">Competitive Advantages:</span>
              <div className="flex flex-wrap gap-2">
                {linkedinAnalysis.marketPositioning.competitiveAdvantages?.map((advantage: string, idx: number) => (
                  <Badge key={idx} className="bg-orange-100 text-orange-800">{advantage}</Badge>
                ))}
              </div>
            </div>

            <div>
              <span className="text-sm font-medium text-gray-700 mb-2 block">Niche Specialization Potential:</span>
              <p className="text-gray-800">{linkedinAnalysis.marketPositioning.nicheSpecialization}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Certification Recommendations - New Feature */}
      {certificationRecommendations && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              Recommended Certifications
            </CardTitle>
            <CardDescription>
              Strategic certifications to boost your market value and consulting readiness
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {certificationRecommendations.technical?.map((cert: any, idx: number) => (
                <div key={idx} className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-blue-800">{cert.certification}</h4>
                    <Badge className={cert.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                      {cert.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{cert.reason}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {cert.timeToComplete}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {cert.marketValue}
                    </span>
                  </div>
                </div>
              ))}
              
              {certificationRecommendations.business?.map((cert: any, idx: number) => (
                <div key={idx} className="border border-green-200 rounded-lg p-4 bg-green-50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-green-800">{cert.certification}</h4>
                    <Badge className={cert.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                      {cert.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{cert.reason}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {cert.timeToComplete}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {cert.marketValue}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {cvAnalysis?.marketPositioning?.hourlyRateEstimate && (
        <Card className="shadow-lg border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              Current Market Rate Estimate
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
    </div>
  );
};
