"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { resetPasswordSchema } from "@/validators/auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { resetPassword } from "@/actions/auth";
import { Eye, EyeOff } from "lucide-react";

const ResetPasswordForm = ({ email }: { email: string }) => {
  const router = useRouter();
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      otpCode: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
    try {
      const res = await resetPassword(values, email);

      if (res.success) {
        toast.success(res.success);
        router.push(`/sign-in`);
      } else if (res.error) {
        toast.error(res.error);
      }
    } catch (error) {
      toast.error("An error occurred while resetting your password.");
      console.error(error);
    }
  }

  return (
    <div className="mt-14">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="otpCode"
            render={({ field }) => (
              <FormItem>
                <div className="relative">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder=" "
                      maxLength={6}
                      type="number"
                      disabled={isSubmitting}
                      className="peer border-0 pl-0 border-b border-input rounded-none focus:ring-0 placeholder-transparent focus-visible:ring-0"
                    />
                  </FormControl>
                  <FormLabel className="absolute left-0 -top-3.5 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-muted-foreground peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-black peer-focus:text-sm">
                    Verification code
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <div className="relative">
                  <FormControl>
                    <Input
                      {...field}
                      type={showNewPassword ? "text" : "password"}
                      placeholder=" "
                      disabled={isSubmitting}
                      className="peer border-0 pl-0 border-b border-input rounded-none focus:ring-0 placeholder-transparent focus-visible:ring-0 pr-10"
                    />
                  </FormControl>
                  <FormLabel className="absolute left-0 -top-3.5 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-muted-foreground peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-black peer-focus:text-sm">
                    New password
                  </FormLabel>
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-2 top-2 text-gray-500 hover:text-black"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmNewPassword"
            render={({ field }) => (
              <FormItem>
                <div className="relative">
                  <FormControl>
                    <Input
                      {...field}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder=" "
                      disabled={isSubmitting}
                      className="peer border-0 pl-0 border-b border-input rounded-none focus:ring-0 placeholder-transparent focus-visible:ring-0 pr-10"
                    />
                  </FormControl>
                  <FormLabel className="absolute left-0 -top-3.5 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-muted-foreground peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-black peer-focus:text-sm">
                    Confirm new password
                  </FormLabel>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-2 text-gray-500 hover:text-black"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={isSubmitting}
            className="bg-navbar hover:opacity-90 w-full"
            size="lg"
            type="submit"
          >
            Reset password
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ResetPasswordForm;


