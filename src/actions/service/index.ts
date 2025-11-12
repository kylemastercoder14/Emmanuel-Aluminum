"use server";

import z from "zod";
import { serviceSchema } from "@/validators/service";
import db from "@/lib/db";

export const createService = async (data: z.infer<typeof serviceSchema>) => {
  try {
    const validatedFields = serviceSchema.parse(data);

    const existingService = await db.service.findFirst({
      where: {
        name: validatedFields.name,
      },
    });

    if (existingService) {
      return {
        error: "Service with the same name already exists",
      };
    }

    const service = await db.service.create({
      data: {
        ...validatedFields,
        materials: {
          connect: validatedFields.materials.map((id: string) => ({ id })),
        },
      },
    });

    return { success: "Service created successfully", service };
  } catch (error) {
    console.error(error);
    return {
      error:
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message: string }).message
          : "Failed to create service",
    };
  }
};

export const updateService = async (
  id: string,
  data: z.infer<typeof serviceSchema>
) => {
  try {
    const validatedFields = serviceSchema.parse(data);

    const existingService = await db.service.findFirst({
      where: {
        id: { not: id },
        name: validatedFields.name,
      },
    });

    if (existingService) {
      return {
        error: "Service with the same name already exists",
      };
    }

    const service = await db.service.update({
      where: { id },
      data: {
        ...validatedFields,
        materials: {
          set: validatedFields.materials.map((id: string) => ({ id })),
        },
      },
    });

    return { success: "Service updated successfully", service };
  } catch (error) {
    console.error(error);
    return {
      error:
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message: string }).message
          : "Failed to update service",
    };
  }
};

export const deleteService = async (id: string) => {
  try {
    const service = await db.service.delete({
      where: { id },
    });

    return { success: "Service deleted successfully", service };
  } catch (error) {
    console.error(error);
    return {
      error:
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message: string }).message
          : "Failed to delete service",
    };
  }
};

export const updateServiceStatus = async (id: string, isAvailable: boolean) => {
  try {
    const service = await db.service.update({
      where: { id },
      data: { isAvailable },
    });

    return { success: "Service status updated successfully", service };
  } catch (error) {
    console.error(error);
    return {
      error:
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message: string }).message
          : "Failed to update service status",
    };
  }
};

export const updateServiceHistoryStatus = async (
  id: string,
  isAvailable: boolean
) => {
  try {
    const service = await db.orders.update({
      where: { id },
      data: { isActive: isAvailable },
    });

    return { success: "Service history status updated successfully", service };
  } catch (error) {
    console.error(error);
    return {
      error:
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message: string }).message
          : "Failed to update service history status",
    };
  }
};

export const updateServiceQuotationStatus = async (
  id: string,
  isAvailable: boolean
) => {
  try {
    const service = await db.quotation.update({
      where: { id },
      data: { isActive: isAvailable },
    });

    return {
      success: "Service quotation status updated successfully",
      service,
    };
  } catch (error) {
    console.error(error);
    return {
      error:
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message: string }).message
          : "Failed to update service quotation status",
    };
  }
};
