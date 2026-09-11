import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "11:21STYLES BY GLENSHAKES",
  description: "11:21STYLES online clothing store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif" }}>
        <SessionProvider>
          <header className="border-b bg-black text-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
              <Link href="/" className="font-bold tracking-wide">
                11:21STYLES
              </Link>

              <nav className="flex gap-4 text-sm">
                <Link href="/shop">Shop</Link>
                <a href="/profile">Profile</a>
                <a href="/login">Login</a>
              </nav>
            </div>
          </header>

          <main className="mx-auto min-h-screen max-w-7xl px-4 py-8">
            {children}
          </main>

          <footer className="border-t">
            <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-4 py-8 text-sm md:flex-row">
              <p>
                © {new Date().getFullYear()} 11:21STYLES BY GLENSHAKES
              </p>

              <div className="flex gap-4">
                <a href="https://wa.me/254713883852">
                  WhatsApp
                </a>
                <a href="https://instagram.com/1121styles">
                  Instagram
                </a>
                <a href="https://tiktok.com/@1121styles">
                  TikTok
                </a>
                <a href="https://youtube.com/@1121styles">
                  YouTube
                </a>
              </div>
            </div>
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}