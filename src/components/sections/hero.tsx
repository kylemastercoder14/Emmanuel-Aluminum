"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();
  return (
    <div className="w-full relative bg-hero bg-cover bg-center min-h-screen flex items-center">
      {/* Left Sidebar - hidden on mobile */}
      <div className="hidden md:block bg-navbar h-full absolute top-0 left-0 w-1/4"></div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col justify-center items-center md:items-start px-6 md:pl-32 py-20 md:py-0 text-center md:text-left w-full max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
          We Are the Best in Aluminum & Glass <br /> Fabrication Services
        </h1>
        <p className="text-white mb-8 leading-relaxed opacity-90 text-base sm:text-lg md:text-xl max-w-2xl">
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
    </div>
  );
};

export default Hero;
