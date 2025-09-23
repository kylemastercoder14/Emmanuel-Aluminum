import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const conversationId = (await params).conversationId;

    // Mark all unread messages in this conversation as read
    await db.message.updateMany({
      where: {
        conversationId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return NextResponse.json(
      { error: "Failed to mark as read" },
      { status: 500 }
    );
  }
}
