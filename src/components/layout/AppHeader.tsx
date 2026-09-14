"use client";

import { Button } from "@/components/ui/Button";
import { useAuth } from "@/features/auth/AuthProvider";

export function AppHeader({ onCreate }: { onCreate: () => void }) {
  const { user, signOut } = useAuth();

  return (
    <header className="border-b border-line bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-terra"> · </p>
          <h1 className="font-serif text-3xl text-ink">Folgas</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="hidden text-sm text-mute sm:inline">{user?.email}</span>
          <Button onClick={onCreate}>Novo evento</Button>
          <Button variant="secondary" onClick={signOut}>
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
}
