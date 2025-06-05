
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Star, Mail, Award } from "lucide-react";
import { useSupabaseConsultants } from "@/hooks/useSupabaseConsultants";

export const ConsultantsTab = () => {
  const { consultants, isLoading, error } = useSupabaseConsultants();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      console.log('CV file uploaded:', files[0].name);
      // TODO: Implement CV processing
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
  const newConsultants = consultants.filter(c => c.type === 'new');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Consultant Database</h2>
          <p className="text-gray-600 mt-1">AI-powered consultant profiles with automated skill extraction</p>
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
            <p className="text-gray-600">Our established team of experienced professionals</p>
          </div>
          <Badge className="bg-blue-100 text-blue-600">
            {existingConsultants.length} consultants
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {existingConsultants.map((consultant) => (
            <Card key={consultant.id} className="p-6 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {getInitials(consultant.name)}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{consultant.name}</h4>
                    <p className="text-gray-600">{consultant.roles[0]}</p>
                    <Badge className="bg-blue-100 text-blue-600 mt-1">
                      Verified
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="font-semibold">{consultant.rating}</span>
                </div>
              </div>

              <div className="space-y-3 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Experience:</span>
                  <span className="font-medium">{consultant.experience_years} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Projects:</span>
                  <span className="font-medium">{consultant.projects_completed} completed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rate:</span>
                  <span className="font-medium text-green-600">{consultant.hourly_rate} SEK/hour</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{consultant.location}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <Badge className="bg-green-100 text-green-800">
                    {consultant.availability}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last active:</span>
                  <span className="font-medium">{consultant.last_active}</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Top Skills:</p>
                <div className="flex flex-wrap gap-2">
                  {consultant.skills.slice(0, 4).map((skill, index) => (
                    <Badge key={index} className="bg-blue-100 text-blue-600">
                      {skill}
                    </Badge>
                  ))}
                  {consultant.skills.length > 4 && (
                    <Badge className="bg-gray-100 text-gray-600">
                      +{consultant.skills.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Mail className="h-3 w-3" />
                  <span>Contact</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Award className="h-3 w-3 text-blue-500" />
                  <span className="text-blue-600 font-medium text-sm">{consultant.certifications[0]}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Network Consultants */}
      {newConsultants.length > 0 && (
        <div>
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <div className="h-6 w-6 text-green-600 flex items-center justify-center font-bold">
                👥
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Network Consultants</h3>
              <p className="text-gray-600">External consultants who joined through our platform</p>
            </div>
            <Badge className="bg-green-100 text-green-600">
              {newConsultants.length} network
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newConsultants.map((consultant) => (
              <Card key={consultant.id} className="p-6 bg-white rounded-lg border-2 border-green-100 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {getInitials(consultant.name)}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{consultant.name}</h4>
                      <p className="text-gray-600">{consultant.roles[0]}</p>
                      <Badge className="bg-green-100 text-green-800 mt-1">
                        New Member
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-semibold">{consultant.rating}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience:</span>
                    <span className="font-medium">{consultant.experience_years} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Projects:</span>
                    <span className="font-medium">{consultant.projects_completed} completed</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rate:</span>
                    <span className="font-medium text-green-600">{consultant.hourly_rate} SEK/hour</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{consultant.location}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status:</span>
                    <Badge className="bg-green-100 text-green-800">
                      {consultant.availability}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Joined:</span>
                    <span className="font-medium">{consultant.last_active}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Top Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {consultant.skills.slice(0, 4).map((skill, index) => (
                      <Badge key={index} className="bg-green-100 text-green-800">
                        {skill}
                      </Badge>
                    ))}
                    {consultant.skills.length > 4 && (
                      <Badge className="bg-gray-100 text-gray-600">
                        +{consultant.skills.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Mail className="h-3 w-3" />
                    <span>Contact</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Award className="h-3 w-3 text-green-500" />
                    <span className="text-green-600 font-medium text-sm">{consultant.certifications[0]}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {consultants.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No consultants found</div>
          <p className="text-gray-400 mt-2">Upload consultants to get started</p>
        </div>
      )}
    </div>
  );
};
