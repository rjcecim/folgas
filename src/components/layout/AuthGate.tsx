"use client";

import type { ReactNode } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import { LoginScreen } from "@/features/auth/LoginScreen";
import { UnauthorizedScreen } from "@/features/auth/UnauthorizedScreen";

export function AuthGate({ children }: { children: ReactNode }) {
  const { status } = useAuth();

  if (status === "loading") {
    return (
      <main className="grid min-h-screen place-items-center px-6">
        <p className="text-sm text-mute">Abrindo sua agenda...</p>
      </main>
    );
  }

  if (status === "anonymous") return <LoginScreen />;
  if (status === "unauthorized") return <UnauthorizedScreen />;
  return <>{children}</>;
}
