"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import FeedbackForm from "@/components/forms/feedback";

export default function FeedbackButton() {
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setFeedbackModalOpen(true)}
        className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all"
        variant="primary"
        size="icon"
      >
        <MessageSquare className="w-6 h-6" />
      </Button>

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
    </>
  );
}

