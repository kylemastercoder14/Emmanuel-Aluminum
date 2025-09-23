"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { quotationSchema } from "@/validators/quotation";
import { submitQuotation } from "@/actions/user";
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
import { Input } from "@/components/ui/input";
import z from "zod";

const QuotationForm = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof quotationSchema>>({
    resolver: zodResolver(quotationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      contactNumber: "",
      email: "",
      serviceType: "Window",
      size: "",
      unit: "INCH",
      color: "",
      variants: "",
      description: "",
      preferredDate: "",
      preferredTime: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof quotationSchema>) {
    try {
      const response = await submitQuotation(values);

      if (response.success) {
        toast.success("Quotation submitted successfully!");
        router.refresh();
		form.reset();
      } else {
        toast.error(response.error || "Failed to submit quotation.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form
        className="max-w-5xl w-full space-y-6 mx-auto"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="grid lg:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
          <FormField
            control={form.control}
            name="contactNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter contact number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="serviceType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Window">Window</SelectItem>
                  <SelectItem value="Door">Door</SelectItem>
                  <SelectItem value="Cabinet">Cabinet</SelectItem>
                  <SelectItem value="Tempered Glass">Tempered Glass</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Size</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 48 x 72" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="INCH">Inch</SelectItem>
                    <SelectItem value="CM">Centimeter</SelectItem>
                    <SelectItem value="FT">Feet</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <FormControl>
                <Input placeholder="e.g. brown, clear, black" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="variants"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Variants</FormLabel>
              <FormControl>
                <Input placeholder="e.g. frosted, tinted" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel>Description / Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter additional notes" {...field} />
              </FormControl>
			  <FormDescription>
				Please provide additional information here
			  </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid lg:grid-cols-2 gap-4 mt-4">
          <FormField
            control={form.control}
            name="preferredDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="preferredTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          Submit Quotation
        </Button>
      </form>
    </Form>
  );
};

export default QuotationForm;
