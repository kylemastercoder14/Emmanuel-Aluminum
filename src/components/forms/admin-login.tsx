"use client";

import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { adminSchema } from "@/validators/admin";
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
import { signIn } from "@/actions/admin";

const AdminLoginForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof adminSchema>>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof adminSchema>) {
    try {
      const res = await signIn(values);

      if (res.success) {
        toast.success(res.success);
        if(res.role === "Admin") {

          router.push(`/admin/dashboard`);
        }else {
          router.push("/admin/service-listings/history")
        }
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      toast.error("An error occurred while logging in to your account.");
      console.error(error);
    }
  }
  return (
    <div className="mt-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
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
                    Username
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
          <Button
            disabled={isSubmitting}
            className="bg-navbar hover:opacity-90 w-full"
            size="lg"
            type="submit"
          >
            Sign in
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AdminLoginForm;
