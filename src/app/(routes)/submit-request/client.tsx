"use client";

import React, { useState } from "react";
import Image from "next/image";
import useCart from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/globals/modal";
import Heading from "@/components/globals/heading";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { UserWithProps } from "@/types/interface";
import { toast } from "sonner";
import { addOrUpdateAddress } from "@/actions/user";
import { submitOrder } from "@/actions/order";

const CheckoutPage = ({ user }: { user: UserWithProps | null }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState(user?.address?.[0]?.fullName ?? "");
  const [contactNumber, setContactNumber] = useState(
    user?.address?.[0]?.phoneNumber ?? ""
  );
  const [address, setAddress] = useState(user?.address?.[0]?.address ?? "");

  const { selectedForCheckout, removeAll } = useCart();

  const total = selectedForCheckout.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleSubmitAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const fullAddress = { fullName: name, phoneNumber: contactNumber, address };

    try {
      const response = await addOrUpdateAddress(
        user?.id as string,
        fullAddress
      );
      if (response.error) {
        toast.error(response.error);
        return;
      }
      toast.success("Address saved successfully");
      setIsOpen(false);
      router.refresh();
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (selectedForCheckout.length === 0) {
      toast.error("Please add items to your cart before checking out.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await submitOrder(
        user?.id as string,
        selectedForCheckout,
        total
      );
      if (response.error) {
        toast.error(response.error);
        return;
      }
      router.push(`/order-history/${response.orderId}`);
      toast.success("Checkout successful!");
      removeAll();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div>
          <Heading title="Delivery Address" description="" />
          <form onSubmit={handleSubmitAddress} className="space-y-6 mt-5">
            <div className="space-y-2">
              <Label>
                Full Name <span className="text-red-600">*</span>
              </Label>
              <Input
                placeholder="Enter your full name"
                required
                value={name}
                disabled={isLoading}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>
                Contact Number <span className="text-red-600">*</span>
              </Label>
              <Input
                placeholder="Enter your contact number"
                required
                disabled={isLoading}
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>
                Address <span className="text-red-600">*</span>
              </Label>
              <Textarea
                placeholder="Enter your address"
                required
                disabled={isLoading}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
              disabled={isLoading}
            >
              Submit
            </Button>
          </form>
        </div>
      </Modal>

      <div className="px-4 sm:px-10 lg:py-10 py-30 min-h-screen bg-gray-50">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">
          🛒 Submit Service Request
        </h1>

        <Separator className="my-4" />

        {/* Delivery Address */}
        <div className="flex flex-col sm:flex-row justify-between mb-6 items-start sm:items-center">
          <h2 className="text-xl font-semibold mb-2 sm:mb-0">
            Delivery Address
          </h2>
          <Button
            size="lg"
            variant="link"
            className="!pr-0"
            onClick={() => setIsOpen(true)}
          >
            {user?.address?.length ? "Change Address" : "Add Address"}
          </Button>
        </div>

        {user?.address?.length ? (
          <div className="space-y-1 mb-5">
            <p className="font-semibold">{user.address[0]?.fullName}</p>
            <p>{user.address[0]?.phoneNumber}</p>
            <p>{user.address[0]?.address}</p>
          </div>
        ) : (
          <p className="text-gray-500 mb-5">No address added yet</p>
        )}

        {/* Header */}
        <div className="hidden md:grid grid-cols-5 font-semibold border-b pb-2 text-gray-700">
          <span className="col-span-2">Product</span>
          <span>Unit Price</span>
          <span>Quantity</span>
          <span className="text-right">Sub-total</span>
        </div>

        {/* Items */}
        {selectedForCheckout.length === 0 ? (
          <div className="py-10 text-gray-500">Please add cart item first.</div>
        ) : (
          selectedForCheckout.map((item) => {
            const key = `${item.id}-${item.color}`;
            return (
              <div
                key={key}
                className="flex flex-col md:grid md:grid-cols-5 items-start border-b py-4 gap-4 md:gap-0"
              >
                {/* Product */}
                <div className="flex items-start gap-4 col-span-2">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="rounded border"
                  />
                  <div>
                    <p className="font-medium text-sm sm:text-base">
                      {item.name}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {item.color}
                    </p>
                  </div>
                </div>

                {/* Price */}
                <span className="text-sm sm:text-base">
                  ₱{item.price.toLocaleString()}
                </span>

                {/* Quantity */}
                <span className="text-sm sm:text-base">{item.quantity}</span>

                {/* Sub-total */}
                <span className="text-sm sm:text-base text-right">
                  ₱{(item.quantity * item.price).toLocaleString()}
                </span>
              </div>
            );
          })
        )}

        {/* Summary */}
        <div className="flex flex-col sm:flex-row justify-end mt-5 gap-4 sm:gap-10">
          <div className="flex flex-col w-full sm:w-[320px] space-y-2">
            <div className="flex justify-between">
              <span>Sub-total</span>
              <span>₱{total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>VAT</span>
              <span>₱0</span>
            </div>
            <div className="flex justify-between">
              <span>Discounts</span>
              <span>₱0</span>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total Amount</span>
              <span>₱{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        {selectedForCheckout.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-end border-t items-center mt-6 pt-4 gap-3 sm:gap-6">
            <p className="font-medium text-center sm:text-left">
              Total ({selectedForCheckout.length} item
              {selectedForCheckout.length > 1 ? "s" : ""}):{" "}
              <span className="text-lg font-bold text-green-600">
                ₱{total.toLocaleString()}
              </span>
            </p>
            <Button
              onClick={handleCheckout}
              disabled={isSubmitting || !user?.address?.length}
              className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
            >
              Submit Request
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default CheckoutPage;
