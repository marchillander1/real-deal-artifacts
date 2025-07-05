import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, Users, Target, BarChart3, Filter, Search } from 'lucide-react';
import { useSupabaseConsultantsWithDemo } from '@/hooks/useSupabaseConsultantsWithDemo';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface Match {
  id: string;
  assignment_id: string;
  consultant_id: string;
  match_score: number;
  status: string;
  created_at: string;
  cultural_match: number;
  communication_match: number;
  values_alignment: number;
}

interface Consultant {
  id: string;
  name: string;
  email: string;
  title: string;
  experience_years: number;
  skills: string[];
  availability: string;
  is_published: boolean;
  created_at: string;
  projects_completed: number;
  hourly_rate: number;
}

interface Assignment {
  id: string;
  title: string;
  company: string;
  industry: string;
  budget_min: number;
  budget_max: number;
  budget_currency: string;
  status: string;
  created_at: string;
}

export const DetailedReporting: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { consultants } = useSupabaseConsultantsWithDemo();

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

  const processedMatches = matches.map(match => ({
    id: match.id,
    assignmentTitle: assignments.find(a => a.id === match.assignment_id)?.title || 'Unknown Assignment',
    consultantName: consultants.find(c => c.id === match.consultant_id)?.name || 'Unknown Consultant',
    matchScore: match.match_score || 0,
    status: match.status || 'pending',
    createdAt: match.created_at ? new Date(match.created_at).toLocaleDateString() : 'Unknown',
    culturalMatch: match.cultural_match || 0,
    communicationMatch: match.communication_match || 0,
    valuesAlignment: match.values_alignment || 0
  }));

  const processedConsultants = consultants.map(consultant => ({
    id: consultant.id,
    name: consultant.name,
    email: consultant.email,
    title: consultant.title || 'Consultant',
    experience: consultant.experience_years || 0,
    skills: consultant.skills || [],
    availability: consultant.availability || 'Available',
    isPublished: consultant.is_published || false,
    createdAt: consultant.created_at ? new Date(consultant.created_at).toLocaleDateString() : 'Unknown',
    projects: consultant.projects_completed || 0,
    rate: consultant.hourly_rate || 0,
    lastActive: 'Today'
  }));

  const exportMatchesPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('Matchnings Rapport', 20, 20);
    doc.setFontSize(12);
    doc.text(`Genererad: ${new Date().toLocaleDateString()}`, 20, 30);
    
    const tableData = processedMatches.map(match => [
      match.assignmentTitle,
      match.consultantName,
      `${match.matchScore}%`,
      match.status,
      match.createdAt
    ]);

    (doc as any).autoTable({
      head: [['Uppdrag', 'Konsult', 'Match %', 'Status', 'Skapad']],
      body: tableData,
      startY: 40,
    });
    
    doc.save('matchningar-rapport.pdf');
  };

  const exportConsultantsPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('Konsult Rapport', 20, 20);
    doc.setFontSize(12);
    doc.text(`Genererad: ${new Date().toLocaleDateString()}`, 20, 30);
    
    const tableData = processedConsultants.map(consultant => [
      consultant.name,
      consultant.title,
      `${consultant.experience} år`,
      consultant.skills.slice(0, 3).join(', '),
      consultant.availability
    ]);

    (doc as any).autoTable({
      head: [['Namn', 'Titel', 'Erfarenhet', 'Huvudkompetenser', 'Tillgänglighet']],
      body: tableData,
      startY: 40,
    });
    
    doc.save('konsulter-rapport.pdf');
  };

  const skillAnalysis = consultants.reduce((acc, consultant) => {
    (consultant.skills || []).forEach(skill => {
      acc[skill] = (acc[skill] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const topSkills = Object.entries(skillAnalysis)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Detaljerade Rapporter</h2>
        <div className="flex gap-2">
          <Button onClick={exportMatchesPDF} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Matchningar
          </Button>
          <Button onClick={exportConsultantsPDF} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Konsulter
          </Button>
        </div>
      </div>

      <Tabs defaultValue="matches" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="matches">Matchningar</TabsTrigger>
          <TabsTrigger value="consultants">Konsulter</TabsTrigger>
          <TabsTrigger value="assignments">Uppdrag</TabsTrigger>
          <TabsTrigger value="analytics">Analys</TabsTrigger>
        </TabsList>

        <TabsContent value="matches">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Matchningsrapport
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Sök matchningar..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Select value={activeFilter} onValueChange={setActiveFilter}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Filtrera status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alla</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="accepted">Accepterad</SelectItem>
                      <SelectItem value="rejected">Avvisad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Uppdrag</TableHead>
                      <TableHead>Konsult</TableHead>
                      <TableHead>Match %</TableHead>
                      <TableHead>Kulturell Match</TableHead>
                      <TableHead>Kommunikation</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Skapad</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {processedMatches
                      .filter(match => 
                        activeFilter === 'all' || match.status === activeFilter
                      )
                      .filter(match =>
                        match.assignmentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        match.consultantName.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((match) => (
                        <TableRow key={match.id}>
                          <TableCell className="font-medium">{match.assignmentTitle}</TableCell>
                          <TableCell>{match.consultantName}</TableCell>
                          <TableCell>
                            <Badge variant={match.matchScore >= 80 ? "default" : match.matchScore >= 60 ? "secondary" : "destructive"}>
                              {match.matchScore}%
                            </Badge>
                          </TableCell>
                          <TableCell>{match.culturalMatch}%</TableCell>
                          <TableCell>{match.communicationMatch}%</TableCell>
                          <TableCell>
                            <Badge variant={match.status === 'accepted' ? "default" : match.status === 'pending' ? "secondary" : "destructive"}>
                              {match.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{match.createdAt}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consultants">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Konsultrapport
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Namn</TableHead>
                    <TableHead>Titel</TableHead>
                    <TableHead>Erfarenhet</TableHead>
                    <TableHead>Kompetenser</TableHead>
                    <TableHead>Tillgänglighet</TableHead>
                    <TableHead>Publicerad</TableHead>
                    <TableHead>Skapad</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processedConsultants.map((consultant) => (
                    <TableRow key={consultant.id}>
                      <TableCell className="font-medium">{consultant.name}</TableCell>
                      <TableCell>{consultant.title}</TableCell>
                      <TableCell>{consultant.experience} år</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {consultant.skills.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {consultant.skills.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{consultant.skills.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={consultant.availability === 'Available' ? "default" : "secondary"}>
                          {consultant.availability}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={consultant.isPublished ? "default" : "secondary"}>
                          {consultant.isPublished ? 'Ja' : 'Nej'}
                        </Badge>
                      </TableCell>
                      <TableCell>{consultant.createdAt}</TableCell>
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
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Uppdragsrapport
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titel</TableHead>
                    <TableHead>Företag</TableHead>
                    <TableHead>Bransch</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Skapad</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-medium">{assignment.title}</TableCell>
                      <TableCell>{assignment.company}</TableCell>
                      <TableCell>{assignment.industry || 'Ej specificerad'}</TableCell>
                      <TableCell>
                        {assignment.budget_min && assignment.budget_max 
                          ? `${assignment.budget_min.toLocaleString()} - ${assignment.budget_max.toLocaleString()} ${assignment.budget_currency}`
                          : 'Ej specificerad'
                        }
                      </TableCell>
                      <TableCell>
                        <Badge variant={assignment.status === 'open' ? "default" : "secondary"}>
                          {assignment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {assignment.created_at ? new Date(assignment.created_at).toLocaleDateString() : 'Unknown'}
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
                  <BarChart3 className="h-5 w-5" />
                  Kompetensanalys
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topSkills.map(([skill, count], index) => (
                    <div key={skill} className="flex items-center justify-between">
                      <span className="font-medium">{index + 1}. {skill}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(count / Math.max(...topSkills.map(([,c]) => c))) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Plattformsöversikt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{consultants.length}</div>
                    <div className="text-sm text-blue-600">Totala Konsulter</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{assignments.length}</div>
                    <div className="text-sm text-green-600">Aktiva Uppdrag</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{matches.length}</div>
                    <div className="text-sm text-purple-600">Totala Matchningar</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {matches.length > 0 ? Math.round((matches.filter(m => m.status === 'accepted').length / matches.length) * 100) : 0}%
                    </div>
                    <div className="text-sm text-orange-600">Framgångsgrad</div>
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
