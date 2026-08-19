# Tailee

**A pet-life album that fills itself up.**

Nobody thinks to film their dog eating dinner — you never plan to, so you never do.
Tailee is built around that gap. A single day of it means nothing; a year of it does.
A dog gets roughly ten thousand dinners, and that finiteness is the point of the product.

## Status

**On hold since 2026-07-19.** The design assumed an old phone left running in one spot,
and nothing in the market solves keeping such a device awake without pinning the screen on.
Battery swelling is a documented failure mode for that setup, and the hardest part of the
idea turned out to be the same part that made it different — so there is no version of this
that drops the stationary device and still stands apart from a general photo app.

That conclusion came from research, not measurement. Anyone picking this up again should
start by leaving a phone running overnight and watching what the battery does, not by
writing code. See `CLAUDE.md` for the full record, including the paths already ruled out.

## What is here

A Next.js prototype of the shell: a feed that mixes photos, video, and diary entries in one
reverse-chronological stream, a recorder reachable from the mobile footer and the desktop
sidebar, and the live / social / profile tabs stubbed out.

- **Wake word** — recording was meant to start by voice, since your hands are holding a food
  bowl. `src/lib/wake-words.ts` holds the candidates and the constraints they have to meet.
- **Diary** — drafted from what you already say out loud to your pet, never from narration
  you are asked to perform.
- **Storage** — not built. Recordings live in memory as blob URLs and vanish on reload.

## Built with

Next.js, React, TypeScript, shadcn/ui, Tailwind CSS.

## Development

```bash
pnpm install
pnpm dev
```

## License

MIT
