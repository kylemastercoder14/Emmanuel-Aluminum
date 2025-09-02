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

export const createTask = async (
  data: z.infer<typeof taskSchema>,
  selectedDate?: string | null
) => {
  try {
    const validatedFields = taskSchema.parse(data);

    const task = await db.task.create({
      data: {
        subject: validatedFields.subject,
        startDate: selectedDate ?? validatedFields.startDate,
        endDate: validatedFields.endDate,
        status: validatedFields.status,
        priority: validatedFields.priority,
      },
    });

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
