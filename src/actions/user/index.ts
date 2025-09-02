"use server";

import z from "zod";
import db from "@/lib/db";
import { userSchema } from "@/validators/user";

export const deleteUser = async (id: string) => {
  try {
    await db.staff.delete({
      where: { id },
    });

    return { success: "User deleted successfully" };
  } catch (error) {
    console.error(error);
    return {
      error:
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message: string }).message
          : "Failed to delete user",
    };
  }
};

export const createUser = async (data: z.infer<typeof userSchema>) => {
  try {
    const validatedFields = userSchema.parse(data);

    const existingUser = await db.staff.findFirst({
      where: { username: validatedFields.username },
    });

    if (existingUser) {
      return { error: "User with this username already exists" };
    }

    const user = await db.staff.create({
      data: {
        firstName: validatedFields.firstName,
        lastName: validatedFields.lastName,
        username: validatedFields.username,
        password: "12345678",
        phoneNumber: validatedFields.phoneNumber,
        role: validatedFields.role,
      },
    });

    return { success: "User created successfully", data: user };
  } catch (error) {
    console.error(error);
    return {
      error:
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message: string }).message
          : "Failed to create user",
    };
  }
};

export const updateUser = async (
  id: string,
  data: z.infer<typeof userSchema>
) => {
  try {
    const validatedFields = userSchema.parse(data);

    if (validatedFields.username) {
      const existingUser = await db.staff.findFirst({
        where: { username: validatedFields.username, id: { not: id } },
      });

      if (existingUser) {
        return { error: "User with this username already exists" };
      }
    }

    const user = await db.staff.update({
      where: { id },
      data: validatedFields,
    });

    return { success: "User updated successfully", data: user };
  } catch (error) {
    console.error(error);
    return {
      error:
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message: string }).message
          : "Failed to update user",
    };
  }
};

export const updateUserStatus = async (id: string, isActive: boolean) => {
  try {
    await db.staff.update({
      where: { id },
      data: { isActive },
    });

    return { success: "User status updated successfully" };
  } catch (error) {
    console.error(error);
    return {
      error:
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message: string }).message
          : "Failed to update user status",
    };
  }
};
