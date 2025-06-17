
import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Copy, CheckCircle2, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { supabase } from '@/integrations/supabase/client';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface CVAnalysisLogicProps {
  cvFile: File | null;
  onAnalysisComplete: (analysis: { cvAnalysis: any; linkedinAnalysis: any; consultant: any }) => void;
  onError?: (message: string) => void;
  linkedinUrl?: string;
}

// Export the performCVAnalysis function for compatibility
export const performCVAnalysis = async (
  file: File | null,
  setIsAnalyzing: (loading: boolean) => void,
  setAnalysisProgress: (progress: number) => void,
  setAnalysisResults: (results: any) => void,
  setFullName: (name: string) => void,
  setEmail: (email: string) => void,
  setPhoneNumber: (phone: string) => void,
  setLinkedinUrl: (url: string) => void,
  linkedinUrl?: string
) => {
  if (!file) return;
  
  setIsAnalyzing(true);
  setAnalysisProgress(0);
  
  try {
    // Extract text from PDF
    const fileReader = new FileReader();
    
    const extractedText = await new Promise<string>((resolve, reject) => {
      fileReader.onload = async () => {
        try {
          const typedArray = new Uint8Array(fileReader.result as ArrayBuffer);
          const pdfDocument = await pdfjs.getDocument(typedArray).promise;
          
          let fullText = '';
          for (let i = 1; i <= pdfDocument.numPages; i++) {
            const page = await pdfDocument.getPage(i);
            const textContent = await page.getTextContent();
            // Fix TypeScript error by properly filtering TextItem objects
            const pageText = textContent.items
              .filter((item): item is any => 'str' in item)
              .map(item => item.str)
              .join(' ');
            fullText += pageText + '\n';
          }
          
          resolve(fullText);
        } catch (error) {
          reject(error);
        }
      };
      
      fileReader.onerror = reject;
      fileReader.readAsArrayBuffer(file);
    });
    
    setAnalysisProgress(30);
    
    // Analyze CV
    const response = await fetch('/api/analyzeCV', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cvText: extractedText }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to analyze CV');
    }
    
    const cvAnalysis = await response.json();
    setAnalysisProgress(60);
    
    // Analyze LinkedIn if URL provided
    let linkedinAnalysis = null;
    if (linkedinUrl) {
      const { data } = await supabase.functions.invoke('analyze-linkedin', {
        body: { 
          linkedinUrl,
          includeRecentPosts: true,
          includeBioSummary: true,
          postLimit: 30
        },
      });
      linkedinAnalysis = data?.analysis;
    }
    
    setAnalysisProgress(100);
    
    // Set form data from analysis
    if (cvAnalysis.personalInfo?.name) {
      setFullName(cvAnalysis.personalInfo.name);
    }
    if (cvAnalysis.personalInfo?.email) {
      setEmail(cvAnalysis.personalInfo.email);
    }
    if (cvAnalysis.personalInfo?.phone) {
      setPhoneNumber(cvAnalysis.personalInfo.phone);
    }
    
    setAnalysisResults({
      cvAnalysis,
      linkedinAnalysis,
      consultant: null
    });
    
  } catch (error) {
    console.error('Analysis error:', error);
  } finally {
    setIsAnalyzing(false);
  }
};

export const CVAnalysisLogic: React.FC<CVAnalysisLogicProps> = ({
  cvFile,
  onAnalysisComplete,
  onError,
  linkedinUrl
}) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [cvText, setCvText] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [analysisStatus, setAnalysisStatus] = useState<'idle' | 'loading' | 'completed' | 'error'>('idle');
  const [linkedinAnalysis, setLinkedinAnalysis] = useState<any>(null);
  const [linkedinAnalysisStatus, setLinkedinAnalysisStatus] = useState<'idle' | 'analyzing' | 'completed' | 'error'>('idle');
  const { toast } = useToast()

  useEffect(() => {
    const extractTextFromCV = async () => {
      if (!cvFile) return;

      setCvText('');
      setAnalysisStatus('loading');

      try {
        const fileReader = new FileReader();

        fileReader.onload = async () => {
          const typedArray = new Uint8Array(fileReader.result as ArrayBuffer);

          try {
            const pdfDocument = await pdfjs.getDocument(typedArray).promise;
            setNumPages(pdfDocument.numPages);

            let fullText = '';
            for (let i = 1; i <= pdfDocument.numPages; i++) {
              const page = await pdfDocument.getPage(i);
              const textContent = await page.getTextContent();
              // Fix TypeScript error by properly filtering TextItem objects
              const pageText = textContent.items
                .filter((item): item is any => 'str' in item)
                .map(item => item.str)
                .join(' ');
              fullText += pageText + '\n';
            }

            setCvText(fullText);
            console.log('CV Text extracted successfully');
          } catch (pdfError) {
            console.error('Error extracting text from PDF:', pdfError);
            setCvText('Error extracting text from PDF. Please ensure it is a valid PDF.');
            setAnalysisStatus('error');
          }
        };

        fileReader.onerror = (error) => {
          console.error('Error reading file:', error);
          setCvText('Error reading the file. Please try again.');
          setAnalysisStatus('error');
        };

        fileReader.readAsArrayBuffer(cvFile);
      } catch (error) {
        console.error('Error during file reading:', error);
        setCvText('An unexpected error occurred. Please try again.');
        setAnalysisStatus('error');
      }
    };

    extractTextFromCV();
  }, [cvFile]);

  const createConsultantInDatabase = async (analysisData: any, linkedinAnalysisData?: any) => {
    try {
      console.log('Creating consultant with analysis data:', { analysisData, linkedinAnalysisData });

      const consultantData = {
        name: analysisData.personalInfo?.name || 'Analysis in progress',
        email: analysisData.personalInfo?.email || '',
        phone: analysisData.personalInfo?.phone || '',
        location: analysisData.personalInfo?.location || '',
        skills: [
          ...(analysisData.technicalSkillsAnalysis?.programmingLanguages?.expert || []),
          ...(analysisData.technicalSkillsAnalysis?.programmingLanguages?.proficient || []),
          ...(analysisData.technicalSkillsAnalysis?.frontendTechnologies?.frameworks || []),
          ...(analysisData.technicalSkillsAnalysis?.backendTechnologies?.frameworks || []),
          ...(analysisData.technicalSkillsAnalysis?.cloudAndInfrastructure?.platforms || [])
        ].slice(0, 10), // Limit to top 10 skills
        experience_years: analysisData.professionalSummary?.yearsOfExperience ? 
          parseInt(analysisData.professionalSummary.yearsOfExperience.replace(/\D/g, '')) || 0 : 0,
        hourly_rate: analysisData.marketPositioning?.hourlyRateEstimate?.recommended || 800,
        availability: 'Available',
        communication_style: linkedinAnalysisData?.communicationStyle || analysisData.personalityTraits?.communicationStyle || 'Professional and collaborative',
        work_style: linkedinAnalysisData?.teamFitAssessment?.workStyle || analysisData.personalityTraits?.workStyle || 'Collaborative',
        cv_file_path: '',
        rating: 4.8,
        projects_completed: 0,
        last_active: 'Today',
        roles: [analysisData.professionalSummary?.currentRole || 'Developer'],
        certifications: analysisData.education?.certifications || [],
        user_id: null, // This makes it a network consultant
        languages: analysisData.personalInfo?.languages || ['Swedish', 'English'],
        values: analysisData.personalityTraits?.culturalValues || ['Innovation', 'Quality', 'Teamwork'],
        personality_traits: linkedinAnalysisData?.personalityTraits || ['Collaborative', 'Detail-oriented', 'Proactive'],
        cultural_fit: linkedinAnalysisData?.culturalFit || 4,
        adaptability: linkedinAnalysisData?.adaptability || 4,
        leadership: linkedinAnalysisData?.leadership || 3,
        linkedin_url: linkedinUrl || analysisData.personalInfo?.linkedinProfile || '',
        team_fit: linkedinAnalysisData?.teamFitAssessment?.workStyle || 'Collaborative team player',
        type: 'new',
        // Store the full analysis data as JSON in JSONB columns (we'll need to add these)
        cv_analysis: analysisData,
        linkedin_analysis: linkedinAnalysisData
      };

      const { data: consultant, error } = await supabase
        .from('consultants')
        .insert([consultantData])
        .select()
        .single();

      if (error) {
        console.error('Error creating consultant:', error);
        throw error;
      }

      console.log('✅ Consultant created successfully:', consultant);

      // Send welcome email after successful consultant creation
      try {
        console.log('📧 Sending welcome email to:', consultant.email);
        
        // Check if this is "My Consultant" based on URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const isMyConsultant = urlParams.get('source') === 'my-consultants';
        
        const { data: emailResult, error: emailError } = await supabase.functions.invoke('send-welcome-email', {
          body: {
            consultantName: consultant.name,
            consultantEmail: consultant.email,
            isMyConsultant
          },
        });

        if (emailError) {
          console.error('❌ Error sending welcome email:', emailError);
        } else {
          console.log('✅ Welcome email sent successfully:', emailResult);
        }

        // Also send registration notification to admin
        const { data: notificationResult, error: notificationError } = await supabase.functions.invoke('send-registration-notification', {
          body: {
            consultantName: consultant.name,
            consultantEmail: consultant.email,
            isMyConsultant
          },
        });

        if (notificationError) {
          console.error('❌ Error sending registration notification:', notificationError);
        } else {
          console.log('✅ Registration notification sent successfully:', notificationResult);
        }

      } catch (emailError) {
        console.error('❌ Failed to send emails:', emailError);
        // Don't throw here, consultant creation was successful
      }

      return consultant;
    } catch (error) {
      console.error('Error in createConsultantInDatabase:', error);
      throw error;
    }
  };

  useEffect(() => {
    const analyzeCV = async () => {
      if (!cvText || analysisStatus !== 'loading') return;

      try {
        console.log('Starting CV analysis with text:', cvText.substring(0, 200) + '...');

        const response = await fetch('/api/analyzeCV', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cvText }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('CV analysis API error:', errorData);
          throw new Error(errorData.message || 'Failed to analyze CV');
        }

        const result = await response.json();
        console.log('CV analysis result:', result);

        setAnalysis(result);
        setAnalysisStatus('completed');

        // Start LinkedIn analysis if we have a LinkedIn URL
        if (linkedinUrl && linkedinAnalysisStatus === 'idle') {
          performLinkedInAnalysis(result);
        } else {
          // If no LinkedIn URL, create consultant with just CV analysis
          try {
            const consultant = await createConsultantInDatabase(result);
            onAnalysisComplete({
              cvAnalysis: result,
              linkedinAnalysis: null,
              consultant
            });
          } catch (dbError) {
            console.error('❌ Failed to create consultant:', dbError);
            onError?.('Failed to save consultant to database');
          }
        }
      } catch (apiError: any) {
        console.error('Error during CV analysis:', apiError);
        setAnalysisStatus('error');
        toast({
          title: "Något gick fel med CV analysen.",
          description: "Var god försök igen.",
          variant: "destructive",
        })
        onError?.(apiError.message || 'Failed to analyze CV');
      }
    };

    analyzeCV();
  }, [cvText, analysisStatus, toast, onError]);

  const performLinkedInAnalysis = async (cvAnalysisData: any) => {
    if (!linkedinUrl || linkedinAnalysisStatus !== 'idle') return;

    try {
      setLinkedinAnalysisStatus('analyzing');
      console.log('🔗 Starting LinkedIn analysis for:', linkedinUrl);

      const { data, error } = await supabase.functions.invoke('analyze-linkedin', {
        body: { 
          linkedinUrl,
          includeRecentPosts: true,
          includeBioSummary: true,
          postLimit: 30
        },
      });

      if (error) {
        console.error('❌ LinkedIn analysis error:', error);
        throw error;
      }

      console.log('✅ LinkedIn analysis completed:', data);
      
      setLinkedinAnalysis(data.analysis);
      setLinkedinAnalysisStatus('completed');

      // Create consultant with both CV and LinkedIn analysis
      const consultant = await createConsultantInDatabase(cvAnalysisData, data.analysis);
      
      // Call onAnalysisComplete with the created consultant
      onAnalysisComplete({
        cvAnalysis: cvAnalysisData,
        linkedinAnalysis: data.analysis,
        consultant
      });

    } catch (error) {
      console.error('❌ LinkedIn analysis failed:', error);
      setLinkedinAnalysisStatus('error');
      
      // Still create consultant with just CV analysis
      try {
        const consultant = await createConsultantInDatabase(cvAnalysisData);
        onAnalysisComplete({
          cvAnalysis: cvAnalysisData,
          linkedinAnalysis: null,
          consultant
        });
      } catch (dbError) {
        console.error('❌ Failed to create consultant:', dbError);
        onError?.('Failed to save consultant to database');
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* CV Preview Section */}
      <div className="md:w-1/2">
        <Card>
          <CardHeader>
            <CardTitle>CV Preview</CardTitle>
            <CardDescription>Här är en förhandsvisning av det uppladdade CV:t.</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            {cvFile ? (
              <div className="border rounded-md p-2">
                <Document
                  file={cvFile}
                  onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                  className="w-full"
                >
                  <Page pageNumber={pageNumber} width={500} />
                </Document>
                <div className="flex justify-center mt-2">
                  <Button
                    variant="outline"
                    disabled={pageNumber <= 1}
                    onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                  >
                    Föregående
                  </Button>
                  <span className="mx-2 text-gray-600">{pageNumber} / {numPages || '?'}</span>
                  <Button
                    variant="outline"
                    disabled={pageNumber >= (numPages || 0)}
                    onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages || 1))}
                  >
                    Nästa
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">Inget CV är uppladdat ännu.</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Analysis Section */}
      <div className="md:w-1/2">
        <Card>
          <CardHeader>
            <CardTitle>CV Analys</CardTitle>
            <CardDescription>AI-driven analys av ditt CV.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysisStatus === 'loading' && (
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Analys pågår...</span>
              </div>
            )}

            {analysisStatus === 'error' && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Något gick fel under analysen. Var god försök igen.
                </AlertDescription>
              </Alert>
            )}

            {analysis && analysisStatus === 'completed' && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <p className="text-sm text-gray-500">CV analys slutförd!</p>
                </div>
                <details className="border rounded-md p-2">
                  <summary className="font-semibold text-gray-700 cursor-pointer">
                    <span className="flex items-center space-x-1">
                      <Copy className="h-4 w-4" />
                      <span>Visa rådata</span>
                    </span>
                  </summary>
                  <Textarea
                    readOnly
                    className="mt-2 text-xs font-mono"
                    value={JSON.stringify(analysis, null, 2)}
                    onClick={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.select();
                      navigator.clipboard.writeText(JSON.stringify(analysis, null, 2));
                      toast({
                        title: "Kopierad till urklipp.",
                        description: "Rådata har kopierats till urklipp.",
                      })
                    }}
                  />
                </details>
              </div>
            )}

            {/* LinkedIn Analysis Section */}
            <div className="mt-6">
              <CardTitle>LinkedIn Analys</CardTitle>
              <CardDescription>Få en djupare insikt genom att analysera din LinkedIn-profil.</CardDescription>
              
              {linkedinAnalysisStatus === 'analyzing' && (
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>LinkedIn analys pågår...</span>
                </div>
              )}

              {linkedinAnalysisStatus === 'error' && (
                <Alert variant="destructive">
                  <AlertTitle>LinkedIn Analys Fel</AlertTitle>
                  <AlertDescription>
                    Något gick fel under LinkedIn analysen. Var god försök igen.
                  </AlertDescription>
                </Alert>
              )}

              {linkedinAnalysis && linkedinAnalysisStatus === 'completed' && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <p className="text-sm text-gray-500">LinkedIn analys slutförd!</p>
                  </div>
                  <details className="border rounded-md p-2">
                    <summary className="font-semibold text-gray-700 cursor-pointer">
                      <span className="flex items-center space-x-1">
                        <Copy className="h-4 w-4" />
                        <span>Visa LinkedIn rådata</span>
                      </span>
                    </summary>
                    <Textarea
                      readOnly
                      className="mt-2 text-xs font-mono"
                      value={JSON.stringify(linkedinAnalysis, null, 2)}
                      onClick={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.select();
                        navigator.clipboard.writeText(JSON.stringify(linkedinAnalysis, null, 2));
                        toast({
                          title: "LinkedIn data kopierad till urklipp.",
                          description: "LinkedIn rådata har kopierats till urklipp.",
                        })
                      }}
                    />
                  </details>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
