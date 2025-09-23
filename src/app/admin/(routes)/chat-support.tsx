import React from "react";
import { useAdmin } from "@/hooks/use-admin";
import StaffChatMain from "@/components/globals/staff-chat-main";
import { getConversationsForStaff } from "@/hooks/use-get-conversation";

const ChatSupport = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { staffId } = await useAdmin();

  if (!staffId) return <p>Unauthorized</p>;

  const conversations = await getConversationsForStaff(staffId);

  // pick first conversation if exists
  const conversationId = conversations[0]?.id ?? null;
  return (
    <StaffChatMain
      staffId={staffId}
      senderType='staff'
      conversationId={conversationId}
      conversations={conversations}
    />
  );
};

export default ChatSupport;
