
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User, MapPin, Phone, Mail, Briefcase, Star, Award, Brain, TrendingUp, DollarSign, Building, Calendar, Globe, FileText, Linkedin } from 'lucide-react';
import { Consultant } from '@/types/consultant';

interface ConsultantFullAnalysisModalProps {
  consultant: Consultant;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ConsultantFullAnalysisModal: React.FC<ConsultantFullAnalysisModalProps> = ({
  consultant,
  open,
  onOpenChange
}) => {
  const cvAnalysis = consultant.cvAnalysis?.analysis;
  const linkedinAnalysis = consultant.linkedinAnalysis?.analysis;

  if (!cvAnalysis && !linkedinAnalysis) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Complete AI Analysis - {consultant.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* CV Analysis Section */}
          {cvAnalysis && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-green-600" />
                <h2 className="text-xl font-bold text-gray-900">CV Analysis</h2>
              </div>

              {/* Personal Information */}
              {cvAnalysis.personalInfo && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Name:</span>
                        <p className="font-medium">{cvAnalysis.personalInfo.name}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Email:</span>
                        <p className="font-medium">{cvAnalysis.personalInfo.email}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Phone:</span>
                        <p className="font-medium">{cvAnalysis.personalInfo.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Location:</span>
                        <p className="font-medium">{cvAnalysis.personalInfo.location}</p>
                      </div>
                      {cvAnalysis.personalInfo.linkedinProfile && (
                        <div className="col-span-2">
                          <span className="text-sm font-medium text-gray-600">LinkedIn:</span>
                          <p className="font-medium text-blue-600">{cvAnalysis.personalInfo.linkedinProfile}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Professional Summary */}
              {cvAnalysis.professionalSummary && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Professional Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Current Role:</span>
                        <p className="font-medium">{cvAnalysis.professionalSummary.currentRole}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Seniority Level:</span>
                        <p className="font-medium">{cvAnalysis.professionalSummary.seniorityLevel}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Years of Experience:</span>
                        <p className="font-medium">{cvAnalysis.professionalSummary.yearsOfExperience}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Career Trajectory:</span>
                        <p className="font-medium">{cvAnalysis.professionalSummary.careerTrajectory}</p>
                      </div>
                    </div>
                    {cvAnalysis.professionalSummary.summary && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Summary:</span>
                        <p className="text-gray-700 mt-1">{cvAnalysis.professionalSummary.summary}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Work Experience */}
              {cvAnalysis.workExperience && cvAnalysis.workExperience.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Work Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {cvAnalysis.workExperience.map((experience, index) => (
                      <div key={index} className="border-l-2 border-blue-200 pl-4 pb-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">{experience.role}</h4>
                            <p className="text-gray-600">{experience.company}</p>
                          </div>
                          <Badge variant="outline">{experience.duration}</Badge>
                        </div>
                        
                        {experience.achievements && experience.achievements.length > 0 && (
                          <div className="mb-3">
                            <span className="text-sm font-medium text-gray-600">Key Achievements:</span>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                              {experience.achievements.map((achievement, achIndex) => (
                                <li key={achIndex} className="text-sm text-gray-700">{achievement}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {experience.technologies && experience.technologies.length > 0 && (
                          <div>
                            <span className="text-sm font-medium text-gray-600">Technologies:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {experience.technologies.map((tech, techIndex) => (
                                <Badge key={techIndex} variant="secondary" className="text-xs">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Technical Expertise */}
              {cvAnalysis.technicalExpertise && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Technical Expertise
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {cvAnalysis.technicalExpertise.programmingLanguages && (
                      <div>
                        <span className="text-sm font-medium text-gray-600 mb-2 block">Programming Languages:</span>
                        <div className="space-y-2">
                          {cvAnalysis.technicalExpertise.programmingLanguages.expert?.length > 0 && (
                            <div>
                              <span className="text-xs font-medium text-green-700">Expert:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {cvAnalysis.technicalExpertise.programmingLanguages.expert.map((skill, index) => (
                                  <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {cvAnalysis.technicalExpertise.programmingLanguages.proficient?.length > 0 && (
                            <div>
                              <span className="text-xs font-medium text-blue-700">Proficient:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {cvAnalysis.technicalExpertise.programmingLanguages.proficient.map((skill, index) => (
                                  <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {cvAnalysis.technicalExpertise.programmingLanguages.familiar?.length > 0 && (
                            <div>
                              <span className="text-xs font-medium text-gray-700">Familiar:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {cvAnalysis.technicalExpertise.programmingLanguages.familiar.map((skill, index) => (
                                  <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-800">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {cvAnalysis.technicalExpertise.frameworks?.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-gray-600 mb-2 block">Frameworks & Libraries:</span>
                        <div className="flex flex-wrap gap-1">
                          {cvAnalysis.technicalExpertise.frameworks.map((framework, index) => (
                            <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                              {framework}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {cvAnalysis.technicalExpertise.tools?.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-gray-600 mb-2 block">Tools & Platforms:</span>
                        <div className="flex flex-wrap gap-1">
                          {cvAnalysis.technicalExpertise.tools.map((tool, index) => (
                            <Badge key={index} variant="outline" className="bg-gray-50 text-gray-700">
                              {tool}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {cvAnalysis.technicalExpertise.databases?.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-gray-600 mb-2 block">Databases:</span>
                        <div className="flex flex-wrap gap-1">
                          {cvAnalysis.technicalExpertise.databases.map((db, index) => (
                            <Badge key={index} variant="outline" className="bg-orange-50 text-orange-700">
                              {db}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {cvAnalysis.technicalExpertise.cloudPlatforms?.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-gray-600 mb-2 block">Cloud Platforms:</span>
                        <div className="flex flex-wrap gap-1">
                          {cvAnalysis.technicalExpertise.cloudPlatforms.map((platform, index) => (
                            <Badge key={index} variant="outline" className="bg-cyan-50 text-cyan-700">
                              {platform}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {cvAnalysis.technicalExpertise.methodologies?.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-gray-600 mb-2 block">Methodologies:</span>
                        <div className="flex flex-wrap gap-1">
                          {cvAnalysis.technicalExpertise.methodologies.map((method, index) => (
                            <Badge key={index} variant="outline" className="bg-purple-50 text-purple-700">
                              {method}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Market Positioning */}
              {cvAnalysis.marketPositioning && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Market Positioning
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {cvAnalysis.marketPositioning.hourlyRateEstimate && (
                      <div>
                        <span className="text-sm font-medium text-gray-600 mb-2 block">Hourly Rate Estimate:</span>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-600">Minimum</p>
                            <p className="text-lg font-bold">{cvAnalysis.marketPositioning.hourlyRateEstimate.min} SEK</p>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded-lg border-2 border-green-200">
                            <p className="text-xs text-green-600">Recommended</p>
                            <p className="text-lg font-bold text-green-700">{cvAnalysis.marketPositioning.hourlyRateEstimate.recommended} SEK</p>
                          </div>
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <p className="text-xs text-blue-600">Maximum</p>
                            <p className="text-lg font-bold text-blue-700">{cvAnalysis.marketPositioning.hourlyRateEstimate.max} SEK</p>
                          </div>
                        </div>
                        {cvAnalysis.marketPositioning.hourlyRateEstimate.explanation && (
                          <p className="text-sm text-gray-600 mt-2">{cvAnalysis.marketPositioning.hourlyRateEstimate.explanation}</p>
                        )}
                      </div>
                    )}

                    {cvAnalysis.marketPositioning.competitiveAdvantages?.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-gray-600 mb-2 block">Competitive Advantages:</span>
                        <div className="flex flex-wrap gap-2">
                          {cvAnalysis.marketPositioning.competitiveAdvantages.map((advantage, index) => (
                            <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-800">
                              {advantage}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {cvAnalysis.marketPositioning.targetIndustries?.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-gray-600 mb-2 block">Target Industries:</span>
                        <div className="flex flex-wrap gap-1">
                          {cvAnalysis.marketPositioning.targetIndustries.map((industry, index) => (
                            <Badge key={index} variant="outline">
                              {industry}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {cvAnalysis.marketPositioning.targetRoles?.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-gray-600 mb-2 block">Target Roles:</span>
                        <div className="flex flex-wrap gap-1">
                          {cvAnalysis.marketPositioning.targetRoles.map((role, index) => (
                            <Badge key={index} variant="outline" className="bg-indigo-50 text-indigo-700">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {cvAnalysis.marketPositioning.marketDemand && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Market Demand:</span>
                        <p className="font-medium">{cvAnalysis.marketPositioning.marketDemand}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Soft Skills */}
              {cvAnalysis.softSkills && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Soft Skills & Leadership Traits
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(cvAnalysis.softSkills).map(([category, skills]) => (
                      skills && Array.isArray(skills) && skills.length > 0 && (
                        <div key={category}>
                          <span className="text-sm font-medium text-gray-600 mb-1 block capitalize">
                            {category.replace(/([A-Z])/g, ' $1').trim()}:
                          </span>
                          <div className="space-y-1">
                            {skills.map((skill, index) => (
                              <p key={index} className="text-sm text-gray-700 pl-3 border-l-2 border-indigo-200">
                                {skill}
                              </p>
                            ))}
                          </div>
                        </div>
                      )
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Education */}
              {cvAnalysis.education && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Education & Certifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {cvAnalysis.education.degrees?.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-gray-600 mb-2 block">Education:</span>
                        <div className="space-y-2">
                          {cvAnalysis.education.degrees.map((degree, index) => (
                            <div key={index} className="p-3 bg-blue-50 rounded-lg">
                              <p className="font-medium text-blue-900">{degree}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {cvAnalysis.education.certifications?.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-gray-600 mb-2 block">Certifications:</span>
                        <div className="flex flex-wrap gap-2">
                          {cvAnalysis.education.certifications.map((cert, index) => (
                            <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-800">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {cvAnalysis.education.training?.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-gray-600 mb-2 block">Training & Courses:</span>
                        <div className="flex flex-wrap gap-2">
                          {cvAnalysis.education.training.map((training, index) => (
                            <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                              {training}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Languages */}
              {cvAnalysis.languages?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Languages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {cvAnalysis.languages.map((language, index) => (
                        <Badge key={index} variant="outline" className="bg-emerald-50 text-emerald-700">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* LinkedIn Analysis Section */}
          {linkedinAnalysis && (
            <>
              <Separator className="my-6" />
              <div className="flex items-center gap-2 mb-4">
                <Linkedin className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">LinkedIn Analysis</h2>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-blue-600" />
                    LinkedIn Profile Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800 mb-2">LinkedIn analysis data:</p>
                    <pre className="text-xs text-blue-700 bg-white p-3 rounded border overflow-auto max-h-40">
                      {JSON.stringify(linkedinAnalysis, null, 2)}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
