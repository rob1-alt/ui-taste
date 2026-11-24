import type { Metadata } from "next";
import { archivo, instrument } from "@/lib/fonts";
import { baseMetadata, baseViewport } from "@/lib/meta";
import "@/styles/landing.css";

export const viewport = baseViewport;
export const metadata: Metadata = baseMetadata;

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${instrument.variable}`}>
      <body>{children}</body>
    </html>
  );
}
