
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, AreaChart, Area, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, Lightbulb, Target, Users } from 'lucide-react';

interface TrendAnalysisProps {
  consultants: any[];
  assignments: any[];
  matches: any[];
  period: string;
}

export const TrendAnalysis: React.FC<TrendAnalysisProps> = ({ 
  consultants, 
  assignments, 
  matches, 
  period 
}) => {
  // Market demand trends
  const demandTrends = [
    { month: 'Jan', react: 45, typescript: 38, nodejs: 32, aws: 28, python: 25 },
    { month: 'Feb', react: 52, typescript: 41, nodejs: 35, aws: 31, python: 28 },
    { month: 'Mar', react: 58, typescript: 47, nodejs: 38, aws: 35, python: 32 },
    { month: 'Apr', react: 61, typescript: 52, nodejs: 42, aws: 38, python: 35 },
    { month: 'Maj', react: 67, typescript: 58, nodejs: 45, aws: 42, python: 38 },
    { month: 'Jun', react: 73, typescript: 64, nodejs: 48, aws: 45, python: 41 }
  ];

  // Industry trends
  const industryTrends = [
    { industry: 'Fintech', q1: 28, q2: 34, trend: 'up', growth: 21 },
    { industry: 'E-commerce', q1: 22, q2: 26, trend: 'up', growth: 18 },
    { industry: 'SaaS', q1: 31, q2: 35, trend: 'up', growth: 13 },
    { industry: 'Gaming', q1: 18, q2: 23, trend: 'up', growth: 28 },
    { industry: 'Healthcare', q1: 15, q2: 19, trend: 'up', growth: 27 },
    { industry: 'Manufacturing', q1: 12, q2: 10, trend: 'down', growth: -17 }
  ];

  // Rate trends
  const rateTrends = [
    { month: 'Jan', junior: 650, mid: 850, senior: 1200 },
    { month: 'Feb', junior: 675, mid: 875, senior: 1250 },
    { month: 'Mar', junior: 700, mid: 900, senior: 1300 },
    { month: 'Apr', junior: 725, mid: 925, senior: 1350 },
    { month: 'Maj', junior: 750, mid: 950, senior: 1400 },
    { month: 'Jun', junior: 775, mid: 975, senior: 1450 }
  ];

  // Emerging skills
  const emergingSkills = [
    { skill: 'AI/ML', growth: 145, demand: 89, consultants: 8 },
    { skill: 'Blockchain', growth: 78, demand: 34, consultants: 5 },
    { skill: 'WebAssembly', growth: 67, demand: 23, consultants: 3 },
    { skill: 'GraphQL', growth: 45, demand: 67, consultants: 12 },
    { skill: 'Rust', growth: 123, demand: 28, consultants: 4 },
    { skill: 'Flutter', growth: 89, demand: 45, consultants: 7 }
  ];

  return (
    <div className="space-y-6">
      {/* Trend Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                +34%
              </Badge>
            </div>
            <div className="text-3xl font-bold mb-2">React</div>
            <div className="text-gray-600">Mest efterfrågad</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Target className="h-8 w-8 text-blue-500" />
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Fintech
              </Badge>
            </div>
            <div className="text-3xl font-bold mb-2">+21%</div>
            <div className="text-gray-600">Växande bransch</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Lightbulb className="h-8 w-8 text-purple-500" />
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                AI/ML
              </Badge>
            </div>
            <div className="text-3xl font-bold mb-2">+145%</div>
            <div className="text-gray-600">Framväxande teknik</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="h-8 w-8 text-orange-500" />
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                Senior
              </Badge>
            </div>
            <div className="text-3xl font-bold mb-2">1450</div>
            <div className="text-gray-600">SEK/h genomsnitt</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills Demand Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Efterfrågetrender - Tekniska färdigheter</CardTitle>
            <p className="text-sm text-gray-600">
              Utveckling av efterfrågan över tid
            </p>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                react: { label: "React", color: "#61dafb" },
                typescript: { label: "TypeScript", color: "#3178c6" },
                nodejs: { label: "Node.js", color: "#339933" },
                aws: { label: "AWS", color: "#ff9900" },
                python: { label: "Python", color: "#3776ab" }
              }}
              className="h-80"
            >
              <LineChart data={demandTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 border rounded shadow">
                          <p className="font-medium mb-2">{label}</p>
                          {payload.map((entry, index) => (
                            <p key={index} className="text-sm" style={{ color: entry.color }}>
                              {entry.name}: {entry.value} uppdrag
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line type="monotone" dataKey="react" stroke="#61dafb" strokeWidth={2} />
                <Line type="monotone" dataKey="typescript" stroke="#3178c6" strokeWidth={2} />
                <Line type="monotone" dataKey="nodejs" stroke="#339933" strokeWidth={2} />
                <Line type="monotone" dataKey="aws" stroke="#ff9900" strokeWidth={2} />
                <Line type="monotone" dataKey="python" stroke="#3776ab" strokeWidth={2} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Rate Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Timurveckling</CardTitle>
            <p className="text-sm text-gray-600">
              Genomsnittlig timersättning per senioritetsnivå
            </p>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                junior: { label: "Junior", color: "#84cc16" },
                mid: { label: "Mid-level", color: "#3b82f6" },
                senior: { label: "Senior", color: "#8b5cf6" }
              }}
              className="h-80"
            >
              <AreaChart data={rateTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 border rounded shadow">
                          <p className="font-medium mb-2">{label}</p>
                          {payload.map((entry, index) => (
                            <p key={index} className="text-sm" style={{ color: entry.color }}>
                              {entry.name}: {entry.value} SEK/h
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="senior" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="mid" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="junior" stackId="1" stroke="#84cc16" fill="#84cc16" fillOpacity={0.6} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Industry Growth */}
        <Card>
          <CardHeader>
            <CardTitle>Branschtutveckling</CardTitle>
            <p className="text-sm text-gray-600">
              Kvartalsvis tillväxt per bransch
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {industryTrends.map((industry, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded ${
                      industry.trend === 'up' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {industry.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{industry.industry}</p>
                      <p className="text-sm text-gray-600">
                        Q1: {industry.q1} → Q2: {industry.q2} uppdrag
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`${
                      industry.growth > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {industry.growth > 0 ? '+' : ''}{industry.growth}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Emerging Technologies */}
        <Card>
          <CardHeader>
            <CardTitle>Framväxande teknologier</CardTitle>
            <p className="text-sm text-gray-600">
              Snabbast växande tekniska färdigheter
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {emergingSkills.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Lightbulb className="h-4 w-4 text-purple-500" />
                      <span className="font-medium">{skill.skill}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        +{skill.growth}%
                      </Badge>
                      {skill.consultants < 5 && (
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Efterfrågan:</span>
                      <span className="font-medium">{skill.demand}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tillgängliga:</span>
                      <span className={`font-medium ${
                        skill.consultants < 5 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {skill.consultants} konsulter
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full" 
                      style={{ width: `${Math.min(100, skill.growth)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strategic Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Strategiska insikter & Rekommendationer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                Tillväxtmöjligheter
              </h4>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded">
                  <p className="font-medium text-green-800">AI/ML-satsning</p>
                  <p className="text-sm text-green-700">
                    Rekrytera 5-8 AI/ML-konsulter för att möta den växande efterfrågan (+145%)
                  </p>
                </div>
                <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                  <p className="font-medium text-blue-800">Fintech-expansion</p>
                  <p className="text-sm text-blue-700">
                    Utöka fintech-portföljen med +21% tillväxt och hög marginal
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                Riskområden
              </h4>
              <div className="space-y-3">
                <div className="p-3 bg-amber-50 border-l-4 border-amber-500 rounded">
                  <p className="font-medium text-amber-800">Kompetensgap</p>
                  <p className="text-sm text-amber-700">
                    Brist på blockchain- och WebAssembly-utvecklare kan påverka framtida uppdrag
                  </p>
                </div>
                <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
                  <p className="font-medium text-red-800">Manufacturing-minskning</p>
                  <p className="text-sm text-red-700">
                    Tillverkningssektorn minskar (-17%) - överväg ompositionering
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
