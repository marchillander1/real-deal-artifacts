
import React, { useState } from 'react';
import { useSupabaseConsultants } from '@/hooks/useSupabaseConsultants';
import { ConsultantCard } from '@/components/ConsultantCard';
import { ConsultantEditDialog } from '@/components/ConsultantEditDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Upload, Search, Filter } from 'lucide-react';
import { Consultant } from '@/types/consultant';

export const EnhancedConsultantsTab: React.FC = () => {
  const { consultants, isLoading, updateConsultant } = useSupabaseConsultants();
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('');

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
                <p className="text-sm text-gray-600">Network konsulter</p>
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
      <Tabs defaultValue="network" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="network">Network konsulter ({newConsultants.length})</TabsTrigger>
          <TabsTrigger value="existing">Befintliga ({existingConsultants.length})</TabsTrigger>
          <TabsTrigger value="all">Alla ({consultants.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="network" className="space-y-4">
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
          {newConsultants.length === 0 && (
            <div className="text-center py-8">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Inga network konsulter hittades</p>
              <p className="text-sm text-gray-500">Konsulter som laddar upp CV kommer visas här</p>
            </div>
          )}
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
      </Tabs>
    </div>
  );
};
