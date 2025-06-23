
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Calendar, 
  Users, 
  Brain,
  Eye,
  CheckCircle
} from 'lucide-react';
import { useSupabaseConsultantsWithDemo } from '@/hooks/useSupabaseConsultantsWithDemo';
import { Consultant } from '@/types/consultant';
import { useNavigate } from 'react-router-dom';
import { ConsultantAnalysisModal } from './ConsultantAnalysisModal';

export const EnhancedConsultantsTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'network' | 'my'>('all');
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const { consultants, isLoading, error } = useSupabaseConsultantsWithDemo();
  const navigate = useNavigate();

  const filteredConsultants = consultants.filter(consultant => {
    const matchesSearch = consultant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultant.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         consultant.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterBy === 'all' || 
                         (filterBy === 'network' && consultant.type === 'new') ||
                         (filterBy === 'my' && consultant.type === 'existing');
    
    return matchesSearch && matchesFilter;
  });

  const handleViewAnalysis = (consultant: Consultant) => {
    setSelectedConsultant(consultant);
    setShowAnalysisModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-8">
        <p>Error loading consultants: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Consultants</h2>
          <p className="text-gray-600">Manage your consultant network</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="text-sm">
            {filteredConsultants.length} consultants
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, skills, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterBy === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterBy('all')}
              >
                All ({consultants.length})
              </Button>
              <Button
                variant={filterBy === 'network' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterBy('network')}
              >
                Network ({consultants.filter(c => c.type === 'new').length})
              </Button>
              <Button
                variant={filterBy === 'my' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterBy('my')}
              >
                My Consultants ({consultants.filter(c => c.type === 'existing').length})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Consultants Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredConsultants.map((consultant) => (
          <Card key={consultant.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                      {consultant.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">{consultant.name}</h3>
                    <p className="text-sm text-gray-600">{consultant.roles?.[0] || 'Consultant'}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <Badge 
                    variant={consultant.type === 'new' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {consultant.type === 'new' ? 'Network' : 'My Consultant'}
                  </Badge>
                  {consultant.cvAnalysis && (
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                      <Brain className="h-3 w-3 mr-1" />
                      AI Analyzed
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0 space-y-4">
              {/* Skills */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Key Skills</p>
                <div className="flex flex-wrap gap-1">
                  {consultant.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {consultant.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs text-gray-500">
                      +{consultant.skills.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Experience & Rating */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    {consultant.experience}
                  </div>
                </div>
                <div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="h-4 w-4 mr-1 text-yellow-400" fill="currentColor" />
                    {consultant.rating}/5.0
                  </div>
                </div>
              </div>

              {/* Location & Availability */}
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  {consultant.location}
                </div>
                <div className="text-sm">
                  <Badge 
                    variant={consultant.availability === 'Available' ? 'default' : 'secondary'}
                    className="bg-green-100 text-green-800"
                  >
                    {consultant.availability}
                  </Badge>
                </div>
              </div>

              {/* Rate */}
              <div className="text-sm">
                <span className="font-medium text-gray-700">Rate: </span>
                <span className="text-gray-600">{consultant.rate}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                {consultant.cvAnalysis && consultant.type === 'new' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleViewAnalysis(consultant)}
                    className="flex-1 text-xs"
                  >
                    <Brain className="h-3 w-3 mr-1" />
                    View AI Analysis
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredConsultants.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No consultants found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters</p>
        </div>
      )}

      {/* Analysis Modal */}
      {selectedConsultant && (
        <ConsultantAnalysisModal
          consultant={selectedConsultant}
          isOpen={showAnalysisModal}
          onClose={() => setShowAnalysisModal(false)}
        />
      )}
    </div>
  );
};
