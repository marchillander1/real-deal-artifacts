
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  FileText, 
  Linkedin, 
  TrendingUp, 
  Users, 
  Target,
  Star,
  Award,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Consultant } from '@/types/consultant';

interface ConsultantAnalysisModalProps {
  consultant: Consultant;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ConsultantAnalysisModal: React.FC<ConsultantAnalysisModalProps> = ({
  consultant,
  open,
  onOpenChange,
}) => {
  console.log('🔍 ConsultantAnalysisModal - Full consultant data:', consultant);
  
  // 🔥 FIX: Correct way to access CV analysis data
  const cvAnalysisData = consultant.cvAnalysis;
  const cvAnalysis = cvAnalysisData?.analysis || cvAnalysisData; // Handle both structures
  
  console.log('🔍 CV Analysis raw data:', cvAnalysisData);
  console.log('🔍 CV Analysis parsed:', cvAnalysis);
  
  // 🔥 FIX: Correct way to access LinkedIn analysis data  
  const linkedinAnalysisData = consultant.linkedinAnalysis;
  const linkedinAnalysis = linkedinAnalysisData?.analysis || linkedinAnalysisData; // Handle both structures
  
  console.log('🔍 LinkedIn Analysis raw data:', linkedinAnalysisData);
  console.log('🔍 LinkedIn Analysis parsed:', linkedinAnalysis);
  
  const hasAnalysisData = cvAnalysis || linkedinAnalysis;
  console.log('🔍 Has analysis data:', hasAnalysisData);

  if (!hasAnalysisData) {
    console.log('❌ No analysis data available, showing placeholder');
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              AI Analysis - {consultant.name}
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Available</h3>
            <p className="text-gray-600">
              This consultant hasn't been analyzed yet. Upload their CV or LinkedIn profile to get AI insights.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  console.log('✅ Rendering full analysis modal with data');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Analysis - {consultant.name}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="market">Market Position</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Analysis Sources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Analysis Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  {cvAnalysisData && (
                    <div className="flex items-center gap-2 text-green-600">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm font-medium">CV Analyzed</span>
                      <Badge variant="outline" className="text-xs">
                        Recently analyzed
                      </Badge>
                    </div>
                  )}
                  {linkedinAnalysisData && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <Linkedin className="h-4 w-4" />
                      <span className="text-sm font-medium">LinkedIn Analyzed</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Personal Information from CV */}
            {cvAnalysis?.personalInfo && (
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information (from CV)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {cvAnalysis.personalInfo.name && cvAnalysis.personalInfo.name !== 'Ej specificerat' && (
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-medium">{cvAnalysis.personalInfo.name}</p>
                      </div>
                    )}
                    {cvAnalysis.personalInfo.location && cvAnalysis.personalInfo.location !== 'Ej specificerat' && (
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-medium">{cvAnalysis.personalInfo.location}</p>
                      </div>
                    )}
                    {cvAnalysis.personalInfo.email && cvAnalysis.personalInfo.email !== 'Ej specificerat' && (
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{cvAnalysis.personalInfo.email}</p>
                      </div>
                    )}
                    {cvAnalysis.personalInfo.phone && cvAnalysis.personalInfo.phone !== 'Ej specificerat' && (
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium">{cvAnalysis.personalInfo.phone}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Work Experience from CV */}
            {cvAnalysis?.experience && (
              <Card>
                <CardHeader>
                  <CardTitle>Experience Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {cvAnalysis.experience.years && cvAnalysis.experience.years !== 'Ej specificerat' && (
                      <div>
                        <p className="text-sm text-gray-600">Years of Experience</p>
                        <p className="font-medium">{cvAnalysis.experience.years}</p>
                      </div>
                    )}
                    {cvAnalysis.experience.currentRole && cvAnalysis.experience.currentRole !== 'Ej specificerat' && (
                      <div>
                        <p className="text-sm text-gray-600">Current Role</p>
                        <p className="font-medium">{cvAnalysis.experience.currentRole}</p>
                      </div>
                    )}
                    {cvAnalysis.experience.level && cvAnalysis.experience.level !== 'Ej specificerat' && (
                      <div>
                        <p className="text-sm text-gray-600">Experience Level</p>
                        <p className="font-medium">{cvAnalysis.experience.level}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Work History from CV */}
            {cvAnalysis?.workHistory && cvAnalysis.workHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Work History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {cvAnalysis.workHistory.slice(0, 3).map((work: any, index: number) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">{work.role || 'Role not specified'}</h4>
                          <span className="text-sm text-gray-500">{work.duration || 'Duration not specified'}</span>
                        </div>
                        <p className="text-sm text-gray-600">{work.company || 'Company not specified'}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* LinkedIn Professional Profile */}
            {linkedinAnalysis && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Linkedin className="h-5 w-5 text-blue-600" />
                    LinkedIn Profile Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {linkedinAnalysis.communicationStyle && (
                    <div>
                      <p className="text-sm text-gray-600">Communication Style</p>
                      <p className="font-medium">{linkedinAnalysis.communicationStyle}</p>
                    </div>
                  )}
                  {linkedinAnalysis.leadershipStyle && (
                    <div>
                      <p className="text-sm text-gray-600">Leadership Style</p>
                      <p className="font-medium">{linkedinAnalysis.leadershipStyle}</p>
                    </div>
                  )}
                  
                  {/* Professional Scores */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                    {linkedinAnalysis.innovation && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{linkedinAnalysis.innovation}/5</div>
                        <div className="text-sm text-gray-600">Innovation</div>
                      </div>
                    )}
                    {linkedinAnalysis.leadership && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{linkedinAnalysis.leadership}/5</div>
                        <div className="text-sm text-gray-600">Leadership</div>
                      </div>
                    )}
                    {linkedinAnalysis.adaptability && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{linkedinAnalysis.adaptability}/5</div>
                        <div className="text-sm text-gray-600">Adaptability</div>
                      </div>
                    )}
                    {linkedinAnalysis.culturalFit && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{linkedinAnalysis.culturalFit}/5</div>
                        <div className="text-sm text-gray-600">Cultural Fit</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="technical" className="space-y-6">
            {/* Technical Skills from CV */}
            {cvAnalysis?.skills && (
              <Card>
                <CardHeader>
                  <CardTitle>Technical Skills (from CV)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cvAnalysis.skills.technical && cvAnalysis.skills.technical.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Technical Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {cvAnalysis.skills.technical.map((skill: string, index: number) => (
                          skill !== 'Ej specificerat' && (
                            <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                              {skill}
                            </Badge>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {cvAnalysis.skills.languages && cvAnalysis.skills.languages.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Programming Languages</p>
                      <div className="flex flex-wrap gap-2">
                        {cvAnalysis.skills.languages.map((lang: string, index: number) => (
                          lang !== 'Ej specificerat' && (
                            <Badge key={index} variant="outline" className="border-blue-200 text-blue-800">
                              {lang}
                            </Badge>
                          )
                        ))}
                      </div>
                    </div>
                  )}

                  {cvAnalysis.skills.tools && cvAnalysis.skills.tools.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Tools & Technologies</p>
                      <div className="flex flex-wrap gap-2">
                        {cvAnalysis.skills.tools.map((tool: string, index: number) => (
                          tool !== 'Ej specificerat' && (
                            <Badge key={index} variant="outline" className="border-purple-200 text-purple-800">
                              {tool}
                            </Badge>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* LinkedIn Technical Insights */}
            {linkedinAnalysis?.contentAnalysisInsights?.primaryExpertiseAreas && (
              <Card>
                <CardHeader>
                  <CardTitle>Primary Expertise Areas (from LinkedIn)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {linkedinAnalysis.contentAnalysisInsights.primaryExpertiseAreas.map((area: string, index: number) => (
                      <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="market" className="space-y-6">
            {/* LinkedIn Market Positioning */}
            {linkedinAnalysis?.marketPositioning && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Market Positioning (from LinkedIn)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {linkedinAnalysis.marketPositioning.uniqueValueProposition && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Unique Value Proposition</p>
                      <p className="text-sm text-gray-600">{linkedinAnalysis.marketPositioning.uniqueValueProposition}</p>
                    </div>
                  )}
                  
                  {linkedinAnalysis.marketPositioning.competitiveAdvantages && linkedinAnalysis.marketPositioning.competitiveAdvantages.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Competitive Advantages</p>
                      <div className="flex flex-wrap gap-2">
                        {linkedinAnalysis.marketPositioning.competitiveAdvantages.map((advantage: string, index: number) => (
                          <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-800">
                            {advantage}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {linkedinAnalysis.marketPositioning.nicheSpecialization && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Niche Specialization</p>
                      <p className="text-sm text-gray-600">{linkedinAnalysis.marketPositioning.nicheSpecialization}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Growth Potential */}
            {linkedinAnalysis?.growthPotential && (
              <Card>
                <CardHeader>
                  <CardTitle>Growth Potential</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {linkedinAnalysis.growthPotential.learningMindset && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{linkedinAnalysis.growthPotential.learningMindset}/5</div>
                        <div className="text-sm text-gray-600">Learning Mindset</div>
                      </div>
                    )}
                    {linkedinAnalysis.growthPotential.industryAwareness && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{linkedinAnalysis.growthPotential.industryAwareness}/5</div>
                        <div className="text-sm text-gray-600">Industry Awareness</div>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {linkedinAnalysis.growthPotential.technicalGrowth && (
                      <div>
                        <span className="font-medium text-gray-700">Technical Growth:</span>
                        <span className="ml-1">{linkedinAnalysis.growthPotential.technicalGrowth}</span>
                      </div>
                    )}
                    {linkedinAnalysis.growthPotential.leadershipGrowth && (
                      <div>
                        <span className="font-medium text-gray-700">Leadership Growth:</span>
                        <span className="ml-1">{linkedinAnalysis.growthPotential.leadershipGrowth}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            {/* LinkedIn Improvement Recommendations */}
            {linkedinAnalysis?.recommendedImprovements && linkedinAnalysis.recommendedImprovements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-orange-600" />
                    LinkedIn Profile Improvements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {linkedinAnalysis.recommendedImprovements.map((tip: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Consultant Readiness Score */}
            {linkedinAnalysis?.overallConsultantReadiness && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-600" />
                    Consultant Readiness Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Overall Readiness</span>
                      <span>{linkedinAnalysis.overallConsultantReadiness}/10</span>
                    </div>
                    <Progress value={linkedinAnalysis.overallConsultantReadiness * 10} className="h-3" />
                    <p className="text-sm text-gray-600 mt-2">
                      This score indicates how ready this person is to work as a consultant based on their LinkedIn presence.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Content Analysis from LinkedIn */}
            {linkedinAnalysis?.recentPostsAnalysis && (
              <Card>
                <CardHeader>
                  <CardTitle>Content & Engagement Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    {linkedinAnalysis.recentPostsAnalysis.contentQuality && (
                      <div>
                        <span className="font-medium text-gray-700">Content Quality:</span>
                        <span className="ml-1">{linkedinAnalysis.recentPostsAnalysis.contentQuality}</span>
                      </div>
                    )}
                    {linkedinAnalysis.recentPostsAnalysis.engagementLevel && (
                      <div>
                        <span className="font-medium text-gray-700">Engagement:</span>
                        <span className="ml-1">{linkedinAnalysis.recentPostsAnalysis.engagementLevel}</span>
                      </div>
                    )}
                    {linkedinAnalysis.recentPostsAnalysis.thoughtLeadership && (
                      <div>
                        <span className="font-medium text-gray-700">Thought Leadership:</span>
                        <span className="ml-1">{linkedinAnalysis.recentPostsAnalysis.thoughtLeadership}</span>
                      </div>
                    )}
                    {linkedinAnalysis.recentPostsAnalysis.technicalExpertise && (
                      <div>
                        <span className="font-medium text-gray-700">Technical Expertise:</span>
                        <span className="ml-1">{linkedinAnalysis.recentPostsAnalysis.technicalExpertise}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
