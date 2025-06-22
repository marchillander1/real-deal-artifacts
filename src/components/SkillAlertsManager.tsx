import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bell, Plus, X, Mail } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface SkillAlert {
  id: string;
  skills: string[];
  email: string;
  active: boolean;
  createdAt: string;
}

export const SkillAlertsManager: React.FC = () => {
  const [alerts, setAlerts] = useState<SkillAlert[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  // Load existing alerts (mockad data för nu)
  useEffect(() => {
    const mockAlerts: SkillAlert[] = [
      {
        id: '1',
        skills: ['React', 'TypeScript'],
        email: 'user@company.com',
        active: true,
        createdAt: '2024-01-15'
      }
    ];
    setAlerts(mockAlerts);
  }, []);

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
      const newAlert: SkillAlert = {
        id: Date.now().toString(),
        skills: [newSkill.trim()],
        email: newEmail.trim(),
        active: true,
        createdAt: new Date().toISOString().split('T')[0]
      };

      setAlerts(prev => [...prev, newAlert]);
      setNewSkill('');
      setNewEmail('');

      toast({
        title: "Skill Alert skapad!",
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

  const handleDeleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    toast({
      title: "Alert borttagen",
      description: "Skill alert har tagits bort",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            Skill Alerts
          </CardTitle>
          <p className="text-gray-600">
            Få email-notifieringar när nya konsulter med specifika skills läggs till
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Create New Alert */}
          <div className="border rounded-lg p-4 bg-blue-50">
            <h4 className="font-medium text-blue-900 mb-3">Skapa ny skill alert</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="t.ex. React, Python, DevOps"
                className="bg-white"
              />
              <Input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="din@email.com"
                className="bg-white"
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
            <h4 className="font-medium text-gray-900">Aktiva alerts ({alerts.length})</h4>
            
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Inga skill alerts skapade ännu</p>
                <p className="text-sm">Skapa din första alert ovan</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <Card key={alert.id} className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{alert.email}</span>
                          <Badge variant="outline" className="text-green-600 border-green-200">
                            Aktiv
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {alert.skills.map((skill, index) => (
                            <Badge key={index} className="bg-blue-100 text-blue-800">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Skapad: {alert.createdAt}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAlert(alert.id)}
                        className="text-gray-400 hover:text-red-600"
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
