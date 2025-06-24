
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Award, 
  Target, 
  DollarSign,
  BarChart3,
  Zap
} from 'lucide-react';

interface ProfileMetricsProps {
  consultant: any;
}

export const ProfileMetrics: React.FC<ProfileMetricsProps> = ({ consultant }) => {
  const completenessScore = 85; // Calculate based on filled fields
  const performanceScore = consultant.rating * 20; // Convert 5-star to 100-point scale
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Market Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Marknadsvärde</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{consultant.hourly_rate} SEK</div>
          <p className="text-xs text-muted-foreground">
            +{Math.round(((consultant.market_rate_optimized || consultant.hourly_rate) - consultant.hourly_rate) / consultant.hourly_rate * 100)}% potential
          </p>
          <Progress 
            value={(consultant.hourly_rate / (consultant.market_rate_optimized || consultant.hourly_rate)) * 100} 
            className="mt-2"
          />
        </CardContent>
      </Card>

      {/* Performance Score */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Prestanda</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{consultant.rating}/5</div>
          <p className="text-xs text-muted-foreground">
            {consultant.projects_completed} avslutade projekt
          </p>
          <Progress value={performanceScore} className="mt-2" />
        </CardContent>
      </Card>

      {/* Profile Completeness */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Profil komplett</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completenessScore}%</div>
          <p className="text-xs text-muted-foreground">
            Nästan färdig
          </p>
          <Progress value={completenessScore} className="mt-2" />
        </CardContent>
      </Card>

      {/* Thought Leadership */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Expertis</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{consultant.thought_leadership_score}/100</div>
          <p className="text-xs text-muted-foreground">
            Branschexpertis
          </p>
          <Progress value={consultant.thought_leadership_score} className="mt-2" />
        </CardContent>
      </Card>
    </div>
  );
};
