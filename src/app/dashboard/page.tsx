"use client";

import DesktopDashboard from "@/features/dashboard/components/DesktopDashboard";
import MobileDashboard from "@/features/dashboard/components/MobileDashboard";
import { useIsMobile } from "@/hooks/useMobile";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function Dashboard() {
  const isMobile = useIsMobile();
  return (
    <ProtectedRoute>
      <>{isMobile ? <MobileDashboard /> : <DesktopDashboard />}</>
    </ProtectedRoute>
  );
}
