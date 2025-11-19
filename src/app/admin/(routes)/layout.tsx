/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { useAdmin } from "@/hooks/use-admin";
import { redirect } from "next/navigation";
import ChatSupport from "./chat-support";
import { SiteHeader } from "@/components/layout/app-header";

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
      <AppSidebar variant="sidebar" name={staff.firstName} role={staff.role} />
      <SidebarInset>
        <SiteHeader />
        <main className="p-5">{children}</main>
      </SidebarInset>
      {staff.role === "Customer Service" && <ChatSupport />}
    </SidebarProvider>
  );
};

export default AdminLayout;
