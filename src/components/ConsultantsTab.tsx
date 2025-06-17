import React, { useState } from 'react';
import { useSupabaseConsultantsWithDemo } from '@/hooks/useSupabaseConsultantsWithDemo';
import ConsultantCard from '@/components/ConsultantCard';
import { ConsultantEditDialog } from '@/components/ConsultantEditDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Upload, Search, Filter, Plus } from 'lucide-react';
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
  const { toast } = useToast();

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
      // Navigate to CV upload page with context that this should go to "My Consultants"
      window.location.href = '/cv-upload?source=my-consultants';
    }
  };

  const handleDeleteConsultant = async (consultantId: string | number) => {
    if (typeof consultantId === 'string' && consultantId.startsWith('my-')) {
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
        .eq('id', consultantId);

      if (error) {
        throw error;
      }

      toast({
        title: "Consultant deleted",
        description: "The consultant has been successfully removed from your team",
      });

      // Refresh the page to update the list
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Consultants</p>
                <p className="text-2xl font-bold">{consultants.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">My Consultants</p>
                <p className="text-2xl font-bold">{existingConsultants.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Upload className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Network Consultants</p>
                <p className="text-2xl font-bold">{newConsultants.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search and Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-48">
              <Input
                placeholder="Filter by skill..."
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
              />
            </div>
          </div>
          
          {/* Popular Skills */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Popular Skills:</p>
            <div className="flex flex-wrap gap-1">
              {allSkills.slice(0, 10).map((skill, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-blue-50"
                  onClick={() => setSkillFilter(skill)}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Consultants List */}
      <Tabs defaultValue="my-consultants" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="my-consultants">My Consultants ({existingConsultants.length})</TabsTrigger>
          <TabsTrigger value="network">Network Consultants ({newConsultants.length})</TabsTrigger>
          <TabsTrigger value="all">All ({consultants.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-consultants" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">My Consultants</h3>
              <p className="text-sm text-gray-600">Consultants in your team</p>
            </div>
            <div className="relative">
              <Button 
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              >
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
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filterConsultants(existingConsultants).map((consultant) => (
              <div key={consultant.id} className="relative">
                <ConsultantCard consultant={consultant} />
                <div className="absolute top-2 right-2 flex gap-1">
                  <ConsultantEditDialog
                    consultant={consultant}
                    onSave={(updated) => updateConsultant(updated)}
                  />
                  {showDeleteForMyConsultants && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteConsultant(consultant.id)}
                      className="h-8 w-8 p-0"
                    >
                      ×
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
          {existingConsultants.length === 0 && (
            <div className="text-center py-12">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No consultants in your team yet</h3>
              <p className="text-gray-600 mb-4">Add consultants to your team by uploading their CVs</p>
              <div className="relative inline-block">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Consultant
                </Button>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="network" className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Network Consultants</h3>
            <p className="text-sm text-gray-600">Consultants from the MatchWise network</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filterConsultants(newConsultants).map((consultant) => (
              <div key={consultant.id} className="relative">
                <ConsultantCard consultant={consultant} />
                {showEditForNetwork && (
                  <div className="absolute top-2 right-2">
                    <ConsultantEditDialog
                      consultant={consultant}
                      onSave={(updated) => updateConsultant(updated)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          {newConsultants.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No network consultants found</p>
              <p className="text-sm text-gray-500">Consultants who upload CVs will appear here</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="all" className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">All Consultants</h3>
            <p className="text-sm text-gray-600">All consultants in the platform</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filterConsultants(consultants).map((consultant) => (
              <div key={consultant.id} className="relative">
                <ConsultantCard consultant={consultant} />
                <div className="absolute top-2 right-2 flex gap-1">
                  {((consultant.type === 'existing' && showEditForNetwork) || 
                    (consultant.type === 'new' && showEditForNetwork)) && (
                    <ConsultantEditDialog
                      consultant={consultant}
                      onSave={(updated) => updateConsultant(updated)}
                    />
                  )}
                  {consultant.type === 'existing' && showDeleteForMyConsultants && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteConsultant(consultant.id)}
                      className="h-8 w-8 p-0"
                    >
                      ×
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
