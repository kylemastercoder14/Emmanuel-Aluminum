import React from "react";
import { useUser } from "@/hooks/use-user";
import CheckoutPage from "./client";

const Page = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = await useUser();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg">You need to be logged in to access this page.</p>
      </div>
    );
  }

  return <CheckoutPage user={user} />;
};

export default Page;
