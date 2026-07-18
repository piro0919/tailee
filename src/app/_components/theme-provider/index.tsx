"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";
import type { ReactNode } from "react";

/**
 * shadcn の暗色は `.dark` クラスで切り替わる（`@custom-variant dark`）。
 * OS の設定に追従させるだけなので、切り替えの UI は持たない。
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange={true}
      enableSystem={true}
    >
      {children}
    </NextThemeProvider>
  );
}
