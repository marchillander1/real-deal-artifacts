
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Phone, MapPin, Edit2, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface JoinNetworkStepProps {
  analysisResult: {
    consultant: any;
    cvAnalysis: any;
    linkedinAnalysis: any;
    extractedPersonalInfo: any;
  };
  onJoinNetwork: () => void;
}

export const JoinNetworkStep: React.FC<JoinNetworkStepProps> = ({
  analysisResult,
  onJoinNetwork
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState({
    name: analysisResult.extractedPersonalInfo?.name || '',
    email: analysisResult.extractedPersonalInfo?.email || '',
    phone: analysisResult.extractedPersonalInfo?.phone || '',
    location: analysisResult.extractedPersonalInfo?.location || ''
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSaveChanges = async () => {
    if (!editedInfo.name || !editedInfo.email) {
      toast.error('Name and email are required');
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('consultants')
        .update({
          name: editedInfo.name,
          email: editedInfo.email,
          phone: editedInfo.phone,
          location: editedInfo.location
        })
        .eq('id', analysisResult.consultant.id);

      if (error) throw error;

      // Update the local state
      analysisResult.extractedPersonalInfo = { ...editedInfo };
      
      setIsEditing(false);
      toast.success('Information updated successfully');
    } catch (error: any) {
      console.error('Error updating consultant info:', error);
      toast.error('Failed to update information');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedInfo({
      name: analysisResult.extractedPersonalInfo?.name || '',
      email: analysisResult.extractedPersonalInfo?.email || '',
      phone: analysisResult.extractedPersonalInfo?.phone || '',
      location: analysisResult.extractedPersonalInfo?.location || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Join the MatchWise Network
          </h2>
          <p className="text-lg text-slate-600">
            Your profile has been analyzed! Review your information below and join our network of top consultants.
          </p>
        </div>

        {/* Personal Information Card */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
            {!isEditing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2"
              >
                <Edit2 className="h-4 w-4" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelEdit}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveChanges}
                  disabled={isUpdating}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isUpdating ? 'Saving...' : 'Save'}
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name *
              </Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={editedInfo.name}
                  onChange={(e) => setEditedInfo({ ...editedInfo, name: e.target.value })}
                  placeholder="Enter your full name"
                />
              ) : (
                <p className="text-slate-900 font-medium">{analysisResult.extractedPersonalInfo?.name || 'Not provided'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address *
              </Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={editedInfo.email}
                  onChange={(e) => setEditedInfo({ ...editedInfo, email: e.target.value })}
                  placeholder="Enter your email address"
                />
              ) : (
                <p className="text-slate-900 font-medium">{analysisResult.extractedPersonalInfo?.email || 'Not provided'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={editedInfo.phone}
                  onChange={(e) => setEditedInfo({ ...editedInfo, phone: e.target.value })}
                  placeholder="Enter your phone number"
                />
              ) : (
                <p className="text-slate-900 font-medium">{analysisResult.extractedPersonalInfo?.phone || 'Not provided'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </Label>
              {isEditing ? (
                <Input
                  id="location"
                  value={editedInfo.location}
                  onChange={(e) => setEditedInfo({ ...editedInfo, location: e.target.value })}
                  placeholder="Enter your location"
                />
              ) : (
                <p className="text-slate-900 font-medium">{analysisResult.extractedPersonalInfo?.location || 'Not provided'}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Analysis Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Analysis Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Experience Level</h3>
                <p className="text-2xl font-bold text-blue-600">{analysisResult.consultant?.experience_years || 0} years</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">Market Rate</h3>
                <p className="text-2xl font-bold text-green-600">{analysisResult.consultant?.market_rate_current || 1000} SEK/h</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-2">Profile Score</h3>
                <p className="text-2xl font-bold text-purple-600">{Math.round(analysisResult.consultant?.profile_completeness || 85)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Join Network Button */}
        <div className="text-center">
          <Button
            onClick={onJoinNetwork}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-12 py-4 text-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Join the MatchWise Network
          </Button>
          <p className="text-sm text-slate-500 mt-4">
            By joining, you'll be visible to companies looking for consultants with your skills and experience.
          </p>
        </div>
      </div>
    </div>
  );
};
