"use client";

import * as React from "react";
import {
  IconCalculator,
  IconFolders,
  IconLogout,
  IconShoppingBag,
  IconUsers,
} from "@tabler/icons-react";

import { NavMain } from "@/components/layout/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Logo from "@/components/globals/logo";
import { usePathname } from "next/navigation";
import { signOut } from "@/actions/auth";
import { toast } from "sonner";

const data = {
  navMain: [
    {
      title: "User",
      url: "/admin/users",
      icon: IconUsers,
    },
    {
      title: "Service Listings",
      url: "#",
      icon: IconShoppingBag,
      items: [
        {
          title: "Service Creation",
          url: "/admin/service-listings",
        },
        {
          title: "Service History",
          url: "/admin/service-listings/history",
        },
        {
          title: "Service Schedule",
          url: "/admin/service-listings/schedule",
        },
        {
          title: "Service Cancellation",
          url: "/admin/service-listings/cancellation",
        },
      ],
    },
    {
      title: "Project Tracking",
      url: "/admin/project-tracking",
      icon: IconFolders,
    },
    {
      title: "Service Quotation",
      url: "/admin/service-quotation",
      icon: IconCalculator,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const handleLogout = async () => {
    await signOut();
    window.location.href = "/admin";
    toast.success("Logged out successfully");
  };
  return (
    <Sidebar
      className="bg-[#525252] text-white"
      collapsible="offcanvas"
      {...props}
    >
      <SidebarHeader className="bg-[#525252] text-white">
        <Logo withText />
      </SidebarHeader>
      <SidebarContent className="bg-[#525252] text-white">
        <h3 className="text-white font-semibold text-lg mt-5 ml-4">
          Welcome Admin
        </h3>
        <NavMain items={data.navMain} pathname={pathname} />
      </SidebarContent>
      <SidebarFooter className="bg-[#525252]">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="hover:bg-transparent hover:text-white cursor-pointer"
            >
              <IconLogout className="size-5 text-white hover:text-black" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
