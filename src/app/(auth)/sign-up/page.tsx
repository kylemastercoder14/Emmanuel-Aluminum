"use client";

import React, { useEffect, useRef } from "react";
import SignUpForm from "@/components/forms/sign-up";
import Link from "next/link";
import { gsap } from "gsap";

const Page = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.innerWidth < 768) return; // disable animation on mobile

    const sectionEl = sectionRef.current;
    const textEl = textRef.current;
    if (!sectionEl || !textEl) return;

    const q = gsap.utils.selector(textEl);

    // Initial state
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
        onComplete: () => { gsap.set(sectionEl, { zIndex: 0 }); },
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
    <div className="relative h-screen px-4 md:px-8 overflow-hidden flex flex-col md:block">
      {/* Dark Diagonal Section — hidden on mobile */}
      <div ref={sectionRef} className="hidden md:block absolute inset-0 bg-navbar">
        <div
          ref={textRef}
          className="h-full flex flex-col items-start justify-center pl-20 lg:pl-30"
        >
          <h1 className="text-white text-5xl md:text-6xl lg:text-7xl font-medium font-serif tracking-wider">
            Hello there
          </h1>
          <p className="text-white text-2xl mt-3 max-w-md">
            Kindly fill out the information required to proceed.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="relative z-10 flex items-center justify-center md:justify-end md:pr-30 h-full">
        <div className="p-6 md:p-8 max-w-sm md:max-w-lg w-full bg-white/80 md:bg-transparent rounded-2xl md:rounded-none shadow md:shadow-none backdrop-blur-sm md:backdrop-blur-none">
          <h2 className="text-2xl md:text-3xl tracking-wider font-medium text-black font-serif mb-4 text-center">
            Sign up
          </h2>
          <div className="bg-black w-12 md:w-14 h-[1px] mx-auto mb-4" />
          <SignUpForm />
          <div className="flex mt-5 items-center justify-center gap-2 text-sm md:text-base">
            <p>Already have an account?</p>
            <Link href="/sign-in" className="font-medium text-navbar">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
