
import React, { useState } from 'react';
import { Upload, FileText, Link as LinkIcon, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface CVUploadFormProps {
  onSubmit: (data: {
    file: File | null;
    linkedinUrl: string;
    personalTagline: string;
    gdprConsent: boolean;
  }) => void;
}

export const CVUploadForm: React.FC<CVUploadFormProps> = ({ onSubmit }) => {
  const [file, setFile] = useState<File | null>(null);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [personalTagline, setPersonalTagline] = useState('');
  const [gdprConsent, setGdprConsent] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [linkedinValid, setLinkedinValid] = useState<boolean | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      handleFileSelection(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      handleFileSelection(selectedFile);
    }
  };

  const handleFileSelection = (selectedFile: File) => {
    const errors: string[] = [];
    
    // Validate file type
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!validTypes.includes(selectedFile.type)) {
      errors.push('Endast PDF, DOC eller DOCX filer tillåtna');
    }
    
    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      errors.push('Filen är för stor (max 10MB)');
    }
    
    if (errors.length === 0) {
      setFile(selectedFile);
      setValidationErrors([]);
    } else {
      setValidationErrors(errors);
      setFile(null);
    }
  };

  const validateLinkedInUrl = (url: string) => {
    if (!url) {
      setLinkedinValid(null);
      return;
    }
    
    const linkedinPattern = /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
    const isValid = linkedinPattern.test(url);
    setLinkedinValid(isValid);
    
    if (!isValid && url.includes('linkedin.com')) {
      setValidationErrors(prev => [...prev.filter(e => !e.includes('LinkedIn')), 'LinkedIn URL format är inkorrekt']);
    } else {
      setValidationErrors(prev => prev.filter(e => !e.includes('LinkedIn')));
    }
  };

  const handleLinkedInChange = (value: string) => {
    setLinkedinUrl(value);
    validateLinkedInUrl(value);
  };

  const getFormCompleteness = () => {
    let completeness = 0;
    if (file) completeness += 40;
    if (linkedinUrl && linkedinValid) completeness += 30;
    if (personalTagline.trim()) completeness += 20;
    if (gdprConsent) completeness += 10;
    return completeness;
  };

  const isFormValid = () => {
    return file && gdprConsent && validationErrors.length === 0 && 
           (linkedinUrl === '' || linkedinValid);
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      onSubmit({
        file,
        linkedinUrl,
        personalTagline,
        gdprConsent
      });
    }
  };

  const completeness = getFormCompleteness();

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="text-3xl font-bold">
            Analysera din konsultprofil med AI
          </CardTitle>
          <p className="text-lg opacity-90">
            Få djupgående insikter om dina tekniska färdigheter och marknadsvärde
          </p>
          
          {/* Progress indicator */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Profilkomplettering</span>
              <span className="text-sm font-medium">{completeness}%</span>
            </div>
            <Progress value={completeness} className="w-full h-2 bg-white/20" />
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-6">
          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center mb-2">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-red-800 font-medium">Korrigera följande fel:</span>
              </div>
              <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* CV Upload */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700">
              Ladda upp ditt CV (PDF eller DOCX) *
            </label>
            
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : file 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-slate-300 hover:border-slate-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <div className="text-center">
                {file ? (
                  <div className="flex items-center justify-center space-x-3">
                    <FileText className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-700">{file.name}</p>
                      <p className="text-sm text-green-600">
                        {(file.size / (1024 * 1024)).toFixed(1)} MB - Redo för analys
                      </p>
                    </div>
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                ) : (
                  <div>
                    <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-slate-700 mb-2">
                      Dra och släpp ditt CV här
                    </p>
                    <p className="text-slate-500">
                      eller klicka för att bläddra (max 10MB)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* LinkedIn URL */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700">
              LinkedIn-profil (rekommenderas för bättre analys)
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => handleLinkedInChange(e.target.value)}
                placeholder="https://linkedin.com/in/din-profil"
                className={`w-full pl-12 pr-12 py-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  linkedinUrl && linkedinValid === false 
                    ? 'border-red-300 bg-red-50' 
                    : linkedinUrl && linkedinValid 
                    ? 'border-green-300 bg-green-50' 
                    : 'border-slate-300'
                }`}
              />
              {linkedinUrl && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  {linkedinValid ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>
              )}
            </div>
            <p className="text-sm text-slate-500">
              Vi analyserar din LinkedIn-profil för att ge mer omfattande karriärinsikter och marknadsvärdering.
            </p>
          </div>

          {/* Personal Tagline */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700">
              Personlig tagline (valfritt, förbättrar AI-analysen)
            </label>
            <textarea
              value={personalTagline}
              onChange={(e) => setPersonalTagline(e.target.value.slice(0, 200))}
              placeholder="Beskriv kort vad som driver dig som konsult och dina karriärmål..."
              className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              rows={3}
              maxLength={200}
            />
            <div className="flex justify-between items-center">
              <p className="text-sm text-slate-500">
                En personlig beskrivning hjälper AI:n att ge mer skräddarsydda rekommendationer
              </p>
              <div className="text-sm text-slate-500">
                {personalTagline.length}/200 tecken
              </div>
            </div>
          </div>

          {/* GDPR Consent */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-6 bg-blue-50 rounded-xl border border-blue-200">
              <Checkbox
                id="gdpr-consent"
                checked={gdprConsent}
                onCheckedChange={(checked) => setGdprConsent(checked as boolean)}
                className="mt-1"
              />
              <div className="text-sm">
                <label htmlFor="gdpr-consent" className="cursor-pointer font-medium text-slate-700">
                  Jag godkänner att MatchWise analyserar mitt CV och LinkedIn-profil *
                </label>
                <p className="mt-2 text-slate-600">
                  Genom att markera denna ruta samtycker jag till att MatchWise AI analyserar mitt CV 
                  och LinkedIn-profil för att skapa en personlig karriärrapport. Dina data behandlas 
                  enligt vår integritetspolicy och delas aldrig med tredje part utan ditt samtycke.
                </p>
                <div className="flex items-center mt-3 text-blue-700">
                  <Shield className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">GDPR-kompatibel databehandling</span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid()}
              size="lg"
              className={`w-full py-4 text-lg font-semibold rounded-xl transition-all duration-200 ${
                isFormValid()
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:shadow-lg transform hover:scale-105'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {!file 
                ? 'Ladda upp CV först' 
                : validationErrors.length > 0
                ? 'Korrigera fel först'
                : !gdprConsent 
                ? 'Godkänn databehandling'
                : 'Starta AI-analys'
              }
            </Button>
          </div>

          {/* Tips Section */}
          <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
            <h4 className="font-semibold text-indigo-800 mb-2">💡 Tips för bästa resultat:</h4>
            <ul className="text-sm text-indigo-700 space-y-1">
              <li>• Använd ditt senaste CV med uppdaterade färdigheter</li>
              <li>• Inkludera din LinkedIn-profil för djupare analys</li>
              <li>• Skriv en personlig tagline som beskriver dina mål</li>
              <li>• Analysen tar 2-3 minuter och är helt automatiserad</li>
            </ul>
          </div>

          {/* Privacy Notice */}
          <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-sm text-slate-600 text-center">
              <strong>Integritet:</strong> Dina data används endast för analys och matchning. 
              De delas aldrig utan ditt godkännande och du kan när som helst begära att de raderas.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
