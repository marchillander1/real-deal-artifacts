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

  const handleAnalysisComplete = (analysis: { cvAnalysis: any; linkedinAnalysis: any; consultant: any; enhancedAnalysisResults?: any; extractedPersonalInfo?: any }) => {
    console.log('✅ Analysis complete received:', analysis);
    setAnalysisResults(analysis);
    setIsAnalyzing(false);
    setAnalysisProgress(100);
    
    // Enhanced auto-fill with better data mapping
    const cvData = analysis.cvAnalysis?.analysis;
    const enhancedData = analysis.enhancedAnalysisResults;
    const detectedInfo = enhancedData?.detectedInformation;
    const consultant = analysis.consultant;
    const extractedPersonalInfo = analysis.extractedPersonalInfo;
    
    console.log('📝 Auto-fill mapping from sources:', {
      cvPersonalInfo: cvData?.personalInfo,
      detectedInfo,
      consultantData: consultant,
      extractedPersonalInfo
    });
    
    // Smart auto-fill with priority logic
    
    // NAME MAPPING
    let finalName = '';
    if (extractedPersonalInfo?.name && 
        extractedPersonalInfo.name !== 'Not specified' && 
        extractedPersonalInfo.name !== 'Professional Consultant' &&
        extractedPersonalInfo.name.length > 2) {
      finalName = extractedPersonalInfo.name;
    } else if (cvData?.personalInfo?.name && 
               cvData.personalInfo.name !== 'Not specified' && 
               cvData.personalInfo.name !== 'Professional Consultant' &&
               cvData.personalInfo.name.length > 2) {
      finalName = cvData.personalInfo.name;
    } else if (consultant?.name && 
               consultant.name !== 'Professional Consultant' &&
               consultant.name !== 'Not specified' &&
               consultant.name.length > 2) {
      finalName = consultant.name;
    } else if (detectedInfo?.names && detectedInfo.names.length > 0) {
      finalName = detectedInfo.names.find(name => 
        name && name.length > 2 && 
        !name.includes('If Gt') && 
        !name.includes('Analysis')
      ) || '';
    }
    
    if (finalName && finalName !== fullName) {
      console.log('📝 Auto-filling name:', finalName);
      setFullName(finalName);
    }
    
    // EMAIL MAPPING
    let finalEmail = '';
    if (extractedPersonalInfo?.email && 
        extractedPersonalInfo.email !== 'Not specified' &&
        extractedPersonalInfo.email.includes('@') &&
        extractedPersonalInfo.email.includes('.') &&
        !extractedPersonalInfo.email.includes('temp.com')) {
      finalEmail = extractedPersonalInfo.email;
    } else if (cvData?.personalInfo?.email && 
               cvData.personalInfo.email !== 'Not specified' &&
               cvData.personalInfo.email.includes('@') &&
               cvData.personalInfo.email.includes('.') &&
               !cvData.personalInfo.email.includes('temp.com')) {
      finalEmail = cvData.personalInfo.email;
    } else if (consultant?.email && 
               consultant.email !== 'temp@temp.com' && 
               consultant.email.includes('@') &&
               consultant.email.includes('.')) {
      finalEmail = consultant.email;
    } else if (detectedInfo?.emails && detectedInfo.emails.length > 0) {
      finalEmail = detectedInfo.emails.find(email => 
        email && email.includes('@') && email.includes('.') && 
        !email.includes('temp.com') && !email.includes('example.com')
      ) || '';
    }
    
    if (finalEmail && finalEmail !== email) {
      console.log('📧 Auto-filling email:', finalEmail);
      setEmail(finalEmail);
    }
    
    // PHONE MAPPING
    let finalPhone = '';
    if (extractedPersonalInfo?.phone && 
        extractedPersonalInfo.phone !== 'Not specified' &&
        extractedPersonalInfo.phone.length > 5 &&
        !extractedPersonalInfo.phone.includes('0000000000')) {
      finalPhone = extractedPersonalInfo.phone;
    } else if (cvData?.personalInfo?.phone && 
               cvData.personalInfo.phone !== 'Not specified' &&
               cvData.personalInfo.phone.length > 5 &&
               !cvData.personalInfo.phone.includes('0000000000')) {
      finalPhone = cvData.personalInfo.phone;
    } else if (consultant?.phone && 
               consultant.phone.length > 5 &&
               !consultant.phone.includes('0000000000')) {
      finalPhone = consultant.phone;
    } else if (detectedInfo?.phones && detectedInfo.phones.length > 0) {
      finalPhone = detectedInfo.phones.find(phone => 
        phone && phone.length > 5 && 
        !phone.includes('0000000000') && 
        !phone.includes('123')
      ) || '';
    }
    
    if (finalPhone && finalPhone !== phoneNumber) {
      console.log('📞 Auto-filling phone:', finalPhone);
      setPhoneNumber(finalPhone);
    }
    
    toast({
      title: "Analysis completed! 🎉",
      description: `Information extracted and auto-filled: ${finalName}`,
    });
  };

  const handleAnalysisError = (message: string) => {
    console.error('❌ Analysis error in CVUpload:', message);
    setIsAnalyzing(false);
    setAnalysisProgress(0);
    toast({
      title: "Analysis Error",
      description: message,
      variant: "destructive",
    });
  };

  const handleAnalysisStart = () => {
    console.log('🚀 Comprehensive analysis starting in CVUpload');
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    toast({
      title: "Comprehensive Analysis Started",
      description: "Analyzing CV and LinkedIn profile with full detail extraction...",
    });
  };

  const handleAnalysisProgress = (progress: number) => {
    console.log('📊 Analysis progress:', progress);
    setAnalysisProgress(progress);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    console.log('🎯 Submit initiated with comprehensive form data:', { email, fullName, phoneNumber });
    
    // Validation: Check if we have analysis results and basic info
    if (!file || !analysisResults || !agreeToTerms) {
      toast({
        title: "Information Missing",
        description: "Complete the analysis and agree to terms.",
        variant: "destructive",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Update consultant with form data
      const autoFilledEmail = analysisResults.cvAnalysis?.analysis?.personalInfo?.email;
      const autoFilledName = analysisResults.cvAnalysis?.analysis?.personalInfo?.name;
      
      console.log('📝 Updating consultant with comprehensive form data...');
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
        console.log('✅ Consultant updated with comprehensive form data successfully');
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
      console.log('✅ Showing comprehensive success message');
      setShowSuccessMessage(true);
    } catch (error: any) {
      console.error('Submit error:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "Could not complete registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

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
                  {isMyConsultant ? "Consultant Added! 🎉" : "Welcome to MatchWise AI! 🚀"}
                </h1>
                
                <div className="max-w-2xl mx-auto">
                  {isMyConsultant ? (
                    <div className="space-y-4">
                      <p className="text-lg text-gray-700">
                        <strong>{fullName}</strong> has been successfully added to your consultant team!
                      </p>
                      <div className="bg-white rounded-lg p-6 border border-green-200">
                        <h3 className="font-semibold text-gray-900 mb-2">What happens next:</h3>
                        <ul className="text-left text-gray-700 space-y-2">
                          <li>✅ Consultant is now part of your team</li>
                          <li>✅ They will receive email confirmation and instructions</li>
                          <li>✅ Their profile is ready for assignment matching</li>
                          <li>✅ You can find them in your "My Consultants" section</li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <p className="text-lg text-gray-700">
                        Congratulations <strong>{fullName}</strong>! You are now part of our consultant network.
                      </p>
                      
                      <div className="bg-white rounded-lg p-6 border border-green-200">
                        <h3 className="font-semibold text-gray-900 mb-3">🎯 You are now live on our platform!</h3>
                        <ul className="text-left text-gray-700 space-y-2">
                          <li>✅ <strong>Visible to companies:</strong> Your profile is active and searchable</li>
                          <li>✅ <strong>AI-driven matching:</strong> You will receive relevant opportunities automatically</li>
                          <li>✅ <strong>Welcome email sent:</strong> Check your inbox for all details</li>
                          <li>✅ <strong>Quality assignments:</strong> Get only pre-filtered, matching opportunities</li>
                        </ul>
                      </div>
                      
                      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                        <h3 className="font-semibold text-blue-900 mb-2">📧 Check your email!</h3>
                        <p className="text-blue-800">
                          We have sent a comprehensive welcome email to <strong>{email}</strong> with:
                        </p>
                        <ul className="text-left text-blue-700 mt-2 space-y-1">
                          <li>• Pro tips for getting assignments</li>
                          <li>• How our AI matching works</li>
                          <li>• Next steps and best practices</li>
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
                    {isMyConsultant ? "Go to Dashboard" : "Back to Home"}
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
                    Add Another Consultant
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  console.log('🎨 Rendering CVUpload with analysis support:', { 
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
              {isMyConsultant ? "Add consultant to your team" : "Join our consultant network"}
            </h1>
            <p className="text-gray-600">
              {isMyConsultant 
                ? "Upload a CV to add a new consultant to your team with AI-driven analysis"
                : "Upload your CV and LinkedIn profile for AI-driven analysis and matching"
              }
            </p>
            
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-blue-600 mb-2">📋</div>
                <h3 className="font-semibold text-sm">Full CV Analysis</h3>
                <p className="text-xs text-gray-600">Personal info + skills</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-purple-600 mb-2">💼</div>
                <h3 className="font-semibold text-sm">LinkedIn Insights</h3>
                <p className="text-xs text-gray-600">Professional tips</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-green-600 mb-2">🎯</div>
                <h3 className="font-semibold text-sm">Auto-Fill Data</h3>
                <p className="text-xs text-gray-600">Smart extraction</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-orange-600 mb-2">⚡</div>
                <h3 className="font-semibold text-sm">Instant Profile</h3>
                <p className="text-xs text-gray-600">Ready for matching</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                  
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Review & complete registration</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Information has been auto-filled from your CV and LinkedIn analysis. Edit if needed.
                      <strong> Welcome email will be sent to the email address below.</strong>
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Auto-filled from CV analysis"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email * <span className="text-green-600">(Welcome email sent here)</span>
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Auto-filled from CV analysis"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Auto-filled from CV analysis"
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
                        <p className="text-xs text-gray-500 mt-1">LinkedIn URL used for analysis</p>
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
                              I agree to join the MatchWise consultant network
                            </span>
                          </label>
                          <p className="mt-1">
                            I consent to MatchWise using my analyzed CV and LinkedIn profile for consultant matching.
                          </p>
                        </div>
                      </div>
                      
                      <button
                        type="submit"
                        disabled={isUploading || !agreeToTerms}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isUploading ? "Completing registration..." : "Complete registration & join network"}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>

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
