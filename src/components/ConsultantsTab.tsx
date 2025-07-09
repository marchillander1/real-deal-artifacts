
import React, { useState } from 'react';
import { useSupabaseConsultantsWithDemo } from '@/hooks/useSupabaseConsultantsWithDemo';
import { useRealTimeTeamNotifications } from '@/hooks/useRealTimeTeamNotifications';
import { useFavoritesAndNotes } from '@/hooks/useFavoritesAndNotes';
import { ConsultantAnalysisModal } from '@/components/ConsultantAnalysisModal';
import { ConsultantFullAnalysisModal } from '@/components/ConsultantFullAnalysisModal';
import { ConsultantStats } from '@/components/consultant/ConsultantStats';
import { ConsultantFilters } from '@/components/consultant/ConsultantFilters';
import { ConsultantGrid } from '@/components/consultant/ConsultantGrid';
import { UnifiedCVUpload } from '@/components/cv-upload/UnifiedCVUpload';
import { FavoriteButton } from '@/components/consultant/FavoriteButton';
import { NotesDialog } from '@/components/consultant/NotesDialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Plus, StickyNote, Heart, Eye, Brain, MapPin, Star, Calendar } from 'lucide-react';
import { Consultant } from '@/types/consultant';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface ConsultantsTabProps {
  showEditForNetwork?: boolean;
  showDeleteForMyConsultants?: boolean;
  showRemoveDuplicates?: boolean;
}

export const ConsultantsTab: React.FC<ConsultantsTabProps> = ({
  showEditForNetwork = true,
  showDeleteForMyConsultants = true,
  showRemoveDuplicates = true
}) => {
  const { consultants, isLoading, error, updateConsultant } = useSupabaseConsultantsWithDemo();
  const { favorites, notes, refreshFavorites } = useFavoritesAndNotes();
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [showFullAnalysisModal, setShowFullAnalysisModal] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [notesDialogConsultant, setNotesDialogConsultant] = useState<Consultant | null>(null);
  const { toast } = useToast();

  useRealTimeTeamNotifications();

  const existingConsultants = consultants.filter(c => c.type === 'existing');
  const newConsultants = consultants.filter(c => c.type === 'new');

  const filterConsultants = (consultantList: Consultant[]) => {
    return consultantList.filter(consultant => {
      const matchesSearch = consultant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           consultant.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesSkill = !skillFilter || consultant.skills.some(skill => 
        skill.toLowerCase().includes(skillFilter.toLowerCase())
      );
      const matchesFavorites = !showFavoritesOnly || favorites.has(String(consultant.id));
      
      return matchesSearch && matchesSkill && matchesFavorites;
    });
  };

  const allSkills = [...new Set(consultants.flatMap(c => c.skills))];

  const handleUploadComplete = (consultant: any) => {
    console.log('✅ Consultant added to team:', consultant);
    setShowUploadDialog(false);
    
    toast({
      title: "Consultant added successfully! 🎉",
      description: `${consultant.name} has been added to your team`,
    });

    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleViewAnalysis = (consultant: Consultant) => {
    console.log('🔍 Opening analysis for consultant:', consultant.name);
    setSelectedConsultant(consultant);
    setShowAnalysisModal(true);
  };

  const handleViewProfile = (consultant: Consultant) => {
    console.log('👤 Opening full profile for consultant:', consultant.name);
    setSelectedConsultant(consultant);
    setShowFullAnalysisModal(true);
  };

  const handleOpenNotes = (consultant: Consultant) => {
    setNotesDialogConsultant(consultant);
  };

  const renderConsultantCard = (consultant: Consultant) => {
    const consultantId = String(consultant.id);
    const isFavorite = favorites.has(consultantId);
    const hasNote = notes.has(consultantId);

    return (
      <Card key={consultant.id} className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                  {consultant.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-gray-900">{consultant.name}</h3>
                <p className="text-sm text-gray-600">{consultant.roles?.[0] || 'Consultant'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FavoriteButton
                consultantId={consultantId}
                isFavorite={isFavorite}
                onToggle={refreshFavorites}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleOpenNotes(consultant)}
                className={hasNote ? 'text-blue-600' : 'text-gray-400'}
              >
                <StickyNote className={`h-4 w-4 ${hasNote ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 space-y-4">
          {/* Skills */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Key Skills</p>
            <div className="flex flex-wrap gap-1">
              {consultant.skills.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {consultant.skills.length > 3 && (
                <Badge variant="outline" className="text-xs text-gray-500">
                  +{consultant.skills.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          {/* Experience & Rating */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-1" />
                {consultant.experience || '5+ years'}
              </div>
            </div>
            <div>
              <div className="flex items-center text-sm text-gray-600">
                <Star className="h-4 w-4 mr-1 text-yellow-400" fill="currentColor" />
                {consultant.rating}/5.0
              </div>
            </div>
          </div>

          {/* Location & Availability */}
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              {consultant.location}
            </div>
            <div className="text-sm">
              <Badge 
                variant={consultant.availability === 'Available' ? 'default' : 'secondary'}
                className="bg-green-100 text-green-800"
              >
                {consultant.availability}
              </Badge>
            </div>
          </div>

          {/* Rate */}
          <div className="text-sm">
            <span className="font-medium text-gray-700">Rate: </span>
            <span className="text-gray-600">{consultant.rate || '850 SEK/h'}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {consultant.cvAnalysis && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleViewAnalysis(consultant)}
                className="flex-1 text-xs"
              >
                <Brain className="h-3 w-3 mr-1" />
                AI Analysis
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleViewProfile(consultant)}
              className="flex-1 text-xs"
            >
              <Eye className="h-3 w-3 mr-1" />
              View Profile
            </Button>
          </div>

          {/* Favorites and Notes indicators */}
          <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
            {isFavorite && (
              <Badge variant="outline" className="text-xs bg-red-50 text-red-700">
                <Heart className="h-3 w-3 mr-1 fill-current" />
                Favorite
              </Badge>
            )}
            {hasNote && (
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                <StickyNote className="h-3 w-3 mr-1" />
                Has Note
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ConsultantStats
        totalConsultants={consultants.length}
        teamConsultants={existingConsultants.length}
        networkConsultants={newConsultants.length}
      />

      <div className="flex flex-col md:flex-row gap-4">
        <ConsultantFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          skillFilter={skillFilter}
          onSkillFilterChange={setSkillFilter}
          availableSkills={allSkills}
        />
        
        <div className="flex items-center gap-2">
          <Button
            variant={showFavoritesOnly ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className="flex items-center gap-2"
          >
            <Heart className={`h-4 w-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
            Favorites Only
          </Button>
        </div>
      </div>

      <Tabs defaultValue="my-consultants" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="my-consultants">
            Team Consultants ({filterConsultants(existingConsultants).length})
          </TabsTrigger>
          <TabsTrigger value="network">
            Network Consultants ({filterConsultants(newConsultants).length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All ({filterConsultants(consultants).length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-consultants" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Team Consultants</h3>
              <p className="text-sm text-gray-600">Shared with your team members</p>
            </div>
            <Button 
              onClick={() => setShowUploadDialog(true)}
              className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Consultant
            </Button>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filterConsultants(existingConsultants).map(renderConsultantCard)}
          </div>
        </TabsContent>
        
        <TabsContent value="network" className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Network Consultants</h3>
            <p className="text-sm text-gray-600">Consultants from the MatchWise network</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filterConsultants(newConsultants).map(renderConsultantCard)}
          </div>
        </TabsContent>
        
        <TabsContent value="all" className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">All Consultants</h3>
            <p className="text-sm text-gray-600">All consultants in the platform</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filterConsultants(consultants).map(renderConsultantCard)}
          </div>
        </TabsContent>
      </Tabs>

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

      {/* Analysis Modal */}
      {selectedConsultant && (
        <ConsultantAnalysisModal
          consultant={selectedConsultant}
          isOpen={showAnalysisModal}
          onClose={() => setShowAnalysisModal(false)}
        />
      )}

      {/* Full Analysis Modal */}
      {selectedConsultant && (
        <ConsultantFullAnalysisModal
          consultant={selectedConsultant}
          isOpen={showFullAnalysisModal}
          onClose={() => setShowFullAnalysisModal(false)}
        />
      )}

      {/* Notes Dialog */}
      {notesDialogConsultant && (
        <NotesDialog
          consultantId={String(notesDialogConsultant.id)}
          consultantName={notesDialogConsultant.name}
          isOpen={!!notesDialogConsultant}
          onClose={() => setNotesDialogConsultant(null)}
        />
      )}
    </div>
  );
};
