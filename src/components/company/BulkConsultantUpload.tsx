import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, File, CheckCircle, AlertCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CVParser } from '@/components/cv-analysis/CVParser';
import { ConsultantCreator } from '@/components/cv-analysis/ConsultantCreator';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface UploadFile {
  file: File;
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  error?: string;
  consultant?: any;
}

interface BulkConsultantUploadProps {
  onConsultantUploaded?: () => void;
}

export const BulkConsultantUpload: React.FC<BulkConsultantUploadProps> = ({ onConsultantUploaded }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending' as const,
      progress: 0
    }));
    
    setUploadFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: true
  });

  const removeFile = (id: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== id));
  };

  const processFile = async (uploadFile: UploadFile): Promise<void> => {
    try {
      // Update status to processing
      setUploadFiles(prev => prev.map(f => 
        f.id === uploadFile.id 
          ? { ...f, status: 'processing', progress: 20 }
          : f
      ));

      // Parse CV
      const parseResult = await CVParser.parseCV(uploadFile.file);
      
      if (!parseResult.success) {
        throw new Error(parseResult.error || 'CV parsing failed');
      }

      // Update progress
      setUploadFiles(prev => prev.map(f => 
        f.id === uploadFile.id 
          ? { ...f, progress: 60 }
          : f
      ));
      
      // Create consultant
      const consultant = await ConsultantCreator.createConsultant({
        cvAnalysis: parseResult.analysis,
        linkedinData: null,
        extractedPersonalInfo: parseResult.detectedInfo,
        file: uploadFile.file,
        linkedinUrl: '',
        isMyConsultant: true
      });

      // Update the consultant with user_id and company_id if needed
      if (consultant && user) {
        await supabase
          .from('consultants')
          .update({ 
            user_id: user.id,
            company_id: user.id // Set company_id to the user who uploaded
          })
          .eq('id', consultant.id);
      }

      // Update progress
      setUploadFiles(prev => prev.map(f => 
        f.id === uploadFile.id 
          ? { ...f, progress: 100, status: 'completed', consultant }
          : f
      ));

    } catch (error: any) {
      setUploadFiles(prev => prev.map(f => 
        f.id === uploadFile.id 
          ? { ...f, status: 'error', error: error.message }
          : f
      ));
    }
  };

  const startProcessing = async () => {
    if (uploadFiles.length === 0) return;

    setIsUploading(true);
    
    try {
      // Process files sequentially to avoid overwhelming the API
      for (const file of uploadFiles.filter(f => f.status === 'pending')) {
        await processFile(file);
      }

      const successCount = uploadFiles.filter(f => f.status === 'completed').length;
      
      toast({
        title: "Upload Complete",
        description: `Successfully processed ${successCount} consultant(s)`,
      });

      if (onConsultantUploaded) {
        onConsultantUploaded();
      }

    } catch (error) {
      toast({
        title: "Upload Error",
        description: "Some files failed to process",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-emerald-400" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      case 'processing':
        return <div className="h-5 w-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />;
      default:
        return <File className="h-5 w-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-400';
      case 'error':
        return 'text-red-400';
      case 'processing':
        return 'text-blue-400';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Upload className="h-5 w-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Bulk Upload Consultants</h2>
          </div>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {isDragActive ? 'Drop files here' : 'Upload consultant CVs'}
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop files here, or click to select files
            </p>
            <p className="text-sm text-gray-500">
              Supports PDF, DOC, and DOCX files. Upload multiple files at once.
            </p>
          </div>
        </div>
      </div>

      {/* File List */}
      {uploadFiles.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Files to Process ({uploadFiles.length})
              </h2>
              <div className="flex gap-2">
                <Button
                  onClick={() => setUploadFiles([])}
                  variant="outline"
                  size="sm"
                  disabled={isUploading}
                >
                  Clear All
                </Button>
                <Button
                  onClick={startProcessing}
                  disabled={isUploading || uploadFiles.every(f => f.status !== 'pending')}
                  size="sm"
                >
                  {isUploading ? 'Processing...' : 'Start Processing'}
                </Button>
              </div>
            </div>
            <div className="space-y-3">
              {uploadFiles.map((uploadFile) => (
                <div key={uploadFile.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  {getStatusIcon(uploadFile.status)}
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-900 font-medium">{uploadFile.file.name}</span>
                      <span className={`text-sm capitalize ${getStatusColor(uploadFile.status)}`}>
                        {uploadFile.status}
                      </span>
                    </div>
                    
                    {uploadFile.status === 'processing' && (
                      <Progress value={uploadFile.progress} className="h-2" />
                    )}
                    
                    {uploadFile.error && (
                      <p className="text-red-600 text-sm mt-1">{uploadFile.error}</p>
                    )}
                    
                    <div className="text-sm text-gray-500">
                      {(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>

                  {uploadFile.status === 'pending' && (
                    <Button
                      onClick={() => removeFile(uploadFile.id)}
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">How it works:</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <div className="text-blue-600 font-semibold mb-1">1. Upload CVs</div>
              <p>Select multiple PDF or Word documents containing consultant CVs</p>
            </div>
            <div>
              <div className="text-blue-600 font-semibold mb-1">2. AI Analysis</div>
              <p>Our AI extracts skills, experience, values, and personality traits</p>
            </div>
            <div>
              <div className="text-blue-600 font-semibold mb-1">3. Review & Publish</div>
              <p>Edit profiles, set pricing, and choose visibility settings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};