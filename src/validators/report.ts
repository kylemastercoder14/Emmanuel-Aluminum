import z from "zod";

export const reportSchema = z.object({
  type: z.string().min(1, { message: "Type is required" }),
  description: z.string().optional(),
});
