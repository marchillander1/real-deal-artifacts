
import React from 'react';
import { Consultant } from '@/types/consultant';
import { EnhancedConsultantCard } from '@/components/EnhancedConsultantCard';

interface ConsultantGridProps {
  consultants: Consultant[];
  onViewAnalysis: (consultant: Consultant) => void;
}

export const ConsultantGrid: React.FC<ConsultantGridProps> = ({
  consultants,
  onViewAnalysis
}) => {
  if (consultants.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-600">No consultants found</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {consultants.map((consultant) => (
        <div key={consultant.id} onClick={() => onViewAnalysis(consultant)} className="cursor-pointer">
          <EnhancedConsultantCard
            consultant={consultant}
            showAnalysis={false}
          />
        </div>
      ))}
    </div>
  );
};
