
import React, { useState } from 'react';
import { useSupabaseConsultants } from '@/hooks/useSupabaseConsultants';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Trash2 } from 'lucide-react';
import ConsultantCard from './ConsultantCard';
import { Consultant } from '@/types/consultant';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface ConsultantsTabProps {
  showEditForNetwork?: boolean;
  showDeleteForMyConsultants?: boolean;
  showRemoveDuplicates?: boolean;
}

export const ConsultantsTab: React.FC<ConsultantsTabProps> = ({
  showEditForNetwork = true,
  showDeleteForMyConsultants = false,
  showRemoveDuplicates = true
}) => {
  const { consultants, isLoading } = useSupabaseConsultants();
  const [activeSubTab, setActiveSubTab] = useState<'network' | 'my'>('network');
  const { toast } = useToast();

  // Limit consultants to specific amounts for clean display
  const existingConsultants = consultants.filter(c => c.type === 'existing').slice(0, 5);
  const networkConsultants = consultants.filter(c => c.type === 'new').slice(0, 3);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Consultant Database</h2>
          <p className="text-gray-600">AI-powered consultant profiles with automated skill extraction</p>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="flex space-x-8 mb-8 border-b">
        <button 
          className={`font-medium pb-2 ${activeSubTab === 'network' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveSubTab('network')}
        >
          Network Consultants
        </button>
        <button 
          className={`font-medium pb-2 ${activeSubTab === 'my' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveSubTab('my')}
        >
          My Consultants
        </button>
      </div>

      {/* Network Consultants Tab */}
      {activeSubTab === 'network' && (
        <div>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Network Consultants</h3>
              <p className="text-gray-600">External consultants who joined through our platform</p>
            </div>
            <Badge className="bg-green-100 text-green-800">
              {networkConsultants.length} consultants
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {networkConsultants.map((consultant) => (
              <div key={consultant.id} className="relative">
                <ConsultantCard consultant={consultant} isNew={true} />
              </div>
            ))}
          </div>

          {networkConsultants.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No network consultants yet</h3>
              <p className="text-gray-600">Network consultants will appear here when they upload their CVs</p>
            </div>
          )}
        </div>
      )}

      {/* My Consultants Tab */}
      {activeSubTab === 'my' && (
        <div>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">My Consultants</h3>
              <p className="text-gray-600">Our established team of experienced professionals</p>
            </div>
            <Badge className="bg-blue-100 text-blue-800">
              {existingConsultants.length} consultants
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {existingConsultants.map((consultant) => (
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

          {existingConsultants.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No consultants yet</h3>
              <p className="text-gray-600">Upload CVs to add consultants to your team</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
