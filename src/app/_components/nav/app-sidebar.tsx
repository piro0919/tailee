"use client";

import { Video } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useRecorder } from "@/hooks/use-recorder";
import { TABS } from "./tabs";

/**
 * デスクトップのメニュー。
 *
 * shadcn の Sidebar は幅が md を切ると Sheet に切り替わるが、
 * モバイルではフッターを出すので開く経路を持たせていない。
 */
export function AppSidebar() {
  const pathname = usePathname();
  const { overlay, start } = useRecorder();

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <span className="truncate px-2 pt-1 font-semibold text-lg tracking-tight group-data-[collapsible=icon]:hidden">
            Tailee
          </span>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                className="bg-primary font-medium text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
                onClick={start}
                tooltip="撮影する"
              >
                <Video />
                <span>撮影する</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

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

        {/* 畳んだ後に戻す手段。⌘B だけだと気付けない。 */}
        <SidebarFooter>
          <SidebarTrigger className="size-8" />
        </SidebarFooter>
      </Sidebar>

      {overlay}
    </>
  );
}
