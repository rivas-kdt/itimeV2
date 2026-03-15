"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAuth } from "@/features/auth/hooks/auth-context";
import { toast } from "sonner";
import { changePassword } from "@/features/auth/services/auth.service";
import { useTranslations } from "next-intl";

export default function ChangePasswordPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const { session } = useAuth();
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Validation
    setLoading(true)
    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      toastError(t("fillAllFields"));
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toastError(t("newPasswordsDoNotMatch"));
      return;
    }

    if (formData.newPassword.length < 6) {
      toastError(t("passwordMinLength"));
      return;
    }

    try {
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });
      toastSuccess(t("passwordChangedSuccess"));
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      router.push("/profile");
    } catch (err) {
      toastError(
        err instanceof Error ? err.message : t("failedToChangePassword"),
      );
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className=" bg-white-gray h-full text-black p-5 flex flex-col">
      <div className="flex flex-col gap-4 bg-white rounded-md full-shadow p-5">
        <div className="flex flex-col text-black gap-2">
          <label className="">
            {t("currentPassword")} <span className="text-primary">*</span>
          </label>
          <Input
            className="border-gray-500 text-sm"
            placeholder={t("enterCurrentPassword")}
            type="password"
            value={formData.currentPassword}
            onChange={(e) =>
              handleInputChange("currentPassword", e.target.value)
            }
          />
        </div>
        <div className="flex flex-col text-black gap-2">
          <label className="">
            {t("newPassword")} <span className="text-primary">*</span>
          </label>
          <Input
            className="border-gray-500 text-sm"
            placeholder={t("enterNewPassword")}
            type="password"
            value={formData.newPassword}
            onChange={(e) => handleInputChange("newPassword", e.target.value)}
          />
        </div>
        <div className="flex flex-col text-black gap-2">
          <label className="">
            {t("confirmNewPassword")} <span className="text-primary">*</span>
          </label>
          <Input
            className="border-gray-500 text-sm"
            placeholder={t("confirmNewPassword")}
            type="password"
            value={formData.confirmPassword}
            onChange={(e) =>
              handleInputChange("confirmPassword", e.target.value)
            }
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button
          className="text-white bg-linear-to-r from-primary-300 to-primary mt-2"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? t("updatingPassword") : t("updatePassword")}
        </Button>
      </div>
    </div>
  );
}
