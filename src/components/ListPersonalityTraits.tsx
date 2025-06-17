
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ListPersonalityTraitsProps {
  traits: string[];
}

export const ListPersonalityTraits: React.FC<ListPersonalityTraitsProps> = ({ traits }) => {
  return (
    <div className="flex flex-wrap gap-1">
      {traits.map((trait, index) => (
        <Badge key={index} variant="secondary" className="text-xs bg-purple-100 text-purple-800">
          {trait}
        </Badge>
      ))}
    </div>
  );
};

export default ListPersonalityTraits;
