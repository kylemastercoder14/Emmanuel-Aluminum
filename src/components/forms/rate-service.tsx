"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { serviceRatingSchema } from "@/validators/rating";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/components/ui/star-rating";
import z from "zod";

interface RateServiceFormProps {
  orderItemId: string;
  serviceName: string;
  onClose: () => void;
}

const RateServiceForm = ({
  orderItemId,
  serviceName,
  onClose,
}: RateServiceFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof serviceRatingSchema>>({
    resolver: zodResolver(serviceRatingSchema),
    defaultValues: {
      rating: 5,
      comment: "",
      orderItemId,
    },
  });

  const rating = form.watch("rating");

  async function onSubmit(values: z.infer<typeof serviceRatingSchema>) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/ratings/service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Service rated successfully!");
        router.refresh();
        onClose();
      } else {
        toast.error(data.error || "Failed to rate service. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while rating the service.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <p className="text-sm text-gray-600 mb-4">
            Rate your experience with: <strong>{serviceName}</strong>
          </p>
        </div>

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
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Comment{" "}
                <span className="text-muted-foreground">(optional)</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your experience with this service..."
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
            {isSubmitting ? "Submitting..." : "Submit Rating"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RateServiceForm;

