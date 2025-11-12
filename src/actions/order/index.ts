"use server";

import { v4 as uuidv4 } from "uuid";
import db from "@/lib/db";

export const submitOrder = async (
  userId: string,
  items: {
    id: string;
    color: string;
    quantity: number;
    price: number;
  }[],
  total: number,
  isSeniorOrPwd: boolean = false,
  seniorPwdIdFile?: string[],
  totalDiscount: number = 0
) => {
  try {
    const order = await db.orders.create({
      data: {
        orderId: uuidv4(),
        userId,
        totalAmount: total,
        totalDiscount,
        paymentMethod: "Cash on Installation",
        isSeniorOrPwd,
        seniorPwdId: seniorPwdIdFile,
        orderItems: {
          create: items.map((item) => ({
            quantity: String(item.quantity),
            color: item.color,
            unitPrice: String(item.price),
            serviceId: item.id,
          })),
        },
      },
    });

    // 🔹 Create notification for user
    await db.notifications.create({
      data: {
        userId,
        title: "Your order has been submitted",
        message: `Your order ${order.orderId} has been successfully submitted. We will contact you soon for further details.`,
      },
    });

    return { success: true, orderId: order.orderId };
  } catch (error) {
    console.error(error);
    return { error: "Failed to submit order. Please try again." };
  }
};

export const deleteOrder = async (orderId: string) => {
  try {
    await db.orders.delete({
      where: { id: orderId },
    });

    return { success: "Order deleted successfully." };
  } catch (error) {
    console.error(error);
    return { error: "Failed to delete order. Please try again." };
  }
};

export const completeOrderStatus = async (orderId: string, status: string) => {
  try {
    const updatedOrder = await db.orders.update({
      where: { id: orderId },
      data: { status },
    });

    // 🔹 Create notification for user
    await db.notifications.create({
      data: {
        userId: updatedOrder.userId,
        title: "Your order status has been completed",
        message: `Your order ${updatedOrder.orderId} status has been completed. Your feedback matters to us! Please take a moment to rate your experience.`,
      },
    });

    return { success: "Order status updated successfully." };
  } catch (error) {
    console.error(error);
    return { error: "Failed to update order status. Please try again." };
  }
};

export const scheduleService = async (
  orderId: string,
  scheduledDate: string,
  scheduledTime: string
) => {
  try {
    const updatedOrder = await db.orders.update({
      where: { id: orderId },
      data: { status: "Scheduled", scheduledDate, scheduledTime },
    });

    // 🔹 Create notification for user
    await db.notifications.create({
      data: {
        userId: updatedOrder.userId,
        title: "Your service has been scheduled",
        message: `Your service for order ${updatedOrder.orderId} has been scheduled on ${scheduledDate} at ${scheduledTime}.`,
      },
    });

    return { success: "Service scheduled successfully." };
  } catch (error) {
    console.error(error);
    return { error: "Failed to schedule service. Please try again." };
  }
};

interface PayServiceProps {
  orderId: string;
  attachments: string[];
  note?: string;
}

export const payService = async ({
  orderId,
  attachments,
  note,
}: PayServiceProps) => {
  try {
    if (!orderId) {
      return { success: false, message: "Order ID is required." };
    }

    if (!Array.isArray(attachments) || attachments.length === 0) {
      return {
        success: false,
        message: "At least one proof of payment is required.",
      };
    }

    // Find the order
    const order = await db.orders.findUnique({
      where: { id: orderId },
      include: { payments: true },
    });

    if (!order) {
      return { success: false, message: "Order not found." };
    }

    // Create a pending payment record (amount = 0 initially)
    const payment = await db.payment.create({
      data: {
        order: { connect: { id: order.id } },
        amount: 0, // will be updated by admin later
        attachments,
        note: note ?? "Pending admin verification",
      },
    });

    // Merge attachments into order
    const newAttachments = Array.from(
      new Set([...(order.paymentAttachment || []), ...attachments])
    );

    // Update order to reflect a pending verification
    const updatedOrder = await db.orders.update({
      where: { id: order.id },
      data: {
        paymentAttachment: newAttachments,
        paymentStatus: "Verification Pending",
      },
    });

    return {
      success: true,
      message:
        "Proof of payment submitted successfully. Awaiting admin verification.",
      order: updatedOrder,
      payment,
    };
  } catch (error) {
    console.error("Error in payService:", error);
    return { success: false, message: "An unexpected server error occurred." };
  }
};

interface VerifyPaymentProps {
  paymentId: string;
  amount: number;
}

export const verifyPayment = async ({
  paymentId,
  amount,
}: VerifyPaymentProps) => {
  try {
    // Update the payment record with the verified amount
    const payment = await db.payment.update({
      where: { id: paymentId },
      data: { amount },
    });

    // Fetch the related order
    const order = await db.orders.findUnique({
      where: { id: payment.orderId },
    });

    if (!order) throw new Error("Order not found");

    // Calculate the new paid amount
    const newPaidAmount = (order?.paidAmount || 0) + amount;

    // Determine new payment status
    let paymentStatus = "Partial";
    if (newPaidAmount >= (order?.totalAmount || 0)) {
      paymentStatus = "Paid";
    }

    // Update order with new paid amount and status
    const updatedOrder = await db.orders.update({
      where: { id: order.id },
      data: {
        paidAmount: newPaidAmount,
        paymentStatus,
      },
    });

    // Calculate dynamic percentage
    const percentagePaid = (
      (newPaidAmount / (order.totalAmount || 1)) *
      100
    ).toFixed(0);

    // Create notification for the user
    await db.notifications.create({
      data: {
        userId: order.userId,
        title: "Your payment has been received",
        message: `You've successfully paid ${percentagePaid}% of the total amount. Thank you!`,
      },
    });

    return {
      success: true,
      message: "Payment verified successfully.",
      order: updatedOrder,
    };
  } catch (err) {
    console.error(err);
    return { success: false, message: "Failed to verify payment." };
  }
};
