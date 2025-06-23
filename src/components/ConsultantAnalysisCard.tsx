
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Users, Target, TrendingUp, Star, Award, Heart, Code, CheckCircle, Mail, Phone, MapPin, Globe, DollarSign } from 'lucide-react';
import { Consultant } from '@/types/consultant';

interface ConsultantAnalysisCardProps {
  consultant: Consultant;
}

export const ConsultantAnalysisCard: React.FC<ConsultantAnalysisCardProps> = ({ consultant }) => {
  console.log('ConsultantAnalysisCard rendering for:', consultant.name, {
    cvAnalysis: consultant.cvAnalysis,
    linkedinAnalysis: consultant.linkedinAnalysis
  });

  const cvAnalysis = consultant.cvAnalysis;
  const linkedinAnalysis = consultant.linkedinAnalysis;

  // Calculate scores for display
  const culturalMatch = consultant.culturalFit ? Math.round((consultant.culturalFit / 5) * 100) : 85;
  const leadershipScore = consultant.leadership ? Math.round((consultant.leadership / 5) * 100) : 80;
  const adaptabilityScore = consultant.adaptability ? Math.round((consultant.adaptability / 5) * 100) : 90;

  return (
    <div className="space-y-6 bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-lg border">
      {/* Contact Information */}
      {(cvAnalysis?.personalInfo || consultant.email) && (
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Mail className="h-4 w-4 text-blue-500" />
            Kontaktinformation
          </h5>
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            {(cvAnalysis?.personalInfo?.email || consultant.email) && (
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3 text-gray-500" />
                <span>{cvAnalysis?.personalInfo?.email || consultant.email}</span>
              </div>
            )}
            {(cvAnalysis?.personalInfo?.phone || consultant.phone) && (
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3 text-gray-500" />
                <span>{cvAnalysis?.personalInfo?.phone || consultant.phone}</span>
              </div>
            )}
            {(cvAnalysis?.personalInfo?.location || consultant.location) && (
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3 text-gray-500" />
                <span>{cvAnalysis?.personalInfo?.location || consultant.location}</span>
              </div>
            )}
            {consultant.linkedinUrl && (
              <div className="flex items-center gap-2">
                <Globe className="h-3 w-3 text-gray-500" />
                <a 
                  href={consultant.linkedinUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  LinkedIn Profil
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Experience Summary */}
      {cvAnalysis?.experience && (
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" />
            Erfarenhetssammanfattning
          </h5>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            {cvAnalysis.experience.years && cvAnalysis.experience.years !== 'Ej specificerat' && (
              <div>
                <span className="text-gray-600">Erfarenhet:</span>
                <p className="font-semibold text-green-600">{cvAnalysis.experience.years}</p>
              </div>
            )}
            {cvAnalysis.experience.level && cvAnalysis.experience.level !== 'Ej specificerat' && (
              <div>
                <span className="text-gray-600">Senioritetsnivå:</span>
                <p className="font-semibold text-blue-600">{cvAnalysis.experience.level}</p>
              </div>
            )}
            {cvAnalysis.experience.currentRole && cvAnalysis.experience.currentRole !== 'Ej specificerat' && (
              <div className="md:col-span-2">
                <span className="text-gray-600">Nuvarande roll:</span>
                <p className="font-semibold">{cvAnalysis.experience.currentRole}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Market Rate Information */}
      {(consultant.market_rate_current || consultant.market_rate_optimized) && (
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-500" />
            Marknadsposition & Timpris
          </h5>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {consultant.market_rate_current && (
              <div className="text-center p-3 bg-green-50 rounded border border-green-200">
                <p className="text-gray-600">Nuvarande marknadspris</p>
                <p className="text-lg font-bold text-green-600">{consultant.market_rate_current} SEK/h</p>
              </div>
            )}
            {consultant.market_rate_optimized && (
              <div className="text-center p-3 bg-blue-50 rounded border border-blue-200">
                <p className="text-gray-600">Optimerat pris</p>
                <p className="text-lg font-bold text-blue-600">{consultant.market_rate_optimized} SEK/h</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Technical Skills */}
      {cvAnalysis?.skills && (
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Code className="h-4 w-4 text-purple-500" />
            Teknisk expertis
          </h5>
          <div className="space-y-4">
            {cvAnalysis.skills.technical?.length > 0 && (
              <div>
                <span className="text-xs font-medium text-blue-700 block mb-2">Tekniska färdigheter ({cvAnalysis.skills.technical.length}):</span>
                <div className="flex flex-wrap gap-1">
                  {cvAnalysis.skills.technical.map((skill: string, index: number) => (
                    skill !== 'Ej specificerat' && (
                      <Badge key={index} className="bg-blue-100 text-blue-800 text-xs border-blue-200">{skill}</Badge>
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
                      <Badge key={index} className="bg-green-100 text-green-800 text-xs border-green-200">{lang}</Badge>
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
                      <Badge key={index} className="bg-purple-100 text-purple-800 text-xs border-purple-200">{tool}</Badge>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Work History */}
      {cvAnalysis?.workHistory && cvAnalysis.workHistory.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h5 className="font-semibold text-gray-900 mb-3">Arbetshistorik ({cvAnalysis.workHistory.length} positioner)</h5>
          <div className="space-y-3">
            {cvAnalysis.workHistory.slice(0, 3).map((work: any, index: number) => (
              work.role !== 'Ej specificerat' && work.company !== 'Ej specificerat' && (
                <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-gray-900">{work.role || 'Roll ej specificerad'}</span>
                    <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">{work.duration || ''}</span>
                  </div>
                  <p className="text-sm text-gray-700 font-medium">{work.company || 'Företag ej specificerat'}</p>
                  {work.description && work.description !== 'Ej specificerat' && (
                    <p className="text-xs text-gray-600 mt-2 line-clamp-2">{work.description.substring(0, 100)}...</p>
                  )}
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {/* LinkedIn Analysis */}
      {linkedinAnalysis && (
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Brain className="h-4 w-4 text-blue-500" />
            LinkedIn-analys
          </h5>
          <div className="space-y-3">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              {linkedinAnalysis.communicationStyle && (
                <div>
                  <span className="text-gray-600">Kommunikationsstil:</span>
                  <p className="font-medium">{linkedinAnalysis.communicationStyle}</p>
                </div>
              )}
              {linkedinAnalysis.leadershipStyle && (
                <div>
                  <span className="text-gray-600">Ledarskapsformat:</span>
                  <p className="font-medium">{linkedinAnalysis.leadershipStyle}</p>
                </div>
              )}
            </div>
            
            {/* Scoring */}
            <div className="bg-gray-50 p-3 rounded space-y-2">
              <h6 className="font-medium text-gray-800 mb-2">Bedömning</h6>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {linkedinAnalysis.culturalFit && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Kulturell passform:</span>
                    <div className="flex items-center gap-2">
                      <Progress value={culturalMatch} className="w-16 h-2" />
                      <span className="text-xs font-semibold text-blue-600">{linkedinAnalysis.culturalFit}/5</span>
                    </div>
                  </div>
                )}
                
                {linkedinAnalysis.leadership && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Ledarskap:</span>
                    <div className="flex items-center gap-2">
                      <Progress value={leadershipScore} className="w-16 h-2" />
                      <span className="text-xs font-semibold text-blue-600">{linkedinAnalysis.leadership}/5</span>
                    </div>
                  </div>
                )}
                
                {linkedinAnalysis.innovation && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Innovation:</span>
                    <div className="flex items-center gap-2">
                      <Progress value={(linkedinAnalysis.innovation || 4) * 20} className="w-16 h-2" />
                      <span className="text-xs font-semibold text-blue-600">{linkedinAnalysis.innovation || 4}/5</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Certifications & Languages */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Award className="h-4 w-4 text-yellow-500" />
            Certifieringar
          </h5>
          <div className="space-y-1">
            {(consultant.certifications || []).slice(0, 4).map((cert: string, idx: number) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>{cert}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Globe className="h-4 w-4 text-blue-500" />
            Språk
          </h5>
          <div className="flex flex-wrap gap-2">
            {(consultant.languages || ['Swedish', 'English']).map((lang: string, idx: number) => (
              <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                {lang}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Values & Personality */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Heart className="h-4 w-4 text-red-500" />
            Värderingar
          </h5>
          <div className="flex flex-wrap gap-2">
            {(consultant.values || ['Innovation', 'Kvalitet', 'Teamwork']).map((value: string, idx: number) => (
              <Badge key={idx} variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
                {value}
              </Badge>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Brain className="h-4 w-4 text-purple-500" />
            Personlighetsdrag
          </h5>
          <div className="flex flex-wrap gap-2">
            {(consultant.personalityTraits || ['Samarbetsvillig', 'Detaljfokuserad', 'Proaktiv']).map((trait: string, idx: number) => (
              <Badge key={idx} variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
                {trait}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
