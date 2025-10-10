/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import Logo from "@/components/globals/logo";
import Link from "next/link";
import { Bell, LogOut, Menu, X } from "lucide-react";
import CartHeader from "@/components/globals/cart-header";
import OrderHeader from "@/components/globals/order-header";
import { toast } from "sonner";
import { signOut } from "@/actions/auth";
import { Button } from '@/components/ui/button';

const Navbar = ({ user, orderCount }: { user: any; orderCount: number }) => {
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    toast.success("Logout successfully");
    window.location.assign("/");
  };
  return (
    <nav className="fixed bg-navbar top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 py-5 md:px-8">
      {/* Logo */}
      <Link href="/" className="flex items-center space-x-2">
        <Logo />
        <div className="text-white">
          <div className="font-semibold text-lg leading-tight">
            Emmanuel Aluminum
          </div>
          <div className="text-sm opacity-90">Fabrication</div>
        </div>
      </Link>

      {/* Client-side responsive menu */}
      <>
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-10">
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
            <div className="flex items-center space-x-6">
              <Link
                href="/notifications"
                className="text-white hover:text-gray-200 relative font-medium transition-colors"
              >
                <Bell className="size-6" />
                <div className="absolute -top-1 -right-2 bg-red-600 flex items-center justify-center size-4 rounded-full font-bold text-[8px]">
                  {user.notifications.filter((n: any) => !n.isRead).length}
                </div>
              </Link>
              <CartHeader />
              <OrderHeader orderCount={orderCount} />
              <Button onClick={handleLogout}>
                <LogOut className="size-4" />
                Logout
              </Button>
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

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="size-7" /> : <Menu className="size-7" />}
        </button>

        {/* Mobile Menu Dropdown */}
        <div
          className={`absolute top-full left-0 w-full lg:px-0 px-8 bg-navbar flex flex-col space-y-6 py-6 transition-all duration-300 md:hidden ${
            open
              ? "max-h-screen opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="text-white hover:text-gray-200 font-medium transition-colors"
          >
            Home
          </Link>
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="text-white hover:text-gray-200 font-medium transition-colors"
          >
            Contact
          </Link>
          <Link
            href="/about"
            onClick={() => setOpen(false)}
            className="text-white hover:text-gray-200 font-medium transition-colors"
          >
            About Us
          </Link>

          {user ? (
            <div className="flex flex-col space-y-4">
              <Link
                href="/notifications"
                onClick={() => setOpen(false)}
                className="text-white hover:text-gray-200 relative font-medium transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Bell className="size-6" />
                  <span>Notifications</span>
                </div>
                <div className="absolute -top-1 -right-2 bg-red-600 flex items-center justify-center size-4 rounded-full font-bold text-[8px]">
                  {user.notifications.filter((n: any) => !n.isRead).length}
                </div>
              </Link>
              <CartHeader />
              <OrderHeader orderCount={orderCount} />
              <Button onClick={handleLogout}>
                <LogOut className="size-4" />
                Logout
              </Button>
            </div>
          ) : (
            <Link
              href="/sign-in"
              onClick={() => setOpen(false)}
              className="text-white hover:text-gray-200 font-medium transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </>
    </nav>
  );
};

export default Navbar;
