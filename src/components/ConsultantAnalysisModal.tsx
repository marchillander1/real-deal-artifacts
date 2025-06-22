
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  FileText, 
  Linkedin, 
  TrendingUp, 
  Users, 
  Target,
  Star,
  Award,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Consultant } from '@/types/consultant';

interface ConsultantAnalysisModalProps {
  consultant: Consultant;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ConsultantAnalysisModal: React.FC<ConsultantAnalysisModalProps> = ({
  consultant,
  open,
  onOpenChange,
}) => {
  console.log('🔍 ConsultantAnalysisModal - Full consultant data:', consultant);
  console.log('🔍 CV Analysis data:', consultant.cvAnalysis);
  console.log('🔍 LinkedIn Analysis data:', consultant.linkedinAnalysis);

  // Access analysis data correctly
  const cvAnalysis = consultant.cvAnalysis?.analysis;
  console.log('🔍 Parsed CV Analysis:', cvAnalysis);
  
  const linkedinAnalysis = consultant.linkedinAnalysis?.analysis;
  console.log('🔍 Parsed LinkedIn Analysis:', linkedinAnalysis);
  
  const hasAnalysisData = cvAnalysis || linkedinAnalysis;
  console.log('🔍 Has analysis data:', hasAnalysisData);

  if (!hasAnalysisData) {
    console.log('❌ No analysis data available, showing placeholder');
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              AI Analysis - {consultant.name}
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Available</h3>
            <p className="text-gray-600">
              This consultant hasn't been analyzed yet. Upload their CV or LinkedIn profile to get AI insights.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  console.log('✅ Rendering full analysis modal with data');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Analysis - {consultant.name}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="market">Market Position</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Analysis Sources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Analysis Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  {consultant.cvAnalysis && (
                    <div className="flex items-center gap-2 text-green-600">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm font-medium">CV Analyzed</span>
                      <Badge variant="outline" className="text-xs">
                        Recently analyzed
                      </Badge>
                    </div>
                  )}
                  {consultant.linkedinAnalysis && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <Linkedin className="h-4 w-4" />
                      <span className="text-sm font-medium">LinkedIn Analyzed</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Professional Summary */}
            {cvAnalysis?.professionalSummary && (
              <Card>
                <CardHeader>
                  <CardTitle>Professional Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Current Role</p>
                      <p className="font-medium">{cvAnalysis.professionalSummary.currentRole || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Years of Experience</p>
                      <p className="font-medium">{cvAnalysis.professionalSummary.yearsOfExperience || 0} years</p>
                    </div>
                  </div>
                  {cvAnalysis.professionalSummary.summary && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Summary</p>
                      <p className="text-sm">{cvAnalysis.professionalSummary.summary}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Competitive Advantages */}
            {cvAnalysis?.marketPositioning?.competitiveAdvantages && cvAnalysis.marketPositioning.competitiveAdvantages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-600" />
                    Competitive Advantages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {cvAnalysis.marketPositioning.competitiveAdvantages.map((advantage, index) => (
                      <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-800">
                        {advantage}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Personal Information from CV */}
            {cvAnalysis?.personalInfo && (
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {cvAnalysis.personalInfo.name && (
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-medium">{cvAnalysis.personalInfo.name}</p>
                      </div>
                    )}
                    {cvAnalysis.personalInfo.location && (
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-medium">{cvAnalysis.personalInfo.location}</p>
                      </div>
                    )}
                    {cvAnalysis.personalInfo.email && (
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{cvAnalysis.personalInfo.email}</p>
                      </div>
                    )}
                    {cvAnalysis.personalInfo.phone && (
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium">{cvAnalysis.personalInfo.phone}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="technical" className="space-y-6">
            {/* Technical Expertise */}
            {cvAnalysis?.technicalExpertise && (
              <Card>
                <CardHeader>
                  <CardTitle>Technical Expertise</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cvAnalysis.technicalExpertise.programmingLanguages?.expert && cvAnalysis.technicalExpertise.programmingLanguages.expert.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Expert Level</p>
                      <div className="flex flex-wrap gap-1">
                        {cvAnalysis.technicalExpertise.programmingLanguages.expert.map((skill, index) => (
                          <Badge key={index} className="bg-green-100 text-green-800">
                            ✓ {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {cvAnalysis.technicalExpertise.programmingLanguages?.intermediate && cvAnalysis.technicalExpertise.programmingLanguages.intermediate.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Intermediate Level</p>
                      <div className="flex flex-wrap gap-1">
                        {cvAnalysis.technicalExpertise.programmingLanguages.intermediate.map((skill, index) => (
                          <Badge key={index} variant="outline" className="border-yellow-200 text-yellow-800">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {cvAnalysis.technicalExpertise.frameworks && cvAnalysis.technicalExpertise.frameworks.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Frameworks & Technologies</p>
                      <div className="flex flex-wrap gap-1">
                        {cvAnalysis.technicalExpertise.frameworks.map((framework, index) => (
                          <Badge key={index} variant="outline" className="border-blue-200 text-blue-800">
                            {framework}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="market" className="space-y-6">
            {/* Market Positioning */}
            {cvAnalysis?.marketPositioning && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Market Positioning
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cvAnalysis.marketPositioning.hourlyRateEstimate && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Hourly Rate Estimate</p>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        {cvAnalysis.marketPositioning.hourlyRateEstimate.minimum && (
                          <div>
                            <p className="text-gray-600">Minimum</p>
                            <p className="font-medium text-green-600">
                              {cvAnalysis.marketPositioning.hourlyRateEstimate.minimum} SEK/hour
                            </p>
                          </div>
                        )}
                        {cvAnalysis.marketPositioning.hourlyRateEstimate.recommended && (
                          <div>
                            <p className="text-gray-600">Recommended</p>
                            <p className="font-medium text-blue-600">
                              {cvAnalysis.marketPositioning.hourlyRateEstimate.recommended} SEK/hour
                            </p>
                          </div>
                        )}
                        {cvAnalysis.marketPositioning.hourlyRateEstimate.premium && (
                          <div>
                            <p className="text-gray-600">Premium</p>
                            <p className="font-medium text-purple-600">
                              {cvAnalysis.marketPositioning.hourlyRateEstimate.premium} SEK/hour
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {cvAnalysis.marketPositioning.reasoning && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Market Analysis</p>
                      <p className="text-sm text-gray-600">{cvAnalysis.marketPositioning.reasoning}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            {/* CV Improvement Tips */}
            {consultant.cv_tips && consultant.cv_tips.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-orange-600" />
                    CV Improvement Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {consultant.cv_tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Learning Path Recommendations */}
            {consultant.suggested_learning_paths && consultant.suggested_learning_paths.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-600" />
                    Recommended Learning Paths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {consultant.suggested_learning_paths.map((path, index) => (
                      <Badge key={index} variant="outline" className="border-yellow-200 text-yellow-800">
                        {path}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Analysis Quality Score */}
            {consultant.profile_completeness && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    Profile Completeness
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Profile Completeness</span>
                      <span>{Math.round(consultant.profile_completeness)}%</span>
                    </div>
                    <Progress value={consultant.profile_completeness} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
