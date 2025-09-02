import { AI } from "./ai";
import prisma from "./prisma";
import { v4 as uuidv4 } from "uuid";

type Chunk = {
  id?: string;
  content: string;
  embedding?: number[] | null;
};

export class RAG {
  private ai: AI;

  constructor() {
    this.ai = new AI();
  }

  async createEmbeddingsForChunks(documentId: string, chunks: string[]) {
    if (!documentId) throw new TypeError("documentId is required");
    if (!Array.isArray(chunks) || chunks.length === 0) return [];

    const embeddings = await this.ai.getEmbeddings(chunks);

    const created: Array<{ id: string; content: string }> = [];

    for (let i = 0; i < chunks.length; i++) {
      const emb = embeddings[i] ?? [];
      const chunk = chunks[i];
      const id = uuidv4();
      
      await prisma.$executeRaw`
        INSERT INTO document_chunks (id, "documentId", content, embedding)
        VALUES (${id}, ${documentId}, ${chunk}, ${emb}::vector)
      `;
      
      created.push({ id, content: chunk });
    }

    return created;
  }

  async searchDocumentChunks(documentId: string, query: string, k = 5) {
    if (!query) return [];
    const qEmb = await this.ai.getEmbedding(query);
    if (!qEmb) return [];

    const raw = await prisma.$queryRaw`
      SELECT id, content, 1 - (embedding <#> ${qEmb}::vector) AS score
      FROM document_chunks
      WHERE "documentId" = ${documentId}
      ORDER BY embedding <#> ${qEmb}::vector
      LIMIT ${k}
    ` as Array<{ id: string; content: string; score: number }>;

    return raw;
  }

  buildContextPrompt(question: string, chunks: Array<{ content: string }>, instruction?: string) {
    const defaultInstruction = "Use the following excerpts to answer the user question. If the answer is not contained here, use your personal knowledge.";
    
    const context = chunks.map((c, i) => `Context ${i + 1}:\n${c.content}`).join("\n\n---\n\n");

    const prompt = `${instruction || defaultInstruction}\n\n${context}\n\nQuestion: ${question}\nAnswer concisely:`;
    return prompt;
  }

  async answerWithRAG(documentId: string, question: string, opts?: { k?: number; temperature?: number }) {
    const k = opts?.k ?? 5;
    const chunks = await this.searchDocumentChunks(documentId, question, k);
    const prompt = this.buildContextPrompt(question, chunks.map((c) => ({ content: c.content })));

    const answer = await this.ai.chatCompletion([{ role: "user", content: prompt }], opts?.temperature ?? 0.0);
    return {
      answer: answer.text,
      sources: chunks,
      tokens: answer.tokens
    };
  }
}

const rag = new RAG();
export default rag;
