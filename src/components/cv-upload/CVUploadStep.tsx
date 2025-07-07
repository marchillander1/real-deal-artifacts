
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, Loader2, User, Link as LinkIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CVUploadStepProps {
  onNext: (data: {
    file: File;
    linkedinUrl: string;
    personalDescription: string;
  }) => void;
}

export const CVUploadStep: React.FC<CVUploadStepProps> = ({ onNext }) => {
  const [file, setFile] = useState<File | null>(null);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [personalDescription, setPersonalDescription] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

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
      } else {
        toast({
          title: "Ogiltigt filformat",
          description: "Vänligen ladda upp en PDF, Word-dokument eller bild",
          variant: "destructive",
        });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (isValidFileType(selectedFile)) {
        setFile(selectedFile);
      } else {
        toast({
          title: "Ogiltigt filformat",
          description: "Vänligen ladda upp en PDF, Word-dokument eller bild",
          variant: "destructive",
        });
      }
    }
  };

  const isValidFileType = (file: File) => {
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/jpg'
    ];
    return validTypes.includes(file.type);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: "CV krävs",
        description: "Vänligen ladda upp ditt CV",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing with progress
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    onNext({
      file,
      linkedinUrl,
      personalDescription
    });
  };

  const hasValidLinkedIn = linkedinUrl && linkedinUrl.includes('linkedin.com');

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Ladda upp ditt CV
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload */}
            <div className="space-y-3">
              <Label htmlFor="cv-upload" className="text-base font-medium flex items-center">
                CV-fil <span className="text-red-500 ml-1">*</span>
              </Label>
              <div
                className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : file 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  id="cv-upload"
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isProcessing}
                />
                
                <div className="text-center">
                  {file ? (
                    <div className="flex items-center justify-center space-x-3">
                      <FileText className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="font-medium text-green-700">{file.name}</p>
                        <p className="text-sm text-green-600">Redo för uppladdning</p>
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
                          PDF, Word eller bildformat
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* LinkedIn URL */}
            <div className="space-y-3">
              <Label htmlFor="linkedin" className="text-base font-medium flex items-center">
                <LinkIcon className="h-4 w-4 mr-2" />
                LinkedIn-profil (valfritt)
              </Label>
              <Input
                id="linkedin"
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/dinprofil"
                disabled={isProcessing}
              />
              {hasValidLinkedIn && (
                <p className="text-sm text-green-600">✓ Giltig LinkedIn-URL - förbättrar analysen</p>
              )}
            </div>

            {/* Personal Description */}
            <div className="space-y-3">
              <Label htmlFor="personal-description" className="text-base font-medium flex items-center">
                <User className="h-4 w-4 mr-2" />
                Personlig beskrivning (valfritt)
              </Label>
              <Textarea
                id="personal-description"
                value={personalDescription}
                onChange={(e) => setPersonalDescription(e.target.value)}
                placeholder="Berätta om dig själv, dina styrkor, intressen och vad som gör dig unik som konsult..."
                className="h-24 resize-none"
                maxLength={500}
                disabled={isProcessing}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Hjälper att förbättra AI-analysens kvalitet</span>
                <span>{personalDescription.length}/500</span>
              </div>
            </div>

            {/* Progress */}
            {isProcessing && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-600">Bearbetar CV...</span>
                  <span className="text-blue-600">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={!file || isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Bearbetar...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Starta AI-analys
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
