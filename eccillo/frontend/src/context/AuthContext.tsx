import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { authApi } from "../api/auth";
import { tokenStore } from "../api/client";
import type { TokenResponse, User } from "../types";

interface AuthState {
  user: User | null;
  ready: boolean;
  signIn: (tokens: TokenResponse) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    const hydrate = async () => {
      if (!tokenStore.get()) {
        if (mounted) setReady(true);
        return;
      }
      try {
        const current = await authApi.me();
        if (mounted) setUser(current);
      } catch {
        tokenStore.clear();
      } finally {
        if (mounted) setReady(true);
      }
    };
    const expire = () => { if (mounted) setUser(null); };
    window.addEventListener("eccillo:auth-expired", expire);
    void hydrate();
    return () => { mounted = false; window.removeEventListener("eccillo:auth-expired", expire); };
  }, []);

  const value = useMemo<AuthState>(() => ({
    user,
    ready,
    signIn: async (tokens) => {
      tokenStore.set({ accessToken: tokens.access_token, refreshToken: tokens.refresh_token });
      setUser(tokens.user ?? await authApi.me());
    },
    signOut: async () => {
      await authApi.logout();
      setUser(null);
    },
  }), [ready, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used under AuthProvider");
  return context;
}
