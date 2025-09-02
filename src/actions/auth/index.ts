/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import z from "zod";
import {
  emailVerificationSchema,
  loginSchema,
  registerSchema,
} from "@/validators/auth";
import db from "@/lib/db";
import bcryptjs from "bcryptjs";
import * as jose from "jose";
import { cookies } from "next/headers";
import { sendAccountToEmail } from "@/hooks/use-email-template";

export const signUp = async (values: z.infer<typeof registerSchema>) => {
  const validatedField = registerSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.issues.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { name, phoneNumber, email, password, confirmPassword } =
    validatedField.data;

  try {
    const existingUser = await db.user.findFirst({
      where: {
        email,
      },
    });

    if (existingUser) {
      return { error: "User already exists." };
    }

    if (password !== confirmPassword) {
      return { error: "Passwords do not match." };
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    // 6 digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000);

    await db.user.create({
      data: {
        name,
        email,
        phoneNumber,
        password: hashedPassword,
        otpCode: otpCode.toString(),
      },
    });

    await sendAccountToEmail(email, name, otpCode);

    return { success: "User registered successfully", email };
  } catch (error: any) {
    console.error("Error registering user", error);
    return {
      error: `Failed to register user. Please try again. ${error.message || ""}`,
    };
  }
};

export const verifyEmail = async (
  values: z.infer<typeof emailVerificationSchema>,
  email: string
) => {
  const validatedField = emailVerificationSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.issues.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { otpCode } = validatedField.data;

  try {
    const user = await db.user.findFirst({
      where: {
        otpCode,
        email,
      },
    });

    if (!user) {
      return { error: "Invalid OTP code." };
    }

    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        isEmailVerified: true,
        otpCode: null,
      },
    });

    return { success: "Email verified successfully." };
  } catch (error: any) {
    console.error("Error verifying email", error);
    return {
      error: `Failed to verify email. Please try again. ${error.message || ""}`,
    };
  }
};

export const resendOtpCode = async (email: string) => {
  try {
    const user = await db.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return { error: "User not found." };
    }

    // Generate a new OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000);

    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        otpCode: otpCode.toString(),
      },
    });

    await sendAccountToEmail(email, user.name, otpCode);

    return { success: "OTP code resent successfully." };
  } catch (error: any) {
    console.error("Error resending OTP code", error);
    return {
      error: `Failed to resend OTP code. Please try again. ${error.message || ""}`,
    };
  }
};

export const signIn = async (values: z.infer<typeof loginSchema>) => {
  const validatedField = loginSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.issues.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { email, password } = validatedField.data;

  try {
    const user = await db.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return { error: "User not found." };
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return { error: "Invalid password." };
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

export const signOut = async () => {
  (await cookies()).set("Authorization", "", { maxAge: 0, path: "/" });
};
