"use client";

import React from "react";
import Image from "next/image";
import { OrderWithOrderItems } from "@/types/interface";
import { useRouter } from "next/navigation";
import Heading from "@/components/globals/heading";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ServiceDetailsProps {
  order: OrderWithOrderItems | null;
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({ order }) => {
  const router = useRouter();
  if (!order) return <p>No order found.</p>;

  // Compute subtotal (sum of item.price * quantity)
  const subtotal = order.orderItems.reduce(
    (sum, item) => sum + Number(item.unitPrice) * Number(item.quantity),
    0
  );

  return (
    <div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="size-4" />
        </Button>
        <Heading title={"Service Details"} description={""} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Left Column: Order & Customer Info */}
        <div className="space-y-6">
          {/* Order Info */}
          <div className="p-5 border rounded-xl bg-white shadow-sm">
            <h2 className="text-lg font-semibold mb-3">Order Information</h2>
            <p>
              Status: <span className="font-medium">{order.status}</span>
            </p>
            <p>Payment Method: {order.paymentMethod}</p>
            <p>
              Scheduled: {order.scheduledDate ?? "Not scheduled"}{" "}
              {order.scheduledTime && `at ${order.scheduledTime}`}
            </p>
            <p>Total Amount: ₱{order.totalAmount.toLocaleString()}</p>

            {/* ✅ Show Total Discount if any */}
            <p>
              Total Discounts: ₱{(order.totalDiscount ?? 0).toLocaleString()}
            </p>

            {/* ✅ Show Senior/PWD info */}
            {order.isSeniorOrPwd && (
              <div className="mt-3">
                <p className="font-medium">Senior/PWD ID:</p>
                <div className="flex flex-wrap gap-3 mt-2">
                  {order.seniorPwdId?.length > 0 ? (
                    order.seniorPwdId.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative w-28 h-28 border rounded-lg overflow-hidden"
                      >
                        <Image
                          src={img}
                          alt={`Senior/PWD ID ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No Senior/PWD ID uploaded
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Customer Info */}
          <div className="p-5 border rounded-xl bg-white shadow-sm">
            <h2 className="text-lg font-semibold mb-3">Customer</h2>
            <p>Name: {order.user?.name}</p>
            <p>Email: {order.user?.email}</p>
            <p>Phone: {order.user?.phoneNumber}</p>
          </div>
        </div>

        {/* Right Column: Order Items */}
        <div className="p-5 border rounded-xl bg-white shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Order Details</h2>
          <div className="space-y-4">
            {order.orderItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 border-b pb-4 last:border-b-0"
              >
                {/* Service Image */}
                <div className="w-24 h-24 relative rounded-md overflow-hidden">
                  <Image
                    src={item.service.images[0]}
                    alt={item.service.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Service Info */}
                <div className="w-[80%]">
                  <h3 className="text-md font-semibold">{item.service.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {item.service.description}
                  </p>
                  <p className="mt-2">
                    Color: <span className="font-medium">{item.color}</span>
                  </p>
                  <p>Quantity: {item.quantity}</p>
                  <p>
                    Unit Price: ₱{Number(item.unitPrice).toLocaleString()}
                  </p>
                  <p className="font-medium mt-1">
                    Total: ₱
                    {(
                      Number(item.unitPrice) * Number(item.quantity)
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-6 border-t pt-4 space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₱{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Discounts</span>
              <span>₱{(order.totalDiscount ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-semibold text-base">
              <span>Total</span>
              <span>₱{order.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
