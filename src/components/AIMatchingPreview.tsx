
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Heart, Users, Clock, Zap } from 'lucide-react';

interface MatchResult {
  name: string;
  score: number;
  technicalMatch: number;
  culturalMatch: number;
  communicationMatch: number;
  skills: string[];
  personality: string[];
}

const mockConsultants: MatchResult[] = [
  {
    name: "Anna Svensson",
    score: 95,
    technicalMatch: 92,
    culturalMatch: 98,
    communicationMatch: 95,
    skills: ["React", "TypeScript", "Node.js", "AWS"],
    personality: ["Collaborative", "Detail-oriented", "Proactive"]
  },
  {
    name: "Erik Larsson", 
    score: 87,
    technicalMatch: 95,
    culturalMatch: 82,
    communicationMatch: 85,
    skills: ["Python", "Django", "PostgreSQL", "Docker"],
    personality: ["Analytical", "Independent", "Problem-solver"]
  },
  {
    name: "Maria Lindberg",
    score: 83,
    technicalMatch: 88,
    culturalMatch: 85,
    communicationMatch: 76,
    skills: ["Java", "Spring", "Microservices", "Kubernetes"],
    personality: ["Leadership", "Strategic", "Results-driven"]
  }
];

export default function AIMatchingPreview() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedRequirements, setSelectedRequirements] = useState<string[]>([]);

  const requirements = [
    "Frontend Development",
    "Team Leadership",
    "Agile Experience", 
    "Client Facing",
    "Startup Environment",
    "Remote Work"
  ];

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setShowResults(false);
    
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 2000);
  };

  const toggleRequirement = (req: string) => {
    setSelectedRequirements(prev => 
      prev.includes(req) 
        ? prev.filter(r => r !== req)
        : [...prev, req]
    );
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Brain className="h-8 w-8 text-blue-400 mr-3" />
            <h3 className="text-2xl font-bold text-white">Try Our AI Matching</h3>
          </div>
          <p className="text-gray-300">See how our AI analyzes the whole person in real-time</p>
        </div>

        {/* Requirements Selection */}
        <div className="mb-8">
          <h4 className="text-white font-semibold mb-4">Select Project Requirements:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {requirements.map((req) => (
              <Badge
                key={req}
                variant={selectedRequirements.includes(req) ? "default" : "outline"}
                className={`cursor-pointer p-3 text-center transition-colors ${
                  selectedRequirements.includes(req) 
                    ? "bg-blue-600 text-white hover:bg-blue-700" 
                    : "text-gray-300 hover:bg-gray-700"
                }`}
                onClick={() => toggleRequirement(req)}
              >
                {req}
              </Badge>
            ))}
          </div>
        </div>

        {/* Analyze Button */}
        <div className="text-center mb-8">
          <Button
            onClick={handleAnalyze}
            disabled={selectedRequirements.length === 0 || isAnalyzing}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700"
          >
            {isAnalyzing ? (
              <>
                <Zap className="mr-2 h-4 w-4 animate-pulse" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Find Perfect Matches
              </>
            )}
          </Button>
        </div>

        {/* Analysis Progress */}
        {isAnalyzing && (
          <div className="mb-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-gray-300">
                <span>Analyzing technical skills...</span>
                <span>100%</span>
              </div>
              <Progress value={100} className="h-2" />
              
              <div className="flex items-center justify-between text-gray-300">
                <span>Evaluating cultural fit...</span>
                <span>85%</span>
              </div>
              <Progress value={85} className="h-2" />
              
              <div className="flex items-center justify-between text-gray-300">
                <span>Matching communication styles...</span>
                <span>92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
          </div>
        )}

        {/* Results */}
        {showResults && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold text-white">Top Matches Found</h4>
              <Badge className="bg-green-600 text-white">
                <Clock className="w-3 h-3 mr-1" />
                1.2 seconds
              </Badge>
            </div>

            {mockConsultants.map((consultant, index) => (
              <Card key={consultant.name} className="bg-gray-700/50 border-gray-600">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h5 className="text-lg font-semibold text-white">{consultant.name}</h5>
                      <div className="flex items-center mt-1">
                        <div className="text-2xl font-bold text-green-400 mr-2">{consultant.score}%</div>
                        <span className="text-gray-400">overall match</span>
                      </div>
                    </div>
                    <Badge variant={index === 0 ? "default" : "outline"} className={index === 0 ? "bg-green-600" : ""}>
                      #{index + 1} Match
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="flex items-center mb-2">
                        <Brain className="h-4 w-4 text-blue-400 mr-1" />
                        <span className="text-gray-300 text-sm">Technical: {consultant.technicalMatch}%</span>
                      </div>
                      <Progress value={consultant.technicalMatch} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center mb-2">
                        <Heart className="h-4 w-4 text-pink-400 mr-1" />
                        <span className="text-gray-300 text-sm">Cultural: {consultant.culturalMatch}%</span>
                      </div>
                      <Progress value={consultant.culturalMatch} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center mb-2">
                        <Users className="h-4 w-4 text-purple-400 mr-1" />
                        <span className="text-gray-300 text-sm">Communication: {consultant.communicationMatch}%</span>
                      </div>
                      <Progress value={consultant.communicationMatch} className="h-2" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h6 className="text-white font-medium mb-2">Technical Skills</h6>
                      <div className="flex flex-wrap gap-2">
                        {consultant.skills.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-blue-300 border-blue-500">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h6 className="text-white font-medium mb-2">Personality Traits</h6>
                      <div className="flex flex-wrap gap-2">
                        {consultant.personality.map((trait) => (
                          <Badge key={trait} variant="outline" className="text-pink-300 border-pink-500">
                            {trait}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
