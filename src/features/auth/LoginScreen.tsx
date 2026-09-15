"use client";

import { Button } from "@/components/ui/Button";
import { useAuth } from "./AuthProvider";

export function LoginScreen() {
  const { signIn, error } = useAuth();

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(214,255,63,0.2),transparent_34%),radial-gradient(circle_at_80%_80%,rgba(214,255,63,0.08),transparent_28%)]"
      />
      <div className="relative w-full max-w-md">
        <p className="text-sm font-medium text-terra">Folgas</p>
        <h1 className="mt-3 text-5xl font-semibold tracking-tight sm:text-6xl">
          Seu tempo,
          <br />
          no seu ritmo.
        </h1>
        <p className="mt-4 max-w-sm text-base text-mute">
          Banco de horas, folgas e viagens numa agenda só sua.
        </p>
        <Button onClick={signIn} className="mt-10 h-11 px-6">
          Continuar com Google
        </Button>
        {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}
      </div>
    </main>
  );
}
