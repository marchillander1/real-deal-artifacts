
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Users, Star, TrendingUp, Brain, CheckCircle, FileText, Linkedin, Eye, Award, Mail } from 'lucide-react';
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

  // Get popular skills from all consultants
  const allSkills = [...new Set(consultants.flatMap(c => c.skills))];
  const popularSkills = allSkills.slice(0, 15);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Consultants</p>
                <p className="text-2xl font-bold">{consultants.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">My Consultants</p>
                <p className="text-2xl font-bold">{myConsultants.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Network</p>
                <p className="text-2xl font-bold">{networkConsultants.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">AI Analyzed</p>
                <p className="text-2xl font-bold">{consultants.filter(c => c.cvAnalysis || c.linkedinAnalysis).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search and Filter
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
          
          {/* Popular Skills */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Popular Skills:</p>
            <div className="flex flex-wrap gap-1">
              {popularSkills.map((skill, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-blue-50"
                  onClick={() => setSkillFilter(skill)}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="my-consultants" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="my-consultants">
            My Consultants ({myConsultants.length})
          </TabsTrigger>
          <TabsTrigger value="network">
            Network Consultants ({networkConsultants.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All ({consultants.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-consultants" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-4">
            {/* CV Upload Section */}
            <div className="lg:col-span-1">
              <CVUploadSection />
            </div>
            
            {/* Consultants Grid */}
            <div className="lg:col-span-3">
              <div className="mb-4">
                <h3 className="text-lg font-semibold">My Team ({myConsultants.length})</h3>
                <p className="text-sm text-gray-600">Consultants in your organization</p>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filterConsultants(myConsultants).map((consultant) => (
                  <EnhancedConsultantCard key={consultant.id} consultant={consultant} isOwned={true} />
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

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filterConsultants(networkConsultants).map((consultant) => (
              <EnhancedConsultantCard key={consultant.id} consultant={consultant} isOwned={false} />
            ))}
          </div>

          {networkConsultants.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No network consultants available yet</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">All Consultants</h3>
            <p className="text-sm text-gray-600">
              Complete overview of all available consultants
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filterConsultants(consultants).map((consultant) => (
              <EnhancedConsultantCard key={consultant.id} consultant={consultant} isOwned={consultant.type === 'existing'} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface EnhancedConsultantCardProps {
  consultant: Consultant;
  isOwned: boolean;
}

const EnhancedConsultantCard: React.FC<EnhancedConsultantCardProps> = ({ consultant, isOwned }) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusColor = (availability: string) => {
    if (availability.includes('Available')) return 'bg-green-100 text-green-800';
    if (availability.includes('From')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  // Check for analysis data from database
  const hasAnalysisData = consultant.cvAnalysis || consultant.linkedinAnalysis;
  const cvAnalysis = consultant.cvAnalysis?.analysis;
  const linkedinAnalysis = consultant.linkedinAnalysis?.analysis;

  // Get real data from CV analysis or fallback to existing data
  const displayName = cvAnalysis?.personalInfo?.name || consultant.name;
  const displayLocation = cvAnalysis?.personalInfo?.location || consultant.location;
  const displayExperience = cvAnalysis?.professionalSummary?.yearsOfExperience ? 
    `${cvAnalysis.professionalSummary.yearsOfExperience} years` : 
    consultant.experience;
  const displayRole = cvAnalysis?.professionalSummary?.currentRole || consultant.roles?.[0] || 'Consultant';
  const displayRate = cvAnalysis?.marketPositioning?.hourlyRateEstimate?.recommended ?
    `${cvAnalysis.marketPositioning.hourlyRateEstimate.recommended} SEK/hour` :
    consultant.rate;

  // Get skills from CV analysis or fallback
  const displaySkills = cvAnalysis?.technicalExpertise?.programmingLanguages?.expert || 
                       consultant.skills;

  return (
    <Card className="hover:shadow-lg transition-shadow bg-white">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              {getInitials(displayName)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{displayName}</h3>
              <p className="text-sm text-gray-600">{displayRole}</p>
              <div className="flex items-center space-x-1 mt-1">
                <Badge variant="outline" className="text-xs text-blue-600 border-blue-200">
                  {consultant.type === 'new' ? 'Network' : 'Our Team'}
                </Badge>
                {hasAnalysisData && (
                  <Badge variant="outline" className="text-xs text-purple-600 border-purple-200">
                    <Brain className="h-3 w-3 mr-1" />
                    AI Analyzed
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-semibold">{consultant.rating}</span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="space-y-2 mb-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Experience:</span>
            <span className="font-medium">{displayExperience.replace(' experience', '')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Projects:</span>
            <span className="font-medium">{consultant.projects || 0} completed</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Rate:</span>
            <span className="font-medium text-green-600">{displayRate.replace('SEK/h', 'SEK/hour')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Location:</span>
            <span className="font-medium">{displayLocation}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Status:</span>
            <Badge className={getStatusColor(consultant.availability)} variant="secondary">
              {consultant.availability}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Last active:</span>
            <span className="text-gray-500">{consultant.lastActive}</span>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Top Skills:</p>
          <div className="flex flex-wrap gap-1">
            {displaySkills.slice(0, 4).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                {skill}
              </Badge>
            ))}
            {displaySkills.length > 4 && (
              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                +{displaySkills.length - 4} more
              </Badge>
            )}
          </div>
        </div>

        {/* Analysis Status */}
        {hasAnalysisData && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Analysis Status:</p>
            <div className="flex gap-2">
              {consultant.cvAnalysis && (
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <CheckCircle className="h-3 w-3" />
                  <FileText className="h-3 w-3" />
                  <span>CV Analyzed</span>
                </div>
              )}
              {consultant.linkedinAnalysis && (
                <div className="flex items-center gap-1 text-xs text-blue-600">
                  <CheckCircle className="h-3 w-3" />
                  <Linkedin className="h-3 w-3" />
                  <span>LinkedIn Analyzed</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* AI Insights */}
        {cvAnalysis?.marketPositioning?.competitiveAdvantages && (
          <div className="mb-4 p-3 bg-purple-50 rounded-lg">
            <p className="text-sm font-medium text-purple-900 mb-1">AI Insights:</p>
            <div className="flex flex-wrap gap-1">
              {cvAnalysis.marketPositioning.competitiveAdvantages.slice(0, 2).map((advantage, index) => (
                <Badge key={index} variant="secondary" className="text-xs bg-purple-100 text-purple-800">
                  {advantage}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Mail className="h-4 w-4 mr-2" />
              Contact
            </Button>
            {hasAnalysisData && (
              <Button variant="outline" size="sm" className="text-purple-600 hover:text-purple-700 border-purple-200">
                <Eye className="h-4 w-4 mr-2" />
                View Analysis
              </Button>
            )}
          </div>
          {consultant.certifications && consultant.certifications.length > 0 && (
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 text-blue-600" />
              <span className="text-xs text-blue-600 font-medium">
                {consultant.certifications[0]}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
