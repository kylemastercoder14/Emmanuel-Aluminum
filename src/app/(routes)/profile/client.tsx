"use client";

import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { UserWithProps } from "@/types/interface";
import {
  changePasswordSchema,
  updateProfileSchema,
} from "@/validators/auth";
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
import { changePassword, updateProfile } from "@/actions/auth";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import MultipleImageUpload from "@/components/globals/multiple-image-upload";
import { saveSeniorPwdId } from "@/actions/user";
import { useRouter } from "next/navigation";

type ProfileClientProps = {
  user: UserWithProps;
};

const ProfileClient: React.FC<ProfileClientProps> = ({ user }) => {
  const router = useRouter();
  const profileForm = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name,
      phoneNumber: user.phoneNumber,
      email: user.email,
    },
  });

  const passwordForm = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const {
    formState: { isSubmitting: isUpdatingProfile },
  } = profileForm;

  const {
    formState: { isSubmitting: isChangingPassword },
  } = passwordForm;

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const hasSavedSeniorPwdId = (user.seniorPwdId ?? []).length > 0;
  const [seniorPwdId, setSeniorPwdId] = useState<string[]>(
    user.seniorPwdId ?? []
  );
  const [isSavingSeniorPwd, setIsSavingSeniorPwd] = useState(false);

  const onSubmitProfile = async (values: z.infer<typeof updateProfileSchema>) => {
    try {
      const res = await updateProfile(values);

      if (res.success) {
        toast.success(res.success);
      } else {
        toast.error(res.error || "Failed to update profile");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while updating your profile.");
    }
  };

  const handleSaveSeniorPwdId = async () => {
    if (hasSavedSeniorPwdId) {
      toast.error(
        "Your Senior/PWD ID is already saved and cannot be changed."
      );
      return;
    }

    if (!seniorPwdId.length) {
      toast.error("Please upload your Senior/PWD ID first.");
      return;
    }

    try {
      setIsSavingSeniorPwd(true);
      const res = await saveSeniorPwdId(user.id, seniorPwdId);

      if (res.success) {
        toast.success("Senior/PWD ID saved successfully.");
        router.refresh();
      } else if (res.error) {
        toast.error(res.error);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while saving your Senior/PWD ID.");
    } finally {
      setIsSavingSeniorPwd(false);
    }
  };

  const onSubmitPassword = async (
    values: z.infer<typeof changePasswordSchema>
  ) => {
    try {
      const res = await changePassword(values);

      if (res.success) {
        toast.success(res.success);
        passwordForm.reset();
      } else {
        toast.error(res.error || "Failed to change password");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while changing your password.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold mb-6">Account settings</h1>

      {/* Profile information */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-medium mb-4">Profile information</h2>
        <Form {...profileForm}>
          <form
            onSubmit={profileForm.handleSubmit(onSubmitProfile)}
            className="space-y-5"
          >
            <FormField
              control={profileForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isUpdatingProfile}
                      placeholder="Your full name"
                    />
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
                    <Input
                      {...field}
                      disabled={isUpdatingProfile}
                      placeholder="Your phone number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={profileForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      disabled={isUpdatingProfile}
                      placeholder="Your email address"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isUpdatingProfile}
                className="bg-navbar hover:opacity-90"
              >
                Save changes
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {/* Senior / PWD ID (one-time upload) */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-medium mb-2">Senior / PWD ID</h2>
        <p className="text-sm text-gray-600 mb-4">
          Upload your Senior Citizen or PWD ID once. After it is saved, it
          cannot be changed and will be used automatically for eligible
          discounts.
        </p>

        {hasSavedSeniorPwdId ? (
          <div className="space-y-3">
            <p className="text-sm text-green-700 font-medium">
              Your Senior/PWD ID is already saved.
            </p>
            {user.seniorPwdId?.[0] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.seniorPwdId[0]}
                alt="Senior/PWD ID"
                className="max-w-xs rounded border object-cover"
              />
            )}
            <p className="text-xs text-gray-500">
              If you need to update this information, please contact support.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <MultipleImageUpload
              onUploadComplete={(urls) => setSeniorPwdId(urls)}
              defaultValues={seniorPwdId}
              maxImages={2}
            />
            <p className="text-xs text-gray-500">
              Accepted formats: JPG, PNG, WEBP (Max 5MB)
            </p>
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={handleSaveSeniorPwdId}
                disabled={isSavingSeniorPwd || !seniorPwdId.length}
                className="bg-navbar hover:opacity-90"
              >
                Save ID
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Change password */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium mb-4">Change password</h2>
        <Form {...passwordForm}>
          <form
            onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
            className="space-y-5"
          >
            <FormField
              control={passwordForm.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showCurrentPassword ? "text" : "password"}
                        disabled={isChangingPassword}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="absolute right-2 top-2.5 text-gray-500 hover:text-black"
                      >
                        {showCurrentPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={passwordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showNewPassword ? "text" : "password"}
                        disabled={isChangingPassword}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-2 top-2.5 text-gray-500 hover:text-black"
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={passwordForm.control}
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm new password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={
                          showConfirmNewPassword ? "text" : "password"
                        }
                        disabled={isChangingPassword}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmNewPassword(!showConfirmNewPassword)
                        }
                        className="absolute right-2 top-2.5 text-gray-500 hover:text-black"
                      >
                        {showConfirmNewPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isChangingPassword}
                className="bg-navbar hover:opacity-90"
              >
                Update password
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProfileClient;
