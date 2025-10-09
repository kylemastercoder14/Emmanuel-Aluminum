"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "@/actions/auth";
import { toast } from "sonner";

const LogoutButton = () => {
  const handleLogout = async () => {
    await signOut();
    toast.success("Logout successfully");
    window.location.assign("/");
  };
  return (
    <Button onClick={handleLogout}>
      <LogOut className="size-4" />
      Logout
    </Button>
  );
};

export default LogoutButton;
