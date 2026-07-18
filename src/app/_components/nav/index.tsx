"use client";

import { House, Radio, User, Users, Video } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { addRecording } from "@/lib/recordings";
import { Recorder, type Recording } from "../recorder";

/**
 * モバイルのフッターメニュー。
 *
 * 中央は撮影。突発的ないい場面のための経路なので、どの画面からでも一手で届く位置に置く。
 * アルバムのタブは、提供の仕方が決まるまで置かない（中身の無いタブになるため）。
 */

const TABS = [
  { href: "/", icon: House, label: "ホーム" },
  { href: "/live", icon: Radio, label: "ライブ" },
  { href: "/social", icon: Users, label: "みんな" },
  { href: "/me", icon: User, label: "マイページ" },
] as const;

/** 撮った時刻を、仮データと同じ「タイムゾーンを持たない壁時計」の形に揃える。 */
function wallClockNow(): string {
  const now = new Date(Date.now());
  const pad = (value: number) => String(value).padStart(2, "0");

  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

export function Nav() {
  const pathname = usePathname();
  const [isRecording, setIsRecording] = useState(false);

  const handleRecorded = useCallback((recording: Recording) => {
    addRecording({
      at: wallClockNow(),
      caption: "撮影",
      durationSec: recording.durationSec,
      id: crypto.randomUUID(),
      kind: "video",
      src: recording.src,
      tone: "warm",
    });
    setIsRecording(false);
  }, []);

  const handleCancel = useCallback(() => {
    setIsRecording(false);
  }, []);

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 border-t bg-background pb-[env(safe-area-inset-bottom)]">
        <ul className="mx-auto flex w-full max-w-lg items-center">
          {TABS.slice(0, 2).map((tab) => (
            <Tab isActive={pathname === tab.href} key={tab.href} tab={tab} />
          ))}

          <li className="flex flex-1 justify-center">
            <button
              aria-label="撮影する"
              className="flex size-14 -translate-y-3 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
              onClick={() => setIsRecording(true)}
              type="button"
            >
              <Video className="size-6" />
            </button>
          </li>

          {TABS.slice(2).map((tab) => (
            <Tab isActive={pathname === tab.href} key={tab.href} tab={tab} />
          ))}
        </ul>
      </nav>

      {isRecording && (
        <Recorder onCancel={handleCancel} onRecorded={handleRecorded} />
      )}
    </>
  );
}

function Tab({
  isActive,
  tab,
}: {
  isActive: boolean;
  tab: (typeof TABS)[number];
}) {
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
