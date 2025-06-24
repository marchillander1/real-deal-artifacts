
import React from 'react';
import { User, Briefcase, Star, TrendingUp, Target, Award, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface AnalysisResultsProps {
  analysisResult: {
    sessionId: string;
    profileId: string;
    analysisData: any;
  };
  onContinue: () => void;
  onRestart: () => void;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  analysisResult,
  onContinue,
  onRestart
}) => {
  const analysisData = analysisResult.analysisData;
  
  console.log('Analysis data in AnalysisResults:', analysisData);
  
  return (
    <div className="max-w-6xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-300" />
          </div>
          <CardTitle className="text-3xl font-bold mb-4">
            Your AI Career Analysis is Complete!
          </CardTitle>
          <p className="text-lg opacity-90">
            Here are your personalized insights and recommendations
          </p>
        </CardHeader>

        <CardContent className="p-8">
          {/* Personal Overview */}
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  {analysisData?.personalInfo?.name || 'Your Profile'}
                </h2>
                <p className="text-lg text-blue-600 font-semibold mb-3">
                  {analysisData?.experience?.currentRole || 'Professional Consultant'}
                </p>
                <p className="text-slate-700">
                  {analysisData?.experience?.years || 5}+ years experience • {analysisData?.experience?.level || 'Senior'} level
                </p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Strength Analysis */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center text-green-800">
                  <Star className="h-5 w-5 mr-2" />
                  Your Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(analysisData?.analysisInsights?.strengths || ['Professional experience', 'Strong analytical skills', 'Proven track record']).map((strength: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-green-800">{strength}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Development Areas */}
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-800">
                  <Target className="h-5 w-5 mr-2" />
                  Development Areas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(analysisData?.analysisInsights?.developmentAreas || ['Market positioning', 'Personal branding', 'Network expansion']).map((area: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-orange-800">{area}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Skills Analysis */}
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-800">
                <Briefcase className="h-5 w-5 mr-2" />
                Technical Competence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-blue-800 mb-3">Technical Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {(analysisData?.skills?.technical || ['Problem Solving', 'Project Management', 'Strategic Planning']).map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-3">Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {(analysisData?.skills?.languages || ['English', 'Swedish']).map((lang: string, index: number) => (
                      <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-800">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-3">Tools & Platforms</h4>
                  <div className="flex flex-wrap gap-2">
                    {(analysisData?.skills?.tools || ['Microsoft Office', 'Email', 'Presentations']).map((tool: string, index: number) => (
                      <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Competency Scores */}
          <Card className="mb-8 border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center text-purple-800">
                <Award className="h-5 w-5 mr-2" />
                Competency Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(analysisData?.scores || {
                  leadership: 4,
                  innovation: 4,
                  adaptability: 4,
                  culturalFit: 4,
                  communication: 4,
                  teamwork: 4
                }).map(([key, value]: [string, any]) => {
                  const scoreNames: Record<string, string> = {
                    leadership: 'Leadership',
                    innovation: 'Innovation',
                    adaptability: 'Adaptability',
                    culturalFit: 'Cultural Fit',
                    communication: 'Communication',
                    teamwork: 'Teamwork'
                  };
                  
                  return (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-purple-800">
                          {scoreNames[key] || key}
                        </span>
                        <span className="text-sm font-bold text-purple-800">
                          {value}/5
                        </span>
                      </div>
                      <Progress value={(value / 5) * 100} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Market Analysis */}
          <Card className="mb-8 border-emerald-200 bg-emerald-50">
            <CardHeader>
              <CardTitle className="flex items-center text-emerald-800">
                <TrendingUp className="h-5 w-5 mr-2" />
                Market Analysis & Pricing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">
                    {analysisData?.marketAnalysis?.hourlyRate?.current || 800} SEK/h
                  </div>
                  <p className="text-sm text-emerald-700">Current Market Value</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">
                    {analysisData?.marketAnalysis?.hourlyRate?.optimized || 950} SEK/h
                  </div>
                  <p className="text-sm text-emerald-700">Optimized Value</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">
                    +{((analysisData?.marketAnalysis?.hourlyRate?.optimized || 950) - (analysisData?.marketAnalysis?.hourlyRate?.current || 800))} SEK/h
                  </div>
                  <p className="text-sm text-emerald-700">Potential Increase</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-semibold text-emerald-800 mb-3">Competitive Advantages</h4>
                <div className="space-y-2">
                  {(analysisData?.marketAnalysis?.competitiveAdvantages || ['Strong experience', 'Professional approach', 'Reliable delivery']).map((advantage: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-emerald-800">{advantage}</p>
                    </div>
                  ))}
                </div>
              </div>

              {analysisData?.marketAnalysis?.hourlyRate?.explanation && (
                <div className="mt-4 p-4 bg-white/60 rounded-lg">
                  <p className="text-sm text-emerald-800">
                    <strong>Market Assessment:</strong> {analysisData.marketAnalysis.hourlyRate.explanation}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Career Trajectory */}
          <Card className="mb-8 border-indigo-200 bg-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center text-indigo-800">
                <Target className="h-5 w-5 mr-2" />
                Career Development
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-indigo-800 mb-4">
                {analysisData?.analysisInsights?.careerTrajectory || 'Strong potential for senior consulting roles with continued focus on skill development and market positioning.'}
              </p>
              
              {analysisData?.analysisInsights?.consultingReadiness && (
                <div className="p-4 bg-white/60 rounded-lg">
                  <h4 className="font-semibold text-indigo-800 mb-2">Consulting Readiness</h4>
                  <p className="text-sm text-indigo-700">{analysisData.analysisInsights.consultingReadiness}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-slate-200">
            <Button
              onClick={onRestart}
              variant="outline"
              size="lg"
              className="px-6 py-3"
            >
              Start Over
            </Button>
            
            <Button
              onClick={onContinue}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl"
            >
              Continue to Profile
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm text-blue-700 text-center">
              💡 This analysis is AI-based and can be adjusted in the next step
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
