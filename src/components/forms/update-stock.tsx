"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { updateStockQuantity } from "@/actions/material";

const UpdateStock = ({ id, stock }: { id: string; stock: number }) => {
  const router = useRouter();
  const [value, setValue] = useState<number>(stock);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Run the promise with toast
      const response = toast.promise(updateStockQuantity(id, value), {
        loading: `Saving ${value}...`,
        success: "Stock updated successfully",
        error: "Failed to update stock",
      });

      // response is the actual return of updateStockQuantity
      if ("success" in response) {
        router.refresh();
      }
    } catch {
      toast.error("Failed to update stock");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Label htmlFor={`${id}-stock`} className="sr-only">
        Stock
      </Label>
      <Input
        type="number"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        onBlur={handleSubmit} // 🔹 optional: auto-save when leaving input
        className="hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent text-left shadow-none focus-visible:border dark:bg-transparent"
        id={`${id}-stock`}
      />
    </form>
  );
};

export default UpdateStock;
