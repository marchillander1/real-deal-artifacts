
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, ResponsiveContainer } from 'recharts';
import { Target, TrendingUp, Clock, Users, CheckCircle, XCircle } from 'lucide-react';

interface MatchingAnalyticsProps {
  matches: any[];
  assignments: any[];
  period: string;
}

export const MatchingAnalytics: React.FC<MatchingAnalyticsProps> = ({ 
  matches, 
  assignments, 
  period 
}) => {
  // Calculate matching statistics
  const totalMatches = matches.length;
  const successfulMatches = matches.filter(m => m.status === 'accepted').length;
  const pendingMatches = matches.filter(m => m.status === 'pending').length;
  const rejectedMatches = matches.filter(m => m.status === 'rejected').length;
  
  const successRate = totalMatches > 0 ? (successfulMatches / totalMatches) * 100 : 0;
  const avgMatchScore = matches.length > 0 
    ? matches.reduce((sum, m) => sum + (m.match_score || 0), 0) / matches.length
    : 0;

  // Monthly matching data
  const monthlyMatchData = [
    { month: 'Jan', successful: 12, total: 15, rate: 80 },
    { month: 'Feb', successful: 18, total: 22, rate: 82 },
    { month: 'Mar', successful: 24, total: 28, rate: 86 },
    { month: 'Apr', successful: 21, total: 25, rate: 84 },
    { month: 'Maj', successful: 28, total: 32, rate: 88 },
    { month: 'Jun', successful: 32, total: 35, rate: 91 }
  ];

  // Skills matching analysis
  const skillsMatchData = [
    { skill: 'React', matches: 28, success: 25, rate: 89 },
    { skill: 'TypeScript', matches: 24, success: 22, rate: 92 },
    { skill: 'Node.js', matches: 22, success: 19, rate: 86 },
    { skill: 'Python', matches: 18, success: 16, rate: 89 },
    { skill: 'AWS', matches: 16, success: 15, rate: 94 },
    { skill: 'Docker', matches: 14, success: 12, rate: 86 }
  ];

  // Match score distribution
  const scoreDistribution = [
    { range: '90-100%', count: successfulMatches * 0.3 },
    { range: '80-89%', count: successfulMatches * 0.4 },
    { range: '70-79%', count: successfulMatches * 0.2 },
    { range: '60-69%', count: successfulMatches * 0.1 }
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                +12%
              </Badge>
            </div>
            <div className="text-3xl font-bold mb-2">{successRate.toFixed(1)}%</div>
            <div className="text-gray-600">Framgångsgrad</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Target className="h-8 w-8 text-blue-500" />
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Snitt
              </Badge>
            </div>
            <div className="text-3xl font-bold mb-2">{avgMatchScore.toFixed(0)}%</div>
            <div className="text-gray-600">Matchningspoäng</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="h-8 w-8 text-purple-500" />
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                Total
              </Badge>
            </div>
            <div className="text-3xl font-bold mb-2">{totalMatches}</div>
            <div className="text-gray-600">Totala matchningar</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Clock className="h-8 w-8 text-orange-500" />
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                Väntar
              </Badge>
            </div>
            <div className="text-3xl font-bold mb-2">{pendingMatches}</div>
            <div className="text-gray-600">Väntande svar</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Success Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Framgångsgrad över tid</CardTitle>
            <p className="text-sm text-gray-600">
              Månadsvis utveckling av matchningsframgång
            </p>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                rate: { label: "Framgångsgrad", color: "#3b82f6" },
                successful: { label: "Lyckade", color: "#10b981" }
              }}
              className="h-80"
            >
              <LineChart data={monthlyMatchData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  name="Framgångsgrad (%)"
                />
                <Bar 
                  dataKey="successful" 
                  fill="#10b981" 
                  name="Lyckade matchningar"
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Skills Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Kompetensområden</CardTitle>
            <p className="text-sm text-gray-600">
              Framgångsgrad per teknisk kompetens
            </p>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                rate: { label: "Framgångsgrad", color: "#8b5cf6" }
              }}
              className="h-80"
            >
              <BarChart data={skillsMatchData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0,100]} />
                <YAxis dataKey="skill" type="category" width={80} />
                <ChartTooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border rounded shadow">
                          <p className="font-medium">{label}</p>
                          <p className="text-sm text-gray-600">
                            {data.success} av {data.matches} lyckade ({data.rate}%)
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="rate" fill="#8b5cf6" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Match Quality Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Matchningskvalitet & Detaljer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Score Distribution */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Poängfördelning</h4>
              <div className="space-y-3">
                {scoreDistribution.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-600">{item.range}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(item.count / totalMatches) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8">
                        {Math.round(item.count)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Match Status Breakdown */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Statusfördelning</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-600">Accepterade</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{successfulMatches}</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {((successfulMatches / totalMatches) * 100).toFixed(0)}%
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-yellow-500" />
                    <span className="text-gray-600">Väntande</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{pendingMatches}</span>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      {((pendingMatches / totalMatches) * 100).toFixed(0)}%
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="text-gray-600">Avvisade</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{rejectedMatches}</span>
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      {((rejectedMatches / totalMatches) * 100).toFixed(0)}%
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
