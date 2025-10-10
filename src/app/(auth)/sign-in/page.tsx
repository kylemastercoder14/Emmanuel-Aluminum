"use client";

import React, { useEffect, useRef } from "react";
import SignInForm from "@/components/forms/sign-in";
import Link from "next/link";
import { gsap } from "gsap";

const Page = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sectionEl = sectionRef.current;
    const textEl = textRef.current;
    if (!sectionEl || !textEl) return;

    const q = gsap.utils.selector(textEl);

    // Initial state
    gsap.set(sectionEl, {
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      x: "-100%",
      zIndex: 50,
    });

    gsap.set(q("h1, p"), {
      opacity: 0,
      y: 30,
    });

    // Animate diagonal + slide in
    gsap
      .timeline()
      .to(sectionEl, {
        duration: 1.5,
        ease: "power4.inOut",
        clipPath: "polygon(25% 0, 100% 0, 100% 100%, 70% 100%)",
        x: "0%",
        onComplete: () => {
          gsap.set(sectionEl, { zIndex: 0 }); // drop z-index after animation
        },
      })
      // Staggered fade-in for text
      .to(
        q("h1, p"),
        {
          duration: 0.8,
          opacity: 1,
          y: 0,
          stagger: 0.2,
          ease: "power3.out",
        },
        "-=0.5" // start before background fully finishes
      );
  }, []);

  return (
    <div className="relative h-screen px-8 overflow-hidden">
      {/* Dark Diagonal Section */}
      <div ref={sectionRef} className="absolute inset-0 bg-navbar">
        <div
          ref={textRef}
          className="h-full flex flex-col justify-center items-end pr-30"
        >
          <h1 className="text-white text-5xl md:text-6xl lg:text-7xl font-medium font-serif tracking-wider">
            Welcome back
          </h1>
          <p className="text-white text-2xl mt-3">
            Kindly fill out the information required to login your account.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="absolute inset-0 flex items-center justify-start pl-30">
        <div className="p-8 max-w-lg w-full">
          <h2 className="text-3xl tracking-wider font-medium text-black font-serif mb-4 text-center">
            Sign in
          </h2>
          <div className="bg-black w-14 h-[1px] mx-auto" />
          <SignInForm />
          <div className="flex mt-5 items-center justify-center gap-2">
            <p>Don&apos;t have an account?</p>
            <Link href="/sign-up" className="font-medium">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
