"use client";

import { AuthProvider, useAuth } from "@/features/auth/AuthProvider";
import { LoginScreen } from "@/features/auth/LoginScreen";
import { UnauthorizedScreen } from "@/features/auth/UnauthorizedScreen";
import { AppShell } from "./AppShell";

function Gate() {
  const { status } = useAuth();

  if (status === "loading") {
    return (
      <main className="grid min-h-screen place-items-center px-6">
        <p className="text-mute">Carregando...</p>
      </main>
    );
  }

  if (status === "anonymous") return <LoginScreen />;
  if (status === "unauthorized") return <UnauthorizedScreen />;
  return <AppShell />;
}

export function AppRoot() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  );
}
