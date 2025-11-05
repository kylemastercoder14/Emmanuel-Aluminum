"use client";

import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: number;
  className?: string;
}

export function StarRating({
  rating,
  onRatingChange,
  readonly = false,
  size = 24,
  className,
}: StarRatingProps) {
  const handleClick = (value: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => handleClick(value)}
          disabled={readonly}
          className={cn(
            "transition-colors",
            !readonly && "cursor-pointer hover:scale-110",
            readonly && "cursor-default"
          )}
        >
          <Star
            size={size}
            className={cn(
              value <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            )}
          />
        </button>
      ))}
    </div>
  );
}

