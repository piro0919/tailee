import { ThemeSwitch } from "../_components/theme-switch";

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-lg px-4 py-6 pb-28">
      <h1 className="font-semibold text-xl tracking-tight">設定</h1>

      <section className="pt-6">
        <h2 className="pb-3 font-medium text-sm">配色</h2>
        <ThemeSwitch />
      </section>
    </main>
  );
}
