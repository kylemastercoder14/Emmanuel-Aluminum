"use client";

import * as React from "react";
import {
  IconCalculator,
  IconFolders,
  IconLogout,
  IconShoppingBag,
  IconUsers,
  IconStar,
  IconMessageCircle,
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
  navMainAdmin: [
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
    {
      title: "Service Ratings",
      url: "/admin/service-ratings",
      icon: IconStar,
    },
    {
      title: "Feedbacks",
      url: "/admin/feedbacks",
      icon: IconMessageCircle,
    },
  ],
  navMainStaff: [
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
  ],
  navMainCS: [
    {
      title: "Service Listings",
      url: "#",
      icon: IconShoppingBag,
      items: [
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
      title: "Service Quotation",
      url: "/admin/service-quotation",
      icon: IconCalculator,
    },
    {
      title: "Service Ratings",
      url: "/admin/service-ratings",
      icon: IconStar,
    },
    {
      title: "Feedbacks",
      url: "/admin/feedbacks",
      icon: IconMessageCircle,
    },
  ],
};

export function AppSidebar({
  role,
  name,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  role: string;
  name: string;
}) {
  const pathname = usePathname();
  const handleLogout = async () => {
    await signOut();
    window.location.href = "/admin";
    toast.success("Logged out successfully");
  };
  let routes;
  switch (role) {
    case "Admin":
      routes = data.navMainAdmin;
      break;
    case "Staff":
      routes = data.navMainStaff;
      break;
    case "Customer Service":
      routes = data.navMainCS;
      break;
    default:
      routes = data.navMainStaff;
      break;
  }

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
          Welcome, {name}
        </h3>
        <NavMain role={role} items={routes} pathname={pathname} />
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
