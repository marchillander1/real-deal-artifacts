
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ListCertificationsProps {
  certifications: string[];
}

export const ListCertifications: React.FC<ListCertificationsProps> = ({ certifications }) => {
  return (
    <div className="flex flex-wrap gap-1">
      {certifications.map((cert, index) => (
        <Badge key={index} variant="outline" className="text-xs bg-green-50 text-green-800 border-green-200">
          {cert}
        </Badge>
      ))}
    </div>
  );
};

export default ListCertifications;
