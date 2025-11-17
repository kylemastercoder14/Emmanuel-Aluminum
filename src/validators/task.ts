import z from "zod";

export const taskSchema = z.object({
  subject: z.string().min(1, { message: "Subject is required" }),
  startDate: z.string().min(1, { message: "Start date is required" }),
  endDate: z.string().min(1, { message: "End date is required" }),
  status: z.string().min(1, { message: "Status is required" }),
  priority: z.string().min(1, { message: "Priority is required" }),
  customerId: z.string().min(1, { message: "Customer is required" }),
  orderId: z.string().min(1, { message: "Order is required" }),
});
