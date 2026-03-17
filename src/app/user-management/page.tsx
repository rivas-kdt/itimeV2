"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/useMobile";
import { cn } from "@/lib/utils";
import {
  EllipsisVertical,
  Eraser,
  ListFilter,
  Plus,
  SearchIcon,
  SearchX,
  Trash2,
  UserRound,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

import type { UserDTO } from "@/features/user-management/types";
import { useManagement } from "@/features/user-management/hooks/useManagementHooks";
import { getGroup } from "@/features/user-management/services/management.service";
import { useTranslations } from "next-intl";

type AddUserForm = {
  empID: string;
  first_name: string;
  last_name: string;
  email: string;
  access: "Admin" | "User";
  group_id: string;
  dept_id: string;
  password: string;
};

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

function safeInitials(u: Pick<UserDTO, "first_name" | "last_name">) {
  const a = (u.first_name?.[0] ?? "").toUpperCase();
  const b = (u.last_name?.[0] ?? "").toUpperCase();
  return a + b || "U";
}

export default function UserManagementPage() {
  return (
    <ProtectedRoute>
      <UserManagementContent />
    </ProtectedRoute>
  );
}

function UserManagementContent() {
  const router = useRouter();
  const { isMobile, isLoading } = useIsMobile();
  const t = useTranslations("userManagement");

  useEffect(() => {
    if (isMobile === undefined) return;
    if (isMobile && !isLoading) router.replace("/dashboard");
  }, [isMobile, router, isLoading]);

  const {
    refetch,
    users,
    loading,
    error,
    searchUser,
    setSearchUser,
    roleFilter,
    setRoleFilter,
    removeUser,
    addUser,
  } = useManagement();

  const safeRoleFilter: string[] = Array.isArray(roleFilter)
    ? roleFilter
    : [roleFilter];

  const [isAddNew, setIsAddNew] = useState(false);
  const [isDeleteUser, setIsDeleteUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDTO | null>(null);

  const [form, setForm] = useState<AddUserForm>({
    empID: "",
    first_name: "",
    last_name: "",
    email: "",
    access: "User",
    group_id: "",
    dept_id: "",
    password: "",
  });

  const isSearching = searchUser.trim().length > 0 || safeRoleFilter.length > 0;

  const handleToast = (status: boolean, action: string, extra?: string) => {
    if (status && action === "deleteUser") {
      return toastSuccess(t("userDeletedSuccess"), t("userDeletedDesc"));
    }
    if (status && action === "addUser") {
      return toastSuccess(t("userAddedSuccess"), t("userAddedDesc"));
    }
    if (!status && action === "deleteUser") {
      return toastError(t("failedToDeleteUser"), extra ?? t("processFailed"));
    }
    if (!status && action === "addUser") {
      return toastError(t("failedToAddUser"), extra ?? t("processFailed"));
    }
  };

  const openDelete = (empID: string) => {
    const u = users.find((x) => x.empID === empID) ?? null;
    setSelectedUser(u);
    setIsDeleteUser(true);
  };

  const resetForm = () => {
    setForm({
      empID: "",
      first_name: "",
      last_name: "",
      email: "",
      access: "User",
      group_id: "",
      dept_id: "",
      password: "",
    });
  };

  const fullName = useMemo(() => {
    if (!selectedUser) return null;
    return `${selectedUser.first_name} ${selectedUser.last_name}`;
  }, [selectedUser]);

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

  // const groupOptions = [
  //   { id: "00000000-0000-0000-0000-000000000001", name: "group_A" },
  //   { id: "00000000-0000-0000-0000-000000000002", name: "group_B" },
  // ];

  const onSubmitAdd = async () => {
    try {
      if (!form.last_name.trim() || !form.email.trim() || !form.group_id) {
        handleToast(false, "addUser", t("fillAllRequired"));
        return;
      }

      await addUser({
        empID: form.empID.trim(),
        first_name: form.first_name.trim() || "—",
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        group_id: form.group_id,
        access: form.access,
        password: form.password,
      });

      handleToast(true, "addUser");
      setIsAddNew(false);
      resetForm();
    } catch (e: any) {
      handleToast(false, "addUser", e?.message);
    }
  };

  const onConfirmDelete = async () => {
    try {
      if (!selectedUser) return;
      await removeUser(selectedUser.empID);
      handleToast(true, "deleteUser");
      setIsDeleteUser(false);
      setSelectedUser(null);
    } catch (e: any) {
      handleToast(false, "deleteUser", e?.message);
    }
  };

  return (
    <div className="flex flex-col gap-5 h-full px-20 py-8">
      {/* Search and Filter */}
      <div className="border-0 box-design p-4">
        <div className="flex flex-row gap-3">
          <div className="w-full h-full">
            <ButtonGroup className="w-full">
              <ButtonGroupText
                asChild
                className="h-9 w-10 border border-primary p-2"
              >
                <SearchIcon
                  size={10}
                  strokeWidth={2}
                  className="bg-primary-op-2 text-primary"
                />
              </ButtonGroupText>
              <InputGroup className="border border-primary p-0 m-0 focus:outline-none">
                <InputGroupInput
                  placeholder={t("searchPlaceholder")}
                  className="text-black-text text-lg placeholder:text-lg mt-1"
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                />
              </InputGroup>
            </ButtonGroup>
          </div>

          <div className="flex flex-row justify-between gap-3 h-7.5">
            <Popover>
              <PopoverTrigger className="btn-css gradient-bg">
                {t("filterByRole")} <ListFilter />
              </PopoverTrigger>
              <PopoverContent
                align="center"
                className="popover-design w-40 text-black"
              >
                {/* Admin Checkbox */}
                <div
                  className="flex items-center p-3 justify-between cursor-pointer hover:bg-gray-50 rounded"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <div className="flex items-center gap-3">
                    <UserRound className="text-primary" />
                    <span className="text-black-text">{t("admin")}</span>
                  </div>
                  <Checkbox
                    checked={roleFilter === "Admin"}
                    onCheckedChange={(checked) =>
                      setRoleFilter(checked ? "Admin" : "ALL")
                    }
                    className="checkbox-css mr-2"
                  />
                </div>
                <Separator className="border border-primary-300" />

                {/* User Checkbox */}
                <div
                  className="flex items-center p-3 justify-between cursor-pointer hover:bg-gray-50 rounded"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <div className="flex items-center gap-3">
                    <UsersRound className="text-primary" />
                    <span className="text-black-text">{t("user")}</span>
                  </div>
                  <Checkbox
                    checked={roleFilter === "User"}
                    onCheckedChange={(checked) =>
                      setRoleFilter(checked ? "User" : "ALL")
                    }
                    className="checkbox-css mr-2"
                  />
                </div>
              </PopoverContent>
            </Popover>

            <Button
              className="btn-css gradient-bg"
              onClick={() => {
                setSearchUser("");
                setRoleFilter("ALL");
              }}
            >
              {t("clear")} <Eraser />
            </Button>
          </div>
        </div>
      </div>

      {/* No Users Found */}
      {!loading && users.length === 0 && isSearching && (
        <div className="w-full h-full flex flex-col justify-center items-center">
          <SearchX size={200} className="text-primary" />
          <h1 className="text-black-text font-bold">{t("noMatchingUsers")}</h1>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="box-design p-4 text-red border border-red">
          {error}
          <Button className="ml-4 gradient-bg" onClick={() => refetch()}>
            {t("retry")}
          </Button>
        </div>
      )}

      {/* Users Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 2xl:grid-cols-8 gap-4 pb-5">
        {/* Add New User Card */}
        {!(isSearching && users.length === 0) && (
          <div
            className="group flex flex-col gap-5 justify-center items-center text-center py-30 bg-transparent border-8 border-white rounded-lg shadow-lg/30 hover:bg-white hover:cursor-pointer"
            onClick={() => setIsAddNew(true)}
          >
            <button>
              <Plus
                size={100}
                className="bg-white rounded-full p-5 border-5 border-primary-op-2 group-hover:bg-primary group-hover:text-white hover:cursor-pointer"
              />
            </button>
            <h4 className="font-bold text-black-text">{t("addNewUser")}</h4>
          </div>
        )}

        {/* User Cards */}
        {users.map((user) => (
          <Card
            key={user.empID}
            className="flex flex-col gap-2 justify-center items-center text-center box-design hover:-mt-2.5 hover:mb-2.5"
          >
            <CardHeader className="text-black w-full">
              <div className="flex justify-end">
                <Popover>
                  <PopoverTrigger className="cursor-pointer">
                    <EllipsisVertical />
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
                    className="flex flex-row items-center gap-3 w-fit bg-white border-2 border-red text-red text-sm cursor-pointer shadow-lg/30 hover:bg-red-100"
                    onClick={() => openDelete(user.empID)}
                  >
                    <Trash2 size={20} />
                    {t("deleteUser")}
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-col justify-center items-center gap-2">
                <div className="flex rounded-full border-5 border-gray-100 text-primary text-4xl font-bold justify-center items-center w-32 aspect-square">
                  {safeInitials(user)}
                </div>

                <CardTitle className="text-black-text text-xl">
                  {user.first_name} {user.last_name}
                  <p className="text-gray-500">#{user.empID}</p>
                </CardTitle>

                {/* TODO - add role */}
                <CardDescription className="bg-gray-100 w-full text-md text-black-text font-bold">
                  {user.role}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="text-black-text">
              <div>
                <span className="font-bold text-primary not-italic">
                  {user.inspections}
                </span>{" "}
                <p className="text-gray-500 text-sm">{t("totalInspections")}</p>
              </div>
            </CardContent>

            <CardFooter className="transition-all">
              <Link href={`/user-management/${user.empID}`}>
                <Button className="btn-gradient text-white text-sm font-bold px-10 py-2 rounded-full cursor-pointer ">
                  {t("viewProfile")}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Add New User Dialog */}
      <Dialog open={isAddNew} onOpenChange={setIsAddNew}>
        <DialogContent className="box-design max-w-md w-fit text-black-text">
          <DialogHeader className="border-b border-b-primary pb-2">
            <DialogTitle>{t("addNewUserTitle")}</DialogTitle>
            <DialogDescription className="text-gray-300 italic">
              {t("requiredFieldsMarked")}
              <span className="text-primary"> *</span>
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col w-full gap-1">
              <label className="font-bold">
                {t("employeeId")} <span className="text-primary">*</span>
              </label>
              <Input
                id="empID"
                type="number"
                min={0}
                className="border-gray-300 text-sm"
                placeholder={t("placeholderEmpId")}
                value={form.empID}
                onChange={(e) =>
                  setForm((p) => ({ ...p, empID: e.target.value }))
                }
              />
            </div>

            <div className="flex flex-row gap-3">
              <div className="flex flex-col w-full gap-1">
                <label className="font-bold">{t("firstName")}</label>
                <Input
                  id="firstname"
                  className="border-gray-300 text-sm"
                  placeholder={t("enterFirstName")}
                  value={form.first_name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, first_name: e.target.value }))
                  }
                />
              </div>
              <div className="flex flex-col w-full gap-1">
                <label className="font-bold">
                  {t("lastName")} <span className="text-primary">*</span>
                </label>
                <Input
                  id="lastname"
                  className="border-gray-300 text-sm"
                  placeholder={t("enterLastName")}
                  required
                  value={form.last_name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, last_name: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="flex flex-col w-full gap-1">
              <label className="font-bold">
                {t("email")} <span className="text-primary">*</span>
              </label>
              <Input
                id="email"
                className="border-gray-300 text-sm"
                placeholder={t("enterEmail")}
                required
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
              />
            </div>

            {/* <div className="flex flex-col w-full gap-1">
              <label className="font-bold">Access</label>
                <Select
                  value={form.access}
                  onValueChange={(v: "Admin" | "User") =>
                    setForm((p) => ({ ...p, access: v }))
                  }
                >
                  <SelectTrigger className="border-1 border-gray-300 rounded-md text-black-text px-3 py-5 w-full data-[state=open]:ring-2 data-[state=open]:ring-primary data-[state=open]:border-transparent">
                    <SelectValue placeholder={t("selectAccess")} />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-black-text border-gray-300">
                    <SelectItem value="Admin" className="selection-hover">
                      {t("admin")}
                    </SelectItem>
                    <SelectItem value="User" className="selection-hover">
                      {t("user")}
                    </SelectItem>
                  </SelectContent>
                </Select>
            </div> */}

            <div className="flex flex-col w-full gap-1">
              <label className="font-bold">{t("password")}</label>
              <Input
                id="password"
                type="password"
                className="border-gray-300 text-sm"
                placeholder={t("enterPassword")}
                value={form.password}
                onChange={(e) =>
                  setForm((p) => ({ ...p, password: e.target.value }))
                }
              />
            </div>

            <div className="flex flex-row gap-3 justify-between">
              <div className="flex flex-col gap-1 w-full">
                <label className="font-bold">
                  {t("group")} <span className="text-primary">*</span>
                </label>
                <Select
                  value={form.group_id}
                  onValueChange={(v) => setForm((p) => ({ ...p, group_id: v }))}
                >
                  <SelectTrigger className="border border-gray-300 rounded-md text-black-text px-3 py-5 w-full max-w-48.5 min-w-0 flex items-center overflow-hidden data-[state=open]:ring-2 data-[state=open]:ring-primary data-[state=open]:border-transparent">
                    <SelectValue
                      placeholder={t("selectGroup")}
                      className="truncate"
                    />
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

              <div className="flex flex-col w-full gap-1">
                <label className="font-bold">
                  {t("access")} <span className="text-primary">*</span>
                </label>
                <Select
                  value={form.access}
                  onValueChange={(v: "Admin" | "User") =>
                    setForm((p) => ({ ...p, access: v }))
                  }
                >
                  <SelectTrigger className="border border-gray-300 rounded-md text-black-text px-3 py-5 w-full data-[state=open]:ring-2 data-[state=open]:ring-primary data-[state=open]:border-transparent">
                    <SelectValue placeholder={t("selectAccess")} />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-black-text border-gray-300">
                    <SelectItem value="Admin" className="selection-hover">
                      {t("admin")}
                    </SelectItem>
                    <SelectItem value="User" className="selection-hover">
                      {t("user")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* <div className="flex flex-col w-full gap-1">
              <label className="font-bold">Password</label>
              <Input
                id="password"
                type="password"
                className="border-gray-300 text-sm"
                placeholder="Optional (demo)"
                value={form.password}
                onChange={(e) =>
                  setForm((p) => ({ ...p, password: e.target.value }))
                }
              />
            </div> */}
          </div>

          <DialogFooter>
            <Button
              className="cancel-btn"
              onClick={() => {
                setIsAddNew(false);
                resetForm();
              }}
            >
              {t("cancel")}
            </Button>
            <Button
              className="gradient-bg rounded-md text-white px-5 py-2"
              onClick={() => {
                addUser({
                  empID: form.empID.trim(),
                  first_name: form.first_name.trim() || "—",
                  last_name: form.last_name.trim() || "—",
                  email: form.email.trim(),
                  group_id: form.group_id,
                  access: form.access,
                  password: form.password,
                });
                handleToast(true, "addUser");
                setIsAddNew(false);
                resetForm();
              }}
            >
              {t("addUser")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Alert Dialog */}
      <AlertDialog open={isDeleteUser} onOpenChange={setIsDeleteUser}>
        <AlertDialogContent className="box-design">
          <AlertDialogHeader className="text-black">
            <AlertDialogTitle>
              {t("deleteUserConfirm")}{" "}
              <span
                className={cn(fullName ? "text-primary" : "text-red italic")}
              >
                {fullName ? `${fullName}?` : t("userNotFound")}
              </span>
            </AlertDialogTitle>
            <AlertDialogDescription className="my-3">
              {t("deleteUserConfirmDesc")}
            </AlertDialogDescription>
            {/* <AlertDialogDescription className="text-xs text-gray-400">
              {t("deleteUserNote")}
            </AlertDialogDescription> */}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red hover:bg-red-700"
              onClick={onConfirmDelete}
            >
              {t("deleteUser")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
