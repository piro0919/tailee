/**
 * ホームに流れる項目。
 *
 * 写真・動画・日記を1本の新着順の流れに混ぜる。日ごとに束ねないのは、
 * 束ねるのが「後からアルバムとして渡す」側の仕事で、毎日開く画面とは別だから。
 *
 * 保存経路がまだ無いので、写真と既存の動画は中身を持たない仮データ。
 * 実際に撮った動画だけが src を持ち、そこだけ本物が再生される。
 */

/** 実画像が入るまでの置き石。色でしか区別できないので、あくまで並びを見るためのもの。 */
export type FeedTone = "warm" | "cool" | "dim";

export type FeedItem =
  | {
      at: string;
      caption: string;
      id: string;
      kind: "photo";
      tone: FeedTone;
    }
  | {
      at: string;
      caption: string;
      durationSec: number;
      id: string;
      kind: "video";
      /** 実際に撮った動画の blob URL。仮データには無い。 */
      src?: string;
      tone: FeedTone;
    }
  | {
      at: string;
      body: string;
      id: string;
      kind: "diary";
      title: string;
    };

/**
 * ISO 文字列をそのまま切り出して表示に使う。
 *
 * toLocaleString だとサーバーと端末でタイムゾーンが食い違って hydration が壊れる。
 * 仮データは固定の壁時計として扱えば足りるので、時刻の計算はしない。
 */
export function formatFeedTime(at: string): string {
  const [date, time] = at.split("T");
  const [, month, day] = date.split("-");
  const [hour, minute] = time.split(":");

  return `${Number(month)}月${Number(day)}日 ${Number(hour)}:${minute}`;
}

export function formatDuration(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;

  return `${m}:${String(s).padStart(2, "0")}`;
}

/** 見た目を確かめるための仮データ。Supabase が入ったら丸ごと消える。 */
export const SAMPLE_FEED: FeedItem[] = [
  {
    at: "2026-07-18T08:12",
    caption: "朝ごはん",
    durationSec: 143,
    id: "s1",
    kind: "video",
    tone: "warm",
  },
  {
    at: "2026-07-18T07:58",
    caption: "皿の前で待っている",
    id: "s2",
    kind: "photo",
    tone: "warm",
  },
  {
    at: "2026-07-17T21:30",
    body: "夕方から雨。散歩に行けなかったぶん、家の中をずっとうろうろしていた。夜ごはんは残さず食べた。",
    id: "s3",
    kind: "diary",
    title: "雨の日",
  },
  {
    at: "2026-07-17T19:04",
    caption: "夜ごはん",
    durationSec: 96,
    id: "s4",
    kind: "video",
    tone: "dim",
  },
  {
    at: "2026-07-17T14:22",
    caption: "窓際で寝ている",
    id: "s5",
    kind: "photo",
    tone: "cool",
  },
  {
    at: "2026-07-17T08:05",
    caption: "朝ごはん",
    durationSec: 121,
    id: "s6",
    kind: "video",
    tone: "warm",
  },
];
