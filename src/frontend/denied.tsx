"use client";

import { AUTHORIZED_EMAIL } from "@/lib/constants";
import { useAuth } from "@/features/auth/AuthProvider";
import { Btn } from "./ui";

export function DeniedScreen() {
  const { user, signOut } = useAuth();

  return (
    <main className="grid min-h-screen place-items-center px-6">
      <div className="w-full max-w-lg">
        <h1 className="text-5xl font-semibold tracking-tight">Essa conta não entra.</h1>
        <p className="mt-4 text-lg text-soft">
          {user?.email} está fora. Só {AUTHORIZED_EMAIL}.
        </p>
        <Btn onClick={signOut} className="mt-8">
          Trocar de conta
        </Btn>
      </div>
    </main>
  );
}
