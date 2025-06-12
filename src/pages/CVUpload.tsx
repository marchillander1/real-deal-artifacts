
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, CheckCircle, AlertCircle, User, Mail, Phone, MapPin, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const CVUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    experience: '',
    skills: '',
    linkedinUrl: '',
    availability: 'Available now'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const parseSkills = (skillsText: string) => {
    return skillsText.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      console.log('🚀 Starting consultant upload...');
      console.log('📝 Form data:', formData);

      // Validate required fields
      if (!formData.name || !formData.email) {
        toast.error('Namn och email är obligatoriska fält');
        return;
      }

      // Parse skills from comma-separated string
      const skillsArray = parseSkills(formData.skills);
      
      // Parse experience years
      const experienceYears = formData.experience ? parseInt(formData.experience) || 0 : 0;

      // Prepare consultant data
      const consultantData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '',
        location: formData.location || 'Stockholm',
        skills: skillsArray,
        experience_years: experienceYears,
        roles: ['Consultant'], // Default role
        hourly_rate: 800, // Default rate
        availability: formData.availability,
        projects_completed: 0,
        rating: 4.5,
        certifications: [],
        languages: ['Swedish', 'English'],
        type: 'new', // Explicitly set to 'new' for network consultants
        linkedin_url: formData.linkedinUrl || '',
        communication_style: 'Professional and collaborative',
        work_style: 'Flexible and results-oriented',
        values: ['Quality', 'Innovation', 'Teamwork'],
        personality_traits: ['Adaptable', 'Problem-solver', 'Team-player'],
        team_fit: 'Strong collaborative skills',
        cultural_fit: 4,
        adaptability: 4,
        leadership: 3
      };

      console.log('💾 Inserting consultant data:', consultantData);

      // Insert consultant into database
      const { data: insertedConsultant, error: insertError } = await supabase
        .from('consultants')
        .insert([consultantData])
        .select()
        .single();

      if (insertError) {
        console.error('❌ Database insert error:', insertError);
        throw new Error(`Database error: ${insertError.message}`);
      }

      console.log('✅ Consultant inserted successfully:', insertedConsultant);

      // Send welcome email (only if email is provided)
      if (formData.email) {
        console.log('📧 Sending welcome email...');
        try {
          const emailResponse = await supabase.functions.invoke('send-welcome-email', {
            body: {
              userEmail: formData.email,
              userName: formData.name
            }
          });

          console.log('📬 Email response:', emailResponse);
          
          if (emailResponse.error) {
            console.warn('⚠️ Email sending failed:', emailResponse.error);
            // Don't fail the entire process if email fails
          } else {
            console.log('✅ Welcome email sent successfully');
          }
        } catch (emailError) {
          console.warn('⚠️ Email error (non-blocking):', emailError);
          // Email failure shouldn't block the process
        }
      }

      setUploadSuccess(true);
      toast.success('Fantastiskt! Din profil har lagts till och du är nu del av vårt nätverk!');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        location: '',
        experience: '',
        skills: '',
        linkedinUrl: '',
        availability: 'Available now'
      });

    } catch (error: any) {
      console.error('❌ Upload error:', error);
      toast.error(error.message || 'Ett fel uppstod vid uppladdning');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      console.log('📄 CV file selected:', file.name);
      toast.success(`CV fil "${file.name}" har valts`);
      // TODO: Implement actual CV parsing when needed
    }
  };

  if (uploadSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Välkommen till MatchWise!</h2>
            <p className="text-gray-600 mb-6">
              Din profil har lagts till framgångsrikt. Du kommer snart att synas för anställande företag på plattformen.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => setUploadSuccess(false)}
                className="w-full"
              >
                Ladda upp en till konsult
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.href = '/matchwiseai'}
              >
                Gå till MatchWise AI
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Gå med i MatchWise Konsultnätverk
            </h1>
            <p className="text-lg text-gray-600">
              Ladda upp din profil och få tillgång till spännande konsultuppdrag
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Konsultprofil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Grundläggande information
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Namn *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Ditt fullständiga namn"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="din.email@exempel.se"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Telefon
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+46 70 123 45 67"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="location" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Plats
                      </Label>
                      <Input
                        id="location"
                        name="location"
                        type="text"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Stockholm"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Professionell bakgrund
                  </h3>
                  
                  <div>
                    <Label htmlFor="experience" className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      År av erfarenhet
                    </Label>
                    <Input
                      id="experience"
                      name="experience"
                      type="number"
                      min="0"
                      max="50"
                      value={formData.experience}
                      onChange={handleInputChange}
                      placeholder="5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="skills">
                      Tekniska färdigheter
                    </Label>
                    <Textarea
                      id="skills"
                      name="skills"
                      value={formData.skills}
                      onChange={handleInputChange}
                      placeholder="React, TypeScript, Node.js, Python, AWS, etc."
                      className="min-h-[100px]"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Separera färdigheter med kommatecken
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="linkedinUrl">
                      LinkedIn profil (valfritt)
                    </Label>
                    <Input
                      id="linkedinUrl"
                      name="linkedinUrl"
                      type="url"
                      value={formData.linkedinUrl}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/ditt-namn"
                    />
                  </div>

                  <div>
                    <Label htmlFor="availability">
                      Tillgänglighet
                    </Label>
                    <Input
                      id="availability"
                      name="availability"
                      type="text"
                      value={formData.availability}
                      onChange={handleInputChange}
                      placeholder="Tillgänglig nu"
                    />
                  </div>
                </div>

                {/* CV Upload Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    CV Upload (Valfritt)
                  </h3>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <div className="relative">
                        <Button type="button" variant="outline" className="relative">
                          <Upload className="h-4 w-4 mr-2" />
                          Välj CV-fil
                        </Button>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        PDF, DOC eller DOCX upp till 10MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700" 
                  size="lg"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Laddar upp...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Skicka in profil
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Right Column - Info */}
          <div className="space-y-6">
            {/* Benefits Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-blue-600">
                  Fördelar med MatchWise
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">AI-driven matchning</h4>
                    <p className="text-sm text-gray-600">
                      Vårt AI matchar dig med uppdrag baserat på dina färdigheter och personlighet
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Kvalitetsuppdrag</h4>
                    <p className="text-sm text-gray-600">
                      Handplockade uppdrag från välrenommerade företag
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Snabb process</h4>
                    <p className="text-sm text-gray-600">
                      Från matchning till uppstart på bara några dagar
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Personlig support</h4>
                    <p className="text-sm text-gray-600">
                      Dedikerad konsultansvarig genom hela processen
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Process Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-purple-600">
                  Så här fungerar det
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">Skicka in din profil</h4>
                    <p className="text-sm text-gray-600">Fyll i formuläret och ladda upp ditt CV</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">AI-analys</h4>
                    <p className="text-sm text-gray-600">Vårt AI analyserar din kompetens och personlighet</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">Matchning</h4>
                    <p className="text-sm text-gray-600">Vi matchar dig med passande uppdrag</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold">Uppstart</h4>
                    <p className="text-sm text-gray-600">Starta ditt nya konsultuppdrag</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
