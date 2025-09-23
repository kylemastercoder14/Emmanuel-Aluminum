/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { useAdmin } from "@/hooks/use-admin";
import { redirect } from "next/navigation";
import ChatSupport from "./chat-support";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const { staff } = await useAdmin();

  if (!staff) redirect("/admin");

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <main className="p-5">
          {children}

        </main>
      </SidebarInset>
      <ChatSupport />
    </SidebarProvider>
  );
};

export default AdminLayout;
