"use client";

import { useState } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { AuthForm } from "@/components/AuthForm";
import { FileUpload } from "@/components/FileUpload";
import { DocumentList } from "@/components/DocumentList";
import { ChatInterface } from "@/components/ChatInterface";
import { Button } from "@/components/ui/button";
import { LogOut, Brain } from "lucide-react";

interface Document {
  id: string;
  title: string;
  status: string;
  createdAt: string;
}

export default function Home() {
  const { data: session, isPending } = useSession();
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const handleDocumentSelect = (document: Document) => {
    setSelectedDocument(document);
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!session) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">MS RAG Demo</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, {session.user.name || session.user.email}
              </span>
              <Button 
                variant="outline" 
                onClick={() => signOut()}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Upload & Documents */}
          <div className="space-y-6">
            <FileUpload />
            <DocumentList onDocumentSelect={handleDocumentSelect} />
          </div>

          {/* Right Column - Chat */}
          <div>
            <ChatInterface 
              documentId={selectedDocument?.id}
              documentTitle={selectedDocument?.title}
            />
            {selectedDocument && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  Currently chatting with: <strong>{selectedDocument.title}</strong>
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedDocument(null)}
                  className="mt-2"
                >
                  Switch to General Chat
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
