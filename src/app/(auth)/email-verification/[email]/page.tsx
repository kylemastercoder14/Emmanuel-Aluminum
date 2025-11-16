import React from "react";
import EmailVerificationForm from "@/components/forms/email-verification";

const Page = () => {
  return (
    <div className="relative min-h-screen px-4 md:px-8 overflow-hidden lg:py-0 py-40 flex flex-col md:block">
      {/* Dark Diagonal Section — hidden on mobile */}
      <div
        className="hidden md:block absolute inset-0 bg-navbar"
        style={{
          clipPath: "polygon(0 0, 75% 0, 30% 100%, 0 100%)",
        }}
      >
        <div className="h-full flex flex-col justify-center items-start pl-20 lg:pl-30">
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-medium font-serif tracking-wider">
            Verify your account
          </h1>
          <p className="text-white text-lg md:text-2xl mt-3 max-w-md">
            Kindly enter the OTP sent to your registered email address.
          </p>
        </div>
      </div>
      {/* Form Section */}
      <div className="relative z-10 flex items-center justify-center md:justify-end md:pr-5 h-full py-10">
        <div className="p-6 md:p-8 max-w-sm md:max-w-lg w-full bg-white/80 md:bg-transparent rounded-2xl md:rounded-none shadow md:shadow-none backdrop-blur-sm md:backdrop-blur-none">
          <h2 className="text-2xl md:text-3xl tracking-wider font-medium text-black font-serif mb-4 text-center">
            Email verification
          </h2>
          <div className="bg-black w-12 md:w-14 h-[1px] mx-auto mb-4" />
          <EmailVerificationForm />
        </div>
      </div>
    </div>
  );
};

export default Page;
