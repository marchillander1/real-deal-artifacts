
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Brain, FileText, Linkedin, User, Briefcase, MapPin, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Consultant } from '@/types/consultant';

interface ConsultantAnalysisDisplayProps {
  consultant: Consultant;
}

export const ConsultantAnalysisDisplay: React.FC<ConsultantAnalysisDisplayProps> = ({ consultant }) => {
  // Get analysis data with standardized structure
  const cvAnalysis = consultant.cvAnalysis;
  const linkedinAnalysis = consultant.linkedinAnalysis;

  console.log('🔍 Enhanced Analysis Display - Data structure check:', {
    consultantName: consultant.name,
    hasCvAnalysis: !!cvAnalysis,
    hasLinkedinAnalysis: !!linkedinAnalysis,
    cvDataValid: !!(cvAnalysis?.personalInfo && cvAnalysis?.experience),
    linkedinDataValid: !!(linkedinAnalysis?.communicationStyle)
  });

  // Enhanced validation for analysis data
  const hasValidCvData = cvAnalysis && cvAnalysis.personalInfo && cvAnalysis.experience;
  const hasValidLinkedinData = linkedinAnalysis && linkedinAnalysis.communicationStyle;

  if (!hasValidCvData && !hasValidLinkedinData) {
    return (
      <Card className="mt-4 border-orange-200 bg-orange-50">
        <CardContent className="p-4 text-center">
          <AlertCircle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
          <p className="text-orange-700 font-medium">Ingen analysdata tillgänglig</p>
          <p className="text-sm text-orange-600 mt-1">Analysdata kanske inte har genererats än eller strukturen behöver uppdateras</p>
        </CardContent>
      </Card>
    );
  }

  // Data quality indicators
  const getDataQuality = () => {
    let score = 0;
    if (cvAnalysis?.personalInfo?.name !== 'Ej specificerat') score += 25;
    if (cvAnalysis?.personalInfo?.email !== 'Ej specificerat' && cvAnalysis?.personalInfo?.email?.includes('@')) score += 25;
    if (cvAnalysis?.skills?.technical?.length > 0) score += 25;
    if (cvAnalysis?.experience?.years !== 'Ej specificerat') score += 25;
    return score;
  };

  const dataQuality = getDataQuality();

  return (
    <Card className="mt-4 border-purple-200 bg-purple-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-purple-900">
          <Brain className="h-5 w-5" />
          Förbättrad AI-analys för {consultant.name}
          <div className="ml-auto flex items-center gap-2">
            <Badge variant={dataQuality >= 75 ? "default" : dataQuality >= 50 ? "secondary" : "destructive"} className="text-xs">
              {dataQuality >= 75 ? "Hög kvalitet" : dataQuality >= 50 ? "Medel kvalitet" : "Låg kvalitet"}
            </Badge>
            <span className="text-sm text-purple-700">{dataQuality}%</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* CV Analysis Section */}
        {hasValidCvData && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-blue-600" />
              <h4 className="font-semibold text-blue-900">CV-analys</h4>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            
            {/* Enhanced Personal Info Display */}
            <div className="bg-white rounded-lg p-4 mb-3 border border-blue-100">
              <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <User className="h-4 w-4" />
                Personlig information
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {cvAnalysis.personalInfo.name && cvAnalysis.personalInfo.name !== 'Ej specificerat' && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700 min-w-[60px]">Namn:</span> 
                    <span className="text-gray-900">{cvAnalysis.personalInfo.name}</span>
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  </div>
                )}
                {cvAnalysis.personalInfo.email && cvAnalysis.personalInfo.email !== 'Ej specificerat' && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700 min-w-[60px]">Email:</span> 
                    <span className="text-gray-900">{cvAnalysis.personalInfo.email}</span>
                    {cvAnalysis.personalInfo.email.includes('@') ? 
                      <CheckCircle className="h-3 w-3 text-green-500" /> : 
                      <AlertCircle className="h-3 w-3 text-orange-500" />
                    }
                  </div>
                )}
                {cvAnalysis.personalInfo.phone && cvAnalysis.personalInfo.phone !== 'Ej specificerat' && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700 min-w-[60px]">Telefon:</span> 
                    <span className="text-gray-900">{cvAnalysis.personalInfo.phone}</span>
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  </div>
                )}
                {cvAnalysis.personalInfo.location && cvAnalysis.personalInfo.location !== 'Ej specificerat' && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-gray-500" />
                    <span className="text-gray-900">{cvAnalysis.personalInfo.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Experience Display */}
            <div className="bg-white rounded-lg p-4 mb-3 border border-blue-100">
              <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Erfarenhetssammanfattning
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {cvAnalysis.experience.years && cvAnalysis.experience.years !== 'Ej specificerat' && (
                  <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                    <Clock className="h-3 w-3 text-blue-500" />
                    <div>
                      <span className="text-xs text-blue-700 block">Erfarenhet</span>
                      <span className="font-medium text-blue-900">{cvAnalysis.experience.years}</span>
                    </div>
                  </div>
                )}
                {cvAnalysis.experience.currentRole && cvAnalysis.experience.currentRole !== 'Ej specificerat' && (
                  <div className="p-2 bg-green-50 rounded">
                    <span className="text-xs text-green-700 block">Senaste roll</span>
                    <span className="font-medium text-green-900">{cvAnalysis.experience.currentRole}</span>
                  </div>
                )}
                {cvAnalysis.experience.level && cvAnalysis.experience.level !== 'Ej specificerat' && (
                  <div className="p-2 bg-purple-50 rounded">
                    <span className="text-xs text-purple-700 block">Nivå</span>
                    <span className="font-medium text-purple-900">{cvAnalysis.experience.level}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Skills Display */}
            {cvAnalysis.skills && (
              <div className="bg-white rounded-lg p-4 mb-3 border border-blue-100">
                <h5 className="font-medium text-gray-900 mb-3">Kompetenser från CV</h5>
                <div className="space-y-4">
                  {cvAnalysis.skills.technical?.length > 0 && (
                    <div>
                      <span className="text-xs font-medium text-blue-700 block mb-2">Tekniska färdigheter ({cvAnalysis.skills.technical.length}):</span>
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
                      <span className="text-xs font-medium text-green-700 block mb-2">Programmeringsspråk ({cvAnalysis.skills.languages.length}):</span>
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
                      <span className="text-xs font-medium text-purple-700 block mb-2">Verktyg & teknologier ({cvAnalysis.skills.tools.length}):</span>
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

            {/* Enhanced Work History Display */}
            {cvAnalysis.workHistory && cvAnalysis.workHistory.length > 0 && (
              <div className="bg-white rounded-lg p-4 mb-3 border border-blue-100">
                <h5 className="font-medium text-gray-900 mb-3">Arbetshistorik ({cvAnalysis.workHistory.length} positioner)</h5>
                <div className="space-y-3">
                  {cvAnalysis.workHistory.slice(0, 4).map((work: any, index: number) => (
                    work.role !== 'Ej specificerat' && work.company !== 'Ej specificerat' && (
                      <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-gray-900">{work.role || 'Roll ej specificerad'}</span>
                          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">{work.duration || ''}</span>
                        </div>
                        <p className="text-sm text-gray-700 font-medium">{work.company || 'Företag ej specificerat'}</p>
                        {work.description && work.description !== 'Ej specificerat' && (
                          <p className="text-xs text-gray-600 mt-2 line-clamp-2">{work.description.substring(0, 150)}...</p>
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
        {hasValidLinkedinData && (
          <>
            <Separator className="my-4" />
            
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Linkedin className="h-4 w-4 text-blue-600" />
                <h4 className="font-semibold text-blue-900">LinkedIn-analys</h4>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              
              {/* Enhanced Professional Profile */}
              <div className="bg-white rounded-lg p-4 mb-3 border border-blue-100">
                <h5 className="font-medium text-gray-900 mb-3">Professionell profil</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {linkedinAnalysis.communicationStyle && (
                    <div className="p-3 bg-blue-50 rounded">
                      <span className="font-medium text-blue-800 block">Kommunikationsstil:</span>
                      <p className="text-blue-700 text-sm mt-1">{linkedinAnalysis.communicationStyle}</p>
                    </div>
                  )}
                  {linkedinAnalysis.leadershipStyle && (
                    <div className="p-3 bg-green-50 rounded">
                      <span className="font-medium text-green-800 block">Ledarskapssstil:</span>
                      <p className="text-green-700 text-sm mt-1">{linkedinAnalysis.leadershipStyle}</p>
                    </div>
                  )}
                </div>
                
                {/* Enhanced Scores Display */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-3 border-t border-gray-200">
                  {linkedinAnalysis.innovation && (
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="text-xl font-bold text-blue-600">{linkedinAnalysis.innovation}/5</div>
                      <div className="text-xs text-blue-700">Innovation</div>
                    </div>
                  )}
                  {linkedinAnalysis.leadership && (
                    <div className="text-center p-2 bg-green-50 rounded">
                      <div className="text-xl font-bold text-green-600">{linkedinAnalysis.leadership}/5</div>
                      <div className="text-xs text-green-700">Ledarskap</div>
                    </div>
                  )}
                  {linkedinAnalysis.adaptability && (
                    <div className="text-center p-2 bg-purple-50 rounded">
                      <div className="text-xl font-bold text-purple-600">{linkedinAnalysis.adaptability}/5</div>
                      <div className="text-xs text-purple-700">Anpassningsförmåga</div>
                    </div>
                  )}
                  {linkedinAnalysis.culturalFit && (
                    <div className="text-center p-2 bg-orange-50 rounded">
                      <div className="text-xl font-bold text-orange-600">{linkedinAnalysis.culturalFit}/5</div>
                      <div className="text-xs text-orange-700">Kulturell passform</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Market Positioning */}
              {linkedinAnalysis.marketPositioning && (
                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <h5 className="font-medium text-gray-900 mb-3">Marknadspositionering</h5>
                  <div className="space-y-3">
                    {linkedinAnalysis.marketPositioning.uniqueValueProposition && (
                      <div className="p-3 bg-indigo-50 rounded">
                        <span className="font-medium text-indigo-800 block">Unikt värdeförslag:</span>
                        <p className="text-indigo-700 text-sm mt-1">{linkedinAnalysis.marketPositioning.uniqueValueProposition}</p>
                      </div>
                    )}
                    {linkedinAnalysis.marketPositioning.competitiveAdvantages?.length > 0 && (
                      <div>
                        <span className="font-medium text-gray-700 block mb-2">Konkurrensfördelar:</span>
                        <div className="flex flex-wrap gap-1">
                          {linkedinAnalysis.marketPositioning.competitiveAdvantages.map((advantage: string, index: number) => (
                            <Badge key={index} variant="secondary" className="bg-indigo-100 text-indigo-800 text-xs">
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

        {/* Enhanced Analysis Summary */}
        <div className="mt-4 p-3 bg-purple-100 rounded-lg">
          <h6 className="font-medium text-purple-900 mb-2">Analyssammanfattning</h6>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div className="text-center">
              <div className="font-bold text-purple-800">{dataQuality}%</div>
              <div className="text-purple-700">Datakvalitet</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-purple-800">{hasValidCvData ? '✓' : '✗'}</div>
              <div className="text-purple-700">CV-data</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-purple-800">{hasValidLinkedinData ? '✓' : '✗'}</div>
              <div className="text-purple-700">LinkedIn-data</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-purple-800">v2.0</div>
              <div className="text-purple-700">Förbättrad</div>
            </div>
          </div>
        </div>

        {/* Debug section for development */}
        <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
          <details>
            <summary className="cursor-pointer font-medium text-gray-700">Debug: Analysstruktur</summary>
            <div className="mt-2 space-y-2">
              <div>
                <strong>CV-analysstruktur:</strong>
                <pre className="text-xs bg-white p-2 rounded mt-1 overflow-auto max-h-32">
                  {JSON.stringify(cvAnalysis ? {
                    hasPersonalInfo: !!cvAnalysis.personalInfo,
                    hasExperience: !!cvAnalysis.experience,
                    hasSkills: !!cvAnalysis.skills,
                    workHistoryCount: cvAnalysis.workHistory?.length || 0
                  } : 'Ingen data', null, 2)}
                </pre>
              </div>
              <div>
                <strong>LinkedIn-analysstruktur:</strong>
                <pre className="text-xs bg-white p-2 rounded mt-1 overflow-auto max-h-32">
                  {JSON.stringify(linkedinAnalysis ? {
                    hasCommunicationStyle: !!linkedinAnalysis.communicationStyle,
                    hasMarketPositioning: !!linkedinAnalysis.marketPositioning,
                    scoresAvailable: !!(linkedinAnalysis.innovation || linkedinAnalysis.leadership)
                  } : 'Ingen data', null, 2)}
                </pre>
              </div>
            </div>
          </details>
        </div>
      </CardContent>
    </Card>
  );
};
