"use client";

import { Button } from "@/components/ui/Button";
import { useAuth } from "./AuthProvider";

export function LoginScreen() {
  const { signIn, error } = useAuth();

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-12">
      <p className="text-xs uppercase tracking-[0.28em] text-terra">Agenda pessoal</p>
      <h1 className="mt-3 font-serif text-5xl leading-tight text-ink">Folgas</h1>
      <p className="mt-4 text-lg leading-8 text-mute">
        Planeje dias sem expediente, banco de horas e viagens. Os dias cadastrados
        são seus: edite, exclua ou inclua os do ano que vem quando quiser.
      </p>
      <div className="mt-8">
        <Button onClick={signIn} className="w-full sm:w-auto">
          Entrar com Google
        </Button>
      </div>
      {error ? <p className="mt-4 text-sm text-rose-700">{error}</p> : null}
    </main>
  );
}
