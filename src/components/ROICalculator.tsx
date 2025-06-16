
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, TrendingUp, DollarSign, Clock } from 'lucide-react';

export default function ROICalculator() {
  const [inputs, setInputs] = useState({
    consultantsPerMonth: 5,
    averageHourlyRate: 150,
    hoursPerProject: 160,
    currentMatchingTime: 15,
    projectFailureRate: 40
  });

  const [showResults, setShowResults] = useState(false);

  const calculateROI = () => {
    const monthlyProjects = inputs.consultantsPerMonth;
    const projectValue = inputs.averageHourlyRate * inputs.hoursPerProject;
    
    // Current costs
    const currentMatchingCostPerProject = (inputs.currentMatchingTime * 100); // $100/hour for internal cost
    const currentFailureCost = (projectValue * inputs.projectFailureRate / 100);
    const currentTotalCostPerProject = currentMatchingCostPerProject + currentFailureCost;
    const currentMonthlyCost = currentTotalCostPerProject * monthlyProjects;
    
    // MatchWise costs
    const matchWiseMatchingTime = 0.2; // 12 seconds = 0.2 hours
    const matchWiseFailureRate = 4; // 96% success rate
    const matchWiseMatchingCost = matchWiseMatchingTime * 100;
    const matchWiseFailureCost = projectValue * matchWiseFailureRate / 100;
    const matchWiseTotalCostPerProject = matchWiseMatchingCost + matchWiseFailureCost;
    const matchWiseMonthlyCost = matchWiseTotalCostPerProject * monthlyProjects;
    
    const monthlySavings = currentMonthlyCost - matchWiseMonthlyCost;
    const annualSavings = monthlySavings * 12;
    const roiPercentage = ((monthlySavings * 12) / (199 * 12)) * 100; // Based on Team plan
    
    return {
      currentMonthlyCost: Math.round(currentMonthlyCost),
      matchWiseMonthlyCost: Math.round(matchWiseMonthlyCost),
      monthlySavings: Math.round(monthlySavings),
      annualSavings: Math.round(annualSavings),
      roiPercentage: Math.round(roiPercentage),
      timeSaved: Math.round((inputs.currentMatchingTime - matchWiseMatchingTime) * monthlyProjects),
      failureReduction: inputs.projectFailureRate - matchWiseFailureRate
    };
  };

  const results = calculateROI();

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({
      ...prev,
      [field]: parseInt(value) || 0
    }));
  };

  const handleCalculateClick = () => {
    setShowResults(true);
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Calculator className="h-8 w-8 text-green-400 mr-3" />
            <h3 className="text-2xl font-bold text-white">ROI Calculator</h3>
          </div>
          <p className="text-gray-300">See your potential savings with MatchWise AI</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white mb-4">Your Current Situation</h4>
            
            <div>
              <Label htmlFor="consultants" className="text-gray-300">Consultants hired per month</Label>
              <Input
                id="consultants"
                type="number"
                value={inputs.consultantsPerMonth}
                onChange={(e) => handleInputChange('consultantsPerMonth', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white mt-2"
              />
            </div>

            <div>
              <Label htmlFor="hourlyRate" className="text-gray-300">Average hourly rate (€)</Label>
              <Input
                id="hourlyRate"
                type="number"
                value={inputs.averageHourlyRate}
                onChange={(e) => handleInputChange('averageHourlyRate', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white mt-2"
              />
            </div>

            <div>
              <Label htmlFor="projectHours" className="text-gray-300">Average hours per project</Label>
              <Input
                id="projectHours"
                type="number"
                value={inputs.hoursPerProject}
                onChange={(e) => handleInputChange('hoursPerProject', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white mt-2"
              />
            </div>

            <div>
              <Label htmlFor="matchingTime" className="text-gray-300">Hours spent matching per hire</Label>
              <Input
                id="matchingTime"
                type="number"
                value={inputs.currentMatchingTime}
                onChange={(e) => handleInputChange('currentMatchingTime', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white mt-2"
              />
            </div>

            <div>
              <Label htmlFor="failureRate" className="text-gray-300">Project failure rate (%)</Label>
              <Input
                id="failureRate"
                type="number"
                value={inputs.projectFailureRate}
                onChange={(e) => handleInputChange('projectFailureRate', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white mt-2"
              />
            </div>

            <Button 
              onClick={handleCalculateClick}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Calculator className="mr-2 h-4 w-4" />
              Calculate My ROI
            </Button>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {showResults ? (
              <>
                <h4 className="text-lg font-semibold text-white mb-4">Your ROI with MatchWise</h4>
                
                <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                  <CardContent className="p-6 text-center">
                    <DollarSign className="h-12 w-12 mx-auto mb-4" />
                    <div className="text-3xl font-bold mb-2">€{results.annualSavings.toLocaleString()}</div>
                    <div className="text-green-100">Annual Savings</div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-blue-600/20 border-blue-500">
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                      <div className="text-2xl font-bold text-white">{results.roiPercentage}%</div>
                      <div className="text-blue-300 text-sm">ROI</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-600/20 border-purple-500">
                    <CardContent className="p-4 text-center">
                      <Clock className="h-8 w-8 mx-auto mb-2 text-purple-400" />
                      <div className="text-2xl font-bold text-white">{results.timeSaved}h</div>
                      <div className="text-purple-300 text-sm">Time Saved/Month</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-3 bg-gray-700/30 p-4 rounded-lg">
                  <div className="flex justify-between text-gray-300">
                    <span>Current monthly cost:</span>
                    <span className="text-red-400">€{results.currentMonthlyCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>MatchWise monthly cost:</span>
                    <span className="text-green-400">€{results.matchWiseMonthlyCost.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-gray-600 pt-2 flex justify-between font-semibold">
                    <span className="text-white">Monthly savings:</span>
                    <span className="text-green-400">€{results.monthlySavings.toLocaleString()}</span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-gray-300 text-sm">
                    Failure rate reduced from {inputs.projectFailureRate}% to 4%
                  </p>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-400">
                  <Calculator className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Fill in your details and calculate your ROI</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
