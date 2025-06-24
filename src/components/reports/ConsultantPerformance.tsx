
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Star, TrendingUp, Users, Award, Target } from 'lucide-react';

interface ConsultantPerformanceProps {
  consultants: any[];
  matches: any[];
  period: string;
}

export const ConsultantPerformance: React.FC<ConsultantPerformanceProps> = ({ 
  consultants, 
  matches, 
  period 
}) => {
  // Calculate top performers
  const consultantPerformance = consultants.map(consultant => {
    const consultantMatches = matches.filter(m => m.consultant_id === consultant.id);
    const successfulMatches = consultantMatches.filter(m => m.status === 'accepted');
    const avgScore = consultantMatches.length > 0 
      ? consultantMatches.reduce((sum, m) => sum + (m.match_score || 0), 0) / consultantMatches.length
      : 0;

    return {
      ...consultant,
      totalMatches: consultantMatches.length,
      successfulMatches: successfulMatches.length,
      successRate: consultantMatches.length > 0 ? (successfulMatches.length / consultantMatches.length) * 100 : 0,
      avgMatchScore: avgScore
    };
  }).sort((a, b) => b.successRate - a.successRate);

  const topPerformers = consultantPerformance.slice(0, 10);

  // Skills demand analysis
  const skillsDemand = [
    { skill: 'React', demand: 89, consultants: 24, gap: 12 },
    { skill: 'TypeScript', demand: 76, consultants: 18, gap: 8 },
    { skill: 'Node.js', demand: 68, consultants: 16, gap: 6 },
    { skill: 'AWS', demand: 62, consultants: 12, gap: 10 },
    { skill: 'Python', demand: 58, consultants: 14, gap: 4 },
    { skill: 'Docker', demand: 45, consultants: 10, gap: 3 }
  ];

  // Performance metrics
  const avgRating = consultants.reduce((sum, c) => sum + (c.rating || 0), 0) / consultants.length;
  const totalProjects = consultants.reduce((sum, c) => sum + (c.projects || 0), 0);
  const activeConsultants = consultants.filter(c => c.availability === 'Available').length;

  return (
    <div className="space-y-6">
      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Star className="h-8 w-8 text-yellow-500" />
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                Snitt
              </Badge>
            </div>
            <div className="text-3xl font-bold mb-2">{avgRating.toFixed(1)}</div>
            <div className="text-gray-600">Genomsnittlig rating</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="h-8 w-8 text-green-500" />
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Aktiva
              </Badge>
            </div>
            <div className="text-3xl font-bold mb-2">{activeConsultants}</div>
            <div className="text-gray-600">Tillgängliga konsulter</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Award className="h-8 w-8 text-blue-500" />
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Total
              </Badge>
            </div>
            <div className="text-3xl font-bold mb-2">{totalProjects}</div>
            <div className="text-gray-600">Genomförda projekt</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Target className="h-8 w-8 text-purple-500" />
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                Top 10%
              </Badge>
            </div>
            <div className="text-3xl font-bold mb-2">
              {topPerformers.length > 0 ? topPerformers[0].successRate.toFixed(0) : 0}%
            </div>
            <div className="text-gray-600">Bästa framgångsgrad</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle>Topppresterande konsulter</CardTitle>
            <p className="text-sm text-gray-600">
              Baserat på framgångsgrad och matchningspoäng
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.slice(0, 8).map((consultant, index) => (
                <div key={consultant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-bold">
                      {index + 1}
                    </div>
                    <Avatar>
                      <AvatarFallback>
                        {consultant.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{consultant.name}</p>
                      <p className="text-sm text-gray-600">{consultant.title || 'Konsult'}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {consultant.successRate.toFixed(0)}%
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{consultant.rating || 5.0}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {consultant.successfulMatches} lyckade av {consultant.totalMatches}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Skills Gap Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Kompetensanalys</CardTitle>
            <p className="text-sm text-gray-600">
              Efterfrågan vs tillgänglig kompetens
            </p>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                demand: { label: "Efterfrågan", color: "#ef4444" },
                consultants: { label: "Tillgängliga", color: "#3b82f6" }
              }}
              className="h-80"
            >
              <BarChart data={skillsDemand}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="skill" />
                <YAxis />
                <ChartTooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border rounded shadow">
                          <p className="font-medium">{label}</p>
                          <p className="text-sm text-red-600">Efterfrågan: {data.demand}%</p>
                          <p className="text-sm text-blue-600">Konsulter: {data.consultants}</p>
                          <p className="text-sm text-gray-600">Gap: {data.gap} konsulter</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="demand" fill="#ef4444" name="Efterfrågan %" />
                <Bar dataKey="consultants" fill="#3b82f6" name="Tillgängliga konsulter" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detaljerad prestationsanalys</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Konsult</th>
                  <th className="text-left p-3">Specialisering</th>
                  <th className="text-center p-3">Matchningar</th>
                  <th className="text-center p-3">Framgång</th>
                  <th className="text-center p-3">Snittpoäng</th>
                  <th className="text-center p-3">Rating</th>
                  <th className="text-center p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {topPerformers.slice(0, 12).map((consultant) => (
                  <tr key={consultant.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {consultant.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{consultant.name}</p>
                          <p className="text-xs text-gray-500">{consultant.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {consultant.skills?.slice(0, 2).map((skill: string) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="text-center p-3 font-medium">{consultant.totalMatches}</td>
                    <td className="text-center p-3">
                      <Badge 
                        variant="secondary" 
                        className={
                          consultant.successRate >= 80 
                            ? "bg-green-100 text-green-800"
                            : consultant.successRate >= 60
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {consultant.successRate.toFixed(0)}%
                      </Badge>
                    </td>
                    <td className="text-center p-3 font-medium">{consultant.avgMatchScore.toFixed(0)}</td>
                    <td className="text-center p-3">
                      <div className="flex items-center justify-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span>{consultant.rating || '5.0'}</span>
                      </div>
                    </td>
                    <td className="text-center p-3">
                      <Badge 
                        variant={consultant.availability === 'Available' ? 'default' : 'secondary'}
                        className={
                          consultant.availability === 'Available'
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {consultant.availability === 'Available' ? 'Tillgänglig' : 'Upptagen'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
