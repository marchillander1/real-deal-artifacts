
import React, { useState } from 'react';
import { Upload, FileText, Link as LinkIcon, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
      if (isValidFileType(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (isValidFileType(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const isValidFileType = (file: File) => {
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    return validTypes.includes(file.type);
  };

  const isFormValid = () => {
    return file && linkedinUrl && gdprConsent;
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
        </CardHeader>

        <CardContent className="p-8 space-y-6">
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
                      <p className="text-sm text-green-600">Redo för analys</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-slate-700 mb-2">
                      Dra och släpp ditt CV här
                    </p>
                    <p className="text-slate-500">
                      eller klicka för att bläddra
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* LinkedIn URL */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700">
              LinkedIn-profil (krävs för fullständig analys) *
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/din-profil"
                className="w-full pl-12 pr-4 py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
            <p className="text-sm text-slate-500">
              Vi analyserar dina inlägg och kommunikationsstil för att ge bättre karriärinsikter.
            </p>
          </div>

          {/* Personal Tagline */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700">
              Personlig tagline (valfritt, max 150 tecken)
            </label>
            <textarea
              value={personalTagline}
              onChange={(e) => setPersonalTagline(e.target.value.slice(0, 150))}
              placeholder="Beskriv kort vad som driver dig som konsult..."
              className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              rows={3}
              maxLength={150}
            />
            <div className="text-right text-sm text-slate-500">
              {personalTagline.length}/150 tecken
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
                : !linkedinUrl 
                ? 'Ange LinkedIn-profil'
                : !gdprConsent 
                ? 'Godkänn databehandling'
                : 'Starta AI-analys'
              }
            </Button>
          </div>

          {/* Privacy Notice */}
          <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-sm text-slate-600 text-center">
              <strong>Integritet:</strong> Dina data används endast för analys och matchning. 
              De delas aldrig utan ditt godkännande.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
