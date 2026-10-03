import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import LogoutButton from "@/components/LogoutButton";

export const metadata: Metadata = {
  title: "BİLSEM Mezun Ağı",
  description:
    "BİLSEM mezunlarını dünyada buluşturan mezun ağı",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>
        <header className="topbar">

          <div className="topbarMain">
            <Link href="/" className="brand">
              BİLSEM <span>MEZUN AĞI</span>
            </Link>

            <div className="topbarActions">
              <Link href="/register" className="joinBtn">
                Mezun Ol
              </Link>

              <LogoutButton />
            </div>
          </div>

          <nav className="nav">
            <Link href="/">🌍 Harita</Link>
            <Link href="/alumni">👥 Mezunlar</Link>
            <Link href="/book">📖 Mezun Hikâyeleri</Link>
            <Link href="/spotlight">⭐ Mezun Sahnesi</Link>
            <Link href="/ambassadors">🧭 İl Elçileri</Link>
            <Link href="/announcements">📢 Duyurular</Link>
            <Link href="/forum">💬 Forum</Link>
          </nav>

        </header>

        {children}

      </body>
    </html>
  );
}