import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ConsultantEditDialog } from '@/components/company/ConsultantEditDialog';
import { 
  Users, 
  Edit, 
  Download, 
  Eye, 
  EyeOff, 
  Star, 
  MapPin, 
  Clock,
  DollarSign,
  Globe
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CompanyConsultantsListProps {
  consultants: any[];
  onConsultantsUpdated: () => void;
}

export const CompanyConsultantsList: React.FC<CompanyConsultantsListProps> = ({
  consultants,
  onConsultantsUpdated
}) => {
  const { toast } = useToast();
  const [selectedConsultant, setSelectedConsultant] = useState<any>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const togglePublishStatus = async (consultant: any) => {
    try {
      const newStatus = !consultant.is_published;
      
      const { error } = await supabase
        .from('consultants')
        .update({ 
          is_published: newStatus,
          visibility_status: newStatus ? 'public' : 'private'
        })
        .eq('id', consultant.id);

      if (error) throw error;

      toast({
        title: newStatus ? "Consultant Published" : "Consultant Unpublished",
        description: newStatus 
          ? "Consultant is now visible in the network" 
          : "Consultant is now private",
      });

      onConsultantsUpdated();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleEditConsultant = (consultant: any) => {
    setSelectedConsultant(consultant);
    setEditDialogOpen(true);
  };

  const handleDownloadProfile = async (consultant: any) => {
    // TODO: Implement PDF generation for consultant profile
    toast({
      title: "Coming Soon",
      description: "PDF download feature will be available soon",
    });
  };

  if (consultants.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-12 text-center">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No consultants yet</h3>
          <p className="text-gray-600 mb-6">Upload your first consultant CVs to get started</p>
          <Button onClick={() => window.location.reload()}>
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Your Consultants</h2>
        <div className="text-gray-600">
          {consultants.filter(c => c.is_published).length} of {consultants.length} published
        </div>
      </div>

      <div className="grid gap-6">
        {consultants.map((consultant) => (
          <div key={consultant.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{consultant.name}</h3>
                    <Badge variant={consultant.is_published ? "default" : "secondary"} className={
                      consultant.is_published 
                        ? "bg-emerald-100 text-emerald-800 border-emerald-200" 
                        : "bg-gray-100 text-gray-800 border-gray-200"
                    }>
                      {consultant.is_published ? "Published" : "Private"}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-700 mb-2">{consultant.title}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                    {consultant.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {consultant.location}
                      </span>
                    )}
                    
                    {consultant.experience_years && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {consultant.experience_years} years
                      </span>
                    )}
                    
                    {consultant.hourly_rate && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {consultant.hourly_rate} SEK/h
                      </span>
                    )}

                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      {consultant.rating || 5.0}/5
                    </span>
                  </div>

                  {/* Skills */}
                  {consultant.skills && consultant.skills.length > 0 && (
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-2">
                        {consultant.skills.slice(0, 5).map((skill: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                            {skill}
                          </Badge>
                        ))}
                        {consultant.skills.length > 5 && (
                          <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
                            +{consultant.skills.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Button
                    onClick={() => handleEditConsultant(consultant)}
                    variant="outline"
                    size="sm"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  
                  <Button
                    onClick={() => handleDownloadProfile(consultant)}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <Switch
                    id={`publish-${consultant.id}`}
                    checked={consultant.is_published}
                    onCheckedChange={() => togglePublishStatus(consultant)}
                  />
                  <Label htmlFor={`publish-${consultant.id}`} className="text-gray-700 flex items-center gap-2">
                    {consultant.is_published ? (
                      <>
                        <Globe className="h-4 w-4 text-emerald-600" />
                        Published to Network
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-4 w-4 text-gray-500" />
                        Private (Internal Only)
                      </>
                    )}
                  </Label>
                </div>

                <div className="text-sm text-gray-500">
                  Updated {new Date(consultant.updated_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Dialog */}
      {selectedConsultant && (
        <ConsultantEditDialog
          consultant={selectedConsultant}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onConsultantUpdated={onConsultantsUpdated}
        />
      )}
    </div>
  );
};