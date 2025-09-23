"use client";

import { ShoppingCart } from "lucide-react";
import React from "react";
import useCart from "@/hooks/use-cart";
import Link from 'next/link';

const CartHeader = () => {
  const { items } = useCart();
  return (
    <Link
      href="/cart"
      className="text-white relative hover:text-gray-200 mt-0.5 font-medium transition-colors"
    >
      <ShoppingCart className="size-6" />
      <div className="absolute -top-1 -right-2 bg-red-600 flex items-center justify-center size-4 rounded-full font-bold text-[8px]">
        {items.length}
      </div>
    </Link>
  );
};

export default CartHeader;
