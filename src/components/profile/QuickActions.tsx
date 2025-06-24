
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  Share2, 
  FileText, 
  MessageSquare,
  Calendar,
  BarChart3,
  Settings,
  HelpCircle
} from 'lucide-react';

interface QuickActionsProps {
  consultant: any;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ consultant }) => {
  const handleExportProfile = () => {
    // Implementation for exporting profile
    console.log('Exporting profile...');
  };

  const handleShareProfile = () => {
    // Implementation for sharing profile
    navigator.clipboard.writeText(`${window.location.origin}/consultant/${consultant.id}`);
  };

  const handleViewAnalytics = () => {
    // Implementation for viewing analytics
    console.log('Viewing analytics...');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Snabbåtgärder</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExportProfile}
            className="flex items-center justify-start"
          >
            <Download className="h-4 w-4 mr-2" />
            Ladda ner CV
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleShareProfile}
            className="flex items-center justify-start"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Dela profil
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleViewAnalytics}
            className="flex items-center justify-start"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Visa statistik
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center justify-start"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Boka möte
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center justify-start"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Meddelanden
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center justify-start"
          >
            <Settings className="h-4 w-4 mr-2" />
            Inställningar
          </Button>
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <Button 
            variant="ghost" 
            size="sm"
            className="w-full flex items-center justify-center text-gray-600"
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            Behöver du hjälp?
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
