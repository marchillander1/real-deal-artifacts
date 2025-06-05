
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle, User, Mail, Phone, MapPin, Calendar, Star, Award, Languages, Code, Briefcase } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export const CVUpload = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      processCV(file);
    }
  };

  const processCV = async (file: File) => {
    setIsProcessing(true);
    
    // Simulate CV processing with realistic data
    setTimeout(() => {
      const mockData = {
        name: "Anna Andersson",
        email: "anna.andersson@email.com",
        phone: "+46 70 123 45 67",
        location: "Stockholm, Sverige",
        skills: ["React", "TypeScript", "Node.js", "AWS", "Python", "Docker"],
        experience: "7 years",
        roles: ["Senior Fullstack Developer", "Tech Lead"],
        rate: "950 SEK",
        availability: "Available in 2 weeks",
        projects: 15,
        rating: 4.7,
        lastActive: "Today",
        certifications: ["AWS Certified", "Scrum Master"],
        languages: ["Swedish", "English", "German"],
        communicationStyle: "Direct and collaborative",
        workStyle: "Agile and iterative",
        values: ["Innovation", "Quality", "Teamwork", "Learning"],
        personalityTraits: ["Analytical", "Creative", "Leadership-oriented", "Detail-focused"],
        teamFit: "Excellent team player with strong mentoring skills",
        culturalFit: 4.5,
        adaptability: 4.3,
        leadership: 4.1
      };
      
      setExtractedData(mockData);
      setIsProcessing(false);
    }, 3000);
  };

  const handleSaveConsultant = async () => {
    if (!extractedData) return;
    
    setIsUploading(true);
    
    try {
      const consultantData = {
        name: extractedData.name,
        email: extractedData.email,
        phone: extractedData.phone,
        skills: extractedData.skills,
        experience_years: parseInt(extractedData.experience) || 7,
        roles: extractedData.roles,
        location: extractedData.location,
        hourly_rate: parseInt(extractedData.rate) || 950,
        availability: extractedData.availability,
        projects_completed: extractedData.projects,
        rating: extractedData.rating,
        last_active: extractedData.lastActive,
        certifications: extractedData.certifications,
        languages: extractedData.languages,
        type: 'new' as const,
        communication_style: extractedData.communicationStyle,
        work_style: extractedData.workStyle,
        values: extractedData.values,
        personality_traits: extractedData.personalityTraits,
        team_fit: extractedData.teamFit,
        cultural_fit: extractedData.culturalFit,
        adaptability: extractedData.adaptability,
        leadership: extractedData.leadership
      };

      const { data, error } = await supabase
        .from('consultants')
        .insert(consultantData)
        .select()
        .single();

      if (error) {
        console.error('Error saving consultant:', error);
        alert('Fel vid sparande av konsult');
        return;
      }

      console.log('Consultant saved successfully:', data);
      alert('Konsult sparad framgångsrikt!');
      
      // Reset form
      setUploadedFile(null);
      setExtractedData(null);
    } catch (error) {
      console.error('Error:', error);
      alert('Ett fel uppstod');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">CV Upload & AI Analysis</h1>
        <p className="text-gray-600">
          ✅ AI-powered CV extraction and consultant profile creation
          <br />
          ✅ Automatic skill detection and experience analysis
          <br />
          ✅ Human factors assessment - personality and cultural fit scoring
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload CV/Resume
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="cv-upload"
              />
              <label htmlFor="cv-upload" className="cursor-pointer">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Click to upload CV/Resume
                </p>
                <p className="text-sm text-gray-500">
                  Supports PDF, DOC, DOCX files
                </p>
              </label>
            </div>

            {uploadedFile && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">{uploadedFile.name}</p>
                    <p className="text-sm text-blue-600">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </div>
            )}

            {isProcessing && (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600"></div>
                  <p className="text-yellow-800">🤖 AI is analyzing the CV...</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Extracted Data Section */}
        {extractedData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Extracted Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Personal Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{extractedData.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{extractedData.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{extractedData.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{extractedData.location}</span>
                  </div>
                </div>
              </div>

              {/* Professional Info */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Professional Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience:</span>
                    <span className="font-medium">{extractedData.experience}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rate:</span>
                    <span className="font-medium text-green-600">{extractedData.rate}/hour</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Availability:</span>
                    <Badge className="bg-green-100 text-green-800">{extractedData.availability}</Badge>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Technical Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {extractedData.skills.map((skill: string, index: number) => (
                    <Badge key={index} className="bg-blue-100 text-blue-800">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Human Factors */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Human Factors Analysis</h3>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <div className="font-bold text-purple-600">{extractedData.culturalFit}/5</div>
                    <div className="text-purple-500">Cultural Fit</div>
                  </div>
                  <div>
                    <div className="font-bold text-purple-600">{extractedData.adaptability}/5</div>
                    <div className="text-purple-500">Adaptability</div>
                  </div>
                  <div>
                    <div className="font-bold text-purple-600">{extractedData.leadership}/5</div>
                    <div className="text-purple-500">Leadership</div>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleSaveConsultant} 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isUploading}
              >
                {isUploading ? 'Sparar konsult...' : 'Spara konsult i databas'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
