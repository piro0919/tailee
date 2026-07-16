"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { useEarVosk } from "use-ear";
import { useScreenWakeLock } from "@/hooks/use-screen-wake-lock";
import {
  appendStandbyLog,
  clearStandbyLog,
  getServerStandbyLog,
  getStandbyLog,
  subscribeStandbyLog,
} from "@/lib/standby-log";
import { VOSK_LANGUAGE, WAKE_WORD_CANDIDATES } from "@/lib/wake-words";

const WAKE_WORDS = [...WAKE_WORD_CANDIDATES];

function formatDuration(totalSec: number): string {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;

  return h > 0 ? `${h}時間 ${m}分 ${s}秒` : m > 0 ? `${m}分 ${s}秒` : `${s}秒`;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("ja-JP");
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-black/4 px-3 py-2 dark:bg-white/6">
      <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
        {label}
      </div>
      <div className="font-mono text-sm tabular-nums">{value}</div>
    </div>
  );
}

export function Standby() {
  const [started, setStarted] = useState(false);
  const log = useSyncExternalStore(
    subscribeStandbyLog,
    getStandbyLog,
    getServerStandbyLog,
  );

  const handleWakeWord = useCallback((word: string, transcript: string) => {
    appendStandbyLog("wake", `「${word}」← ${transcript || "(空)"}`);
  }, []);

  const { error, isSupported, loadProgress, metrics, partial, start, status } =
    useEarVosk({
      language: VOSK_LANGUAGE,
      normalize: true,
      onWakeWord: handleWakeWord,
      similarityThreshold: 0.8,
      wakeWords: WAKE_WORDS,
    });

  const isListening = status === "listening";
  const hasWakeLock = useScreenWakeLock(isListening);

  useEffect(() => {
    if (status === "idle") {
      return;
    }

    appendStandbyLog("status", status);
  }, [status]);

  useEffect(() => {
    if (!error) {
      return;
    }

    appendStandbyLog("error", error.message);
  }, [error]);

  // getUserMedia と AudioContext はユーザー操作を起点にしないとブラウザが弾く。
  // 置きっぱなし運用でも、最初の一度だけは人がタップする必要がある。
  const handleStart = async () => {
    setStarted(true);
    await start();
  };

  const wakeCount = log.filter((e) => e.kind === "wake").length;

  if (!started) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
        <div>
          <h1 className="font-semibold text-2xl tracking-tight">Tailee</h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            待ち受けの実機検証
          </p>
        </div>
        <button
          className="rounded-full bg-foreground px-8 py-4 font-medium text-background text-base disabled:opacity-40"
          disabled={!isSupported}
          onClick={handleStart}
          type="button"
        >
          タップして待ち受けを開始
        </button>
        <p className="max-w-xs text-xs text-zinc-500 leading-5 dark:text-zinc-400">
          {isSupported
            ? "初回は音声モデル約 47MB を読み込みます。Wi-Fi で行ってください。"
            : "この端末では on-device の音声認識が動きません。"}
        </p>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-5 p-5">
      <header className="flex items-baseline justify-between">
        <h1 className="font-semibold text-lg tracking-tight">
          Tailee 待ち受け
        </h1>
        <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
          {status}
        </span>
      </header>

      {status === "loading-model" && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          音声モデルを読み込み中
          {loadProgress === null ? "" : ` ${Math.round(loadProgress * 100)}%`}
        </p>
      )}

      {status === "requesting-mic" && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          マイクの使用を許可してください
        </p>
      )}

      {error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-red-600 text-sm dark:text-red-400">
          {error.message}
        </p>
      )}

      {isListening && (
        <div className="rounded-lg border border-black/8 px-3 py-2 dark:border-white/15">
          <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
            いま聞こえている音
          </div>
          <div className="min-h-6 text-sm">{partial || "—"}</div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Stat label="稼働時間" value={formatDuration(metrics.uptimeSec)} />
        <Stat label="発火回数" value={`${wakeCount} 回`} />
        <Stat
          label="画面ロック抑止"
          value={hasWakeLock ? "効いている" : "無し"}
        />
        <Stat
          label="フレーム平均"
          value={
            metrics.avgFrameMs === null
              ? "—"
              : `${metrics.avgFrameMs.toFixed(1)} ms`
          }
        />
        <Stat
          label="フレーム最大"
          value={
            metrics.maxFrameMs === null
              ? "—"
              : `${metrics.maxFrameMs.toFixed(0)} ms`
          }
        />
        <Stat
          label="JS ヒープ"
          value={
            metrics.heapBytes === null
              ? "—"
              : `${(metrics.heapBytes / 1024 / 1024).toFixed(0)} MB`
          }
        />
        <Stat
          label="チャンク平均"
          value={
            metrics.avgChunkMs === null
              ? "—"
              : `${metrics.avgChunkMs.toFixed(2)} ms`
          }
        />
      </div>

      <section className="flex min-h-0 flex-1 flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="font-medium text-sm">ログ</h2>
          <button
            className="text-xs text-zinc-500 underline dark:text-zinc-400"
            onClick={clearStandbyLog}
            type="button"
          >
            消す
          </button>
        </div>
        <ol className="flex-1 overflow-y-auto text-xs">
          {log.length === 0 && (
            <li className="py-2 text-zinc-500 dark:text-zinc-400">まだ無し</li>
          )}
          {log.map((entry) => (
            <li
              className="flex gap-3 border-black/6 border-b py-1.5 dark:border-white/10"
              key={`${entry.at}-${entry.text}`}
            >
              <span className="shrink-0 font-mono text-zinc-400 tabular-nums">
                {formatTime(entry.at)}
              </span>
              <span
                className={
                  entry.kind === "wake"
                    ? "font-medium"
                    : entry.kind === "error"
                      ? "text-red-600 dark:text-red-400"
                      : "text-zinc-500 dark:text-zinc-400"
                }
              >
                {entry.text}
              </span>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
