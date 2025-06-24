
import React from 'react';
import { User, Briefcase, Star, TrendingUp, Target, Award, CheckCircle, ArrowRight, MapPin, Mail, Phone, Globe, BookOpen, Users, MessageSquare, Lightbulb, DollarSign, BarChart } from 'lucide-react';
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
  const education = analysisData?.education || [];
  const marketAnalysis = analysisData?.marketAnalysis || {};
  const analysisInsights = analysisData?.analysisInsights || {};
  const scores = analysisData?.scores || {};
  const softSkills = analysisData?.softSkills || {};
  
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
                Technical Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Programming Languages & Frameworks */}
                <div>
                  <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    Programming Languages & Frameworks
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(skills?.technical || skills?.languages || ['JavaScript', 'React', 'Node.js', 'Python', 'TypeScript']).slice(0, 10).map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Tools & Platforms */}
                <div>
                  <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                    <Award className="h-4 w-4 mr-2" />
                    Tools & Platforms
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(skills?.tools || ['AWS', 'Docker', 'Git', 'Kubernetes', 'CI/CD']).slice(0, 8).map((tool: string, index: number) => (
                      <Badge key={index} variant="outline" className="bg-blue-100 text-blue-800">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Certifications & Education */}
                <div>
                  <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Education & Certifications
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Education</p>
                      <div className="space-y-1">
                        {(Array.isArray(education) ? education : [education]).filter(Boolean).slice(0, 3).map((edu: any, index: number) => (
                          <p key={index} className="text-sm text-blue-700 bg-white/60 p-2 rounded">
                            {typeof edu === 'string' ? edu : edu?.degree || edu?.field || 'Professional Education'}
                          </p>
                        ))}
                        {(!education || education.length === 0) && (
                          <p className="text-sm text-blue-700 bg-white/60 p-2 rounded">Professional Education</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Certifications</p>
                      <div className="flex flex-wrap gap-2">
                        {(education?.certifications || skills?.certifications || ['Professional Certification', 'Industry Standards']).slice(0, 4).map((cert: string, index: number) => (
                          <Badge key={index} variant="outline" className="bg-blue-100 text-blue-800">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Work Experience Highlights */}
                <div>
                  <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Work Experience Highlights
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {(workHistory || [
                      {role: 'Senior Developer', company: 'Tech Corp', technologies: ['React', 'Node.js']},
                      {role: 'Full Stack Engineer', company: 'StartupCo', technologies: ['Vue.js', 'Python']}
                    ]).slice(0, 3).map((work: any, index: number) => (
                      <div key={index} className="bg-white/60 p-4 rounded-lg">
                        <h5 className="font-medium text-blue-800">{work.role || `Project ${index + 1}`}</h5>
                        <p className="text-sm text-blue-700">{work.company || 'Company'}</p>
                        {work.technologies && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {work.technologies.slice(0, 4).map((tech: string, techIndex: number) => (
                              <Badge key={techIndex} variant="outline" className="text-xs bg-blue-50">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Soft Skills */}
          <Card className="mb-8 border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center text-purple-800">
                <Users className="h-5 w-5 mr-2" />
                Soft Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Communication Style */}
                <div>
                  <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Communication Style
                  </h4>
                  <div className="bg-white/60 p-4 rounded-lg">
                    <p className="text-sm text-purple-700">
                      {softSkills?.communicationStyle || analysisInsights?.communicationStyle || 'Clear and effective communicator with strong presentation skills. Able to explain complex technical concepts to both technical and non-technical stakeholders.'}
                    </p>
                  </div>
                </div>

                {/* Leadership Abilities */}
                <div>
                  <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                    <Target className="h-4 w-4 mr-2" />
                    Leadership Abilities
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries({
                      leadership: scores?.leadership || 4,
                      innovation: scores?.innovation || 4,
                      adaptability: scores?.adaptability || 4,
                      problemSolving: scores?.problemSolving || 4
                    }).map(([key, value]: [string, any]) => {
                      const scoreNames: Record<string, string> = {
                        leadership: 'Leadership',
                        innovation: 'Innovation',
                        adaptability: 'Adaptability',
                        problemSolving: 'Problem Solving'
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
                </div>

                {/* Teamwork & Cultural Fit */}
                <div>
                  <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Teamwork & Cultural Fit
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white/60 p-4 rounded-lg">
                      <h5 className="font-medium text-purple-800 mb-2">Team Collaboration</h5>
                      <p className="text-sm text-purple-700">
                        {softSkills?.workStyle || 'Strong team player with experience in agile environments and cross-functional collaboration.'}
                      </p>
                    </div>
                    <div className="bg-white/60 p-4 rounded-lg">
                      <h5 className="font-medium text-purple-800 mb-2">Cultural Adaptability</h5>
                      <p className="text-sm text-purple-700">
                        Adaptable to different work cultures and environments, with international experience.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Market Valuation */}
          <Card className="mb-8 border-emerald-200 bg-emerald-50">
            <CardHeader>
              <CardTitle className="flex items-center text-emerald-800">
                <DollarSign className="h-5 w-5 mr-2" />
                Market Valuation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Optimal Hourly Rate */}
                <div>
                  <h4 className="font-semibold text-emerald-800 mb-3 flex items-center">
                    <BarChart className="h-4 w-4 mr-2" />
                    Optimal Hourly Rate
                  </h4>
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
                </div>

                {/* Competitive Advantages */}
                <div>
                  <h4 className="font-semibold text-emerald-800 mb-3 flex items-center">
                    <Star className="h-4 w-4 mr-2" />
                    Competitive Advantages
                  </h4>
                  <div className="space-y-2">
                    {(marketAnalysis?.competitiveAdvantages || analysisInsights?.strengths || [
                      'Strong technical expertise in modern frameworks',
                      'Proven track record of successful project delivery',
                      'Excellent communication and leadership skills',
                      'Experience with enterprise-level solutions'
                    ]).map((advantage: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-emerald-800">{advantage}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Demand & Trends */}
                <div>
                  <h4 className="font-semibold text-emerald-800 mb-3 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Demand & Trends
                  </h4>
                  <div className="bg-white/60 p-4 rounded-lg">
                    <p className="text-sm text-emerald-800">
                      <strong>Market Assessment:</strong> {marketAnalysis?.hourlyRate?.explanation || marketAnalysis?.marketDemand || 'High demand for your skill set in the current market. Your expertise aligns well with trending technologies and business needs.'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Career Development */}
          <Card className="mb-8 border-indigo-200 bg-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center text-indigo-800">
                <Lightbulb className="h-5 w-5 mr-2" />
                Career Development
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Development Areas */}
                <div>
                  <h4 className="font-semibold text-indigo-800 mb-3 flex items-center">
                    <Target className="h-4 w-4 mr-2" />
                    Development Areas
                  </h4>
                  <div className="space-y-2">
                    {(analysisInsights?.developmentAreas || marketAnalysis?.recommendedFocus ? [marketAnalysis.recommendedFocus] : [
                      'Cloud architecture and microservices',
                      'Advanced data analytics and machine learning',
                      'Technical leadership and mentoring skills',
                      'Industry-specific domain knowledge'
                    ]).map((area: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <TrendingUp className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-indigo-800">{area}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Courses */}
                <div>
                  <h4 className="font-semibold text-indigo-800 mb-3 flex items-center">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Recommended Courses
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      'AWS Solutions Architect Certification',
                      'Advanced React and Next.js',
                      'Leadership in Tech Organizations',
                      'Data Science and Machine Learning'
                    ].map((course: string, index: number) => (
                      <div key={index} className="bg-white/60 p-3 rounded-lg">
                        <p className="text-sm text-indigo-800">{course}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next Career Step */}
                <div>
                  <h4 className="font-semibold text-indigo-800 mb-3 flex items-center">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Next Career Step
                  </h4>
                  <div className="bg-white/60 p-4 rounded-lg">
                    <p className="text-sm text-indigo-700">
                      {analysisInsights?.careerTrajectory || 'Based on your current skills and market trends, consider transitioning to a Senior Technical Lead or Solution Architect role. Focus on expanding your leadership experience and cloud architecture expertise.'}
                    </p>
                  </div>
                </div>
              </div>
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
              💡 This comprehensive analysis is AI-powered and can be refined in the next step
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
