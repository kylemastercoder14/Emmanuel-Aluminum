"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { toast } from "sonner";
import { materialSchema } from "@/validators/material";
import { createMaterial, updateMaterial } from "@/actions/material";
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
import { MaterialWithSupplier } from "@/types/interface";
import ImageUpload from "@/components/globals/image-upload";
import { UNITS } from "@/constants";
import {
  InputSelect,
  InputSelectTrigger,
} from "@/components/globals/input-select";
import { Supplier } from '@prisma/client';

const MaterialForm = ({
  initialData,
  suppliers
}: {
  initialData: MaterialWithSupplier | null;
  suppliers: Supplier[]
}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof materialSchema>>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      image: initialData?.image || "",
      unit: initialData?.unit || "",
      price: initialData?.price || 0,
      stock: initialData?.stock || 0,
      supplierId: initialData?.supplierId || "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof materialSchema>) {
    try {
      if (initialData) {
        const response = await updateMaterial(initialData.id, values);

        if (response.success) {
          toast.success("Material updated successfully");
          router.push("/admin/inventory/materials");
        } else {
          toast.error(
            response.error || "Failed to update material. Please try again."
          );
        }
      } else {
        const response = await createMaterial(values);

        if (response.success) {
          toast.success("Material created successfully");
          router.push("/admin/inventory/materials");
        } else {
          toast.error(
            response.error || "Failed to create material. Please try again."
          );
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to process material");
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
                  Material name <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter the material name"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>The name of the material.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="supplierId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Supplier <span className="text-red-600">*</span>
                </FormLabel>
                <InputSelect
                  options={suppliers.map((supplier) => ({
                    label: supplier.name,
                    value: supplier.id,
                  }))}
                  className="w-[1590px]"
                  value={field.value}
                  placeholder="Select a supplier"
                  onValueChange={field.onChange}
				  disabled={isSubmitting}
                  clearable
                >
                  {(provided) => <InputSelectTrigger {...provided} />}
                </InputSelect>
                <FormDescription>
                  The supplier of the material.
                </FormDescription>
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
                  Material description{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter the material description"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>
                  The description of the material.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid lg:grid-cols-3 grid-cols-1 gap-5">
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Unit <span className="text-red-600">*</span>
                  </FormLabel>
                  <InputSelect
                    options={UNITS.map((unit) => ({
                      label: unit,
                      value: unit,
                    }))}
                    className="w-[515px]"
                    value={field.value}
                    placeholder="Select a unit"
                    onValueChange={field.onChange}
					disabled={isSubmitting}
                    clearable
                  >
                    {(provided) => <InputSelectTrigger {...provided} />}
                  </InputSelect>
                  <FormDescription>
                    The unit of measurement of the material.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Unit Price <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the unit price"
                      {...field}
                      disabled={isSubmitting}
					  onChange={(e) => {
                        const value = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
                        field.onChange(value);
                      }}
					  type='number'
					  step="0.01"
                    />
                  </FormControl>
                  <FormDescription>
                    The unit price of the material.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Stock <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the initial stock"
                      {...field}
                      disabled={isSubmitting}
					  onChange={(e) => {
                        const value = e.target.value === '' ? 0 : parseInt(e.target.value) || 0;
                        field.onChange(value);
                      }}
					  type='number'
					  step="1"
                    />
                  </FormControl>
                  <FormDescription>
                    The initial stock of the material. This will be updated
                    later.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Material Image{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </FormLabel>
                <FormControl>
                  <ImageUpload onUploadComplete={field.onChange} defaultValue={field.value || ''} />
                </FormControl>
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
            {initialData ? "Save changes" : "Create material"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default MaterialForm;
