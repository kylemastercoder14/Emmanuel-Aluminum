/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import z from "zod";
import { adminSchema } from "@/validators/admin";
import * as jose from "jose";
import { cookies } from "next/headers";
import db from "@/lib/db";

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

    return { success: "Login successful" };
  } catch (error: any) {
    console.error("Error logging in user", error);
    return {
      error: `Failed to log in user. Please try again. ${error.message || ""}`,
    };
  }
};
