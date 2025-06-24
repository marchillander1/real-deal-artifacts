
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  BarChart3, 
  Download,
  Calendar,
  Target,
  Clock
} from 'lucide-react';
import { ROIReport } from './ROIReport';
import { MatchingAnalytics } from './MatchingAnalytics';
import { ConsultantPerformance } from './ConsultantPerformance';
import { TrendAnalysis } from './TrendAnalysis';

interface ReportsOverviewProps {
  consultants: any[];
  assignments: any[];
  matches: any[];
}

export const ReportsOverview: React.FC<ReportsOverviewProps> = ({
  consultants,
  assignments,
  matches
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  // Calculate summary statistics
  const totalMatches = matches.length;
  const successfulMatches = matches.filter(m => m.status === 'accepted').length;
  const successRate = totalMatches > 0 ? Math.round((successfulMatches / totalMatches) * 100) : 0;
  
  const totalConsultants = consultants.length;
  const activeConsultants = consultants.filter(c => c.availability === 'Available').length;
  
  // Estimated savings calculation
  const estimatedSavings = matches.reduce((total, match) => {
    return total + (match.estimated_savings || 45000);
  }, 0);

  const avgMatchTime = "12 seconds";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rapporter & Analys</h1>
          <p className="text-gray-600">Detaljerad insikt i plattformens prestanda och ROI</p>
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
          
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exportera rapport
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {(estimatedSavings / 1000).toFixed(0)}K SEK
            </div>
            <p className="text-xs text-gray-500 flex items-center mt-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              +23% vs förra månaden
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Matchningsframgång</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{successRate}%</div>
            <p className="text-xs text-gray-500 flex items-center mt-1">
              <Target className="h-4 w-4 mr-1" />
              {successfulMatches} av {totalMatches} lyckade
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Aktiva konsulter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{activeConsultants}</div>
            <p className="text-xs text-gray-500 flex items-center mt-1">
              <Users className="h-4 w-4 mr-1" />
              av {totalConsultants} totalt
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Snitt matchningstid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{avgMatchTime}</div>
            <p className="text-xs text-gray-500 flex items-center mt-1">
              <Clock className="h-4 w-4 mr-1" />
              67% snabbare än manuellt
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports Tabs */}
      <Tabs defaultValue="roi" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="roi">ROI-analys</TabsTrigger>
          <TabsTrigger value="matching">Matchningsanalys</TabsTrigger>
          <TabsTrigger value="performance">Konsultantprestanda</TabsTrigger>
          <TabsTrigger value="trends">Trendanalys</TabsTrigger>
        </TabsList>

        <TabsContent value="roi">
          <ROIReport 
            matches={matches}
            consultants={consultants}
            period={selectedPeriod}
          />
        </TabsContent>

        <TabsContent value="matching">
          <MatchingAnalytics 
            matches={matches}
            assignments={assignments}
            period={selectedPeriod}
          />
        </TabsContent>

        <TabsContent value="performance">
          <ConsultantPerformance 
            consultants={consultants}
            matches={matches}
            period={selectedPeriod}
          />
        </TabsContent>

        <TabsContent value="trends">
          <TrendAnalysis 
            consultants={consultants}
            assignments={assignments}
            matches={matches}
            period={selectedPeriod}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
