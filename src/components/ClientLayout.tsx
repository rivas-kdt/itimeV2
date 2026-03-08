//src/components/ClientLayout.tsx
"use client";

import Navbar from "@/features/dashboard/components/navbar";
import LayoutContent from "@/components/LayoutContent";
import { useIsMobile } from "@/hooks/useMobile";
import { AuthProvider } from "@/features/auth/hooks/auth-context";
import { Toaster } from "@/components/ui/sonner";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();

  return (
    <AuthProvider>
      <LayoutContent>
        {isMobile ? (
          <div>
            <Toaster
              position="top-left"
              toastOptions={{
                classNames: { toast: "toast" },
              }}
            />
            <Navbar>{children}</Navbar>
          </div>
        ) : (
          <>
            <Toaster
              position="top-right"
              toastOptions={{
                classNames: {
                  toast: "toast",
                  description: "",
                },
              }}
              className="toaster"
            />
            {children}
          </>
        )}
      </LayoutContent>
    </AuthProvider>
  );
}
