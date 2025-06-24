
import React from 'react';
import { User, Briefcase, Star, TrendingUp, Target, Award, CheckCircle, ArrowRight, MapPin, Mail, Phone, Globe } from 'lucide-react';
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
  
  console.log('Full analysis data in AnalysisResults:', JSON.stringify(analysisData, null, 2));
  
  // Extract data safely with fallbacks
  const personalInfo = analysisData?.personalInfo || {};
  const experience = analysisData?.experience || {};
  const skills = analysisData?.skills || {};
  const workHistory = analysisData?.workHistory || [];
  const education = analysisData?.education || {};
  const marketAnalysis = analysisData?.marketAnalysis || {};
  const analysisInsights = analysisData?.analysisInsights || {};
  const scores = analysisData?.scores || {};
  
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
          {/* Personal Information */}
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  {personalInfo?.name || 'Professional Profile'}
                </h2>
                <p className="text-lg text-blue-600 font-semibold mb-3">
                  {experience?.currentRole || personalInfo?.title || 'Consultant'}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                  {personalInfo?.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-slate-500" />
                      <span>{personalInfo.email}</span>
                    </div>
                  )}
                  {personalInfo?.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-slate-500" />
                      <span>{personalInfo.phone}</span>
                    </div>
                  )}
                  {personalInfo?.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-500" />
                      <span>{personalInfo.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-slate-500" />
                    <span>{experience?.years || 5}+ years experience</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Skills Analysis */}
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-800">
                <Star className="h-5 w-5 mr-2" />
                Technical Expertise
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-blue-800 mb-3">Core Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {(skills?.technical || skills?.programmingLanguages || ['Problem Solving', 'Project Management', 'Strategic Planning']).slice(0, 8).map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-3">Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {(skills?.languages || education?.languages || ['English', 'Swedish']).map((lang: string, index: number) => (
                      <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-800">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-3">Tools & Frameworks</h4>
                  <div className="flex flex-wrap gap-2">
                    {(skills?.tools || skills?.frameworks || ['Microsoft Office', 'Communication', 'Leadership']).slice(0, 6).map((tool: string, index: number) => (
                      <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Work Experience */}
          {workHistory && workHistory.length > 0 && (
            <Card className="mb-8 border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center text-green-800">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Professional Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workHistory.slice(0, 3).map((job: any, index: number) => (
                    <div key={index} className="border-l-4 border-green-400 pl-4 bg-white/60 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800">
                        {job.role || job.title || `Position ${index + 1}`}
                      </h4>
                      <p className="text-sm text-green-700">{job.company || 'Company'}</p>
                      <p className="text-xs text-green-600">{job.duration || job.period || 'Duration not specified'}</p>
                      {job.technologies && job.technologies.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {job.technologies.slice(0, 5).map((tech: string, techIndex: number) => (
                            <Badge key={techIndex} variant="outline" className="text-xs bg-green-100">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Competency Scores */}
          <Card className="mb-8 border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center text-purple-800">
                <Award className="h-5 w-5 mr-2" />
                Professional Competencies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries({
                  leadership: scores?.leadership || 4,
                  innovation: scores?.innovation || 4,
                  adaptability: scores?.adaptability || 4,
                  culturalFit: scores?.culturalFit || 4,
                  communication: scores?.communication || 4,
                  teamwork: scores?.teamwork || 4,
                  ...scores
                }).slice(0, 6).map(([key, value]: [string, any]) => {
                  const scoreNames: Record<string, string> = {
                    leadership: 'Leadership',
                    innovation: 'Innovation',
                    adaptability: 'Adaptability',
                    culturalFit: 'Cultural Fit',
                    communication: 'Communication',
                    teamwork: 'Teamwork'
                  };
                  
                  const numValue = typeof value === 'number' ? value : 4;
                  
                  return (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-purple-800">
                          {scoreNames[key] || key.charAt(0).toUpperCase() + key.slice(1)}
                        </span>
                        <span className="text-sm font-bold text-purple-800">
                          {numValue}/5
                        </span>
                      </div>
                      <Progress value={(numValue / 5) * 100} className="h-2" />
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
                Market Analysis & Positioning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">
                    {marketAnalysis?.hourlyRate?.current || 800} SEK/h
                  </div>
                  <p className="text-sm text-emerald-700">Current Market Value</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">
                    {marketAnalysis?.hourlyRate?.optimized || 950} SEK/h
                  </div>
                  <p className="text-sm text-emerald-700">Optimized Value</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">
                    +{((marketAnalysis?.hourlyRate?.optimized || 950) - (marketAnalysis?.hourlyRate?.current || 800))} SEK/h
                  </div>
                  <p className="text-sm text-emerald-700">Potential Increase</p>
                </div>
              </div>
              
              {marketAnalysis?.competitiveAdvantages && (
                <div className="mb-4">
                  <h4 className="font-semibold text-emerald-800 mb-3">Competitive Advantages</h4>
                  <div className="space-y-2">
                    {marketAnalysis.competitiveAdvantages.map((advantage: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-emerald-800">{advantage}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {marketAnalysis?.hourlyRate?.explanation && (
                <div className="p-4 bg-white/60 rounded-lg">
                  <p className="text-sm text-emerald-800">
                    <strong>Market Assessment:</strong> {marketAnalysis.hourlyRate.explanation}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Career Development & Insights */}
          <Card className="mb-8 border-indigo-200 bg-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center text-indigo-800">
                <Target className="h-5 w-5 mr-2" />
                Career Development Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-indigo-800 mb-3">Key Strengths</h4>
                  <div className="space-y-2">
                    {(analysisInsights?.strengths || ['Professional experience', 'Strong analytical skills', 'Proven track record']).map((strength: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-indigo-800">{strength}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-indigo-800 mb-3">Development Areas</h4>
                  <div className="space-y-2">
                    {(analysisInsights?.developmentAreas || ['Market positioning', 'Personal branding', 'Network expansion']).map((area: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <TrendingUp className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-indigo-800">{area}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {analysisInsights?.careerTrajectory && (
                <div className="mt-6 p-4 bg-white/60 rounded-lg">
                  <h4 className="font-semibold text-indigo-800 mb-2">Career Trajectory</h4>
                  <p className="text-sm text-indigo-700">{analysisInsights.careerTrajectory}</p>
                </div>
              )}
              
              {analysisInsights?.consultingReadiness && (
                <div className="mt-4 p-4 bg-white/60 rounded-lg">
                  <h4 className="font-semibold text-indigo-800 mb-2">Consulting Readiness</h4>
                  <p className="text-sm text-indigo-700">{analysisInsights.consultingReadiness}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Education & Certifications */}
          {(education?.degrees?.length > 0 || education?.certifications?.length > 0) && (
            <Card className="mb-8 border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-800">
                  <Award className="h-5 w-5 mr-2" />
                  Education & Qualifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {education.degrees?.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-orange-800 mb-3">Education</h4>
                      <div className="space-y-2">
                        {education.degrees.map((degree: string, index: number) => (
                          <div key={index} className="p-3 bg-white/60 rounded-lg">
                            <p className="text-sm text-orange-800">{degree}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {education.certifications?.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-orange-800 mb-3">Certifications</h4>
                      <div className="flex flex-wrap gap-2">
                        {education.certifications.map((cert: string, index: number) => (
                          <Badge key={index} variant="outline" className="bg-orange-100 text-orange-800">
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
              💡 This comprehensive analysis is AI-powered and can be refined in the next step
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
