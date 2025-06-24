
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Clock, Users, Target } from 'lucide-react';

interface ROIReportProps {
  matches: any[];
  consultants: any[];
  period: string;
}

export const ROIReport: React.FC<ROIReportProps> = ({ matches, consultants, period }) => {
  // Calculate ROI metrics
  const totalSavings = matches.reduce((sum, match) => sum + (match.estimated_savings || 45000), 0);
  const avgSavingsPerMatch = matches.length > 0 ? totalSavings / matches.length : 0;
  const timeToMatch = 12; // seconds average
  const manualMatchingTime = 8; // hours
  const timeSavingsHours = matches.length * (manualMatchingTime - (timeToMatch / 3600));
  const hourlyCost = 800; // SEK per hour for manual matching
  const timeSavingsCost = timeSavingsHours * hourlyCost;

  // Monthly savings trend data
  const savingsTrendData = [
    { month: 'Jan', savings: 120000, manual: 180000 },
    { month: 'Feb', savings: 156000, manual: 234000 },
    { month: 'Mar', savings: 203000, manual: 298000 },
    { month: 'Apr', savings: 187000, manual: 276000 },
    { month: 'Maj', savings: 245000, manual: 334000 },
    { month: 'Jun', savings: 289000, manual: 398000 }
  ];

  // Cost breakdown data
  const costBreakdownData = [
    { name: 'Tidsbesparingar', value: timeSavingsCost, color: '#3b82f6' },
    { name: 'Förbättrad matchning', value: totalSavings * 0.3, color: '#10b981' },
    { name: 'Reducerad omsättning', value: totalSavings * 0.4, color: '#f59e0b' },
    { name: 'Kvalitetsförbättringar', value: totalSavings * 0.3, color: '#8b5cf6' }
  ];

  const totalROI = totalSavings + timeSavingsCost;
  const monthlyROI = totalROI / 6; // 6 months average

  return (
    <div className="space-y-6">
      {/* ROI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="h-8 w-8 text-green-100" />
              <Badge variant="secondary" className="bg-green-400 text-green-800">
                +34%
              </Badge>
            </div>
            <div className="text-3xl font-bold mb-2">
              {(totalROI / 1000000).toFixed(1)}M SEK
            </div>
            <div className="text-green-100">Total ROI</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Clock className="h-8 w-8 text-blue-100" />
              <Badge variant="secondary" className="bg-blue-400 text-blue-800">
                {timeSavingsHours.toFixed(0)}h
              </Badge>
            </div>
            <div className="text-3xl font-bold mb-2">
              {(timeSavingsCost / 1000).toFixed(0)}K SEK
            </div>
            <div className="text-blue-100">Tidsbesparingar</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Target className="h-8 w-8 text-purple-100" />
              <Badge variant="secondary" className="bg-purple-400 text-purple-800">
                Per match
              </Badge>
            </div>
            <div className="text-3xl font-bold mb-2">
              {(avgSavingsPerMatch / 1000).toFixed(0)}K SEK
            </div>
            <div className="text-purple-100">Snitt per matchning</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="h-8 w-8 text-orange-100" />
              <Badge variant="secondary" className="bg-orange-400 text-orange-800">
                Månadsvis
              </Badge>
            </div>
            <div className="text-3xl font-bold mb-2">
              {(monthlyROI / 1000).toFixed(0)}K SEK
            </div>
            <div className="text-orange-100">Månatlig ROI</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Savings Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>ROI-utveckling över tid</CardTitle>
            <p className="text-sm text-gray-600">
              Jämförelse mellan AI-driven och manuell matchning
            </p>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                savings: { label: "AI-besparingar", color: "#3b82f6" },
                manual: { label: "Manuell kostnad", color: "#ef4444" }
              }}
              className="h-80"
            >
              <LineChart data={savingsTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="savings" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  name="AI-besparingar"
                />
                <Line 
                  type="monotone" 
                  dataKey="manual" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  name="Manuell kostnad"
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Cost Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Kostnadsfördelning</CardTitle>
            <p className="text-sm text-gray-600">
              Uppdelning av totala besparingar
            </p>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: { label: "Värde", color: "#3b82f6" }
              }}
              className="h-80"
            >
              <PieChart>
                <Pie
                  data={costBreakdownData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {costBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border rounded shadow">
                          <p className="font-medium">{data.name}</p>
                          <p className="text-sm text-gray-600">
                            {(data.value / 1000).toFixed(0)}K SEK
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* ROI Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detaljerad ROI-analys</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Kostnadsbesparingar</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tidsbesparingar</span>
                    <span className="font-medium">{(timeSavingsCost / 1000).toFixed(0)}K SEK</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Förbättrad kvalitet</span>
                    <span className="font-medium">{(totalSavings * 0.3 / 1000).toFixed(0)}K SEK</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reducerad omsättning</span>
                    <span className="font-medium">{(totalSavings * 0.4 / 1000).toFixed(0)}K SEK</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total besparing</span>
                      <span className="text-green-600">{(totalROI / 1000).toFixed(0)}K SEK</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Effektivitetsvinster</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Matchningstid</span>
                    <span className="font-medium">67% snabbare</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Framgångsgrad</span>
                    <span className="font-medium">+23% högre</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kundnöjdhet</span>
                    <span className="font-medium">96% (vs 88%)</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold">
                      <span>ROI-faktor</span>
                      <span className="text-blue-600">4.2x</span>
                    </div>
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
