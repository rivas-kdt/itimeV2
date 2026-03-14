"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/hooks/auth-context";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { useUserProfile } from "@/features/profile/hooks/useUserProfileHooks";
import { getGroup } from "@/features/user-management/services/management.service";
import { useTranslations } from "next-intl";

const groupOptions = [
  {
    id: "Quality Assurance Section 4",
    name: "QA Section 4",
  },
  {
    id: "Quality Assurance Department of Energy & Marine Machinery System",
    name: "QA Dept. of Energy & Marine Machinery System",
  },
  {
    id: "Quality Assurance Division",
    name: "QA Division",
  },
  {
    id: "Energy Solution & Marine Engineering Company",
    name: "Energy Solution & Marine Engineering Company",
  },
];

export default function AccountInfoPage() {
  const t = useTranslations("profile");
  const tAuth = useTranslations("auth");
  const tCommon = useTranslations("common");
  const [isOpen, setIsOpen] = useState(false);
  const { profile, loading, error, updateProfile } = useUserProfile();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    group_name: "",
    group_id: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // Update form when profile loads
  React.useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        email: profile.email || "",
        group_name: profile.group_name || "",
        group_id: profile.group_id || "",
      });
    }
  }, [profile]);

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

  const handleSave = async () => {
    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.email ||
      !formData.group_name ||
      !formData.group_id
    ) {
      toastError(t("allFieldsRequired"));
      return;
    }

    setIsUpdating(true);
    try {
      await updateProfile({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        group_name: formData.group_name,
        group_id: formData.group_id,
      });
      toastSuccess(t("profileUpdatedSuccess"));
      setIsOpen(false);
    } catch (err) {
      toastError(
        err instanceof Error ? err.message : t("profileUpdateFailed"),
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const [group, setGroup] = useState<any[]>([]);

  useEffect(() => {
    const fetchGroups = async () => {
      const res = await getGroup();
      setGroup(res.groups);
    };
    fetchGroups();
  }, []);

  const handleIsOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (loading) {
    return (
      <div className="bg-white-gray h-full text-black px-5 flex flex-col gap-2 justify-center items-center">
        <p>{t("loadingProfile")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white-gray h-full text-black px-5 flex flex-col gap-2 justify-center items-center">
        <p className="text-red-500">{t("errorLabel")}: {error}</p>
      </div>
    );
  }

  return (
    <div className=" bg-white-gray h-full text-black p-5 flex flex-col gap-2">
      <div className="flex flex-col gap-2 bg-white rounded-md full-shadow">
        <div className="p-3 border-b border-gray-100">
          <h5 className="w-full font-bold">{tAuth("employeeId")}</h5>
          <p className="w-full text-sm text-gray-300 ml-3 mt-1">
            {profile?.emp_id}
          </p>
        </div>
        <div className="p-3 border-b border-gray-100">
          <h5 className="w-full font-bold">{t("name")}</h5>
          <p className="w-full text-sm text-gray-300 ml-3 mt-1">{`${profile?.first_name} ${profile?.last_name}`}</p>
        </div>
        <div className="p-3 border-b border-gray-100">
          <h5 className="w-full font-bold">{tAuth("email")}</h5>
          <p className="w-full text-sm text-gray-300 ml-3 mt-1">
            {profile?.email}
          </p>
        </div>
        <div className="p-3">
          <h5 className="w-full font-bold">{tAuth("group")}</h5>
          <p className="w-full text-sm text-gray-300 ml-3 mt-1">
            {profile?.group_name}
          </p>
        </div>
      </div>

      <Button
        className="text-white bg-linear-to-r from-primary-300 to-primary mt-2"
        onClick={handleIsOpen}
      >
        {t("editAccountInfo")}
      </Button>

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="box-design text-black-text">
          <DialogHeader className="border-b border-gray-300 pb-2">
            <DialogTitle className="flex flex-row items-center gap-3 font-semibold">
              <Image src="/user_edit.png" width={35} height={35} alt="icon" />
              {t("updateInformation")}
            </DialogTitle>
            <DialogClose asChild>
              <button
                onClick={handleClose}
                className="absolute right-4 top-2 text-white hover:text-black"
              >
                <X />
              </button>
            </DialogClose>
          </DialogHeader>
          <div className="flex flex-col text-black gap-2">
            <label className="font-bold">{tAuth("employeeId")}</label>
            <Input
              className="border-gray-500 text-sm"
              placeholder={tAuth("employeeId")}
              value={profile?.emp_id || ""}
              disabled
            />
          </div>
          <div className="flex flex-col text-black gap-2">
            <label className="font-bold">{tAuth("firstName")}</label>
            <Input
              className="border-gray-500 text-sm"
              placeholder={tAuth("enterFirstName")}
              value={formData.first_name}
              onChange={(e) => handleInputChange("first_name", e.target.value)}
            />
          </div>
          <div className="flex flex-col text-black gap-2">
            <label className="font-bold">{tAuth("lastName")}</label>
            <Input
              className="border-gray-500 text-sm"
              placeholder={tAuth("enterLastName")}
              value={formData.last_name}
              onChange={(e) => handleInputChange("last_name", e.target.value)}
            />
          </div>
          <div className="flex flex-col text-black gap-2">
            <label className="font-bold">{tAuth("email")}</label>
            <Input
              className="border-gray-500 text-sm"
              placeholder={tAuth("enterEmail")}
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          </div>
          <div className="flex flex-col text-black gap-2">
            <label className="font-bold">{tAuth("group")}</label>
            <Select
              value={formData.group_id}
              onValueChange={(e) => handleInputChange("group_id", e)}
            >
              <SelectTrigger className="border border-gray-500 rounded-md text-black-text px-3 py-5 w-full data-[state=open]:ring-2 data-[state=open]:ring-primary data-[state=open]:border-transparent">
                <SelectValue placeholder={tAuth("selectGroup")} />
              </SelectTrigger>
              <SelectContent className="bg-white text-black-text border-gray-300">
                {group.map((g) => (
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
          <DialogFooter className="flex flex-row justify-between items-center h-full gap-3 mt-2">
            <Button className="cancel-btn w-[48%]" onClick={handleClose}>
              {tCommon("cancel")}
            </Button>
            <Button
              className="text-white w-[48%] gradient-bg"
              onClick={handleSave}
              disabled={isUpdating}
            >
              {isUpdating ? t("saving") : tCommon("save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
