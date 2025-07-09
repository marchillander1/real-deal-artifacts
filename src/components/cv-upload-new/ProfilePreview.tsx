
import React, { useState } from 'react';
import { User, Edit, Check, X, Star, MapPin, Mail, Phone, Linkedin, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

interface ProfilePreviewProps {
  analysisData: any;
  onEditProfile: () => void;
  onConfirmProfile: () => void;
}

export const ProfilePreview: React.FC<ProfilePreviewProps> = ({
  analysisData,
  onEditProfile,
  onConfirmProfile
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(analysisData);

  const handleSave = () => {
    setIsEditing(false);
    // Update the analysis data with edited values, including the updated email
    Object.assign(analysisData, editedData);
    
    // Specifically ensure the email change is reflected in personalInfo
    if (editedData.personalInfo?.email) {
      analysisData.personalInfo.email = editedData.personalInfo.email;
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(analysisData);
  };

  // Extract data safely with fallbacks
  const personalInfo = analysisData?.personalInfo || {};
  const experience = analysisData?.experience || {};
  const skills = analysisData?.skills || {};

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader className="text-center bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
          <div className="flex items-center justify-center mb-4">
            <User className="h-16 w-16" />
          </div>
          <CardTitle className="text-3xl font-bold mb-4">
            Review Your Profile
          </CardTitle>
          <p className="text-lg opacity-90">
            Make any final adjustments before publishing your consultant profile
          </p>
        </CardHeader>

        <CardContent className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Profile Preview</h2>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700">
                    <Check className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button onClick={handleCancel} variant="outline" size="sm">
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>

          {/* Profile Content */}
          <div className="space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={editedData.personalInfo?.name || ''}
                        onChange={(e) => setEditedData({
                          ...editedData,
                          personalInfo: { ...editedData.personalInfo, name: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        value={editedData.personalInfo?.email || ''}
                        onChange={(e) => setEditedData({
                          ...editedData,
                          personalInfo: { ...editedData.personalInfo, email: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input
                        value={editedData.personalInfo?.phone || ''}
                        onChange={(e) => setEditedData({
                          ...editedData,
                          personalInfo: { ...editedData.personalInfo, phone: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input
                        value={editedData.personalInfo?.location || ''}
                        onChange={(e) => setEditedData({
                          ...editedData,
                          personalInfo: { ...editedData.personalInfo, location: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>{personalInfo.name || 'Name not provided'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{personalInfo.email || 'Email not provided'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{personalInfo.phone || 'Phone not provided'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{personalInfo.location || 'Location not provided'}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(skills.technical || []).map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Experience */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Current Role:</strong> {experience.currentRole || 'Not specified'}</p>
                  <p><strong>Years of Experience:</strong> {experience.years || 0}</p>
                  <p><strong>Level:</strong> {experience.level || 'Not specified'}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-slate-200 mt-8">
            <Button
              onClick={onEditProfile}
              variant="outline"
              size="lg"
              className="px-6 py-3"
            >
              Back to Edit
            </Button>
            
            <Button
              onClick={onConfirmProfile}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl"
            >
              Confirm Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
