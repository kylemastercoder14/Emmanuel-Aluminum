import { z } from "zod";

export const quotationSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  contactNumber: z.string().min(7, "Contact number is required"),
  email: z.string().email("Invalid email"),
  serviceType: z.string().min(1, "Type is required"),
  size: z.string().min(1, "Size is required"),
  unit: z.enum(["INCH", "CM", "FT"]),
  color: z.string().optional(),
  variants: z.string().optional(),
  description: z.string().optional(),
  preferredDate: z.string().min(1, "Preferred date is required"),
  preferredTime: z.string().min(1, "Preferred time is required"),
});
