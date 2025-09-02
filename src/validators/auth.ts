import { z } from "zod";

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

    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .max(20, { message: "Password must be at most 20 characters long" }),

    confirmPassword: z
      .string()
      .min(6, {
        message: "Confirm Password must be at least 6 characters long",
      })
      .max(20, {
        message: "Confirm Password must be at most 20 characters long",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"], // error will show under confirmPassword
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
    .max(20, { message: "Password must be at most 20 characters long" }),
});
