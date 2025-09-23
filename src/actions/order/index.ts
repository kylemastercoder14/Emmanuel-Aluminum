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
  total: number
) => {
  try {
    const order = await db.orders.create({
      data: {
        orderId: uuidv4(),
        userId,
        totalAmount: total,
        paymentMethod: "Cash on Installation",
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
