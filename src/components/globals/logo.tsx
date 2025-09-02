import Image from "next/image";
import React from "react";

const Logo = ({ withText }: { withText?: boolean }) => {
  if (!withText) {
    return (
      <div className="relative size-10">
        <Image src="/logo.png" alt="Logo" fill className="size-full" />
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <div className="relative size-10">
        <Image src="/logo.png" alt="Logo" fill className="size-full" />
      </div>
      <span className="text-sm font-medium">Emmanuel Aluminum Fabrication</span>
    </div>
  );
};

export default Logo;
