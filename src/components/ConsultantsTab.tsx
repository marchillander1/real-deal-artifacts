
import React, { useState } from 'react';
import { useSupabaseConsultantsWithDemo } from '@/hooks/useSupabaseConsultantsWithDemo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, MapPin, Clock, Search, Filter, Users, Upload, Award, Trash2, AlertTriangle } from 'lucide-react';
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
  showEditForNetwork = false,
  showDeleteForMyConsultants = false,
  showRemoveDuplicates = false
}) => {
  const { consultants, isLoading, updateConsultant, cleanupNetworkConsultants } = useSupabaseConsultantsWithDemo();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'network' | 'my'>('network');
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const { toast } = useToast();

  // 🎯 IMPORTANT: Filter consultants correctly
  const existingConsultants = consultants.filter(c => c.type === 'existing');
  const networkConsultants = consultants.filter(c => c.type === 'new');

  console.log('🔍 ConsultantsTab Debug:');
  console.log('📊 Total consultants loaded:', consultants.length);
  console.log('📊 Network consultants (type=new):', networkConsultants.length);
  console.log('📊 My consultants (type=existing):', existingConsultants.length);
  console.log('📊 Network consultants:', networkConsultants.map(c => ({ 
    id: c.id, 
    name: c.name, 
    type: c.type, 
    user_id: c.user_id 
  })));

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

  const handleCleanupNetworkConsultants = async () => {
    try {
      setIsCleaningUp(true);
      const result = await cleanupNetworkConsultants();
      
      toast({
        title: "Rensning genomförd",
        description: `${result.deletedCount} network konsulter togs bort, 1 kvar`,
      });
    } catch (error) {
      console.error('Error during cleanup:', error);
      toast({
        title: "Fel",
        description: "Kunde inte rensa network konsulter",
        variant: "destructive",
      });
    } finally {
      setIsCleaningUp(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Navigate to CV upload page with context that this should go to "My Consultants"
      window.location.href = '/cv-upload?source=my-consultants';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const filteredExistingConsultants = existingConsultants.filter(consultant =>
    consultant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consultant.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
    consultant.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredNetworkConsultants = networkConsultants.filter(consultant =>
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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Network Consultants</h3>
                <p className="text-gray-600">External consultants who joined through our platform</p>
              </div>
              <Badge className="bg-green-100 text-green-800">
                {filteredNetworkConsultants.length} consultant{filteredNetworkConsultants.length !== 1 ? 's' : ''}
              </Badge>
            </div>
            
            {/* Cleanup Button */}
            {networkConsultants.length > 1 && (
              <Button 
                onClick={handleCleanupNetworkConsultants}
                disabled={isCleaningUp}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <AlertTriangle className="h-4 w-4" />
                {isCleaningUp ? 'Rensar...' : `Rensa duplicerade (${networkConsultants.length - 1} att ta bort)`}
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNetworkConsultants.map((consultant) => (
              <div key={consultant.id} className="relative">
                <ConsultantCard consultant={consultant} isNew={true} />
              </div>
            ))}
          </div>

          {filteredNetworkConsultants.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No network consultants yet</h3>
              <p className="text-gray-600">Network consultants will appear here when they upload their CVs</p>
              <p className="text-sm text-gray-500 mt-2">
                Total network consultants found: {networkConsultants.length}
              </p>
            </div>
          )}
        </div>
      )}

      {/* My Consultants Tab */}
      {activeSubTab === 'my' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">My Consultants</h3>
                <p className="text-gray-600">Our established team of experienced professionals</p>
              </div>
              <Badge className="bg-blue-100 text-blue-800">
                {filteredExistingConsultants.length} consultants
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
            {filteredExistingConsultants.map((consultant) => (
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

          {filteredExistingConsultants.length === 0 && (
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
