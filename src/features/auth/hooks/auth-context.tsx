/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";
import { decrypt } from "@/lib/jwt";
import { createSession, readSession, clearSession } from "@/lib/cookie";
import { login as loginService } from "../services/auth.service";
import { useRouter } from "next/navigation";

interface AuthContextType {
  session: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginError: string | null;
  loginLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [session, setSession] = useState<any>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    async function loadSession() {
      const token = await readSession();
      if (!token) {
        setSession({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }
      const decoded = await decrypt(token);
      if (!decoded?.user) {
        setSession({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }
      setSession({
        user: decoded.user,
        isAuthenticated: true,
        isLoading: false,
      });
    }
    loadSession();
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setLoginLoading(true);
      setLoginError(null);
      try {
        const result = await loginService(email, password);
        await createSession(result.token);
        console.log("Login successful, session created.");
        setSession({
          user: result.user,
          isAuthenticated: true,
          isLoading: false,
        });
        router.push("/dashboard");
      } catch (error: any) {
        setLoginError(error?.message || "Login failed");
      } finally {
        setLoginLoading(false);
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    await clearSession();
    setSession({ user: null, isAuthenticated: false, isLoading: false });
    router.push("/");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{ session, login, logout, loginError, loginLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
