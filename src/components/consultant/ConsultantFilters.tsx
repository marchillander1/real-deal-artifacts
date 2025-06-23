
import React from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';

interface ConsultantFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  skillFilter: string;
  onSkillFilterChange: (skill: string) => void;
  availableSkills: string[];
}

export const ConsultantFilters: React.FC<ConsultantFiltersProps> = ({
  searchTerm,
  onSearchChange,
  skillFilter,
  onSkillFilterChange,
  availableSkills
}) => {
  return (
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
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <div className="w-48">
            <Input
              placeholder="Filter by skill..."
              value={skillFilter}
              onChange={(e) => onSkillFilterChange(e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Popular Skills:</p>
          <div className="flex flex-wrap gap-1">
            {availableSkills.slice(0, 10).map((skill, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="cursor-pointer hover:bg-blue-50"
                onClick={() => onSkillFilterChange(skill)}
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
