/**
 * 撮ったものの一時置き場。
 *
 * 撮影ボタンはフッターにあり、出来たものはホームの一覧に出る。
 * 画面をまたぐので、状態をコンポーネントの中に持てない。
 *
 * 保存先（Google Drive）がまだ無いため、blob URL をメモリに積んでいるだけ。
 * 再読み込みで消える。ここは保存経路が入った時点で丸ごと置き換わる。
 *
 * blob URL は解放していない。タブを開いている間ずっと参照され続けるうえ、
 * 解放する場所が「どの画面からも外れた時」になり、判定を持つだけ無駄になるため。
 * 保存経路が入れば URL 自体が要らなくなる。
 */
import type { FeedItem } from "./feed";

const listeners = new Set<() => void>();
const EMPTY: FeedItem[] = [];

let recordings: FeedItem[] = EMPTY;

export function subscribeRecordings(listener: () => void): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function getRecordings(): FeedItem[] {
  return recordings;
}

/** サーバー側では何も撮れていない。getServerSnapshot が同じ参照を返す必要がある。 */
export function getServerRecordings(): FeedItem[] {
  return EMPTY;
}

export function addRecording(item: FeedItem): void {
  recordings = [item, ...recordings];

  for (const listener of listeners) {
    listener();
  }
}
