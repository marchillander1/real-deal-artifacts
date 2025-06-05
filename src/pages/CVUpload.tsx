
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle, User, Mail, Phone, MapPin, Calendar, Star, Award, Languages, Code, Briefcase, Brain, Lightbulb, Target, TrendingUp, Linkedin, Users, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export const CVUpload = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [cvTips, setCvTips] = useState<string[]>([]);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [isAnalyzingLinkedin, setIsAnalyzingLinkedin] = useState(false);
  const [linkedinAnalysis, setLinkedinAnalysis] = useState<any>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      processCV(file);
    }
  };

  const processCV = async (file: File) => {
    setIsProcessing(true);
    
    // Simulera AI CV-analys med utökad data
    setTimeout(() => {
      const mockData = {
        // Grundläggande info
        name: "Anna Andersson",
        email: "anna.andersson@email.com",
        phone: "+46 70 123 45 67",
        location: "Stockholm, Sverige",
        
        // Professionell info
        skills: ["React", "TypeScript", "Node.js", "AWS", "Python", "Docker", "GraphQL", "MongoDB", "Kubernetes", "Git"],
        experience: "7 years",
        roles: ["Senior Fullstack Developer", "Tech Lead", "Frontend Specialist"],
        rate: "950 SEK",
        availability: "Available in 2 weeks",
        projects: 15,
        rating: 4.7,
        lastActive: "Today",
        
        // Utbildning och certifieringar
        education: [
          "M.Sc. Computer Science, KTH Royal Institute of Technology (2015)",
          "B.Sc. Software Engineering, Stockholm University (2013)"
        ],
        certifications: ["AWS Certified Solutions Architect", "Scrum Master Certified", "React Advanced Certification", "Google Cloud Professional"],
        languages: ["Swedish (Native)", "English (Fluent)", "German (Conversational)", "Spanish (Basic)"],
        
        // Arbetslivserfarenhet
        workExperience: [
          {
            company: "TechCorp AB",
            position: "Senior Fullstack Developer",
            duration: "2021-Present",
            description: "Lead development of scalable web applications using React and Node.js"
          },
          {
            company: "StartupXYZ",
            position: "Frontend Developer",
            duration: "2018-2021",
            description: "Built responsive user interfaces and improved application performance"
          },
          {
            company: "Digital Agency",
            position: "Junior Developer",
            duration: "2015-2018",
            description: "Developed client websites and learned modern web technologies"
          }
        ],
        
        // Portfolio och achievements
        portfolio: [
          "E-commerce platform - React/Node.js - 50k+ users",
          "Mobile app - React Native - 4.8 star rating",
          "Open source library - 1k+ GitHub stars"
        ],
        achievements: [
          "Led team of 5 developers on major project",
          "Reduced application load time by 40%",
          "Implemented CI/CD pipeline saving 10 hours/week",
          "Mentored 3 junior developers"
        ],
        
        // Human factors
        communicationStyle: "Direct and collaborative - evident from leadership roles and team project descriptions",
        workStyle: "Agile and iterative - consistent mention of agile methodologies in work experience",
        values: ["Innovation", "Quality", "Teamwork", "Continuous Learning", "Sustainability"],
        personalityTraits: ["Analytical", "Creative", "Leadership-oriented", "Detail-focused", "Problem-solver"],
        teamFit: "Excellent team player with strong mentoring skills - evidenced by team lead positions",
        culturalFit: 4.5,
        adaptability: 4.3,
        leadership: 4.1,
        
        // Intressen och mål
        interests: ["Open Source", "AI/ML", "Sustainable Tech", "Teaching", "Innovation"],
        careerGoals: "Senior Technical Leadership role with focus on architecture and team development",
        
        // Social media
        linkedinUrl: "https://linkedin.com/in/anna-andersson-dev",
        githubUrl: "https://github.com/anna-andersson",
        portfolioUrl: "https://annadev.se",
        
        // Preference och krav
        preferredWorkType: "Hybrid (2-3 days office)",
        salaryExpectation: "900-1200 SEK/hour",
        noticePeriod: "2 weeks",
        travelWillingness: "Occasionally (max 20%)",
        
        // AI-genererad professionell sammanfattning
        professionalSummary: "Experienced full-stack developer with proven track record in leading cross-functional teams and delivering scalable solutions. Strong advocate for clean code and best practices with expertise in modern web technologies and cloud platforms. Passionate about mentoring and driving innovation through sustainable development practices."
      };

      // AI-genererade CV-tips baserat på CV-analys
      const generatedCvTips = [
        "💡 Lägg till fler kvantifierbara resultat - t.ex. 'Förbättrade appens prestanda med 40%'",
        "🎯 Inkludera specifika tekniska achievements från dina projekt",
        "📈 Beskriv din påverkan på teamet och företaget mer konkret",
        "⭐ Lägg till fler moderna teknologier som är relevanta för dina målpositioner",
        "🔍 Använd fler branschspecifika nyckelord för bättre ATS-kompatibilitet",
        "📊 Inkludera metrics från dina projekt (t.ex. användare påverkade, tid sparad)",
        "🚀 Beskriv hur du har drivit innovation och förbättringar",
        "👥 Framhäv dina mentoring- och kunskapsdelningsinsatser tydligare",
        "🌱 Lägg till information om hållbarhet och socialt ansvar",
        "🎓 Inkludera continuous learning aktiviteter och kurser"
      ];
      
      setExtractedData(mockData);
      setCvTips(generatedCvTips);
      setIsProcessing(false);
    }, 3000);
  };

  const handleLinkedInAnalysis = async () => {
    if (!linkedinUrl) {
      alert('Vänligen ange en LinkedIn URL först');
      return;
    }

    setIsAnalyzingLinkedin(true);
    
    try {
      const response = await fetch('https://xbliknlrikolcjjfhxqa.supabase.co/functions/v1/analyze-linkedin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ linkedinUrl }),
      });

      const data = await response.json();
      
      if (data.success) {
        setLinkedinAnalysis(data.analysis);
        
        // Uppdatera extractedData med LinkedIn-analys om CV redan är processat
        if (extractedData) {
          setExtractedData(prev => ({
            ...prev,
            linkedinAnalysis: data.analysis,
            // Merge LinkedIn data med CV data
            communicationStyle: data.analysis.communicationStyle || prev.communicationStyle,
            workStyle: data.analysis.workStyle || prev.workStyle,
            values: [...new Set([...(prev.values || []), ...(data.analysis.values || [])])],
            personalityTraits: [...new Set([...(prev.personalityTraits || []), ...(data.analysis.personalityTraits || [])])],
            teamFit: data.analysis.teamFit || prev.teamFit,
            culturalFit: data.analysis.culturalFit || prev.culturalFit,
            adaptability: data.analysis.adaptability || prev.adaptability,
            leadership: data.analysis.leadership || prev.leadership
          }));
        }
      } else {
        alert('LinkedIn analys misslyckades');
      }
    } catch (error) {
      console.error('LinkedIn analysis failed:', error);
      alert('LinkedIn analys misslyckades');
    } finally {
      setIsAnalyzingLinkedin(false);
    }
  };

  const handleSaveConsultant = async () => {
    if (!extractedData) return;
    
    setIsUploading(true);
    
    try {
      const consultantData = {
        name: extractedData.name,
        email: extractedData.email,
        phone: extractedData.phone,
        skills: extractedData.skills,
        experience_years: parseInt(extractedData.experience) || 7,
        roles: extractedData.roles,
        location: extractedData.location,
        hourly_rate: parseInt(extractedData.rate) || 950,
        availability: extractedData.availability,
        projects_completed: extractedData.projects,
        rating: extractedData.rating,
        last_active: extractedData.lastActive,
        certifications: extractedData.certifications,
        languages: extractedData.languages,
        type: 'new' as const,
        communication_style: extractedData.communicationStyle,
        work_style: extractedData.workStyle,
        values: extractedData.values,
        personality_traits: extractedData.personalityTraits,
        team_fit: extractedData.teamFit,
        cultural_fit: extractedData.culturalFit,
        adaptability: extractedData.adaptability,
        leadership: extractedData.leadership,
        // Lägg till fler fält
        education: extractedData.education,
        work_experience: extractedData.workExperience,
        portfolio: extractedData.portfolio,
        achievements: extractedData.achievements,
        interests: extractedData.interests,
        career_goals: extractedData.careerGoals,
        linkedin_url: extractedData.linkedinUrl,
        github_url: extractedData.githubUrl,
        portfolio_url: extractedData.portfolioUrl,
        preferred_work_type: extractedData.preferredWorkType,
        salary_expectation: extractedData.salaryExpectation,
        notice_period: extractedData.noticePeriod,
        travel_willingness: extractedData.travelWillingness,
        professional_summary: extractedData.professionalSummary
      };

      const { data, error } = await supabase
        .from('consultants')
        .insert(consultantData)
        .select()
        .single();

      if (error) {
        console.error('Error saving consultant:', error);
        alert('Fel vid sparande av konsult');
        return;
      }

      console.log('Consultant saved successfully:', data);
      alert('Konsult sparad framgångsrikt!');
      
      // Reset form
      setUploadedFile(null);
      setExtractedData(null);
      setCvTips([]);
      setLinkedinUrl('');
      setLinkedinAnalysis(null);
    } catch (error) {
      console.error('Error:', error);
      alert('Ett fel uppstod');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">CV Upload & AI Analysis</h1>
        <p className="text-gray-600">
          ✅ AI-powered CV extraction och komplett LinkedIn-stil professionell analys
          <br />
          ✅ Automatisk kompetensdetektion och erfarenhetsanalys från CV-innehåll
          <br />
          ✅ Human factors assessment - personlighet och kulturell matchning
          <br />
          ✅ AI-genererade CV-förbättringstips för bättre anställbarhet
          <br />
          ✅ LinkedIn profil-analys för djupare insikter om personlighet och arbetsstil
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload CV/Resume
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="cv-upload"
              />
              <label htmlFor="cv-upload" className="cursor-pointer">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Klicka för att ladda upp CV/Resume
                </p>
                <p className="text-sm text-gray-500">
                  Stöder PDF, DOC, DOCX filer
                </p>
              </label>
            </div>

            {uploadedFile && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">{uploadedFile.name}</p>
                    <p className="text-sm text-blue-600">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </div>
            )}

            {isProcessing && (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600"></div>
                  <div>
                    <p className="text-yellow-800 font-medium">🤖 AI analyserar CV:et...</p>
                    <p className="text-yellow-700 text-sm">Extraherar data, analyserar kompetenser och genererar professionell profil</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* LinkedIn Analysis Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Linkedin className="h-5 w-5 text-blue-600" />
              LinkedIn Profil-analys
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="linkedin-url">LinkedIn Profil URL</Label>
              <Input
                id="linkedin-url"
                type="url"
                placeholder="https://linkedin.com/in/ditt-namn"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <Button 
              onClick={handleLinkedInAnalysis}
              disabled={isAnalyzingLinkedin || !linkedinUrl}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isAnalyzingLinkedin ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyserar LinkedIn profil...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Analysera LinkedIn profil
                </>
              )}
            </Button>

            {linkedinAnalysis && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-3">LinkedIn Analys Komplett</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-blue-800">Kommunikationsstil:</span>
                    <p className="text-blue-700">{linkedinAnalysis.communicationStyle}</p>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800">Arbetsstil:</span>
                    <p className="text-blue-700">{linkedinAnalysis.workStyle}</p>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800">Teampassning:</span>
                    <p className="text-blue-700">{linkedinAnalysis.teamFit}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-blue-200">
                    <div className="text-center">
                      <div className="font-bold text-blue-600">{linkedinAnalysis.culturalFit}/5</div>
                      <div className="text-xs text-blue-500">Kulturell Fit</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-blue-600">{linkedinAnalysis.adaptability}/5</div>
                      <div className="text-xs text-blue-500">Anpassningsförmåga</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-blue-600">{linkedinAnalysis.leadership}/5</div>
                      <div className="text-xs text-blue-500">Ledarskap</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* CV Tips Section */}
      {cvTips.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-orange-600" />
              AI CV-förbättringstips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {cvTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex-shrink-0 w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-xs font-bold text-orange-600">
                    {index + 1}
                  </div>
                  <p className="text-sm text-orange-800">{tip}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Extracted Data Section */}
      {extractedData && (
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Personal & Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Personlig Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{extractedData.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{extractedData.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{extractedData.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{extractedData.location}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Professionell Sammanfattning</h4>
                <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">
                  {extractedData.professionalSummary}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Utbildning</h4>
                <div className="space-y-2">
                  {extractedData.education?.map((edu: string, index: number) => (
                    <div key={index} className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                      {edu}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-green-600" />
                Professionella Detaljer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Erfarenhet:</span>
                  <span className="font-medium">{extractedData.experience}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Timpris:</span>
                  <span className="font-medium text-green-600">{extractedData.rate}/timme</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tillgänglighet:</span>
                  <Badge className="bg-green-100 text-green-800">{extractedData.availability}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Projekt:</span>
                  <span className="font-medium">{extractedData.projects} slutförda</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Betyg:</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{extractedData.rating}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Roller</h4>
                <div className="flex flex-wrap gap-2">
                  {extractedData.roles?.map((role: string, index: number) => (
                    <Badge key={index} className="bg-blue-100 text-blue-800 text-xs">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Arbetslivserfarenhet</h4>
                <div className="space-y-3">
                  {extractedData.workExperience?.slice(0, 2).map((exp: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <div className="font-medium text-sm">{exp.position}</div>
                      <div className="text-xs text-gray-600">{exp.company} • {exp.duration}</div>
                      <div className="text-xs text-gray-700 mt-1">{exp.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills & Competencies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-purple-600" />
                Kompetenser
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Tekniska Färdigheter</h4>
                <div className="flex flex-wrap gap-2">
                  {extractedData.skills?.map((skill: string, index: number) => (
                    <Badge key={index} className="bg-purple-100 text-purple-800 text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Certifieringar</h4>
                <div className="flex flex-wrap gap-2">
                  {extractedData.certifications?.map((cert: string, index: number) => (
                    <Badge key={index} className="bg-indigo-100 text-indigo-800 text-xs">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Språk</h4>
                <div className="flex flex-wrap gap-2">
                  {extractedData.languages?.map((lang: string, index: number) => (
                    <Badge key={index} className="bg-orange-100 text-orange-800 text-xs">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Achievements</h4>
                <div className="space-y-1">
                  {extractedData.achievements?.slice(0, 3).map((achievement: string, index: number) => (
                    <div key={index} className="text-xs text-gray-700 bg-green-50 p-2 rounded flex items-start gap-2">
                      <Star className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                      {achievement}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Human Factors Analysis */}
      {extractedData && (
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600" />
                Human Factors & Personlighet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600 font-medium text-sm">Kommunikationsstil:</span>
                  <p className="text-gray-700 text-sm">{extractedData.communicationStyle}</p>
                </div>
                <div>
                  <span className="text-gray-600 font-medium text-sm">Arbetsstil:</span>
                  <p className="text-gray-700 text-sm">{extractedData.workStyle}</p>
                </div>
                <div>
                  <span className="text-gray-600 font-medium text-sm">Team-matchning:</span>
                  <p className="text-gray-700 text-sm">{extractedData.teamFit}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Kärnvärden</h4>
                <div className="flex flex-wrap gap-2">
                  {extractedData.values?.map((value: string, index: number) => (
                    <Badge key={index} className="bg-green-100 text-green-800 text-xs">
                      {value}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Personlighetsdrag</h4>
                <div className="flex flex-wrap gap-2">
                  {extractedData.personalityTraits?.map((trait: string, index: number) => (
                    <Badge key={index} className="bg-orange-100 text-orange-800 text-xs">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Professionell Bedömning</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 text-center">
                    <div className="font-bold text-purple-600 text-lg">{extractedData.culturalFit}/5</div>
                    <div className="text-purple-500 text-xs">Kulturell Matchning</div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 text-center">
                    <div className="font-bold text-purple-600 text-lg">{extractedData.adaptability}/5</div>
                    <div className="text-purple-500 text-xs">Anpassningsförmåga</div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 text-center">
                    <div className="font-bold text-purple-600 text-lg">{extractedData.leadership}/5</div>
                    <div className="text-purple-500 text-xs">Ledarskap</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                Karriärsmål & Preferenser
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600 font-medium">Karriärsmål:</span>
                  <p className="text-gray-700">{extractedData.careerGoals}</p>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Föredragen arbetsform:</span>
                  <p className="text-gray-700">{extractedData.preferredWorkType}</p>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Löneförväntning:</span>
                  <span className="font-medium text-green-600">{extractedData.salaryExpectation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Uppsägningstid:</span>
                  <span className="font-medium">{extractedData.noticePeriod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Resvilja:</span>
                  <span className="font-medium">{extractedData.travelWillingness}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Intressen</h4>
                <div className="flex flex-wrap gap-2">
                  {extractedData.interests?.map((interest: string, index: number) => (
                    <Badge key={index} className="bg-blue-100 text-blue-800 text-xs">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Portfolio Highlights</h4>
                <div className="space-y-1">
                  {extractedData.portfolio?.map((item: string, index: number) => (
                    <div key={index} className="text-xs text-gray-700 bg-blue-50 p-2 rounded flex items-start gap-2">
                      <TrendingUp className="h-3 w-3 text-blue-600 mt-0.5 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Online Profiler</h4>
                <div className="space-y-2">
                  {extractedData.linkedinUrl && (
                    <a href={extractedData.linkedinUrl} target="_blank" rel="noopener noreferrer" 
                       className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm">
                      <Linkedin className="h-4 w-4" />
                      LinkedIn Profil
                    </a>
                  )}
                  {extractedData.githubUrl && (
                    <a href={extractedData.githubUrl} target="_blank" rel="noopener noreferrer" 
                       className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm">
                      <Code className="h-4 w-4" />
                      GitHub Portfolio
                    </a>
                  )}
                  {extractedData.portfolioUrl && (
                    <a href={extractedData.portfolioUrl} target="_blank" rel="noopener noreferrer" 
                       className="flex items-center gap-2 text-green-600 hover:text-green-800 text-sm">
                      <TrendingUp className="h-4 w-4" />
                      Portfolio Website
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Save Button */}
      {extractedData && (
        <div className="flex justify-center">
          <Button 
            onClick={handleSaveConsultant} 
            className="bg-green-600 hover:bg-green-700 px-8 py-3 text-lg"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Sparar konsult...
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5 mr-2" />
                Spara konsult i databas
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
