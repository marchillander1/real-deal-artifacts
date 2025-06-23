
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Consultant } from '@/types/consultant';
import { ConsultantAnalysisCard } from './ConsultantAnalysisCard';

interface ConsultantFullAnalysisModalProps {
  consultant: Consultant | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ConsultantFullAnalysisModal: React.FC<ConsultantFullAnalysisModalProps> = ({
  consultant,
  isOpen,
  onClose
}) => {
  if (!consultant) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DialogTitle className="text-2xl font-bold">
            Fullständig konsultanalys - {consultant.name}
          </DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="mt-6">
          <ConsultantAnalysisCard consultant={consultant} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
