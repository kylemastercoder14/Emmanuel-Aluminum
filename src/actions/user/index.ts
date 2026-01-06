/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import z from "zod";
import db from "@/lib/db";
import { userSchema } from "@/validators/user";
import { quotationSchema } from "@/validators/quotation";
import { sendQuotationToEmail } from "@/hooks/use-email-template";

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

export const updateCustomerStatus = async (id: string, isActive: boolean) => {
  try {
    await db.user.update({
      where: { id },
      data: { isActive },
    });

    return { success: "Customer status updated successfully" };
  } catch (error) {
    console.error(error);
    return {
      error:
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message: string }).message
          : "Failed to update customer status",
    };
  }
};

export const saveSeniorPwdId = async (userId: string, seniorPwdId: string[]) => {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { error: "User not found." };
    }

    // Enforce one-time upload: if already set, do not allow changes
    if (user.seniorPwdId && user.seniorPwdId.length > 0) {
      return {
        error: "Senior/PWD ID has already been uploaded and cannot be changed.",
      };
    }

    await db.user.update({
      where: { id: userId },
      data: {
        isSeniorOrPwd: true,
        seniorPwdId,
      },
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      error: "Failed to save Senior/PWD ID. Please try again.",
    };
  }
};

export const addOrUpdateAddress = async (
  userId: string,
  address: {
    fullName: string;
    phoneNumber: string;
    address: string;
  }
) => {
  try {
    // check if user already has address
    const existingAddress = await db.address.findFirst({
      where: { userId },
    });

    if (existingAddress) {
      // update
      await db.address.update({
        where: { id: existingAddress.id },
        data: {
          fullName: address.fullName,
          phoneNumber: address.phoneNumber,
          address: address.address,
        },
      });
    } else {
      // create
      await db.address.create({
        data: {
          fullName: address.fullName,
          phoneNumber: address.phoneNumber,
          address: address.address,
          userId,
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong!" };
  }
};

export const submitReport = async (
  values: {
    type: string;
    description?: string;
  },
  userId: string,
  conversationId: string
) => {
  try {
    await db.report.create({
      data: {
        type: values.type,
        description: values.description,
        userId,
        conversationId,
      },
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong!" };
  }
};

export const submitQuotation = async (
  data: z.infer<typeof quotationSchema>
) => {
  try {
    const validatedFields = quotationSchema.parse(data);

    const quotation = await db.quotation.create({
      data: {
        firstName: validatedFields.firstName,
        lastName: validatedFields.lastName,
        contactNumber: validatedFields.contactNumber,
        email: validatedFields.email,
        serviceType: validatedFields.serviceType,
        size: validatedFields.size,
        unit: validatedFields.unit,
        color: validatedFields.color || null,
        variants: validatedFields.variants || null,
        description: validatedFields.description || null,
        preferredDate: new Date(
          `${validatedFields.preferredDate}T${validatedFields.preferredTime}`
        ),
      },
    });

    await sendQuotationToEmail(
      quotation.email,
      quotation.firstName,
      quotation.lastName,
      quotation.serviceType,
      quotation.size,
      quotation.unit,
      "PENDING"
    );

    return { success: true, data: quotation };
  } catch (error) {
    console.error("Error submitting quotation:", error);
    return { success: false, error: "Failed to submit quotation." };
  }
};

export const deleteQuotation = async (id: string) => {
  try {
    await db.quotation.delete({
      where: { id },
    });

    return { success: "Quotation deleted successfully" };
  } catch (error) {
    console.error(error);
    return {
      error:
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message: string }).message
          : "Failed to delete quotation",
    };
  }
};

export const updateQuotationStatus = async (
  id: string,
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED",
  note?: string,
  estimatedPrice?: string | number // may come from form as string
) => {
  try {
    // Only update estimatedPrice if provided and status is APPROVED
    const dataToUpdate: any = { status, note };
    if (typeof estimatedPrice !== "undefined" && status === "APPROVED") {
      dataToUpdate.estimatedPrice = parseFloat(String(estimatedPrice));
    }
    const quotation = await db.quotation.update({
      where: { id },
      data: dataToUpdate,
    });

    await sendQuotationToEmail(
      quotation.email,
      quotation.firstName,
      quotation.lastName,
      quotation.serviceType,
      quotation.size,
      quotation.unit,
      status,
      note,
      quotation.estimatedPrice ?? 0 // pass estimated price
    );

    return { success: `Quotation has been ${quotation.status.toLowerCase()}.` };
  } catch (error) {
    console.error("Status update error:", error);
    return { error: "Failed to update quotation status." };
  }
};
