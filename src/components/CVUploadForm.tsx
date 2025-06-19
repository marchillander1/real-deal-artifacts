
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, FileText, CheckCircle2, Loader2, AlertCircle, Clock, Brain } from 'lucide-react';
import { toast } from 'sonner';

interface CVUploadFormProps {
  file: File | null;
  email: string;
  fullName: string;
  phoneNumber: string;
  linkedinUrl: string;
  agreeToTerms: boolean;
  isUploading: boolean;
  analysisResults: any;
  isAnalyzing: boolean;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEmailChange: (value: string) => void;
  onFullNameChange: (value: string) => void;
  onPhoneNumberChange: (value: string) => void;
  onLinkedinUrlChange: (value: string) => void;
  onAgreeToTermsChange: (checked: boolean) => void;
  onSubmit: (event: React.FormEvent) => void;
}

export const CVUploadForm: React.FC<CVUploadFormProps> = ({
  file,
  email,
  fullName,
  phoneNumber,
  linkedinUrl,
  agreeToTerms,
  isUploading,
  analysisResults,
  isAnalyzing,
  onFileChange,
  onEmailChange,
  onFullNameChange,
  onPhoneNumberChange,
  onLinkedinUrlChange,
  onAgreeToTermsChange,
  onSubmit
}) => {
  const [isMyConsultant, setIsMyConsultant] = useState(false);

  // Check if we're uploading for "My Consultants" based on URL parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const source = urlParams.get('source');
    setIsMyConsultant(source === 'my-consultants');
  }, []);

  const hasValidLinkedInUrl = linkedinUrl && linkedinUrl.includes('linkedin.com');
  const canStartAnalysis = file && hasValidLinkedInUrl;

  const getAnalysisStatus = () => {
    if (isAnalyzing) {
      return { 
        icon: Brain, 
        text: "🤖 AI analyserar CV och LinkedIn tillsammans...", 
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200"
      };
    }
    if (analysisResults) {
      return { 
        icon: CheckCircle2, 
        text: "✅ Analys klar! Information autofylld från CV.", 
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200"
      };
    }
    if (file && hasValidLinkedInUrl) {
      return { 
        icon: CheckCircle2, 
        text: "✅ Redo för analys (kommer autofylla kontaktinfo)", 
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200"
      };
    }
    if (file && !hasValidLinkedInUrl) {
      return { 
        icon: Clock, 
        text: "⏳ Lägg till LinkedIn URL för att starta analys", 
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200"
      };
    }
    if (!file) {
      return { 
        icon: Clock, 
        text: "📄 Ladda upp CV för att börja", 
        color: "text-gray-600",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200"
      };
    }
    return { 
      icon: Clock, 
      text: "⏳ Väntar på krav", 
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200"
    };
  };

  const analysisStatus = getAnalysisStatus();
  const StatusIcon = analysisStatus.icon;

  const getCardTitle = () => {
    if (isMyConsultant) {
      return "Lägg till konsult till mitt team";
    }
    return "Starta din analys & gå med i nätverket";
  };

  const getCardDescription = () => {
    if (isMyConsultant) {
      return "Ladda upp CV och LinkedIn-profil för att starta analys och autofylla information";
    }
    return "Ladda upp CV och LinkedIn-profil för analys - kontaktinformation fylls i automatiskt";
  };

  const getSubmitButtonText = () => {
    if (isUploading) {
      return isMyConsultant ? "Lägger till i mitt team..." : "Går med i nätverket...";
    }
    if (analysisResults) {
      return isMyConsultant ? "Lägg till i mitt team" : "Slutför registrering & gå med i nätverket";
    }
    return "Analys krävs före registrering";
  };

  return (
    <Card className="shadow-xl">
      <CardHeader className="text-center border-b">
        <div className="flex items-center justify-center mb-4">
          <Upload className="h-6 w-6 mr-2 text-purple-600" />
          <CardTitle className="text-xl font-semibold">{getCardTitle()}</CardTitle>
        </div>
        <CardDescription className="text-gray-600">
          {getCardDescription()}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-8">
        <form onSubmit={onSubmit} className="space-y-6">
          {/* CV Upload Section */}
          <div className="space-y-3">
            <Label htmlFor="cv-upload" className="text-base font-medium flex items-center">
              CV-fil <span className="text-red-500 ml-1">*</span>
            </Label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-purple-300 transition-colors bg-gray-50">
              <input
                id="cv-upload"
                type="file"
                accept=".pdf,image/*"
                onChange={onFileChange}
                className="hidden"
              />
              <label htmlFor="cv-upload" className="cursor-pointer">
                {file ? (
                  <div className="flex items-center justify-center space-x-3">
                    <FileText className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="font-medium text-green-700">{file.name}</p>
                      <div className={`flex items-center justify-center space-x-2 mt-2 p-3 rounded-lg ${analysisStatus.bgColor} ${analysisStatus.borderColor} border`}>
                        <StatusIcon className={`h-5 w-5 ${analysisStatus.color} ${isAnalyzing ? 'animate-spin' : ''}`} />
                        <p className={`text-sm font-medium ${analysisStatus.color}`}>
                          {analysisStatus.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-base font-medium text-gray-700 mb-1">
                        Ladda upp ditt CV
                      </p>
                      <p className="text-sm text-gray-500">
                        PDF eller bildformat - Analysen fyllar i kontaktinformation automatiskt
                      </p>
                    </div>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* LinkedIn URL Section - Required for analysis */}
          <div className="space-y-3">
            <Label htmlFor="linkedin" className="text-base font-medium flex items-center">
              LinkedIn-profil <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="linkedin"
              value={linkedinUrl}
              onChange={(e) => onLinkedinUrlChange(e.target.value)}
              placeholder="https://linkedin.com/in/dinprofil"
              className="h-12"
              required
            />
            {linkedinUrl && !hasValidLinkedInUrl && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                Vänligen ange en giltig LinkedIn-URL (måste innehålla 'linkedin.com')
              </div>
            )}
            {hasValidLinkedInUrl && (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <CheckCircle2 className="h-4 w-4" />
                Giltig LinkedIn-URL - Analysen startar när CV laddas upp
              </div>
            )}
          </div>

          {/* Analysis Status Info */}
          {!canStartAnalysis && !isAnalyzing && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <StatusIcon className={`h-5 w-5 ${analysisStatus.color}`} />
                <span className={`font-medium ${analysisStatus.color}`}>Analyskrav</span>
              </div>
              <p className="text-sm text-blue-700">
                Ladda upp CV och lägg till LinkedIn-URL för att starta analysen. Kontaktinformation extraheras automatiskt och fylls i.
              </p>
            </div>
          )}

          {/* Analysis Progress Indicator */}
          {isAnalyzing && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <Brain className="h-6 w-6 text-blue-600 animate-pulse" />
                <div>
                  <h4 className="font-semibold text-blue-900">🤖 AI-analys pågår</h4>
                  <p className="text-sm text-blue-700">Analyserar CV och LinkedIn-profil tillsammans...</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-blue-600">
                  <span>Framsteg</span>
                  <span>Extraherar personlig information...</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                </div>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                ⚡ Detta tar vanligtvis 10-30 sekunder
              </p>
            </div>
          )}

          {/* Auto-filled Information Display (only show after analysis) */}
          {analysisResults && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">✅ Information autofylld från analys</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <label className="block text-green-700 font-medium">Namn:</label>
                  <p className="text-green-800">{fullName || 'Ej detekterat'}</p>
                </div>
                <div>
                  <label className="block text-green-700 font-medium">E-post:</label>
                  <p className="text-green-800">{email || 'Ej detekterat'}</p>
                </div>
                <div>
                  <label className="block text-green-700 font-medium">Telefon:</label>
                  <p className="text-green-800">{phoneNumber || 'Ej detekterat'}</p>
                </div>
              </div>
              <p className="text-xs text-green-600 mt-2">
                Du kan ändra dessa fält i nästa steg om det behövs.
              </p>
            </div>
          )}

          {/* Terms and Conditions */}
          <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
            <Checkbox
              id="terms"
              checked={agreeToTerms}
              onCheckedChange={(checked) => onAgreeToTermsChange(checked as boolean)}
              className="mt-1"
            />
            <div className="text-sm text-gray-600">
              <Label htmlFor="terms" className="cursor-pointer">
                <span className="font-medium">
                  Jag godkänner omfattande analys och autofyllning
                </span>
              </Label>
              <p className="mt-1">
                Jag samtycker till att MatchWise analyserar mitt CV och LinkedIn-profil för att autofylla kontaktinformation och skapa min konsultprofil.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full h-14 text-lg bg-purple-600 hover:bg-purple-700" 
            disabled={isUploading || !agreeToTerms || !analysisResults}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {getSubmitButtonText()}
              </>
            ) : analysisResults ? (
              <>
                <CheckCircle2 className="mr-2 h-5 w-5" />
                {getSubmitButtonText()}
              </>
            ) : (
              <>
                <StatusIcon className={`mr-2 h-5 w-5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                {getSubmitButtonText()}
              </>
            )}
          </Button>
          
          {canStartAnalysis && !analysisResults && !isAnalyzing && (
            <p className="text-center text-sm text-green-600">
              ✅ Analysen startar automatiskt och autofyller din information
            </p>
          )}
          
          {isAnalyzing && (
            <p className="text-center text-sm text-blue-600 animate-pulse">
              🔄 Analyserar CV och LinkedIn - autofyller kontaktinformation...
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
