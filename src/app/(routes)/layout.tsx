/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import FloatingActionButtons from "@/components/globals/floating-action-buttons";
import { useUser } from "@/hooks/use-user";
import db from "@/lib/db";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const { user, userId } = await useUser();
  // Only fetch order count if userId exists
  const orderCount = userId
    ? await db.orders.count({
        where: {
          userId: userId,
        },
      })
    : 0;

  // Get conversation ID for chat
  const conversationId = user?.conversation?.[0]?.id ?? null;

  return (
    <div>
      <Navbar orderCount={orderCount} user={user} />
      {children}
      {/* Footer Section */}
      <Footer />
      {userId && (
        <FloatingActionButtons
          userId={userId}
          conversationId={conversationId}
        />
      )}
    </div>
  );
};

export default MainLayout;
