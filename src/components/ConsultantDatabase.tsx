
import React, { useState } from 'react';
import { useSupabaseConsultants } from '@/hooks/useSupabaseConsultants';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, MapPin, Clock, Mail, Award, Users } from 'lucide-react';
import { Consultant } from '@/types/consultant';

export const ConsultantDatabase: React.FC = () => {
  const { consultants, isLoading } = useSupabaseConsultants();
  
  const existingConsultants = consultants.filter(c => c.type === 'existing');
  const networkConsultants = consultants.filter(c => c.type === 'new');

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusColor = (availability: string) => {
    if (availability.includes('Available')) return 'bg-green-100 text-green-800';
    if (availability.includes('From')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const ConsultantCard = ({ consultant }: { consultant: Consultant }) => (
    <Card className="p-6 bg-white rounded-lg border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            {getInitials(consultant.name)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{consultant.name}</h3>
            <p className="text-gray-600">{consultant.roles[0]}</p>
            <div className="flex items-center space-x-1 mt-1">
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                Verified
              </Badge>
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
          <span className="font-medium">{consultant.experience.replace(' experience', '')}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Projects:</span>
          <span className="font-medium">{consultant.projects} completed</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Rate:</span>
          <span className="font-medium text-green-600">{consultant.rate.replace('SEK/h', 'SEK/hour')}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Location:</span>
          <span className="font-medium">{consultant.location}</span>
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
          {consultant.skills.slice(0, 4).map((skill, index) => (
            <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
              {skill}
            </Badge>
          ))}
          {consultant.skills.length > 4 && (
            <Badge variant="secondary" className="bg-gray-100 text-gray-600">
              +{consultant.skills.length - 4} more
            </Badge>
          )}
        </div>
      </div>

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Consultant Database</h1>
            <p className="text-gray-600 mt-1">AI-powered consultant profiles with automated skill extraction</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Users className="h-4 w-4 mr-2" />
            Upload CV
          </Button>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-8">
        {/* Our Consultants */}
        <div>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Our Consultants</h2>
              <p className="text-gray-600">Our established team of experienced professionals</p>
            </div>
            <Badge className="bg-blue-100 text-blue-800">
              {existingConsultants.length} consultants
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {existingConsultants.map((consultant) => (
              <ConsultantCard key={consultant.id} consultant={consultant} />
            ))}
          </div>
        </div>

        {/* Network Consultants */}
        <div>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Network Consultants</h2>
              <p className="text-gray-600">External consultants who joined through our platform</p>
            </div>
            <Badge className="bg-green-100 text-green-800">
              {networkConsultants.length} network
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {networkConsultants.map((consultant) => (
              <ConsultantCard key={consultant.id} consultant={consultant} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
