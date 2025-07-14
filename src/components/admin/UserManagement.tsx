
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Edit, Users, UserPlus } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  full_name: string;
  company?: string;
  role: string;
  status: string;
  created_at: string;
  access_matchwiseai?: boolean;
  access_talent_activation?: boolean;
}

export const UserManagement: React.FC = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    company: '',
    role: 'user',
    password: '',
    access_matchwiseai: true,
    access_talent_activation: false
  });
  const queryClient = useQueryClient();

  // Fetch users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_management')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as User[];
    },
  });

  // Add user mutation
  const addUserMutation = useMutation({
    mutationFn: async (userData: typeof formData) => {
      // Use the create-user edge function which handles everything
      const { data, error } = await supabase.functions.invoke('create-user', {
        body: {
          email: userData.email,
          full_name: userData.full_name,
          company: userData.company,
          password: userData.password,
          access_matchwiseai: userData.access_matchwiseai,
          access_talent_activation: userData.access_talent_activation
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setShowAddDialog(false);
      setFormData({
        email: '',
        full_name: '',
        company: '',
        role: 'user',
        password: '',
        access_matchwiseai: true,
        access_talent_activation: false
      });
      toast.success('Användare har lagts till');
    },
    onError: (error: any) => {
      // Try to extract the actual error message from the edge function response
      console.error('Full error object:', error);
      
      let errorMessage = 'Okänt fel uppstod';
      
      // Check if the error has a message property
      if (error?.message) {
        errorMessage = error.message;
      } 
      // Check if it's a response error with data
      else if (error?.error) {
        errorMessage = error.error;
      }
      // Check if it's a string error
      else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast.error('Fel vid tillägg av användare: ' + errorMessage);
    }
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('user_management')
        .delete()
        .eq('id', userId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Användare har tagits bort');
    },
    onError: (error) => {
      toast.error('Fel vid borttagning: ' + error.message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addUserMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <CardTitle>Användarhantering</CardTitle>
            </div>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Lägg till användare
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Lägg till ny användare</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="email">E-post</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="full_name">Fullständigt namn</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Företag</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Lösenord</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Roll</Label>
                    <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">Användare</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Åtkomstbehörigheter</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="access_matchwiseai"
                          checked={formData.access_matchwiseai}
                          onCheckedChange={(checked) => 
                            setFormData(prev => ({ ...prev, access_matchwiseai: !!checked }))
                          }
                        />
                        <Label htmlFor="access_matchwiseai" className="text-sm font-normal">
                          Åtkomst till MatchWise AI
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="access_talent_activation"
                          checked={formData.access_talent_activation}
                          onCheckedChange={(checked) => 
                            setFormData(prev => ({ ...prev, access_talent_activation: !!checked }))
                          }
                        />
                        <Label htmlFor="access_talent_activation" className="text-sm font-normal">
                          Åtkomst till Talent Activation
                        </Label>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                      Avbryt
                    </Button>
                    <Button type="submit" disabled={addUserMutation.isPending}>
                      {addUserMutation.isPending ? 'Lägger till...' : 'Lägg till'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Laddar användare...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Namn</TableHead>
                  <TableHead>E-post</TableHead>
                  <TableHead>Företag</TableHead>
                  <TableHead>Roll</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Skapad</TableHead>
                  <TableHead>Åtgärder</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.full_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.company || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role === 'admin' ? 'Admin' : 'Användare'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                        {user.status === 'active' ? 'Aktiv' : 'Inaktiv'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString('sv-SE')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Ta bort användare</AlertDialogTitle>
                              <AlertDialogDescription>
                                Är du säker på att du vill ta bort {user.full_name}? Denna åtgärd kan inte ångras.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Avbryt</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteUserMutation.mutate(user.id)}
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
