
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Plus } from 'lucide-react';
import { UnifiedCVUpload } from '../cv-upload/UnifiedCVUpload';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export const CVUploadSection: React.FC = () => {
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const handleUploadComplete = (consultant: any) => {
    console.log('✅ Consultant added to team:', consultant);
    setShowUploadDialog(false);
    
    // Refresh the page to show the new consultant
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Add New Consultant
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Upload a CV to add a new consultant to your team. AI will automatically extract skills, experience, and contact information.
          </p>
          
          <Button 
            onClick={() => setShowUploadDialog(true)}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Consultant to Team
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Consultant to Team</DialogTitle>
          </DialogHeader>
          <UnifiedCVUpload
            isMyConsultant={true}
            onComplete={handleUploadComplete}
            onClose={() => setShowUploadDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
