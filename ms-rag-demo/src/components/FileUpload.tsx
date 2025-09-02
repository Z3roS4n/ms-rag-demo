"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import { useUploadDocument } from '@/hooks/useDocuments';

interface FileUploadProps {
  onUploadSuccess?: (document: any) => void;
}

export function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const uploadMutation = useUploadDocument();

  const handleFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedFile) {
      return;
    }

    try {
      const result = await uploadMutation.mutateAsync(selectedFile);
      onUploadSuccess?.(result);
      setSelectedFile(null);
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Document
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleFileUpload} className="space-y-4">
          <Input
            type="file"
            accept=".pdf,.txt"
            required
            disabled={uploadMutation.isPending}
            onChange={handleFileChange}
          />
          <Button 
            type="submit" 
            disabled={uploadMutation.isPending || !selectedFile} 
            className="w-full"
          >
            {uploadMutation.isPending ? "Uploading..." : "Upload"}
          </Button>
        </form>
        {uploadMutation.isError && (
          <p className="mt-2 text-sm text-red-600">
            {uploadMutation.error?.message || 'Upload failed'}
          </p>
        )}
        {uploadMutation.isSuccess && (
          <p className="mt-2 text-sm text-green-600">
            File uploaded successfully!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
