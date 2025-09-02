import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import storage from "@/lib/storage";
import processor from "@/lib/processor";
import { headers } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ 
      headers: await headers() 
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const documents = await prisma.document.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json({ documents });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ 
      headers: await headers() 
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.includes("pdf") && !file.type.startsWith("text/")) {
      return NextResponse.json({ error: "Only PDF and text files are supported" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const documentId = uuidv4();
    const fileName = `${session.user.id}/${documentId}_${file.name}`;

    try {
      await storage.uploadFile("documents", fileName, buffer, {
        contentType: file.type
      });

      const document = await prisma.document.create({
        data: {
          id: documentId,
          userId: session.user.id,
          title: file.name,
          fileUrl: fileName,
          status: "processing"
        }
      });

      processor.processDocument(documentId, buffer, file.type)
        .then(async () => {
          await prisma.document.update({
            where: { id: documentId },
            data: { status: "ready" }
          });
        })
        .catch(async (error) => {
          console.error("Error processing document:", error);
          await prisma.document.update({
            where: { id: documentId },
            data: { status: "error" }
          });
        });

      return NextResponse.json({ 
        message: "Document uploaded successfully",
        document 
      });

    } catch (error) {
      console.error("Error uploading file:", error);
      return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
    }

  } catch (error) {
    console.error("Error in document upload:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {

  } catch(error) {
    
  }
}