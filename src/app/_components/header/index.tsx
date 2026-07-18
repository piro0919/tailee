"use client";

import { Video } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRecorder } from "@/hooks/use-recorder";

/**
 * 全画面共通のヘッダー。
 *
 * サイドバーの上も含めて全幅に固定する（nagara と同じ形）。
 * サイドバー側は top-14 から始まる。
 *
 * 撮影はデスクトップのみ。モバイルはフッター中央に置いてあり、
 * 同じ画面に同じボタンを2つ出さない。
 */
export function Header() {
  const { overlay, start } = useRecorder();

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-30 flex h-14 items-center gap-2 border-b bg-sidebar/75 px-4 backdrop-blur-xs">
        <Link className="font-semibold text-lg tracking-tight" href="/">
          Tailee
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <Button className="hidden md:inline-flex" onClick={start} size="sm">
            <Video />
            撮影する
          </Button>
        </div>
      </header>

      {overlay}
    </>
  );
}
