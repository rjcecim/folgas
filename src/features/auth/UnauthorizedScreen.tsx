"use client";

import { Button } from "@/components/ui/Button";
import { AUTHORIZED_EMAIL } from "@/lib/constants";
import { useAuth } from "./AuthProvider";

export function UnauthorizedScreen() {
  const { user, signOut } = useAuth();

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-12">
      <p className="text-xs uppercase tracking-[0.28em] text-rose-700">Acesso negado</p>
      <h1 className="mt-3 font-serif text-4xl text-ink">Conta não autorizada</h1>
      <p className="mt-4 text-lg leading-8 text-mute">
        {user?.email} não pode usar este aplicativo. Somente {AUTHORIZED_EMAIL} tem
        acesso. Os dados também estão protegidos pelas Firebase Security Rules.
      </p>
      <div className="mt-8">
        <Button onClick={signOut}>Sair e trocar de conta</Button>
      </div>
    </main>
  );
}
