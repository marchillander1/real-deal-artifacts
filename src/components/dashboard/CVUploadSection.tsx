
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useCVUpload } from '@/hooks/useCVUpload';

export const CVUploadSection: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const { uploadCV, isUploading, uploadProgress } = useCVUpload();

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
      const file = e.dataTransfer.files[0];
      if (isValidFileType(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (isValidFileType(file)) {
        setSelectedFile(file);
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

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    const result = await uploadCV(selectedFile, linkedinUrl);
    
    if (result.success) {
      // Reset form
      setSelectedFile(null);
      setLinkedinUrl('');
      
      // Trigger page refresh to show new consultant
      window.location.reload();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Add New Consultant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Upload Area */}
        <div className="space-y-2">
          <Label>CV File (PDF, DOC, DOCX)</Label>
          <div
            className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : selectedFile 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-300 hover:border-gray-400'
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
              disabled={isUploading}
            />
            
            <div className="text-center">
              {selectedFile ? (
                <div className="flex items-center justify-center space-x-3">
                  <FileText className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-700">{selectedFile.name}</p>
                    <p className="text-sm text-green-600">Ready for upload</p>
                  </div>
                </div>
              ) : (
                <div>
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Drag and drop CV here or click to browse
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* LinkedIn URL (Optional) */}
        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn Profile (Optional)</Label>
          <Input
            id="linkedin"
            type="url"
            placeholder="https://linkedin.com/in/consultant-name"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            disabled={isUploading}
          />
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-600">Processing CV...</span>
              <span className="text-blue-600">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>
                {uploadProgress < 25 && "Uploading file..."}
                {uploadProgress >= 25 && uploadProgress < 75 && "Parsing CV with AI..."}
                {uploadProgress >= 75 && "Saving to database..."}
              </span>
            </div>
          </div>
        )}

        {/* Upload Button */}
        <Button 
          onClick={handleUpload} 
          disabled={!selectedFile || isUploading}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing CV...
            </>
          ) : selectedFile ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Add Consultant to Team
            </>
          ) : (
            <>
              <AlertCircle className="mr-2 h-4 w-4" />
              Select CV File First
            </>
          )}
        </Button>

        <div className="text-xs text-gray-500 text-center">
          AI will automatically extract skills, experience, and contact information
        </div>
      </CardContent>
    </Card>
  );
};
