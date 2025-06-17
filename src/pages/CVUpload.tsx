
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
    
    // 🔥 AUTOFILL: Fill name, email, phone from CV analysis
    const cvData = analysis.cvAnalysis?.analysis;
    if (cvData) {
      console.log('📝 Auto-filling form from CV analysis:', cvData.personalInfo);
      
      // Auto-fill name from CV analysis (always override if CV has better data)
      if (cvData.personalInfo?.name && 
          cvData.personalInfo.name !== 'Analysis in progress' && 
          cvData.personalInfo.name !== 'Professional Consultant' &&
          cvData.personalInfo.name !== 'John Doe') {
        console.log('📝 Auto-filling name from CV:', cvData.personalInfo.name);
        setFullName(cvData.personalInfo.name);
      }
      
      // Auto-fill email from CV analysis (always override if CV has better data)
      if (cvData.personalInfo?.email && 
          cvData.personalInfo.email !== 'analysis@example.com' && 
          cvData.personalInfo.email !== 'consultant@example.com' &&
          cvData.personalInfo.email !== 'johndoe@email.com' &&
          cvData.personalInfo.email.includes('@')) {
        console.log('📧 Auto-filling email from CV:', cvData.personalInfo.email);
        setEmail(cvData.personalInfo.email);
      }
      
      // Auto-fill phone from CV analysis (always override if CV has better data)
      if (cvData.personalInfo?.phone && 
          cvData.personalInfo.phone !== '+46 70 123 4567' && 
          cvData.personalInfo.phone !== '+1 555 123 4567') {
        console.log('📞 Auto-filling phone from CV:', cvData.personalInfo.phone);
        setPhoneNumber(cvData.personalInfo.phone);
      }
    }
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
    console.log('🚀 Analysis starting in CVUpload');
    setIsAnalyzing(true);
    setAnalysisProgress(0);
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
        title: "Missing Information",
        description: "Please complete analysis and agree to terms.",
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
      // 🔥 UPDATE CONSULTANT: Update the temporary consultant with form data
      const autoFilledEmail = analysisResults.cvAnalysis?.analysis?.personalInfo?.email;
      const autoFilledName = analysisResults.cvAnalysis?.analysis?.personalInfo?.name;
      
      console.log('📝 Updating consultant with form data...');
      console.log('📧 🚨 FINAL EMAIL FROM FORM:', email);
      
      const { error: updateError } = await supabase
        .from('consultants')
        .update({
          name: fullName || autoFilledName,
          email: email, // 🔥 🚨 ALWAYS use the form email
          phone: phoneNumber
        })
        .eq('id', analysisResults.consultant.id);
        
      if (updateError) {
        console.error('❌ Failed to update consultant:', updateError);
        throw new Error(`Failed to update consultant: ${updateError.message}`);
      } else {
        console.log('✅ Consultant updated with form data successfully');
      }

      // 🔥 🚨 SEND EMAILS TO FORM EMAIL AFTER FORM SUBMISSION
      console.log('📧 🚀 Sending welcome emails to FORM EMAIL after submission...');
      const emailResult = await EmailNotificationHandler.sendWelcomeEmails({
        consultantId: analysisResults.consultant.id,
        finalEmail: email, // 🔥 🚨 Use form email
        finalName: fullName || autoFilledName || 'New Consultant',
        isMyConsultant: isMyConsultant,
        toast: toast // Pass the toast function
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
        title: "Submit Failed",
        description: error.message || "Failed to complete submission. Please try again.",
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
                  {isMyConsultant ? "Consultant Added Successfully! 🎉" : "Welcome to MatchWise AI Network! 🚀"}
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
                          <li>✅ The consultant is now part of your team</li>
                          <li>✅ They'll receive email confirmation and instructions</li>
                          <li>✅ Their profile is ready for assignment matching</li>
                          <li>✅ You can find them in your "My Consultants" section</li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <p className="text-lg text-gray-700">
                        Congratulations <strong>{fullName}</strong>! You're now part of our consultant network.
                      </p>
                      
                      <div className="bg-white rounded-lg p-6 border border-green-200">
                        <h3 className="font-semibold text-gray-900 mb-3">🎯 You're now live in our platform!</h3>
                        <ul className="text-left text-gray-700 space-y-2">
                          <li>✅ <strong>Visible to companies:</strong> Your profile is active and searchable</li>
                          <li>✅ <strong>AI-powered matching:</strong> You'll receive relevant opportunities automatically</li>
                          <li>✅ <strong>Welcome email sent:</strong> Check your inbox for complete details</li>
                          <li>✅ <strong>Quality assignments:</strong> Only receive pre-filtered, matching opportunities</li>
                        </ul>
                      </div>
                      
                      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                        <h3 className="font-semibold text-blue-900 mb-2">📧 Check your email!</h3>
                        <p className="text-blue-800">
                          We've sent a comprehensive welcome email to <strong>{email}</strong> with:
                        </p>
                        <ul className="text-left text-blue-700 mt-2 space-y-1">
                          <li>• Pro tips for getting assignments</li>
                          <li>• How our AI matching works</li>
                          <li>• Next steps and best practices</li>
                        </ul>
                      </div>
                      
                      <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                        <p className="text-orange-800">
                          <strong>💡 Pro tip:</strong> Keep your LinkedIn updated and respond quickly to opportunities for best results!
                        </p>
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
              {isMyConsultant ? "Add Consultant to Your Team" : "Join Our Consultant Network"}
            </h1>
            <p className="text-gray-600">
              {isMyConsultant 
                ? "Upload a CV to add a new consultant to your team with AI-powered analysis"
                : "Upload your CV and LinkedIn profile for AI-powered analysis and matching"
              }
            </p>
            
            {/* Enhanced description with autofill feature */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-blue-600 mb-2">🔧</div>
                <h3 className="font-semibold text-sm">CV Analysis</h3>
                <p className="text-xs text-gray-600">Auto-fill from CV</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-purple-600 mb-2">🔗</div>
                <h3 className="font-semibold text-sm">LinkedIn Analysis</h3>
                <p className="text-xs text-gray-600">Profile optimization</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-orange-600 mb-2">✏️</div>
                <h3 className="font-semibold text-sm">Editable Fields</h3>
                <p className="text-xs text-gray-600">Modify auto-filled data</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-green-600 mb-2">📈</div>
                <h3 className="font-semibold text-sm">Network Ready</h3>
                <p className="text-xs text-gray-600">Instant visibility</p>
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
                  
                  {/* 🔥 ANALYSIS LOGIC: Only requires CV and LinkedIn URL to start */}
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
                  {/* Analysis Results */}
                  <AnalysisResults 
                    analysisResults={analysisResults}
                    isAnalyzing={isAnalyzing}
                    analysisProgress={analysisProgress}
                  />
                  
                  {/* Form for final submission with auto-filled data */}
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Review & Complete Registration</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Information has been auto-filled from your CV analysis. You can modify any fields if needed.
                      <strong> The welcome email will be sent to the email address you enter below.</strong>
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
                            placeholder="Auto-filled from CV"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email * <span className="text-green-600">(Welcome email will be sent here)</span>
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Auto-filled from CV"
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
                          placeholder="Auto-filled from CV"
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
                        {isUploading ? "Finalizing..." : "Complete Registration & Join Network"}
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
