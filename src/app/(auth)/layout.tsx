/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import Navbar from "@/components/layout/navbar";
import { useUser } from "@/hooks/use-user";
import db from "@/lib/db";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const { user, userId } = await useUser();
  // Only fetch order count if userId exists
  const orderCount = userId
    ? await db.orders.count({
        where: {
          userId: userId,
        },
      })
    : 0;
  return (
    <div>
      <Navbar orderCount={orderCount} user={user} />
      {children}
    </div>
  );
};

export default AuthLayout;
