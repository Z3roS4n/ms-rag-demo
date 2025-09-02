"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Send, Bot, User } from 'lucide-react';
import { useSendMessage } from '@/hooks/useChat';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  documentId?: string;
  documentTitle?: string;
}

export function ChatInterface({ documentId, documentTitle }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessageMutation = useSendMessage();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sendMessageMutation.isPending) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const result = await sendMessageMutation.mutateAsync({
        message: userMessage,
        documentId,
        sessionId
      });

      setMessages(prev => [...prev, { role: 'assistant', content: result.message.content }]);
      
      if (!sessionId) {
        setSessionId(result.sessionId);
      }
    } catch (error: any) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Error: ${error?.message || 'Something went wrong'}` 
      }]);
    }
  };

  return (
    <Card className="h-[600px] max-h-[600px] overflow-y-scroll overflow-x-hidden flex flex-col">
      <CardHeader>
        <CardTitle className="flex rounded-2xl items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          <p className='p-2 '>{documentTitle ? `Chat with ${documentTitle}` : "General Chat"}</p>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              Start a conversation by typing a message below.
              {documentId && " Ask questions about the uploaded document."}
            </div>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div className={`flex gap-3 max-w-[80%] ${
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}>
                <div className="flex-shrink-0">
                  {message.role === 'user' ? (
                    <User className="h-8 w-8 p-2 bg-blue-500 text-white rounded-full" />
                  ) : (
                    <Bot className="h-8 w-8 p-2 bg-gray-500 text-white rounded-full" />
                  )}
                </div>
                <div
                  className={`p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              </div>
            </div>
          ))}
          {sendMessageMutation.isPending && (
            <div className="flex gap-3 justify-start">
              <div className="flex gap-3 max-w-[80%]">
                <Bot className="h-8 w-8 p-2 bg-gray-500 text-white rounded-full flex-shrink-0" />
                <div className="bg-gray-100 text-gray-900 p-3 rounded-lg">
                  <div>Thinking...</div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="border-t p-4">
          <form onSubmit={sendMessage} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={sendMessageMutation.isPending}
              className="flex-1"
            />
            <Button type="submit" disabled={sendMessageMutation.isPending || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
