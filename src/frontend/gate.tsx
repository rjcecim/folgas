"use client";

import type { ReactNode } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import { DeniedScreen } from "./denied";
import { SignInScreen } from "./signin";

export function Gate({ children }: { children: ReactNode }) {
  const { status } = useAuth();

  if (status === "loading") {
    return (
      <main className="grid min-h-screen place-items-center">
        <p className="text-soft">Abrindo...</p>
      </main>
    );
  }

  if (status === "anonymous") return <SignInScreen />;
  if (status === "unauthorized") return <DeniedScreen />;
  return <>{children}</>;
}
