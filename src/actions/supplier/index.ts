"use server";

import z from "zod";
import { supplierSchema } from "@/validators/supplier";
import db from "@/lib/db";

export const deleteSupplier = async (id: string) => {
  try {
    await db.supplier.delete({
      where: { id },
    });

    return { success: "Supplier deleted successfully" };
  } catch (error) {
    console.error(error);
    return {
      error:
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message: string }).message
          : "Failed to delete supplier",
    };
  }
};

export const createSupplier = async (data: z.infer<typeof supplierSchema>) => {
  try {
    const validatedFields = supplierSchema.parse(data);

    const existingSupplier = await db.supplier.findFirst({
      where: { name: validatedFields.name },
    });

    if (existingSupplier) {
      return { error: "Supplier with this name already exists" };
    }

    const supplier = await db.supplier.create({
      data: validatedFields,
    });

    return { success: "Supplier created successfully", data: supplier };
  } catch (error) {
    console.error(error);
    return {
      error:
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message: string }).message
          : "Failed to create supplier",
    };
  }
};

export const updateSupplier = async (
  id: string,
  data: z.infer<typeof supplierSchema>
) => {
  try {
    const validatedFields = supplierSchema.parse(data);

    if (validatedFields.name) {
      const existingSupplier = await db.supplier.findFirst({
        where: { name: validatedFields.name, id: { not: id } },
      });

      if (existingSupplier) {
        return { error: "Supplier with this name already exists" };
      }
    }

    const supplier = await db.supplier.update({
      where: { id },
      data: validatedFields,
    });

    return { success: "Supplier updated successfully", data: supplier };
  } catch (error) {
    console.error(error);
    return {
      error:
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message: string }).message
          : "Failed to update supplier",
    };
  }
};

export const getAllSuppliers = async () => {
  try {
    const suppliers = await db.supplier.findMany();
    return { success: "Suppliers fetched successfully", data: suppliers };
  } catch (error) {
    console.error(error);
    return {
      error:
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message: string }).message
          : "Failed to fetch suppliers",
    };
  }
};
