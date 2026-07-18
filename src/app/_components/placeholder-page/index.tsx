/** メニューだけ先に作ったので、中身がまだ無い画面の受け皿。 */
export function PlaceholderPage({
  note,
  title,
}: {
  note: string;
  title: string;
}) {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 pb-28 text-center">
      <h1 className="font-semibold text-xl tracking-tight">{title}</h1>
      <p className="pt-2 text-muted-foreground text-sm leading-6">{note}</p>
    </main>
  );
}
