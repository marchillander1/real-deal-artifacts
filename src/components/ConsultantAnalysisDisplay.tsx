
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Brain, FileText, Linkedin, User, Briefcase, MapPin, Clock } from 'lucide-react';
import { Consultant } from '@/types/consultant';

interface ConsultantAnalysisDisplayProps {
  consultant: Consultant;
}

export const ConsultantAnalysisDisplay: React.FC<ConsultantAnalysisDisplayProps> = ({ consultant }) => {
  // Get analysis data with proper fallbacks - using correct property names
  const cvAnalysisData = consultant.cvAnalysis || consultant.cv_analysis_data;
  const cvAnalysis = cvAnalysisData?.analysis || cvAnalysisData;
  
  const linkedinAnalysisData = consultant.linkedinAnalysis || consultant.linkedin_analysis_data;
  const linkedinAnalysis = linkedinAnalysisData?.analysis || linkedinAnalysisData;

  console.log('🔍 Analysis Display - Data check:', {
    consultantName: consultant.name,
    hasCvAnalysis: !!cvAnalysis,
    hasLinkedinAnalysis: !!linkedinAnalysis,
    cvDataStructure: cvAnalysis ? Object.keys(cvAnalysis) : [],
    linkedinDataStructure: linkedinAnalysis ? Object.keys(linkedinAnalysis) : []
  });

  // If no analysis data, show message
  if (!cvAnalysis && !linkedinAnalysis) {
    return (
      <Card className="mt-4 border-gray-200 bg-gray-50">
        <CardContent className="p-4 text-center">
          <Brain className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">No analysis data available for this consultant</p>
          <p className="text-sm text-gray-500 mt-1">Analysis data may not have been generated yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-4 border-purple-200 bg-purple-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-purple-900">
          <Brain className="h-5 w-5" />
          AI Analysis Results for {consultant.name}
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
                <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Personal Information
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  {cvAnalysis.personalInfo.name && cvAnalysis.personalInfo.name !== 'Ej specificerat' && (
                    <div>
                      <span className="font-medium text-gray-700">Name:</span> 
                      <span className="ml-1">{cvAnalysis.personalInfo.name}</span>
                    </div>
                  )}
                  {cvAnalysis.personalInfo.email && cvAnalysis.personalInfo.email !== 'Ej specificerat' && (
                    <div>
                      <span className="font-medium text-gray-700">Email:</span> 
                      <span className="ml-1">{cvAnalysis.personalInfo.email}</span>
                    </div>
                  )}
                  {cvAnalysis.personalInfo.phone && cvAnalysis.personalInfo.phone !== 'Ej specificerat' && (
                    <div>
                      <span className="font-medium text-gray-700">Phone:</span> 
                      <span className="ml-1">{cvAnalysis.personalInfo.phone}</span>
                    </div>
                  )}
                  {cvAnalysis.personalInfo.location && cvAnalysis.personalInfo.location !== 'Ej specificerat' && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-gray-500" />
                      <span>{cvAnalysis.personalInfo.location}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Experience from CV */}
            {cvAnalysis.experience && (
              <div className="bg-white rounded-lg p-3 mb-3">
                <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Experience Summary
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  {cvAnalysis.experience.years && cvAnalysis.experience.years !== 'Ej specificerat' && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-gray-500" />
                      <span className="font-medium text-gray-700">Experience:</span>
                      <span className="ml-1">{cvAnalysis.experience.years}</span>
                    </div>
                  )}
                  {cvAnalysis.experience.currentRole && cvAnalysis.experience.currentRole !== 'Ej specificerat' && (
                    <div>
                      <span className="font-medium text-gray-700">Current Role:</span> 
                      <span className="ml-1">{cvAnalysis.experience.currentRole}</span>
                    </div>
                  )}
                  {cvAnalysis.experience.level && cvAnalysis.experience.level !== 'Ej specificerat' && (
                    <div>
                      <span className="font-medium text-gray-700">Level:</span> 
                      <span className="ml-1">{cvAnalysis.experience.level}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Skills from CV */}
            {cvAnalysis.skills && (
              <div className="bg-white rounded-lg p-3 mb-3">
                <h5 className="font-medium text-gray-900 mb-2">Skills from CV</h5>
                <div className="space-y-3">
                  {cvAnalysis.skills.technical?.length > 0 && (
                    <div>
                      <span className="text-xs font-medium text-blue-700 block mb-1">Technical Skills:</span>
                      <div className="flex flex-wrap gap-1">
                        {cvAnalysis.skills.technical.map((skill: string, index: number) => (
                          skill !== 'Ej specificerat' && (
                            <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                              {skill}
                            </Badge>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                  {cvAnalysis.skills.languages?.length > 0 && (
                    <div>
                      <span className="text-xs font-medium text-green-700 block mb-1">Programming Languages:</span>
                      <div className="flex flex-wrap gap-1">
                        {cvAnalysis.skills.languages.map((lang: string, index: number) => (
                          lang !== 'Ej specificerat' && (
                            <Badge key={index} variant="secondary" className="bg-green-100 text-green-800 text-xs">
                              {lang}
                            </Badge>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                  {cvAnalysis.skills.tools?.length > 0 && (
                    <div>
                      <span className="text-xs font-medium text-purple-700 block mb-1">Tools & Technologies:</span>
                      <div className="flex flex-wrap gap-1">
                        {cvAnalysis.skills.tools.map((tool: string, index: number) => (
                          tool !== 'Ej specificerat' && (
                            <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-800 text-xs">
                              {tool}
                            </Badge>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Work History from CV */}
            {cvAnalysis.workHistory && cvAnalysis.workHistory.length > 0 && (
              <div className="bg-white rounded-lg p-3 mb-3">
                <h5 className="font-medium text-gray-900 mb-2">Work History</h5>
                <div className="space-y-2">
                  {cvAnalysis.workHistory.slice(0, 3).map((work: any, index: number) => (
                    work.role !== 'Ej specificerat' && work.company !== 'Ej specificerat' && (
                      <div key={index} className="border border-gray-200 rounded p-2 text-xs">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-gray-900">{work.role || 'Role not specified'}</span>
                          <span className="text-gray-500">{work.duration || ''}</span>
                        </div>
                        <p className="text-gray-600">{work.company || 'Company not specified'}</p>
                        {work.description && (
                          <p className="text-gray-500 mt-1">{work.description.substring(0, 100)}...</p>
                        )}
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* LinkedIn Analysis Section */}
        {linkedinAnalysis && (
          <>
            <Separator className="my-4" />
            
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Linkedin className="h-4 w-4 text-blue-600" />
                <h4 className="font-semibold text-blue-900">LinkedIn Analysis</h4>
              </div>
              
              {/* Professional Profile from LinkedIn */}
              <div className="bg-white rounded-lg p-3 mb-3">
                <h5 className="font-medium text-gray-900 mb-2">Professional Profile</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {linkedinAnalysis.communicationStyle && (
                    <div>
                      <span className="font-medium text-gray-700">Communication Style:</span>
                      <p className="text-gray-600 mt-1">{linkedinAnalysis.communicationStyle}</p>
                    </div>
                  )}
                  {linkedinAnalysis.leadershipStyle && (
                    <div>
                      <span className="font-medium text-gray-700">Leadership Style:</span>
                      <p className="text-gray-600 mt-1">{linkedinAnalysis.leadershipStyle}</p>
                    </div>
                  )}
                </div>
                
                {/* Scores */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 pt-3 border-t border-gray-200">
                  {linkedinAnalysis.innovation && (
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{linkedinAnalysis.innovation}/5</div>
                      <div className="text-xs text-gray-600">Innovation</div>
                    </div>
                  )}
                  {linkedinAnalysis.leadership && (
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{linkedinAnalysis.leadership}/5</div>
                      <div className="text-xs text-gray-600">Leadership</div>
                    </div>
                  )}
                  {linkedinAnalysis.adaptability && (
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">{linkedinAnalysis.adaptability}/5</div>
                      <div className="text-xs text-gray-600">Adaptability</div>
                    </div>
                  )}
                  {linkedinAnalysis.culturalFit && (
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-600">{linkedinAnalysis.culturalFit}/5</div>
                      <div className="text-xs text-gray-600">Cultural Fit</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Market Positioning from LinkedIn */}
              {linkedinAnalysis.marketPositioning && (
                <div className="bg-white rounded-lg p-3 mb-3">
                  <h5 className="font-medium text-gray-900 mb-2">Market Positioning</h5>
                  <div className="text-sm space-y-2">
                    {linkedinAnalysis.marketPositioning.uniqueValueProposition && (
                      <div>
                        <span className="font-medium text-gray-700">Value Proposition:</span>
                        <p className="text-gray-600 mt-1">{linkedinAnalysis.marketPositioning.uniqueValueProposition}</p>
                      </div>
                    )}
                    {linkedinAnalysis.marketPositioning.competitiveAdvantages?.length > 0 && (
                      <div>
                        <span className="font-medium text-gray-700">Competitive Advantages:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {linkedinAnalysis.marketPositioning.competitiveAdvantages.map((advantage: string, index: number) => (
                            <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                              {advantage}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Raw Data Debug Section */}
        <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
          <details>
            <summary className="cursor-pointer font-medium text-gray-700">Debug: Raw Analysis Data</summary>
            <div className="mt-2 space-y-2">
              <div>
                <strong>CV Analysis Structure:</strong>
                <pre className="text-xs bg-white p-2 rounded mt-1 overflow-auto">
                  {JSON.stringify(cvAnalysis ? Object.keys(cvAnalysis) : 'No data', null, 2)}
                </pre>
              </div>
              <div>
                <strong>LinkedIn Analysis Structure:</strong>
                <pre className="text-xs bg-white p-2 rounded mt-1 overflow-auto">
                  {JSON.stringify(linkedinAnalysis ? Object.keys(linkedinAnalysis) : 'No data', null, 2)}
                </pre>
              </div>
            </div>
          </details>
        </div>
      </CardContent>
    </Card>
  );
};
