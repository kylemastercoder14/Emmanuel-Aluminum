import React from "react";
import EmailVerificationForm from "@/components/forms/email-verification";

const Page = () => {
  return (
    <div className="relative h-screen px-8">
      {/* Dark Diagonal Section */}
      <div
        className="absolute inset-0 bg-navbar"
        style={{
          clipPath: "polygon(0 0, 75% 0, 30% 100%, 0 100%)",
        }}
      >
        <div className="h-full flex flex-col justify-center items-start pl-30">
          <h1 className="text-white text-5xl md:text-6xl lg:text-7xl font-medium font-serif tracking-wider">
            Verify your account
          </h1>
          <p className="text-white text-2xl mt-3">
            Kindly fill up your OTP that you received by registered email
            address.
          </p>
        </div>
      </div>
      {/* Form Section */}
      <div className="absolute inset-0 flex items-center justify-end pr-30">
        <div className="p-8 max-w-lg w-full">
          <h2 className="text-3xl tracking-wider font-medium text-black font-serif mb-4 text-center">
            Email verification
          </h2>
          <div className="bg-black w-14 h-[1px] mx-auto" />
          <EmailVerificationForm />
        </div>
      </div>
    </div>
  );
};

export default Page;
