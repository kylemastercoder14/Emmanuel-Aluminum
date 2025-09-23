/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ArrowRight, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IconMessage } from "@tabler/icons-react";
import { Modal } from "./modal";
import { toast } from "sonner";
import { MessageWithProps } from "@/types/interface";
import { formatDistanceToNow } from "date-fns";
import { ChatSidebar } from "./chat-sidebar";

interface MessageBubbleProps {
  message: string;
  imageUrl?: string | null;
  isUserMessage: boolean;
  avatarSrc?: string;
  createdAt: string;
}

const MessageBubble = ({
  message,
  imageUrl,
  isUserMessage,
  avatarSrc,
  createdAt,
}: MessageBubbleProps) => (
  <div
    className={cn("flex items-start gap-3", isUserMessage ? "justify-end" : "")}
  >
    {!isUserMessage && (
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatarSrc || "/placeholder.svg"} alt="User Avatar" />
        <AvatarFallback>A</AvatarFallback>
      </Avatar>
    )}
    <div
      className={cn(
        "max-w-[70%] rounded-lg p-3",
        isUserMessage
          ? "rounded-br-none bg-blue-500 text-white"
          : "rounded-bl-none bg-gray-200 text-gray-800"
      )}
    >
      {message && <p className="text-sm">{message}</p>}
      {imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt="Message Attachment"
          className="rounded-lg max-w-full"
        />
      )}
      <span
        className={`block mt-1 text-xs ${
          isUserMessage ? "text-white" : "text-gray-500"
        }`}
      >
        {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
      </span>
    </div>
  </div>
);

const StaffChatMain = ({
  userId,
  staffId, // 👈 add staffId for staff accounts
  senderType, // 👈 "user" | "staff"
  conversationId,
  conversations,
}: {
  userId?: string; // optional if staff
  staffId?: string; // optional if user
  senderType: "user" | "staff";
  conversationId: string | null;
  conversations: any[];
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageWithProps[]>([]);
  const [activeId, setActiveId] = useState(conversationId);

  const activeConversation = conversations.find((c) => c.id === activeId);

  const [chatUser, setChatUser] = useState<{
    name: string;
    avatarSrc: string;
    status: string;
  }>({
    name: "Administrator",
    avatarSrc: "/placeholder.svg?height=40&width=40",
    status: "last seen recently",
  });

  // Fetch conversation messages
  useEffect(() => {
    if (!activeId) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages/${activeId}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages);

          if (data.conversation?.staff) {
            setChatUser({
              name: data.conversation.staff.name || "Staff",
              avatarSrc:
                data.conversation.staff.image ||
                "/placeholder.svg?height=40&width=40",
              status: "online",
            });
          } else if (data.conversation?.user) {
            setChatUser({
              name: data.conversation.user.name || "User",
              avatarSrc:
                data.conversation.user.image ||
                "/placeholder.svg?height=40&width=40",
              status: "online",
            });
          }
        }
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };

    fetchMessages();
  }, [activeId]);

  const handleSendText = async () => {
    if (!message || !activeId) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: message,
          conversationId: activeId,
          ...(senderType === "user" ? { userId } : { staffId }),
        }),
      });

      if (res.ok) {
        const newMsg = await res.json();
        setMessages((prev) => [...prev, newMsg]);
        setMessage("");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeId) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("conversationId", activeId);

    if (senderType === "user" && userId) {
      formData.append("userId", userId);
    } else if (senderType === "staff" && staffId) {
      formData.append("staffId", staffId);
    }

    const res = await fetch("/api/messages/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const newMsg = await res.json();
      setMessages((prev) => [...prev, newMsg]);
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <Modal
        className="!max-w-full !w-screen h-screen z-[105]"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <div className="w-full flex">
          <ChatSidebar
            conversations={conversations}
            activeId={activeId}
            onSelectConversation={setActiveId}
          />
          <div className="flex flex-1 h-[93vh] flex-col">
            {activeConversation ? (
              <>
                <div className="flex items-center justify-between border-b border-gray-200 p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={chatUser.avatarSrc || "/placeholder.svg"}
                        alt={chatUser.name}
                      />
                      <AvatarFallback>{chatUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="font-semibold text-gray-800">
                        {chatUser.name}
                      </h2>
                      <p className="text-sm text-gray-500">{chatUser.status}</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto p-6">
                  {messages.map((msg) => (
                    <MessageBubble
                      key={msg.id}
                      message={msg.content}
                      imageUrl={msg.imageUrl}
                      isUserMessage={
                        (senderType === "user" && msg.userId === userId) ||
                        (senderType === "staff" && msg.staffId === staffId) // ✅ staff check
                      }
                      avatarSrc={
                        msg.staff?.image || msg.user?.image || undefined
                      }
                      createdAt={
                        typeof msg.createdAt === "string"
                          ? msg.createdAt
                          : msg.createdAt.toISOString()
                      }
                    />
                  ))}
                </div>

                <div className="flex items-center gap-3 border-t border-gray-200 p-4">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  <ImageIcon
                    onClick={() => fileInputRef.current?.click()}
                    className="h-5 w-5 cursor-pointer text-gray-500"
                  />
                  <Input
                    value={message}
                    disabled={isLoading}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your message here..."
                    className="flex-1 border-none bg-gray-100 focus-visible:ring-0 focus-visible:ring-offset-0"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendText();
                      }
                    }}
                  />
                  <Button
                    variant="ghost"
                    onClick={handleSendText}
                    disabled={isLoading || !message}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center text-gray-400">
                Select a conversation to start chatting
              </div>
            )}
          </div>
        </div>
      </Modal>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        size="icon"
        className="fixed p-5 bottom-5 right-5 rounded-full"
      >
        <IconMessage className="size-6" />
        <div className="absolute -top-1 -right-1 bg-red-600 flex items-center justify-center size-4 rounded-full font-bold text-[8px]">
          {messages.filter((msg) => !msg.isRead).length}
        </div>
      </Button>
    </>
  );
};

export default StaffChatMain;
