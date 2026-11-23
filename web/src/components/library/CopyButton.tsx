"use client";
import { copyText } from "@/lib/toast";

export function CopyButton({ text, className = "copy-btn", label = "Copy", children }: { text: string; className?: string; label?: string; children?: React.ReactNode }) {
  return <button type="button" className={className} aria-label={children ? label : undefined} onClick={() => copyText(text)}>{children ?? label}</button>;
}
