"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { OrderWithOrderItems } from "@/types/interface";
import { Badge } from "@/components/ui/badge";

const OrderHistoryPage = ({ orders }: { orders: OrderWithOrderItems[] }) => {
  const router = useRouter();

  return (
    <div className="p-10 px-20 mt-20 mb-20 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Request Service History</h1>

      {/* Header */}
      <div className="grid grid-cols-8 font-semibold border-b pb-2 text-gray-700">
        <span className='col-span-2'>Order No.</span>
        <span className="col-span-2">Products / Services</span>
        <span>Total Amount</span>
        <span>Payment Method</span>
        <span>Status</span>
        <span className="text-right">Actions</span>
      </div>

      {/* Items */}
      {orders.length === 0 ? (
        <div className="py-10 text-center text-gray-500">
          Your order history is empty
        </div>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            className="grid grid-cols-8 items-start border-b py-4"
          >
            {/* Order No. */}
            <span className='col-span-2'>{order.orderId}</span>

            {/* Products / Services */}
            <div className="col-span-2 space-y-3">
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <Image
                    src={item.service.images[0]}
                    alt={item.service.name}
                    width={80}
                    height={80}
                    className="rounded border"
                  />
                  <div>
                    <p className="font-medium">{item.service.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.color} • {item.quantity} pcs
                    </p>
                    <p className="text-sm">₱{item.unitPrice}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Amount */}
            <span>₱{order.totalAmount.toLocaleString()}</span>

            {/* Payment Method */}
            <span>{order.paymentMethod}</span>

            {/* Status */}
            <Badge
              variant={order.status === "Completed" ? "success" : "default"}
            >
              {order.status}
            </Badge>

            {/* Actions */}
            <div className="text-right">
              <Button
                size="sm"
                variant="ghost"
				className='bg-green-600 hover:bg-green-700 text-white'
                onClick={() => router.push(`/order-history/${order.orderId}`)}
              >
                View Details
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistoryPage;
