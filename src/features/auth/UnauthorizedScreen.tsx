"use client";

import { Button } from "@/components/ui/Button";
import { AUTHORIZED_EMAIL } from "@/lib/constants";
import { useAuth } from "./AuthProvider";

export function UnauthorizedScreen() {
  const { user, signOut } = useAuth();

  return (
    <main className="grid min-h-screen place-items-center px-6">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-semibold tracking-tight">Sem acesso</h1>
        <p className="mt-4 text-base text-mute">
          {user?.email} não pode entrar. Somente {AUTHORIZED_EMAIL}.
        </p>
        <Button onClick={signOut} className="mt-8">
          Trocar de conta
        </Button>
      </div>
    </main>
  );
}
