import { AI } from './ai';
import prisma from './prisma';
import { v4 as uuidv4 } from 'uuid';

export class DocumentProcessor {
  private ai: AI;

  constructor() {
    this.ai = new AI();
  }

  async extractTextFromPDF(buffer: Buffer): Promise<string> {
    // Importazione dinamica per evitare problemi durante l'inizializzazione
    const pdfParse = (await import('pdf-parse')).default;
    const data = await pdfParse(buffer);
    return data.text;
  }

  splitIntoChunks(text: string, chunkSize = 500, overlap = 50): string[] {
    const words = text.split(/\s+/);
    const chunks: string[] = [];
    
    for (let i = 0; i < words.length; i += chunkSize - overlap) {
      const chunk = words.slice(i, i + chunkSize).join(' ');
      if (chunk.trim()) {
        chunks.push(chunk);
      }
    }
    
    return chunks;
  }

  async processDocument(documentId: string, buffer: Buffer, mimeType: string): Promise<void> {
    let text = '';
    
    if (mimeType === 'application/pdf') {
      text = await this.extractTextFromPDF(buffer);
    } else if (mimeType.startsWith('text/')) {
      text = buffer.toString('utf-8');
    } else {
      throw new Error('Unsupported file type');
    }

    const chunks = this.splitIntoChunks(text);
    const embeddings = await this.ai.getEmbeddings(chunks);

    // Salva i chunks con gli embeddings nel database
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = embeddings[i];
      const id = uuidv4();

      await prisma.$executeRaw`
        INSERT INTO document_chunks (id, "documentId", content, embedding)
        VALUES (${id}, ${documentId}, ${chunk}, ${embedding}::vector)
      `;
    }
  }
}

const processor = new DocumentProcessor();
export default processor;
