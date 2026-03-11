"use client";

import { ResetPasswordForm } from "@/features/auth/components/forgotpassword";
import { LoginForm } from "@/features/auth/components/login";
import { SignUpForm } from "@/features/auth/components/signup";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/useMobile";
import Image from "next/image";
import { useEffect, useState } from "react";

export type FormView = "default" | "login" | "signUp" | "forgotPassword";

export default function LandingPage() {
  const isMobile = useIsMobile();
  const [view, setView] = useState<FormView>("default");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isMobile === undefined) {
    return null;
  }

  if (!isMobile) {
    return (
      <div className="min-h-screen text-black flex flex-col items-center justify-center px-8">
        <div className="flex gap-3 box-design p-8 items-stretch h-full">
          <div className="flex flex-col gap-15 p-20 w-lg justify-center">
            <Image src="/iTime.png" width={150} height={150} alt="Icon" />
            <div className="flex flex-col gap-2">
              <h1 className=" text-2xl font-bold bg-linear-to-r from-[#FFB347] to-[#FF6801] bg-clip-text text-transparent">
                Welcome
              </h1>
              <h3 className=" text-gray-500">
                Simplify Work hour tracking with
                <span className=" text-primary font-semibold"> iTime</span>
              </h3>
            </div>
          </div>

          <div className="mx-5 w-px bg-primary self-stretch" />

          <div className="flex flex-col gap-2 w-lg h-fit self-center justify-center">
            {view === "default" && (
              <div className=" flex flex-col gap-5 w-full justify-center">
                <Button
                  className=" text-center text-white gradient-bg px-4 py-3 rounded-sm cursor-pointer"
                  onClick={() => setView("login")}
                >
                  Login
                </Button>
                <Button
                  className=" text-center text-primary border border-primary bg-white px-4 py-3 rounded-sm hover:text-white cursor-pointer"
                  onClick={() => setView("signUp")}
                >
                  Sign Up
                </Button>
              </div>
            )}
            {view === "login" && <LoginForm onChangeView={setView} />}
            {view === "signUp" && <SignUpForm onChangeView={setView} />}
            {view === "forgotPassword" && (
              // <></>
              <ResetPasswordForm onChangeView={setView} />
            )}

            {/* change language btn */}
            {view === "default" ? (
              <div className="flex justify-end relative top-30">
                <Popover>
                  <PopoverTrigger className="flex justify-center items-center text-center rounded-sm cursor-pointer active:bg-gray-100 ">
                    <span className="text-xs border border-gray-500 rounded-lg px-4 py-2">
                      Select Languages
                    </span>
                  </PopoverTrigger>
                  <PopoverContent
                    align="center"
                    className="popover-lang w-37.5 text-black my-1"
                  >
                    <div className="popover-select cursor-pointer">日本語</div>
                    <Separator className="border border-gray-300" />
                    <div className="popover-select cursor-pointer">English</div>
                  </PopoverContent>
                </Popover>
              </div>
            ) : (
              <div className="flex justify-end">
                <Popover>
                  <PopoverTrigger className="flex justify-center items-center text-center rounded-sm cursor-pointer active:bg-gray-100 ">
                    <span className="text-xs border border-gray-500 rounded-lg px-4 py-2">
                      Select Language
                    </span>
                  </PopoverTrigger>
                  <PopoverContent
                    align="center"
                    className="popover-lang w-37.5 text-black my-1"
                  >
                    <div className="popover-select cursor-pointer">日本語</div>
                    <Separator className="border border-gray-300" />
                    <div className="popover-select cursor-pointer">English</div>
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-white min-h-screen text-black flex flex-col">
      {/* <div className="h-full w-full bg-white text-black"> */}
      {view === "default" && (
        <div className="relative flex flex-col min-h-screen px-8 py-24 gap-15">
          <Image src="/iTime.png" width={150} height={150} alt="Icon" />
          <div className="flex flex-col gap-2">
            <h1 className=" text-2xl font-bold bg-linear-to-r from-[#FFB347] to-[#FF6801] bg-clip-text text-transparent">
              Welcome
            </h1>
            <h3 className=" text-gray-500">
              Simplify Work hour tracking with
              <span className=" text-primary font-semibold"> iTime</span>
            </h3>
          </div>

          <div className=" flex flex-col gap-2 w-full mt-5">
            <Button
              className=" text-center text-white gradient-bg px-4 py-3 rounded-sm w-full"
              onClick={() => setView("login")}
            >
              Login
            </Button>
            <Button
              className="bg-white text-center text-primary border border-primary px-4 py-3 rounded-sm w-full active:bg-primary active:text-white"
              onClick={() => setView("signUp")}
            >
              Signup
            </Button>
          </div>
        </div>
      )}
      {view === "login" && <LoginForm onChangeView={setView} />}
      {view === "signUp" && <SignUpForm onChangeView={setView} />}
      {view === "forgotPassword" && (
        // <></>
        <ResetPasswordForm onChangeView={setView} />
      )}
      <div className="flex justify-center">
        <Popover>
          <PopoverTrigger className="flex justify-center items-center text-center mb-10 center active:bg-gray-100">
            <span className="text-sm border border-gray-300 rounded-sm px-5 py-1">
              Select Language
            </span>
          </PopoverTrigger>
          <PopoverContent
            side="top"
            align="center"
            className="popover-lang w-37.5 text-black my-1"
          >
            <div className="flex justify-center px-4 py-2 active:bg-primary active:text-white">
              日本語
            </div>
            <Separator className="border border-primary-300" />
            <div className="flex justify-center px-4 py-2  active:bg-primary active:text-white">
              English
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
