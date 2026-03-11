import { useIsMobile } from "@/hooks/useMobile";
import { Button } from "../../../components/ui/button";
import Image from "next/image";
import { useTranslations } from "next-intl";

type Props = {
  onChangeView: (view: "login" | "signUp" | "forgotPassword") => void;
};

export function ResetPasswordForm({ onChangeView }: Props) {
  const t = useTranslations("auth");
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="flex flex-col p-8 gap-10">
        <div className=" h-full">
          <div className="flex gap-5 items-center">
            <Image src="/iTime.png" width={40} height={40} alt="Icon" />
            <p className="text-[38px] font-semibold bg-gradient-to-br from-[#FFb347] to-[#FF6801] bg-clip-text text-transparent leading-normal">
              {t("resetPassword")}
            </p>
          </div>
          <p className=" mt-6 text-gray-500 text-md">
            {t("resetPasswordSubtitle")}
          </p>
          <Button
            type="submit"
            className="gradient-bg w-full text-white px-4 py-2 rounded-md mt-15 cursor-pointer"
            onClick={() => onChangeView("login")}
          >
            {t("backToLogin")}
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className=" flex flex-col gap-2 w-full p-8">
      <div className=" h-full">
        <p className="text-4xl font-semibold bg-gradient-to-br from-[#FFb347] to-[#FF6801] bg-clip-text text-transparent leading-normal">
          {t("resetPassword")}
        </p>
        <p className=" mt-6 text-gray-500 text-md">
          {t("resetPasswordSubtitle")}
        </p>

        <Button
          type="submit"
          className="gradient-bg w-full text-white px-4 py-2 rounded-md mt-15 cursor-pointer"
          onClick={() => onChangeView("login")}
        >
          {t("backToLogin")}
        </Button>
      </div>
    </div>
  );
}
