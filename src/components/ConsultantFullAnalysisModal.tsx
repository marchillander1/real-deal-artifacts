
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User, MapPin, Phone, Mail, Briefcase, Star, Award, Brain, TrendingUp, DollarSign } from 'lucide-react';
import { Consultant } from '@/types/consultant';

interface ConsultantFullAnalysisModalProps {
  consultant: Consultant;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ConsultantFullAnalysisModal: React.FC<ConsultantFullAnalysisModalProps> = ({
  consultant,
  open,
  onOpenChange
}) => {
  const cvAnalysis = consultant.cvAnalysis?.analysis;
  const linkedinAnalysis = consultant.linkedinAnalysis?.analysis;

  if (!cvAnalysis && !linkedinAnalysis) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Analysis - {consultant.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Personal Information */}
          {cvAnalysis?.personalInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Name:</span>
                    <p className="font-medium">{cvAnalysis.personalInfo.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Email:</span>
                    <p className="font-medium">{cvAnalysis.personalInfo.email}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Phone:</span>
                    <p className="font-medium">{cvAnalysis.personalInfo.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Location:</span>
                    <p className="font-medium">{cvAnalysis.personalInfo.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Professional Summary */}
          {cvAnalysis?.professionalSummary && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Professional Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">Current Role:</span>
                  <p className="font-medium">{cvAnalysis.professionalSummary.currentRole}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Years of Experience:</span>
                  <p className="font-medium">{cvAnalysis.professionalSummary.yearsOfExperience} years</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Summary:</span>
                  <p className="text-gray-700">{cvAnalysis.professionalSummary.summary}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Technical Expertise */}
          {cvAnalysis?.technicalExpertise && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Technical Expertise
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cvAnalysis.technicalExpertise.programmingLanguages && (
                  <div>
                    <span className="text-sm font-medium text-gray-600 mb-2 block">Programming Languages:</span>
                    <div className="space-y-2">
                      {cvAnalysis.technicalExpertise.programmingLanguages.expert?.length > 0 && (
                        <div>
                          <span className="text-xs font-medium text-green-700">Expert:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {cvAnalysis.technicalExpertise.programmingLanguages.expert.map((skill, index) => (
                              <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {cvAnalysis.technicalExpertise.programmingLanguages.intermediate?.length > 0 && (
                        <div>
                          <span className="text-xs font-medium text-yellow-700">Intermediate:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {cvAnalysis.technicalExpertise.programmingLanguages.intermediate.map((skill, index) => (
                              <Badge key={index} variant="secondary" className="bg-yellow-100 text-yellow-800">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {cvAnalysis.technicalExpertise.frameworks?.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-600 mb-2 block">Frameworks & Technologies:</span>
                    <div className="flex flex-wrap gap-1">
                      {cvAnalysis.technicalExpertise.frameworks.map((framework, index) => (
                        <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                          {framework}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {cvAnalysis.technicalExpertise.tools?.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-600 mb-2 block">Tools & Platforms:</span>
                    <div className="flex flex-wrap gap-1">
                      {cvAnalysis.technicalExpertise.tools.map((tool, index) => (
                        <Badge key={index} variant="outline" className="bg-gray-50 text-gray-700">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Market Positioning */}
          {cvAnalysis?.marketPositioning && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Market Positioning
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cvAnalysis.marketPositioning.hourlyRateEstimate && (
                  <div>
                    <span className="text-sm font-medium text-gray-600 mb-2 block">Hourly Rate Estimate:</span>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <p className="text-xs text-gray-600">Min</p>
                        <p className="font-medium">{cvAnalysis.marketPositioning.hourlyRateEstimate.min} SEK</p>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded">
                        <p className="text-xs text-green-600">Recommended</p>
                        <p className="font-medium text-green-700">{cvAnalysis.marketPositioning.hourlyRateEstimate.recommended} SEK</p>
                      </div>
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <p className="text-xs text-blue-600">Max</p>
                        <p className="font-medium text-blue-700">{cvAnalysis.marketPositioning.hourlyRateEstimate.max} SEK</p>
                      </div>
                    </div>
                  </div>
                )}

                {cvAnalysis.marketPositioning.competitiveAdvantages?.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-600 mb-2 block">Competitive Advantages:</span>
                    <div className="flex flex-wrap gap-2">
                      {cvAnalysis.marketPositioning.competitiveAdvantages.map((advantage, index) => (
                        <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-800">
                          {advantage}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {cvAnalysis.marketPositioning.targetIndustries?.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-600 mb-2 block">Target Industries:</span>
                    <div className="flex flex-wrap gap-1">
                      {cvAnalysis.marketPositioning.targetIndustries.map((industry, index) => (
                        <Badge key={index} variant="outline">
                          {industry}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Soft Skills */}
          {cvAnalysis?.softSkills && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Soft Skills & Traits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(cvAnalysis.softSkills).map(([category, skills]) => (
                  skills && Array.isArray(skills) && skills.length > 0 && (
                    <div key={category}>
                      <span className="text-sm font-medium text-gray-600 mb-1 block capitalize">
                        {category.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="bg-indigo-50 text-indigo-700">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )
                ))}
              </CardContent>
            </Card>
          )}

          {/* Education */}
          {cvAnalysis?.education && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Education & Certifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {cvAnalysis.education.degrees?.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-600 mb-2 block">Degrees:</span>
                    <div className="space-y-2">
                      {cvAnalysis.education.degrees.map((degree, index) => (
                        <div key={index} className="p-2 bg-gray-50 rounded">
                          <p className="font-medium">{degree}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {cvAnalysis.education.certifications?.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-600 mb-2 block">Certifications:</span>
                    <div className="flex flex-wrap gap-1">
                      {cvAnalysis.education.certifications.map((cert, index) => (
                        <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-800">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* LinkedIn Analysis if available */}
          {linkedinAnalysis && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-blue-600" />
                  LinkedIn Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">LinkedIn analysis data available</p>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                  {JSON.stringify(linkedinAnalysis, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
