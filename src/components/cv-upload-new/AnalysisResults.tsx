
import React from 'react';
import { CheckCircle, User, Star, TrendingUp, MapPin, Mail, Phone, Globe, Award, Code, Languages, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AnalysisResultsProps {
  analysisData: any;
  onViewResults: () => void;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  analysisData,
  onViewResults
}) => {
  const personalInfo = analysisData?.personalInfo || {};
  const skills = analysisData?.skills || {};
  const experience = analysisData?.experience || {};
  const marketAnalysis = analysisData?.marketAnalysis || {};
  const softSkills = analysisData?.softSkills || {};

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-16 w-16" />
          </div>
          <CardTitle className="text-3xl font-bold mb-4">
            Analysis Complete! 🎉
          </CardTitle>
          <p className="text-lg opacity-90">
            Here's what our AI discovered about your professional profile
          </p>
        </CardHeader>

        <CardContent className="p-8">
          {/* Personal Information Summary */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {personalInfo.name || 'Professional Consultant'}
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              {experience.currentRole || 'Consultant'}
            </p>
            <div className="flex justify-center space-x-4 text-sm text-gray-500">
              <span>{personalInfo.location || 'Location not specified'}</span>
              <span>•</span>
              <span>{experience.years || 0}+ years experience</span>
              <span>•</span>
              <span>{marketAnalysis?.hourlyRate?.optimized || 800} SEK/h recommended</span>
            </div>
          </div>

          {/* Analysis Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardContent className="p-6 text-center">
                <Code className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Technical Skills</h3>
                <p className="text-blue-700">{(skills.technical || []).length} skills identified</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 bg-green-50">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-green-900 mb-2">Market Analysis</h3>
                <p className="text-green-700">Optimized rate calculated</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 bg-purple-50">
              <CardContent className="p-6 text-center">
                <User className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-purple-900 mb-2">Soft Skills</h3>
                <p className="text-purple-700">Leadership & communication analyzed</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Results */}
          <div className="space-y-6">
            {/* Technical Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="h-5 w-5 mr-2" />
                  Technical Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(skills.technical || []).slice(0, 12).map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                      {skill}
                    </Badge>
                  ))}
                  {(skills.technical || []).length > 12 && (
                    <Badge variant="outline">+{(skills.technical || []).length - 12} more</Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Experience Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Experience Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Experience Level</p>
                    <p className="font-semibold">{experience.level || 'Senior'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Years of Experience</p>
                    <p className="font-semibold">{experience.years || 0}+ years</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Current Role</p>
                    <p className="font-semibold">{experience.currentRole || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Industry Focus</p>
                    <p className="font-semibold">{experience.industry || 'Technology'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Market Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Market Valuation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Current Market Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{marketAnalysis?.hourlyRate?.current || 800} SEK/h</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg border-2 border-green-200">
                    <p className="text-sm text-green-600">Optimized Rate</p>
                    <p className="text-2xl font-bold text-green-700">{marketAnalysis?.hourlyRate?.optimized || 950} SEK/h</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600">Potential Increase</p>
                    <p className="text-2xl font-bold text-blue-700">
                      +{((marketAnalysis?.hourlyRate?.optimized || 950) - (marketAnalysis?.hourlyRate?.current || 800))} SEK/h
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Soft Skills */}
            {softSkills && Object.keys(softSkills).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Soft Skills Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {softSkills.communicationStyle && (
                      <div>
                        <p className="text-sm text-gray-600">Communication Style</p>
                        <p className="font-semibold">{softSkills.communicationStyle}</p>
                      </div>
                    )}
                    {softSkills.personalityTraits && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Personality Traits</p>
                        <div className="flex flex-wrap gap-2">
                          {(softSkills.personalityTraits || []).map((trait: string, index: number) => (
                            <Badge key={index} variant="outline" className="bg-purple-50 text-purple-700">
                              {trait}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Action Button */}
          <div className="text-center mt-8">
            <Button
              onClick={onViewResults}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-lg font-semibold rounded-xl"
            >
              <Star className="h-5 w-5 mr-2" />
              Continue to Profile Setup
            </Button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm text-blue-700 text-center">
              🎯 Next: Review and customize your consultant profile before joining the network
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
