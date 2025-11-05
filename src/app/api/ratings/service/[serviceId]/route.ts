import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ serviceId: string }> }
) {
  try {
    const { serviceId } = await params;

    // Fetch all ratings for this service through orderItems
    const ratings = await db.serviceRating.findMany({
      where: {
        orderItem: {
          serviceId: serviceId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        orderItem: {
          select: {
            id: true,
            color: true,
            quantity: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate average rating
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : 0;

    return NextResponse.json({
      ratings,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalRatings: ratings.length,
    });
  } catch (error) {
    console.error("❌ Fetch service ratings error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}

