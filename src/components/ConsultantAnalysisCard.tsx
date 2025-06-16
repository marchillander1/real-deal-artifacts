
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Users, Target, TrendingUp, Star, Award, Heart, DollarSign, Clock, CheckCircle, Mail, FileDown } from 'lucide-react';
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
      {/* Main Profile Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Experience:</span>
            <span className="font-semibold">{consultant.experience}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Rate:</span>
            <span className="font-semibold text-green-600">{consultant.rate}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Availability:</span>
            <Badge className="bg-green-100 text-green-800 text-xs">{consultant.availability}</Badge>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Projects:</span>
            <span className="font-semibold">{consultant.projects} completed</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Rating:</span>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="font-semibold">{consultant.rating}/5.0</span>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div>
          <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Matching Skills
          </h5>
          <div className="flex flex-wrap gap-2">
            {consultant.skills.slice(0, 6).map((skill, idx) => (
              <Badge key={idx} className="bg-green-100 text-green-800 text-xs">
                ✓ {skill}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Human Factors & Cultural Fit */}
      <div>
        <h5 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="h-4 w-4 text-purple-500" />
          Human Factors & Cultural Fit
        </h5>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Cultural Match:</span>
              <div className="flex items-center gap-2">
                <Progress value={culturalMatch} className="w-20 h-2" />
                <span className="text-sm font-semibold text-blue-600">{culturalMatch}%</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Communication:</span>
              <div className="flex items-center gap-2">
                <Progress value={communicationMatch} className="w-20 h-2" />
                <span className="text-sm font-semibold text-blue-600">{communicationMatch}%</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Values Alignment:</span>
              <div className="flex items-center gap-2">
                <Progress value={valuesAlignment} className="w-20 h-2" />
                <span className="text-sm font-semibold text-blue-600">{valuesAlignment}%</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Leadership:</span>
              <div className="flex items-center gap-2">
                <Progress value={leadershipScore} className="w-20 h-2" />
                <span className="text-sm font-semibold text-blue-600">{leadershipScore}%</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-600">Communication Style:</span>
              <p className="text-sm font-medium mt-1">{consultant.communicationStyle || "Direct and collaborative"}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Work Style:</span>
              <p className="text-sm font-medium mt-1">{consultant.workStyle || "Agile and iterative"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* LinkedIn Analysis */}
      {consultant.linkedinAnalysis && (
        <div>
          <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" />
            LinkedIn Analysis
          </h5>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Leadership Style:</span>
              <p className="font-medium mt-1">{consultant.linkedinAnalysis.leadershipStyle}</p>
            </div>
            <div>
              <span className="text-gray-600">Problem Solving:</span>
              <p className="font-medium mt-1">{consultant.linkedinAnalysis.problemSolving}</p>
            </div>
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
    </div>
  );
};
