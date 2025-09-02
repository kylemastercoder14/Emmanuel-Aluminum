import z from "zod";

export const serviceSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
  images: z
    .array(z.string())
    .min(1, { message: "At least one image is required" }),
  type: z.string().optional(),
  colors: z.array(z.string()).optional(),
  category: z.string().min(1, { message: "Category is required" }),
  price: z.number().min(0, { message: "Price must be at least 0" }),
  materials: z
    .array(z.string())
    .min(1, { message: "At least one material is required" }),
});
