
import React, { useState } from 'react';
import { useSupabaseConsultantsWithDemo } from '@/hooks/useSupabaseConsultantsWithDemo';
import { useRealTimeTeamNotifications } from '@/hooks/useRealTimeTeamNotifications';
import { ConsultantAnalysisModal } from '@/components/ConsultantAnalysisModal';
import { ConsultantStats } from '@/components/consultant/ConsultantStats';
import { ConsultantFilters } from '@/components/consultant/ConsultantFilters';
import { ConsultantGrid } from '@/components/consultant/ConsultantGrid';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
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
  const { consultants, isLoading, updateConsultant } = useSupabaseConsultantsWithDemo();
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
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
      return matchesSearch && matchesSkill;
    });
  };

  const allSkills = [...new Set(consultants.flatMap(c => c.skills))];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      window.location.href = '/cv-upload?source=my-consultants';
    }
  };

  const handleDeleteConsultant = async (consultantId: string | number) => {
    const idString = String(consultantId);
    if (idString.startsWith('my-') || idString.startsWith('demo-')) {
      toast({
        title: "Cannot delete demo consultant",
        description: "Demo consultants cannot be deleted",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('consultants')
        .delete()
        .eq('id', idString);

      if (error) throw error;

      toast({
        title: "Consultant deleted",
        description: "The consultant has been successfully removed",
      });

      window.location.reload();
    } catch (error: any) {
      console.error('Error deleting consultant:', error);
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete consultant",
        variant: "destructive",
      });
    }
  };

  const handleViewAnalysis = (consultant: Consultant) => {
    console.log('🔍 Opening analysis for consultant:', consultant.name);
    console.log('🔍 Analysis data available:', {
      hasCvAnalysis: !!consultant.cvAnalysis,
      hasLinkedinAnalysis: !!consultant.linkedinAnalysis,
      cvAnalysisKeys: consultant.cvAnalysis ? Object.keys(consultant.cvAnalysis) : [],
      linkedinAnalysisKeys: consultant.linkedinAnalysis ? Object.keys(consultant.linkedinAnalysis) : []
    });
    
    setSelectedConsultant(consultant);
    setShowAnalysisModal(true);
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

      <ConsultantFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        skillFilter={skillFilter}
        onSkillFilterChange={setSkillFilter}
        availableSkills={allSkills}
      />

      <Tabs defaultValue="my-consultants" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="my-consultants">
            Team Consultants ({existingConsultants.length})
          </TabsTrigger>
          <TabsTrigger value="network">Network Consultants ({newConsultants.length})</TabsTrigger>
          <TabsTrigger value="all">All ({consultants.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-consultants" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Team Consultants</h3>
              <p className="text-sm text-gray-600">Shared with your team members</p>
            </div>
            <div className="relative">
              <Button className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Consultant
              </Button>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
          
          <ConsultantGrid
            consultants={filterConsultants(existingConsultants)}
            onViewAnalysis={handleViewAnalysis}
            showEditActions={true}
            showDeleteActions={showDeleteForMyConsultants}
          />
        </TabsContent>
        
        <TabsContent value="network" className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Network Consultants</h3>
            <p className="text-sm text-gray-600">Consultants from the MatchWise network</p>
          </div>
          
          <ConsultantGrid
            consultants={filterConsultants(newConsultants)}
            onViewAnalysis={handleViewAnalysis}
            showEditActions={showEditForNetwork}
            showDeleteActions={true}
          />
        </TabsContent>
        
        <TabsContent value="all" className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">All Consultants</h3>
            <p className="text-sm text-gray-600">All consultants in the platform</p>
          </div>
          
          <ConsultantGrid
            consultants={filterConsultants(consultants)}
            onViewAnalysis={handleViewAnalysis}
            showEditActions={true}
            showDeleteActions={true}
          />
        </TabsContent>
      </Tabs>

      {selectedConsultant && (
        <ConsultantAnalysisModal
          consultant={selectedConsultant}
          open={showAnalysisModal}
          onOpenChange={setShowAnalysisModal}
        />
      )}
    </div>
  );
};
