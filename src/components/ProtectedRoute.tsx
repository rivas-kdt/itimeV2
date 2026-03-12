/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { ReactNode } from "react";
import { useAuth } from "@/features/auth/hooks/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const session = { isAuthenticated: true, isLoading: false };
  const router = useRouter();

  useEffect(() => {
    if (!session.isLoading && !session.isAuthenticated) {
      router.push("/landing");
    }
  }, [session.isAuthenticated, session.isLoading, router]);

  if (session.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session.isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
