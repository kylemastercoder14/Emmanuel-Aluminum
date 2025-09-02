/* eslint-disable @next/next/no-img-element */

import Logo from "@/components/globals/logo";
import AdminLoginForm from "@/components/forms/admin-login";

export default function Page() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 justify-center items-center">
          <div className="w-full max-w-md">
            <div className="mx-auto flex flex-col items-center justify-center mb-5 w-full">
              <Logo />
              <span className="font-medium mt-3">Emmanuel Aluminum Fabrication</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold">Login to your account</h1>
              <p className="text-muted-foreground text-sm text-balance">
                Enter your username below to login to your account
              </p>
            </div>
            <AdminLoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/auth-bg.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
