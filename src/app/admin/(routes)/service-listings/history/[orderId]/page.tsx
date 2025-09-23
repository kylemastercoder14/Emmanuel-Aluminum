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
      user: true,
      orderItems: {
        include: {
          service: true,
        },
      },
    },
  });

  return <ServiceDetails order={initialData} />;
};

export default Page;
