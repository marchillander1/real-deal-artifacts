
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Briefcase, 
  Star, 
  TrendingUp, 
  Award,
  Target,
  DollarSign,
  BookOpen,
  Lightbulb
} from 'lucide-react';

interface AnalysisResultsProps {
  analysisResults: {
    cvAnalysis: any;
    linkedinAnalysis: any;
    consultant: any;
    enhancedAnalysisResults?: any;
  };
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
            <TrendingUp className="h-5 w-5 animate-pulse" />
            Analyzing CV and LinkedIn Profile...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={analysisProgress} className="mb-4" />
          <p className="text-sm text-gray-600">
            Processing your profile for comprehensive insights...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!analysisResults) {
    return null;
  }

  const { cvAnalysis, linkedinAnalysis, enhancedAnalysisResults } = analysisResults;
  const analysis = cvAnalysis?.analysis || cvAnalysis;

  return (
    <div className="space-y-6">
      {/* Personal Information Card */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <span className="font-medium">{analysis?.personalInfo?.name || 'Not specified'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-500" />
            <span>{analysis?.personalInfo?.email || 'Not specified'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-500" />
            <span>{analysis?.personalInfo?.phone || 'Not specified'}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span>{analysis?.personalInfo?.location || 'Not specified'}</span>
          </div>
        </CardContent>
      </Card>

      {/* Professional Summary Card */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Professional Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Experience</label>
              <p className="text-lg font-semibold">{analysis?.professionalSummary?.yearsOfExperience || 'Not specified'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Current Role</label>
              <p className="text-lg font-semibold">{analysis?.professionalSummary?.currentRole || 'Not specified'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Seniority Level</label>
              <Badge variant="secondary">{analysis?.professionalSummary?.seniorityLevel || 'Not specified'}</Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Career Trajectory</label>
              <Badge variant="outline">{analysis?.professionalSummary?.careerTrajectory || 'Not specified'}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Positioning Card */}
      {analysis?.marketPositioning && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Market Positioning & Rate Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Minimum Rate</p>
                <p className="text-2xl font-bold text-blue-600">
                  {analysis.marketPositioning.hourlyRateEstimate?.min || 'N/A'} SEK/h
                </p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Recommended Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {analysis.marketPositioning.hourlyRateEstimate?.recommended || 'N/A'} SEK/h
                </p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">Maximum Rate</p>
                <p className="text-2xl font-bold text-purple-600">
                  {analysis.marketPositioning.hourlyRateEstimate?.max || 'N/A'} SEK/h
                </p>
              </div>
            </div>
            {analysis.marketPositioning.hourlyRateEstimate?.explanation && (
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                {analysis.marketPositioning.hourlyRateEstimate.explanation}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Technical Skills Card */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Technical Expertise
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {analysis?.technicalExpertise?.programmingLanguages?.expert?.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Expert Level</label>
              <div className="flex flex-wrap gap-2">
                {analysis.technicalExpertise.programmingLanguages.expert.map((skill: string, index: number) => (
                  <Badge key={index} variant="default" className="bg-green-100 text-green-800">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {analysis?.technicalExpertise?.programmingLanguages?.proficient?.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Proficient</label>
              <div className="flex flex-wrap gap-2">
                {analysis.technicalExpertise.programmingLanguages.proficient.map((skill: string, index: number) => (
                  <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {analysis?.technicalExpertise?.frameworks?.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Frameworks & Tools</label>
              <div className="flex flex-wrap gap-2">
                {analysis.technicalExpertise.frameworks.map((framework: string, index: number) => (
                  <Badge key={index} variant="outline">
                    {framework}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Analysis Results */}
      {enhancedAnalysisResults && (
        <>
          {/* Certification Recommendations */}
          {(enhancedAnalysisResults.certificationRecommendations?.technical?.length > 0 || 
            enhancedAnalysisResults.certificationRecommendations?.business?.length > 0) && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Recommended Certifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {enhancedAnalysisResults.certificationRecommendations.technical?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-lg mb-3 text-blue-700">Technical Certifications</h4>
                    <div className="space-y-3">
                      {enhancedAnalysisResults.certificationRecommendations.technical.map((cert: any, index: number) => (
                        <div key={index} className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-medium text-blue-900">{cert.certification}</h5>
                            <Badge variant={cert.priority === 'High' ? 'default' : 'secondary'} 
                                   className={cert.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                              {cert.priority} Priority
                            </Badge>
                          </div>
                          <p className="text-sm text-blue-800 mb-2">{cert.reason}</p>
                          <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
                            <div><strong>Time:</strong> {cert.timeToComplete}</div>
                            <div><strong>Market Value:</strong> {cert.marketValue}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {enhancedAnalysisResults.certificationRecommendations.business?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-lg mb-3 text-green-700">Business Certifications</h4>
                    <div className="space-y-3">
                      {enhancedAnalysisResults.certificationRecommendations.business.map((cert: any, index: number) => (
                        <div key={index} className="border border-green-200 rounded-lg p-4 bg-green-50">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-medium text-green-900">{cert.certification}</h5>
                            <Badge variant={cert.priority === 'High' ? 'default' : 'secondary'} 
                                   className={cert.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                              {cert.priority} Priority
                            </Badge>
                          </div>
                          <p className="text-sm text-green-800 mb-2">{cert.reason}</p>
                          <div className="grid grid-cols-2 gap-2 text-xs text-green-700">
                            <div><strong>Time:</strong> {cert.timeToComplete}</div>
                            <div><strong>Market Value:</strong> {cert.marketValue}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Technical Assessment */}
          {enhancedAnalysisResults.technicalAssessment && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Technical Assessment & Skills Gap Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-lg mb-3">Technical Maturity Levels</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600">Frontend</p>
                      <p className="text-xl font-bold text-blue-600">{enhancedAnalysisResults.technicalAssessment.technicalMaturity.frontendScore}/10</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600">Backend</p>
                      <p className="text-xl font-bold text-green-600">{enhancedAnalysisResults.technicalAssessment.technicalMaturity.backendScore}/10</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm text-gray-600">DevOps</p>
                      <p className="text-xl font-bold text-purple-600">{enhancedAnalysisResults.technicalAssessment.technicalMaturity.devopsScore}/10</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <p className="text-sm text-gray-600">Data</p>
                      <p className="text-xl font-bold text-orange-600">{enhancedAnalysisResults.technicalAssessment.technicalMaturity.dataScore}/10</p>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <Badge variant="default" className="text-lg px-4 py-2">
                      Overall Level: {enhancedAnalysisResults.technicalAssessment.technicalMaturity.overallLevel}
                    </Badge>
                  </div>
                </div>

                {enhancedAnalysisResults.technicalAssessment.improvementPriority?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-lg mb-3">Improvement Priorities</h4>
                    <div className="space-y-3">
                      {enhancedAnalysisResults.technicalAssessment.improvementPriority.map((item: any, index: number) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-medium">{item.category}</h5>
                            <Badge variant={item.priority === 'High' ? 'default' : 'secondary'}>
                              {item.priority} Priority
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{item.reason}</p>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {item.skills?.map((skill: string, skillIndex: number) => (
                              <Badge key={skillIndex} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500">Timeline: {item.timeline}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* ROI Predictions */}
          {enhancedAnalysisResults.roiPredictions && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Growth Potential & ROI Predictions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-lg mb-3">Current Market Value</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600">Current Hourly Rate</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {enhancedAnalysisResults.roiPredictions.currentMarketValue.hourlyRate} SEK/h
                      </p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600">Monthly Potential</p>
                      <p className="text-2xl font-bold text-green-600">
                        {enhancedAnalysisResults.roiPredictions.currentMarketValue.monthlyPotential?.toLocaleString()} SEK
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-3">Improvement Potential</h4>
                  <div className="space-y-3">
                    <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                      <h5 className="font-medium text-green-900 mb-2">6 Months Growth</h5>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Hourly Rate</p>
                          <p className="text-lg font-bold text-green-700">
                            {enhancedAnalysisResults.roiPredictions.improvementPotential.with6MonthsImprovement.hourlyRate} SEK/h
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Monthly Potential</p>
                          <p className="text-lg font-bold text-green-700">
                            {enhancedAnalysisResults.roiPredictions.improvementPotential.with6MonthsImprovement.monthlyPotential?.toLocaleString()} SEK
                          </p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-green-600">Focus areas:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {enhancedAnalysisResults.roiPredictions.improvementPotential.with6MonthsImprovement.improvements?.map((improvement: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs text-green-700">
                              {improvement}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                      <h5 className="font-medium text-blue-900 mb-2">1 Year Growth</h5>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Hourly Rate</p>
                          <p className="text-lg font-bold text-blue-700">
                            {enhancedAnalysisResults.roiPredictions.improvementPotential.with1YearImprovement.hourlyRate} SEK/h
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Monthly Potential</p>
                          <p className="text-lg font-bold text-blue-700">
                            {enhancedAnalysisResults.roiPredictions.improvementPotential.with1YearImprovement.monthlyPotential?.toLocaleString()} SEK
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pre-Upload Guidance */}
          {enhancedAnalysisResults.preUploadGuidance && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Profile Optimization Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {enhancedAnalysisResults.preUploadGuidance.cvOptimization?.immediate?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-lg mb-3 text-blue-700">CV Optimization</h4>
                    <div className="space-y-3">
                      {enhancedAnalysisResults.preUploadGuidance.cvOptimization.immediate.map((tip: any, index: number) => (
                        <div key={index} className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-medium text-blue-900">{tip.area}</h5>
                            <Badge variant={tip.impact === 'High' ? 'default' : 'secondary'} 
                                   className={tip.impact === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                              {tip.impact} Impact
                            </Badge>
                          </div>
                          <p className="text-sm text-blue-800 mb-2">{tip.action}</p>
                          {tip.template && (
                            <p className="text-xs text-blue-600 bg-blue-100 p-2 rounded italic">
                              Template: {tip.template}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {enhancedAnalysisResults.preUploadGuidance.linkedinOptimization?.profile?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-lg mb-3 text-green-700">LinkedIn Optimization</h4>
                    <div className="space-y-3">
                      {enhancedAnalysisResults.preUploadGuidance.linkedinOptimization.profile.map((tip: any, index: number) => (
                        <div key={index} className="border border-green-200 rounded-lg p-4 bg-green-50">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-medium text-green-900">{tip.area}</h5>
                            <Badge variant={tip.impact === 'High' ? 'default' : 'secondary'} 
                                   className={tip.impact === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                              {tip.impact} Impact
                            </Badge>
                          </div>
                          <p className="text-sm text-green-800 mb-2">{tip.action}</p>
                          {tip.template && (
                            <p className="text-xs text-green-600 bg-green-100 p-2 rounded italic">
                              Template: {tip.template}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* LinkedIn Analysis */}
      {linkedinAnalysis && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              LinkedIn Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Consultant Readiness</p>
                <p className="text-2xl font-bold text-blue-600">{linkedinAnalysis.overallConsultantReadiness || 'N/A'}/10</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Cultural Fit</p>
                <p className="text-2xl font-bold text-green-600">{linkedinAnalysis.culturalFit || 'N/A'}/5</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">Leadership Potential</p>
                <p className="text-2xl font-bold text-purple-600">{linkedinAnalysis.leadership || 'N/A'}/5</p>
              </div>
            </div>
            
            {linkedinAnalysis.recommendedImprovements?.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Recommended LinkedIn Improvements:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {linkedinAnalysis.recommendedImprovements.map((improvement: string, index: number) => (
                    <li key={index} className="text-sm text-gray-600">{improvement}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
