import { Suspense } from "react";
import { Gate } from "@/frontend/gate";
import { ManageScreen } from "@/frontend/manage";

export default function Cadastro() {
  return (
    <Gate>
      <Suspense fallback={<main className="grid min-h-screen place-items-center text-soft">Abrindo...</main>}>
        <ManageScreen />
      </Suspense>
    </Gate>
  );
}
