/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import z from "zod";
import { adminSchema, adminProfileSchema, adminPasswordSchema } from "@/validators/admin";
import * as jose from "jose";
import { cookies } from "next/headers";
import db from "@/lib/db";
import jwt from "jsonwebtoken";

const getCurrentStaff = async () => {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("Authorization");

  if (!authToken) return null;

  try {
    const decodedToken = jwt.verify(authToken.value, process.env.JWT_SECRET!) as {
      sub: string;
    };

    const staffId = decodedToken.sub;

    const staff = await db.staff.findUnique({
      where: { id: staffId },
    });

    return staff;
  } catch (error) {
    console.error("Error decoding staff token", error);
    return null;
  }
};

export const signIn = async (values: z.infer<typeof adminSchema>) => {
  const validatedField = adminSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.issues.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { username, password } = validatedField.data;

  try {
    const user = await db.staff.findFirst({
      where: {
        username,
        password,
      },
    });

    if (!user) {
      return { error: "User not found." };
    }

    if (!user.isActive) {
      return { error: "User is not active." };
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const alg = "HS256";

    const jwt = await new jose.SignJWT({})
      .setProtectedHeader({ alg })
      .setExpirationTime("72h")
      .setSubject(user.id.toString())
      .sign(secret);

    (
      await // Set the cookie with the JWT
      cookies()
    ).set("Authorization", jwt, {
      httpOnly: true, // Set to true for security
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 60 * 60 * 24 * 3, // Cookie expiration (3 days in seconds)
      sameSite: "strict", // Adjust according to your needs
      path: "/", // Adjust path as needed
    });

    return { success: "Login successful", role: user.role };
  } catch (error: any) {
    console.error("Error logging in user", error);
    return {
      error: `Failed to log in user. Please try again. ${error.message || ""}`,
    };
  }
};

export const updateStaffProfile = async (
  values: z.infer<typeof adminProfileSchema>
) => {
  const validated = adminProfileSchema.safeParse(values);

  if (!validated.success) {
    const errors = validated.error.issues.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const staff = await getCurrentStaff();

  if (!staff) {
    return { error: "Unauthorized" };
  }

  const { firstName, lastName, username, phoneNumber, image } = validated.data;

  // Ensure username is unique across staff (excluding current)
  const existingWithUsername = await db.staff.findFirst({
    where: {
      username,
      NOT: { id: staff.id },
    },
  });

  if (existingWithUsername) {
    return { error: "Username is already taken" };
  }

  await db.staff.update({
    where: { id: staff.id },
    data: {
      firstName,
      lastName,
      username,
      phoneNumber,
      image: image || null,
    },
  });

  return { success: "Profile updated successfully" };
};

export const updateStaffPassword = async (
  values: z.infer<typeof adminPasswordSchema>
) => {
  const validated = adminPasswordSchema.safeParse(values);

  if (!validated.success) {
    const errors = validated.error.issues.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const staff = await getCurrentStaff();

  if (!staff) {
    return { error: "Unauthorized" };
  }

  const { currentPassword, newPassword } = validated.data;

  if (staff.password !== currentPassword) {
    return { error: "Current password is incorrect" };
  }

  await db.staff.update({
    where: { id: staff.id },
    data: {
      password: newPassword,
    },
  });

  return { success: "Password updated successfully" };
};
