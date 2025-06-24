import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Bell, Plus, Trash2 } from 'lucide-react';

interface SkillAlert {
  id: string;
  skills: string[];
  email: string;
  active: boolean;
  created_at: string;
}

interface SkillAlertsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SkillAlertsDialog: React.FC<SkillAlertsDialogProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<SkillAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newSkills, setNewSkills] = useState<string[]>([]);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (isOpen && user) {
      loadAlerts();
      setEmail(user.email || '');
    }
  }, [isOpen, user]);

  const loadAlerts = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('skill_alerts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error('Error loading skill alerts:', error);
      toast({
        title: "Error loading alerts",
        description: "Could not load your skill alerts.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const addSkill = () => {
    if (newSkill.trim() && !newSkills.includes(newSkill.trim())) {
      setNewSkills([...newSkills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setNewSkills(newSkills.filter(s => s !== skill));
  };

  const createAlert = async () => {
    if (!user || newSkills.length === 0 || !email) return;
    
    try {
      const { error } = await supabase
        .from('skill_alerts')
        .insert([{
          user_id: user.id,
          skills: newSkills,
          email: email,
          active: true
        }]);

      if (error) throw error;

      toast({
        title: "Skill alert created!",
        description: `You'll be notified when consultants with skills: ${newSkills.join(', ')} are added.`,
      });

      setNewSkills([]);
      loadAlerts();
    } catch (error) {
      console.error('Error creating skill alert:', error);
      toast({
        title: "Error creating alert",
        description: "Could not create the skill alert.",
        variant: "destructive",
      });
    }
  };

  const toggleAlert = async (alertId: string, active: boolean) => {
    try {
      const { error } = await supabase
        .from('skill_alerts')
        .update({ active })
        .eq('id', alertId);

      if (error) throw error;

      setAlerts(alerts.map(alert => 
        alert.id === alertId ? { ...alert, active } : alert
      ));

      toast({
        title: active ? "Alert activated" : "Alert deactivated",
        description: active ? "You'll receive notifications again." : "Notifications paused.",
      });
    } catch (error) {
      console.error('Error toggling alert:', error);
    }
  };

  const deleteAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('skill_alerts')
        .delete()
        .eq('id', alertId);

      if (error) throw error;

      setAlerts(alerts.filter(alert => alert.id !== alertId));
      toast({
        title: "Alert deleted",
        description: "The skill alert has been removed.",
      });
    } catch (error) {
      console.error('Error deleting alert:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Skill Alerts
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Create New Alert */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Create New Alert</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <Label>Skills to Monitor</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <Button type="button" onClick={addSkill} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newSkills.map((skill, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="cursor-pointer" 
                      onClick={() => removeSkill(skill)}
                    >
                      {skill} ✕
                    </Badge>
                  ))}
                </div>
              </div>

              <Button 
                onClick={createAlert} 
                disabled={newSkills.length === 0 || !email}
                className="w-full"
              >
                Create Alert
              </Button>
            </CardContent>
          </Card>

          {/* Existing Alerts */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Your Active Alerts</h3>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : alerts.length > 0 ? (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <Card key={alert.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex flex-wrap gap-1 mb-2">
                            {alert.skills.map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-sm text-gray-600">{alert.email}</p>
                          <p className="text-xs text-gray-500">
                            Created {new Date(alert.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={alert.active}
                            onCheckedChange={(checked) => toggleAlert(alert.id, checked)}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteAlert(alert.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">No skill alerts yet</p>
                <p className="text-sm text-gray-500">
                  Create an alert to get notified when consultants with specific skills join the network
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
