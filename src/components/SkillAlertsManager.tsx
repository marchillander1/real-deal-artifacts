
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bell, Plus, X, Mail, Settings } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SkillAlert {
  id: string;
  skills: string[];
  email: string;
  active: boolean;
  created_at: string;
}

export const SkillAlertsManager: React.FC = () => {
  const [alerts, setAlerts] = useState<SkillAlert[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load existing alerts from Supabase
  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('skill_alerts')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading alerts:', error);
        toast({
          title: "Fel vid laddning",
          description: "Kunde inte ladda skill alerts",
          variant: "destructive",
        });
        return;
      }

      setAlerts(data || []);
    } catch (error) {
      console.error('Error loading alerts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAlert = async () => {
    if (!newSkill.trim() || !newEmail.trim()) {
      toast({
        title: "Ofullständig information",
        description: "Fyll i både skill och email",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    
    try {
      const { data, error } = await supabase
        .from('skill_alerts')
        .insert([{
          skills: [newSkill.trim()],
          email: newEmail.trim(),
          active: true
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating alert:', error);
        toast({
          title: "Fel vid skapande",
          description: "Kunde inte skapa skill alert",
          variant: "destructive",
        });
        return;
      }

      setAlerts(prev => [data, ...prev]);
      setNewSkill('');
      setNewEmail('');

      toast({
        title: "Skill Alert skapad! 🔔",
        description: `Du kommer få email när nya konsulter med "${newSkill}" läggs till`,
      });
      
    } catch (error) {
      console.error('Error creating alert:', error);
      toast({
        title: "Fel vid skapande",
        description: "Kunde inte skapa skill alert",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('skill_alerts')
        .update({ active: false })
        .eq('id', alertId);

      if (error) {
        console.error('Error deleting alert:', error);
        toast({
          title: "Fel vid borttagning",
          description: "Kunde inte ta bort skill alert",
          variant: "destructive",
        });
        return;
      }

      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
      toast({
        title: "Alert borttagen",
        description: "Skill alert har tagits bort",
      });
    } catch (error) {
      console.error('Error deleting alert:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Laddar skill alerts...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            Smart Skill Alerts
            <Badge variant="outline" className="ml-2">Automatiska</Badge>
          </CardTitle>
          <p className="text-gray-600">
            Få email-notifieringar automatiskt när nya konsulter med specifika skills läggs till i nätverket
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Create New Alert */}
          <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-2 mb-3">
              <Settings className="h-4 w-4 text-blue-600" />
              <h4 className="font-medium text-blue-900">Skapa ny automatisk alert</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="t.ex. React, Python, DevOps"
                className="bg-white border-blue-200 focus:border-blue-400"
              />
              <Input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="din@email.com"
                className="bg-white border-blue-200 focus:border-blue-400"
              />
              <Button
                onClick={handleCreateAlert}
                disabled={isCreating}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                {isCreating ? 'Skapar...' : 'Skapa Alert'}
              </Button>
            </div>
          </div>

          {/* Existing Alerts */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Aktiva alerts ({alerts.length})
            </h4>
            
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Inga skill alerts skapade ännu</p>
                <p className="text-sm">Skapa din första alert ovan för att få automatiska notifieringar</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <Card key={alert.id} className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{alert.email}</span>
                          <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                            🔔 Aktiv
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {alert.skills.map((skill, index) => (
                            <Badge key={index} className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500">
                          Skapad: {new Date(alert.created_at).toLocaleDateString('sv-SE')} • 
                          <span className="text-green-600 ml-1">Automatiska email-alerts aktiverade</span>
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAlert(alert.id)}
                        className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
