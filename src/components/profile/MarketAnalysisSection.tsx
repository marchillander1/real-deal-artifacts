
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, Target, BarChart } from 'lucide-react';

interface MarketAnalysisSectionProps {
  consultant: any;
}

export const MarketAnalysisSection: React.FC<MarketAnalysisSectionProps> = ({ consultant }) => {
  const optimizationPotential = consultant.market_rate_optimized - consultant.hourly_rate;
  const optimizationPercentage = Math.round((optimizationPotential / consultant.hourly_rate) * 100);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Marknadsanalys & prissättning</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Rate */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
              Nuvarande timtaxa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {consultant.hourly_rate} SEK
            </div>
            <p className="text-sm text-gray-600">
              Din nuvarande prissättning baserat på marknadsnormer
            </p>
          </CardContent>
        </Card>

        {/* Optimized Rate */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Optimerad timtaxa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {consultant.market_rate_optimized} SEK
            </div>
            <p className="text-sm text-gray-600">
              Rekommenderad taxa baserat på din kompetens och marknadsnachfrågan
            </p>
          </CardContent>
        </Card>

        {/* Optimization Potential */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-purple-600" />
              Optimeringspotential
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              +{optimizationPercentage}%
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">+{optimizationPotential} SEK/timme</span>
              <br />
              Möjlig intäktsökning
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Market Position */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-indigo-600" />
            Marknadsposition & konkurrensfördelar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Dina konkurrensfördelar:</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm">Fullstack-expertis inom moderna teknologier</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm">Bevisad track record inom flera branscher</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm">Stark kommunikationsförmåga och teamledarskap</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm">Certifierade färdigheter inom molnteknologi</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Marknadsnachfrågan:</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">React/TypeScript:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                      <div className="w-4/5 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-sm text-green-600 font-medium">Hög</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Cloud (AWS):</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                      <div className="w-full h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-sm text-green-600 font-medium">Mycket hög</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Fullstack:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                      <div className="w-4/5 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-sm text-green-600 font-medium">Hög</span>
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
