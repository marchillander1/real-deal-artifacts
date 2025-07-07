
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Search, 
  Users, 
  MapPin, 
  Star, 
  Calendar, 
  DollarSign,
  Heart,
  MessageSquare,
  Filter,
  Eye,
  Plus
} from 'lucide-react';
import { Consultant } from '@/types/consultant';
import { UnifiedCVUpload } from '../cv-upload/UnifiedCVUpload';
import { supabase } from '@/integrations/supabase/client';

interface ConsultantsSectionProps {
  consultants: Consultant[];
}

export const ConsultantsSection: React.FC<ConsultantsSectionProps> = ({ consultants }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'my' | 'network'>('all');
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  // Separate consultants by type
  const myTeamConsultants = consultants.filter(c => c.type === 'existing' || c.type === 'my');
  const networkConsultants = consultants.filter(c => c.type === 'new' || c.type === 'network');

  const filteredConsultants = consultants.filter(consultant => {
    const matchesSearch = 
      consultant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultant.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultant.skills.some(skill => 
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesType = 
      selectedType === 'all' || 
      (selectedType === 'my' && (consultant.type === 'existing' || consultant.type === 'my')) ||
      (selectedType === 'network' && (consultant.type === 'new' || consultant.type === 'network'));

    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'existing':
      case 'my': 
        return 'bg-blue-100 text-blue-800';
      case 'new':
      case 'network': 
        return 'bg-green-100 text-green-800';
      default: 
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'existing':
      case 'my': 
        return 'My Team';
      case 'new':
      case 'network': 
        return 'Network';
      default: 
        return 'Unknown';
    }
  };

  const handleFavorite = async (consultantId: string | number) => {
    console.log('Adding to favorites:', String(consultantId));
    // TODO: Implement favorites functionality
  };

  const handleContact = async (consultantId: string | number) => {
    console.log('Sending contact request:', String(consultantId));
    // TODO: Implement contact request functionality
  };

  const handleUploadComplete = (consultant: any) => {
    console.log('✅ Consultant added to team:', consultant);
    setShowUploadDialog(false);
    
    // Refresh the page to show the new consultant
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Consultants</h2>
          <p className="text-gray-600">Browse and manage your consultant network</p>
        </div>
        <Button 
          onClick={() => setShowUploadDialog(true)}
          className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Consultant
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search consultants by name, title, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant={selectedType === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedType('all')}
                size="sm"
              >
                All ({consultants.length})
              </Button>
              <Button 
                variant={selectedType === 'my' ? 'default' : 'outline'}
                onClick={() => setSelectedType('my')}
                size="sm"
              >
                My Team ({myTeamConsultants.length})
              </Button>
              <Button 
                variant={selectedType === 'network' ? 'default' : 'outline'}
                onClick={() => setSelectedType('network')}
                size="sm"
              >
                Network ({networkConsultants.length})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Consultants</p>
                <p className="text-xl font-bold">{consultants.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Available Now</p>
                <p className="text-xl font-bold">{consultants.filter(c => c.availability === 'Available').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-xl font-bold">{(consultants.reduce((acc, c) => acc + c.rating, 0) / consultants.length || 0).toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Avg Rate</p>
                <p className="text-xl font-bold">850 SEK/h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Consultants Grid */}
      <div className="grid gap-6">
        {filteredConsultants.map((consultant) => (
          <Card key={consultant.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-xl">
                    {consultant.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {consultant.name}
                    </h3>
                    <p className="text-gray-600 mb-2">{consultant.title}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {consultant.location}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {consultant.availability}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {consultant.rate}
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1 text-yellow-500" />
                        {consultant.rating}/5
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <Badge className={getTypeColor(consultant.type)} variant="secondary">
                    {getTypeLabel(consultant.type)}
                  </Badge>
                  <div className="text-sm text-gray-500">{consultant.experience}</div>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Skills:</p>
                <div className="flex flex-wrap gap-1">
                  {consultant.skills.slice(0, 8).map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {consultant.skills.length > 8 && (
                    <Badge variant="outline" className="text-xs">
                      +{consultant.skills.length - 8} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>{consultant.projects} projects completed</span>
                </div>
                <div className="flex gap-2">
                  {(consultant.type === 'new' || consultant.type === 'network') && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleFavorite(consultant.id)}
                      >
                        <Heart className="h-4 w-4 mr-1" />
                        Favorite
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleContact(consultant.id)}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Contact
                      </Button>
                    </>
                  )}
                  <Button size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredConsultants.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No consultants found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Consultant to Team</DialogTitle>
          </DialogHeader>
          <UnifiedCVUpload
            isMyConsultant={true}
            onComplete={handleUploadComplete}
            onClose={() => setShowUploadDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
