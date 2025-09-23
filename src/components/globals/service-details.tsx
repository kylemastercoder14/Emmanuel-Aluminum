"use client";

import { Service } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import useCart from "@/hooks/use-cart";

const ServiceDetails = ({ data }: { data: Service | null }) => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string>(
    data?.images[0] || ""
  );
  const [selectedColor, setSelectedColor] = useState<string | null>(
    data?.colors[0] || null
  );
  const [quantity, setQuantity] = useState<number>(1);

  const { addItem, updateQuantity, items } = useCart();

  if (!data) {
    router.push("/");
    return null;
  }

  const handleAddToCart = () => {
    if (!selectedColor) return;

    // Check if item already exists in cart
    const existingItem = items.find(
      (item) => item.id === data.id && item.color === selectedColor
    );

    if (existingItem) {
      // increment by the selected quantity
      updateQuantity(
        existingItem.id,
        existingItem.color,
        existingItem.quantity + quantity
      );
    } else {
      addItem({
        id: data.id,
        name: data.name,
        image: selectedImage,
        price: data.price,
        color: selectedColor,
        quantity,
      });
    }
  };

  return (
    <div className="p-6">
      <div className="grid lg:grid-cols-5 grid-cols-1 gap-20 mt-5">
        {/* Left side - Image preview + thumbnails */}
        <div className="lg:col-span-2">
          <div className="flex flex-col gap-5">
            {/* Main selected image */}
            <div className="relative w-full h-[500px] rounded-xl overflow-hidden">
              <Image
                src={selectedImage}
                alt={data?.name || "Service"}
                fill
                className="object-contain"
              />
            </div>

            {/* Thumbnails */}
            <div className="flex items-center gap-3 flex-wrap">
              {data?.images.map((image, index) => (
                <div
                  key={image}
                  className={`relative size-20 cursor-pointer rounded-lg overflow-hidden border-2 transition
                    ${
                      selectedImage === image
                        ? "border-blue-500"
                        : "border-gray-200"
                    }`}
                  onClick={() => setSelectedImage(image)}
                >
                  <Image
                    src={image}
                    alt={`Service Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Product details */}
        <div className="lg:col-span-3 space-y-6">
          <h2 className="text-2xl font-bold">{data?.name}</h2>
          <p className="text-lg font-semibold text-gray-600">
            {data?.category}
          </p>

          {/* Frame Colors */}
          <div>
            <h4 className="font-semibold mb-2">Color of Frame:</h4>
            <div className="flex gap-3">
              {data?.colors.map((color) => (
                <button
                  key={color}
                  className={`px-4 cursor-pointer py-2 border rounded ${
                    selectedColor === color ? "bg-black text-white" : ""
                  }`}
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Glass Types */}
          {data.type && (
            <div>
              <h4 className="font-semibold mb-2">
                Type of Glasses:{" "}
                <span className="font-normal">{data.type}</span>
              </h4>
            </div>
          )}

          {/* Price */}
          <p className="text-2xl font-bold text-green-600">₱{data?.price}</p>

          {/* Quantity + Add to Cart */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border rounded">
              <button
                className="px-3 py-1"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              >
                -
              </button>
              <input
                type="text"
                value={quantity}
                readOnly
                className="w-12 text-center border-l border-r"
              />
              <button
                className="px-3 py-1"
                onClick={() => setQuantity((prev) => prev + 1)}
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="bg-green-600 cursor-pointer text-white px-5 py-2 rounded hover:bg-green-700"
            >
              Request Service
            </button>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-semibold mb-2">Description</h4>
            <p className="text-gray-600">{data?.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
