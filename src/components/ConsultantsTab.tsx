
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, Plus, MapPin, Star, Clock, Phone, Mail } from "lucide-react";
import ConsultantCard from "./ConsultantCard";
import { useSupabaseConsultants } from "@/hooks/useSupabaseConsultants";

export const ConsultantsTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const { consultants, isLoading, error } = useSupabaseConsultants();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Laddar konsulter...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Fel vid hämtning av konsulter</div>
      </div>
    );
  }

  // Get all unique skills
  const allSkills = Array.from(new Set(consultants.flatMap(c => c.skills)));

  // Filter consultants
  const filteredConsultants = consultants.filter(consultant => {
    const matchesSearch = consultant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultant.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSkills = selectedSkills.length === 0 || 
                         selectedSkills.some(skill => consultant.skills.includes(skill));
    
    return matchesSearch && matchesSkills;
  });

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Konsulter</h2>
          <p className="text-gray-600 mt-1">{consultants.length} konsulter tillgängliga</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Lägg till konsult
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Sök konsulter eller kompetenser..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Skill filters */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filtrera på kompetenser:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {allSkills.slice(0, 15).map((skill, index) => (
                  <Badge
                    key={`skill-${index}`}
                    variant={selectedSkills.includes(skill) ? "default" : "secondary"}
                    className="cursor-pointer hover:bg-blue-100"
                    onClick={() => toggleSkill(skill)}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        Visar {filteredConsultants.length} av {consultants.length} konsulter
      </div>

      {/* Consultants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredConsultants.map((consultant) => (
          <ConsultantCard key={consultant.id} consultant={consultant} />
        ))}
      </div>

      {filteredConsultants.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">Inga konsulter hittades</div>
          <p className="text-gray-400 mt-2">Prova att ändra dina sökkriterier</p>
        </div>
      )}
    </div>
  );
};
