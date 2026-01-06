/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import z from "zod";
import {
  changePasswordSchema,
  emailVerificationSchema,
  loginSchema,
  registerSchema,
  updateProfileSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/validators/auth";
import db from "@/lib/db";
import bcryptjs from "bcryptjs";
import * as jose from "jose";
import { cookies } from "next/headers";
import { sendAccountToEmail, sendPasswordResetEmail } from "@/hooks/use-email-template";
import { getUserIdFromToken } from "@/lib/auth";

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

    if (!user.isEmailVerified) {
      return { error: "Please verify your email first" };
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

export const updateProfile = async (
  values: z.infer<typeof updateProfileSchema>
) => {
  const validatedField = updateProfileSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.issues.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const userId = await getUserIdFromToken();

  if (!userId) {
    return { error: "Unauthorized" };
  }

  const { name, phoneNumber, email } = validatedField.data;

  try {
    // ensure email is unique if changed
    const existingUserWithEmail = await db.user.findFirst({
      where: {
        email,
        id: { not: userId },
      },
    });

    if (existingUserWithEmail) {
      return { error: "Email is already in use" };
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        name,
        phoneNumber,
        email,
      },
    });

    return { success: "Profile updated successfully", data: updatedUser };
  } catch (error: any) {
    console.error("Error updating profile", error);
    return {
      error: `Failed to update profile. Please try again. ${error.message || ""}`,
    };
  }
};

export const changePassword = async (
  values: z.infer<typeof changePasswordSchema>
) => {
  const validatedField = changePasswordSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.issues.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const userId = await getUserIdFromToken();

  if (!userId) {
    return { error: "Unauthorized" };
  }

  const { currentPassword, newPassword } = validatedField.data;

  try {
    const user = await db.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      return { error: "User not found." };
    }

    const isPasswordValid = await bcryptjs.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return { error: "Current password is incorrect" };
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    await db.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });

    return { success: "Password updated successfully" };
  } catch (error: any) {
    console.error("Error changing password", error);
    return {
      error: `Failed to change password. Please try again. ${error.message || ""}`,
    };
  }
};

export const requestPasswordReset = async (
  values: z.infer<typeof forgotPasswordSchema>
) => {
  const validatedField = forgotPasswordSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.issues.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { email } = validatedField.data;

  try {
    const user = await db.user.findFirst({
      where: { email },
    });

    // For security, don't reveal whether the email exists
    if (!user) {
      return {
        success:
          "If an account with that email exists, a verification code has been sent.",
      };
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000);

    await db.user.update({
      where: { id: user.id },
      data: {
        otpCode: otpCode.toString(),
      },
    });

    await sendPasswordResetEmail(email, user.name, otpCode);

    return {
      success:
        "If an account with that email exists, a verification code has been sent.",
    };
  } catch (error: any) {
    console.error("Error requesting password reset", error);
    return {
      error: `Failed to request password reset. Please try again. ${error.message || ""}`,
    };
  }
};

export const resetPassword = async (
  values: z.infer<typeof resetPasswordSchema>,
  email: string
) => {
  const validatedField = resetPasswordSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.issues.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { otpCode, newPassword } = validatedField.data;

  try {
    const user = await db.user.findFirst({
      where: {
        email,
        otpCode,
      },
    });

    if (!user) {
      return { error: "Invalid verification code." };
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    await db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        otpCode: null,
      },
    });

    return { success: "Password has been reset successfully." };
  } catch (error: any) {
    console.error("Error resetting password", error);
    return {
      error: `Failed to reset password. Please try again. ${error.message || ""}`,
    };
  }
};

export const signOut = async () => {
  (await cookies()).set("Authorization", "", { maxAge: 0, path: "/" });
};
