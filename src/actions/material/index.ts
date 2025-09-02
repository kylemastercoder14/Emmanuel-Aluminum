"use server";

import z from "zod";
import { materialSchema } from "@/validators/material";
import db from "@/lib/db";

export const createMaterial = async (data: z.infer<typeof materialSchema>) => {
  try {
    const validatedFields = materialSchema.parse(data);

    const existingMaterial = await db.material.findFirst({
      where: {
        name: validatedFields.name,
        supplierId: validatedFields.supplierId,
      },
    });

    if (existingMaterial) {
      return {
        error: "Material with the same name and supplier already exists",
      };
    }

    const material = await db.material.create({
      data: validatedFields,
    });

    return { success: "Material created successfully", material };
  } catch (error) {
    console.error(error);
    return {
      error:
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message: string }).message
          : "Failed to create material",
    };
  }
};

export const updateMaterial = async (
  id: string,
  data: z.infer<typeof materialSchema>
) => {
  try {
    const validatedFields = materialSchema.parse(data);
    const existingMaterial = await db.material.findFirst({
      where: {
        id,
        name: validatedFields.name,
        supplierId: validatedFields.supplierId,
      },
    });

    if (existingMaterial) {
      return {
        error: "Material with the same name and supplier already exists",
      };
    }

    const material = await db.material.update({
      where: { id },
      data: validatedFields,
    });

    return { success: "Material updated successfully", material };
  } catch (error) {
    console.error(error);
    return {
      error:
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message: string }).message
          : "Failed to update material",
    };
  }
};

export const deleteMaterial = async (id: string) => {
  try {
    const material = await db.material.delete({
      where: { id },
    });

    return { success: "Material deleted successfully", material };
  } catch (error) {
    console.error(error);
    return {
      error:
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message: string }).message
          : "Failed to delete material",
    };
  }
};

export const updateStockQuantity = async (id: string, stock: number) => {
  try {
    const material = await db.material.update({
      where: { id },
      data: { stock },
    });

    return { success: "Stock updated successfully", material };
  } catch (error) {
    console.error(error);
    return {
      error:
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message: string }).message
          : "Failed to update stock",
    };
  }
};
