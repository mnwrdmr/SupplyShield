import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SupplyShield — Yapay Zeka Destekli Tedarik Zinciri Yönetimi",
  description: "Yapay zeka destekli tedarik zinciri risk yönetim platformu",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" style={{ background: "#f0f4f8" }}>
      <body style={{ margin: 0, minHeight: "100vh", background: "#f0f4f8" }}>{children}</body>
    </html>
  );
}
