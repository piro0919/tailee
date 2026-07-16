"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 画面が消えないようにする。
 *
 * 餌皿の横に置きっぱなしにする端末が前提なので、画面が消えると待ち受けごと止まる。
 * ただし wake lock はタブが hidden になると OS 側から一方的に解放されるため、
 * visibilitychange で取り直す必要がある。
 *
 * iOS Safari は 16.4 以降で対応。非対応環境では単に効かない。
 */
/** 解放は既に解放済みだと reject する。取り直しは visibilitychange 側でやるので握り潰す。 */
function releaseQuietly(sentinel: WakeLockSentinel | null | undefined): void {
  sentinel?.release().catch(() => undefined);
}

export function useScreenWakeLock(enabled: boolean): boolean {
  const sentinelRef = useRef<WakeLockSentinel | null>(null);
  const [isHeld, setIsHeld] = useState(false);

  useEffect(() => {
    if (!(enabled && "wakeLock" in navigator)) {
      return;
    }

    let cancelled = false;

    const acquire = async () => {
      if (cancelled || document.visibilityState !== "visible") {
        return;
      }
      if (sentinelRef.current && !sentinelRef.current.released) {
        return;
      }

      try {
        const sentinel = await navigator.wakeLock.request("screen");
        if (cancelled) {
          releaseQuietly(sentinel);
          return;
        }

        sentinelRef.current = sentinel;
        setIsHeld(true);
        sentinel.addEventListener("release", () => setIsHeld(false));
      } catch {
        setIsHeld(false);
      }
    };

    // acquire は内部で catch しているので reject しない
    acquire();
    document.addEventListener("visibilitychange", acquire);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", acquire);
      releaseQuietly(sentinelRef.current);
      sentinelRef.current = null;
      setIsHeld(false);
    };
  }, [enabled]);

  return isHeld;
}
