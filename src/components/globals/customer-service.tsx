import React from "react";
import ChatMain from "./chat-main";
import { useUser } from "@/hooks/use-user";

const CustomerService = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { userId, user } = await useUser();

  // pick first conversation if exists, otherwise null
  const conversationId = user?.conversation?.[0]?.id ?? null;
  return (
    <ChatMain
      userId={userId as string}
      conversationId={conversationId}
    />
  );
};

export default CustomerService;
