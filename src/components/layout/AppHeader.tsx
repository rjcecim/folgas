"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/features/auth/AuthProvider";

const links = [
  { href: "/", label: "Painel" },
  { href: "/cadastro/", label: "Cadastro" },
];

export function AppHeader() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/95 text-cream backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="leading-none">
            <span className="block text-[10px] uppercase tracking-[0.32em] text-terra">Pessoal</span>
            <span className="font-serif text-2xl">Folgas</span>
          </Link>
          <nav className="flex rounded-full bg-white/10 p-1">
            {links.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith("/cadastro");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-1.5 text-sm transition ${
                    active ? "bg-cream text-ink" : "text-cream/70 hover:text-cream"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-cream/60 sm:inline">{user?.email}</span>
          <Button variant="secondary" onClick={signOut} className="border-white/15 bg-white/10 text-cream hover:bg-white/15">
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
}
