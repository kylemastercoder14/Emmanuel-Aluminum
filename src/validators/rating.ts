import { z } from "zod";

export const serviceRatingSchema = z.object({
  rating: z
    .number()
    .min(1, { message: "Rating must be at least 1" })
    .max(5, { message: "Rating must be at most 5" }),
  comment: z.string().optional(),
  orderItemId: z.string().min(1, { message: "Order item ID is required" }),
});

export const feedbackSchema = z.object({
  type: z.string().min(1, { message: "Feedback type is required" }),
  rating: z
    .number()
    .min(1, { message: "Rating must be at least 1" })
    .max(5, { message: "Rating must be at most 5" }),
  message: z.string().optional(),
});

