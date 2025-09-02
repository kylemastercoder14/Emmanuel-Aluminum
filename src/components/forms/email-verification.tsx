"use client";

import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { emailVerificationSchema } from "@/validators/auth";
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
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { resendOtpCode, verifyEmail } from "@/actions/auth";

const EmailVerificationForm = () => {
  const router = useRouter();
  const params = useParams();
  const email = decodeURIComponent(params.email as string);
  const [resendTimer, setResendTimer] = useState<number>(0);

  // ⏳ Countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleResendCode = async () => {
    try {
      const res = await resendOtpCode(email);

      if (res.success) {
        toast.success(res.success);
        setResendTimer(60); // start 60s cooldown
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      toast.error("Failed to resend code. Please try again.");
      console.error(error);
    }
  };

  const form = useForm<z.infer<typeof emailVerificationSchema>>({
    resolver: zodResolver(emailVerificationSchema),
    defaultValues: {
      otpCode: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof emailVerificationSchema>) {
    try {
      const res = await verifyEmail(values, email);

      if (res.success) {
        toast.success(res.success);
        router.push(`/sign-in`);
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      toast.error("An error occurred while verifying an account.");
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
					  type='number'
                      disabled={isSubmitting}
                      className="peer border-0 pl-0 border-b border-input rounded-none focus:ring-0 placeholder-transparent focus-visible:ring-0"
                    />
                  </FormControl>
                  <FormLabel className="absolute left-0 -top-3.5 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-muted-foreground peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-black peer-focus:text-sm">
                    OTP code
                  </FormLabel>
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
            Verify email
          </Button>
        </form>
      </Form>
      <div className="flex mt-5 items-center justify-center gap-2">
        <p>Didn&apos;t get the code?</p>
        <button
          type="button"
          className={`font-medium ${resendTimer > 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          onClick={handleResendCode}
          disabled={resendTimer > 0}
        >
          {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend code"}
        </button>
      </div>
    </div>
  );
};

export default EmailVerificationForm;
