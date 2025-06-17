
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Brain, FileText, Linkedin, Star, MapPin, Clock } from 'lucide-react';
import { Consultant } from '@/types/consultant';

interface ConsultantAnalysisDisplayProps {
  consultant: Consultant;
}

export const ConsultantAnalysisDisplay: React.FC<ConsultantAnalysisDisplayProps> = ({ consultant }) => {
  const cvAnalysis = consultant.cvAnalysis?.analysis;
  const linkedinAnalysis = consultant.linkedinAnalysis;

  // If no analysis data, don't show anything
  if (!cvAnalysis && !linkedinAnalysis) {
    return null;
  }

  return (
    <Card className="mt-4 border-purple-200 bg-purple-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-purple-900">
          <Brain className="h-5 w-5" />
          AI Analysis Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* CV Analysis Section */}
        {cvAnalysis && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-blue-600" />
              <h4 className="font-semibold text-blue-900">CV Analysis</h4>
            </div>
            
            {/* Personal Info from CV */}
            {cvAnalysis.personalInfo && (
              <div className="bg-white rounded-lg p-3 mb-3">
                <h5 className="font-medium text-gray-900 mb-2">Personal Information</h5>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {cvAnalysis.personalInfo.name && (
                    <div>
                      <span className="font-medium">Name:</span> {cvAnalysis.personalInfo.name}
                    </div>
                  )}
                  {cvAnalysis.personalInfo.email && (
                    <div>
                      <span className="font-medium">Email:</span> {cvAnalysis.personalInfo.email}
                    </div>
                  )}
                  {cvAnalysis.personalInfo.phone && (
                    <div>
                      <span className="font-medium">Phone:</span> {cvAnalysis.personalInfo.phone}
                    </div>
                  )}
                  {cvAnalysis.personalInfo.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{cvAnalysis.personalInfo.location}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Professional Summary */}
            {cvAnalysis.professionalSummary && (
              <div className="bg-white rounded-lg p-3 mb-3">
                <h5 className="font-medium text-gray-900 mb-2">Professional Summary</h5>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {cvAnalysis.professionalSummary.yearsOfExperience && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{cvAnalysis.professionalSummary.yearsOfExperience}</span>
                    </div>
                  )}
                  {cvAnalysis.professionalSummary.currentRole && (
                    <div>
                      <span className="font-medium">Role:</span> {cvAnalysis.professionalSummary.currentRole}
                    </div>
                  )}
                  {cvAnalysis.professionalSummary.seniorityLevel && (
                    <div>
                      <span className="font-medium">Level:</span> {cvAnalysis.professionalSummary.seniorityLevel}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Technical Skills */}
            {cvAnalysis.technicalExpertise?.programmingLanguages && (
              <div className="bg-white rounded-lg p-3 mb-3">
                <h5 className="font-medium text-gray-900 mb-2">Technical Skills from CV</h5>
                <div className="space-y-2">
                  {cvAnalysis.technicalExpertise.programmingLanguages.expert?.length > 0 && (
                    <div>
                      <span className="text-xs font-medium text-green-700 block mb-1">Expert Level:</span>
                      <div className="flex flex-wrap gap-1">
                        {cvAnalysis.technicalExpertise.programmingLanguages.expert.map((skill: string, index: number) => (
                          <Badge key={index} variant="secondary" className="bg-green-100 text-green-800 text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {cvAnalysis.technicalExpertise.programmingLanguages.proficient?.length > 0 && (
                    <div>
                      <span className="text-xs font-medium text-blue-700 block mb-1">Proficient:</span>
                      <div className="flex flex-wrap gap-1">
                        {cvAnalysis.technicalExpertise.programmingLanguages.proficient.map((skill: string, index: number) => (
                          <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Market Positioning */}
            {cvAnalysis.marketPositioning && (
              <div className="bg-white rounded-lg p-3">
                <h5 className="font-medium text-gray-900 mb-2">Market Positioning</h5>
                <div className="text-sm space-y-1">
                  {cvAnalysis.marketPositioning.hourlyRateEstimate && (
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span className="font-medium">Recommended Rate:</span>
                      <span className="text-green-600 font-semibold">
                        {cvAnalysis.marketPositioning.hourlyRateEstimate.recommended} {cvAnalysis.marketPositioning.hourlyRateEstimate.currency}/hour
                      </span>
                    </div>
                  )}
                  {cvAnalysis.marketPositioning.marketDemand && (
                    <div>
                      <span className="font-medium">Market Demand:</span> {cvAnalysis.marketPositioning.marketDemand}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* LinkedIn Analysis Section */}
        {linkedinAnalysis && cvAnalysis && (
          <Separator className="my-4" />
        )}
        
        {linkedinAnalysis && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Linkedin className="h-4 w-4 text-blue-600" />
              <h4 className="font-semibold text-blue-900">LinkedIn Analysis</h4>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-sm text-gray-600">LinkedIn profile analyzed and data integrated</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
