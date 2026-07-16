/**
 * 待ち受けの検証ログ。
 *
 * 端末を置きっぱなしにして何時間も後に見に行く検証なので、画面の state だけでは足りない。
 * 落ちたり再読み込みされたりした後も残るよう localStorage に積む。
 *
 * localStorage を単一の真実として扱い、React からは useSyncExternalStore で購読する。
 */
const STORAGE_KEY = "tailee.standby.log";
const MAX_ENTRIES = 500;
const EMPTY: StandbyLogEntry[] = [];

export type StandbyLogKind = "wake" | "status" | "error";

export type StandbyLogEntry = {
  at: string;
  kind: StandbyLogKind;
  text: string;
};

const listeners = new Set<() => void>();

/** getSnapshot は同一参照を返す必要があるため、読んだ結果をここに持つ。 */
let snapshot: StandbyLogEntry[] | null = null;

function load(): StandbyLogEntry[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return EMPTY;
    }

    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StandbyLogEntry[]) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function commit(next: StandbyLogEntry[]): void {
  snapshot = next;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // 容量超過などで書けなくても待ち受け自体は続ける
  }

  for (const listener of listeners) {
    listener();
  }
}

export function subscribeStandbyLog(listener: () => void): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function getStandbyLog(): StandbyLogEntry[] {
  snapshot ??= load();

  return snapshot;
}

export function getServerStandbyLog(): StandbyLogEntry[] {
  return EMPTY;
}

export function appendStandbyLog(kind: StandbyLogKind, text: string): void {
  const entry: StandbyLogEntry = { at: new Date().toISOString(), kind, text };

  commit([entry, ...getStandbyLog()].slice(0, MAX_ENTRIES));
}

export function clearStandbyLog(): void {
  commit(EMPTY);
}
