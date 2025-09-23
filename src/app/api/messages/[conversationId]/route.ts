import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const conversationId = (await params).conversationId;
  try {
    const messages = await db.message.findMany({
      where: { conversationId: conversationId },
      include: {
        user: true,
        staff: true,
      },
      orderBy: { createdAt: "asc" },
    });

    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
      include: {
        staff: true,
        user: true,
      },
    });

    return NextResponse.json({ messages, conversation });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const conversationId = (await params).conversationId;
  try {
    // Delete messages associated with the conversation
    await db.message.deleteMany({
      where: { conversationId: conversationId },
    });

    // Delete the conversation itself
    await db.conversation.delete({
      where: { id: conversationId },
    });

    return NextResponse.json({ message: "Conversation deleted successfully" });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    return NextResponse.json(
      { error: "Failed to delete conversation" },
      { status: 500 }
    );
  }
}
