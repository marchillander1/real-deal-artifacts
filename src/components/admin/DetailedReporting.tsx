
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Download, 
  TrendingUp, 
  Users, 
  Target, 
  Calendar,
  FileText,
  BarChart3,
  PieChart
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { usePDFExport } from '@/hooks/usePDFExport';
import { toast } from 'sonner';

export const DetailedReporting: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const { exportMatchesToPDF, exportConsultantListToPDF } = usePDFExport();

  // Fetch data for reports
  const { data: consultants = [] } = useQuery({
    queryKey: ['admin-consultants-detailed'],
    queryFn: async () => {
      const { data, error } = await supabase.from('consultants').select('*');
      return error ? [] : data;
    },
  });

  const { data: assignments = [] } = useQuery({
    queryKey: ['admin-assignments-detailed'],
    queryFn: async () => {
      const { data, error } = await supabase.from('assignments').select('*');
      return error ? [] : data;
    },
  });

  const { data: matches = [] } = useQuery({
    queryKey: ['admin-matches-detailed'],
    queryFn: async () => {
      const { data, error } = await supabase.from('matches').select('*');
      return error ? [] : data;
    },
  });

  // Calculate detailed statistics
  const stats = {
    totalConsultants: consultants.length,
    activeConsultants: consultants.filter(c => c.availability === 'Available').length,
    totalAssignments: assignments.length,
    completedMatches: matches.filter(m => m.status === 'accepted').length,
    successRate: matches.length > 0 ? Math.round((matches.filter(m => m.status === 'accepted').length / matches.length) * 100) : 0,
    avgMatchScore: matches.length > 0 ? Math.round(matches.reduce((sum, m) => sum + (m.match_score || 0), 0) / matches.length) : 0
  };

  const handleExportDetailedReport = async () => {
    try {
      // Create a comprehensive report with all data
      const mockAssignment = {
        title: "Detaljerad Plattformsrapport",
        company: "MatchWise Platform",
        description: `Omfattande rapport för perioden ${selectedPeriod}`
      };

      const reportMatches = matches.map(match => {
        const consultant = consultants.find(c => c.id === match.consultant_id);
        return {
          consultant: consultant || { name: 'Okänd konsult', skills: [], location: 'Okänd', rate: 'N/A', experience: 'N/A' },
          score: match.match_score || 0,
          matchedSkills: match.matched_skills || [],
          estimatedSavings: match.estimated_savings || 0,
          responseTime: match.response_time_hours || 0,
          humanFactorsScore: match.human_factors_score || 0,
          culturalMatch: match.cultural_match || 0,
          communicationMatch: match.communication_match || 0,
          valuesAlignment: match.values_alignment || 0
        };
      });

      await exportMatchesToPDF(reportMatches.slice(0, 10), mockAssignment);
      toast.success('Detaljerad rapport exporterad som PDF');
    } catch (error) {
      toast.error('Fel vid export av rapport');
    }
  };

  const handleExportConsultants = async () => {
    try {
      await exportConsultantListToPDF(consultants);
      toast.success('Konsultlista exporterad som PDF');
    } catch (error) {
      toast.error('Fel vid export av konsultlista');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Detaljerad Rapportering</h2>
          <p className="text-gray-600">Omfattande analytics och exportfunktioner</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="7d">Senaste 7 dagarna</option>
            <option value="30d">Senaste 30 dagarna</option>
            <option value="90d">Senaste 90 dagarna</option>
            <option value="1y">Senaste året</option>
          </select>
          
          <Button onClick={handleExportDetailedReport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exportera Rapport
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.totalConsultants}</p>
                <p className="text-gray-600">Totala konsulter</p>
                <p className="text-xs text-green-600">+{stats.activeConsultants} aktiva</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Target className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.successRate}%</p>
                <p className="text-gray-600">Framgångsgrad</p>
                <p className="text-xs text-gray-500">{stats.completedMatches} lyckade</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{stats.avgMatchScore}</p>
                <p className="text-gray-600">Snitt matchning</p>
                <p className="text-xs text-gray-500">av 100 poäng</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{stats.totalAssignments}</p>
                <p className="text-gray-600">Totala uppdrag</p>
                <p className="text-xs text-gray-500">Skapade hittills</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="matches" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="matches">Matchningar</TabsTrigger>
          <TabsTrigger value="consultants">Konsulter</TabsTrigger>
          <TabsTrigger value="assignments">Uppdrag</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="matches">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Matchningsrapport</CardTitle>
              <Button variant="outline" onClick={handleExportDetailedReport}>
                <FileText className="h-4 w-4 mr-2" />
                Exportera
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Konsult</TableHead>
                    <TableHead>Uppdrag</TableHead>
                    <TableHead>Matchningsgrad</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Skapad</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {matches.slice(0, 10).map((match) => {
                    const consultant = consultants.find(c => c.id === match.consultant_id);
                    const assignment = assignments.find(a => a.id === match.assignment_id);
                    
                    return (
                      <TableRow key={match.id}>
                        <TableCell className="font-medium">
                          {consultant?.name || 'Okänd konsult'}
                        </TableCell>
                        <TableCell>{assignment?.title || 'Okänt uppdrag'}</TableCell>
                        <TableCell>
                          <Badge variant={match.match_score >= 80 ? 'default' : 'secondary'}>
                            {match.match_score}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={match.status === 'accepted' ? 'default' : 'secondary'}>
                            {match.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(match.created_at || '').toLocaleDateString('sv-SE')}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consultants">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Konsultrapport</CardTitle>
              <Button variant="outline" onClick={handleExportConsultants}>
                <FileText className="h-4 w-4 mr-2" />
                Exportera
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Namn</TableHead>
                    <TableHead>Kompetenser</TableHead>
                    <TableHead>Erfarenhet</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Registrerad</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {consultants.slice(0, 10).map((consultant) => (
                    <TableRow key={consultant.id}>
                      <TableCell className="font-medium">{consultant.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {consultant.skills?.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {consultant.skills?.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{consultant.skills.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {consultant.experience_years ? `${consultant.experience_years} år` : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={consultant.availability === 'Available' ? 'default' : 'secondary'}>
                          {consultant.availability}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(consultant.created_at || '').toLocaleDateString('sv-SE')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments">
          <Card>
            <CardHeader>
              <CardTitle>Uppdragsrapport</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titel</TableHead>
                    <TableHead>Företag</TableHead>
                    <TableHead>Kompetenser</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Skapad</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.slice(0, 10).map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-medium">{assignment.title}</TableCell>
                      <TableCell>{assignment.company}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {assignment.required_skills?.slice(0, 2).map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {assignment.required_skills?.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{assignment.required_skills.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={assignment.status === 'open' ? 'default' : 'secondary'}>
                          {assignment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(assignment.created_at || '').toLocaleDateString('sv-SE')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Kompetensfördelning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['React', 'Python', 'Java', 'Node.js', 'AWS'].map((skill, index) => {
                    const count = consultants.filter(c => 
                      c.skills?.some(s => s.toLowerCase().includes(skill.toLowerCase()))
                    ).length;
                    const percentage = consultants.length > 0 ? Math.round((count / consultants.length) * 100) : 0;
                    
                    return (
                      <div key={skill} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{skill}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-12">{percentage}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Matchningsstatistik
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Genomsnittlig matchningsgrad</span>
                    <span className="text-lg font-bold text-green-600">{stats.avgMatchScore}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Lyckade matchningar</span>
                    <span className="text-lg font-bold text-blue-600">{stats.completedMatches}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Totala matchningar</span>
                    <span className="text-lg font-bold text-purple-600">{matches.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Framgångsgrad</span>
                    <span className="text-lg font-bold text-orange-600">{stats.successRate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
