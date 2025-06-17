
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ListValuesProps {
  values: string[];
}

export const ListValues: React.FC<ListValuesProps> = ({ values }) => {
  return (
    <div className="flex flex-wrap gap-1">
      {values.map((value, index) => (
        <Badge key={index} variant="outline" className="text-xs">
          {value}
        </Badge>
      ))}
    </div>
  );
};

export default ListValues;
