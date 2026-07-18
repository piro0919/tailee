import { ChevronRight, Settings } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-lg px-4 py-6 pb-28">
      <h1 className="font-semibold text-xl tracking-tight">マイページ</h1>
      <p className="pt-2 text-muted-foreground text-sm">
        アカウントとペットの設定。認証がまだ入っていません。
      </p>

      <nav className="pt-6">
        <Link
          className="flex items-center gap-3 rounded-lg border px-4 py-3 text-sm"
          href="/settings"
        >
          <Settings className="size-4 shrink-0" />
          設定
          <ChevronRight className="ml-auto size-4 shrink-0 text-muted-foreground" />
        </Link>
      </nav>
    </main>
  );
}
