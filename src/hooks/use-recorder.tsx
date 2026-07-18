"use client";

import { type ReactNode, useCallback, useState } from "react";
import { Recorder, type Recording } from "@/app/_components/recorder";
import { addRecording, wallClockNow } from "@/lib/recordings";

/**
 * 撮影の起動。
 *
 * ボタンはモバイルのフッターとデスクトップのサイドバーで見た目が違うので、
 * 起動と全画面のオーバーレイだけをここに置き、ボタン自体は呼ぶ側に任せる。
 *
 * 両方が同時に描画されるが、表示されるのは画面幅に応じて片方だけなので、
 * 状態を共有せずそれぞれが持つ。
 */
export function useRecorder(): { overlay: ReactNode; start: () => void } {
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

  const start = useCallback(() => {
    setIsRecording(true);
  }, []);

  return {
    overlay: isRecording ? (
      <Recorder onCancel={handleCancel} onRecorded={handleRecorded} />
    ) : null,
    start,
  };
}
