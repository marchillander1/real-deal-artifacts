
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ListSkillsProps {
  skills: string[];
}

export const ListSkills: React.FC<ListSkillsProps> = ({ skills }) => {
  return (
    <div className="flex flex-wrap gap-1">
      {skills.map((skill, index) => (
        <Badge key={index} variant="secondary" className="text-xs">
          {skill}
        </Badge>
      ))}
    </div>
  );
};

export default ListSkills;
