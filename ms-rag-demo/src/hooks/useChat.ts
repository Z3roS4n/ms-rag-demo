import { useMutation } from '@tanstack/react-query';

// Types
type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
};

type ChatRequest = {
  message: string;
  documentId?: string;
  sessionId?: string;
};

type ChatResponse = {
  answer: string;
  sessionId: string;
  message: ChatMessage;
};

// Hook per inviare un messaggio chat
export function useSendMessage() {
  return useMutation({
    mutationFn: async (request: ChatRequest): Promise<ChatResponse> => {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send message');
      }

      const data = await response.json();
      
      // Adattiamo la risposta al formato atteso
      return {
        answer: data.answer,
        sessionId: data.sessionId,
        message: {
          id: data.sessionId,
          role: 'assistant',
          content: data.answer,
          createdAt: new Date().toISOString()
        }
      };
    },
  });
}

// Hook per ottenere la cronologia della chat
export function useChatHistory(sessionId?: string) {
  return useMutation({
    mutationFn: async (): Promise<ChatMessage[]> => {
      if (!sessionId) return [];
      
      const response = await fetch(`/api/chat/${sessionId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch chat history');
      }
      
      return response.json();
    },
  });
}
