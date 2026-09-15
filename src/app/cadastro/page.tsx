import { Suspense } from "react";
import { AuthGate } from "@/components/layout/AuthGate";
import { CadastroPage } from "@/components/dashboard/CadastroPage";

export default function Cadastro() {
  return (
    <AuthGate>
      <Suspense fallback={<main className="grid min-h-screen place-items-center">Carregando...</main>}>
        <CadastroPage />
      </Suspense>
    </AuthGate>
  );
}
