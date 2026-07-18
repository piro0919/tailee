"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * 手持ち撮影。
 *
 * 開いた瞬間から録り始める。突発的ないい場面のための経路なので、
 * 画角を確かめてから開始する形にはしない（確かめている数秒で場面が終わる）。
 *
 * 保存先がまだ無いので、録れたものは blob URL としてその場に渡すだけ。
 * 再読み込みで消える。
 */

export type Recording = {
  durationSec: number;
  src: string;
};

/** 端末によって出せる形式が違う。上から順に、対応している最初のものを使う。 */
const MIME_CANDIDATES = [
  "video/mp4",
  "video/webm;codecs=vp9,opus",
  "video/webm",
];

function openCamera(): Promise<MediaStream> {
  return navigator.mediaDevices.getUserMedia({
    audio: true,
    video: { facingMode: "environment" },
  });
}

function stopTracks(stream: MediaStream): void {
  for (const track of stream.getTracks()) {
    track.stop();
  }
}

function createRecorder(
  stream: MediaStream,
  onComplete: (blob: Blob) => void,
): MediaRecorder {
  const mimeType = MIME_CANDIDATES.find((type) =>
    MediaRecorder.isTypeSupported(type),
  );
  const recorder = new MediaRecorder(
    stream,
    mimeType ? { mimeType } : undefined,
  );
  const chunks: Blob[] = [];

  recorder.ondataavailable = (recorderEvent) => {
    if (recorderEvent.data.size > 0) {
      chunks.push(recorderEvent.data);
    }
  };

  recorder.onstop = () => {
    onComplete(new Blob(chunks, { type: recorder.mimeType }));
  };

  return recorder;
}

export function Recorder({
  onCancel,
  onRecorded,
}: {
  onCancel: () => void;
  onRecorded: (recording: Recording) => void;
}) {
  const [elapsedSec, setElapsedSec] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const previewRef = useRef<HTMLVideoElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const elapsedRef = useRef(0);

  // 最新のコールバックを ref に逃がす。開始の処理は一度だけ走らせたいので、
  // 親から渡る関数を effect の依存に載せない。
  const onRecordedRef = useRef(onRecorded);

  useEffect(() => {
    onRecordedRef.current = onRecorded;
  });

  useEffect(() => {
    let stream: MediaStream | null = null;
    let cancelled = false;

    const tick = setInterval(() => {
      elapsedRef.current += 1;
      setElapsedSec(elapsedRef.current);
    }, 1000);

    const handleComplete = (blob: Blob) => {
      onRecordedRef.current({
        durationSec: elapsedRef.current,
        src: URL.createObjectURL(blob),
      });
    };

    const start = async () => {
      let opened: MediaStream;

      try {
        opened = await openCamera();
      } catch {
        if (!cancelled) {
          setError(
            "カメラとマイクを使えませんでした。許可を確認してください。",
          );
        }

        return;
      }

      // 待っている間に閉じられていたら、掴んだものを離してそのまま終える。
      if (cancelled) {
        stopTracks(opened);

        return;
      }

      stream = opened;

      if (previewRef.current) {
        previewRef.current.srcObject = stream;
      }

      recorderRef.current = createRecorder(stream, handleComplete);
      recorderRef.current.start();
    };

    start();

    return () => {
      cancelled = true;
      clearInterval(tick);

      if (recorderRef.current?.state === "recording") {
        recorderRef.current.stop();
      }

      recorderRef.current = null;

      if (stream) {
        stopTracks(stream);
      }
    };
  }, []);

  const handleStop = () => {
    // 停止は onstop で拾う。ここで閉じると blob を作る前に unmount される。
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();

      return;
    }

    onCancel();
  };

  if (error) {
    return (
      <div className="fixed inset-0 z-10 flex flex-col items-center justify-center gap-6 bg-black p-8 text-center text-white">
        <p className="text-sm leading-6">{error}</p>
        <Button onClick={onCancel} variant="outline">
          閉じる
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-10 bg-black">
      <video
        autoPlay={true}
        className="h-full w-full object-contain"
        muted={true}
        playsInline={true}
        ref={previewRef}
      />

      <div className="absolute inset-x-0 top-0 flex justify-center p-5">
        <span className="flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 text-white">
          <span className="size-2 rounded-full bg-red-500" />
          <span className="font-mono text-sm tabular-nums">
            {Math.floor(elapsedSec / 60)}:
            {String(elapsedSec % 60).padStart(2, "0")}
          </span>
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex justify-center p-8">
        <button
          aria-label="撮影を止める"
          className="flex size-18 items-center justify-center rounded-full border-4 border-white"
          onClick={handleStop}
          type="button"
        >
          <span className="size-7 rounded-sm bg-red-500" />
        </button>
      </div>
    </div>
  );
}
