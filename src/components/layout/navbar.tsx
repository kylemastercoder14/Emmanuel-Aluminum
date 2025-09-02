/* eslint-disable react-hooks/rules-of-hooks */
import Link from "next/link";
import React from "react";
import Logo from "@/components/globals/logo";
import { useUser } from "@/hooks/use-user";
import { ShoppingCart, User } from 'lucide-react';

const Navbar = async () => {
  const { user } = await useUser();
  return (
    <nav className="fixed bg-navbar top-0 left-0 right-0 z-[100] flex justify-between items-center px-8 py-6">
      <Link href="/" className="flex items-center space-x-2">
        <Logo />
        <div className="text-white">
          <div className="font-semibold text-lg leading-tight">
            Emmanuel Aluminum
          </div>
          <div className="text-sm opacity-90">Fabrication</div>
        </div>
      </Link>

      <div className="flex items-center space-x-12">
        <Link
          href="/"
          className="text-white hover:text-gray-200 font-medium transition-colors"
        >
          Home
        </Link>
        <Link
          href="/contact"
          className="text-white hover:text-gray-200 font-medium transition-colors"
        >
          Contact
        </Link>
        <Link
          href="/about"
          className="text-white hover:text-gray-200 font-medium transition-colors"
        >
          About Us
        </Link>
        {user ? (
          <div className='flex items-center space-x-7'>
            <Link
              href="/cart"
              className="text-white hover:text-gray-200 mt-0.5 font-medium transition-colors"
            >

              <ShoppingCart className='size-5' />
            </Link>
            <Link
              href="/profile"
              className="text-white hover:text-gray-200 mt-0.5 font-medium transition-colors"
            >

              <User className='size-5' />
            </Link>
          </div>
        ) : (
          <Link
            href="/sign-in"
            className="text-white hover:text-gray-200 font-medium transition-colors"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
