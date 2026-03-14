"use client";
import { useAuth } from "@/features/auth/hooks/auth-context";
import {
  ChartNoAxesCombined,
  ChevronRight,
  ContactRound,
  DoorOpen,
  Info,
  KeyRound,
  Languages,
  MessageCircleQuestionMark,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import Image from "next/image";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Toggle } from "@/components/ui/toggle";
import { Switch } from "@/components/ui/switch";
import { useUserProfile } from "@/features/profile/hooks/useUserProfileHooks";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function ProfilePage() {
  const t = useTranslations("profile");
  const { profile, loading } = useUserProfile();
  const { logout } = useAuth();
  const [isSwitchLang, setIsSwitchLang] = useState(false);
  const router = useRouter()

  const toastStyle = (bg: string, border: string, text: string) => ({
    width: "50%",
    background: `var(${bg})`,
    border: `2px solid var(${border})`,
    color: `var(${text})`,
    margin: "20px 2px 2px 2px",
  });

  const toastSuccess = (title: string) =>
    toast.success(title, {
      style: toastStyle("--lightgreen", "--darkgreen", "--darkgreen"),
    });

  const toastError = (title: string) =>
    toast.error(title, {
      style: toastStyle("--lightred", "--red", "--darkred"),
    });

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/')
      toastSuccess(t("loggedOutSuccess"));
    } catch (error) {
      toastError(t("logoutFailed"));

      console.error("Logout error:", error);
    }
  };

  const handleSwitchLang = (checked: boolean) => {
    setIsSwitchLang(checked);
    if (checked) {
      // trigger your i18n change here
    } else {
    }
  };

  return (
    // <div className="flex flex-col gap-6 p-5 h-full overflow-y-auto text-black-text space-y-4 no-scrollbar">
    <div className="p-5 overflow-y-auto space-y-4 no-scrollbar">
      {/* 4 Main Options */}
      <div className="flex flex-col gap-1 p-4 rounded-md bg-white full-shadow">
        <div className="flex px-1 py-3">
          <Link
            href="/profile/acc-info"
            className="flex justify-between w-full"
          >
            <div className="flex gap-5">
              <div className="flex justify-center items-center bg-primary-op-2 p-2 rounded-full">
                <ContactRound
                  size={32}
                  strokeWidth={1}
                  className="text-primary"
                />
              </div>
              <div className="flex flex-col justify-center items-center">
                <h5 className="w-full font-thin">{t("accountInformation")}</h5>
                <p className="w-full text-xs text-gray-500">
                  {t("viewAccountDetails")}
                </p>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <ChevronRight size={32} />
            </div>
          </Link>
        </div>

        {/* <div className="flex justify-between px-1 py-3">
          <div className="flex gap-5">
            <div className="flex justify-center items-center bg-primary-op-2 p-2 rounded-full">
              <ChartNoAxesCombined
                size={32}
                strokeWidth={1}
                className="text-primary"
              />
            </div>
            <div className="flex flex-col justify-center items-center">
              <h5 className="w-full font-thin">View User Statistics</h5>
              <p className="w-full text-xs text-gray-300">
                See your usage and performance data
              </p>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <Link href="/profile/user-stats">
              <ChevronRight size={32} />
            </Link>
          </div>
        </div> */}

        <div className="flex px-1 py-3">
          <Link
            href="/profile/change-pass"
            className="flex justify-between w-full"
          >
            <div className="flex gap-5">
              <div className="flex justify-center items-center bg-primary-op-2 p-2 rounded-full">
                <KeyRound size={32} strokeWidth={1} className="text-primary" />
              </div>
              <div className="flex flex-col justify-center items-center">
                <h5 className="w-full font-thin">{t("changePassword")}</h5>
                <p className="w-full text-xs text-gray-500">
                  {t("secureAccount")}
                </p>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <ChevronRight size={32} />
            </div>
          </Link>
        </div>

        <div className="flex justify-between px-1 py-3" onClick={handleLogout}>
          <div className="flex gap-5">
            <div className="flex justify-center items-center bg-primary-op-2 p-2 rounded-full">
              <DoorOpen size={32} strokeWidth={1} className="text-primary" />
            </div>
            <div className="flex flex-col justify-center items-center">
              <h5 className="w-full font-thin">{t("logout")}</h5>
              <p className="w-full text-xs text-gray-500">
                {t("signOut")}
              </p>
            </div>
          </div>
          <div className="flex justify-center items-center">
            {/* <button onClick={handleLogout} className=" cursor-pointer"> */}
            <ChevronRight size={32} />
            {/* </button> */}
          </div>
        </div>
      </div>

      {/* Additionals */}
      <div className="flex flex-col gap-3">
        <h5>{t("additionalSettings")}</h5>

        <div className=" p-4 rounded-md bg-white full-shadow">
          <div className="flex justify-between px-1 py-3">
            <div className="flex gap-5">
              <div className="flex justify-center items-center bg-primary-op-2 p-2 rounded-full">
                <Languages size={32} strokeWidth={1} className="text-primary" />
              </div>
              <div className="flex flex-col justify-center items-center">
                <h5 className="w-full font-thin">{t("changeLanguage")}</h5>
                <p className="w-full text-xs text-gray-500">
                  {t("toggleLanguage")}
                </p>
              </div>
            </div>
            <div className="flex justify-center items-center">
              {/* <ChevronRight size={32} /> */}
              <Switch
                checked={isSwitchLang}
                onCheckedChange={handleSwitchLang}
              />
            </div>
          </div>

          <div className="flex justify-between px-1 py-3">
            <div className="flex gap-5">
              <div className="flex justify-center items-center bg-primary-op-2 p-2 rounded-full">
                <MessageCircleQuestionMark
                  size={32}
                  strokeWidth={1}
                  className="text-primary"
                />
              </div>
            <div className="flex flex-col justify-center items-center">
              <h5 className="w-full font-thin">{t("helpSupport")}</h5>
              <p className="w-full text-xs text-gray-500">
                {t("faq")}
              </p>
            </div>
            </div>
            <div className="flex justify-center items-center">
              <ChevronRight size={32} />
            </div>
          </div>

          <div className="flex justify-between px-1 py-3">
            <div className="flex gap-5">
              <div className="flex justify-center items-center bg-primary-op-2 p-2 rounded-full">
                <Info size={32} strokeWidth={1} className="text-primary" />
              </div>
            <div className="flex flex-col justify-center items-center">
              <h5 className="w-full font-thin">{t("aboutApp")}</h5>
              <p className="w-full text-xs text-gray-500">
                {t("aboutAppDesc")}
              </p>
            </div>
            </div>
            <div className="flex justify-center items-center">
              <ChevronRight size={32} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
