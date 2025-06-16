
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
            {(cvAnalysis?.personalInfo?.linkedinProfile || consultant.linkedinUrl) && (
              <div className="flex items-center gap-2">
                <Globe className="h-3 w-3 text-gray-500" />
                <a 
                  href={cvAnalysis?.personalInfo?.linkedinProfile || consultant.linkedinUrl} 
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

      {/* Professional Summary */}
      {cvAnalysis?.professionalSummary && (
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" />
            Professionell sammanfattning
          </h5>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Senioritetsnivå:</span>
              <p className="font-semibold text-blue-600">{cvAnalysis.professionalSummary.seniorityLevel}</p>
            </div>
            <div>
              <span className="text-gray-600">Erfarenhet:</span>
              <p className="font-semibold text-green-600">{cvAnalysis.professionalSummary.yearsOfExperience}</p>
            </div>
            {cvAnalysis.professionalSummary.currentRole && (
              <div>
                <span className="text-gray-600">Nuvarande roll:</span>
                <p className="font-semibold">{cvAnalysis.professionalSummary.currentRole}</p>
              </div>
            )}
            {cvAnalysis.professionalSummary.careerTrajectory && (
              <div>
                <span className="text-gray-600">Karriärutveckling:</span>
                <p className="font-semibold text-green-600">{cvAnalysis.professionalSummary.careerTrajectory}</p>
              </div>
            )}
          </div>
          {cvAnalysis.professionalSummary.uniqueValueProposition && (
            <div className="mt-3 p-3 bg-blue-50 rounded">
              <p className="text-sm italic text-blue-800">{cvAnalysis.professionalSummary.uniqueValueProposition}</p>
            </div>
          )}
        </div>
      )}

      {/* Market Position & Hourly Rate */}
      {cvAnalysis?.marketPositioning && (
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-500" />
            Marknadsposition & Timpris
          </h5>
          <div className="space-y-3">
            {cvAnalysis.marketPositioning.hourlyRateEstimate && (
              <div className="bg-green-50 p-3 rounded border border-green-200">
                <h6 className="font-semibold text-green-800 mb-2">Rekommenderat timpris</h6>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="text-center">
                    <p className="text-gray-600">Minimum</p>
                    <p className="text-lg font-bold text-green-600">{cvAnalysis.marketPositioning.hourlyRateEstimate.min} SEK</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Rekommenderat</p>
                    <p className="text-xl font-bold text-green-700">{cvAnalysis.marketPositioning.hourlyRateEstimate.recommended} SEK</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Maximum</p>
                    <p className="text-lg font-bold text-green-600">{cvAnalysis.marketPositioning.hourlyRateEstimate.max} SEK</p>
                  </div>
                </div>
              </div>
            )}
            
            {cvAnalysis.marketPositioning.uniqueValueProposition && (
              <div>
                <span className="text-sm text-gray-600">Unik värdeproposition:</span>
                <p className="text-sm font-medium">{cvAnalysis.marketPositioning.uniqueValueProposition}</p>
              </div>
            )}
            
            {cvAnalysis.marketPositioning.competitiveness && (
              <div>
                <span className="text-sm text-gray-600">Konkurrenskraft:</span>
                <p className="text-sm font-semibold text-green-600">{cvAnalysis.marketPositioning.competitiveness}</p>
              </div>
            )}

            {cvAnalysis.careerPotential?.currentLevel && (
              <div>
                <span className="text-sm text-gray-600">Nuvarande nivå:</span>
                <p className="text-sm font-semibold text-blue-600">{cvAnalysis.careerPotential.currentLevel}</p>
              </div>
            )}

            {cvAnalysis.careerPotential?.nextCareerSteps?.length > 0 && (
              <div>
                <span className="text-sm text-gray-600">Nästa karriärsteg:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {cvAnalysis.careerPotential.nextCareerSteps.slice(0, 3).map((step: string, idx: number) => (
                    <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">{step}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {cvAnalysis.marketPositioning.salaryBenchmarks && (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {cvAnalysis.marketPositioning.salaryBenchmarks.stockholm && (
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <p className="text-xs text-gray-600">Stockholm</p>
                    <p className="text-xs font-bold text-blue-600">{cvAnalysis.marketPositioning.salaryBenchmarks.stockholm}</p>
                  </div>
                )}
                {cvAnalysis.marketPositioning.salaryBenchmarks.gothenburg && (
                  <div className="text-center p-2 bg-green-50 rounded">
                    <p className="text-xs text-gray-600">Göteborg</p>
                    <p className="text-xs font-bold text-green-600">{cvAnalysis.marketPositioning.salaryBenchmarks.gothenburg}</p>
                  </div>
                )}
                {cvAnalysis.marketPositioning.salaryBenchmarks.remote && (
                  <div className="text-center p-2 bg-purple-50 rounded">
                    <p className="text-xs text-gray-600">Remote</p>
                    <p className="text-xs font-bold text-purple-600">{cvAnalysis.marketPositioning.salaryBenchmarks.remote}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Technical Skills */}
      {cvAnalysis?.technicalSkillsAnalysis && (
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Code className="h-4 w-4 text-purple-500" />
            Teknisk expertis
          </h5>
          <div className="space-y-4">
            {cvAnalysis.technicalSkillsAnalysis.programmingLanguages && (
              <div>
                <h6 className="font-medium text-gray-800 mb-2">Programmeringsspråk</h6>
                <div className="space-y-2">
                  {cvAnalysis.technicalSkillsAnalysis.programmingLanguages.expert?.length > 0 && (
                    <div>
                      <span className="text-xs font-medium text-green-700">Expert:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {cvAnalysis.technicalSkillsAnalysis.programmingLanguages.expert.map((skill: string, idx: number) => (
                          <Badge key={idx} className="bg-green-100 text-green-800 text-xs border-green-200">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {cvAnalysis.technicalSkillsAnalysis.programmingLanguages.proficient?.length > 0 && (
                    <div>
                      <span className="text-xs font-medium text-blue-700">Skicklig:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {cvAnalysis.technicalSkillsAnalysis.programmingLanguages.proficient.map((skill: string, idx: number) => (
                          <Badge key={idx} className="bg-blue-100 text-blue-800 text-xs border-blue-200">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {cvAnalysis.technicalSkillsAnalysis.programmingLanguages.familiar?.length > 0 && (
                    <div>
                      <span className="text-xs font-medium text-gray-700">Bekant:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {cvAnalysis.technicalSkillsAnalysis.programmingLanguages.familiar.map((skill: string, idx: number) => (
                          <Badge key={idx} className="bg-gray-100 text-gray-800 text-xs border-gray-200">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {cvAnalysis.technicalSkillsAnalysis.frontendTechnologies?.frameworks?.length > 0 && (
              <div>
                <span className="text-xs font-medium text-purple-700">Frontend:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {cvAnalysis.technicalSkillsAnalysis.frontendTechnologies.frameworks.map((tech: string, idx: number) => (
                    <Badge key={idx} className="bg-purple-100 text-purple-800 text-xs border-purple-200">{tech}</Badge>
                  ))}
                </div>
              </div>
            )}

            {cvAnalysis.technicalSkillsAnalysis.backendTechnologies?.frameworks?.length > 0 && (
              <div>
                <span className="text-xs font-medium text-orange-700">Backend:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {cvAnalysis.technicalSkillsAnalysis.backendTechnologies.frameworks.map((tech: string, idx: number) => (
                    <Badge key={idx} className="bg-orange-100 text-orange-800 text-xs border-orange-200">{tech}</Badge>
                  ))}
                </div>
              </div>
            )}

            {cvAnalysis.technicalSkillsAnalysis.cloudAndInfrastructure?.platforms?.length > 0 && (
              <div>
                <span className="text-xs font-medium text-cyan-700">Cloud & Infrastructure:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {cvAnalysis.technicalSkillsAnalysis.cloudAndInfrastructure.platforms.map((platform: string, idx: number) => (
                    <Badge key={idx} className="bg-cyan-100 text-cyan-800 text-xs border-cyan-200">{platform}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Leadership & Soft Skills */}
      {(linkedinAnalysis || cvAnalysis?.leadershipCapabilities) && (
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Brain className="h-4 w-4 text-blue-500" />
            Ledarskap & Soft Skills
          </h5>
          {linkedinAnalysis && (
            <div className="space-y-3">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Kommunikationsstil:</span>
                  <p className="font-medium">{linkedinAnalysis.communicationStyle}</p>
                </div>
                <div>
                  <span className="text-gray-600">Ledarskapsformat:</span>
                  <p className="font-medium">{linkedinAnalysis.leadershipStyle}</p>
                </div>
                <div>
                  <span className="text-gray-600">Problemlösning:</span>
                  <p className="font-medium">{linkedinAnalysis.problemSolving}</p>
                </div>
                <div>
                  <span className="text-gray-600">Affärsförståelse:</span>
                  <p className="font-medium">{linkedinAnalysis.businessAcumen}</p>
                </div>
              </div>
              
              {/* Scoring */}
              <div className="bg-gray-50 p-3 rounded space-y-2">
                <h6 className="font-medium text-gray-800 mb-2">Bedömning</h6>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Kulturell passform:</span>
                    <div className="flex items-center gap-2">
                      <Progress value={culturalMatch} className="w-16 h-2" />
                      <span className="text-xs font-semibold text-blue-600">{linkedinAnalysis.culturalFit}/5</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Ledarskap:</span>
                    <div className="flex items-center gap-2">
                      <Progress value={leadershipScore} className="w-16 h-2" />
                      <span className="text-xs font-semibold text-blue-600">{linkedinAnalysis.leadership}/5</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Innovation:</span>
                    <div className="flex items-center gap-2">
                      <Progress value={(linkedinAnalysis.innovation || 4) * 20} className="w-16 h-2" />
                      <span className="text-xs font-semibold text-blue-600">{linkedinAnalysis.innovation || 4}/5</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {cvAnalysis?.leadershipCapabilities && (
            <div className="mt-4 space-y-3">
              <h6 className="font-medium text-gray-800">Ledarskapsförmågor från CV</h6>
              <div className="grid md:grid-cols-2 gap-3 text-xs">
                {cvAnalysis.leadershipCapabilities.technicalLeadership?.architecturalDecisions && (
                  <div>
                    <span className="text-gray-600">Teknisk ledning:</span>
                    <p className="text-gray-800">{cvAnalysis.leadershipCapabilities.technicalLeadership.architecturalDecisions}</p>
                  </div>
                )}
                {cvAnalysis.leadershipCapabilities.teamLeadership?.teamSize && (
                  <div>
                    <span className="text-gray-600">Teamledning:</span>
                    <p className="text-gray-800">Team på {cvAnalysis.leadershipCapabilities.teamLeadership.teamSize}</p>
                  </div>
                )}
              </div>
            </div>
          )}
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
            {(consultant.certifications || cvAnalysis?.education?.certifications || []).slice(0, 4).map((cert: string, idx: number) => (
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
            {(consultant.languages || cvAnalysis?.personalInfo?.languages || ['Swedish', 'English']).map((lang: string, idx: number) => (
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
