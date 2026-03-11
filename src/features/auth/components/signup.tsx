"use client";

import { Mail, Lock, IdCardLanyard } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { useIsMobile } from "@/hooks/useMobile";
import { useAuth } from "@/features/auth/hooks/auth-context";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getGroup } from "@/features/user-management/services/management.service";

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

export function SignUpForm({ onChangeView }: Props) {
  const t = useTranslations("auth");
  const isMobile = useIsMobile();
  const { login, loginLoading } = useAuth();

  const [empID, setEmpID] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [group_id, setGroupId] = useState("");
  const [formError, setFormError] = useState("");

  const [groupOptions, setGroupOptions] = useState<
    Array<{ group_id: string; group_name: string }>
  >([]);

  useEffect(() => {
    const fetchGroups = async () => {
      const res = await getGroup();
      setGroupOptions(res.groups);
    };
    fetchGroups();
  }, []);

  console.log("group id: ", group_id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    // Validation
    if (
      !empID ||
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !group_id
    ) {
      console.log({
        empID,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        group_id,
      });
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

    if (password !== confirmPassword) {
      setFormError(`*${t("passwordsDoNotMatch")}`);
      toastError(isMobile, t("validationError"), t("passwordsDoNotMatch"));
      return;
    }

    try {
      // Call signup API
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empID,
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          group_id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || t("signupFailed"));
      }

      toastSuccess(
        isMobile,
        t("signupSuccess"),
        t("signupSuccessDesc"),
      );

      // Auto login after signup
      await login(email, password);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Signup failed";
      setFormError(errorMessage);
      toastError(
        isMobile,
        t("signupFailed"),
        errorMessage || t("signupFailedDesc"),
      );
    }
  };

  if (isMobile) {
    return (
      <div className="flex flex-col p-8 gap-10">
        <div className=" h-full">
          <div className="flex gap-5 items-center">
            <Image src="/iTime.png" width={40} height={40} alt="Icon" />
            <p className="text-5xl font-semibold bg-gradient-to-br from-[#FFb347] to-[#FF6801] bg-clip-text text-transparent leading-normal">
              {t("signUp")}
            </p>
          </div>
          <p className=" mt-2 text-gray-500 text-md">
            {t("signUpSubtitle")}
          </p>
          {formError && (
            <p className="text-red-500 text-sm mb-2">{formError}</p>
          )}
          <form className=" flex flex-col mt-10 " onSubmit={handleSubmit}>
            <div className=" flex flex-col gap-2 mb-2">
              <label className=" font-semibold text-black">{t("employeeId")}</label>
              <div className="flex px-4 w-full py-1 rounded-md border border-gray-500 ">
                <IdCardLanyard
                  className="text-gray-500 flex self-center"
                  size={30}
                />
                <Input
                  placeholder={t("enterEmployeeId")}
                  type="number"
                  className="input-invis placeholder:text-sm"
                  value={empID}
                  onChange={(e) => setEmpID(e.target.value)}
                />
              </div>
            </div>
            <div className=" flex flex-row gap-2 mb-2">
              <div className=" flex flex-col gap-2">
                <label className=" font-semibold text-black">{t("firstName")}</label>
                <div className="flex w-full rounded-md border border-gray-500 ">
                  <Input
                    placeholder={t("enterFirstName")}
                    type="text"
                    className="input-invis px-4 py-5.5 placeholder:text-sm"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
              </div>

              <div className=" flex flex-col gap-2">
                <label className=" font-semibold text-black">{t("lastName")}</label>
                <div className="flex w-full rounded-md border border-gray-500 ">
                  <Input
                    placeholder={t("enterLastName")}
                    type="text"
                    className="input-invis px-4 py-5.5 placeholder:text-sm"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className=" flex flex-col gap-2 mb-2">
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
            <div className="flex px-4 w-full py-1 rounded-md border border-gray-500 ">
              <Lock className="text-gray-500 flex self-center" size={30} />
              <Input
                type="password"
                placeholder={t("enterPassword")}
                  className="input-invis placeholder:text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className=" flex flex-col gap-2 mb-2">
              <label className=" font-semibold text-black">
                {t("confirmPassword")}
              </label>
              <div className="flex px-4 w-full py-1 rounded-md border border-gray-500 ">
                <Lock className="text-gray-500 flex self-center" size={30} />
                <Input
                  type="password"
                  placeholder={t("enterConfirmPassword")}
                  className="input-invis placeholder:text-sm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-row gap-3 justify-between">
              <div className="flex flex-col gap-1 w-full">
                <label className="font-bold">{t("group")}</label>
                <Select value={group_id} onValueChange={(e) => setGroupId(e)}>
                  <SelectTrigger className="border-1 border-gray-500 rounded-md text-black-text px-3 py-5 w-full ">
                    <SelectValue placeholder={t("selectGroup")} />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-black-text border-gray-300">
                    {groupOptions.map((g) => (
                      <SelectItem
                        key={g.group_id}
                        value={g.group_id}
                        className="selection-hover"
                      >
                        {g.group_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              type="submit"
              className=" gradient-bg text-white px-4 py-2 rounded-md mt-5 disabled:opacity-50"
              disabled={loginLoading}
            >
              {loginLoading ? t("creatingAccount") : t("signUp")}
            </Button>
            <p className=" text-sm font-medium text-gray-500 mt-1">
              {t("alreadyHaveAccount")}
              <span className=" ml-2">
                <Button
                  variant="ghost"
                  className="text-primary font-bold cursor-pointer"
                  onClick={() => onChangeView("login")}
                  type="button"
                >
                  {t("login")}
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
      <div className=" h-full">
        <p className="text-5xl font-semibold bg-gradient-to-br from-[#FFb347] to-[#FF6801] bg-clip-text text-transparent leading-normal">
          {t("signUp")}
        </p>
        <p className=" mt-2 text-gray-500 text-md">
          {t("signUpSubtitle")}
        </p>
        {formError && (
          <p className="text-red-500 text-sm mb-2 mt-4">{formError}</p>
        )}
        <form className=" flex flex-col mt-10" onSubmit={handleSubmit}>
          <div className=" flex flex-row gap-2 mb-2">
            <div className=" flex flex-col gap-2">
              <label className=" font-semibold text-black">{t("firstName")}</label>
              <div className="flex w-full rounded-md border border-gray-500 ">
                <Input
                  placeholder={t("enterFirstName")}
                  type="text"
                  className="input-invis px-4 py-5.5 placeholder:text-sm"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
            </div>

            <div className=" flex flex-col gap-2">
              <label className=" font-semibold text-black">{t("lastName")}</label>
              <div className="flex w-full rounded-md border border-gray-500 ">
                <Input
                  placeholder={t("enterLastName")}
                  type="text"
                  className="input-invis px-4 py-5.5 placeholder:text-sm"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className=" flex flex-col gap-2 mb-2">
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
            <div className="flex px-4 w-full py-1 rounded-md border border-gray-500 ">
              <Lock className="text-gray-500 flex self-center" size={30} />
              <Input
                type="password"
                placeholder={t("enterPassword")}
                className="input-invis placeholder:text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className=" flex flex-col gap-2 mb-2">
            <label className=" font-semibold text-black">
              {t("confirmPassword")}
            </label>
            <div className="flex px-4 w-full py-1 rounded-md border border-gray-500 ">
              <Lock className="text-gray-500 flex self-center" size={30} />
              <Input
                type="password"
                placeholder={t("enterConfirmPassword")}
                className="input-invis placeholder:text-sm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <Button
            type="submit"
            className=" gradient-bg text-white px-4 py-2 rounded-md mt-10 cursor-pointer disabled:opacity-50"
            disabled={loginLoading}
          >
            {loginLoading ? t("creatingAccount") : t("signUp")}
          </Button>
          <p className=" text-sm font-medium text-gray-500 mt-4">
            {t("alreadyHaveAccount")}
            <span className=" ml-2">
              <Button
                variant="ghost"
                className="text-primary font-bold cursor-pointer"
                onClick={() => onChangeView("login")}
                type="button"
              >
                {t("login")}
              </Button>
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
