
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Clock, Mail, Award, Brain, FileText, Linkedin, CheckCircle } from 'lucide-react';
import { Consultant } from '@/types/consultant';

interface ConsultantCardProps {
  consultant: Consultant;
}

const ConsultantCard: React.FC<ConsultantCardProps> = ({ consultant }) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusColor = (availability: string) => {
    if (availability.includes('Available')) return 'bg-green-100 text-green-800';
    if (availability.includes('From')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  // Check for analysis data from database
  const hasAnalysisData = consultant.cvAnalysis || consultant.linkedinAnalysis;
  const cvAnalysis = consultant.cvAnalysis?.analysis;
  const linkedinAnalysis = consultant.linkedinAnalysis?.analysis;

  console.log('🔍 ConsultantCard analysis data check:', {
    consultantName: consultant.name,
    hasAnalysisData,
    hasCvAnalysis: !!cvAnalysis,
    hasLinkedinAnalysis: !!linkedinAnalysis
  });

  // Get real data from CV analysis or fallback to existing data
  const displayName = cvAnalysis?.personalInfo?.name || consultant.name;
  const displayLocation = cvAnalysis?.personalInfo?.location || consultant.location;
  const displayExperience = cvAnalysis?.professionalSummary?.yearsOfExperience ? 
    `${cvAnalysis.professionalSummary.yearsOfExperience} years` : 
    consultant.experience;
  const displayRole = cvAnalysis?.professionalSummary?.currentRole || consultant.roles[0];
  const displayRate = cvAnalysis?.marketPositioning?.hourlyRateEstimate?.recommended ?
    `${cvAnalysis.marketPositioning.hourlyRateEstimate.recommended} SEK/hour` :
    consultant.rate;

  // Get skills from CV analysis or fallback
  const displaySkills = cvAnalysis?.technicalExpertise?.programmingLanguages?.expert || 
                       consultant.skills;

  return (
    <Card className="p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            {getInitials(displayName)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{displayName}</h3>
            <p className="text-gray-600">{displayRole}</p>
            <div className="flex items-center space-x-1 mt-1">
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                {consultant.type === 'new' ? 'Network' : 'Our Team'}
              </Badge>
              {hasAnalysisData && (
                <Badge variant="outline" className="text-purple-600 border-purple-200">
                  <Brain className="h-3 w-3 mr-1" />
                  AI Analyzed
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="font-semibold">{consultant.rating}</span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Experience:</span>
          <span className="font-medium">{displayExperience.replace(' experience', '')}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Projects:</span>
          <span className="font-medium">{consultant.projects} completed</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Rate:</span>
          <span className="font-medium text-green-600">{displayRate.replace('SEK/h', 'SEK/hour')}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Location:</span>
          <span className="font-medium">{displayLocation}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Status:</span>
          <Badge className={getStatusColor(consultant.availability)}>
            {consultant.availability}
          </Badge>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Last active:</span>
          <span className="text-gray-500">{consultant.lastActive}</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Top Skills:</p>
        <div className="flex flex-wrap gap-2">
          {displaySkills.slice(0, 4).map((skill, index) => (
            <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
              {skill}
            </Badge>
          ))}
          {displaySkills.length > 4 && (
            <Badge variant="secondary" className="bg-gray-100 text-gray-600">
              +{displaySkills.length - 4} more
            </Badge>
          )}
        </div>
      </div>

      {/* Analysis Status Indicators */}
      {hasAnalysisData && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Analysis Status:</p>
          <div className="flex gap-2">
            {consultant.cvAnalysis && (
              <div className="flex items-center gap-1 text-xs text-green-600">
                <CheckCircle className="h-3 w-3" />
                <FileText className="h-3 w-3" />
                <span>CV Analyzed</span>
              </div>
            )}
            {consultant.linkedinAnalysis && (
              <div className="flex items-center gap-1 text-xs text-blue-600">
                <CheckCircle className="h-3 w-3" />
                <Linkedin className="h-3 w-3" />
                <span>LinkedIn Analyzed</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Show real analysis summary if available */}
      {cvAnalysis?.marketPositioning?.competitiveAdvantages && (
        <div className="mb-4 p-3 bg-purple-50 rounded-lg">
          <p className="text-sm font-medium text-purple-900 mb-1">AI Insights:</p>
          <div className="flex flex-wrap gap-1">
            {cvAnalysis.marketPositioning.competitiveAdvantages.slice(0, 2).map((advantage, index) => (
              <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-800 text-xs">
                {advantage}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <Button variant="outline" size="sm">
          <Mail className="h-4 w-4 mr-2" />
          Contact
        </Button>
        {consultant.certifications.length > 0 && (
          <div className="flex items-center space-x-2">
            <Award className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-600 font-medium">
              {consultant.certifications[0]}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ConsultantCard;
