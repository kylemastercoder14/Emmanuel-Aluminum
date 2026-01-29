"use server";

import z from "zod";
import db from "@/lib/db";
import { taskSchema } from "@/validators/task";

export const deleteTask = async (id: string) => {
  try {
    await db.task.delete({
      where: { id },
    });

    return { success: "Task deleted successfully" };
  } catch (error) {
    console.error(error);
    return {
      error:
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message: string }).message
          : "Failed to delete task",
    };
  }
};

/** Saturday = 6, Sunday = 0. Uses Asia/Manila to match calendar. */
function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export const createTask = async (
  data: z.infer<typeof taskSchema>,
  selectedDate?: string | null
) => {
  try {
    const now = new Date();
    if (isWeekend(now)) {
      return {
        error:
          "Adding new tasks is not allowed on Saturdays and Sundays.",
      };
    }
    const validatedFields = taskSchema.parse(data);

    const task = await db.task.create({
      data: {
        subject: validatedFields.subject,
        startDate: selectedDate ?? validatedFields.startDate,
        endDate: validatedFields.endDate,
        status: validatedFields.status,
        priority: validatedFields.priority,
        customerId: validatedFields.customerId,
        orderId: validatedFields.orderId,
      },
    });

    // Notify the customer about the new task
    if (validatedFields.customerId) {
      await db.notifications.create({
        data: {
          userId: validatedFields.customerId,
          title: `New task created: ${validatedFields.subject}`,
          message: `Task "${validatedFields.subject}" is scheduled from ${
            selectedDate ?? validatedFields.startDate
          } to ${validatedFields.endDate}. Status: ${validatedFields.status}.`,
        },
      });
    }

    return { success: "Task created successfully", data: task };
  } catch (error) {
    console.error(error);
    return {
      error:
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message: string }).message
          : "Failed to create task",
    };
  }
};

export const updateTask = async (
  id: string,
  data: z.infer<typeof taskSchema>,
  selectedDate?: string | null
) => {
  try {
    const validatedFields = taskSchema.parse(data);

    if (validatedFields.subject) {
      const existingTask = await db.task.findFirst({
        where: { subject: validatedFields.subject, id: { not: id } },
      });

      if (existingTask) {
        return { error: "Task with this subject already exists" };
      }
    }

    const task = await db.task.update({
      where: { id },
      data: {
        ...validatedFields,
        startDate: selectedDate ?? validatedFields.startDate,
        endDate: validatedFields.endDate,
        status: validatedFields.status,
        priority: validatedFields.priority,
      },
    });

    // Notify the customer about the task update
    if (validatedFields.customerId) {
      await db.notifications.create({
        data: {
          userId: validatedFields.customerId,
          title: `Task updated: ${validatedFields.subject}`,
          message: `Task "${validatedFields.subject}" has been updated.
            From: ${selectedDate ?? validatedFields.startDate}
            To: ${validatedFields.endDate}
            Status: ${validatedFields.status}.`,
        },
      });
    }

    return { success: "Task updated successfully", data: task };
  } catch (error) {
    console.error(error);
    return {
      error:
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message: string }).message
          : "Failed to update task",
    };
  }
};
