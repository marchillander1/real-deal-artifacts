
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  User, Mail, Phone, MapPin, Star, Award, 
  Brain, Users, TrendingUp, Target, Briefcase,
  BookOpen, Languages, Heart, Zap
} from 'lucide-react';
import { Consultant } from '@/types/consultant';

interface ConsultantAnalysisCardProps {
  consultant: Consultant;
}

export const ConsultantAnalysisCard: React.FC<ConsultantAnalysisCardProps> = ({ consultant }) => {
  const cvAnalysis = consultant.cvAnalysis;
  const linkedinAnalysis = consultant.linkedinAnalysis;

  // Calculate scores for display
  const getScorePercentage = (score: number) => Math.round((score / 5) * 100);

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="font-medium">{consultant.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span>{consultant.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span>{consultant.phone || 'Not provided'}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span>{consultant.location}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Skills - Hard Values */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Technical Expertise (Hard Skills)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Programming Languages</h4>
            <div className="flex flex-wrap gap-2">
              {cvAnalysis?.skills?.languages?.map((lang: string, index: number) => (
                <Badge key={index} variant="secondary">{lang}</Badge>
              )) || <span className="text-gray-500">None specified</span>}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Technical Skills</h4>
            <div className="flex flex-wrap gap-2">
              {cvAnalysis?.skills?.technical?.map((skill: string, index: number) => (
                <Badge key={index} variant="outline">{skill}</Badge>
              )) || <span className="text-gray-500">None specified</span>}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Tools & Frameworks</h4>
            <div className="flex flex-wrap gap-2">
              {cvAnalysis?.skills?.tools?.map((tool: string, index: number) => (
                <Badge key={index} variant="default">{tool}</Badge>
              )) || <span className="text-gray-500">None specified</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <span className="text-sm text-gray-600">Experience Level:</span>
              <p className="font-medium">{cvAnalysis?.experience?.level || 'Not specified'}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Years of Experience:</span>
              <p className="font-medium">{cvAnalysis?.experience?.years || 'Not specified'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Soft Skills & Personality */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Soft Skills & Personality Traits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Communication Style</h4>
              <p className="text-sm text-gray-600 mb-2">
                {cvAnalysis?.softSkills?.communicationStyle || 'Analysis not available'}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Leadership Style</h4>
              <p className="text-sm text-gray-600 mb-2">
                {cvAnalysis?.softSkills?.leadershipStyle || 'Analysis not available'}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Core Values</h4>
            <div className="flex flex-wrap gap-2">
              {cvAnalysis?.softSkills?.values?.map((value: string, index: number) => (
                <Badge key={index} variant="secondary">{value}</Badge>
              )) || <span className="text-gray-500">Not identified</span>}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Personality Traits</h4>
            <div className="flex flex-wrap gap-2">
              {cvAnalysis?.softSkills?.personalityTraits?.map((trait: string, index: number) => (
                <Badge key={index} variant="outline">{trait}</Badge>
              )) || <span className="text-gray-500">Not identified</span>}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Work Style</h4>
            <p className="text-sm text-gray-600">
              {cvAnalysis?.softSkills?.workStyle || 'Analysis not available'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Behavioral Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Behavioral Assessment Scores
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Leadership</span>
                <span className="text-sm text-gray-600">{getScorePercentage(cvAnalysis?.scores?.leadership || 0)}%</span>
              </div>
              <Progress value={getScorePercentage(cvAnalysis?.scores?.leadership || 0)} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Innovation</span>
                <span className="text-sm text-gray-600">{getScorePercentage(cvAnalysis?.scores?.innovation || 0)}%</span>
              </div>
              <Progress value={getScorePercentage(cvAnalysis?.scores?.innovation || 0)} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Adaptability</span>
                <span className="text-sm text-gray-600">{getScorePercentage(cvAnalysis?.scores?.adaptability || 0)}%</span>
              </div>
              <Progress value={getScorePercentage(cvAnalysis?.scores?.adaptability || 0)} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Cultural Fit</span>
                <span className="text-sm text-gray-600">{getScorePercentage(cvAnalysis?.scores?.culturalFit || 0)}%</span>
              </div>
              <Progress value={getScorePercentage(cvAnalysis?.scores?.culturalFit || 0)} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Communication</span>
                <span className="text-sm text-gray-600">{getScorePercentage(cvAnalysis?.scores?.communication || 0)}%</span>
              </div>
              <Progress value={getScorePercentage(cvAnalysis?.scores?.communication || 0)} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Teamwork</span>
                <span className="text-sm text-gray-600">{getScorePercentage(cvAnalysis?.scores?.teamwork || 0)}%</span>
              </div>
              <Progress value={getScorePercentage(cvAnalysis?.scores?.teamwork || 0)} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Market Analysis & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-1">Current Market Rate</h4>
              <p className="text-2xl font-bold text-blue-700">
                {cvAnalysis?.marketAnalysis?.hourlyRate?.current || 0} SEK/hour
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-1">Optimized Rate</h4>
              <p className="text-2xl font-bold text-green-700">
                {cvAnalysis?.marketAnalysis?.hourlyRate?.optimized || 0} SEK/hour
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Rate Explanation</h4>
            <p className="text-sm text-gray-600">
              {cvAnalysis?.marketAnalysis?.hourlyRate?.explanation || 'No explanation available'}
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-2">Competitive Advantages</h4>
            <ul className="space-y-1">
              {cvAnalysis?.marketAnalysis?.competitiveAdvantages?.map((advantage: string, index: number) => (
                <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                  <Zap className="h-3 w-3 text-yellow-500" />
                  {advantage}
                </li>
              )) || <li className="text-gray-500">No competitive advantages identified</li>}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">Market Demand</h4>
            <p className="text-sm text-gray-600">
              {cvAnalysis?.marketAnalysis?.marketDemand || 'Analysis not available'}
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-2">Recommended Focus Areas</h4>
            <p className="text-sm text-gray-600">
              {cvAnalysis?.marketAnalysis?.recommendedFocus || 'No specific recommendations available'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Career Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Career Development Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Key Strengths</h4>
            <ul className="space-y-1">
              {cvAnalysis?.analysisInsights?.strengths?.map((strength: string, index: number) => (
                <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                  <Star className="h-3 w-3 text-green-500" />
                  {strength}
                </li>
              )) || <li className="text-gray-500">No strengths identified</li>}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">Development Areas</h4>
            <ul className="space-y-1">
              {cvAnalysis?.analysisInsights?.developmentAreas?.map((area: string, index: number) => (
                <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                  <BookOpen className="h-3 w-3 text-blue-500" />
                  {area}
                </li>
              )) || <li className="text-gray-500">No development areas identified</li>}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">Career Trajectory</h4>
            <p className="text-sm text-gray-600">
              {cvAnalysis?.analysisInsights?.careerTrajectory || 'Analysis not available'}
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-2">Consulting Readiness</h4>
            <p className="text-sm text-gray-600">
              {cvAnalysis?.analysisInsights?.consultingReadiness || 'Assessment not available'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Work History */}
      {cvAnalysis?.workHistory && cvAnalysis.workHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Work Experience
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cvAnalysis.workHistory.map((job: any, index: number) => (
                <div key={index} className="border-l-2 border-blue-200 pl-4">
                  <h4 className="font-medium">{job.role}</h4>
                  <p className="text-sm text-gray-600">{job.company}</p>
                  <p className="text-xs text-gray-500">{job.duration}</p>
                  <p className="text-sm mt-1">{job.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
