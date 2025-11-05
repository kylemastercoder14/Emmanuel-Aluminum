"use client";

import { Service } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import useCart from "@/hooks/use-cart";
import { toast } from 'sonner';
import { StarRating } from "@/components/ui/star-rating";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface ServiceRating {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
}

interface RatingsData {
  ratings: ServiceRating[];
  averageRating: number;
  totalRatings: number;
}

const ServiceDetails = ({ data }: { data: Service | null }) => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string>(
    data?.images[0] || ""
  );
  const [selectedColor, setSelectedColor] = useState<string | null>(
    data?.colors[0] || null
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [ratingsData, setRatingsData] = useState<RatingsData | null>(null);
  const [isLoadingRatings, setIsLoadingRatings] = useState(false);

  const { addItem, updateQuantity, items } = useCart();

  // Fetch ratings for this service
  useEffect(() => {
    if (!data?.id) return;

    const fetchRatings = async () => {
      setIsLoadingRatings(true);
      try {
        const res = await fetch(`/api/ratings/service/${data.id}`);
        if (res.ok) {
          const data = await res.json();
          setRatingsData(data);
        }
      } catch (error) {
        console.error("Error fetching ratings:", error);
      } finally {
        setIsLoadingRatings(false);
      }
    };

    fetchRatings();
  }, [data?.id]);

  if (!data) {
    router.push("/");
    return null;
  }

  const handleAddToCart = () => {
    // If service has colors but none selected
    if (data.colors?.length && !selectedColor) {
      toast.error("Please select a color before adding to cart");
      return;
    }

    // Check if item already exists in cart
    const existingItem = items.find(
      (item) =>
        item.id === data.id &&
        (!data.colors?.length || item.color === selectedColor)
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
        color: selectedColor || "",
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

      {/* Ratings Section */}
      <div className="mt-12 border-t pt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold mb-2">Customer Reviews</h3>
            {ratingsData && ratingsData.totalRatings > 0 ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold">
                    {ratingsData.averageRating}
                  </span>
                  <StarRating
                    rating={Math.round(ratingsData.averageRating)}
                    readonly={true}
                    size={20}
                  />
                </div>
                <span className="text-gray-600">
                  Based on {ratingsData.totalRatings} review
                  {ratingsData.totalRatings !== 1 ? "s" : ""}
                </span>
              </div>
            ) : (
              <p className="text-gray-600">No reviews yet</p>
            )}
          </div>
        </div>

        {isLoadingRatings ? (
          <div className="text-center py-8 text-gray-500">Loading reviews...</div>
        ) : ratingsData && ratingsData.ratings.length > 0 ? (
          <div className="space-y-6">
            {ratingsData.ratings.map((rating) => (
              <div
                key={rating.id}
                className="border rounded-lg p-4 bg-gray-50"
              >
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={rating.user.image || "/placeholder.svg"}
                      alt={rating.user.name}
                    />
                    <AvatarFallback>
                      {rating.user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold">{rating.user.name}</p>
                        <p className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(rating.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      <StarRating
                        rating={rating.rating}
                        readonly={true}
                        size={18}
                      />
                    </div>
                    {rating.comment && (
                      <p className="text-gray-700 mt-2">{rating.comment}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No reviews yet. Be the first to review this service!
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceDetails;
