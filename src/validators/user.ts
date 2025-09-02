import z from "zod";

export const userSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  username: z.string().min(1, { message: "Username is required" }),
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
  role: z.string().min(1, { message: "Role is required" }),
});
