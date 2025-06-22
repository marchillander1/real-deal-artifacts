import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Users, Star } from 'lucide-react';
import { useSupabaseConsultantsWithDemo } from '@/hooks/useSupabaseConsultantsWithDemo';
import { Consultant } from '@/types/consultant';
import { CVUploadSection } from './CVUploadSection';

export const ConsultantsSection: React.FC = () => {
  const { consultants, isLoading } = useSupabaseConsultantsWithDemo();
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('');

  const myConsultants = consultants.filter(c => c.type === 'existing');
  const networkConsultants = consultants.filter(c => c.type === 'new');

  const filterConsultants = (consultantList: Consultant[]) => {
    return consultantList.filter(consultant => {
      const matchesSearch = consultant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           consultant.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesSkill = !skillFilter || consultant.skills.some(skill => 
        skill.toLowerCase().includes(skillFilter.toLowerCase())
      );
      return matchesSearch && matchesSkill;
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Consultants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-48">
              <Input
                placeholder="Filter by skill..."
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="my-consultants" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-consultants">
            My Consultants ({myConsultants.length})
          </TabsTrigger>
          <TabsTrigger value="network">
            Network Consultants ({networkConsultants.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-consultants" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* CV Upload Section */}
            <div className="lg:col-span-1">
              <CVUploadSection />
            </div>
            
            {/* Consultants Grid */}
            <div className="lg:col-span-2">
              <div className="mb-4">
                <h3 className="text-lg font-semibold">My Team ({myConsultants.length})</h3>
                <p className="text-sm text-gray-600">Consultants in your organization</p>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                {filterConsultants(myConsultants).map((consultant) => (
                  <ConsultantCard key={consultant.id} consultant={consultant} isOwned={true} />
                ))}
              </div>

              {myConsultants.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No consultants yet</h3>
                  <p className="text-gray-600">Upload CVs to build your consultant team using the form on the left</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="network" className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Network Consultants</h3>
            <p className="text-sm text-gray-600">
              Consultants available from the MatchWise network
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filterConsultants(networkConsultants).map((consultant) => (
              <ConsultantCard key={consultant.id} consultant={consultant} isOwned={false} />
            ))}
          </div>

          {networkConsultants.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No network consultants available yet</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface ConsultantCardProps {
  consultant: Consultant;
  isOwned: boolean;
}

const ConsultantCard: React.FC<ConsultantCardProps> = ({ consultant, isOwned }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{consultant.name}</CardTitle>
            <p className="text-sm text-gray-600">{consultant.roles?.[0] || 'Consultant'}</p>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">{consultant.rating || 5.0}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Skills</p>
            <div className="flex flex-wrap gap-1">
              {consultant.skills.slice(0, 3).map((skill, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {consultant.skills.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{consultant.skills.length - 3}
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">Experience:</span>
              <p className="font-medium">{consultant.experience}</p>
            </div>
            <div>
              <span className="text-gray-500">Availability:</span>
              <p className="font-medium">{consultant.availability}</p>
            </div>
          </div>

          <div className="pt-2">
            {isOwned ? (
              <Button variant="outline" size="sm" className="w-full">
                View Details
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="w-full">
                Request Contact
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
