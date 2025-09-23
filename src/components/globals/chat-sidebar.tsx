/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search } from "lucide-react";
import { cn, formatCompactTime } from "@/lib/utils";
import { useRouter } from 'next/navigation';

interface ChatContactProps {
  id: string;
  name: string;
  avatarSrc: string;
  lastMessage: string;
  timestamp: string;
  hasUnread: boolean;
  isActive: boolean;
  onClick: (id: string) => void;
}

interface ChatSidebarProps {
  conversations: any[];
  activeId: string | null;
  onSelectConversation: (id: string) => void;
}

const ChatContact = ({
  id,
  name,
  avatarSrc,
  lastMessage,
  timestamp,
  hasUnread,
  isActive,
  onClick,
}: ChatContactProps) => (
  <div
    className={cn(
      "flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors",
      isActive ? "bg-muted" : "bg-transparent hover:bg-muted/50"
    )}
    onClick={() => onClick(id)}
  >
    <Avatar>
      <AvatarImage src={avatarSrc} alt={name} />
      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
    </Avatar>
    <div className="flex-1">
      <div className="flex items-center justify-between">
        <span className="font-medium">{name}</span>
        <span className="text-muted-foreground text-xs">{timestamp}</span>
      </div>
      <div className="text-muted-foreground flex items-center justify-between text-sm">
        <p className="truncate w-60">{lastMessage}</p>
        {!isActive && hasUnread && (
          <div className="ml-2 h-2 w-2 rounded-full bg-blue-500" />
        )}
      </div>
    </div>
  </div>
);

export function ChatSidebar({
  conversations,
  activeId,
  onSelectConversation,
}: ChatSidebarProps) {
  const router = useRouter();
  const handleSelect = async (id: string) => {
    try {
      await fetch(`/api/messages/${id}/read`, { method: "PATCH" });
      router.refresh();
    } catch (error) {
      console.error("Failed to mark messages as read:", error);
    }

    // Pass up to parent (to change activeId)
    onSelectConversation(id);
  };
  return (
    <div className="flex w-96 h-[93vh] flex-col border-r p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Chat Support</h1>
        <Search className="text-muted-foreground h-5 w-5 cursor-pointer" />
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto pr-2">
        {conversations.map((convo) => {
          const lastMsg = convo.messages[0];
          const isActive = activeId === convo.id;
          const hasUnread = lastMsg ? !lastMsg.isRead && !isActive : false;

          return (
            <ChatContact
              key={convo.id}
              id={convo.id}
              name={convo.user?.name ?? "Unknown User"}
              avatarSrc={convo.user?.image || "/placeholder.svg"}
              lastMessage={lastMsg?.content || "[Image]"}
              timestamp={
                lastMsg ? formatCompactTime(new Date(lastMsg.createdAt)) : ""
              }
              hasUnread={hasUnread}
              isActive={isActive}
              onClick={handleSelect}
            />
          );
        })}
      </div>
    </div>
  );
}
