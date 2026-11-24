"use client";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "./ThemeToggle";

// The library's top bar. The search field and the platform switch are only live on the index, so the host passes them in.
export function LibraryBar({ search, actions, onHome }: { search?: React.ReactNode; actions?: React.ReactNode; onHome?: (e: React.MouseEvent) => void }) {
  return (
    <header className="bar">
      <div className="bar-inner">
        <Link className="brand" href="/" aria-label="ui taste home"><Logo /></Link>
        <Link className="crumb" href="/library" id="lib-home" onClick={onHome}>Library</Link>
        {search}
        <div className="bar-actions" style={search ? undefined : { marginLeft: "auto" }}>
          {actions}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
