
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Edit,
  CheckCircle,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface ProfileOverviewProps {
  consultant: any;
  onEditClick: () => void;
  onToggleVisibility: () => void;
}

export const ProfileOverview: React.FC<ProfileOverviewProps> = ({
  consultant,
  onEditClick,
  onToggleVisibility
}) => {
  const { user } = useAuth();
  
  // Check if current user can see contact information
  const canViewContactInfo = user?.id === consultant.user_id || 
                             (consultant.user_id && user?.id === consultant.user_id);
  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <User className="h-10 w-10 text-white" />
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{consultant.name}</h1>
              <p className="text-xl opacity-90 mb-4">{consultant.title}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {consultant.experience_years} års erfarenhet
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {consultant.hourly_rate} SEK/tim
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  ⭐ {consultant.rating}/5
                </Badge>
              </div>

              {consultant.tagline && (
                <p className="text-lg opacity-90 italic max-w-2xl">
                  "{consultant.tagline}"
                </p>
              )}
            </div>
          </div>

          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={onToggleVisibility}
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <Globe className="h-4 w-4 mr-2" />
              {consultant.visibility_status === 'public' ? 'Gör privat' : 'Publicera'}
            </Button>
            
            <Button 
              onClick={onEditClick}
              className="bg-white text-blue-600 hover:bg-white/90"
            >
              <Edit className="h-4 w-4 mr-2" />
              Redigera
            </Button>
          </div>
        </div>
      </div>

      <CardContent className="p-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Mail className="h-5 w-5 mr-2 text-blue-600" />
              Kontaktinformation
            </h3>
            <div className="space-y-3">
              {canViewContactInfo ? (
                <>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-500 mr-3" />
                    <span>{consultant.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-500 mr-3" />
                    <span>{consultant.phone}</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center text-gray-500">
                  <Mail className="h-4 w-4 mr-3" />
                  <span className="italic">Kontaktuppgifter döljs för allmänheten</span>
                </div>
              )}
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-gray-500 mr-3" />
                <span>{consultant.location}</span>
              </div>
              {consultant.linkedin_url && (
                <div className="flex items-center">
                  <Globe className="h-4 w-4 text-gray-500 mr-3" />
                  <a 
                    href={consultant.linkedin_url} 
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

          {/* Profile Status */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
              Profil Status
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Synlighet:</span>
                <Badge 
                  variant={consultant.visibility_status === 'public' ? 'default' : 'secondary'}
                  className={consultant.visibility_status === 'public' ? 'bg-green-100 text-green-800' : ''}
                >
                  {consultant.visibility_status === 'public' ? 'Publik' : 'Privat'}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tillgänglighet:</span>
                <Badge variant="outline" className="text-blue-600 border-blue-200">
                  {consultant.availability}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Skapad:</span>
                <span className="text-gray-800">{consultant.created_at}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Senast aktiv:</span>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                  <span className="text-gray-800">{consultant.last_active}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
