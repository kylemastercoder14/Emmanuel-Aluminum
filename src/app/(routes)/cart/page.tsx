"use client";
import React, { useState } from "react";
import Image from "next/image";
import useCart from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const CartPage = () => {
  const router = useRouter();
  const { items, removeItem, updateQuantity, removeAll, setSelectedForCheckout } =
    useCart();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleQuantityChange = (id: string, color: string, qty: number) => {
    if (qty < 1) return;
    updateQuantity(id, color, qty);
  };

  const toggleSelect = (id: string, color: string) => {
    const key = `${id}-${color}`;
    setSelectedItems((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleDeleteSelected = () => {
    selectedItems.forEach((key) => {
      const [id, color] = key.split("-");
      removeItem(id, color);
    });
    setSelectedItems([]);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(items.map((i) => `${i.id}-${i.color}`));
    } else {
      setSelectedItems([]);
    }
  };

  const handleProceed = () => {
    if (selectedItems.length === 0) {
      toast.error("Please select at least 1 item to proceed.");
      return;
    }
    const checkoutItems = items.filter((i) =>
      selectedItems.includes(`${i.id}-${i.color}`)
    );
    setSelectedForCheckout(checkoutItems);
    router.push("/submit-request");
  };

  return (
    <div className="px-4 sm:px-10 py-10 min-h-screen bg-gray-50">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">
        🛒 Service Request
      </h1>

      {/* Header for desktop */}
      <div className="hidden md:grid grid-cols-5 font-semibold border-b pb-2 text-gray-700">
        <span></span>
        <span className="col-span-2">Product</span>
        <span>Unit Price</span>
        <span className="text-right">Quantity</span>
      </div>

      {/* Items */}
      {items.length === 0 ? (
        <div className="py-10 text-center text-gray-500">Your cart is empty 🛒</div>
      ) : (
        items.map((item) => {
          const key = `${item.id}-${item.color}`;
          return (
            <div
              key={key}
              className="border-b py-4 flex flex-col md:grid md:grid-cols-5 md:items-center gap-4 md:gap-0"
            >
              {/* Checkbox */}
              <div className="flex items-center md:justify-center">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(key)}
                  onChange={() => toggleSelect(item.id, item.color)}
                  className="w-4 h-4 accent-green-600"
                />
              </div>

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
                  <p className="font-medium text-sm sm:text-base">{item.name}</p>
                  <p className="text-xs sm:text-sm text-gray-500">{item.color}</p>
                  <button
                    onClick={() => removeItem(item.id, item.color)}
                    className="flex items-center text-red-500 text-xs sm:text-sm mt-1"
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </button>
                </div>
              </div>

              {/* Price */}
              <span className="text-sm sm:text-base">₱{item.price.toLocaleString()}</span>

              {/* Quantity */}
              <div className="flex items-center justify-end gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    handleQuantityChange(item.id, item.color, item.quantity - 1)
                  }
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    handleQuantityChange(item.id, item.color, item.quantity + 1)
                  }
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })
      )}

      {/* Footer */}
      {items.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 border-t pt-4 gap-4 sm:gap-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-4 h-4 accent-green-600"
                checked={selectedItems.length === items.length}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
              <span className="text-sm">Select all</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              {selectedItems.length > 0 && (
                <Button size="sm" variant="destructive" onClick={handleDeleteSelected}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete Selected
                </Button>
              )}

              <Button
                size="sm"
                variant="outline"
                onClick={removeAll}
                className="text-red-600 hover:text-red-600 border-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Remove All
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6">
            <p className="font-medium text-sm sm:text-base">
              Total ({items.length} item{items.length > 1 ? "s" : ""}):{" "}
              <span className="text-lg font-bold text-green-600">
                ₱{total.toLocaleString()}
              </span>
            </p>
            <Button
              onClick={handleProceed}
              className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
            >
              Proceed
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
