"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { feedbackSchema } from "@/validators/rating";
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
import { StarRating } from "@/components/ui/star-rating";
import z from "zod";

interface FeedbackFormProps {
  onClose: () => void;
}

const FeedbackForm = ({ onClose }: FeedbackFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      type: "",
      rating: 5,
      message: "",
    },
  });

  const rating = form.watch("rating");

  async function onSubmit(values: z.infer<typeof feedbackSchema>) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Feedback submitted successfully!");
        router.refresh();
        form.reset();
        onClose();
      } else {
        toast.error(data.error || "Failed to submit feedback. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while submitting feedback.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <p className="text-sm text-gray-600 mb-4">
            We'd love to hear your feedback about our service!
          </p>
        </div>

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Feedback Type <span className="text-red-600">*</span>
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select feedback type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="!z-[150]">
                  <SelectItem value="Service Quality">Service Quality</SelectItem>
                  <SelectItem value="Customer Service">Customer Service</SelectItem>
                  <SelectItem value="Overall Experience">Overall Experience</SelectItem>
                  <SelectItem value="Product Quality">Product Quality</SelectItem>
                  <SelectItem value="Delivery/Installation">Delivery/Installation</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Rating <span className="text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <StarRating
                  rating={field.value}
                  onRatingChange={field.onChange}
                  size={32}
                />
              </FormControl>
              <FormDescription>
                Click on the stars to select your rating (1-5 stars)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Message{" "}
                <span className="text-muted-foreground">(optional)</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your thoughts, suggestions, or concerns..."
                  {...field}
                  disabled={isSubmitting}
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end gap-2">
          <Button
            disabled={isSubmitting}
            onClick={onClose}
            type="button"
            variant="ghost"
          >
            Cancel
          </Button>
          <Button variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FeedbackForm;

