import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText, Check, X, AlertCircle, Download, Files } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface BulkConsultantUploadProps {
  onComplete: () => void;
  onClose: () => void;
}

interface ConsultantRow {
  name: string;
  email: string;
  title: string;
  skills: string;
  location: string;
  rate: string;
  experience: string;
  phone?: string;
}

interface CVFile {
  file: File;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
}

export const BulkConsultantUpload: React.FC<BulkConsultantUploadProps> = ({ onComplete, onClose }) => {
  // CSV Upload states
  const [csvFile, setCsvFile] = useState<File | null>(null);
  
  // CV Upload states
  const [cvFiles, setCvFiles] = useState<CVFile[]>([]);
  
  // Shared states
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{ success: number; failed: number; errors: string[] }>({
    success: 0,
    failed: 0,
    errors: []
  });
  const [isComplete, setIsComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cvFileInputRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = () => {
    const template = `name,email,title,skills,location,rate,experience,phone
John Doe,john@example.com,Senior Developer,"React,TypeScript,Node.js",Stockholm,800 SEK/h,5 years,+46123456789
Jane Smith,jane@example.com,UX Designer,"Figma,Sketch,User Research",Göteborg,750 SEK/h,3 years,+46987654321`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'consultant_template.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const parseCSV = (text: string): ConsultantRow[] => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      return row as ConsultantRow;
    });
  };

  const validateConsultantRow = (row: ConsultantRow): string | null => {
    if (!row.name) return 'Name is required';
    if (!row.email) return 'Email is required';
    if (!row.title) return 'Title is required';
    if (!row.skills) return 'Skills are required';
    if (!row.location) return 'Location is required';
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(row.email)) return 'Invalid email format';
    
    return null;
  };

  const createConsultant = async (row: ConsultantRow) => {
    const skillsArray = row.skills.split(',').map(s => s.trim()).filter(s => s);
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }
    
    const { error } = await supabase
      .from('consultants')
      .insert({
        name: row.name,
        email: row.email,
        title: row.title,
        skills: skillsArray,
        location: row.location,
        hourly_rate: parseInt(row.rate.replace(/[^\d]/g, '')) || null,
        experience_years: parseInt(row.experience.replace(/[^\d]/g, '')) || null,
        phone: row.phone || null,
        availability: 'Available',
        rating: 5.0,
        projects_completed: 0,
        type: 'existing',
        user_id: user.id,
        is_published: true
      });

    if (error) throw error;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
    } else {
      toast.error('Please select a valid CSV file');
    }
  };

  const handleCVFilesSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length !== files.length) {
      toast.error('Please select only PDF files');
      return;
    }

    const newCVFiles: CVFile[] = pdfFiles.map(file => ({
      file,
      name: file.name,
      status: 'pending'
    }));

    setCvFiles(prev => [...prev, ...newCVFiles]);
  };

  const removeCVFile = (index: number) => {
    setCvFiles(prev => prev.filter((_, i) => i !== index));
  };

  const processCVFile = async (cvFile: CVFile): Promise<boolean> => {
    try {
      // Create FormData for the parse-cv function
      const formData = new FormData();
      formData.append('file', cvFile.file);
      formData.append('personalDescription', '');
      formData.append('personalTagline', '');
      formData.append('linkedinUrl', '');

      // Call the existing parse-cv edge function (it will create a network consultant)
      const { data, error } = await supabase.functions.invoke('parse-cv', {
        body: formData
      });

      if (error) {
        console.error('Parse CV error:', error);
        throw error;
      }

      // The parse-cv function already created a consultant in the database as a network consultant
      // We need to find that consultant and update it to be our team consultant
      if (data && data.consultant) {
        const consultantId = data.consultant.id;
        
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          throw new Error('User not authenticated');
        }

        // Update the consultant to be a team consultant
        const { error: updateError } = await supabase
          .from('consultants')
          .update({
            type: 'existing',
            user_id: user.id,
            visibility_status: 'private'
          })
          .eq('id', consultantId);

        if (updateError) {
          console.error('Error updating consultant:', updateError);
          throw updateError;
        }
      }

      console.log('✅ CV parsing and team assignment successful for:', cvFile.name);
      return true;
    } catch (error) {
      console.error('Error processing CV:', error);
      return false;
    }
  };

  const handleCVUpload = async () => {
    if (cvFiles.length === 0) return;

    setIsProcessing(true);
    setProgress(0);
    setResults({ success: 0, failed: 0, errors: [] });

    let success = 0;
    let failed = 0;
    const errors: string[] = [];

    for (let i = 0; i < cvFiles.length; i++) {
      const cvFile = cvFiles[i];
      
      // Update status to processing
      setCvFiles(prev => prev.map((file, index) => 
        index === i ? { ...file, status: 'processing' } : file
      ));

      try {
        const result = await processCVFile(cvFile);
        
        if (result) {
          success++;
          setCvFiles(prev => prev.map((file, index) => 
            index === i ? { ...file, status: 'completed' } : file
          ));
        } else {
          failed++;
          errors.push(`${cvFile.name}: Failed to process CV`);
          setCvFiles(prev => prev.map((file, index) => 
            index === i ? { ...file, status: 'failed', error: 'Failed to process' } : file
          ));
        }
      } catch (error: any) {
        failed++;
        errors.push(`${cvFile.name}: ${error.message}`);
        setCvFiles(prev => prev.map((file, index) => 
          index === i ? { ...file, status: 'failed', error: error.message } : file
        ));
      }

      // Update progress
      setProgress(((i + 1) / cvFiles.length) * 100);
      setResults({ success, failed, errors });
    }

    setIsComplete(true);
    
    if (success > 0) {
      toast.success(`Successfully processed ${success} CVs!`);
    }
    
    if (failed > 0) {
      toast.error(`Failed to process ${failed} CVs. Check the details below.`);
    }

    setIsProcessing(false);
  };

  const handleUpload = async () => {
    if (!csvFile) return;

    setIsProcessing(true);
    setProgress(0);
    setResults({ success: 0, failed: 0, errors: [] });

    try {
      const text = await csvFile.text();
      const consultants = parseCSV(text);
      
      let success = 0;
      let failed = 0;
      const errors: string[] = [];

      for (let i = 0; i < consultants.length; i++) {
        const consultant = consultants[i];
        
        // Validate row
        const validationError = validateConsultantRow(consultant);
        if (validationError) {
          failed++;
          errors.push(`Row ${i + 2}: ${validationError}`);
          continue;
        }

        try {
          await createConsultant(consultant);
          success++;
        } catch (error: any) {
          failed++;
          errors.push(`Row ${i + 2}: ${error.message}`);
        }

        // Update progress
        setProgress(((i + 1) / consultants.length) * 100);
        setResults({ success, failed, errors });
      }

      setIsComplete(true);
      
      if (success > 0) {
        toast.success(`Successfully added ${success} consultants!`);
      }
      
      if (failed > 0) {
        toast.error(`Failed to add ${failed} consultants. Check the details below.`);
      }

    } catch (error: any) {
      toast.error('Failed to process CSV file: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleComplete = () => {
    onComplete();
    onClose();
  };

  const resetState = () => {
    setIsComplete(false);
    setCsvFile(null);
    setCvFiles([]);
    setResults({ success: 0, failed: 0, errors: [] });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (cvFileInputRef.current) {
      cvFileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Bulk Upload Consultants</h3>
        <p className="text-gray-600 text-sm">
          Upload multiple consultants at once using CSV data or CV files with AI analysis.
        </p>
      </div>

      <Tabs defaultValue="csv" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="csv">CSV Upload</TabsTrigger>
          <TabsTrigger value="cvs">CV Upload</TabsTrigger>
        </TabsList>
        
        <TabsContent value="csv" className="space-y-6">
          {/* Template Download */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download Template
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Download the CSV template with the correct format and example data.
              </p>
              <Button onClick={downloadTemplate} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            </CardContent>
          </Card>

          {/* CSV File Upload */}
          {!isComplete && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload CSV File
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="csv-file">Select CSV File</Label>
                  <Input
                    id="csv-file"
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    ref={fileInputRef}
                    className="mt-1"
                  />
                </div>

                {csvFile && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText className="h-4 w-4" />
                    <span>{csvFile.name}</span>
                    <span>({(csvFile.size / 1024).toFixed(1)} KB)</span>
                  </div>
                )}

                <Button 
                  onClick={handleUpload} 
                  disabled={!csvFile || isProcessing}
                  className="w-full"
                >
                  {isProcessing ? 'Processing...' : 'Upload Consultants'}
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="cvs" className="space-y-6">
          {/* CV Files Upload */}
          {!isComplete && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Files className="h-4 w-4" />
                  Upload CV Files
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="cv-files">Select CV Files (PDF)</Label>
                  <Input
                    id="cv-files"
                    type="file"
                    accept=".pdf"
                    multiple
                    onChange={handleCVFilesSelect}
                    ref={cvFileInputRef}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Select multiple PDF files. Each CV will be analyzed with AI to extract consultant information.
                  </p>
                </div>

                {/* CV Files List */}
                {cvFiles.length > 0 && (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    <div className="text-sm font-medium">Selected Files ({cvFiles.length}):</div>
                    {cvFiles.map((cvFile, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm">{cvFile.name}</span>
                          {cvFile.status === 'processing' && (
                            <div className="text-xs text-blue-600">Processing...</div>
                          )}
                          {cvFile.status === 'completed' && (
                            <Check className="h-4 w-4 text-green-600" />
                          )}
                          {cvFile.status === 'failed' && (
                            <X className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        {cvFile.status === 'pending' && (
                          <Button
                            onClick={() => removeCVFile(index)}
                            variant="outline"
                            size="sm"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <Button 
                  onClick={handleCVUpload} 
                  disabled={cvFiles.length === 0 || isProcessing}
                  className="w-full"
                >
                  {isProcessing ? 'Processing CVs...' : `Process ${cvFiles.length} CV${cvFiles.length !== 1 ? 's' : ''}`}
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Progress */}
      {isProcessing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Success: {results.success}</span>
                <span>Failed: {results.failed}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {isComplete && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              Upload Complete
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{results.success}</div>
                <div className="text-sm text-green-700">Successfully Added</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{results.failed}</div>
                <div className="text-sm text-red-700">Failed</div>
              </div>
            </div>

            {results.errors.length > 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-medium mb-2">Errors encountered:</div>
                  <div className="max-h-32 overflow-y-auto text-xs space-y-1">
                    {results.errors.map((error, index) => (
                      <div key={index} className="text-red-600">{error}</div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button onClick={handleComplete} className="flex-1">
                <Check className="h-4 w-4 mr-2" />
                Done
              </Button>
              <Button 
                onClick={resetState} 
                variant="outline"
              >
                Upload More
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};