/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Orders, Task, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { toast } from "sonner";
import { taskSchema } from "@/validators/task";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InputSelect, InputSelectTrigger } from "@/components/globals/input-select";
import { createTask, updateTask } from "@/actions/task";
import { formatDateTimeLocal } from "@/lib/utils";

type ScheduledOrder = Orders & { user: User };
type Customer = User;

const TaskForm = ({
  initialData,
  selectedDate,
  onClose,
  scheduledOrders,
  customers,
}: {
  initialData: Task | null;
  selectedDate?: string | null;
  onClose: () => void;
  scheduledOrders: ScheduledOrder[];
  customers: Customer[];
}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      subject: initialData?.subject || "",
      startDate: initialData?.startDate
        ? formatDateTimeLocal(new Date(initialData.startDate))
        : selectedDate || "",
      endDate: initialData?.endDate
        ? formatDateTimeLocal(new Date(initialData.endDate))
        : "",
      status: initialData?.status || "",
      priority: initialData?.priority || "",
      // these will exist once Task is migrated; fallback keeps older tasks working
      customerId: (initialData as any)?.customerId || "",
      orderId: (initialData as any)?.orderId || "",
    },
  });

  const { isSubmitting } = form.formState;

  const selectedCustomerId = form.watch("customerId");

  // All customers (e.g. all 41), regardless of whether they currently have scheduled orders
  const allCustomers = React.useMemo(() => customers, [customers]);

  const customerOrders = React.useMemo(
    () =>
      scheduledOrders.filter((order) => order.userId === selectedCustomerId),
    [scheduledOrders, selectedCustomerId]
  );

  async function onSubmit(values: z.infer<typeof taskSchema>) {
    try {
      if (initialData) {
        const response = await updateTask(initialData.id, values, selectedDate);

        if (response.success) {
          toast.success("Task updated successfully");
          router.push("/admin/project-tracking");
          onClose();
        } else {
          toast.error(
            response.error || "Failed to update task. Please try again."
          );
        }
      } else {
        const response = await createTask(values, selectedDate);

        if (response.success) {
          toast.success("Task created successfully");
          router.push("/admin/project-tracking");
          onClose();
        } else {
          toast.error(
            response.error || "Failed to create task. Please try again."
          );
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to process task");
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Subject <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter the subject"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>The subject of the task.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Start Date <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      placeholder="Enter the start date"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>The start date of the task.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    End Date <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      placeholder="Enter the end date"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>The end date of the task.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Status <span className="text-red-600">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>The status of the task.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Priority <span className="text-red-600">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>The priority of the task.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Customer selection with searchable Command */}
          <FormField
            control={form.control}
            name="customerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Customer <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <InputSelect className='lg:w-[500px] w-full'
                    options={allCustomers.map((customer) => ({
                      value: customer.id,
                      label: `${customer.name} (${customer.email})`,
                    }))}
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue("orderId", "");
                    }}
                    placeholder="Search customer..."
                  >
                    {({ selectedValue, options, ...inputProps }) => (
                      <InputSelectTrigger
                        {...inputProps}
                        options={options}
                        selectedValue={selectedValue}
                        clearable
                        className="w-full"
                      >
                        {(option) => <span>{option.label}</span>}
                      </InputSelectTrigger>
                    )}
                  </InputSelect>
                </FormControl>
                <FormDescription>
                  Search and select the customer to link this task to.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Orders for selected customer */}
          <FormField
            control={form.control}
            name="orderId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Scheduled Orders <span className="text-red-600">*</span>
                </FormLabel>

                {!selectedCustomerId ? (
                  <p className="text-sm text-muted-foreground">
                    Select a customer first to see their scheduled orders.
                  </p>
                ) : customerOrders.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    This customer has no orders with status "Scheduled".
                  </p>
                ) : (
                  <div className="mt-2 border rounded-md overflow-hidden">
                    <table className="min-w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-3 py-2 text-left">Select</th>
                          <th className="px-3 py-2 text-left">Order #</th>
                          <th className="px-3 py-2 text-left">Amount</th>
                          <th className="px-3 py-2 text-left">Scheduled Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customerOrders.map((order) => (
                          <tr key={order.id} className="border-t">
                            <td className="px-3 py-2">
                              <input
                                type="radio"
                                name="selectedOrder"
                                className="h-4 w-4"
                                value={order.id}
                                checked={field.value === order.id}
                                onChange={() => field.onChange(order.id)}
                              />
                            </td>
                            <td className="px-3 py-2 font-medium">
                              {order.orderId}
                            </td>
                            <td className="px-3 py-2">
                              ₱{order.totalAmount.toLocaleString()}
                            </td>
                            <td className="px-3 py-2 text-xs">
                              {order.scheduledDate && order.scheduledTime
                                ? `${order.scheduledDate} ${order.scheduledTime}`
                                : "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <FormDescription>
                  Only orders with status "Scheduled" are shown; choose one to link
                  this task to that project.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex items-center justify-end mt-3 gap-2">
          <Button variant="primary" disabled={isSubmitting}>
            {initialData ? "Save changes" : "Create task"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default TaskForm;
