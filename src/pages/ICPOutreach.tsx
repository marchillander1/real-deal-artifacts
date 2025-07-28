import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const ICPOutreach = () => {
  const [formData, setFormData] = useState({
    recipientEmail: '',
    service: '',
    market: '',
    roles: '',
    tone: '',
    exampleClients: '',
    outputLanguage: 'English'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://matchwise.app.n8n.cloud/webhook/icp-outreach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Your request has been submitted. Check your email soon!');
        setFormData({
          recipientEmail: '',
          service: '',
          market: '',
          roles: '',
          tone: '',
          exampleClients: '',
          outputLanguage: 'English'
        });
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">🚀 AI ICP + Outreach Generator</h1>
          <p className="text-xl mb-4">
            Stop wasting time on generic lead lists.
          </p>
          <p className="text-lg mb-4">
            With this tool, you create a <strong>tailored Ideal Customer Profile (ICP)</strong> and get <strong>real companies and decision-makers</strong> based on your service, market, and target roles.
          </p>
          <div className="space-y-2 mb-6">
            <p className="flex items-center">✔️ Hyper-personalized outreach messages</p>
            <p className="flex items-center">✔️ PDF + CSV report sent directly to your email</p>
            <p className="flex items-center">✔️ AI analysis of buying triggers, funding signals & market trends</p>
          </div>
          <p className="text-lg font-medium">
            👉 <strong>Fill out the form and receive your customized ICP + Outreach package automatically.</strong>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Generate Your ICP + Outreach Report</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="recipientEmail">Your email *</Label>
                <Input
                  id="recipientEmail"
                  type="email"
                  value={formData.recipientEmail}
                  onChange={(e) => handleInputChange('recipientEmail', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="service">Your service / solution *</Label>
                <Input
                  id="service"
                  type="text"
                  value={formData.service}
                  onChange={(e) => handleInputChange('service', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="market">Target market *</Label>
                <Input
                  id="market"
                  type="text"
                  value={formData.market}
                  onChange={(e) => handleInputChange('market', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="roles">Target roles (e.g. CEO, CTO) *</Label>
                <Input
                  id="roles"
                  type="text"
                  value={formData.roles}
                  onChange={(e) => handleInputChange('roles', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tone">Outreach tone</Label>
                <Select value={formData.tone} onValueChange={(value) => handleInputChange('tone', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Warm">Warm</SelectItem>
                    <SelectItem value="Advisory">Advisory</SelectItem>
                    <SelectItem value="Direct">Direct</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="exampleClients">Example clients (optional)</Label>
                <Input
                  id="exampleClients"
                  type="text"
                  value={formData.exampleClients}
                  onChange={(e) => handleInputChange('exampleClients', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="outputLanguage">Preferred report language *</Label>
                <Select value={formData.outputLanguage} onValueChange={(value) => handleInputChange('outputLanguage', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Swedish">Swedish</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Generating Report...' : 'Generate Report'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ICPOutreach;