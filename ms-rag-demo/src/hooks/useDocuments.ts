import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Types
type Document = {
  id: string;
  title: string;
  description?: string;
  status: 'processing' | 'completed' | 'error' | 'ready';
  createdAt: string;
};

type DocumentsResponse = {
  documents: Document[];
};

// Hook per ottenere tutti i documenti
export function useDocuments() {
  return useQuery({
    queryKey: ['documents'],
    queryFn: async (): Promise<Document[]> => {
      const response = await fetch('/api/documents');
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }
      const data: DocumentsResponse = await response.json();
      return data.documents || [];
    },
  });
}

// Hook per upload di un documento
export function useUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File): Promise<Document> => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload document');
      }

      const data = await response.json();
      return data.document;
    },
    onSuccess: () => {
      // Invalidare e ricarcare la lista dei documenti
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

// Hook per eliminare un documento
export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (documentId: string): Promise<void> => {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }
    },
    onSuccess: () => {
      // Invalidare e ricarcare la lista dei documenti
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}
