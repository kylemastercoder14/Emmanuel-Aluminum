"use client";

import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { registerSchema } from "@/validators/auth";
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
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { signUp } from "@/actions/auth";

const SignUpForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    try {
      const res = await signUp(values);

      if (res.success) {
        toast.success(res.success);
        router.push(`/email-verification/${res.email}`);
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      toast.error("An error occurred while creating an account.");
      console.error(error);
    }
  }
  return (
    <div className="mt-14">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <div className="relative">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder=" "
                      disabled={isSubmitting}
                      className="peer border-0 pl-0 border-b border-input rounded-none focus:ring-0 placeholder-transparent focus-visible:ring-0"
                    />
                  </FormControl>
                  <FormLabel className="absolute left-0 -top-3.5 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-muted-foreground peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-black peer-focus:text-sm">
                    Name
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <div className="relative">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder=" "
                      disabled={isSubmitting}
                      maxLength={13}
                      className="peer border-0 pl-0 border-b border-input rounded-none focus:ring-0 placeholder-transparent focus-visible:ring-0"
                      onChange={(e) => {
                        let input = e.target.value;

                        // Remove all non-digit characters
                        input = input.replace(/\D/g, "");

                        // If the number starts with 0, replace it with +63
                        if (input.startsWith("0")) {
                          input = "+63" + input.substring(1);
                        } else if (input.startsWith("63")) {
                          input = "+" + input;
                        } else if (input.startsWith("+63")) {
                          input = input;
                        }

                        field.onChange(input); // Update RHF state
                        form.setValue("phoneNumber", input); // Explicitly sync value
                      }}
                    />
                  </FormControl>
                  <FormLabel className="absolute left-0 -top-3.5 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-muted-foreground peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-black peer-focus:text-sm">
                    Phone number
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="relative">
                  <FormControl>
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder=" "
                      disabled={isSubmitting}
                      className="peer border-0 pl-0 border-b border-input rounded-none focus:ring-0 placeholder-transparent focus-visible:ring-0 pr-10"
                    />
                  </FormControl>
                  <FormLabel className="absolute left-0 -top-3.5 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-muted-foreground peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-black peer-focus:text-sm">
                    Password
                  </FormLabel>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-2 text-gray-500 hover:text-black"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
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
                    Confirm password
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
            Sign up
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SignUpForm;
