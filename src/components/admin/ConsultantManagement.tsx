
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, Eye, Users2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Consultant {
  id: string;
  name: string;
  email: string;
  title?: string;
  location?: string;
  skills: string[];
  experience_years?: number;
  availability: string;
  is_published: boolean;
  created_at: string;
}

export const ConsultantManagement: React.FC = () => {
  const queryClient = useQueryClient();

  // Fetch consultants
  const { data: consultants = [], isLoading } = useQuery({
    queryKey: ['admin-consultants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('consultants')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Consultant[];
    },
  });

  // Delete consultant mutation
  const deleteConsultantMutation = useMutation({
    mutationFn: async (consultantId: string) => {
      const { error } = await supabase
        .from('consultants')
        .delete()
        .eq('id', consultantId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-consultants'] });
      toast.success('Konsult har tagits bort');
    },
    onError: (error) => {
      toast.error('Fel vid borttagning: ' + error.message);
    }
  });

  // Toggle publish status mutation
  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, is_published }: { id: string; is_published: boolean }) => {
      const { error } = await supabase
        .from('consultants')
        .update({ is_published: !is_published })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-consultants'] });
      toast.success('Publiceringsstatus uppdaterad');
    },
    onError: (error) => {
      toast.error('Fel vid uppdatering: ' + error.message);
    }
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Users2 className="h-5 w-5" />
            <CardTitle>Konsulthantering</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Laddar konsulter...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Namn</TableHead>
                  <TableHead>E-post</TableHead>
                  <TableHead>Titel</TableHead>
                  <TableHead>Plats</TableHead>
                  <TableHead>Erfarenhet</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Publicerad</TableHead>
                  <TableHead>Registrerad</TableHead>
                  <TableHead>Åtgärder</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consultants.map((consultant) => (
                  <TableRow key={consultant.id}>
                    <TableCell className="font-medium">{consultant.name}</TableCell>
                    <TableCell>{consultant.email}</TableCell>
                    <TableCell>{consultant.title || '-'}</TableCell>
                    <TableCell>{consultant.location || '-'}</TableCell>
                    <TableCell>
                      {consultant.experience_years ? `${consultant.experience_years} år` : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={consultant.availability === 'Available' ? 'default' : 'secondary'}>
                        {consultant.availability}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={consultant.is_published ? 'default' : 'secondary'}>
                        {consultant.is_published ? 'Publicerad' : 'Dold'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(consultant.created_at).toLocaleDateString('sv-SE')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => togglePublishMutation.mutate({
                            id: consultant.id,
                            is_published: consultant.is_published
                          })}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Ta bort konsult</AlertDialogTitle>
                              <AlertDialogDescription>
                                Är du säker på att du vill ta bort {consultant.name}? Denna åtgärd kan inte ångras.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Avbryt</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteConsultantMutation.mutate(consultant.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Ta bort
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
