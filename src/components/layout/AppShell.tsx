"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/features/auth/AuthProvider";
import type { BankHoursProjection } from "@/lib/utils/projection";
import { formatHours } from "@/lib/utils/projection";

const links = [
  { href: "/", label: "Início" },
  { href: "/cadastro/", label: "Dias" },
];

function toneClass(tone?: BankHoursProjection["tone"]) {
  if (tone === "negative") return "text-red-400";
  if (tone === "zero") return "text-amber-300";
  return "text-terra";
}

export function AppShell({
  children,
  projection,
  dailyWorkHours,
}: {
  children: ReactNode;
  projection?: BankHoursProjection;
  dailyWorkHours?: number;
}) {
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  return (
    <div className="relative min-h-screen lg:flex">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top_left,rgba(214,255,63,0.14),transparent_42%),radial-gradient(circle_at_80%_0,rgba(255,255,255,0.06),transparent_36%)]"
      />

      <aside className="relative z-10 hidden w-64 shrink-0 flex-col border-r border-line/70 bg-black/20 px-5 py-6 lg:flex">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-terra text-xs font-bold text-black">
            F
          </span>
          <span className="text-base font-semibold tracking-tight">Folgas</span>
        </Link>

        <nav className="mt-8 space-y-1">
          {links.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith("/cadastro");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-xl px-3 py-2 text-sm transition ${
                  active ? "bg-sand text-ink" : "text-mute hover:bg-sand/70 hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {projection ? (
          <div className="mt-8 rounded-2xl border border-line/80 bg-sand/60 p-4">
            <p className="text-xs text-mute">Banco projetado</p>
            <p className={`mt-2 font-mono text-3xl tracking-tight ${toneClass(projection.tone)}`}>
              {formatHours(projection.projectedBalanceHours)}
            </p>
            <p className="mt-3 text-xs text-mute">
              agora {formatHours(projection.currentBalanceHours)}
              {dailyWorkHours ? ` · ${dailyWorkHours} h/dia` : ""}
            </p>
          </div>
        ) : null}

        <div className="mt-auto pt-8">
          <p className="truncate text-xs text-mute">{user?.email}</p>
          <Button variant="ghost" onClick={signOut} className="mt-2 px-0">
            Sair
          </Button>
        </div>
      </aside>

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b border-line/70 bg-cream/80 backdrop-blur-xl lg:hidden">
          <div className="flex h-14 items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-terra text-[11px] font-bold text-black">
                F
              </span>
              <span className="text-sm font-semibold">Folgas</span>
            </Link>
            <nav className="flex items-center gap-1">
              {links.map((link) => {
                const active =
                  link.href === "/" ? pathname === "/" : pathname.startsWith("/cadastro");
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-full px-3 py-1.5 text-sm ${
                      active ? "bg-sand text-ink" : "text-mute"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Button variant="ghost" onClick={signOut}>
                Sair
              </Button>
            </nav>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
