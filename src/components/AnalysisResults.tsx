
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  CheckCircle, 
  TrendingUp,
  Award,
  Globe,
  MessageSquare,
  Heart,
  Target,
  Users,
  Brain,
  Lightbulb,
  ArrowUp,
  DollarSign
} from 'lucide-react';

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
            <Brain className="h-5 w-5 animate-pulse text-blue-600" />
            AI Analysis in Progress
          </CardTitle>
          <CardDescription>
            Analyzing CV and LinkedIn profile together...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={analysisProgress} className="w-full" />
          <p className="text-sm text-gray-600 mt-2">
            {analysisProgress < 30 && "Processing CV content..."}
            {analysisProgress >= 30 && analysisProgress < 60 && "Extracting personal information..."}
            {analysisProgress >= 60 && analysisProgress < 80 && "Analyzing LinkedIn profile..."}
            {analysisProgress >= 80 && "Creating consultant profile..."}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!analysisResults?.cvAnalysis?.analysis) {
    return null;
  }

  const cvData = analysisResults.cvAnalysis.analysis;
  const linkedinData = analysisResults.linkedinAnalysis;
  const enhancedData = analysisResults.enhancedAnalysisResults;
  const consultant = analysisResults.consultant;

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Personal Information
          </CardTitle>
          <CardDescription>
            Information extracted from your CV
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Name</p>
                <p className="text-sm text-gray-600">{cvData.personalInfo?.name || 'Not detected'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-gray-600">{cvData.personalInfo?.email || 'Not detected'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm text-gray-600">{cvData.personalInfo?.phone || 'Not detected'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-gray-600">{cvData.personalInfo?.location || 'Not detected'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Summary */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-green-600" />
            Professional Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium">Experience</p>
              <p className="text-lg font-semibold text-green-600">
                {cvData.professionalSummary?.yearsOfExperience || 'Not specified'} years
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Current Role</p>
              <p className="text-sm text-gray-600">{cvData.professionalSummary?.currentRole || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Seniority Level</p>
              <Badge variant="outline">{cvData.professionalSummary?.seniorityLevel || 'Not specified'}</Badge>
            </div>
          </div>
          
          {cvData.professionalSummary?.specializations?.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Specializations</p>
              <div className="flex flex-wrap gap-2">
                {cvData.professionalSummary.specializations.map((spec: string, index: number) => (
                  <Badge key={index} variant="secondary">{spec}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Technical Expertise */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-purple-600" />
            Technical Expertise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cvData.technicalExpertise?.programmingLanguages && (
              <div>
                <p className="text-sm font-medium mb-2">Programming Languages</p>
                <div className="space-y-2">
                  {cvData.technicalExpertise.programmingLanguages.expert?.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Expert Level</p>
                      <div className="flex flex-wrap gap-1">
                        {cvData.technicalExpertise.programmingLanguages.expert.map((lang: string, index: number) => (
                          <Badge key={index} className="bg-green-100 text-green-800">{lang}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {cvData.technicalExpertise.programmingLanguages.proficient?.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Proficient</p>
                      <div className="flex flex-wrap gap-1">
                        {cvData.technicalExpertise.programmingLanguages.proficient.map((lang: string, index: number) => (
                          <Badge key={index} className="bg-blue-100 text-blue-800">{lang}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {cvData.technicalExpertise.programmingLanguages.familiar?.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Familiar</p>
                      <div className="flex flex-wrap gap-1">
                        {cvData.technicalExpertise.programmingLanguages.familiar.map((lang: string, index: number) => (
                          <Badge key={index} className="bg-gray-100 text-gray-800">{lang}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {cvData.technicalExpertise?.frameworks?.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Frameworks & Tools</p>
                <div className="flex flex-wrap gap-2">
                  {cvData.technicalExpertise.frameworks.map((framework: string, index: number) => (
                    <Badge key={index} variant="outline">{framework}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Market Positioning */}
      {cvData.marketPositioning?.hourlyRateEstimate && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-yellow-600" />
              Market Positioning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium">Recommended Rate</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {cvData.marketPositioning.hourlyRateEstimate.recommended} {cvData.marketPositioning.hourlyRateEstimate.currency}/h
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Rate Range</p>
                <p className="text-sm text-gray-600">
                  {cvData.marketPositioning.hourlyRateEstimate.min} - {cvData.marketPositioning.hourlyRateEstimate.max} {cvData.marketPositioning.hourlyRateEstimate.currency}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Explanation</p>
                <p className="text-xs text-gray-500">{cvData.marketPositioning.hourlyRateEstimate.explanation}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* LinkedIn Analysis */}
      {linkedinData && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              LinkedIn Profile Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Communication Style</p>
                  <p className="text-sm text-gray-600">{linkedinData.communicationStyle || 'Not analyzed'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Leadership Style</p>
                  <p className="text-sm text-gray-600">{linkedinData.leadershipStyle || 'Not analyzed'}</p>
                </div>
              </div>

              {linkedinData.overallConsultantReadiness && (
                <div>
                  <p className="text-sm font-medium mb-2">Consultant Readiness Score</p>
                  <div className="flex items-center gap-2">
                    <Progress value={linkedinData.overallConsultantReadiness * 10} className="flex-1" />
                    <span className="text-sm font-semibold">{linkedinData.overallConsultantReadiness}/10</span>
                  </div>
                </div>
              )}

              {linkedinData.recommendedImprovements?.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">💡 LinkedIn Improvement Recommendations</p>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <ul className="space-y-1">
                      {linkedinData.recommendedImprovements.map((improvement: string, index: number) => (
                        <li key={index} className="text-sm text-blue-800 flex items-start gap-2">
                          <ArrowUp className="h-3 w-3 mt-1 text-blue-600" />
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Certifications & Education */}
      {(cvData.education?.degrees?.length > 0 || cvData.education?.certifications?.length > 0) && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-orange-600" />
              Education & Certifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cvData.education.degrees?.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Education</p>
                  <div className="space-y-1">
                    {cvData.education.degrees.map((degree: string, index: number) => (
                      <p key={index} className="text-sm text-gray-600">{degree}</p>
                    ))}
                  </div>
                </div>
              )}
              
              {cvData.education.certifications?.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Certifications</p>
                  <div className="flex flex-wrap gap-2">
                    {cvData.education.certifications.map((cert: string, index: number) => (
                      <Badge key={index} variant="outline" className="bg-orange-50 text-orange-800">
                        <Award className="h-3 w-3 mr-1" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Work Experience */}
      {cvData.workExperience?.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-green-600" />
              Work Experience
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cvData.workExperience.map((experience: any, index: number) => (
                <div key={index} className="border-l-4 border-green-200 pl-4">
                  <h4 className="font-semibold text-green-800">{experience.role}</h4>
                  <p className="text-sm text-gray-600">{experience.company}</p>
                  <p className="text-xs text-gray-500">{experience.duration}</p>
                  {experience.technologies?.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-medium mb-1">Technologies:</p>
                      <div className="flex flex-wrap gap-1">
                        {experience.technologies.map((tech: string, techIndex: number) => (
                          <Badge key={techIndex} variant="secondary" className="text-xs">{tech}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Detection Results */}
      {enhancedData?.extractionStats && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Analysis Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{enhancedData.extractionStats.emailsFound}</p>
                <p className="text-xs text-gray-600">Emails Detected</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{enhancedData.extractionStats.skillsFound}</p>
                <p className="text-xs text-gray-600">Skills Found</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">{enhancedData.extractionStats.companiesFound}</p>
                <p className="text-xs text-gray-600">Companies</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">{enhancedData.extractionStats.phonesFound}</p>
                <p className="text-xs text-gray-600">Phone Numbers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Message */}
      <Card className="shadow-lg border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-green-800">
            <CheckCircle className="h-5 w-5" />
            <p className="font-semibold">Analysis Complete!</p>
          </div>
          <p className="text-sm text-green-700 mt-1">
            Your CV and LinkedIn profile have been analyzed. Information has been extracted and is ready for registration.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
