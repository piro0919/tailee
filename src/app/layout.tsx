import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "./_components/header";
import { AppSidebar } from "./_components/nav/app-sidebar";
import { FooterNav } from "./_components/nav/footer-nav";
import { ThemeProvider } from "./_components/theme-provider";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tailee",
  description: "ペットとの、なんでもない日常が勝手に貯まる。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning={true}
    >
      <body className="min-h-full">
        <ThemeProvider>
          <TooltipProvider>
            <SidebarProvider>
              <Header />
              <AppSidebar />
              <SidebarInset className="mt-14 flex min-w-0 flex-col">
                {children}
              </SidebarInset>
              <FooterNav />
            </SidebarProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
