"use client";

import { useIsMobile } from "@/hooks/useMobile";
import { Languages, LockKeyhole, LogOut, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/Sample Title Logo.png";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";
import { ChangePassDialog } from "@/features/auth/components/changePassDialog";
import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/auth-context";
import { toast } from "sonner";
import { changePassword } from "@/features/auth/services/auth.service";
import { Button } from "../ui/button";

export default function Header() {
  const { isMobile, isLoading } = useIsMobile();
  const pathname = usePathname();
  const { session, logout } = useAuth();
  const isActive = `gradient-bg text-white p-2 rounded-full transition-colors`;
  const [isChangePass, setIsShowChangePass] = useState(false);

  if (isMobile && !isLoading) return null;

  if (
    pathname.startsWith("/profile/") ||
    pathname === "/scan-barcode" ||
    pathname === "/timer" ||
    pathname.startsWith("/work-orders/") ||
    pathname === "/signup" ||
    pathname === "/"
  ) {
    return null;
  }

  // toast helpers
  const toastStyle = (bg: string, border: string, text: string) => ({
    width: "100%",
    background: `var(${bg})`,
    border: `2px solid var(${border})`,
    color: `var(${text})`,
  });

  const toastSuccess = (title: string, desc: string) =>
    toast.success(title, {
      description: <span className="text-black-text">{desc}</span>,
      style: toastStyle("--lightgreen", "--darkgreen", "--darkgreen"),
    });

  const toastError = (title: string, desc: string) =>
    toast.error(title, {
      description: <span className="text-white">{desc}</span>,
      style: toastStyle("--lightred", "--red", "--darkred"),
    });

  return (
    <div>
      <div className="flex justify-between items-center bg-white shadow-lg shadow-primary/40 px-10 py-1 gap-5 btm-box-shadow">
        <div className="w-full">
          <div className="flex flex-row text-center justify-start items-center px-5">
            <Image
              alt="logo"
              src={logo}
              quality={100}
              width={150}
              sizes="100vw"
              style={{
                filter: "none",
              }}
              // className="ml-3"
            />
          </div>
        </div>

        <div className="flex justify-center w-full gap-5">
          <div
            className={`grid ${
              session?.user?.role === "Admin" ? "grid-cols-3" : "grid-cols-2"
            } items-center justify-end w-full text-lg text-black gap-5`}
          >
            <Link
              href="/dashboard"
              className={` ${
                pathname === "/dashboard" ? isActive : "text-black-text"
              } transition-colors duration-300 ease-in-out col-span-1 text-center items-center gap-1`}
            >
              <p
                className={`text-md ${
                  pathname !== "/dashboard" ? "hover:text-primary" : ""
                }`}
              >
                Dashboard
              </p>
            </Link>
            <Link
              href="/records"
              className={` ${
                pathname === "/records" ? isActive : "text-black-text"
              } transition-colors duration-300 ease-in-out col-span-1 text-center items-center gap-1`}
            >
              <p
                className={`text-md ${
                  pathname !== "/records" ? "hover:text-primary" : ""
                }`}
              >
                My Records
              </p>
            </Link>
            {session?.user?.role === "Admin" && (
              <Link
                href="/user-management"
                className={` ${
                  pathname.startsWith("/user-management")
                    ? isActive
                    : "text-black-text"
                } transition-colors duration-300 ease-in-out col-span-1 text-center items-center gap-1`}
              >
                <p
                  className={`text-md ${
                    !pathname.startsWith("/user-management")
                      ? "hover:text-primary"
                      : ""
                  }`}
                >
                  Management
                </p>
              </Link>
            )}
          </div>
        </div>

        <div className="w-full flex justify-end items-center gap-5">
          <div className="w-fit self-center no-wrap text-black-text font-bold text-2xl">
            Hello,{" "}
            <span className="text-primary-300 no-wrap w-fit">
              {session?.user?.firstName} {session?.user?.lastName}
            </span>
          </div>
          <Popover>
            <PopoverTrigger className="cursor-pointer flex justify-center">
              <UserRound
                size={50}
                className="rounded-full border-3 border-primary p-1"
              />
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="popover-design w-55 text-black"
            >
              <div
                className="popover-content transition-all"
                onClick={() => setIsShowChangePass(true)}
              >
                <LockKeyhole className="text-primary" size={18} />
                Change Password
              </div>
              <Separator className="border border-primary-300" />
              <Link href="/testing" className="popover-content transition-all">
                <Languages className="text-primary" size={18} />
                Switch Language
              </Link>
              <Separator className="border border-primary-300" />
              <Button onClick={logout} variant={"ghost"} className="popover-content transition-all">
                <LogOut className="text-primary" size={18} />
                Logout
              </Button>
            </PopoverContent>
          </Popover>
        </div>

        <ChangePassDialog
          open={isChangePass}
          onOpenChange={setIsShowChangePass}
          onChangePass={() =>
            toastSuccess(
              "Password Updated Successfully",
              "You have changed your password. Please Login again. Thank You."
            )
          }
        />
      </div>
    </div>
  );
}
