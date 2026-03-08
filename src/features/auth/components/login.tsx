"use client";

import { Mail, Lock } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/useMobile";
import { useAuth } from "@/features/auth/hooks/auth-context";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  onChangeView: (view: "login" | "signUp" | "forgotPassword") => void;
};

const toastStyle = (
  isMobile: boolean,
  bg: string,
  border: string,
  text: string,
) => {
  const width = isMobile ? "70%" : "100%";
  console.log("isMobile: ", isMobile);
  console.log("width: ", width);

  return {
    width,
    background: `var(${bg})`,
    border: `2px solid var(${border})`,
    color: `var(${text})`,
  };
};

const toastSuccess = (
  isMobile: boolean | undefined,
  title: string,
  desc: string,
) =>
  toast.success(title, {
    description: <span className="text-black-text">{desc}</span>,
    style: toastStyle(
      isMobile ?? false,
      "--lightgreen",
      "--darkgreen",
      "--darkgreen",
    ),
  });

const toastError = (
  isMobile: boolean | undefined,
  title: string,
  desc: string,
) =>
  toast.error(title, {
    description: <span className="text-white">{desc}</span>,
    style: toastStyle(isMobile ?? false, "--lightred", "--red", "--darkred"),
  });

export function LoginForm({ onChangeView }: Props) {
  const isMobile = useIsMobile();
  const { login, loginLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Validation
    if (!email || !password) {
      setFormError("*Please fill in all fields");
      toastError(isMobile, "Validation Error", "Please fill in all fields");
      return;
    }

    if (!email.includes("@")) {
      setFormError("*Please enter a valid email");
      toastError(isMobile, "Validation Error", "Please enter a valid email");
      return;
    }

    if (password.length < 6) {
      setFormError("*Password must be at least 6 characters");
      toastError(
        isMobile,
        "Validation Error",
        "Password must be at least 6 characters",
      );
      return;
    }

    try {
      await login(email, password);
      toastSuccess(isMobile, "Login Successful", "You are now logged in");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      setFormError(errorMessage);
      toastError(isMobile, "Login Failed", errorMessage || "Please try again.");
    }
  };

  if (isMobile) {
    return (
      <div className="flex flex-col p-8 gap-10">
        <div className=" h-full">
          <div className="flex gap-5 items-center">
            <Image
              src="/iTime.png"
              width={40}
              height={40}
              alt="Icon"
              className="h-fit"
            />
            <p className="w-fit text-5xl font-semibold bg-gradient-to-br from-[#FFb347] to-[#FF6801] bg-clip-text text-transparent leading-normal">
              Login
            </p>
          </div>
          <p className=" mt-2 text-gray-500 text-md">
            Effortlessly monitor inspection durations for precise time tracking
            and seamless reporting.
          </p>
          {formError && (
            <p className="text-red-500 text-sm mb-2">{formError}</p>
          )}
          <form className=" flex flex-col mt-10" onSubmit={handleSubmit}>
            <div className=" flex flex-col gap-2 mb-4">
              <label className=" font-semibold text-black">Email</label>
              <div className="flex px-4 w-full py-1 rounded-md border border-gray-500 ">
                <Mail className="text-gray-500 flex self-center" size={30} />
                <Input
                  placeholder="Enter Email"
                  type="email"
                  className="input-invis placeholder:text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className=" flex flex-col gap-2 mb-2">
              <label className=" font-semibold text-black">Password</label>
              <div className="flex px-4 w-full py-1 rounded-md border border-black-500 ">
                <Lock className="text-gray-500 flex self-center" size={30} />
                <Input
                  placeholder="Enter Password"
                  type="password"
                  className="input-invis placeholder:text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button
              variant="ghost"
              className="self-end text-primary font-bold cursor-pointer"
              onClick={() => onChangeView("forgotPassword")}
              type="button"
            >
              Forgot Password?
            </Button>

            <Button
              type="submit"
              className=" gradient-bg text-white px-4 py-2 rounded-md mt-15 disabled:opacity-50"
              disabled={loginLoading}
            >
              {loginLoading ? "Logging in..." : "Login"}
            </Button>

            <p className=" text-sm font-medium text-gray-500 mt-4">
              New Inspector?
              <span className=" ml-2">
                <Button
                  variant="ghost"
                  className="text-primary font-bold cursor-pointer"
                  onClick={() => onChangeView("signUp")}
                  type="button"
                >
                  Create new account
                </Button>
              </span>
            </p>
          </form>
        </div>
      </div>
    );
  }
  return (
    <div className=" flex flex-col gap-2 w-full p-8">
      <div className=" h-full max-w-2xl">
        <p className="text-5xl font-semibold bg-gradient-to-br from-[#FFb347] to-[#FF6801] bg-clip-text text-transparent leading-normal">
          Login
        </p>
        <p className=" mt-2 text-gray-500 text-md">
          Effortlessly monitor inspection durations for precise time tracking
          and seamless reporting.
        </p>
        {formError && (
          <p className="text-red-500 text-sm mb-2 mt-4">{formError}</p>
        )}
        <form className=" flex flex-col mt-10" onSubmit={handleSubmit}>
          <div className=" flex flex-col gap-2 mb-4">
            <label className=" font-semibold text-black">Email</label>
            <div className="flex px-4 w-full py-1 rounded-md border border-gray-500 ">
              <Mail className="text-gray-500 flex self-center" size={30} />
              <Input
                placeholder="Enter Email"
                type="email"
                className="input-invis placeholder:text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className=" flex flex-col gap-2 mb-2">
            <label className=" font-semibold text-black">Password</label>
            <div className="flex px-4 w-full py-1 rounded-md border border-black-500 ">
              <Lock className="text-gray-500 flex self-center" size={30} />
              <Input
                placeholder="Enter Password"
                type="password"
                className="input-invis placeholder:text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <Button
            variant="ghost"
            className="self-end text-primary font-bold cursor-pointer"
            onClick={() => onChangeView("forgotPassword")}
            type="button"
          >
            Forgot Password?
          </Button>

          <Button
            type="submit"
            className=" gradient-bg text-white px-4 py-2 rounded-md mt-15 cursor-pointer disabled:opacity-50"
            disabled={loginLoading}
          >
            {loginLoading ? "Logging in..." : "Login"}
          </Button>

          <p className=" text-sm font-medium text-gray-500 mt-4">
            New Inspector?
            <span className="">
              <Button
                variant="ghost"
                className="text-primary font-bold cursor-pointer"
                onClick={() => onChangeView("signUp")}
                type="button"
              >
                Create new account
              </Button>
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
