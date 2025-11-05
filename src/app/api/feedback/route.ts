import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getUserIdFromToken } from "@/lib/auth";
import { feedbackSchema } from "@/validators/rating";

export async function POST(req: Request) {
  try {
    const userId = await getUserIdFromToken();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please login first." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = feedbackSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validatedData.error.errors },
        { status: 400 }
      );
    }

    const { type, rating, message } = validatedData.data;

    // Create the feedback
    const feedback = await db.feedback.create({
      data: {
        type,
        rating,
        message: message || null,
        userId,
      },
    });

    return NextResponse.json({
      message: "Feedback submitted successfully.",
      feedback,
    });
  } catch (error) {
    console.error("❌ Submit feedback error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}

