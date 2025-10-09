"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

const Hero = () => {
  const router = useRouter();
  return (
    <div className="w-full relative bg-hero bg-cover bg-center">
      {/* Left Sidebar */}
      <div className="bg-navbar h-full absolute top-0 left-0 w-[25%]"></div>

      {/* Hero Content */}
      <div className="flex z-10 relative items-start flex-col justify-center pl-32 h-screen">
        <h1 className="text-5xl font-bold text-white leading-tight mb-6">
          We Are the Best in Aluminum & Glass <br /> Fabrication Services
        </h1>
        <p className="text-white mb-8 leading-relaxed opacity-90 max-w-2xl">
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
