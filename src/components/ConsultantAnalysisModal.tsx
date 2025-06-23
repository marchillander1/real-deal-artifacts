
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Consultant } from '@/types/consultant';
import { ConsultantAnalysisCard } from './ConsultantAnalysisCard';

interface ConsultantAnalysisModalProps {
  consultant: Consultant | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ConsultantAnalysisModal: React.FC<ConsultantAnalysisModalProps> = ({
  consultant,
  isOpen,
  onClose
}) => {
  if (!consultant) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold">
            Analys för {consultant.name}
          </DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="mt-4">
          <ConsultantAnalysisCard consultant={consultant} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
