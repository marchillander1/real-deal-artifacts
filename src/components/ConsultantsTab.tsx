
import React, { useState } from 'react';
import { useSupabaseConsultantsWithDemo } from '@/hooks/useSupabaseConsultantsWithDemo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Users, Upload, Search, Trash2 } from 'lucide-react';
import ConsultantCard from './ConsultantCard';
import { Consultant } from '@/types/consultant';
import { ConsultantEditDialog } from './ConsultantEditDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface ConsultantsTabProps {
  showEditForNetwork?: boolean;
  showDeleteForMyConsultants?: boolean;
  showRemoveDuplicates?: boolean;
}

export const ConsultantsTab: React.FC<ConsultantsTabProps> = ({
  showDeleteForMyConsultants = false
}) => {
  const { consultants, isLoading, updateConsultant } = useSupabaseConsultantsWithDemo();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  // All consultants are now "My Consultants" since we removed network consultants
  const myConsultants = consultants.filter(c => c.type === 'existing');

  console.log('🔍 ConsultantsTab Debug:');
  console.log('📊 Total consultants loaded:', consultants.length);
  console.log('📊 My consultants (type=existing):', myConsultants.length);

  const handleDeleteConsultant = async (consultantId: string | number) => {
    try {
      const { error } = await supabase
        .from('consultants')
        .delete()
        .eq('id', String(consultantId));

      if (error) {
        console.error('Error deleting consultant:', error);
        toast({
          title: "Error",
          description: "Failed to delete consultant",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Consultant deleted successfully",
      });
      
      // Refresh the data
      window.location.reload();
    } catch (error) {
      console.error('Error deleting consultant:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Navigate to CV upload page which will add to "My Consultants"
      window.location.href = '/cv-upload';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const filteredMyConsultants = myConsultants.filter(consultant =>
    consultant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consultant.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
    consultant.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Consultant Database</h2>
          <p className="text-gray-600">AI-powered consultant profiles with automated skill extraction</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search consultants by name, skills, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* My Consultants Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">My Consultants</h3>
              <p className="text-gray-600">Our team of experienced professionals with CV analysis</p>
            </div>
            <Badge className="bg-blue-100 text-blue-800">
              {filteredMyConsultants.length} consultant{filteredMyConsultants.length !== 1 ? 's' : ''}
            </Badge>
          </div>
          
          {/* Upload CV Button */}
          <div className="relative">
            <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload CV
            </Button>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMyConsultants.map((consultant) => (
            <div key={consultant.id} className="relative">
              <ConsultantCard consultant={consultant} isNew={false} />
              {showDeleteForMyConsultants && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 h-8 w-8 p-0"
                  onClick={() => handleDeleteConsultant(consultant.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {filteredMyConsultants.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No consultants yet</h3>
            <p className="text-gray-600">Upload CVs to add consultants to your team. All CV analysis will be preserved.</p>
          </div>
        )}
      </div>
    </div>
  );
};
