"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Staff } from "@prisma/client";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { toast } from "sonner";
import { userSchema } from "@/validators/user";
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
import { ROLES } from "@/constants";
import { createUser, updateUser } from "@/actions/user";

const UserForm = ({ initialData }: { initialData: Staff | null }) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      username: initialData?.username || "",
      phoneNumber: initialData?.phoneNumber || "",
      role: initialData?.role || "Staff",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof userSchema>) {
    try {
      if (initialData) {
        const response = await updateUser(initialData.id, values);

        if (response.success) {
          toast.success("User updated successfully");
          router.push("/admin/users");
        } else {
          toast.error(
            response.error || "Failed to update user. Please try again."
          );
        }
      } else {
        const response = await createUser(values);

        if (response.success) {
          toast.success("User created successfully");
          router.push("/admin/users");
        } else {
          toast.error(
            response.error || "Failed to create user. Please try again."
          );
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to process user");
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <p>
          <strong>Note:</strong> The password by default is{" "}
          <strong className="text-red-600">&quot;12345678&quot;</strong>, the
          user can change it after logging in.
        </p>
        <div className="space-y-6 mt-5">
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    First name <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the first name"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>The first name of the user.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Last name <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the last name"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>The last name of the user.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Username <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter the username"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>
                  The username of the user. Make it unique
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
                  Phone number <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter the phone number"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>The phone number of the user.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Role <span className="text-red-600">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>The role of the user.</FormDescription>
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
            {initialData ? "Save changes" : "Create user"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default UserForm;
