import type { Metadata } from "next";
import "../../globals.css";
// import Navbar from "@/components/navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import UserProfile from "@/features/profile/components/user";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <title>Dashboard - My App</title>
      <meta name="description" content="Dashboard section" />
      <ProtectedRoute>
        <div className={` antialiased h-full`}>
          {/* <Navbar> */}
          <UserProfile>{children}</UserProfile>
          {/* </Navbar> */}
        </div>
      </ProtectedRoute>
    </>
  );
}
