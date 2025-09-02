import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import rag from "@/lib/rag";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { v4 as uuidv4 } from "uuid";

interface ChatRequestBody {
  message: string;
  documentId?: string;
  sessionId?: string;
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ 
      headers: await headers() 
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: ChatRequestBody = await req.json();
    const { message, documentId, sessionId } = body;

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    let currentSessionId = sessionId;

    if (!currentSessionId) {
      const sessionUuid = uuidv4();
      await prisma.chatSession.create({
        data: {
          id: sessionUuid,
          ownerId: session.user.id,
          documentId: documentId || null,
          title: message.substring(0, 50) + "..."
        }
      });
      currentSessionId = sessionUuid;
    }

    await prisma.chatMessage.create({
      data: {
        id: uuidv4(),
        sessionId: currentSessionId,
        userId: session.user.id,
        role: "user",
        content: message
      }
    });

    let answer: string;
    let sources: any[] = [];
    let tokens = { completion: 0, prompt: 0, total: 0 };

    if (documentId) {
      const ragResponse = await rag.answerWithRAG(documentId, message);
      answer = ragResponse.answer;
      sources = ragResponse.sources;
      tokens = ragResponse.tokens;
    } else {
      const aiResponse = await rag["ai"].chatCompletion([
        { role: "user", content: message }
      ]);
      answer = aiResponse.text;
      tokens = aiResponse.tokens;
    }

    await prisma.chatMessage.create({
      data: {
        id: uuidv4(),
        sessionId: currentSessionId,
        role: "assistant",
        content: answer
      }
    });

    return NextResponse.json({
      answer,
      sources,
      tokens,
      sessionId: currentSessionId
    });

  } catch (error) {
    console.error("Error in chat:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
