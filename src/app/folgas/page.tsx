import { Suspense } from "react";
import { Gate } from "@/frontend/gate";
import { LeavesScreen } from "@/frontend/leaves";

export default function Folgas() {
  return (
    <Gate>
      <Suspense fallback={<main className="grid min-h-screen place-items-center text-soft">Abrindo...</main>}>
        <LeavesScreen />
      </Suspense>
    </Gate>
  );
}
