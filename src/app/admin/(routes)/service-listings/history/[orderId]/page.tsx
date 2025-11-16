import React from "react";
import db from "@/lib/db";
import ServiceDetails from "../_components/service-details";

const Page = async (props: {
  params: Promise<{
    orderId: string;
  }>;
}) => {
  const params = await props.params;
  const initialData = await db.orders.findUnique({
    where: {
      id: params.orderId,
    },
    include: {
      user: {
        include: {
          address: true,
          orders: true,
          notifications: true,
          conversation: true,
        },
      },
      payments: true,
      orderItems: {
        include: {
          service: {
            include: {
              serviceRatings: true,
            },
          },
        },
      },
    },
  });

  return <ServiceDetails order={initialData} />;
};

export default Page;
