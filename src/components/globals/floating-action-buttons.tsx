"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import FeedbackForm from "@/components/forms/feedback";
import ChatMain from "./chat-main";
import { IconMessage } from '@tabler/icons-react';

interface FloatingActionButtonsProps {
  userId: string;
  conversationId: string | null;
}

export default function FloatingActionButtons({
  userId,
  conversationId,
}: FloatingActionButtonsProps) {
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {/* Feedback Button */}
        <Button
          onClick={() => setFeedbackModalOpen(true)}
          className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all"
          variant="primary"
          size="icon"
          title="Share Feedback"
        >
          <MessageSquare className="w-6 h-6" />
        </Button>

        {/* Customer Service / Chat Button */}
        <Button
          onClick={() => setChatOpen(!chatOpen)}
          type="button"
          size="icon"
          className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all p-5 relative"
          title="Customer Service"
        >
          <IconMessage className="size-6" />
        </Button>
      </div>

      {/* Feedback Modal */}
      <Dialog open={feedbackModalOpen} onOpenChange={setFeedbackModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Share Your Feedback</DialogTitle>
          </DialogHeader>
          <FeedbackForm
            onClose={() => {
              setFeedbackModalOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Chat Modal - Controlled externally */}
      <ChatMain
        userId={userId}
        conversationId={conversationId}
        isOpen={chatOpen}
        onOpenChange={setChatOpen}
        hideButton={true}
      />
    </>
  );
}

