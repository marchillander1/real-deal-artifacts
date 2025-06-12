
import React, { useState } from 'react';
import { useSupabaseConsultantsDedup } from '@/hooks/useSupabaseConsultantsDedup';
import ConsultantCard from '@/components/ConsultantCard';
import { ConsultantEditDialog } from '@/components/ConsultantEditDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Upload, Search, Trash2, AlertTriangle } from 'lucide-react';
import { Consultant } from '@/types/consultant';
import { useToast } from '@/hooks/use-toast';

export const EnhancedConsultantsTabDedup: React.FC = () => {
  const { consultants, isLoading, updateConsultant, removeDuplicates } = useSupabaseConsultantsDedup();
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

  const handleRemoveDuplicates = async () => {
    try {
      await removeDuplicates();
      toast({
        title: "Dubletter borttagna",
        description: "Alla dubbletter av konsulter har tagits bort från databasen.",
      });
    } catch (error) {
      toast({
        title: "Fel",
        description: "Kunde inte ta bort dubletter. Försök igen.",
        variant: "destructive",
      });
    }
  };

  const allSkills = [...new Set(consultants.flatMap(c => c.skills))];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats and Duplicate Removal */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Totalt konsulter</p>
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
                <p className="text-sm text-gray-600">Befintliga</p>
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
                <p className="text-sm text-gray-600">Nya</p>
                <p className="text-2xl font-bold">{newConsultants.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <Button 
              onClick={handleRemoveDuplicates} 
              variant="destructive"
              className="w-full flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Ta bort dubletter
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              <AlertTriangle className="h-3 w-3 inline mr-1" />
              Tar bort dubletter baserat på email
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Sök och filtrera
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Sök efter namn eller kompetenser..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-48">
              <Input
                placeholder="Filtrera på kompetens..."
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
              />
            </div>
          </div>
          
          {/* Popular Skills */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Populära kompetenser:</p>
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
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">Alla ({consultants.length})</TabsTrigger>
          <TabsTrigger value="existing">Befintliga ({existingConsultants.length})</TabsTrigger>
          <TabsTrigger value="new">Nya ({newConsultants.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filterConsultants(consultants).map((consultant) => (
              <div key={consultant.id} className="relative">
                <ConsultantCard consultant={consultant} />
                <div className="absolute top-2 right-2">
                  <ConsultantEditDialog
                    consultant={consultant}
                    onSave={(updated) => updateConsultant(updated)}
                  />
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="existing" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filterConsultants(existingConsultants).map((consultant) => (
              <div key={consultant.id} className="relative">
                <ConsultantCard consultant={consultant} />
                <div className="absolute top-2 right-2">
                  <ConsultantEditDialog
                    consultant={consultant}
                    onSave={(updated) => updateConsultant(updated)}
                  />
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="new" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filterConsultants(newConsultants).map((consultant) => (
              <div key={consultant.id} className="relative">
                <ConsultantCard consultant={consultant} />
                <div className="absolute top-2 right-2">
                  <ConsultantEditDialog
                    consultant={consultant}
                    onSave={(updated) => updateConsultant(updated)}
                  />
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
