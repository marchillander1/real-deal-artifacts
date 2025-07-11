import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, Check, X, AlertCircle, Download } from 'lucide-react';
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

export const BulkConsultantUpload: React.FC<BulkConsultantUploadProps> = ({ onComplete, onClose }) => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{ success: number; failed: number; errors: string[] }>({
    success: 0,
    failed: 0,
    errors: []
  });
  const [isComplete, setIsComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Bulk Upload Consultants</h3>
        <p className="text-gray-600 text-sm">
          Upload multiple consultants at once using a CSV file. Download the template to get started.
        </p>
      </div>

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

      {/* File Upload */}
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

      {/* Progress */}
      {isProcessing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing consultants...</span>
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
                onClick={() => {
                  setIsComplete(false);
                  setCsvFile(null);
                  setResults({ success: 0, failed: 0, errors: [] });
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }} 
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