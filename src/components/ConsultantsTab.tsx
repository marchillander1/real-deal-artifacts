
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, MapPin, Star, Clock, Phone, Mail, Upload } from "lucide-react";
import ConsultantCard from "./ConsultantCard";
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

  const getStatusColor = (availability: string) => {
    if (availability.includes('Available')) return 'bg-green-100 text-green-800';
    if (availability.includes('From')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Konsulter</h2>
          <p className="text-gray-600 mt-1">{consultants.length} konsulter tillgängliga</p>
        </div>
        <div className="relative">
          <Button className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Ladda upp CV
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
          <div>
            <h3 className="text-xl font-bold text-gray-900">Våra Konsulter</h3>
            <p className="text-gray-600">Etablerat team av erfarna proffs</p>
          </div>
          <Badge className="bg-blue-100 text-blue-800">
            {existingConsultants.length} konsulter
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {existingConsultants.map((consultant) => (
            <Card key={consultant.id} className="p-6 bg-white rounded-lg border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {getInitials(consultant.name)}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{consultant.name}</h4>
                    <p className="text-gray-600">{consultant.roles[0]}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="font-semibold">{consultant.rating}</span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Erfarenhet:</span>
                  <span className="font-medium">{consultant.experience.replace(' experience', '')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Projekt:</span>
                  <span className="font-medium">{consultant.projects} slutförda</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Timtaxa:</span>
                  <span className="font-medium text-green-600">{consultant.rate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Plats:</span>
                  <span className="font-medium">{consultant.location}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <Badge className={getStatusColor(consultant.availability)}>
                    {consultant.availability}
                  </Badge>
                </div>
              </div>

              {/* LinkedIn Analysis - Mjuka värden */}
              <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                <h5 className="text-sm font-semibold text-purple-900 mb-2">LinkedIn Analys</h5>
                <div className="space-y-2">
                  <div>
                    <span className="text-xs text-purple-700 font-medium">Kommunikationsstil:</span>
                    <p className="text-xs text-purple-800">{consultant.communicationStyle}</p>
                  </div>
                  <div>
                    <span className="text-xs text-purple-700 font-medium">Arbetsstil:</span>
                    <p className="text-xs text-purple-800">{consultant.workStyle}</p>
                  </div>
                  <div>
                    <span className="text-xs text-purple-700 font-medium">Värderingar:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {consultant.values.map((value, index) => (
                        <span key={index} className="px-2 py-1 bg-purple-200 text-purple-800 text-xs rounded">
                          {value}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div className="text-center">
                      <div className="text-xs text-purple-700">Kulturell fit</div>
                      <div className="font-semibold text-purple-900">{consultant.culturalFit}/5</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-purple-700">Anpassbarhet</div>
                      <div className="font-semibold text-purple-900">{consultant.adaptability}/5</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-purple-700">Ledarskap</div>
                      <div className="font-semibold text-purple-900">{consultant.leadership}/5</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Huvudkompetenser:</p>
                <div className="flex flex-wrap gap-2">
                  {consultant.skills.slice(0, 4).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                      {skill}
                    </Badge>
                  ))}
                  {consultant.skills.length > 4 && (
                    <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                      +{consultant.skills.length - 4} fler
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Kontakta
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Network Consultants */}
      {newConsultants.length > 0 && (
        <div>
          <div className="flex items-center space-x-3 mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Nätverkskonsulter</h3>
              <p className="text-gray-600">Externa konsulter som anslutit via plattformen</p>
            </div>
            <Badge className="bg-green-100 text-green-800">
              {newConsultants.length} i nätverk
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newConsultants.map((consultant) => (
              <ConsultantCard key={consultant.id} consultant={consultant} />
            ))}
          </div>
        </div>
      )}

      {consultants.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">Inga konsulter hittades</div>
          <p className="text-gray-400 mt-2">Ladda upp konsulter för att komma igång</p>
        </div>
      )}
    </div>
  );
};
