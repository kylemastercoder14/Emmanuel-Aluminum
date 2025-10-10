"use client";

import React, { useEffect, useRef } from "react";
import SignUpForm from "@/components/forms/sign-up";
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

    // Initial state (full screen, shifted right)
    gsap.set(sectionEl, {
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      x: "100%",
      zIndex: 50,
    });

    gsap.set(q("h1, p"), {
      opacity: 0,
      y: 30,
    });

    // Animate diagonal + slide in from right
    gsap
      .timeline()
      .to(sectionEl, {
        duration: 1.5,
        ease: "power4.inOut",
        clipPath: "polygon(0 0, 75% 0, 30% 100%, 0 100%)",
        x: "0%",
        onComplete: () => {
          gsap.set(sectionEl, { zIndex: 0 });
        },
      })
      .to(
        q("h1, p"),
        {
          duration: 0.8,
          opacity: 1,
          y: 0,
          stagger: 0.2,
          ease: "power3.out",
        },
        "-=0.5"
      );
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Dark Diagonal Section - hidden on small screens */}
      <div
        ref={sectionRef}
        className="hidden md:flex relative md:absolute md:inset-0 w-1/2 bg-navbar items-center justify-center"
      >
        <div
          ref={textRef}
          className="h-full flex flex-col justify-center items-start px-6 md:pl-20 text-left"
        >
          <h1 className="text-white text-6xl lg:text-7xl font-medium font-serif tracking-wider">
            Hello there
          </h1>
          <p className="text-white text-2xl mt-3 max-w-md">
            Kindly fill out the information required to proceed.
          </p>
        </div>
      </div>

      {/* Form Section - full width on small screens, centered */}
      <div className="flex-1 flex items-center justify-center px-6 md:absolute md:inset-0 md:w-1/2">
        <div className="p-6 sm:p-8 max-w-md w-full bg-white rounded-md shadow-lg">
          <h2 className="text-2xl sm:text-3xl tracking-wider font-medium text-black font-serif mb-4 text-center">
            Sign up
          </h2>
          <div className="bg-black w-14 h-[1px] mx-auto mb-6" />
          <SignUpForm />
          <div className="flex mt-5 items-center justify-center gap-2 text-sm sm:text-base">
            <p>Already have an account?</p>
            <Link
              href="/sign-in"
              className="font-medium text-blue-600 hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
