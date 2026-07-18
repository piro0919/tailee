import {
  type FeedItem,
  type FeedTone,
  formatDuration,
  formatFeedTime,
} from "@/lib/feed";

const TONE_CLASS: Record<FeedTone, string> = {
  cool: "bg-gradient-to-br from-sky-200 to-indigo-300 dark:from-sky-900 dark:to-indigo-950",
  dim: "bg-gradient-to-br from-zinc-300 to-zinc-500 dark:from-zinc-700 dark:to-zinc-900",
  warm: "bg-gradient-to-br from-amber-200 to-rose-300 dark:from-amber-900 dark:to-rose-950",
};

function Meta({ children }: { children: string }) {
  return (
    <div className="px-1 pb-1 text-muted-foreground text-xs">{children}</div>
  );
}

function Photo({ item }: { item: Extract<FeedItem, { kind: "photo" }> }) {
  return (
    <figure>
      <div
        className={`aspect-4/3 w-full rounded-xl ${TONE_CLASS[item.tone]}`}
      />
      <figcaption className="px-1 pt-2 text-sm">{item.caption}</figcaption>
      <Meta>{formatFeedTime(item.at)}</Meta>
    </figure>
  );
}

function Video({ item }: { item: Extract<FeedItem, { kind: "video" }> }) {
  return (
    <figure>
      {item.src ? (
        <video
          className="aspect-4/3 w-full rounded-xl bg-black object-contain"
          controls={true}
          playsInline={true}
          src={item.src}
        >
          <track kind="captions" />
        </video>
      ) : (
        <div
          className={`flex aspect-4/3 w-full items-center justify-center rounded-xl ${TONE_CLASS[item.tone]}`}
        >
          <span className="rounded-full bg-black/40 px-3 py-1 font-mono text-white text-xs tabular-nums">
            {formatDuration(item.durationSec)}
          </span>
        </div>
      )}
      <figcaption className="px-1 pt-2 text-sm">{item.caption}</figcaption>
      <Meta>{formatFeedTime(item.at)}</Meta>
    </figure>
  );
}

function Diary({ item }: { item: Extract<FeedItem, { kind: "diary" }> }) {
  return (
    <article className="rounded-xl border px-4 py-3">
      <h2 className="font-medium text-sm">{item.title}</h2>
      <p className="pt-1 text-muted-foreground text-sm leading-6">
        {item.body}
      </p>
      <Meta>{formatFeedTime(item.at)}</Meta>
    </article>
  );
}

export function Feed({ items }: { items: FeedItem[] }) {
  return (
    <ol className="flex flex-col gap-6">
      {items.map((item) => (
        <li key={item.id}>
          {item.kind === "photo" && <Photo item={item} />}
          {item.kind === "video" && <Video item={item} />}
          {item.kind === "diary" && <Diary item={item} />}
        </li>
      ))}
    </ol>
  );
}
