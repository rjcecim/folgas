"use client";

import { Button } from "@/components/ui/Button";
import { useAuth } from "./AuthProvider";

export function LoginScreen() {
  const { signIn, error } = useAuth();

  return (
    <main className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
      <section className="flex flex-col justify-between bg-ink px-8 py-10 text-cream sm:px-14">
        <p className="text-xs uppercase tracking-[0.32em] text-terra">Agenda pessoal</p>
        <div>
          <h1 className="font-serif text-6xl leading-[0.95]">Folgas</h1>
          <p className="mt-6 max-w-md text-lg leading-8 text-cream/70">
            Um painel para ver o mês. Uma tela só para cadastrar o que importa.
          </p>
        </div>
        <p className="text-sm text-cream/45">Banco de horas, viagens e dias sem expediente.</p>
      </section>
      <section className="flex items-center px-8 py-16 sm:px-14">
        <div className="w-full max-w-sm">
          <h2 className="font-serif text-3xl text-ink">Entrar</h2>
          <p className="mt-3 text-mute">Use a conta Google autorizada para abrir seu calendário.</p>
          <div className="mt-8">
            <Button onClick={signIn} className="w-full">
              Continuar com Google
            </Button>
          </div>
          {error ? <p className="mt-4 text-sm text-rose-700">{error}</p> : null}
        </div>
      </section>
    </main>
  );
}
