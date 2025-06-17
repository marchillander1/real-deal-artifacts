
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ListRolesProps {
  roles: string[];
}

export const ListRoles: React.FC<ListRolesProps> = ({ roles }) => {
  return (
    <div className="flex flex-wrap gap-1">
      {roles.map((role, index) => (
        <Badge key={index} variant="default" className="text-xs bg-blue-100 text-blue-800">
          {role}
        </Badge>
      ))}
    </div>
  );
};

export default ListRoles;
