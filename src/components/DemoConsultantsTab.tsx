
import React, { useState } from 'react';
import { useDemoConsultants } from '@/hooks/useDemoConsultants';
import ConsultantCard from '@/components/ConsultantCard';
import { ConsultantEditDialog } from '@/components/ConsultantEditDialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Search, Star, TrendingUp } from 'lucide-react';
import { Consultant } from '@/types/consultant';

export const DemoConsultantsTab: React.FC = () => {
  const { consultants, isLoading, updateConsultant } = useDemoConsultants();
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('');

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
  const avgRating = consultants.length > 0 ? (consultants.reduce((sum, c) => sum + c.rating, 0) / consultants.length).toFixed(1) : '0';

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
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Demo konsulter</p>
                <p className="text-2xl font-bold">{consultants.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Genomsnittligt betyg</p>
                <p className="text-2xl font-bold">{avgRating}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Tillgängliga</p>
                <p className="text-2xl font-bold">{consultants.filter(c => c.availability === 'Available').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">AI-analyserade</p>
                <p className="text-2xl font-bold">{consultants.filter(c => c.cvAnalysis || c.linkedinAnalysis).length}</p>
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
            Sök och filtrera demo-konsulter
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
            <p className="text-sm text-gray-600">Tillgängliga kompetenser:</p>
            <div className="flex flex-wrap gap-1">
              {allSkills.slice(0, 12).map((skill, index) => (
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

      {/* Demo Notice */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <p className="text-sm text-blue-800">
            <Star className="inline h-4 w-4 mr-1" />
            Detta är demo-konsulter med komplett AI-analys för att visa systemets fulla potential
          </p>
        </CardContent>
      </Card>

      {/* Consultants Grid */}
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

      {filterConsultants(consultants).length === 0 && (
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Inga konsulter hittades som matchar din sökning</p>
          <p className="text-sm text-gray-500">Prova att ändra sökkriterier eller filter</p>
        </div>
      )}
    </div>
  );
};
