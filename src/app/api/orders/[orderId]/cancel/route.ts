import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const orderId = (await params).orderId;

    // 🧩 Check if order exists
    const order = await db.orders.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    // 🛑 Only allow canceling if order is still pending
    if (order.status !== "Pending") {
      return NextResponse.json(
        { error: "Only pending orders can be cancelled." },
        { status: 400 }
      );
    }

    // 📝 Update order status
    const updatedOrder = await db.orders.update({
      where: { id: orderId },
      data: { status: "Cancelled", dateCancelled: new Date() },
    });

    return NextResponse.json({
      message: "Order cancelled successfully.",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("❌ Cancel order error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
