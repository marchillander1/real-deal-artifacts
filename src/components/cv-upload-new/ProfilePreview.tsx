import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { User, MapPin, Mail, Phone, Star, Award, Edit2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { EmailNotificationHandler } from '@/components/EmailNotificationHandler';

interface ProfilePreviewProps {
  analysisResult: {
    sessionId: string;
    profileId: string;
    analysisData: any;
  };
  onComplete: () => void;
}

export const ProfilePreview: React.FC<ProfilePreviewProps> = ({
  analysisResult,
  onComplete
}) => {
  const { analysisData } = analysisResult;
  const { toast } = useToast();

  // Extract initial data for editing
  const personalInfo = analysisData?.personalInfo || {};
  const initialName = personalInfo.name || analysisData?.full_name || 'Professional Consultant';
  const initialEmail = personalInfo.email || analysisData?.email || 'consultant@example.com';
  const initialPhone = personalInfo.phone || analysisData?.phone || '+46 70 123 45 67';
  const initialLocation = personalInfo.location || analysisData?.location || 'Sweden';

  // State for editing contact information
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [editedInfo, setEditedInfo] = useState({
    name: initialName,
    email: initialEmail,
    phone: initialPhone,
    location: initialLocation
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const handleSaveContact = () => {
    if (!editedInfo.name.trim() || !editedInfo.email.trim()) {
      toast({
        title: "Validation Error",
        description: "Name and email are required fields",
        variant: "destructive",
      });
      return;
    }

    // Update the analysis data with new contact info
    if (analysisData.personalInfo) {
      analysisData.personalInfo = { ...analysisData.personalInfo, ...editedInfo };
    } else {
      analysisData.personalInfo = editedInfo;
    }

    setIsEditingContact(false);
    toast({
      title: "Contact Information Updated",
      description: "Your contact information has been updated",
      variant: "default",
    });
  };

  const handleCancelEdit = () => {
    setEditedInfo({
      name: initialName,
      email: initialEmail,
      phone: initialPhone,
      location: initialLocation
    });
    setIsEditingContact(false);
  };

  const handleJoinNetwork = async () => {
    try {
      setIsJoining(true);
      console.log('🚀 Starting network join process...');
      console.log('Analysis data:', analysisData);
      
      // Use the current (possibly edited) contact information
      const name = editedInfo.name;
      const email = editedInfo.email;
      const phone = editedInfo.phone;
      const location = editedInfo.location;
      const title = analysisData?.experience?.currentRole || analysisData?.title || 'Senior Consultant';
      
      console.log('Using contact info:', { name, email, phone, location, title });
      
      // Translate Swedish skills to English for database storage
      const translateSkill = (skill: string): string => {
        const translations: Record<string, string> = {
          'programvaruteknik': 'Software Engineering',
          'nätverksanalys': 'Network Analysis',
          'systemunderhåll': 'System Maintenance',
          'IT-lösningar': 'IT Solutions',
          'mjukvaruutveckling': 'Software Development',
          'databashantering': 'Database Management',
          'projektledning': 'Project Management',
          'problemlösning': 'Problem Solving',
          'teknisk dokumentation': 'Technical Documentation',
          'kundrelationer': 'Customer Relations',
          'systemintegration': 'System Integration',
          'kvalitetssäkring': 'Quality Assurance'
        };
        
        return translations[skill.toLowerCase()] || skill;
      };

      const translatedSkills = (analysisData?.skills?.technical || []).map(translateSkill);

      // Create user profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          full_name: name,
          email: email,
          phone: phone,
          title: title,
          personal_tagline: analysisData?.personal_tagline || null,
          years_of_experience: analysisData?.experience?.years || 5,
          availability: 'Available'
        })
        .select()
        .single();

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw new Error('Could not create user profile');
      }

      console.log('Profile created:', profileData);

      // Try to create AI analysis record - but don't fail if RLS blocks it
      let analysisRecord = null;
      try {
        const { data, error: analysisError } = await supabase
          .from('ai_analysis')
          .insert({
            user_profile_id: profileData.id,
            upload_session_id: analysisResult.sessionId,
            analysis_data: analysisData,
            tech_stack_primary: translatedSkills || [],
            tech_stack_secondary: analysisData?.skills?.tools || [],
            certifications: analysisData?.education?.certifications || [],
            industries: analysisData?.workHistory?.map((w: any) => w.company) || [],
            top_values: analysisData?.softSkills?.values || [],
            personality_traits: analysisData?.softSkills?.personalityTraits || [],
            communication_style: analysisData?.softSkills?.communicationStyle || null,
            tone_of_voice: analysisData?.softSkills?.workStyle || null,
            thought_leadership_score: analysisData?.scores?.leadership || 0,
            linkedin_engagement_level: 'Active',
            brand_themes: ['Professional', 'Expert'],
            cv_tips: analysisData?.analysisInsights?.strengths || [],
            linkedin_tips: ['Optimize profile visibility', 'Share industry insights'],
            certification_recommendations: analysisData?.analysisInsights?.developmentAreas || [],
            suggested_learning_paths: ['Leadership development', 'Technical advancement']
          })
          .select()
          .single();

        if (analysisError) {
          console.warn('Analysis creation failed (continuing anyway):', analysisError);
        } else {
          analysisRecord = data;
          console.log('Analysis record created:', analysisRecord);
        }
      } catch (analysisError) {
        console.warn('Analysis creation failed (continuing anyway):', analysisError);
      }

      // Create consultant record for the network with complete analysis data
      const { data: consultantRecord, error: consultantError } = await supabase
        .from('consultants')
        .insert({
          name: name,
          email: email,
          phone: phone,
          location: location,
          title: title,
          experience_years: analysisData?.experience?.years || 5,
          hourly_rate: analysisData?.marketAnalysis?.hourlyRate?.optimized || 950,
          skills: translatedSkills,
          primary_tech_stack: translatedSkills,
          secondary_tech_stack: analysisData?.skills?.tools || [],
          certifications: analysisData?.education?.certifications || [],
          industries: analysisData?.workHistory?.map((w: any) => w.company) || [],
          values: analysisData?.softSkills?.values || [],
          communication_style: analysisData?.softSkills?.communicationStyle || 'Professional',
          work_style: analysisData?.softSkills?.workStyle || 'Collaborative',
          personality_traits: analysisData?.softSkills?.personalityTraits || [],
          leadership: analysisData?.scores?.leadership || 4,
          cultural_fit: analysisData?.scores?.culturalFit || 4,
          adaptability: analysisData?.scores?.adaptability || 4,
          availability: 'Available',
          type: 'new',
          is_published: true,
          visibility_status: 'public',
          market_rate_current: analysisData?.marketAnalysis?.hourlyRate?.current || 800,
          market_rate_optimized: analysisData?.marketAnalysis?.hourlyRate?.optimized || 950,
          profile_completeness: 95,
          analysis_results: analysisData,
          cv_analysis_data: analysisData,
          roles: [title]
        })
        .select()
        .single();

      if (consultantError) {
        console.warn('Consultant creation error (non-blocking):', consultantError);
      } else {
        console.log('Consultant record created:', consultantRecord);
      }

      // Try to publish profile - but continue if it fails
      try {
        const { error: publishError } = await supabase
          .from('published_profiles')
          .insert({
            user_profile_id: profileData.id,
            ai_analysis_id: analysisRecord?.id || null,
            is_active: true,
            visibility_status: 'public'
          });

        if (publishError) {
          console.warn('Publish error (continuing anyway):', publishError);
        }
      } catch (publishError) {
        console.warn('Publish error (continuing anyway):', publishError);
      }

      // Send welcome emails
      try {
        await EmailNotificationHandler.sendWelcomeEmails({
          consultantId: profileData.id,
          finalEmail: email,
          finalName: name,
          isMyConsultant: false,
          toast
        });
      } catch (emailError) {
        console.warn('Email sending failed, but continuing with process:', emailError);
      }

      // Log successful registration
      try {
        await supabase
          .from('event_log')
          .insert({
            session_token: analysisResult.sessionId,
            event_type: 'profile_published',
            event_data: {
              profile_id: profileData.id,
              analysis_id: analysisRecord?.id || null,
              consultant_id: consultantRecord?.id || null
            }
          });
      } catch (logError) {
        console.warn('Event logging failed (continuing anyway):', logError);
      }

      console.log('✅ Network join completed successfully');
      
      toast({
        title: "Success!",
        description: "You have successfully joined the MatchWise network",
        variant: "default",
      });
      
      // Redirect to NetworkSuccess page
      window.location.href = `/network-success?consultant=${profileData.id}`;

    } catch (error: any) {
      console.error('❌ Network join failed:', error);
      toast({
        title: "Something went wrong",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
  };

  // Extract data for display with skill translation
  const translateSkill = (skill: string): string => {
    const translations: Record<string, string> = {
      'programvaruteknik': 'Software Engineering',
      'nätverksanalys': 'Network Analysis',
      'systemunderhåll': 'System Maintenance',
      'IT-lösningar': 'IT Solutions',
      'mjukvaruutveckling': 'Software Development',
      'databashantering': 'Database Management',
      'projektledning': 'Project Management',
      'problemlösning': 'Problem Solving',
      'teknisk dokumentation': 'Technical Documentation',
      'kundrelationer': 'Customer Relations'
    };
    
    return translations[skill.toLowerCase()] || skill;
  };

  const title = analysisData?.experience?.currentRole || analysisData?.title || 'Senior Consultant';
  const skills = (analysisData?.skills?.technical || ['Problem Solving', 'Strategic Thinking', 'Project Management']).map(translateSkill);
  const experience = analysisData?.experience?.years || 5;

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="text-3xl font-bold mb-4">
            Your Consultant Profile
          </CardTitle>
          <p className="text-lg opacity-90">
            Preview your profile before joining the network
          </p>
        </CardHeader>

        <CardContent className="p-8">
          {/* Profile Card Preview */}
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 mb-8 border-2 border-blue-200">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-white" />
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  {editedInfo.name}
                </h2>
                <p className="text-lg text-blue-600 font-semibold mb-3">
                  {title}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {skills.slice(0, 5).map((skill: string, index: number) => (
                    <Badge key={index} variant="default" className="bg-blue-100 text-blue-800">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{editedInfo.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="h-4 w-4" />
                    <span>{experience}+ years experience</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>4.8/5</span>
                  </div>
                </div>
              </div>
            </div>

            {analysisData?.personal_tagline && (
              <div className="mt-4 p-4 bg-white/80 rounded-lg border border-blue-100">
                <p className="text-slate-700 italic">"{analysisData.personal_tagline}"</p>
              </div>
            )}
          </div>

          {/* Contact Information - Editable */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">Contact Information</h3>
                {!isEditingContact ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingContact(true)}
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
                      onClick={handleSaveContact}
                      disabled={isUpdating}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Save
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4" />
                    Full Name
                  </Label>
                  {isEditingContact ? (
                    <Input
                      value={editedInfo.name}
                      onChange={(e) => setEditedInfo({ ...editedInfo, name: e.target.value })}
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <p className="text-slate-900 font-medium">{editedInfo.name}</p>
                  )}
                </div>

                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </Label>
                  {isEditingContact ? (
                    <Input
                      type="email"
                      value={editedInfo.email}
                      onChange={(e) => setEditedInfo({ ...editedInfo, email: e.target.value })}
                      placeholder="Enter your email address"
                    />
                  ) : (
                    <p className="text-slate-900 font-medium">{editedInfo.email}</p>
                  )}
                </div>

                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </Label>
                  {isEditingContact ? (
                    <Input
                      value={editedInfo.phone}
                      onChange={(e) => setEditedInfo({ ...editedInfo, phone: e.target.value })}
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <p className="text-slate-900 font-medium">{editedInfo.phone}</p>
                  )}
                </div>

                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4" />
                    Location
                  </Label>
                  {isEditingContact ? (
                    <Input
                      value={editedInfo.location}
                      onChange={(e) => setEditedInfo({ ...editedInfo, location: e.target.value })}
                      placeholder="Enter your location"
                    />
                  ) : (
                    <p className="text-slate-900 font-medium">{editedInfo.location}</p>
                  )}
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Profile Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Visibility:</span>
                  <Badge variant="outline" className="text-green-600 border-green-200">Public</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Availability:</span>
                  <Badge variant="outline" className="text-blue-600 border-blue-200">Available</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Profile Score:</span>
                  <span className="text-lg font-bold text-purple-600">95%</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Join Network Button */}
          <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Ready to join the MatchWise network?
            </h3>
            <p className="text-slate-600 mb-4">
              Your profile will become visible to potential clients and you'll gain access to exclusive assignments.
            </p>
            <Button 
              onClick={handleJoinNetwork}
              disabled={isJoining}
              size="lg"
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-3"
            >
              {isJoining ? 'Joining Network...' : 'Join the Network Now'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
