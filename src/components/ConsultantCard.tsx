
import React from 'react';
import { Star, Mail, Award } from 'lucide-react';
import { Consultant } from '../types/consultant';

interface ConsultantCardProps {
  consultant: Consultant;
  isNew?: boolean;
}

const ConsultantCard: React.FC<ConsultantCardProps> = ({ consultant, isNew = false }) => {
  const borderColor = isNew ? 'border-2 border-green-100' : 'border';
  const badgeColor = isNew ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
  const badgeText = isNew ? 'New Member' : 'Verified';
  const avatarColor = isNew ? 'from-green-500 to-teal-500' : 'from-blue-500 to-purple-500';
  const skillsColor = isNew ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
  const certificationColor = isNew ? 'text-green-500' : 'text-blue-500';
  const certificationTextColor = isNew ? 'text-green-600' : 'text-blue-600';

  return (
    <div className={`bg-white rounded-xl shadow-sm ${borderColor} p-6 hover:shadow-lg transition-all`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`h-12 w-12 bg-gradient-to-r ${avatarColor} rounded-full flex items-center justify-center`}>
            <span className="text-white font-semibold">{consultant.name.split(' ').map(n => n[0]).join('')}</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{consultant.name}</h3>
            <p className="text-sm text-gray-600">{consultant.roles[0]}</p>
            <span className={`inline-block ${badgeColor} text-xs px-2 py-1 rounded-full mt-1`}>
              {badgeText}
            </span>
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
          <span className="font-medium">{consultant.experience}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Projects:</span>
          <span className="font-medium">{consultant.projects} completed</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Rate:</span>
          <span className="font-medium text-green-600">{consultant.rate}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Location:</span>
          <span className="font-medium">{consultant.location}</span>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Status:</span>
          <span className={`px-2 py-1 text-xs rounded-full ${
            consultant.availability === 'Available' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {consultant.availability}
          </span>
        </div>
        <p className="text-xs text-gray-500">
          {isNew ? 'Joined:' : 'Last active:'} {consultant.lastActive}
        </p>
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Top Skills:</p>
        <div className="flex flex-wrap gap-1">
          {consultant.skills.slice(0, 5).map((skill, index) => (
            <span key={index} className={`px-2 py-1 ${skillsColor} text-xs rounded-md`}>
              {skill}
            </span>
          ))}
          {consultant.skills.length > 5 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
              +{consultant.skills.length - 5} more
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <Mail className="h-3 w-3" />
          <span>Contact</span>
        </div>
        <div className="flex items-center space-x-1">
          <Award className={`h-3 w-3 ${certificationColor}`} />
          <span className={`${certificationTextColor} font-medium`}>{consultant.certifications[0]}</span>
        </div>
      </div>
    </div>
  );
};

export default ConsultantCard;
