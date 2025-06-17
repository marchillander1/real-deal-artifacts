
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ListLanguagesProps {
  languages: string[];
}

export const ListLanguages: React.FC<ListLanguagesProps> = ({ languages }) => {
  return (
    <div className="flex flex-wrap gap-1">
      {languages.map((language, index) => (
        <Badge key={index} variant="default" className="text-xs">
          {language}
        </Badge>
      ))}
    </div>
  );
};

export default ListLanguages;
