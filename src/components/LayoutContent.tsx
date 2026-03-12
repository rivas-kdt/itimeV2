"use client";
import { usePathname } from "next/navigation";
import Header from "@/components/desktop/header";
import { useIsMobile } from "@/hooks/useMobile";

interface LayoutContentProps {
  children: React.ReactNode;
}

const publicRoutes = [
  "/login",
  "/forgot-password",
  "/change-password",
  "/",
  "/landing",
];

export default function LayoutContent({ children }: LayoutContentProps) {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  const isPublicRoute = publicRoutes.includes(pathname);
  if (!isPublicRoute) {
    return (
      <div className="h-screen w-screen flex">
        <div className="flex flex-col flex-1">
          <Header />
          <div className={`overflow-y-auto ${isMobile ? "h-screen w-screen" : "h-[calc(100vh-80px)]"}`}>
            {/* <div className="h-[calc(100vh-80px)] overflow-y-auto"> */}
            {children}
          </div>
        </div>
      </div>
    );
  }

  return <div className="h-screen w-screen">{children}</div>;
}
