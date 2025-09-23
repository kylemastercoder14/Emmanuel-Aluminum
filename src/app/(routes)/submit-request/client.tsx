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

    const fullAddress = {
      fullName: name,
      phoneNumber: contactNumber,
      address,
    };

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
      setIsOpen(false); // close modal
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
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={isLoading}
            >
              Submit
            </Button>
          </form>
        </div>
      </Modal>
      <div className="p-10 px-20 mt-20 mb-20 min-h-screen bg-gray-50">
        <h1 className="text-2xl font-bold mb-6">🛒 Submit Service Request</h1>
        <Separator className="my-4" />
        <div className="flex mb-6 items-center justify-between">
          <h1 className="text-xl font-semibold">Delivery Address</h1>
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
          <div className="space-y-1">
            <p className="font-semibold">{user.address[0]?.fullName}</p>
            <p>{user.address[0]?.phoneNumber}</p>
            <p>{user.address[0]?.address}</p>
          </div>
        ) : (
          <p className="text-gray-500">No address added yet</p>
        )}

        {/* Header */}
        <div className="grid grid-cols-5 mt-5 font-semibold border-b pb-2 text-gray-700">
          <span className="col-span-2">Product</span>
          <span>Unit Price</span>
          <span>Quantity</span>
          <span className="text-right">Sub-total</span>
        </div>

        {/* Items */}
        {selectedForCheckout.length === 0 ? (
          <div className="py-10 text-center text-gray-500">
            Please add cart item first.
          </div>
        ) : (
          selectedForCheckout.map((item) => {
            const key = `${item.id}-${item.color}`;
            return (
              <div
                key={key}
                className="grid grid-cols-5 items-center border-b py-4"
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
                  </div>
                </div>

                {/* Price */}
                <span>₱{item.price.toLocaleString()}</span>

                {/* Quantity */}
                <span>{item.quantity}</span>

                {/* Sub-total */}
                <span className="text-right">
                  ₱{(item.quantity * item.price).toLocaleString()}
                </span>
              </div>
            );
          })
        )}

        <div className="flex flex-col items-start justify-start w-[320px] mt-5 ml-auto space-y-4">
          <div className="flex w-full items-center justify-between gap-2">
            <p className="font-medium">Sub-total</p>
            <p>₱{total.toLocaleString()}</p>
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
            <p className="font-medium">Total Amount</p>
            <p>₱{total.toLocaleString()}</p>
          </div>
        </div>

        {/* Footer */}
        {selectedForCheckout.length > 0 && (
          <div className="flex justify-end border-t items-center mt-6 pt-4">
            <div className="flex items-center gap-6">
              <p className="font-medium">
                Total ({selectedForCheckout.length} item
                {selectedForCheckout.length > 1 ? "s" : ""}):{" "}
                <span className="text-lg font-bold text-green-600">
                  ₱{total.toLocaleString()}
                </span>
              </p>
              <Button
                onClick={handleCheckout}
                disabled={isSubmitting || !user?.address?.length}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Submit Request
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CheckoutPage;
