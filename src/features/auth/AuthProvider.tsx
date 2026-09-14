"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "firebase/auth";
import { AUTHORIZED_EMAIL } from "@/lib/constants";
import { signInWithGoogle, signOutUser, watchAuth } from "@/lib/firebase/auth";

type AuthStatus = "loading" | "anonymous" | "unauthorized" | "ready";

interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  error: string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return watchAuth(async (nextUser) => {
      if (!nextUser) {
        setUser(null);
        setStatus("anonymous");
        return;
      }

      if (nextUser.email !== AUTHORIZED_EMAIL) {
        setUser(nextUser);
        setStatus("unauthorized");
        return;
      }

      setUser(nextUser);
      setStatus("ready");
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      error,
      signIn: async () => {
        setError(null);
        try {
          await signInWithGoogle();
        } catch (err) {
          setError(err instanceof Error ? err.message : "Não foi possível entrar.");
        }
      },
      signOut: async () => {
        await signOutUser();
        setUser(null);
        setStatus("anonymous");
      },
    }),
    [error, status, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  }
  return context;
}
