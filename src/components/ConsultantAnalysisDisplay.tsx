
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Brain, FileText, Linkedin, Star, MapPin, Clock, User, Briefcase, Award, Target, TrendingUp, DollarSign, Lightbulb } from 'lucide-react';
import { Consultant } from '@/types/consultant';

interface ConsultantAnalysisDisplayProps {
  consultant: Consultant;
}

export const ConsultantAnalysisDisplay: React.FC<ConsultantAnalysisDisplayProps> = ({ consultant }) => {
  const cvAnalysis = consultant.cvAnalysis?.analysis || consultant.cv_analysis_data?.analysis;
  const linkedinAnalysis = consultant.linkedinAnalysis?.analysis || consultant.linkedin_analysis_data?.analysis;
  const enhancedAnalysisResults = consultant.cvAnalysis?.enhancedAnalysisResults || consultant.cv_analysis_data?.enhancedAnalysisResults;

  console.log('🔍 ConsultantAnalysisDisplay - Analysis data check:', {
    consultantName: consultant.name,
    hasCvAnalysis: !!cvAnalysis,
    hasLinkedinAnalysis: !!linkedinAnalysis,
    hasEnhancedAnalysis: !!enhancedAnalysisResults,
    cvAnalysisKeys: cvAnalysis ? Object.keys(cvAnalysis) : [],
    linkedinAnalysisKeys: linkedinAnalysis ? Object.keys(linkedinAnalysis) : [],
    enhancedAnalysisKeys: enhancedAnalysisResults ? Object.keys(enhancedAnalysisResults) : []
  });

  // If no analysis data, don't show anything
  if (!cvAnalysis && !linkedinAnalysis) {
    return (
      <Card className="mt-4 border-gray-200 bg-gray-50">
        <CardContent className="p-4 text-center">
          <Brain className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">No analysis data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-4 border-purple-200 bg-purple-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-purple-900">
          <Brain className="h-5 w-5" />
          AI Analysis Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* CV Analysis Section */}
        {cvAnalysis && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-blue-600" />
              <h4 className="font-semibold text-blue-900">CV Analysis</h4>
            </div>
            
            {/* Personal Info from CV */}
            {cvAnalysis.personalInfo && (
              <div className="bg-white rounded-lg p-3 mb-3">
                <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Personal Information
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  {cvAnalysis.personalInfo.name && (
                    <div>
                      <span className="font-medium text-gray-700">Name:</span> 
                      <span className="ml-1">{cvAnalysis.personalInfo.name}</span>
                    </div>
                  )}
                  {cvAnalysis.personalInfo.email && (
                    <div>
                      <span className="font-medium text-gray-700">Email:</span> 
                      <span className="ml-1">{cvAnalysis.personalInfo.email}</span>
                    </div>
                  )}
                  {cvAnalysis.personalInfo.phone && (
                    <div>
                      <span className="font-medium text-gray-700">Phone:</span> 
                      <span className="ml-1">{cvAnalysis.personalInfo.phone}</span>
                    </div>
                  )}
                  {cvAnalysis.personalInfo.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-gray-500" />
                      <span>{cvAnalysis.personalInfo.location}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Professional Summary */}
            {cvAnalysis.professionalSummary && (
              <div className="bg-white rounded-lg p-3 mb-3">
                <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Professional Summary
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  {cvAnalysis.professionalSummary.yearsOfExperience && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-gray-500" />
                      <span className="font-medium text-gray-700">Experience:</span>
                      <span className="ml-1">{cvAnalysis.professionalSummary.yearsOfExperience}</span>
                    </div>
                  )}
                  {cvAnalysis.professionalSummary.currentRole && (
                    <div>
                      <span className="font-medium text-gray-700">Current Role:</span> 
                      <span className="ml-1">{cvAnalysis.professionalSummary.currentRole}</span>
                    </div>
                  )}
                  {cvAnalysis.professionalSummary.seniorityLevel && (
                    <div>
                      <span className="font-medium text-gray-700">Seniority:</span> 
                      <span className="ml-1">{cvAnalysis.professionalSummary.seniorityLevel}</span>
                    </div>
                  )}
                  {cvAnalysis.professionalSummary.careerTrajectory && (
                    <div>
                      <span className="font-medium text-gray-700">Career:</span> 
                      <span className="ml-1">{cvAnalysis.professionalSummary.careerTrajectory}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Technical Skills */}
            {cvAnalysis.technicalExpertise?.programmingLanguages && (
              <div className="bg-white rounded-lg p-3 mb-3">
                <h5 className="font-medium text-gray-900 mb-2">Technical Skills from CV</h5>
                <div className="space-y-3">
                  {cvAnalysis.technicalExpertise.programmingLanguages.expert?.length > 0 && (
                    <div>
                      <span className="text-xs font-medium text-green-700 block mb-1">Expert Level:</span>
                      <div className="flex flex-wrap gap-1">
                        {cvAnalysis.technicalExpertise.programmingLanguages.expert.map((skill: string, index: number) => (
                          <Badge key={index} variant="secondary" className="bg-green-100 text-green-800 text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {cvAnalysis.technicalExpertise.programmingLanguages.proficient?.length > 0 && (
                    <div>
                      <span className="text-xs font-medium text-blue-700 block mb-1">Proficient:</span>
                      <div className="flex flex-wrap gap-1">
                        {cvAnalysis.technicalExpertise.programmingLanguages.proficient.map((skill: string, index: number) => (
                          <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {cvAnalysis.technicalExpertise.programmingLanguages.familiar?.length > 0 && (
                    <div>
                      <span className="text-xs font-medium text-gray-700 block mb-1">Familiar:</span>
                      <div className="flex flex-wrap gap-1">
                        {cvAnalysis.technicalExpertise.programmingLanguages.familiar.map((skill: string, index: number) => (
                          <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-800 text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Frameworks and Tools */}
                {(cvAnalysis.technicalExpertise.frameworks?.length > 0 || 
                  cvAnalysis.technicalExpertise.tools?.length > 0 ||
                  cvAnalysis.technicalExpertise.databases?.length > 0) && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    {cvAnalysis.technicalExpertise.frameworks?.length > 0 && (
                      <div className="mb-2">
                        <span className="text-xs font-medium text-purple-700 block mb-1">Frameworks:</span>
                        <div className="flex flex-wrap gap-1">
                          {cvAnalysis.technicalExpertise.frameworks.map((framework: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-purple-700 border-purple-200 text-xs">
                              {framework}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {cvAnalysis.technicalExpertise.tools?.length > 0 && (
                      <div className="mb-2">
                        <span className="text-xs font-medium text-orange-700 block mb-1">Tools:</span>
                        <div className="flex flex-wrap gap-1">
                          {cvAnalysis.technicalExpertise.tools.map((tool: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-orange-700 border-orange-200 text-xs">
                              {tool}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {cvAnalysis.technicalExpertise.databases?.length > 0 && (
                      <div>
                        <span className="text-xs font-medium text-teal-700 block mb-1">Databases:</span>
                        <div className="flex flex-wrap gap-1">
                          {cvAnalysis.technicalExpertise.databases.map((db: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-teal-700 border-teal-200 text-xs">
                              {db}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Market Positioning */}
            {cvAnalysis.marketPositioning && (
              <div className="bg-white rounded-lg p-3 mb-3">
                <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Market Positioning
                </h5>
                <div className="text-sm space-y-2">
                  {cvAnalysis.marketPositioning.hourlyRateEstimate && (
                    <div className="flex items-center gap-2">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span className="font-medium">Recommended Rate:</span>
                      <span className="text-green-600 font-semibold">
                        {cvAnalysis.marketPositioning.hourlyRateEstimate.recommended} {cvAnalysis.marketPositioning.hourlyRateEstimate.currency}/hour
                      </span>
                    </div>
                  )}
                  {cvAnalysis.marketPositioning.marketDemand && (
                    <div>
                      <span className="font-medium">Market Demand:</span> 
                      <span className="ml-1">{cvAnalysis.marketPositioning.marketDemand}</span>
                    </div>
                  )}
                  {cvAnalysis.marketPositioning.competitiveAdvantages?.length > 0 && (
                    <div>
                      <span className="font-medium">Competitive Advantages:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {cvAnalysis.marketPositioning.competitiveAdvantages.map((advantage: string, index: number) => (
                          <Badge key={index} variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                            {advantage}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Enhanced Analysis Results - Certification Recommendations */}
        {enhancedAnalysisResults?.certificationRecommendations && (
          <>
            <Separator className="my-4" />
            
            {(enhancedAnalysisResults.certificationRecommendations.technical?.length > 0 || 
              enhancedAnalysisResults.certificationRecommendations.business?.length > 0) && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Award className="h-4 w-4 text-purple-600" />
                  <h4 className="font-semibold text-purple-900">Recommended Certifications</h4>
                </div>
                
                {enhancedAnalysisResults.certificationRecommendations.technical?.length > 0 && (
                  <div className="bg-white rounded-lg p-3 mb-3">
                    <h5 className="font-medium text-blue-700 mb-2">Technical Certifications</h5>
                    <div className="space-y-2">
                      {enhancedAnalysisResults.certificationRecommendations.technical.map((cert: any, index: number) => (
                        <div key={index} className="border border-blue-200 rounded p-2 bg-blue-50">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium text-blue-900 text-sm">{cert.certification}</span>
                            <Badge variant={cert.priority === 'High' ? 'default' : 'secondary'} className="text-xs">
                              {cert.priority}
                            </Badge>
                          </div>
                          <p className="text-xs text-blue-800 mb-1">{cert.reason}</p>
                          <div className="text-xs text-blue-600">
                            <span className="font-medium">Time:</span> {cert.timeToComplete} | 
                            <span className="font-medium"> Value:</span> {cert.marketValue}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {enhancedAnalysisResults.certificationRecommendations.business?.length > 0 && (
                  <div className="bg-white rounded-lg p-3 mb-3">
                    <h5 className="font-medium text-green-700 mb-2">Business Certifications</h5>
                    <div className="space-y-2">
                      {enhancedAnalysisResults.certificationRecommendations.business.map((cert: any, index: number) => (
                        <div key={index} className="border border-green-200 rounded p-2 bg-green-50">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium text-green-900 text-sm">{cert.certification}</span>
                            <Badge variant={cert.priority === 'High' ? 'default' : 'secondary'} className="text-xs">
                              {cert.priority}
                            </Badge>
                          </div>
                          <p className="text-xs text-green-800 mb-1">{cert.reason}</p>
                          <div className="text-xs text-green-600">
                            <span className="font-medium">Time:</span> {cert.timeToComplete} | 
                            <span className="font-medium"> Value:</span> {cert.marketValue}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Technical Assessment */}
        {enhancedAnalysisResults?.technicalAssessment && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-orange-600" />
              <h4 className="font-semibold text-orange-900">Technical Assessment</h4>
            </div>
            
            <div className="bg-white rounded-lg p-3 mb-3">
              <h5 className="font-medium text-gray-900 mb-2">Technical Maturity Levels</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="text-lg font-bold text-blue-600">{enhancedAnalysisResults.technicalAssessment.technicalMaturity.frontendScore}/10</div>
                  <div className="text-xs text-gray-600">Frontend</div>
                </div>
                <div className="text-center p-2 bg-green-50 rounded">
                  <div className="text-lg font-bold text-green-600">{enhancedAnalysisResults.technicalAssessment.technicalMaturity.backendScore}/10</div>
                  <div className="text-xs text-gray-600">Backend</div>
                </div>
                <div className="text-center p-2 bg-purple-50 rounded">
                  <div className="text-lg font-bold text-purple-600">{enhancedAnalysisResults.technicalAssessment.technicalMaturity.devopsScore}/10</div>
                  <div className="text-xs text-gray-600">DevOps</div>
                </div>
                <div className="text-center p-2 bg-orange-50 rounded">
                  <div className="text-lg font-bold text-orange-600">{enhancedAnalysisResults.technicalAssessment.technicalMaturity.dataScore}/10</div>
                  <div className="text-xs text-gray-600">Data</div>
                </div>
              </div>
              <div className="mt-2 text-center">
                <Badge variant="default" className="text-sm">
                  Overall Level: {enhancedAnalysisResults.technicalAssessment.technicalMaturity.overallLevel}
                </Badge>
              </div>
            </div>

            {enhancedAnalysisResults.technicalAssessment.improvementPriority?.length > 0 && (
              <div className="bg-white rounded-lg p-3">
                <h5 className="font-medium text-gray-900 mb-2">Improvement Priorities</h5>
                <div className="space-y-2">
                  {enhancedAnalysisResults.technicalAssessment.improvementPriority.slice(0, 3).map((item: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded p-2">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-sm">{item.category}</span>
                        <Badge variant={item.priority === 'High' ? 'default' : 'secondary'} className="text-xs">
                          {item.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{item.reason}</p>
                      <p className="text-xs text-gray-500">Timeline: {item.timeline}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ROI Predictions */}
        {enhancedAnalysisResults?.roiPredictions && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <h4 className="font-semibold text-green-900">Growth Potential & ROI</h4>
            </div>
            
            <div className="bg-white rounded-lg p-3 mb-3">
              <h5 className="font-medium text-gray-900 mb-2">Current Market Value</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="text-lg font-bold text-blue-600">
                    {enhancedAnalysisResults.roiPredictions.currentMarketValue.hourlyRate} SEK/h
                  </div>
                  <div className="text-xs text-gray-600">Current Rate</div>
                </div>
                <div className="text-center p-2 bg-green-50 rounded">
                  <div className="text-lg font-bold text-green-600">
                    {enhancedAnalysisResults.roiPredictions.currentMarketValue.monthlyPotential?.toLocaleString()} SEK
                  </div>
                  <div className="text-xs text-gray-600">Monthly Potential</div>
                </div>
              </div>
            </div>

            {enhancedAnalysisResults.roiPredictions.improvementPotential && (
              <div className="bg-white rounded-lg p-3">
                <h5 className="font-medium text-gray-900 mb-2">Growth Potential</h5>
                <div className="space-y-2">
                  <div className="border border-green-200 rounded p-2 bg-green-50">
                    <div className="text-sm font-medium text-green-900">6 Months: {enhancedAnalysisResults.roiPredictions.improvementPotential.with6MonthsImprovement.hourlyRate} SEK/h</div>
                    <div className="text-xs text-green-700">Monthly: {enhancedAnalysisResults.roiPredictions.improvementPotential.with6MonthsImprovement.monthlyPotential?.toLocaleString()} SEK</div>
                  </div>
                  <div className="border border-blue-200 rounded p-2 bg-blue-50">
                    <div className="text-sm font-medium text-blue-900">1 Year: {enhancedAnalysisResults.roiPredictions.improvementPotential.with1YearImprovement.hourlyRate} SEK/h</div>
                    <div className="text-xs text-blue-700">Monthly: {enhancedAnalysisResults.roiPredictions.improvementPotential.with1YearImprovement.monthlyPotential?.toLocaleString()} SEK</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Profile Optimization Tips */}
        {enhancedAnalysisResults?.preUploadGuidance && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-4 w-4 text-yellow-600" />
              <h4 className="font-semibold text-yellow-900">Profile Optimization Tips</h4>
            </div>
            
            {enhancedAnalysisResults.preUploadGuidance.cvOptimization?.immediate?.length > 0 && (
              <div className="bg-white rounded-lg p-3 mb-3">
                <h5 className="font-medium text-blue-700 mb-2">CV Optimization</h5>
                <div className="space-y-2">
                  {enhancedAnalysisResults.preUploadGuidance.cvOptimization.immediate.slice(0, 3).map((tip: any, index: number) => (
                    <div key={index} className="border border-blue-200 rounded p-2 bg-blue-50">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-blue-900 text-sm">{tip.area}</span>
                        <Badge variant={tip.impact === 'High' ? 'default' : 'secondary'} className="text-xs">
                          {tip.impact}
                        </Badge>
                      </div>
                      <p className="text-xs text-blue-800">{tip.action}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {enhancedAnalysisResults.preUploadGuidance.linkedinOptimization?.profile?.length > 0 && (
              <div className="bg-white rounded-lg p-3">
                <h5 className="font-medium text-green-700 mb-2">LinkedIn Optimization</h5>
                <div className="space-y-2">
                  {enhancedAnalysisResults.preUploadGuidance.linkedinOptimization.profile.slice(0, 3).map((tip: any, index: number) => (
                    <div key={index} className="border border-green-200 rounded p-2 bg-green-50">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-green-900 text-sm">{tip.area}</span>
                        <Badge variant={tip.impact === 'High' ? 'default' : 'secondary'} className="text-xs">
                          {tip.impact}
                        </Badge>
                      </div>
                      <p className="text-xs text-green-800">{tip.action}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* LinkedIn Analysis Section */}
        {linkedinAnalysis && (
          <>
            <Separator className="my-4" />
            
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Linkedin className="h-4 w-4 text-blue-600" />
                <h4 className="font-semibold text-blue-900">LinkedIn Analysis</h4>
              </div>
              
              {/* Communication and Leadership */}
              <div className="bg-white rounded-lg p-3 mb-3">
                <h5 className="font-medium text-gray-900 mb-2">Professional Profile</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {linkedinAnalysis.communicationStyle && (
                    <div>
                      <span className="font-medium text-gray-700">Communication Style:</span>
                      <p className="text-gray-600 mt-1">{linkedinAnalysis.communicationStyle}</p>
                    </div>
                  )}
                  {linkedinAnalysis.leadershipStyle && (
                    <div>
                      <span className="font-medium text-gray-700">Leadership Style:</span>
                      <p className="text-gray-600 mt-1">{linkedinAnalysis.leadershipStyle}</p>
                    </div>
                  )}
                </div>
                
                {/* Scores */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 pt-3 border-t border-gray-200">
                  {linkedinAnalysis.innovation && (
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{linkedinAnalysis.innovation}/5</div>
                      <div className="text-xs text-gray-600">Innovation</div>
                    </div>
                  )}
                  {linkedinAnalysis.leadership && (
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{linkedinAnalysis.leadership}/5</div>
                      <div className="text-xs text-gray-600">Leadership</div>
                    </div>
                  )}
                  {linkedinAnalysis.adaptability && (
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">{linkedinAnalysis.adaptability}/5</div>
                      <div className="text-xs text-gray-600">Adaptability</div>
                    </div>
                  )}
                  {linkedinAnalysis.culturalFit && (
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-600">{linkedinAnalysis.culturalFit}/5</div>
                      <div className="text-xs text-gray-600">Cultural Fit</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Market Positioning */}
              {linkedinAnalysis.marketPositioning && (
                <div className="bg-white rounded-lg p-3 mb-3">
                  <h5 className="font-medium text-gray-900 mb-2">Market Positioning</h5>
                  <div className="text-sm space-y-2">
                    {linkedinAnalysis.marketPositioning.uniqueValueProposition && (
                      <div>
                        <span className="font-medium text-gray-700">Value Proposition:</span>
                        <p className="text-gray-600 mt-1">{linkedinAnalysis.marketPositioning.uniqueValueProposition}</p>
                      </div>
                    )}
                    {linkedinAnalysis.marketPositioning.competitiveAdvantages?.length > 0 && (
                      <div>
                        <span className="font-medium text-gray-700">Competitive Advantages:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {linkedinAnalysis.marketPositioning.competitiveAdvantages.map((advantage: string, index: number) => (
                            <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                              {advantage}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Content Analysis */}
              {linkedinAnalysis.recentPostsAnalysis && (
                <div className="bg-white rounded-lg p-3">
                  <h5 className="font-medium text-gray-900 mb-2">Content & Engagement Analysis</h5>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                    {linkedinAnalysis.recentPostsAnalysis.contentQuality && (
                      <div>
                        <span className="font-medium text-gray-700">Content Quality:</span>
                        <span className="ml-1">{linkedinAnalysis.recentPostsAnalysis.contentQuality}</span>
                      </div>
                    )}
                    {linkedinAnalysis.recentPostsAnalysis.engagementLevel && (
                      <div>
                        <span className="font-medium text-gray-700">Engagement:</span>
                        <span className="ml-1">{linkedinAnalysis.recentPostsAnalysis.engagementLevel}</span>
                      </div>
                    )}
                    {linkedinAnalysis.recentPostsAnalysis.thoughtLeadership && (
                      <div>
                        <span className="font-medium text-gray-700">Thought Leadership:</span>
                        <span className="ml-1">{linkedinAnalysis.recentPostsAnalysis.thoughtLeadership}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
