"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { toast } from "sonner";
import { reportSchema } from "@/validators/report";
import { submitReport } from "@/actions/user";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const ReportForm = ({
  conversationId,
  userId,
  onClose
}: {
  conversationId: string;
  userId: string;
  onClose?: () => void;
}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof reportSchema>>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      type: "",
      description: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof reportSchema>) {
    try {
      const response = await submitReport(values, userId, conversationId);

      if (response.success) {
        toast.success("Report submitted successfully");
        router.refresh();
        onClose?.();
      } else {
        toast.error(
          response.error || "Failed to create supplier. Please try again."
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to report issue. Please try again.");
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Type <span className="text-red-600">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type of issue" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="!z-[150]">
                    <SelectItem value="Harrasment">Harrasment</SelectItem>
                    <SelectItem value="Suicide or self-injury">
                      Suicide or self-injury
                    </SelectItem>
                    <SelectItem value="Nudity or sexual activity">
                      Nudity or sexual activity
                    </SelectItem>
                    <SelectItem value="Violent or graphic content">
                      Violent or graphic content
                    </SelectItem>
                    <SelectItem value="Promoting restricted items">
                      Promoting restricted items
                    </SelectItem>
                    <SelectItem value="Scam or fraud">Scam or fraud</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Description{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter the description"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>
                  Please provide a brief description of the issue.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex items-center justify-end mt-3 gap-2">
          <Button
            disabled={isSubmitting}
            onClick={() => router.back()}
            type="button"
            variant="ghost"
          >
            Cancel
          </Button>
          <Button variant="primary" disabled={isSubmitting}>
            Submit report
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default ReportForm;
