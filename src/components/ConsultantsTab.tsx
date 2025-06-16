
import React, { useState } from 'react';
import { useSupabaseConsultantsDedup } from '@/hooks/useSupabaseConsultantsDedup';
import ConsultantCard from '@/components/ConsultantCard';
import { ConsultantEditDialog } from '@/components/ConsultantEditDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Upload, Trash2, AlertTriangle } from 'lucide-react';
import { Consultant } from '@/types/consultant';
import { useToast } from '@/hooks/use-toast';

export const ConsultantsTab: React.FC = () => {
  const { consultants, isLoading, updateConsultant, removeDuplicates } = useSupabaseConsultantsDedup();
  const { toast } = useToast();

  // Filter consultants based on type - show network consultants (new) and existing consultants separately
  const existingConsultants = consultants.filter(c => c.type === 'existing');
  const networkConsultants = consultants.filter(c => c.type === 'new');

  const handleRemoveDuplicates = async () => {
    try {
      await removeDuplicates();
      toast({
        title: "Duplicates removed",
        description: "All duplicate consultants have been removed from the database.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not remove duplicates. Please try again.",
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
    <div className="space-y-6">
      {/* Header with Stats and Duplicate Removal */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total consultants</p>
                <p className="text-2xl font-bold">{consultants.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">My consultants</p>
                <p className="text-2xl font-bold">{existingConsultants.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Upload className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Network consultants</p>
                <p className="text-2xl font-bold">{networkConsultants.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <Button 
              onClick={handleRemoveDuplicates} 
              variant="destructive"
              className="w-full flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Remove duplicates
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              <AlertTriangle className="h-3 w-3 inline mr-1" />
              Removes duplicates based on email
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Consultants List */}
      <Tabs defaultValue="network" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="network">Network consultants ({networkConsultants.length})</TabsTrigger>
          <TabsTrigger value="mine">My consultants ({existingConsultants.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="network" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {networkConsultants.map((consultant) => (
              <div key={consultant.id} className="relative">
                <ConsultantCard consultant={consultant} />
                <div className="absolute top-2 right-2">
                  <ConsultantEditDialog
                    consultant={consultant}
                    onSave={(updated) => updateConsultant(updated)}
                  />
                </div>
              </div>
            ))}
          </div>
          {networkConsultants.length === 0 && (
            <div className="text-center py-8">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No network consultants found</p>
              <p className="text-sm text-gray-500">Consultants who upload their CV will appear here</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="mine" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {existingConsultants.map((consultant) => (
              <div key={consultant.id} className="relative">
                <ConsultantCard consultant={consultant} />
                <div className="absolute top-2 right-2">
                  <ConsultantEditDialog
                    consultant={consultant}
                    onSave={(updated) => updateConsultant(updated)}
                  />
                </div>
              </div>
            ))}
          </div>
          {existingConsultants.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No personal consultants found</p>
              <p className="text-sm text-gray-500">Your existing consultants will appear here</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
