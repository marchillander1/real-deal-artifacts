
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Star,
  CheckCircle,
  ExternalLink,
  Calendar
} from 'lucide-react';

interface ProfileHeaderProps {
  consultant: any;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ consultant }) => {
  return (
    <Card className="shadow-xl border-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
            <User className="h-12 w-12 text-white" />
          </div>
          
          {/* Main Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{consultant.name}</h1>
              {consultant.is_published && (
                <Badge variant="secondary" className="bg-green-500 text-white">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Publicerad
                </Badge>
              )}
            </div>
            
            <p className="text-xl font-medium text-blue-100 mb-2">
              {consultant.title}
            </p>
            
            {consultant.tagline && (
              <p className="text-blue-100 mb-4 max-w-2xl">
                {consultant.tagline}
              </p>
            )}
            
            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{consultant.email}</span>
              </div>
              
              {consultant.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{consultant.phone}</span>
                </div>
              )}
              
              {consultant.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{consultant.location}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Medlem sedan {new Date(consultant.created_at).toLocaleDateString('sv-SE')}</span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            {consultant.linkedin_url && (
              <Button 
                variant="secondary" 
                asChild
                className="flex items-center gap-2"
              >
                <a href={consultant.linkedin_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  LinkedIn
                </a>
              </Button>
            )}
            
            <div className="text-center">
              <div className="flex items-center gap-1 justify-center mb-1">
                <Star className="h-4 w-4 text-yellow-300 fill-current" />
                <span className="font-semibold">{consultant.rating}</span>
              </div>
              <div className="text-xs text-blue-100">
                {consultant.projects_completed} projekt genomförda
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
