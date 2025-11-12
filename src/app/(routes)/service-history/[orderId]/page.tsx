import React from "react";
import db from "@/lib/db";
import OrderDetails from './client';

const Page = async (props: {
  params: Promise<{
    orderId: string;
  }>;
}) => {
  const params = await props.params;

  const initialData = await db.orders.findUnique({
    where: {
      orderId: params.orderId,
    },
    include: {
      payments: true,
      orderItems: {
        include: {
          service: true,
        },
      },
    },
  });
  return <OrderDetails order={initialData} />;
};

export default Page;
