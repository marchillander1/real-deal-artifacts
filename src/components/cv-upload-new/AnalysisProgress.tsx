
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, FileText, Search, Zap, CheckCircle2, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AnalysisProgressProps {
  sessionToken: string;
  personalTagline?: string;
  onAnalysisComplete: (results: any) => void;
}

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({
  sessionToken,
  personalTagline = '',
  onAnalysisComplete
}) => {
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  const stages = [
    { 
      id: 1, 
      title: 'CV Upload Processing', 
      description: 'Extracting text and structure from your CV', 
      icon: FileText,
      duration: 20000 // 20 seconds
    },
    { 
      id: 2, 
      title: 'AI Analysis Engine', 
      description: 'Advanced AI analyzing your skills, experience, and potential', 
      icon: Brain,
      duration: 45000 // 45 seconds  
    },
    { 
      id: 3, 
      title: 'Market Intelligence', 
      description: 'Comparing your profile against market demand and opportunities', 
      icon: Search,
      duration: 30000 // 30 seconds
    },
    { 
      id: 4, 
      title: 'Profile Enhancement', 
      description: 'Optimizing your profile for maximum market appeal', 
      icon: Zap,
      duration: 25000 // 25 seconds
    },
    { 
      id: 5, 
      title: 'Network Integration', 
      description: 'Adding you to the MatchWise consultant network', 
      icon: CheckCircle2,
      duration: 15000 // 15 seconds
    },
    { 
      id: 6, 
      title: 'Welcome Email', 
      description: 'Sending your welcome package and profile access', 
      icon: Mail,
      duration: 5000 // 5 seconds
    }
  ];

  useEffect(() => {
    const startAnalysis = async () => {
      console.log('🚀 Starting comprehensive CV analysis...');
      
      // Get stored file data
      const fileDataKey = `cv-data-${sessionToken}`;
      const fileInfoKey = `cv-file-${sessionToken}`;
      const taglineKey = `cv-tagline-${sessionToken}`;
      
      const fileDataUrl = sessionStorage.getItem(fileDataKey);
      const fileInfo = sessionStorage.getItem(fileInfoKey);
      const storedTagline = sessionStorage.getItem(taglineKey);
      
      if (!fileDataUrl || !fileInfo) {
        console.error('❌ Missing file data for analysis');
        return;
      }

      try {
        const fileInfoParsed = JSON.parse(fileInfo);
        
        // Convert data URL back to File
        const response = await fetch(fileDataUrl);
        const blob = await response.blob();
        const file = new File([blob], fileInfoParsed.name, { 
          type: fileInfoParsed.type,
          lastModified: fileInfoParsed.lastModified 
        });

        // Start progress simulation
        let currentProgress = 0;
        let stageIndex = 0;
        
        const progressInterval = setInterval(() => {
          const stage = stages[stageIndex];
          const stageProgress = Math.min(100, currentProgress + (100 / stage.duration) * 1000);
          
          setProgress(Math.floor(stageProgress));
          setCurrentStage(stageIndex);
          
          if (stageProgress >= 100 && stageIndex < stages.length - 1) {
            stageIndex++;
            currentProgress = 0;
          } else {
            currentProgress = stageProgress;
          }
        }, 1000);

        // Perform real analysis
        const formData = new FormData();
        formData.append('file', file);
        formData.append('personalTagline', storedTagline || personalTagline || '');
        formData.append('personalDescription', storedTagline || personalTagline || '');

        console.log('📤 Sending CV for AI analysis...');
        
        const analysisResponse = await supabase.functions.invoke('parse-cv', {
          body: formData
        });

        clearInterval(progressInterval);

        if (analysisResponse.error) {
          console.error('❌ Analysis failed:', analysisResponse.error);
          throw new Error(`Analysis failed: ${analysisResponse.error.message}`);
        }

        const result = analysisResponse.data;
        
        if (!result.success) {
          throw new Error(result.error || 'Analysis failed');
        }

        console.log('✅ CV analysis completed successfully');
        console.log('👤 Consultant created:', result.consultant?.id);
        console.log('📧 Welcome email status: sent');
        
        // Complete all stages
        setProgress(100);
        setCurrentStage(stages.length - 1);
        setIsComplete(true);
        setAnalysisResults({
          analysis: result.analysis,
          consultant: result.consultant,
          detectedInformation: result.detectedInformation,
          extractionStats: result.extractionStats
        });

        // Wait a moment to show completion, then proceed
        setTimeout(() => {
          onAnalysisComplete({
            analysis: result.analysis,
            consultant: result.consultant,
            detectedInformation: result.detectedInformation,
            extractionStats: result.extractionStats
          });
        }, 2000);

      } catch (error: any) {
        console.error('❌ Analysis error:', error);
        clearInterval(progressInterval);
        // Handle error appropriately
      }
    };

    startAnalysis();
  }, [sessionToken, personalTagline, onAnalysisComplete]);

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold mb-2">
            🤖 AI Analysis in Progress
          </CardTitle>
          <p className="text-blue-100">
            Our advanced AI is analyzing your CV and creating your consultant profile
          </p>
        </CardHeader>

        <CardContent className="p-8">
          {/* Overall Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Overall Progress</span>
              <span className="text-sm font-medium text-gray-600">{Math.floor((currentStage + 1) / stages.length * 100)}%</span>
            </div>
            <Progress value={(currentStage + 1) / stages.length * 100} className="h-3" />
          </div>

          {/* Current Stage Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Current Stage</span>
              <span className="text-sm font-medium text-gray-600">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Stages List */}
          <div className="space-y-4">
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              const isActive = index === currentStage;
              const isCompleted = index < currentStage || (index === currentStage && isComplete);
              const isUpcoming = index > currentStage;

              return (
                <div 
                  key={stage.id}
                  className={`flex items-center p-4 rounded-xl border-2 transition-all duration-500 ${
                    isActive 
                      ? 'border-blue-500 bg-blue-50 shadow-md scale-105' 
                      : isCompleted
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                    isActive
                      ? 'bg-blue-500 text-white animate-pulse'
                      : isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-500'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : (
                      <Icon className={`h-6 w-6 ${isActive ? 'animate-spin' : ''}`} />
                    )}
                  </div>
                  
                  <div className="ml-4 flex-grow">
                    <h3 className={`font-semibold ${
                      isActive 
                        ? 'text-blue-900' 
                        : isCompleted 
                        ? 'text-green-900'
                        : 'text-gray-600'
                    }`}>
                      {stage.title}
                    </h3>
                    <p className={`text-sm ${
                      isActive 
                        ? 'text-blue-700' 
                        : isCompleted 
                        ? 'text-green-700'
                        : 'text-gray-500'
                    }`}>
                      {stage.description}
                    </p>
                  </div>

                  <div className="flex-shrink-0 ml-4">
                    {isActive && (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span className="text-sm text-blue-600 font-medium">Processing...</span>
                      </div>
                    )}
                    {isCompleted && (
                      <span className="text-sm text-green-600 font-medium">✅ Complete</span>
                    )}
                    {isUpcoming && (
                      <span className="text-sm text-gray-400">Pending</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Analysis Details */}
          {personalTagline && (
            <div className="mt-8 p-4 bg-purple-50 rounded-xl border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-2">
                🎯 Enhanced Analysis Active
              </h4>
              <p className="text-sm text-purple-700">
                Using your personal tagline to provide more targeted insights and recommendations.
              </p>
            </div>
          )}

          {isComplete && analysisResults && (
            <div className="mt-8 p-6 bg-green-50 rounded-xl border border-green-200">
              <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                🎉 Analysis Complete!
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-bold text-green-800">{analysisResults.extractionStats?.detectedSkills || 0}</div>
                  <div className="text-green-600">Skills Identified</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-green-800">✅</div>
                  <div className="text-green-600">Profile Created</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-green-800">✅</div>
                  <div className="text-green-600">Network Added</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-green-800">✅</div>
                  <div className="text-green-600">Email Sent</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
