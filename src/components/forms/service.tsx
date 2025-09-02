"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { toast } from "sonner";
import { serviceSchema } from "@/validators/service";
import { createService, updateService } from "@/actions/service";
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
import { ServiceWithMaterials } from "@/types/interface";
import {
  InputSelect,
  InputSelectTrigger,
} from "@/components/globals/input-select";
import { Material } from "@prisma/client";
import { TagsInput } from "@/components/globals/tags-input";
import {
  InputMultiSelect,
  InputMultiSelectTrigger,
} from "@/components/globals/input-multiselect";
import MultipleImageUpload from "@/components/globals/multiple-image-upload";

const ServiceForm = ({
  initialData,
  materials,
}: {
  initialData: ServiceWithMaterials | null;
  materials: Material[];
}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      images: initialData?.images || [],
      type: initialData?.type || "",
      price: initialData?.price || 0,
      colors: initialData?.colors || [],
      category: initialData?.category || "",
      materials: initialData?.materials.map((material) => material.id) || [],
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof serviceSchema>) {
    try {
      if (initialData) {
        const response = await updateService(initialData.id, values);

        if (response.success) {
          toast.success("Service updated successfully");
          router.push("/admin/service-listings");
        } else {
          toast.error(
            response.error || "Failed to update service. Please try again."
          );
        }
      } else {
        const response = await createService(values);

        if (response.success) {
          toast.success("Service created successfully");
          router.push("/admin/service-listings");
        } else {
          toast.error(
            response.error || "Failed to create service. Please try again."
          );
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to process service");
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
                  Service name <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter the service name"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>The name of the service.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Category <span className="text-red-600">*</span>
                  </FormLabel>
                  <InputSelect
                    options={[
                      "Window",
                      "Door",
                      "Cabinet",
                      "Tempered Glass",
                    ].map((option) => ({
                      value: option,
                      label: option,
                    }))}
                    className="w-[785px]"
                    value={field.value}
                    placeholder="Select a category"
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                    clearable
                  >
                    {(provided) => <InputSelectTrigger {...provided} />}
                  </InputSelect>
                  <FormDescription>
                    The category of the service.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Service type{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the service type"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>The type of the service.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Service description{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter the service description"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>
                  The description of the service.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
            <FormField
              control={form.control}
              name="colors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Colors <span className="text-red-600">*</span>
                  </FormLabel>
                  <TagsInput
                    onValueChange={field.onChange}
                    value={field.value || []}
                    placeholder="Enter colors (e.g. White frame, Black frame)"
                  />
                  <FormDescription>
                    The colors of the service. Press enter to add more.
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
                    Price <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the price"
                      {...field}
                      disabled={isSubmitting}
                      onChange={(e) => {
                        const value =
                          e.target.value === ""
                            ? 0
                            : parseFloat(e.target.value) || 0;
                        field.onChange(value);
                      }}
                      type="number"
                      step="0.01"
                    />
                  </FormControl>
                  <FormDescription>The price of the service.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="materials"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Materials Used <span className="text-red-600">*</span>
                </FormLabel>
                <InputMultiSelect
                  options={materials.map((option) => ({
                    value: option.id,
                    label: option.name,
                  }))}
                  className="w-[1593px]"
                  value={field.value || []}
                  placeholder="Select materials of this service"
                  onValueChange={field.onChange}
                  disabled={isSubmitting}
                >
                  {(provided) => <InputMultiSelectTrigger {...provided} />}
                </InputMultiSelect>
                <FormDescription>
                  The materials of this service.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Service Image{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </FormLabel>
                <FormControl>
                  <MultipleImageUpload
                    onUploadComplete={field.onChange}
                    defaultValues={field.value
                      ?.map((file: File | string) => {
                        if (typeof file === "string") return file;
                        if (file instanceof File)
                          return URL.createObjectURL(file);
                        return ""; // or skip
                      })
                      .filter(Boolean)}
                    maxImages={4}
                  />
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
            {initialData ? "Save changes" : "Create service"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default ServiceForm;
