import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getUserIdFromToken } from "@/lib/auth";
import { serviceRatingSchema } from "@/validators/rating";

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
    const validatedData = serviceRatingSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validatedData.error.issues },
        { status: 400 }
      );
    }

    const { rating, comment, orderItemId } = validatedData.data;

    // Check if order item exists and belongs to the user
    const orderItem = await db.orderItems.findUnique({
      where: { id: orderItemId },
      include: {
        orders: true,
        serviceRating: true,
      },
    });

    if (!orderItem) {
      return NextResponse.json(
        { error: "Order item not found." },
        { status: 404 }
      );
    }

    // Check if the order belongs to the user
    if (orderItem.orders.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized. This order does not belong to you." },
        { status: 403 }
      );
    }

    // Check if order is completed
    if (orderItem.orders.status !== "Completed") {
      return NextResponse.json(
        { error: "You can only rate completed orders." },
        { status: 400 }
      );
    }

    // Check if already rated
    if (orderItem.serviceRating) {
      return NextResponse.json(
        { error: "This service has already been rated." },
        { status: 400 }
      );
    }

    // Create the rating
    const serviceRating = await db.serviceRating.create({
      data: {
        rating,
        comment: comment || null,
        userId,
        orderItemId,
      },
    });

    return NextResponse.json({
      message: "Service rated successfully.",
      rating: serviceRating,
    });
  } catch (error) {
    console.error("❌ Rate service error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}

