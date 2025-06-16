
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Users, Target, TrendingUp, Star, Award, Heart, DollarSign, Clock, CheckCircle, Mail, FileDown, Code } from 'lucide-react';
import { Consultant } from '@/types/consultant';

interface ConsultantAnalysisCardProps {
  consultant: Consultant;
}

export const ConsultantAnalysisCard: React.FC<ConsultantAnalysisCardProps> = ({ consultant }) => {
  console.log('ConsultantAnalysisCard rendering for:', consultant.name, {
    cvAnalysis: consultant.cvAnalysis,
    linkedinAnalysis: consultant.linkedinAnalysis,
    communicationStyle: consultant.communicationStyle,
    workStyle: consultant.workStyle
  });

  // Calculate scores for display
  const culturalMatch = consultant.culturalFit ? Math.round((consultant.culturalFit / 5) * 100) : 85;
  const communicationMatch = 88;
  const valuesAlignment = 92;
  const leadershipScore = consultant.leadership ? Math.round((consultant.leadership / 5) * 100) : 80;

  return (
    <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
      {/* Professional Summary from CV Analysis */}
      {consultant.cvAnalysis?.professionalSummary && (
        <div>
          <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" />
            Professional Summary
          </h5>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Seniority Level:</span>
              <p className="font-semibold">{consultant.cvAnalysis.professionalSummary.seniorityLevel}</p>
            </div>
            <div>
              <span className="text-gray-600">Experience:</span>
              <p className="font-semibold">{consultant.cvAnalysis.professionalSummary.yearsOfExperience}</p>
            </div>
            <div>
              <span className="text-gray-600">Current Role:</span>
              <p className="font-semibold">{consultant.cvAnalysis.professionalSummary.currentRole}</p>
            </div>
            <div>
              <span className="text-gray-600">Career Trajectory:</span>
              <p className="font-semibold text-green-600">{consultant.cvAnalysis.professionalSummary.careerTrajectory}</p>
            </div>
          </div>
        </div>
      )}

      {/* Technical Expertise */}
      {consultant.cvAnalysis?.technicalExpertise && (
        <div>
          <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Code className="h-4 w-4 text-purple-500" />
            Technical Expertise
          </h5>
          <div className="space-y-3">
            {consultant.cvAnalysis.technicalExpertise.programmingLanguages?.expert && (
              <div>
                <span className="text-sm font-medium text-gray-700">Expert Level:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {consultant.cvAnalysis.technicalExpertise.programmingLanguages.expert.map((skill: string, idx: number) => (
                    <Badge key={idx} className="bg-green-100 text-green-800 text-xs">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}
            {consultant.cvAnalysis.technicalExpertise.programmingLanguages?.proficient && (
              <div>
                <span className="text-sm font-medium text-gray-700">Proficient Level:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {consultant.cvAnalysis.technicalExpertise.programmingLanguages.proficient.map((skill: string, idx: number) => (
                    <Badge key={idx} className="bg-blue-100 text-blue-800 text-xs">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}
            {consultant.cvAnalysis.technicalExpertise.cloudAndInfrastructure?.platforms && (
              <div>
                <span className="text-sm font-medium text-gray-700">Cloud Platforms:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {consultant.cvAnalysis.technicalExpertise.cloudAndInfrastructure.platforms.map((platform: string, idx: number) => (
                    <Badge key={idx} className="bg-blue-100 text-blue-800 text-xs">{platform}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LinkedIn Analysis & Soft Skills */}
      {consultant.linkedinAnalysis && (
        <div>
          <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Brain className="h-4 w-4 text-blue-500" />
            LinkedIn Analysis & Soft Skills
          </h5>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Communication Style:</span>
                <p className="font-medium mt-1">{consultant.linkedinAnalysis.communicationStyle}</p>
              </div>
              <div>
                <span className="text-gray-600">Leadership Style:</span>
                <p className="font-medium mt-1">{consultant.linkedinAnalysis.leadershipStyle}</p>
              </div>
              <div>
                <span className="text-gray-600">Problem Solving:</span>
                <p className="font-medium mt-1">{consultant.linkedinAnalysis.problemSolving}</p>
              </div>
              <div>
                <span className="text-gray-600">Business Acumen:</span>
                <p className="font-medium mt-1">{consultant.linkedinAnalysis.businessAcumen}</p>
              </div>
            </div>
            
            {/* Human Factors Scoring */}
            <div className="bg-white p-4 rounded-lg space-y-3">
              <h6 className="font-semibold text-gray-800">Human Factors Assessment</h6>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Cultural Fit:</span>
                  <div className="flex items-center gap-2">
                    <Progress value={culturalMatch} className="w-20 h-2" />
                    <span className="text-sm font-semibold text-blue-600">{consultant.linkedinAnalysis.culturalFit}/5</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Leadership:</span>
                  <div className="flex items-center gap-2">
                    <Progress value={leadershipScore} className="w-20 h-2" />
                    <span className="text-sm font-semibold text-blue-600">{consultant.linkedinAnalysis.leadership}/5</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Innovation:</span>
                  <div className="flex items-center gap-2">
                    <Progress value={(consultant.linkedinAnalysis.innovation || 4) * 20} className="w-20 h-2" />
                    <span className="text-sm font-semibold text-blue-600">{consultant.linkedinAnalysis.innovation || 4}/5</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Team Collaboration:</span>
                  <div className="flex items-center gap-2">
                    <Progress value={88} className="w-20 h-2" />
                    <span className="text-sm font-semibold text-blue-600">4.4/5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Key Strengths from CV Analysis */}
      {consultant.cvAnalysis?.detailedStrengthsAnalysis && (
        <div>
          <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            Key Strengths
          </h5>
          <div className="space-y-3">
            {consultant.cvAnalysis.detailedStrengthsAnalysis.slice(0, 2).map((strength: any, idx: number) => (
              <div key={idx} className="border-l-4 border-green-500 pl-3 bg-white p-3 rounded">
                <h6 className="font-semibold text-green-700 text-sm">{strength.category}</h6>
                <p className="text-xs text-gray-600 mt-1">{strength.description}</p>
                <p className="text-xs text-green-600 mt-1 font-medium">{strength.marketValue}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Market Position */}
      {consultant.cvAnalysis?.marketPositioning && (
        <div>
          <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Award className="h-4 w-4 text-purple-500" />
            Market Position
          </h5>
          <div className="bg-white p-4 rounded-lg space-y-3">
            <div>
              <span className="text-sm text-gray-600">Unique Value Proposition:</span>
              <p className="text-sm font-medium">{consultant.cvAnalysis.marketPositioning.uniqueValueProposition}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Market Competitiveness:</span>
              <p className="text-sm font-semibold text-blue-600">{consultant.cvAnalysis.marketPositioning.competitiveness}</p>
            </div>
            {consultant.cvAnalysis.marketPositioning.salaryBenchmarks && (
              <div className="grid grid-cols-3 gap-2 mt-3">
                <div className="text-center p-2 bg-blue-50 rounded">
                  <p className="text-xs text-gray-600">Stockholm</p>
                  <p className="text-xs font-bold text-blue-600">{consultant.cvAnalysis.marketPositioning.salaryBenchmarks.stockholm}</p>
                </div>
                <div className="text-center p-2 bg-green-50 rounded">
                  <p className="text-xs text-gray-600">Europe</p>
                  <p className="text-xs font-bold text-green-600">{consultant.cvAnalysis.marketPositioning.salaryBenchmarks.europeanTech}</p>
                </div>
                <div className="text-center p-2 bg-purple-50 rounded">
                  <p className="text-xs text-gray-600">Remote</p>
                  <p className="text-xs font-bold text-purple-600">{consultant.cvAnalysis.marketPositioning.salaryBenchmarks.remoteGlobal}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Values & Personality Traits */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Heart className="h-4 w-4 text-red-500" />
            Core Values
          </h5>
          <div className="flex flex-wrap gap-2">
            {consultant.values?.map((value, idx) => (
              <Badge key={idx} variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
                {value}
              </Badge>
            )) || (
              <>
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">Innovation</Badge>
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">Quality</Badge>
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">Teamwork</Badge>
              </>
            )}
          </div>
        </div>

        <div>
          <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Brain className="h-4 w-4 text-purple-500" />
            Personality Traits
          </h5>
          <div className="flex flex-wrap gap-2">
            {consultant.personalityTraits?.map((trait, idx) => (
              <Badge key={idx} variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
                {trait}
              </Badge>
            )) || (
              <>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs">Collaborative</Badge>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs">Detail-oriented</Badge>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs">Proactive</Badge>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Certifications */}
      <div>
        <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Award className="h-4 w-4 text-yellow-500" />
          Certifications
        </h5>
        <div className="grid md:grid-cols-2 gap-2">
          {consultant.certifications.slice(0, 4).map((cert, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>{cert}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Work Style and Communication */}
      <div className="bg-white p-4 rounded-lg">
        <h5 className="font-semibold text-gray-900 mb-3">Work Style & Communication</h5>
        <div className="space-y-2 text-sm">
          <div>
            <span className="text-gray-600">Communication Style:</span>
            <p className="font-medium">{consultant.communicationStyle || "Professional and collaborative"}</p>
          </div>
          <div>
            <span className="text-gray-600">Work Style:</span>
            <p className="font-medium">{consultant.workStyle || "Agile and iterative"}</p>
          </div>
          <div>
            <span className="text-gray-600">Team Fit:</span>
            <p className="font-medium">{consultant.teamFit || "Strong collaborative partner"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
