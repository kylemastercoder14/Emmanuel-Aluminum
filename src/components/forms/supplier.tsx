"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Supplier } from "@prisma/client";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { toast } from "sonner";
import { supplierSchema } from "@/validators/supplier";
import { createSupplier, updateSupplier } from "@/actions/supplier";
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
import { Textarea } from "@/components/ui/textarea";

const SupplierForm = ({ initialData }: { initialData: Supplier | null }) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof supplierSchema>>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: initialData?.name || "",
      address: initialData?.address || "",
      phoneNumber: initialData?.phoneNumber || "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof supplierSchema>) {
    try {
      if (initialData) {
        const response = await updateSupplier(initialData.id, values);

        if (response.success) {
          toast.success("Supplier updated successfully");
          router.push("/admin/inventory/suppliers");
        } else {
          toast.error(
            response.error || "Failed to update supplier. Please try again."
          );
        }
      } else {
        const response = await createSupplier(values);

        if (response.success) {
          toast.success("Supplier created successfully");
          router.push("/admin/inventory/suppliers");
        } else {
          toast.error(
            response.error || "Failed to create supplier. Please try again."
          );
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to process supplier");
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Company name <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter the company name"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>
                  The name of the supplier company.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Company address <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter the company address"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>
                  The address of the supplier company.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Company number <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter the company number"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>
                  The phone number of the supplier company.
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
            {initialData ? "Save changes" : "Create supplier"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default SupplierForm;
