import { House, Radio, User, Users } from "lucide-react";

/**
 * メニューの項目。モバイルのフッターとデスクトップのサイドバーで同じものを並べる。
 *
 * アルバムのタブは、提供の仕方が決まるまで置かない（中身の無いタブになるため）。
 */
export const TABS = [
  { href: "/", icon: House, label: "ホーム" },
  { href: "/live", icon: Radio, label: "ライブ" },
  { href: "/social", icon: Users, label: "みんな" },
  { href: "/me", icon: User, label: "マイページ" },
] as const;

export type Tab = (typeof TABS)[number];
