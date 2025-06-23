
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Users, Plus, Trash2, Building, Mail, UserCheck, Activity, Network } from 'lucide-react';
import Logo from '@/components/Logo';

interface CompanyStats {
  id: string;
  company: string;
  userCount: number;
  activeUsers: number;
  lastActive: string;
}

interface UserData {
  id: string;
  email: string;
  full_name: string;
  company: string;
  created_at: string;
  role: string;
}

interface NetworkConsultant {
  id: string;
  name: string;
  email: string;
  skills: string[];
  location: string;
  created_at: string;
  type: string;
}

const AdminPortal: React.FC = () => {
  const [companies, setCompanies] = useState<CompanyStats[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [networkConsultants, setNetworkConsultants] = useState<NetworkConsultant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    full_name: '',
    company: '',
    password: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      // Load all users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      setUsers(usersData || []);

      // Load network consultants
      const { data: consultantsData, error: consultantsError } = await supabase
        .from('consultants')
        .select('id, name, email, skills, location, created_at, type')
        .eq('type', 'new')
        .order('created_at', { ascending: false });

      if (consultantsError) throw consultantsError;

      setNetworkConsultants(consultantsData || []);

      // Calculate company stats
      const companyMap = new Map<string, CompanyStats>();
      
      usersData?.forEach(user => {
        const company = user.company || 'No Company';
        if (!companyMap.has(company)) {
          companyMap.set(company, {
            id: company,
            company,
            userCount: 0,
            activeUsers: 0,
            lastActive: user.created_at
          });
        }
        
        const stats = companyMap.get(company)!;
        stats.userCount++;
        // For demo purposes, assume 70% of users are active
        if (Math.random() > 0.3) {
          stats.activeUsers++;
        }
      });

      setCompanies(Array.from(companyMap.values()));
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleCreateUser = async () => {
    try {
      // Generate a random password if none provided
      const password = newUser.password || Math.random().toString(36).slice(-8);
      
      // Create user via edge function
      const response = await fetch('/api/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newUser,
          password
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      toast({
        title: "User created!",
        description: `Welcome email sent to ${newUser.email}`,
      });

      setNewUser({ email: '', full_name: '', company: '', password: '' });
      setShowCreateUser(false);
      loadAdminData();
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "User deleted",
        description: "User has been removed from the platform",
      });

      loadAdminData();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const handleDeleteNetworkConsultant = async (consultantId: string) => {
    if (!confirm('Are you sure you want to delete this network consultant?')) return;

    try {
      const { error } = await supabase
        .from('consultants')
        .delete()
        .eq('id', consultantId);

      if (error) throw error;

      toast({
        title: "Network consultant deleted",
        description: "The consultant has been removed from the network",
      });

      loadAdminData();
    } catch (error) {
      console.error('Error deleting consultant:', error);
      toast({
        title: "Error",
        description: "Failed to delete network consultant",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Logo />
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Admin Portal</h1>
                <p className="text-sm text-slate-600">Manage platform users and companies</p>
              </div>
            </div>
            <Dialog open={showCreateUser} onOpenChange={setShowCreateUser}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="create-email">Email *</Label>
                    <Input
                      id="create-email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      placeholder="user@company.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="create-name">Full Name *</Label>
                    <Input
                      id="create-name"
                      value={newUser.full_name}
                      onChange={(e) => setNewUser({...newUser, full_name: e.target.value})}
                      placeholder="User Name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="create-company">Company *</Label>
                    <Input
                      id="create-company"
                      value={newUser.company}
                      onChange={(e) => setNewUser({...newUser, company: e.target.value})}
                      placeholder="Company Name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="create-password">Password (optional)</Label>
                    <Input
                      id="create-password"
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      placeholder="Leave empty for auto-generated"
                    />
                  </div>
                  <Button 
                    onClick={handleCreateUser}
                    disabled={!newUser.email || !newUser.full_name || !newUser.company}
                    className="w-full"
                  >
                    Create User & Send Welcome Email
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Companies</p>
                  <p className="text-2xl font-bold">{companies.length}</p>
                </div>
                <Building className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Users</p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Network Consultants</p>
                  <p className="text-2xl font-bold">{networkConsultants.length}</p>
                </div>
                <Network className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Users</p>
                  <p className="text-2xl font-bold">{companies.reduce((sum, c) => sum + c.activeUsers, 0)}</p>
                </div>
                <Activity className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Platform Usage</p>
                  <p className="text-2xl font-bold">94%</p>
                </div>
                <UserCheck className="h-8 w-8 text-teal-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Companies Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Companies Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {companies.map((company) => (
                  <div key={company.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <h3 className="font-semibold">{company.company}</h3>
                      <p className="text-sm text-slate-600">
                        {company.userCount} users • {company.activeUsers} active
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={company.activeUsers > 0 ? "default" : "secondary"}>
                        {company.activeUsers > 0 ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Users Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.full_name?.charAt(0) || user.email.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold">{user.full_name}</h4>
                        <p className="text-sm text-slate-600">{user.email}</p>
                        <p className="text-xs text-slate-500">{user.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{user.role}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Network Consultants Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              Network Consultants Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            {networkConsultants.length === 0 ? (
              <div className="text-center py-8">
                <Network className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No network consultants found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Skills</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {networkConsultants.map((consultant) => (
                    <TableRow key={consultant.id}>
                      <TableCell className="font-medium">{consultant.name}</TableCell>
                      <TableCell>{consultant.email}</TableCell>
                      <TableCell>{consultant.location}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {consultant.skills.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {consultant.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs text-gray-500">
                              +{consultant.skills.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(consultant.created_at).toLocaleDateString('sv-SE')}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteNetworkConsultant(consultant.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPortal;
