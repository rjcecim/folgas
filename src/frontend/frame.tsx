"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import { Btn } from "./ui";

const tabs = [
  { href: "/", label: "Agenda" },
  { href: "/cadastro/", label: "Dias" },
];

export function Frame({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-hair bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Folgas
          </Link>
          <nav className="flex rounded-full bg-well p-1 ring-1 ring-hair">
            {tabs.map((tab) => {
              const active = tab.href === "/" ? pathname === "/" : pathname.startsWith("/cadastro");
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`rounded-full px-4 py-1.5 text-sm transition ${
                    active ? "bg-white text-accent shadow-sm" : "text-soft hover:text-ink"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-soft sm:inline">{user?.email}</span>
            <Btn tone="ghost" onClick={signOut}>
              Sair
            </Btn>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
