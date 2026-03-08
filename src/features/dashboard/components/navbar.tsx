"use client";
import { CircleUser, Clock, FileText, Home, ScanLine } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Navbar = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = `text-primary`;

  if (
    // pathname === "/landing" ||
    // pathname === "/login" ||
    // pathname === "/signup" ||
    // pathname === "/forgot-password" ||
    // pathname === "/change-password" ||
    // pathname === "/"
    [
      "/landing",
      "/login",
      "/signup",
      "/forgot-password",
      "/change-password",
      "/",
    ].includes(pathname)
  ) {
    return <div className=" flex flex-col min-h-screen">{children}</div>;
  }

  return (
    <div className=" flex flex-col min-h-screen h-screen">
      <main className=" h-[calc(100vh-80px)] overflow-y-scroll">{children}</main>
      <div className=" bg-white shadow-top-2xl flex justify-between items-center px-4 text-black h-20 relative">
        {/*relative*/}
        <div className=" w-1/2 flex pr-16 justify-between">
          <Link
            href="/dashboard"
            className={` ${
              pathname === "/dashboard" ? isActive : "text-black/80"
            } flex flex-col items-center gap-1 w-[65px]`}
          >
            <Home size={28} strokeWidth={1} />
            <p className=" text-md">Home</p>
          </Link>
          <Link
            href="/work-orders"
            className={` ${
              pathname.startsWith("/work-orders") ? isActive : "text-black/80"
            } flex flex-col items-center gap-1 w-[65px]`}
          >
            <FileText size={28} strokeWidth={1} />
            <p className=" text-md">Records</p>
          </Link>
        </div>

        <div className="absolute rounded-full bg-white p-3 top-[-4] -translate-y-[25%] right-[50%] translate-x-[50%] z-10">
          <div className=" bg-gradient-to-r from-orange-300 via-orange-400 to-orange-600 active:bg-gradient-to-br rounded-full p-6 text-white z-20">
            <Link href="/scan-barcode">
              <ScanLine size={40} />
            </Link>
          </div>
        </div>

        <div className=" flex w-1/2 pl-14 justify-between">
          <Link
            href="/timer"
            className={` ${
              pathname.startsWith("/timer") ? isActive : "text-black/80"
            } flex flex-col items-center gap-1 w-[65px]`}
          >
            <Clock size={28} strokeWidth={1} />
            <p className=" text-md">Tracker</p>
          </Link>
          <Link
            href="/profile"
            className={` ${
              pathname.startsWith("/profile") ? isActive : "text-black/80"
            } flex flex-col items-center gap-1 w-[65px]`}
          >
            <CircleUser size={28} strokeWidth={1} />
            <p className=" text-md">Profile</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
