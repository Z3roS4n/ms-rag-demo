"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Clock, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { useDocuments, useDeleteDocument } from '@/hooks/useDocuments';

interface Document {
  id: string;
  title: string;
  status: string;
  createdAt: string;
}

interface DocumentListProps {
  onDocumentSelect: (document: Document) => void;
}

export function DocumentList({ onDocumentSelect }: DocumentListProps) {
  const { data: documents = [], isLoading, error } = useDocuments();
  const deleteDocumentMutation = useDeleteDocument();

  const handleDelete = async (documentId: string) => {
    if (window.confirm('Sei sicuro di voler eliminare questo documento?')) {
      deleteDocumentMutation.mutate(documentId);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Your Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">Errore nel caricamento dei documenti</div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Your Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>Loading documents...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Your Documents ({documents.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No documents uploaded yet. Upload your first document above.
          </div>
        ) : (
          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="font-medium">{doc.title}</div>
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    {getStatusIcon(doc.status)}
                    Status: {doc.status} • 
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => onDocumentSelect(doc)}
                    disabled={doc.status !== 'ready' && doc.status !== 'completed'}
                    size="sm"
                  >
                    {(doc.status === 'ready' || doc.status === 'completed') ? 'Chat' : doc.status}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(doc.id)}
                    disabled={deleteDocumentMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
