import z from "zod";

export const materialSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
  image: z.string().optional(),
  unit: z.string().min(1, { message: "Unit is required" }),
  price: z.number().min(0, { message: "Price must be at least 0" }),
  stock: z.number().min(0, { message: "Stock must be at least 0" }),
  supplierId: z.string().min(1, { message: "Supplier is required" }),
});
