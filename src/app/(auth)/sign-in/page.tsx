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
          className="h-full flex flex-col justify-center items-end px-6 md:pr-20 text-right"
        >
          <h1 className="text-white text-6xl lg:text-7xl font-medium font-serif tracking-wider">
            Welcome back
          </h1>
          <p className="text-white text-2xl mt-3 max-w-md">
            Kindly fill out the information required to login your account.
          </p>
        </div>
      </div>

      {/* Form Section - full width on small screens, centered */}
      <div className="flex-1 flex items-center justify-center px-6 md:absolute md:inset-0 md:w-1/2">
        <div className="p-6 sm:p-8 max-w-md w-full bg-white rounded-md shadow-lg">
          <h2 className="text-2xl sm:text-3xl tracking-wider font-medium text-black font-serif mb-4 text-center">
            Sign in
          </h2>
          <div className="bg-black w-14 h-[1px] mx-auto mb-6" />
          <SignInForm />
          <div className="flex mt-5 items-center justify-center gap-2 text-sm sm:text-base">
            <p>Don&apos;t have an account?</p>
            <Link
              href="/sign-up"
              className="font-medium text-blue-600 hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
