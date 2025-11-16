"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();

  return (
    <div className="w-full relative bg-hero bg-cover bg-center min-h-screen">
      {/* Left Sidebar Overlay (desktop only) */}
      <div className="hidden md:block bg-navbar h-full absolute top-0 left-0 w-1/4 max-w-xs"></div>

      {/* Global dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 lg:px-16 xl:px-32 py-24 md:py-32 gap-10">
        {/* Left Text Section */}
        <div className="flex flex-col items-start justify-center max-w-xl space-y-6">
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight drop-shadow-xl">
            We Are the Best in Aluminum & Glass <br /> Fabrication Services
          </h1>

          <p className="text-white leading-relaxed opacity-95 drop-shadow">
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
            Browse Services &nbsp; →
          </Button>
        </div>

        {/* Right Promo Card */}
        <div
          className="relative overflow-hidden mt-10 md:mt-0 md:ml-20
  bg-black/70 backdrop-blur-md p-10
  rounded-3xl max-w-lg text-white shadow-2xl
  border border-white/20"
        >
          {/* Shine Effect */}
          <div className="absolute inset-0 pointer-events-none shine-animation"></div>

          <h2 className="text-3xl font-bold mb-4 text-[#ffbd7a] drop-shadow-lg">
            Unlock Lasting Discounts at Emmanuel Aluminum Fabrication!
          </h2>

          <p className="leading-relaxed text-base md:text-lg opacity-95">
            Buy more, save more — ₱20,000 gets <strong>2.5% off</strong>,
            ₱25,000+ gets <strong>5% off</strong>, and Seniors or PWDs enjoy{" "}
            <strong>20% off forever</strong>.
          </p>

          <p className="mt-5 text-sm md:text-base italic opacity-90">
            Quality you can trust, savings you can count on always.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
