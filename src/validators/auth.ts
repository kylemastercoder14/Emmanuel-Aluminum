import { z } from "zod";

// Strong password rule:
// - At least 8 characters
// - At least one uppercase letter
// - At least one lowercase letter
// - At least one digit
// - At least one special character
const strongPasswordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .max(64, { message: "Password must be at most 64 characters long" })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter",
  })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  })
  .regex(/\d/, {
    message: "Password must contain at least one number",
  })
  .regex(/[^A-Za-z0-9]/, {
    message: "Password must contain at least one special character",
  });

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Name is required" })
      .max(100, { message: "Name must be at most 100 characters long" }),

    phoneNumber: z
      .string()
      .min(10, { message: "Phone number must be at least 10 digits long" })
      .max(15, { message: "Phone number must be at most 15 digits long" }),
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email address" }),

    password: strongPasswordSchema,

    confirmPassword: strongPasswordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"], // error will show under confirmPassword
    message: "Passwords must match",
  });

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be at most 100 characters long" }),
  phoneNumber: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits long" })
    .max(15, { message: "Phone number must be at most 15 characters long" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, { message: "Current password must be at least 6 characters long" })
      .max(64, { message: "Current password must be at most 64 characters long" }),
    newPassword: strongPasswordSchema,
    confirmNewPassword: strongPasswordSchema,
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Passwords must match",
  });

export const emailVerificationSchema = z.object({
  otpCode: z
    .string()
    .min(1, { message: "OTP code is required" })
    .max(6, { message: "OTP code must be at most 6 characters long" }),
});

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(64, { message: "Password must be at most 64 characters long" }),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
});

export const resetPasswordSchema = z
  .object({
    otpCode: z
      .string()
      .min(1, { message: "Verification code is required" })
      .max(6, { message: "Verification code must be at most 6 characters long" }),
    newPassword: strongPasswordSchema,
    confirmNewPassword: strongPasswordSchema,
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Passwords must match",
  });
