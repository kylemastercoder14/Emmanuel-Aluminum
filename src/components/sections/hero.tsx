import React from "react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="w-full relative bg-hero">
      {/* Left Sidebar */}
      <div className="bg-navbar h-full absolute top-0 left-0 w-[25%]"></div>
      <div className='flex z-3 relative items-start flex-col justify-center pl-30 h-full'>
        <h1 className="text-5xl font-bold text-white leading-tight mb-6">
          We Are Best Aluminum & Glass <br /> Fabrication Services
        </h1>
        <p className="text-white mb-8 leading-relaxed opacity-90">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
          tellus, luctus nec ullamcorper <br /> mattis, pulvinar dapibus leo.
        </p>
        <Button
          size="lg"
          className="bg-[#642828] hover:bg-[#642828b9] rounded-none text-white px-6 py-4 font-medium"
        >
          Learn More &nbsp; &rarr;
        </Button>
      </div>
    </div>
  );
};

export default Hero;
