"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";
import { OrderWithOrderItems } from "@/types/interface";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const OrderDetails = ({ order }: { order: OrderWithOrderItems | null }) => {
  const router = useRouter();
  return (
    <div className="min-h-screen lg:pt-20 pt-30 lg:p-10 mb-20 lg:px-20 px-8 bg-gray-50">
      <div className="flex items-center gap-2 mb-6">
        <Button
          title="Go back"
          variant="ghost"
          size="icon"
          onClick={() => router.push("/order-history")}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <h1 className="text-2xl font-bold">Service Details</h1>
      </div>
      <Separator className="my-4" />
      <div className="space-y-6">
        {order?.orderItems.map((item) => {
          return (
            <div key={item.id} className="gap-y-6 w-full flex flex-col">
              <div className="flex items-center gap-2">
                <Image width={30} height={30} alt="Logo" src="/logo.png" />
                <p className="font-medium">{item.service.category}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative size-32">
                  <Image
                    fill
                    alt="Service Image"
                    src={item.service.images[0] || "/placeholder.png"}
                    className="size-full object-cover"
                  />
                </div>
                <div className="w-full">
                  <h3 className="font-semibold text-xl">{item.service.name}</h3>
                  <div className="mt-2 w-full flex items-center justify-between">
                    <p className="text-lg font-medium">
                      ₱{item.service.price.toLocaleString()}
                    </p>
                    <p className="font-medium text-lg">Qty: {item.quantity}</p>
                  </div>
                  {order?.status === "Completed" && (
                    <Button className="mt-4 ml-auto block justify-end bg-green-600 hover:bg-green-700 text-white">
                      To Review
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 border-t">
        <h1 className="text-xl font-bold mt-6 mb-6">Order Summary</h1>
        <div className="flex flex-col items-start justify-start space-y-4">
          <div className="flex w-full items-center justify-between gap-2">
            <p className="font-medium">Sub-total</p>
            <p>₱{order?.totalAmount.toLocaleString()}</p>
          </div>
          <div className="flex w-full items-center justify-between gap-2">
            <p className="font-medium">VAT</p>
            <p>₱0</p>
          </div>
          <div className="flex w-full items-center justify-between gap-2">
            <p className="font-medium">Discounts</p>
            <p>₱0</p>
          </div>
          <div className="flex w-full items-center justify-between gap-2">
            <p className="font-bold">Total Amount</p>
            <p className="font-bold">₱{order?.totalAmount.toLocaleString()}</p>
          </div>
        </div>
      </div>
      <div className="mt-6 border-t">
        <div className="flex flex-col items-start justify-start mt-6 space-y-4">
          <div className="flex w-full items-center justify-between gap-2">
            <p className="font-bold">Order No.</p>
            <p className="font-bold">{order?.orderId}</p>
          </div>
          <div className="flex w-full items-center justify-between gap-2">
            <p className="font-medium">Date Ordered:</p>
            <p>{order?.createdAt.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
