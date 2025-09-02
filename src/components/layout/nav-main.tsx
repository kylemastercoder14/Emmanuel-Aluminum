"use client";

import { IconChartHistogram, type Icon } from "@tabler/icons-react";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function NavMain({
  items,
  pathname,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
  pathname: string;
}) {
  const router = useRouter();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        {/* Static Dashboard link */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton isActive={pathname === "/admin/dashboard"} onClick={() => router.push("/admin/dashboard")}>
              <div className="flex size-5 rounded-full items-center bg-sky-300 justify-center">
                <IconChartHistogram className="size-3 text-black" />
              </div>
              <span>Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Dynamic menu items */}
        <SidebarMenu>
          <SidebarGroupLabel className="text-white">
            Interface
          </SidebarGroupLabel>
          {items.map((item) => {
            const hasSubMenu = item.items && item.items.length > 0;

            if (hasSubMenu) {
              return (
                <Collapsible
                  defaultOpen={
                    item.url === pathname ||
                    pathname.startsWith(item.url) ||
                    item.items?.some((sub) => pathname.startsWith(sub.url))
                  }
                  key={item.title}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="flex cursor-pointer items-center">
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                  </SidebarMenuItem>
                  <CollapsibleContent>
                    <SidebarMenu className="ml-2 mt-1">
                      {item.items?.map((sub) => (
                        <SidebarMenuItem key={sub.title}>
                          <SidebarMenuButton
                            asChild
                            isActive={
                              sub.url === pathname
                            }
                          >
                            <a href={sub.url}>{sub.title}</a>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </CollapsibleContent>
                </Collapsible>
              );
            }

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={
                    item.url === pathname || pathname.startsWith(item.url)
                  }
                >
                  <a href={item.url} className="flex items-center">
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
