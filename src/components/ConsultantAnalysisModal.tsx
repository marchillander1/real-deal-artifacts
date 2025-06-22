
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
  const cvAnalysis = consultant.cvAnalysis?.analysis;
  const linkedinAnalysis = consultant.linkedinAnalysis?.analysis;
  const hasAnalysisData = cvAnalysis || linkedinAnalysis;

  if (!hasAnalysisData) {
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
                      <p className="font-medium">{cvAnalysis.professionalSummary.currentRole}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Years of Experience</p>
                      <p className="font-medium">{cvAnalysis.professionalSummary.yearsOfExperience} years</p>
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
            {cvAnalysis?.marketPositioning?.competitiveAdvantages && (
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
          </TabsContent>

          <TabsContent value="technical" className="space-y-6">
            {/* Technical Expertise */}
            {cvAnalysis?.technicalExpertise && (
              <Card>
                <CardHeader>
                  <CardTitle>Technical Expertise</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cvAnalysis.technicalExpertise.programmingLanguages?.expert && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Expert Level</p>
                      <div className="flex flex-wrap gap-1">
                        {cvAnalysis.technicalExpertise.programmingLanguages.expert.map((skill, index) => (
                          <Badge key={index} className="bg-green-100 text-green-800">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {cvAnalysis.technicalExpertise.programmingLanguages?.intermediate && (
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
                        <div>
                          <p className="text-gray-600">Minimum</p>
                          <p className="font-medium text-green-600">
                            {cvAnalysis.marketPositioning.hourlyRateEstimate.minimum} SEK/hour
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Recommended</p>
                          <p className="font-medium text-blue-600">
                            {cvAnalysis.marketPositioning.hourlyRateEstimate.recommended} SEK/hour
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Premium</p>
                          <p className="font-medium text-purple-600">
                            {cvAnalysis.marketPositioning.hourlyRateEstimate.premium} SEK/hour
                          </p>
                        </div>
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
            {/* Improvement Tips */}
            {consultant.cvTips && consultant.cvTips.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-orange-600" />
                    CV Improvement Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {consultant.cvTips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Certification Recommendations */}
            {consultant.certificationRecommendations && consultant.certificationRecommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-600" />
                    Recommended Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {consultant.certificationRecommendations.map((cert, index) => (
                      <Badge key={index} variant="outline" className="border-yellow-200 text-yellow-800">
                        {cert}
                      </Badge>
                    ))}
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
