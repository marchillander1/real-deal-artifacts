import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Code, Users, Brain, DollarSign, TrendingUp, Award, Target, Star, CheckCircle2, Loader2, Zap, Trophy, Lightbulb, BookOpen, Briefcase, Building, Rocket, TrendingDown, Clock, ArrowUp, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

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
            Analyzing CV, LinkedIn profile, technical skills, and market positioning
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
              {analysisProgress >= 60 && analysisProgress < 80 && "Analyzing LinkedIn profile and technical skills..."}
              {analysisProgress >= 80 && "Generating insights, improvement tips, and recommendations..."}
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
            Upload your CV to start comprehensive analysis with technical assessment and improvement tips
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
  const technicalAssessment = analysisResults.technicalAssessment;
  const preUploadGuidance = analysisResults.preUploadGuidance;

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
            Comprehensive professional profile with technical assessment and optimization guidance
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Technical Skills Assessment - NEW */}
      {technicalAssessment && (
        <Card className="shadow-lg border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5 text-blue-500" />
              Teknisk Kompetensanalys
            </CardTitle>
            <CardDescription>
              Djupgående bedömning av tekniska färdigheter och marknadspotential
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Technical Maturity Scores */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Teknisk Mognadsgrad</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-1">Frontend</p>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-blue-600 h-3 rounded-full" style={{width: `${technicalAssessment.technicalMaturity.frontendScore * 10}%`}}></div>
                  </div>
                  <p className="text-xs font-bold text-blue-600 mt-1">{technicalAssessment.technicalMaturity.frontendScore}/10</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-1">Backend</p>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-green-600 h-3 rounded-full" style={{width: `${technicalAssessment.technicalMaturity.backendScore * 10}%`}}></div>
                  </div>
                  <p className="text-xs font-bold text-green-600 mt-1">{technicalAssessment.technicalMaturity.backendScore}/10</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-1">DevOps</p>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-purple-600 h-3 rounded-full" style={{width: `${technicalAssessment.technicalMaturity.devopsScore * 10}%`}}></div>
                  </div>
                  <p className="text-xs font-bold text-purple-600 mt-1">{technicalAssessment.technicalMaturity.devopsScore}/10</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-1">Data</p>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-orange-600 h-3 rounded-full" style={{width: `${technicalAssessment.technicalMaturity.dataScore * 10}%`}}></div>
                  </div>
                  <p className="text-xs font-bold text-orange-600 mt-1">{technicalAssessment.technicalMaturity.dataScore}/10</p>
                </div>
              </div>
              <div className="text-center mt-4">
                <Badge className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1">
                  Övergripande nivå: {technicalAssessment.technicalMaturity.overallLevel}
                </Badge>
              </div>
            </div>

            {/* Skills Gap Analysis */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Kompetensanalys</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-green-700">Starka områden</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {technicalAssessment.skillsGapAnalysis.strengths?.map((skill: string, idx: number) => (
                      <Badge key={idx} className="bg-green-100 text-green-800 text-xs">{skill}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium text-red-700">Saknade färdigheter</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {technicalAssessment.skillsGapAnalysis.missing?.map((skill: string, idx: number) => (
                      <Badge key={idx} className="bg-red-100 text-red-800 text-xs">{skill}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Improvement Priorities */}
            {technicalAssessment.improvementPriority?.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Förbättringsrekommendationer</h4>
                <div className="space-y-3">
                  {technicalAssessment.improvementPriority.map((item: any, idx: number) => (
                    <div key={idx} className="border border-orange-200 rounded-lg p-3 bg-orange-50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-orange-800">{item.category}</span>
                        <Badge className={item.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                          {item.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{item.reason}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Kompetenser: {item.skills?.join(', ')}</span>
                        <span>Tidslinje: {item.timeline}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pre-Upload Optimization Guide - NEW */}
      {preUploadGuidance && (
        <Card className="shadow-lg border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-purple-500" />
              Optimeringsguide: Förbättra innan du laddar upp
            </CardTitle>
            <CardDescription>
              Konkreta tips för att maximera dina chanser att få jobb
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* CV Optimization */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                CV-optimering
              </h4>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-700 mb-2 block">Omedelbar förbättring:</span>
                  {preUploadGuidance.cvOptimization.immediate?.map((tip: any, idx: number) => (
                    <div key={idx} className="border-l-4 border-blue-500 pl-4 mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-blue-800">{tip.area}</span>
                        <Badge className="bg-blue-100 text-blue-800 text-xs">{tip.impact}</Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{tip.action}</p>
                      <p className="text-xs text-gray-500 italic">Mall: {tip.template}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* LinkedIn Optimization */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Building className="h-4 w-4" />
                LinkedIn-optimering
              </h4>
              <div className="space-y-3">
                {preUploadGuidance.linkedinOptimization.profile?.map((tip: any, idx: number) => (
                  <div key={idx} className="border-l-4 border-green-500 pl-4 mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-green-800">{tip.area}</span>
                      <Badge className="bg-green-100 text-green-800 text-xs">{tip.impact}</Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{tip.action}</p>
                    <p className="text-xs text-gray-500 italic">Mall: {tip.template}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Optimeringstidslinje
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Badge className="bg-red-100 text-red-800">Vecka 1</Badge>
                  <span className="text-sm text-gray-700">{preUploadGuidance.timeline?.week1?.join(', ')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-orange-100 text-orange-800">Vecka 2</Badge>
                  <span className="text-sm text-gray-700">{preUploadGuidance.timeline?.week2?.join(', ')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-blue-100 text-blue-800">Månad 1</Badge>
                  <span className="text-sm text-gray-700">{preUploadGuidance.timeline?.month1?.join(', ')}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ROI Predictions */}
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

      {/* Team Fit Assessment */}
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

      {/* Market Positioning */}
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

      {/* Certification Recommendations */}
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

      {/* Current Market Rate Estimate */}
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

      {/* Professional Profile */}
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
