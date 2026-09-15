"use client";

import { useAuth } from "@/features/auth/AuthProvider";
import { Btn } from "./ui";

export function SignInScreen() {
  const { signIn, error } = useAuth();

  return (
    <main className="grid min-h-screen place-items-center px-6">
      <div className="w-full max-w-xl">
        <p className="text-sm font-medium text-accent">Folgas</p>
        <h1 className="mt-4 text-6xl font-semibold tracking-tight sm:text-7xl">
          Planeje o tempo que é seu.
        </h1>
        <p className="mt-5 max-w-md text-lg text-soft">
          Folgas, banco de horas e viagens no mesmo calendário.
        </p>
        <Btn onClick={signIn} className="mt-10 h-12 px-6 text-base">
          Entrar com Google
        </Btn>
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      </div>
    </main>
  );
}
