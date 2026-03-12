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
import { useTranslations } from "next-intl";

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
  const t = useTranslations("auth");
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
      setFormError(`*${t("fillAllFields")}`);
      toastError(isMobile, t("validationError"), t("fillAllFields"));
      return;
    }

    if (!email.includes("@")) {
      setFormError(`*${t("validEmail")}`);
      toastError(isMobile, t("validationError"), t("validEmail"));
      return;
    }

    if (password.length < 6) {
      setFormError(`*${t("passwordMinLength")}`);
      toastError(
        isMobile,
        t("validationError"),
        t("passwordMinLength"),
      );
      return;
    }

    try {
      await login(email, password);
      toastSuccess(isMobile, t("loginSuccess"), t("loggedIn"));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : t("loginFailed");
      setFormError(errorMessage);
      toastError(isMobile, t("loginFailed"), errorMessage || t("pleaseTryAgain"));
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
              {t("login")}
            </p>
          </div>
          <p className=" mt-2 text-gray-500 text-md">
            {t("loginSubtitle")}
          </p>
          {formError && (
            <p className="text-red-500 text-sm mb-2">{formError}</p>
          )}
          <form className=" flex flex-col mt-10" onSubmit={handleSubmit}>
            <div className=" flex flex-col gap-2 mb-4">
              <label className=" font-semibold text-black">{t("email")}</label>
              <div className="flex px-4 w-full py-1 rounded-md border border-gray-500 ">
                <Mail className="text-gray-500 flex self-center" size={30} />
                <Input
                  placeholder={t("enterEmail")}
                  type="email"
                  className="input-invis placeholder:text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className=" flex flex-col gap-2 mb-2">
              <label className=" font-semibold text-black">{t("password")}</label>
              <div className="flex px-4 w-full py-1 rounded-md border border-black-500 ">
                <Lock className="text-gray-500 flex self-center" size={30} />
                <Input
                  placeholder={t("enterPassword")}
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
              {t("forgotPassword")}
            </Button>

            <Button
              type="submit"
              className=" gradient-bg text-white px-4 py-2 rounded-md mt-15 disabled:opacity-50"
              disabled={loginLoading}
            >
              {loginLoading ? t("loggingIn") : t("login")}
            </Button>

            <p className=" text-sm font-medium text-gray-500 mt-4">
              {t("newInspector")}
              <span className=" ml-2">
                <Button
                  variant="ghost"
                  className="text-primary font-bold cursor-pointer"
                  onClick={() => onChangeView("signUp")}
                  type="button"
                >
                  {t("createNewAccount")}
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
          {t("login")}
        </p>
        <p className=" mt-2 text-gray-500 text-md">
          {t("loginSubtitle")}
        </p>
        {formError && (
          <p className="text-red-500 text-sm mb-2 mt-4">{formError}</p>
        )}
        <form className=" flex flex-col mt-10" onSubmit={handleSubmit}>
          <div className=" flex flex-col gap-2 mb-4">
            <label className=" font-semibold text-black">{t("email")}</label>
            <div className="flex px-4 w-full py-1 rounded-md border border-gray-500 ">
              <Mail className="text-gray-500 flex self-center" size={30} />
              <Input
                placeholder={t("enterEmail")}
                type="email"
                className="input-invis placeholder:text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className=" flex flex-col gap-2 mb-2">
            <label className=" font-semibold text-black">{t("password")}</label>
            <div className="flex px-4 w-full py-1 rounded-md border border-black-500 ">
              <Lock className="text-gray-500 flex self-center" size={30} />
              <Input
                placeholder={t("enterPassword")}
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
            {t("forgotPassword")}
          </Button>

          <Button
            type="submit"
            className=" gradient-bg text-white px-4 py-2 rounded-md mt-15 cursor-pointer disabled:opacity-50"
            disabled={loginLoading}
          >
            {loginLoading ? t("loggingIn") : t("login")}
          </Button>

          <p className=" text-sm font-medium text-gray-500 mt-4">
            {t("newInspector")}
            <span className="">
              <Button
                variant="ghost"
                className="text-primary font-bold cursor-pointer"
                onClick={() => onChangeView("signUp")}
                type="button"
              >
                {t("createNewAccount")}
              </Button>
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
