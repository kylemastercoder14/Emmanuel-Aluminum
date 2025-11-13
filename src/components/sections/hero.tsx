"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();

  return (
    <div className="w-full relative bg-hero bg-cover bg-center">
      {/* Left Sidebar Overlay */}
      <div className="bg-navbar h-full absolute top-0 left-0 w-[25%]"></div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-32 h-screen">
        {/* Left Section */}
        <div className="flex flex-col items-start justify-center max-w-xl space-y-6">
          <h1 className="text-5xl font-bold text-white leading-tight">
            We Are the Best in Aluminum & Glass <br /> Fabrication Services
          </h1>
          <p className="text-white leading-relaxed opacity-90">
            At <strong>Emmanuel Aluminum Fabrication</strong>, we specialize in
            creating durable, stylish, and high-quality aluminum and glass
            installations. From windows and doors to customized architectural
            designs, our expert craftsmanship ensures precision, safety, and
            timeless beauty for every project we complete.
          </p>
          <Button
            onClick={() => router.push(`#services`)}
            size="lg"
            className="bg-[#642828] hover:bg-[#642828b9] rounded-none text-white px-6 py-4 font-medium"
          >
            Browse Services &nbsp; &rarr;
          </Button>
        </div>

        {/* Right Section - Promo */}
        <div className="mt-10 md:mt-0 md:ml-16 bg-black/50 backdrop-blur-sm p-8 rounded-2xl max-w-md text-white shadow-lg border border-white/10">
          <h2 className="text-2xl font-bold mb-3 text-[#ffbd7a]">
            Unlock Lasting Discounts at Emmanuel Aluminum Fabrication!
          </h2>
          <p className="leading-relaxed text-sm md:text-base opacity-90">
            Buy more, save more—₱20,000 gets <strong>2.5% off</strong>, ₱25,000+
            gets <strong>5% off</strong>, and Seniors or PWDs enjoy{" "}
            <strong>20% off forever</strong>.
          </p>
          <p className="mt-4 text-sm italic opacity-85">
            Quality you can trust, savings you can count on—always.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
