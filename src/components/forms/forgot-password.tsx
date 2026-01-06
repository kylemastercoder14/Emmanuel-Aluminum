"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { forgotPasswordSchema } from "@/validators/auth";
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
import { requestPasswordReset } from "@/actions/auth";

const ForgotPasswordForm = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    try {
      const res = await requestPasswordReset(values);

      if (res.success) {
        toast.success(res.success);
        router.push(`/reset-password?email=${encodeURIComponent(values.email)}`);
      } else if (res.error) {
        toast.error(res.error);
      }
    } catch (error) {
      toast.error("An error occurred while processing your request.");
      console.error(error);
    }
  }

  return (
    <div className="mt-14">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="relative">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder=" "
                      type="email"
                      disabled={isSubmitting}
                      className="peer border-0 pl-0 border-b border-input rounded-none focus:ring-0 placeholder-transparent focus-visible:ring-0"
                    />
                  </FormControl>
                  <FormLabel className="absolute left-0 -top-3.5 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-muted-foreground peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-black peer-focus:text-sm">
                    Email address
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
            Send verification code
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ForgotPasswordForm;


