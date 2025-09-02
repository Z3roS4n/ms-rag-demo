import OpenAI from "openai";

export type ChatRole = "system" | "user" | "assistant";

export type AIMessage = {
  role: ChatRole;
  content: string;
};

export type ChatResponse = {
  text: string;
  tokens: {
    completion: number;
    prompt: number;
    total: number;
  };
};

if (!process.env.OPENAI_KEY) {
  throw new Error("Missing OPENAI_KEY in environment variables");
}

export class AI {
  private openai: OpenAI;
  
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_KEY!,
    });
  }

  async chatCompletion(messages: AIMessage[], temperature = 0.2): Promise<ChatResponse> {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      temperature,
      max_tokens: 2000
    });

    const text = response.choices[0]?.message?.content || "";
    const usage = response.usage;

    return {
      text,
      tokens: {
        completion: usage?.completion_tokens || 0,
        prompt: usage?.prompt_tokens || 0,
        total: usage?.total_tokens || 0
      }
    };
  }

  async getEmbedding(text: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text
    });

    return response.data[0]?.embedding || [];
  }

  async getEmbeddings(texts: string[]): Promise<number[][]> {
    const response = await this.openai.embeddings.create({
      model: "text-embedding-3-small",
      input: texts
    });

    return response.data.map(d => d.embedding);
  }
}

const ai = new AI();
export default ai;
