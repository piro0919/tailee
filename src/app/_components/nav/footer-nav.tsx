"use client";

import { Video } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRecorder } from "@/hooks/use-recorder";
import { TABS, type Tab } from "./tabs";

/**
 * モバイルのメニュー。デスクトップではサイドバーに代わるので出さない。
 *
 * 中央は撮影。突発的ないい場面のための経路なので、どの画面からでも一手で届く位置に置く。
 */
export function FooterNav() {
  const pathname = usePathname();
  const { overlay, start } = useRecorder();

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-10 border-t bg-background pb-[env(safe-area-inset-bottom)] md:hidden">
        <ul className="mx-auto flex w-full max-w-lg items-center">
          {TABS.slice(0, 2).map((tab) => (
            <FooterTab
              isActive={pathname === tab.href}
              key={tab.href}
              tab={tab}
            />
          ))}

          <li className="flex flex-1 justify-center">
            <button
              aria-label="撮影する"
              className="flex size-14 -translate-y-3 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
              onClick={start}
              type="button"
            >
              <Video className="size-6" />
            </button>
          </li>

          {TABS.slice(2).map((tab) => (
            <FooterTab
              isActive={pathname === tab.href}
              key={tab.href}
              tab={tab}
            />
          ))}
        </ul>
      </nav>

      {overlay}
    </>
  );
}

function FooterTab({ isActive, tab }: { isActive: boolean; tab: Tab }) {
  const Icon = tab.icon;

  return (
    <li className="flex-1">
      <Link
        aria-current={isActive ? "page" : undefined}
        className={`flex flex-col items-center gap-1 py-2 text-[10px] ${isActive ? "text-foreground" : "text-muted-foreground"}`}
        href={tab.href}
      >
        <Icon className="size-5" />
        {tab.label}
      </Link>
    </li>
  );
}
