"use client";

import { useSyncExternalStore } from "react";
import { SAMPLE_FEED } from "@/lib/feed";
import {
  getRecordings,
  getServerRecordings,
  subscribeRecordings,
} from "@/lib/recordings";
import { Feed } from "../feed";

export function Home() {
  const recordings = useSyncExternalStore(
    subscribeRecordings,
    getRecordings,
    getServerRecordings,
  );

  return (
    <main className="mx-auto w-full max-w-lg px-4 pt-4 pb-28">
      {/* デスクトップはサイドバーが名前を出すので、こちらはモバイルだけ */}
      <header className="pb-4 md:hidden">
        <h1 className="font-semibold text-xl tracking-tight">Tailee</h1>
      </header>
      <Feed items={[...recordings, ...SAMPLE_FEED]} />
    </main>
  );
}
