
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Users, Code, Brain, BarChart3, Loader2 } from 'lucide-react';

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

  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-green-600 flex items-center justify-center gap-2">
            <CheckCircle2 className="h-6 w-6" />
            Comprehensive Analysis Complete!
          </CardTitle>
          <CardDescription>
            Your CV and LinkedIn have been analyzed successfully. Complete the form to join our network.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Professional Summary */}
      {analysisResults.cvAnalysis?.professionalSummary && (
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
                <p className="font-semibold">{analysisResults.cvAnalysis.professionalSummary.seniorityLevel}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Experience:</span>
                <p className="font-semibold">{analysisResults.cvAnalysis.professionalSummary.yearsOfExperience}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Role:</span>
                <p className="font-semibold">{analysisResults.cvAnalysis.professionalSummary.currentRole}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Trajectory:</span>
                <p className="font-semibold text-green-600">{analysisResults.cvAnalysis.professionalSummary.careerTrajectory}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Technical Expertise */}
      {analysisResults.cvAnalysis?.technicalExpertise && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5 text-purple-500" />
              Technical Expertise
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analysisResults.cvAnalysis.technicalExpertise.programmingLanguages?.expert && (
              <div>
                <span className="text-sm font-medium text-gray-700">Expert Skills:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {analysisResults.cvAnalysis.technicalExpertise.programmingLanguages.expert.map((skill: string, idx: number) => (
                    <Badge key={idx} className="bg-green-100 text-green-800">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}
            {analysisResults.cvAnalysis.technicalExpertise.cloudAndInfrastructure?.platforms && (
              <div className="mt-3">
                <span className="text-sm font-medium text-gray-700">Cloud Platforms:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {analysisResults.cvAnalysis.technicalExpertise.cloudAndInfrastructure.platforms.map((platform: string, idx: number) => (
                    <Badge key={idx} className="bg-blue-100 text-blue-800">{platform}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Leadership Analysis */}
      {analysisResults.linkedinAnalysis && (
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
                <p className="font-semibold">{analysisResults.linkedinAnalysis.communicationStyle}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Leadership Approach:</span>
                <p className="font-semibold">{analysisResults.linkedinAnalysis.leadershipStyle}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="text-center">
                  <p className="text-xs text-gray-600">Cultural Fit</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: `${(analysisResults.linkedinAnalysis.culturalFit/5)*100}%`}}></div>
                  </div>
                  <p className="text-xs font-bold text-blue-600 mt-1">{analysisResults.linkedinAnalysis.culturalFit}/5</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600">Leadership</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-orange-600 h-2 rounded-full" style={{width: `${(analysisResults.linkedinAnalysis.leadership/5)*100}%`}}></div>
                  </div>
                  <p className="text-xs font-bold text-orange-600 mt-1">{analysisResults.linkedinAnalysis.leadership}/5</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600">Innovation</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: `${((analysisResults.linkedinAnalysis.innovation || 4)/5)*100}%`}}></div>
                  </div>
                  <p className="text-xs font-bold text-green-600 mt-1">{analysisResults.linkedinAnalysis.innovation || 4}/5</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Market Positioning */}
      {analysisResults.cvAnalysis?.marketPositioning && (
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
              <p className="text-sm font-medium">{analysisResults.cvAnalysis.marketPositioning.uniqueValueProposition}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Competitiveness:</span>
              <p className="text-sm font-semibold text-blue-600">{analysisResults.cvAnalysis.marketPositioning.competitiveness}</p>
            </div>
            {analysisResults.cvAnalysis.marketPositioning.salaryBenchmarks && (
              <div className="space-y-2">
                <span className="text-sm font-medium text-gray-700">Salary Range:</span>
                <div className="text-center p-2 bg-blue-50 rounded">
                  <p className="text-xs text-gray-600">Stockholm Market</p>
                  <p className="text-sm font-bold text-blue-600">{analysisResults.cvAnalysis.marketPositioning.salaryBenchmarks.stockholm}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
