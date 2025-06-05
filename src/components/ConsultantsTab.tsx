import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Star, Mail, Award, Linkedin, Brain, Users, MessageCircle } from "lucide-react";
import { useSupabaseConsultants } from "@/hooks/useSupabaseConsultants";

export const ConsultantsTab = () => {
  const { consultants, isLoading, error } = useSupabaseConsultants();
  const [analyzingLinkedIn, setAnalyzingLinkedIn] = useState<number | null>(null);
  const [linkedInAnalysis, setLinkedInAnalysis] = useState<{[key: number]: any}>({});

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      console.log('CV file uploaded:', files[0].name);
      // TODO: Implement CV processing
    }
  };

  const handleLinkedInAnalysis = async (consultantId: number, linkedinUrl: string) => {
    setAnalyzingLinkedIn(consultantId);
    
    try {
      const response = await fetch('https://xbliknlrikolcjjfhxqa.supabase.co/functions/v1/analyze-linkedin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ linkedinUrl }),
      });

      const data = await response.json();
      
      if (data.success) {
        setLinkedInAnalysis(prev => ({
          ...prev,
          [consultantId]: data.analysis
        }));
      }
    } catch (error) {
      console.error('LinkedIn analysis failed:', error);
    } finally {
      setAnalyzingLinkedIn(null);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Laddar konsulter...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Fel vid hämtning av konsulter</div>
      </div>
    );
  }

  const existingConsultants = consultants.filter(c => c.type === 'existing');
  const networkConsultants = consultants.filter(c => c.type === 'new');

  const renderConsultantCard = (consultant: any, isNetwork = false) => {
    const borderColor = isNetwork ? 'border-2 border-green-300' : 'border border-gray-200';
    const badgeColor = isNetwork ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-600';
    const badgeText = isNetwork ? 'Network Member' : 'Our Team';
    const avatarColor = isNetwork ? 'bg-green-600' : 'bg-blue-500';
    const skillsColor = isNetwork ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200';
    const experienceYears = consultant.experience?.replace(/\D/g, '') || '0';
    const analysis = linkedInAnalysis[consultant.id];

    return (
      <Card key={consultant.id} className={`${borderColor} hover:shadow-lg transition-all duration-200 ${isNetwork ? 'bg-green-50/30' : ''}`}>
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 ${avatarColor} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                {getInitials(consultant.name)}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{consultant.name}</h4>
                <p className="text-gray-600">{consultant.roles?.[0] || 'Consultant'}</p>
                <Badge className={badgeColor}>
                  {badgeText}
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="font-semibold">{consultant.rating || 4.5}</span>
            </div>
          </div>

          {/* Basic Info */}
          <div className="space-y-3 mb-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Experience:</span>
              <span className="font-medium">{experienceYears} years</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Projects:</span>
              <span className="font-medium">{consultant.projects || 0} completed</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Rate:</span>
              <span className="font-medium text-green-600">{consultant.rate || 'N/A'}/hour</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Location:</span>
              <span className="font-medium">{consultant.location || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status:</span>
              <Badge className="bg-green-100 text-green-800">
                {consultant.availability || 'Available'}
              </Badge>
            </div>
          </div>

          {/* LinkedIn Analysis Section */}
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Linkedin className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">LinkedIn Analysis</span>
              </div>
              {consultant.linkedinUrl && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 px-2 text-xs"
                  onClick={() => handleLinkedInAnalysis(consultant.id, consultant.linkedinUrl)}
                  disabled={analyzingLinkedIn === consultant.id}
                >
                  {analyzingLinkedIn === consultant.id ? '🤖 Analyzing...' : '🔍 Analyze'}
                </Button>
              )}
            </div>
            
            {analysis ? (
              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-blue-700 font-medium">Communication:</span>
                    <p className="text-blue-600">{analysis.communicationStyle}</p>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Work Style:</span>
                    <p className="text-blue-600">{analysis.workStyle}</p>
                  </div>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Values:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {analysis.values?.map((value: string, idx: number) => (
                      <Badge key={idx} className="bg-blue-100 text-blue-700 text-xs">
                        {value}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Personality:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {analysis.personalityTraits?.map((trait: string, idx: number) => (
                      <Badge key={idx} className="bg-purple-100 text-purple-700 text-xs">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-blue-200">
                  <div className="text-center">
                    <div className="text-sm font-bold text-blue-600">{analysis.culturalFit || 4.2}/5</div>
                    <div className="text-xs text-blue-500">Cultural Fit</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-blue-600">{analysis.adaptability || 4.3}/5</div>
                    <div className="text-xs text-blue-500">Adaptability</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-blue-600">{analysis.leadership || 4.0}/5</div>
                    <div className="text-xs text-blue-500">Leadership</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-blue-600">
                {consultant.linkedinUrl ? 'Click Analyze to extract personality insights' : 'No LinkedIn URL provided'}
              </div>
            )}
          </div>

          {/* Human Factors Section */}
          <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">Human Factors</span>
            </div>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-purple-700 font-medium">Communication Style:</span>
                <p className="text-purple-600">{consultant.communicationStyle}</p>
              </div>
              <div>
                <span className="text-purple-700 font-medium">Work Style:</span>
                <p className="text-purple-600">{consultant.workStyle}</p>
              </div>
              <div>
                <span className="text-purple-700 font-medium">Team Fit:</span>
                <p className="text-purple-600">{consultant.teamFit}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-purple-200">
                <div className="text-center">
                  <div className="text-sm font-bold text-purple-600">{consultant.culturalFit}/5</div>
                  <div className="text-xs text-purple-500">Cultural</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-purple-600">{consultant.adaptability}/5</div>
                  <div className="text-xs text-purple-500">Adaptable</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-purple-600">{consultant.leadership}/5</div>
                  <div className="text-xs text-purple-500">Leadership</div>
                </div>
              </div>
            </div>
          </div>

          {/* Values & Personality */}
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Values & Personality</span>
            </div>
            <div className="space-y-2">
              <div>
                <span className="text-xs text-gray-600">Core Values:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {consultant.values?.map((value: string, idx: number) => (
                    <Badge key={idx} className="bg-green-100 text-green-800 text-xs">
                      {value}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-xs text-gray-600">Personality Traits:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {consultant.personalityTraits?.map((trait: string, idx: number) => (
                    <Badge key={idx} className="bg-orange-100 text-orange-800 text-xs">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Technical Skills */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Technical Skills:</p>
            <div className="flex flex-wrap gap-2">
              {consultant.skills?.slice(0, 4).map((skill: string, index: number) => (
                <Badge key={index} className={`${skillsColor} border`}>
                  {skill}
                </Badge>
              ))}
              {consultant.skills?.length > 4 && (
                <Badge className="bg-gray-100 text-gray-600">
                  +{consultant.skills.length - 4} more
                </Badge>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Mail className="h-3 w-3" />
              <span>Contact</span>
            </div>
            <div className="flex items-center space-x-1">
              <Award className="h-3 w-3 text-blue-500" />
              <span className="text-blue-600 font-medium text-sm">{consultant.certifications?.[0] || 'Certified'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Consultant Database</h2>
          <p className="text-gray-600 mt-1">
            ✅ AI-powered consultant profiles with LinkedIn analysis
            <br />
            ✅ Values & Personality Analysis - Communication style, work approach, and personal values
            <br />
            ✅ Cultural Fit Scoring - Team dynamics, leadership style, and adaptability matching
          </p>
        </div>
        <div className="relative">
          <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
            <Upload className="h-4 w-4" />
            Upload CV
          </Button>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>

      {/* Our Consultants */}
      <div>
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Award className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Our Consultants</h3>
            <p className="text-gray-600">Our established team with full AI analysis</p>
          </div>
          <Badge className="bg-blue-100 text-blue-600">
            {existingConsultants.length} consultants
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {existingConsultants.map((consultant) => renderConsultantCard(consultant, false))}
        </div>
      </div>

      {/* Network Consultants */}
      <div>
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <Users className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Network Consultants</h3>
            <p className="text-gray-600">External consultants uploaded via CV-upload with AI-enhanced profiles</p>
          </div>
          <Badge className="bg-green-100 text-green-600">
            {networkConsultants.length} network members
          </Badge>
        </div>
        
        {networkConsultants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {networkConsultants.map((consultant) => renderConsultantCard(consultant, true))}
          </div>
        ) : (
          <div className="text-center py-12 bg-green-50 rounded-lg border-2 border-dashed border-green-200">
            <Users className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Network Consultants Yet</h4>
            <p className="text-gray-600 mb-4">
              Network consultants will appear here when CVs are uploaded via the CV Upload page.
            </p>
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => window.location.href = '/cv-upload'}
            >
              <Upload className="h-4 w-4 mr-2" />
              Go to CV Upload
            </Button>
          </div>
        )}
      </div>

      {consultants.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No consultants found</div>
          <p className="text-gray-400 mt-2">Upload consultants to get started</p>
        </div>
      )}
    </div>
  );
};
