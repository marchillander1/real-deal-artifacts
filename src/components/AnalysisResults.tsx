
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Code, Users, Brain, DollarSign, TrendingUp, Award, Target, Star, CheckCircle2, Loader2, Zap, Trophy, Lightbulb, BookOpen, Briefcase, Building, Rocket, TrendingDown, Clock, ArrowUp, AlertTriangle, CheckCircle, XCircle, Eye, MessageSquare, UserCheck, ThumbsUp, TrendingDown as Perception } from 'lucide-react';

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

      {/* Professional Perception Analysis - NEW */}
      <Card className="shadow-lg border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-purple-500" />
            Hur Du Uppfattas Professionellt
          </CardTitle>
          <CardDescription>
            Analys av ditt första intryck och professionella framtoning
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* First Impression */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Första Intryck
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <ThumbsUp className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800">Starka Sidor</span>
                </div>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Teknisk kompetens framgår tydligt</li>
                  <li>• Professionell LinkedIn-närvaro</li>
                  <li>• {cvAnalysis?.professionalSummary?.yearsOfExperience || '5+'} års solid erfarenhet</li>
                  <li>• Strukturerat CV med tydliga roller</li>
                </ul>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <span className="font-medium text-orange-800">Förbättringsområden</span>
                </div>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Mer kvantifierade resultat behövs</li>
                  <li>• Starkare personal branding på LinkedIn</li>
                  <li>• Tydligare konsultprofil saknas</li>
                  <li>• Mer synlighet i tekniska communities</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Market Perception */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Perception className="h-4 w-4" />
              Marknadspositioning
            </h4>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {technicalAssessment?.technicalMaturity?.overallLevel || 'Senior'}
                  </div>
                  <div className="text-sm text-gray-600">Teknisk Nivå</div>
                  <div className="text-xs text-gray-500 mt-1">Uppfattas som erfaren utvecklare</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {Math.floor((roiPredictions?.teamFitValue?.consultingReadiness || 7) * 10)}%
                  </div>
                  <div className="text-sm text-gray-600">Konsultmognad</div>
                  <div className="text-xs text-gray-500 mt-1">Redo för konsultuppdrag</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {roiPredictions?.currentMarketValue?.hourlyRate || 1000}
                  </div>
                  <div className="text-sm text-gray-600">SEK/timme</div>
                  <div className="text-xs text-gray-500 mt-1">Nuvarande marknadsvärde</div>
                </div>
              </div>
            </div>
          </div>

          {/* Communication Style Analysis */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Kommunikationsprofil
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="bg-white p-3 rounded border">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Professionell Ton</span>
                    <Badge className="bg-blue-100 text-blue-800">
                      {linkedinAnalysis?.communicationStyle?.includes('technical') ? 'Teknisk' : 'Professionell'}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600">
                    {linkedinAnalysis?.communicationStyle || 'Tekniskt fokuserad med god affärsförståelse'}
                  </p>
                </div>
                <div className="bg-white p-3 rounded border">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">LinkedIn Aktivitet</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Måttlig</Badge>
                  </div>
                  <p className="text-xs text-gray-600">
                    Begränsad aktivitet, behöver mer synlighet och thought leadership
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded border">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Klientkommunikation</span>
                    <Badge className="bg-green-100 text-green-800">
                      {Math.floor((linkedinAnalysis?.leadership || 7) * 10)}%
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600">
                    {linkedinAnalysis?.teamFitAssessment?.communicationPreference || 'Tydlig och strukturerad kommunikation'}
                  </p>
                </div>
                <div className="bg-white p-3 rounded border">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Teamledarskap</span>
                    <Badge className="bg-purple-100 text-purple-800">
                      {linkedinAnalysis?.leadership || 7}/10
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600">
                    Teknisk ledare med potential för större ansvar
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Competitive Analysis */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Konkurrensanalys
            </h4>
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Vs. Andra {cvAnalysis?.professionalSummary?.currentRole || 'Utvecklare'}</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Teknisk kompetens:</span>
                      <span className="font-medium text-green-600">Över genomsnitt</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">LinkedIn synlighet:</span>
                      <span className="font-medium text-orange-600">Under genomsnitt</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Certifieringar:</span>
                      <span className="font-medium text-yellow-600">Genomsnitt</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Konsultmognad:</span>
                      <span className="font-medium text-blue-600">God potential</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Unika Styrkor</h5>
                  <div className="space-y-1">
                    {(linkedinAnalysis?.marketPositioning?.competitiveAdvantages || 
                      ['Bred teknisk kompetens', 'Strukturerad approach', 'Kvalitetsfokus', 'Problemlösning']).slice(0, 4).map((strength: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span className="text-sm text-gray-700">{strength}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Brand Analysis */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Building className="h-4 w-4" />
              Personal Brand-analys
            </h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded border text-center">
                <div className="text-lg font-bold text-blue-600 mb-1">Teknisk Expert</div>
                <div className="text-sm text-gray-600 mb-2">Nuvarande Uppfattning</div>
                <div className="text-xs text-gray-500">
                  Ses som kompetent utvecklare med solid teknisk grund
                </div>
              </div>
              <div className="bg-white p-4 rounded border text-center">
                <div className="text-lg font-bold text-green-600 mb-1">Problemlösare</div>
                <div className="text-sm text-gray-600 mb-2">Emerging Brand</div>
                <div className="text-xs text-gray-500">
                  Potential att bygga rykte som strategisk problemlösare
                </div>
              </div>
              <div className="bg-white p-4 rounded border text-center">
                <div className="text-lg font-bold text-purple-600 mb-1">Thought Leader</div>
                <div className="text-sm text-gray-600 mb-2">Tillväxtområde</div>
                <div className="text-xs text-gray-500">
                  Stor potential för branschledarskap och synlighet
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Skills Assessment */}
      {technicalAssessment && (
        <Card className="shadow-lg border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5 text-blue-500" />
              Technical Skills Assessment
            </CardTitle>
            <CardDescription>
              In-depth evaluation of technical skills and market potential
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Technical Maturity Scores */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Technical Maturity Level</h4>
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
                  Overall Level: {technicalAssessment.technicalMaturity.overallLevel}
                </Badge>
              </div>
            </div>

            {/* Skills Gap Analysis */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Skills Analysis</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-green-700">Strong Areas</span>
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
                    <span className="text-sm font-medium text-red-700">Missing Skills</span>
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
                <h4 className="font-semibold text-gray-800 mb-3">Improvement Recommendations</h4>
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
                        <span>Skills: {item.skills?.join(', ')}</span>
                        <span>Timeline: {item.timeline}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pre-Upload Optimization Guide */}
      {preUploadGuidance && (
        <Card className="shadow-lg border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-purple-500" />
              Optimization Guide: Improve Before Upload
            </CardTitle>
            <CardDescription>
              Actionable tips to maximize your chances of getting hired
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* CV Optimization */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                CV Optimization
              </h4>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-700 mb-2 block">Immediate Improvements:</span>
                  {preUploadGuidance.cvOptimization.immediate?.map((tip: any, idx: number) => (
                    <div key={idx} className="border-l-4 border-blue-500 pl-4 mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-blue-800">{tip.area}</span>
                        <Badge className="bg-blue-100 text-blue-800 text-xs">{tip.impact}</Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{tip.action}</p>
                      <p className="text-xs text-gray-500 italic">Template: {tip.template}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* LinkedIn Optimization */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Building className="h-4 w-4" />
                LinkedIn Optimization
              </h4>
              <div className="space-y-3">
                {preUploadGuidance.linkedinOptimization.profile?.map((tip: any, idx: number) => (
                  <div key={idx} className="border-l-4 border-green-500 pl-4 mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-green-800">{tip.area}</span>
                      <Badge className="bg-green-100 text-green-800 text-xs">{tip.impact}</Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{tip.action}</p>
                    <p className="text-xs text-gray-500 italic">Template: {tip.template}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Optimization Timeline
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Badge className="bg-red-100 text-red-800">Week 1</Badge>
                  <span className="text-sm text-gray-700">{preUploadGuidance.timeline?.week1?.join(', ')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-orange-100 text-orange-800">Week 2</Badge>
                  <span className="text-sm text-gray-700">{preUploadGuidance.timeline?.week2?.join(', ')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-blue-100 text-blue-800">Month 1</Badge>
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
