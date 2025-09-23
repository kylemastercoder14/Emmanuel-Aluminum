import React from "react";
import db from "@/lib/db";
import { useUser } from "@/hooks/use-user";
import OrderHistoryPage from "./client";

const Page = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = await useUser();
  const data = await db.orders.findMany({
    where: {
      userId: user?.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      orderItems: {
        include: {
          service: true,
        },
      },
    },
  });
  return <OrderHistoryPage orders={data} />;
};

export default Page;
