
import React, { useState } from 'react';
import { Star, Mail, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { Consultant } from '../types/consultant';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConsultantAnalysisCard } from './ConsultantAnalysisCard';

interface ConsultantCardProps {
  consultant: Consultant;
  isNew?: boolean;
}

const ConsultantCard: React.FC<ConsultantCardProps> = ({ consultant, isNew = false }) => {
  // Enhanced check for analysis data - look for any analysis-related properties
  const hasAnalysis = !!(
    consultant.cvAnalysis || 
    consultant.linkedinAnalysis || 
    consultant.communicationStyle || 
    consultant.workStyle ||
    consultant.personalityTraits?.length ||
    consultant.values?.length ||
    consultant.teamFit ||
    consultant.culturalFit ||
    consultant.adaptability ||
    consultant.leadership
  );
  
  // Show analysis by default if it exists, especially for new consultants from CV upload
  const [showAnalysis, setShowAnalysis] = useState(isNew || hasAnalysis);
  
  const borderColor = isNew ? 'border-2 border-green-100' : 'border';
  const badgeColor = isNew ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
  const badgeText = isNew ? 'New Member' : 'Verified';
  const avatarColor = isNew ? 'bg-green-500' : 'bg-blue-500';
  const skillsColor = isNew ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
  const certificationColor = isNew ? 'text-green-500' : 'text-blue-500';
  const certificationTextColor = isNew ? 'text-green-600' : 'text-blue-600';

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const experienceYears = consultant.experience_years?.toString() || consultant.experience?.replace(/\D/g, '') || '0';

  console.log('ConsultantCard:', consultant.name, 'hasAnalysis:', hasAnalysis, {
    cvAnalysis: !!consultant.cvAnalysis,
    linkedinAnalysis: !!consultant.linkedinAnalysis,
    communicationStyle: !!consultant.communicationStyle,
    workStyle: !!consultant.workStyle,
    personalityTraits: consultant.personalityTraits?.length || 0,
    values: consultant.values?.length || 0,
    teamFit: !!consultant.teamFit,
    isNew: isNew
  });

  return (
    <div className={`bg-white rounded-xl shadow-sm ${borderColor} p-6 hover:shadow-lg transition-all`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`h-12 w-12 ${avatarColor} rounded-full flex items-center justify-center`}>
            <span className="text-white font-semibold">{getInitials(consultant.name)}</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{consultant.name}</h3>
            <p className="text-sm text-gray-600">{consultant.roles?.[0] || 'Consultant'}</p>
            <Badge className={`${badgeColor} mt-1`}>
              {badgeText}
            </Badge>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="text-sm font-medium text-gray-700">
            {typeof consultant.rating === 'number' ? consultant.rating.toFixed(1) : consultant.rating}
          </span>
        </div>
      </div>
      
      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Experience:</span>
          <span className="font-medium">{experienceYears} years</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Projects:</span>
          <span className="font-medium">{consultant.projects_completed || consultant.projects || 0} completed</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Rate:</span>
          <span className="font-medium text-green-600">{consultant.hourly_rate || consultant.rate}/hour</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Location:</span>
          <span className="font-medium">{consultant.location}</span>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Status:</span>
          <Badge className={`${
            consultant.availability === 'Available' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {consultant.availability}
          </Badge>
        </div>
        <p className="text-xs text-gray-500">
          {isNew ? 'Joined:' : 'Last active:'} {consultant.lastActive}
        </p>
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Top Skills:</p>
        <div className="flex flex-wrap gap-1">
          {consultant.skills?.slice(0, 5).map((skill, index) => (
            <Badge key={index} className={skillsColor}>
              {skill}
            </Badge>
          ))}
          {(consultant.skills?.length || 0) > 5 && (
            <Badge className="bg-gray-100 text-gray-600">
              +{(consultant.skills?.length || 0) - 5} more
            </Badge>
          )}
        </div>
      </div>

      {/* AI Analysis Section - Show for all consultants with analysis data */}
      {hasAnalysis && (
        <div className="mt-4 pt-4 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              console.log('Toggling analysis view for:', consultant.name, 'current state:', showAnalysis);
              setShowAnalysis(!showAnalysis);
            }}
            className="w-full flex items-center justify-between text-blue-600 hover:text-blue-800"
          >
            <span className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              {isNew ? 'CV & LinkedIn Analysis (30 Posts + Bio)' : 'AI Analysis & LinkedIn Profile'}
            </span>
            {showAnalysis ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          
          {showAnalysis && (
            <div className="mt-4">
              <ConsultantAnalysisCard consultant={consultant} />
            </div>
          )}
        </div>
      )}

      <div className="mt-4 pt-4 border-t flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <Mail className="h-3 w-3" />
          <span>Contact</span>
        </div>
        <div className="flex items-center space-x-1">
          <Award className={`h-3 w-3 ${certificationColor}`} />
          <span className={`text-xs ${certificationTextColor} font-medium`}>
            {consultant.certifications?.[0] || 'Professional'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ConsultantCard;
