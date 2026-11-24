import type { Metadata } from "next";
import { THEME_INIT } from "@/components/library/ThemeToggle";
import { archivo, instrument } from "@/lib/fonts";
import { baseMetadata } from "@/lib/meta";
import "@/styles/library.css";

export const metadata: Metadata = {
  ...baseMetadata,
  title: { default: "taster · library", template: "%s · taster" },
  description: "The taster library: real screens from products known for their design, with the tokens measured on each live page.",
  alternates: { canonical: "/library" },
  openGraph: { ...baseMetadata.openGraph, url: "/library" },
};

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${instrument.variable}`} suppressHydrationWarning>
      <body>
        {/* the stored theme, before paint */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
        {children}
      </body>
    </html>
  );
}
