
import React, { useState, useEffect } from 'react';
import { CVUploadForm } from '@/components/CVUploadForm';
import { CVAnalysisLogic } from '@/components/CVAnalysisLogic';
import { AnalysisResults } from '@/components/AnalysisResults';
import { MatchWiseChat } from '@/components/MatchWiseChat';
import { EmailNotificationHandler } from '@/components/EmailNotificationHandler';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Sparkles } from 'lucide-react';

const CVUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isMyConsultant, setIsMyConsultant] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const { toast } = useToast();

  // Check if we're uploading for "My Consultants"
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const source = urlParams.get('source');
    setIsMyConsultant(source === 'my-consultants');
  }, []);

  // Reset analysis when file or URL changes
  useEffect(() => {
    console.log('🔄 File or LinkedIn URL changed, resetting analysis');
    setAnalysisResults(null);
    setIsAnalyzing(false);
    setAnalysisProgress(0);
  }, [file, linkedinUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    console.log('📁 File selected:', selectedFile?.name);
    if (selectedFile) {
      setFile(selectedFile);
      // Reset form fields when new file is uploaded so they can be auto-filled
      setFullName('');
      setEmail('');
      setPhoneNumber('');
    }
  };

  const handleLinkedinUrlChange = (value: string) => {
    console.log('🔗 LinkedIn URL changed:', value);
    setLinkedinUrl(value);
  };

  const handleAnalysisComplete = (analysis: { cvAnalysis: any; linkedinAnalysis: any; consultant: any }) => {
    console.log('✅ Analysis complete received in CVUpload:', analysis);
    setAnalysisResults(analysis);
    setIsAnalyzing(false);
    setAnalysisProgress(100);
    
    // 🔥 FÖRBÄTTRAD AUTOFILL: Korrekt mappning från CV-analysen
    const cvData = analysis.cvAnalysis?.analysis;
    if (cvData) {
      console.log('📝 Auto-filling form from CV analysis:', cvData.personalInfo);
      
      // Auto-fill name från personalInfo
      if (cvData.personalInfo?.name && 
          cvData.personalInfo.name !== 'Not specified' && 
          cvData.personalInfo.name !== 'Analysis in progress' && 
          cvData.personalInfo.name !== 'Professional Consultant' &&
          cvData.personalInfo.name !== 'John Doe' &&
          cvData.personalInfo.name.length > 2) {
        console.log('📝 Auto-filling name from CV:', cvData.personalInfo.name);
        setFullName(cvData.personalInfo.name);
      }
      
      // Auto-fill email från personalInfo
      if (cvData.personalInfo?.email && 
          cvData.personalInfo.email !== 'Not specified' &&
          cvData.personalInfo.email !== 'analysis@example.com' && 
          cvData.personalInfo.email !== 'consultant@example.com' &&
          cvData.personalInfo.email !== 'johndoe@email.com' &&
          cvData.personalInfo.email.includes('@') &&
          cvData.personalInfo.email.includes('.')) {
        console.log('📧 Auto-filling email from CV:', cvData.personalInfo.email);
        setEmail(cvData.personalInfo.email);
      }
      
      // Auto-fill phone från personalInfo
      if (cvData.personalInfo?.phone && 
          cvData.personalInfo.phone !== 'Not specified' &&
          cvData.personalInfo.phone !== '+46 70 123 4567' && 
          cvData.personalInfo.phone !== '+1 555 123 4567' &&
          cvData.personalInfo.phone.length > 5) {
        console.log('📞 Auto-filling phone from CV:', cvData.personalInfo.phone);
        setPhoneNumber(cvData.personalInfo.phone);
      }
    }
    
    // Visa toast med extraheringsresultat
    toast({
      title: "CV-analys klar!",
      description: `Personlig information extraherad: ${cvData?.personalInfo?.name || 'Namn ej hittat'}, ${cvData?.personalInfo?.email || 'Email ej hittad'}`,
    });
  };

  const handleAnalysisError = (message: string) => {
    console.error('❌ Analysis error in CVUpload:', message);
    setIsAnalyzing(false);
    setAnalysisProgress(0);
    toast({
      title: "Analysfel",
      description: message,
      variant: "destructive",
    });
  };

  const handleAnalysisStart = () => {
    console.log('🚀 Analysis starting in CVUpload');
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    toast({
      title: "Analys påbörjad",
      description: "Analyserar CV och LinkedIn-profil...",
    });
  };

  const handleAnalysisProgress = (progress: number) => {
    console.log('📊 Analysis progress:', progress);
    setAnalysisProgress(progress);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    console.log('🎯 Submit initiated with form email:', email, 'fullName:', fullName);
    
    // Validation: Check if we have analysis results and basic info
    if (!file || !analysisResults || !agreeToTerms) {
      toast({
        title: "Information saknas",
        description: "Slutför analysen och godkänn villkoren.",
        variant: "destructive",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      toast({
        title: "Ogiltig email",
        description: "Ange en giltig e-postadress.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Update consultant with form data
      const autoFilledEmail = analysisResults.cvAnalysis?.analysis?.personalInfo?.email;
      const autoFilledName = analysisResults.cvAnalysis?.analysis?.personalInfo?.name;
      
      console.log('📝 Updating consultant with form data...');
      console.log('📧 FINAL EMAIL FROM FORM:', email);
      
      const { error: updateError } = await supabase
        .from('consultants')
        .update({
          name: fullName || autoFilledName,
          email: email,
          phone: phoneNumber
        })
        .eq('id', analysisResults.consultant.id);
        
      if (updateError) {
        console.error('❌ Failed to update consultant:', updateError);
        throw new Error(`Failed to update consultant: ${updateError.message}`);
      } else {
        console.log('✅ Consultant updated with form data successfully');
      }

      // Send welcome emails
      console.log('📧 Sending welcome emails to FORM EMAIL after submission...');
      const emailResult = await EmailNotificationHandler.sendWelcomeEmails({
        consultantId: analysisResults.consultant.id,
        finalEmail: email,
        finalName: fullName || autoFilledName || 'New Consultant',
        isMyConsultant: isMyConsultant,
        toast: toast
      });

      if (!emailResult.success) {
        console.warn('⚠️ Email sending had issues but continuing with success flow');
      }

      // Show success message
      console.log('✅ Showing success message');
      setShowSuccessMessage(true);
    } catch (error: any) {
      console.error('Submit error:', error);
      toast({
        title: "Submission misslyckades",
        description: error.message || "Kunde inte slutföra registreringen. Försök igen.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Success message component
  if (showSuccessMessage) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-xl border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="p-12 text-center">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <CheckCircle className="h-20 w-20 text-green-600" />
                    <Sparkles className="h-8 w-8 text-yellow-500 absolute -top-2 -right-2 animate-pulse" />
                  </div>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {isMyConsultant ? "Konsult tillagd! 🎉" : "Välkommen till MatchWise AI! 🚀"}
                </h1>
                
                <div className="max-w-2xl mx-auto">
                  {isMyConsultant ? (
                    <div className="space-y-4">
                      <p className="text-lg text-gray-700">
                        <strong>{fullName}</strong> har framgångsrikt lagts till i ditt konsultteam!
                      </p>
                      <div className="bg-white rounded-lg p-6 border border-green-200">
                        <h3 className="font-semibold text-gray-900 mb-2">Vad händer härnäst:</h3>
                        <ul className="text-left text-gray-700 space-y-2">
                          <li>✅ Konsulten är nu del av ditt team</li>
                          <li>✅ De kommer att få e-postbekräftelse och instruktioner</li>
                          <li>✅ Deras profil är redo för uppdragsmatchning</li>
                          <li>✅ Du hittar dem i din "Mina konsulter"-sektion</li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <p className="text-lg text-gray-700">
                        Grattis <strong>{fullName}</strong>! Du är nu del av vårt konsultnätverk.
                      </p>
                      
                      <div className="bg-white rounded-lg p-6 border border-green-200">
                        <h3 className="font-semibold text-gray-900 mb-3">🎯 Du är nu live på vår plattform!</h3>
                        <ul className="text-left text-gray-700 space-y-2">
                          <li>✅ <strong>Synlig för företag:</strong> Din profil är aktiv och sökbar</li>
                          <li>✅ <strong>AI-driven matchning:</strong> Du kommer att få relevanta möjligheter automatiskt</li>
                          <li>✅ <strong>Välkomstmail skickat:</strong> Kolla din inkorg för alla detaljer</li>
                          <li>✅ <strong>Kvalitetsuppdrag:</strong> Få endast förfiltrerade, matchande möjligheter</li>
                        </ul>
                      </div>
                      
                      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                        <h3 className="font-semibold text-blue-900 mb-2">📧 Kolla din e-post!</h3>
                        <p className="text-blue-800">
                          Vi har skickat ett omfattande välkomstmail till <strong>{email}</strong> med:
                        </p>
                        <ul className="text-left text-blue-700 mt-2 space-y-1">
                          <li>• Pro-tips för att få uppdrag</li>
                          <li>• Hur vår AI-matchning fungerar</li>
                          <li>• Nästa steg och bästa praxis</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => window.location.href = isMyConsultant ? '/matchwiseai' : '/'}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                  >
                    {isMyConsultant ? "Till Dashboard" : "Tillbaka hem"}
                  </button>
                  <button
                    onClick={() => {
                      setShowSuccessMessage(false);
                      // Reset form
                      setFile(null);
                      setEmail('');
                      setFullName('');
                      setPhoneNumber('');
                      setLinkedinUrl('');
                      setAgreeToTerms(false);
                      setAnalysisResults(null);
                    }}
                    className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-8 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Lägg till ytterligare konsult
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  console.log('🎨 Rendering CVUpload with:', { 
    hasFile: !!file, 
    hasLinkedIn: !!linkedinUrl, 
    isAnalyzing, 
    hasResults: !!analysisResults,
    formFields: { fullName, email, phoneNumber }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isMyConsultant ? "Lägg till konsult till ditt team" : "Gå med i vårt konsultnätverk"}
            </h1>
            <p className="text-gray-600">
              {isMyConsultant 
                ? "Ladda upp ett CV för att lägga till en ny konsult till ditt team med AI-driven analys"
                : "Ladda upp ditt CV och LinkedIn-profil för AI-driven analys och matchning"
              }
            </p>
            
            {/* Enhanced description with autofill feature */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-blue-600 mb-2">🔧</div>
                <h3 className="font-semibold text-sm">CV-analys</h3>
                <p className="text-xs text-gray-600">Autofyll från CV</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-purple-600 mb-2">🔗</div>
                <h3 className="font-semibold text-sm">LinkedIn-analys</h3>
                <p className="text-xs text-gray-600">Profiloptimering</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-orange-600 mb-2">✏️</div>
                <h3 className="font-semibold text-sm">Redigerbara fält</h3>
                <p className="text-xs text-gray-600">Ändra autofylld data</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-green-600 mb-2">📈</div>
                <h3 className="font-semibold text-sm">Nätverk redo</h3>
                <p className="text-xs text-gray-600">Omedelbar synlighet</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              {!analysisResults ? (
                <div className="space-y-6">
                  <CVUploadForm
                    file={file}
                    email={email}
                    fullName={fullName}
                    phoneNumber={phoneNumber}
                    linkedinUrl={linkedinUrl}
                    agreeToTerms={agreeToTerms}
                    isUploading={isUploading}
                    analysisResults={analysisResults}
                    isAnalyzing={isAnalyzing}
                    onFileChange={handleFileChange}
                    onEmailChange={setEmail}
                    onFullNameChange={setFullName}
                    onPhoneNumberChange={setPhoneNumber}
                    onLinkedinUrlChange={handleLinkedinUrlChange}
                    onAgreeToTermsChange={setAgreeToTerms}
                    onSubmit={handleSubmit}
                  />
                  
                  <CVAnalysisLogic
                    file={file}
                    linkedinUrl={linkedinUrl}
                    formEmail={email}
                    formName={fullName}
                    onAnalysisComplete={handleAnalysisComplete}
                    onError={handleAnalysisError}
                    onAnalysisStart={handleAnalysisStart}
                    onAnalysisProgress={handleAnalysisProgress}
                  />
                </div>
              ) : (
                <div className="space-y-6">
                  <AnalysisResults 
                    analysisResults={analysisResults}
                    isAnalyzing={isAnalyzing}
                    analysisProgress={analysisProgress}
                  />
                  
                  {/* Form for final submission with auto-filled data */}
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Granska & slutför registrering</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Information har autofyllts från din CV-analys. Du kan ändra fälten om det behövs.
                      <strong> Välkomstmailen skickas till e-postadressen du anger nedan.</strong>
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fullständigt namn *
                          </label>
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Autofyllt från CV"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            E-post * <span className="text-green-600">(Välkomstmail skickas hit)</span>
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Autofyllt från CV"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Telefonnummer
                        </label>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Autofyllt från CV"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          LinkedIn URL *
                        </label>
                        <input
                          type="url"
                          value={linkedinUrl}
                          onChange={(e) => setLinkedinUrl(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                          disabled
                        />
                        <p className="text-xs text-gray-500 mt-1">LinkedIn URL som användes för analys</p>
                      </div>
                      
                      <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                        <input
                          type="checkbox"
                          id="terms"
                          checked={agreeToTerms}
                          onChange={(e) => setAgreeToTerms(e.target.checked)}
                          className="mt-1"
                          required
                        />
                        <div className="text-sm text-gray-600">
                          <label htmlFor="terms" className="cursor-pointer">
                            <span className="font-medium">
                              Jag godkänner att gå med i MatchWise konsultnätverk
                            </span>
                          </label>
                          <p className="mt-1">
                            Jag samtycker till att MatchWise använder mitt analyserade CV och LinkedIn-profil för konsultmatchning.
                          </p>
                        </div>
                      </div>
                      
                      <button
                        type="submit"
                        disabled={isUploading || !agreeToTerms}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isUploading ? "Slutför..." : "Slutför registrering & gå med i nätverket"}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>

            {/* AI Chat sidebar */}
            <div className="lg:col-span-1">
              {!isChatMinimized && (
                <div className="sticky top-8">
                  <MatchWiseChat 
                    analysisResults={analysisResults}
                    isMinimized={false}
                    onToggleMinimize={() => setIsChatMinimized(true)}
                  />
                </div>
              )}
              
              {isChatMinimized && (
                <MatchWiseChat 
                  analysisResults={analysisResults}
                  isMinimized={true}
                  onToggleMinimize={() => setIsChatMinimized(false)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVUpload;
