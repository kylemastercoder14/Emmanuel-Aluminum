"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Staff } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/globals/image-upload";
import { adminProfileSchema, adminPasswordSchema } from "@/validators/admin";
import { updateStaffProfile, updateStaffPassword } from "@/actions/admin";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const StaffAccountForm = ({ staff }: { staff: Staff }) => {
  const router = useRouter();

  const profileForm = useForm<z.infer<typeof adminProfileSchema>>({
    resolver: zodResolver(adminProfileSchema),
    defaultValues: {
      firstName: staff.firstName,
      lastName: staff.lastName,
      username: staff.username,
      phoneNumber: staff.phoneNumber,
      image: staff.image || "",
    },
  });

  const passwordForm = useForm<z.infer<typeof adminPasswordSchema>>({
    resolver: zodResolver(adminPasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const {
    formState: { isSubmitting: isProfileSubmitting },
  } = profileForm;

  const {
    formState: { isSubmitting: isPasswordSubmitting },
  } = passwordForm;

  const onSubmitProfile = async (values: z.infer<typeof adminProfileSchema>) => {
    const result = await updateStaffProfile(values);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success(result.success || "Profile updated successfully");
    router.refresh();
  };

  const onSubmitPassword = async (values: z.infer<typeof adminPasswordSchema>) => {
    const result = await updateStaffPassword(values);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success(result.success || "Password updated successfully");
    passwordForm.reset({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const avatarInitials = `${staff.firstName?.[0] || ""}${staff.lastName?.[0] || ""}`.toUpperCase();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Account Settings</h1>
          <p className="text-sm text-muted-foreground">
            Update your profile information and change your password.
          </p>
        </div>
      </div>

      {/* Profile form */}
      <Form {...profileForm}>
        <form
          onSubmit={profileForm.handleSubmit(onSubmitProfile)}
          className="space-y-6 p-5 border rounded-xl bg-white shadow-sm"
        >
          <h2 className="text-lg font-semibold">Profile Information</h2>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profileForm.watch("image") || undefined} alt="Profile" />
              <AvatarFallback>{avatarInitials || "ST"}</AvatarFallback>
            </Avatar>
            <div className="w-full sm:flex-1">
              <FormField
                control={profileForm.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Profile Photo</FormLabel>
                    <FormControl>
                      <div className="mt-2">
                        <ImageUpload
                          onUploadComplete={(url) => field.onChange(url)}
                          defaultValue={field.value || ""}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={profileForm.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isProfileSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={profileForm.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isProfileSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={profileForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isProfileSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={profileForm.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone number</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isProfileSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              disabled={isProfileSubmitting}
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isProfileSubmitting}>
              Save changes
            </Button>
          </div>
        </form>
      </Form>

      {/* Password form */}
      <Form {...passwordForm}>
        <form
          onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
          className="space-y-6 p-5 border rounded-xl bg-white shadow-sm"
        >
          <h2 className="text-lg font-semibold">Change Password</h2>

          <FormField
            control={passwordForm.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="current-password"
                    {...field}
                    disabled={isPasswordSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={passwordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      {...field}
                      disabled={isPasswordSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={passwordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      {...field}
                      disabled={isPasswordSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              disabled={isPasswordSubmitting}
              onClick={() => passwordForm.reset()}
            >
              Reset
            </Button>
            <Button type="submit" disabled={isPasswordSubmitting}>
              Update password
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default StaffAccountForm;
