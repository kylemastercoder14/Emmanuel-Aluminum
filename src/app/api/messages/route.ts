/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, conversationId, userId, staffId, replyToId } = body;

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    let convoId = conversationId;

    // If no conversation provided, check if one exists or create new
    if (!convoId) {
      let conversation = await db.conversation.findFirst({
        where: {
          userId: userId || undefined,
          staffId: staffId || undefined,
        },
      });

      if (!conversation) {
        conversation = await db.conversation.create({
          data: {
            ...(userId && { user: { connect: { id: userId } } }),
            ...(staffId && { staff: { connect: { id: staffId } } }),
          },
        });
      }

      convoId = conversation.id;
    }

    // Build message data safely (only connect valid foreign key)
    const messageData: any = {
      content,
      conversationId: convoId,
      ...(userId && { userId }), // only if sender is user
      ...(staffId && { staffId }), // only if sender is staff
      ...(replyToId && { replyToId }), // reply reference
    };

    // Create message
    const message = await db.message.create({
      data: messageData,
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
