import React from "react";
import { useUser } from "@/hooks/use-user";
import NotificationPage from "./client";

const Page = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = await useUser();
  return <NotificationPage notifications={user?.notifications} />;
};

export default Page;
