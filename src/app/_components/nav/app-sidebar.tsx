"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { TABS } from "./tabs";

/**
 * デスクトップのメニュー。
 *
 * shadcn の Sidebar は幅が md を切ると Sheet に切り替わるが、
 * モバイルではフッターを出すので開く経路を持たせていない。
 *
 * 撮影はヘッダーにあるので、ここには置かない。
 */
export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="top-14! h-[calc(100svh-3.5rem)]!" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {TABS.map((tab) => (
                <SidebarMenuItem key={tab.href}>
                  <SidebarMenuButton
                    asChild={true}
                    isActive={pathname === tab.href}
                    tooltip={tab.label}
                  >
                    <Link href={tab.href}>
                      <tab.icon />
                      <span>{tab.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
