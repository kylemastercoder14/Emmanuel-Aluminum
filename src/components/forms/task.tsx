"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Task } from "@prisma/client";
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
import { createTask, updateTask } from "@/actions/task";
import { formatDateTimeLocal } from '@/lib/utils';

const TaskForm = ({
  initialData,
  selectedDate,
  onClose
}: {
  initialData: Task | null;
  selectedDate?: string | null;
  onClose: () => void;
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
    },
  });

  const { isSubmitting } = form.formState;

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
