"use client";

import React from "react";
import Image from "next/image";
import useCart from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";

const CartPage = () => {
  const { items, removeItem, updateQuantity, removeAll } = useCart();

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleQuantityChange = (id: string, qty: number) => {
    if (qty < 1) return;
    updateQuantity(id, qty);
  };

  return (
    <div className="p-10 px-20 mt-20 mb-20 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">🛒 Service Request</h1>

      {/* Header */}
      <div className="grid grid-cols-4 font-semibold border-b pb-2 text-gray-700">
        <span className="col-span-2">Product</span>
        <span>Unit Price</span>
        <span className="text-right">Quantity</span>
      </div>

      {/* Items */}
      {items.length === 0 ? (
        <div className="py-10 text-center text-gray-500">
          Your cart is empty 🛒
        </div>
      ) : (
        items.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-4 items-center border-b py-4"
          >
            {/* Product */}
            <div className="flex items-center gap-4 col-span-2">
              <Image
                src={item.image}
                alt={item.name}
                width={80}
                height={80}
                className="rounded border"
              />
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">{item.color}</p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="flex items-center text-red-500 text-sm mt-1"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>

            {/* Price */}
            <span>₱{item.price.toLocaleString()}</span>

            {/* Quantity */}
            <div className="flex items-center justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{item.quantity}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))
      )}

      {/* Footer */}
      {items.length > 0 && (
        <div className="flex justify-between items-center mt-6 border-t pt-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              className="w-4 h-4"
              onChange={(e) => {
                if (e.target.checked) return;
                removeAll();
              }}
            />
            <span className="text-sm">Select all</span>
          </div>
          <div className="flex items-center gap-6">
            <p className="font-medium">
              Total ({items.length} item{items.length > 1 ? "s" : ""}):{" "}
              <span className="text-lg font-bold text-green-600">
                ₱{total.toLocaleString()}
              </span>
            </p>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Proceed
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
