
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, FileText, CheckCircle2, TrendingUp, User, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AnalysisProgressProps {
  sessionToken: string;
  personalTagline?: string;
  uploadedFile: File | null;
  onAnalysisComplete: (results: any) => void;
}

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({
  sessionToken,
  personalTagline = '',
  uploadedFile,
  onAnalysisComplete
}) => {
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(120);
  const [isComplete, setIsComplete] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const stages = [
    { 
      id: 1, 
      title: 'Analyzing CV with Gemini AI', 
      description: 'Extracting technical skills and experience', 
      icon: Brain,
      duration: 45,
      status: 'In progress...'
    },
    { 
      id: 2, 
      title: 'AI analysis of soft skills', 
      description: 'Assessing communication style and leadership', 
      icon: User,
      duration: 35,
      status: 'Waiting'
    },
    { 
      id: 3, 
      title: 'Market valuation', 
      description: 'Calculating optimal hourly rate and competitiveness', 
      icon: TrendingUp,
      duration: 25,
      status: 'Waiting'
    },
    { 
      id: 4, 
      title: 'Finalizing analysis', 
      description: 'Preparing comprehensive career insights', 
      icon: FileText,
      duration: 15,
      status: 'Waiting'
    }
  ];

  const ongoingAnalyses = [
    'Identifying your unique strengths...',
    'Analyzing technical expertise depth...',
    'Evaluating market positioning...',
    'Assessing leadership potential...',
    'Calculating optimal rates...',
    'Building comprehensive profile...'
  ];

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    let timeInterval: NodeJS.Timeout;
    let analysisInterval: NodeJS.Timeout;
    let analysisComplete = false;

    const startAnalysis = async () => {
      console.log('🚀 Starting comprehensive CV analysis...');
      setErrorMessage('');
      
      if (!uploadedFile) {
        console.error('❌ No uploaded file available for analysis');
        setErrorMessage('No file available for analysis');
        setCurrentAnalysis('Error: No file available for analysis');
        return;
      }

      console.log('📄 Using uploaded file:', {
        name: uploadedFile.name,
        size: uploadedFile.size,
        type: uploadedFile.type
      });

      // Validate file
      if (uploadedFile.size > 5 * 1024 * 1024) {
        setErrorMessage('File too large. Maximum size is 5MB.');
        setCurrentAnalysis('Error: File too large');
        return;
      }

      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(uploadedFile.type)) {
        setErrorMessage('Invalid file type. Please upload a PDF or Word document.');
        setCurrentAnalysis('Error: Invalid file type');
        return;
      }

      try {
        // Start progress simulation
        let currentProgress = 0;
        let stageIndex = 0;
        let analysisIndex = 0;
        
        progressInterval = setInterval(() => {
          if (analysisComplete) return;
          
          const stage = stages[stageIndex];
          const increment = 100 / stage.duration;
          currentProgress += increment;
          
          setProgress(Math.min(100, Math.floor(currentProgress)));
          
          if (currentProgress >= 100 && stageIndex < stages.length - 1) {
            stageIndex++;
            setCurrentStage(stageIndex);
            currentProgress = 0;
          }
          
          // Update overall progress
          const stageWeight = 100 / stages.length;
          const totalProgress = (stageIndex * stageWeight) + (currentProgress * stageWeight / 100);
          setOverallProgress(Math.min(100, Math.floor(totalProgress)));
        }, 1000);

        // Update time remaining
        timeInterval = setInterval(() => {
          setTimeRemaining(prev => Math.max(0, prev - 1));
        }, 1000);

        // Rotate ongoing analysis messages
        analysisInterval = setInterval(() => {
          if (analysisComplete) return;
          setCurrentAnalysis(ongoingAnalyses[analysisIndex % ongoingAnalyses.length]);
          analysisIndex++;
        }, 3000);

        // Start with first analysis message
        setCurrentAnalysis(ongoingAnalyses[0]);

        // Perform real analysis with the uploaded file
        const formData = new FormData();
        formData.append('file', uploadedFile);
        
        // Add personal tagline if available
        const storedTagline = sessionStorage.getItem(`cv-tagline-${sessionToken}`);
        const taglineToUse = storedTagline || personalTagline || '';
        
        if (taglineToUse) {
          formData.append('personalTagline', taglineToUse);
          formData.append('personalDescription', taglineToUse);
        }

        console.log('📤 Sending CV for AI analysis...', {
          fileName: uploadedFile.name,
          fileSize: uploadedFile.size,
          hasTagline: !!taglineToUse
        });
        
        const analysisResponse = await supabase.functions.invoke('parse-cv', {
          body: formData
        });

        console.log('📥 Analysis response received:', {
          hasError: !!analysisResponse.error,
          hasData: !!analysisResponse.data,
          error: analysisResponse.error
        });

        // Stop intervals
        analysisComplete = true;
        clearInterval(progressInterval);
        clearInterval(timeInterval);
        clearInterval(analysisInterval);

        if (analysisResponse.error) {
          console.error('❌ Analysis failed:', analysisResponse.error);
          setErrorMessage(`Analysis failed: ${analysisResponse.error.message || 'Unknown error'}`);
          setCurrentAnalysis(`Analysis failed: ${analysisResponse.error.message || 'Unknown error'}`);
          return;
        }

        const result = analysisResponse.data;
        
        if (!result || !result.success) {
          console.error('❌ Analysis result invalid:', result);
          const errorMsg = result?.error || 'Analysis failed - invalid response';
          setErrorMessage(errorMsg);
          setCurrentAnalysis(errorMsg);
          return;
        }

        console.log('✅ CV analysis completed successfully');
        console.log('📊 Analysis results preview:', {
          hasAnalysis: !!result.analysis,
          hasConsultant: !!result.consultant,
          hasDetectedInfo: !!result.detectedInformation,
          hasStats: !!result.extractionStats
        });
        
        // Complete all stages
        setProgress(100);
        setCurrentStage(stages.length - 1);
        setOverallProgress(100);
        setIsComplete(true);
        setTimeRemaining(0);
        setCurrentAnalysis('Analysis complete!');
        
        const resultsData = {
          analysis: result.analysis,
          consultant: result.consultant,
          detectedInformation: result.detectedInformation,
          extractionStats: result.extractionStats
        };
        
        setAnalysisResults(resultsData);

        // Wait a moment to show completion, then proceed
        setTimeout(() => {
          console.log('🎯 Calling onAnalysisComplete with results');
          onAnalysisComplete(resultsData);
        }, 2000);

      } catch (error: any) {
        console.error('❌ Analysis error:', error);
        analysisComplete = true;
        clearInterval(progressInterval);
        clearInterval(timeInterval);
        clearInterval(analysisInterval);
        
        const errorMsg = error.message || 'Analysis failed';
        setErrorMessage(errorMsg);
        setCurrentAnalysis(`Analysis failed: ${errorMsg}`);
      }
    };

    startAnalysis();

    return () => {
      clearInterval(progressInterval);
      clearInterval(timeInterval);
      clearInterval(analysisInterval);
    };
  }, [sessionToken, personalTagline, uploadedFile, onAnalysisComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="text-3xl font-bold mb-2">
            AI Analyzing Your Profile
          </CardTitle>
          <p className="text-lg text-blue-100 mb-4">
            Our advanced AI system analyzes both soft and hard skills for deep career insights
          </p>
          <div className="text-xl font-semibold">
            Estimated time remaining: {formatTime(timeRemaining)}
          </div>
        </CardHeader>

        <CardContent className="p-8">
          {/* Error Display */}
          {errorMessage && (
            <div className="mb-8 p-4 bg-red-50 rounded-xl border border-red-200">
              <div className="flex items-center space-x-3">
                <div className="text-red-600">❌</div>
                <div>
                  <h4 className="font-semibold text-red-900">Analysis Error:</h4>
                  <p className="text-red-700">{errorMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* Overall Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-semibold text-gray-700">Analysis Progress</span>
              <span className="text-lg font-semibold text-gray-700">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-4 mb-2" />
            <div className="text-sm text-gray-600">
              {stages[currentStage]?.title || 'Completing analysis...'}
            </div>
          </div>

          {/* What's being analyzed right now section */}
          {!errorMessage && (
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <div className="flex items-center space-x-3 mb-4">
                <Target className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl font-bold text-blue-900">What's being analyzed right now:</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-blue-800 mb-3">Technical skills:</h4>
                  <ul className="space-y-1 text-blue-700">
                    <li>• Programming languages & frameworks</li>
                    <li>• Certifications & education</li>
                    <li>• Project examples & portfolio</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-blue-800 mb-3">Soft skills:</h4>
                  <ul className="space-y-1 text-blue-700">
                    <li>• Communication style</li>
                    <li>• Leadership abilities</li>
                    <li>• Teamwork & cultural fit</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-blue-800 mb-3">Market valuation:</h4>
                  <ul className="space-y-1 text-blue-700">
                    <li>• Optimal hourly rate</li>
                    <li>• Competitive advantages</li>
                    <li>• Demand & trends</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-blue-800 mb-3">Career development:</h4>
                  <ul className="space-y-1 text-blue-700">
                    <li>• Development areas</li>
                    <li>• Recommended courses</li>
                    <li>• Next career step</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Current Analysis */}
          {!errorMessage && (
            <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <div>
                  <h4 className="font-semibold text-blue-900">🔍 Ongoing analysis:</h4>
                  <p className="text-blue-700">{currentAnalysis}</p>
                </div>
              </div>
            </div>
          )}

          {/* Active Stage Detail */}
          {!errorMessage && (
            <div className="mb-8">
              <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
                <div className="flex items-center space-x-4 mb-4">
                  {React.createElement(stages[currentStage]?.icon || Brain, { 
                    className: "h-8 w-8 text-blue-600 animate-pulse" 
                  })}
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-blue-900">
                      {stages[currentStage]?.title}
                    </h3>
                    <p className="text-blue-700">
                      {stages[currentStage]?.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{progress}%</div>
                    <div className="text-sm text-blue-500">Progress</div>
                  </div>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          )}

          {/* All Stages Overview */}
          <div className="space-y-3 mb-8">
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              const isActive = index === currentStage;
              const isCompleted = index < currentStage || (index === currentStage && isComplete);
              const isUpcoming = index > currentStage;

              return (
                <div 
                  key={stage.id}
                  className={`flex items-center p-4 rounded-xl border transition-all duration-300 ${
                    isActive 
                      ? 'border-blue-300 bg-blue-50 shadow-md' 
                      : isCompleted
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    isActive
                      ? 'bg-blue-500 text-white'
                      : isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-500'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  
                  <div className="ml-4 flex-grow">
                    <h4 className={`font-semibold ${
                      isActive 
                        ? 'text-blue-900' 
                        : isCompleted 
                        ? 'text-green-900'
                        : 'text-gray-600'
                    }`}>
                      {stage.title}
                    </h4>
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
                    {isActive && !errorMessage && (
                      <div className="flex items-center space-x-2">
                        <div className="animate-pulse h-2 w-2 bg-blue-600 rounded-full"></div>
                        <span className="text-sm text-blue-600 font-medium">In progress...</span>
                      </div>
                    )}
                    {isCompleted && (
                      <span className="text-sm text-green-600 font-medium">✅ Complete</span>
                    )}
                    {isUpcoming && (
                      <span className="text-sm text-gray-400">⏳ Waiting</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Enhanced Analysis Notice */}
          {personalTagline && !errorMessage && (
            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">
                🚀 Enhanced Analysis Active
              </h4>
              <p className="text-sm text-green-700">
                Using your personal tagline to provide more targeted insights and recommendations.
              </p>
            </div>
          )}

          {/* Completion Status */}
          {isComplete && analysisResults && !errorMessage && (
            <div className="mt-6 p-6 bg-green-50 rounded-xl border border-green-200">
              <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                🎉 Analysis Complete!
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-bold text-green-800">{analysisResults.extractionStats?.detectedSkills || 0}</div>
                  <div className="text-green-600">Skills Identified</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-green-800">✅</div>
                  <div className="text-green-600">Analysis Complete</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-green-800">✅</div>
                  <div className="text-green-600">Ready for Review</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
