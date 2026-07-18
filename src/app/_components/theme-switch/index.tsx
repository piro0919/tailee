"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const CHOICES = [
  { icon: Sun, label: "ライト", value: "light" },
  { icon: Moon, label: "ダーク", value: "dark" },
  { icon: Monitor, label: "端末に合わせる", value: "system" },
] as const;

export function ThemeSwitch() {
  const { setTheme, theme } = useTheme();

  // サーバーでは端末の設定が分からないので、選択中の印はマウント後に出す。
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="flex flex-col gap-2">
      {CHOICES.map((choice) => (
        <Button
          className="justify-start"
          key={choice.value}
          onClick={() => setTheme(choice.value)}
          variant={isMounted && theme === choice.value ? "default" : "outline"}
        >
          <choice.icon />
          {choice.label}
        </Button>
      ))}
    </div>
  );
}
