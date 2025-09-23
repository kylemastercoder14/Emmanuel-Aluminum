import { NextResponse } from "next/server";
import db from "@/lib/db";
import { uploadImageToCloudinary } from "@/lib/upload";
import { AxiosProgressEvent } from "axios";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const conversationId = formData.get("conversationId") as string | null;
    const userId = formData.get("userId") as string | null;
    const staffId = formData.get("staffId") as string | null;
    const replyToId = formData.get("replyToId") as string | null;
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
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
            user: { connect: { id: userId! } },
            ...(staffId && { staff: { connect: { id: staffId } } }),
          },
        });
      }

      convoId = conversation.id;
    }

    // Prepare file for Cloudinary
    const cloudFormData = new FormData();
    cloudFormData.append("file", file);
    cloudFormData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string
    );

    // Upload to Cloudinary
    const response = await uploadImageToCloudinary(
      cloudFormData,
      (progress: AxiosProgressEvent) => {
        // Optional: track upload progress
      }
    );

    const imageUrl = response.data.secure_url;

    // Create message with image
    const message = await db.message.create({
      data: {
        content: "",
        imageUrl,
        conversationId: convoId,
        userId,
        staffId,
        ...(replyToId && { replyToId }), // support replying to specific message
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
