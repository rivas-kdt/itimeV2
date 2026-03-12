"use client";
import { useAuth } from "@/features/auth/hooks/auth-context";
import { ChevronLeft, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const UserProfile = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { session } = useAuth();

  return (
    <>
      {/* <div className="bg-white-gray flex flex-col h-full"> */}
      <div className=" bg-white-gray flex flex-col h-full text-black">
        <div className="p-5">
          {pathname.startsWith("/profile/") ? (
            <div className="flex text-black-text">
              <Link
                href="/profile"
                className="flex flex-row items-center gap-1"
              >
                <ChevronLeft strokeWidth={3} />
                <h2 className="my-2"> Back </h2>
              </Link>
            </div>
          ) : (
            <h2 className="my-2 font-bold text-black-text"> My Profile </h2>
          )}
          <div className="flex flex-col gap-6">
            <div className=" flex gap-5 px-8 py-6 rounded-md bg-primary text-white shadow-md">
              <div className="bg-white rounded-[50px] p-2">
                <UserRound size={60} className="text-primary" />
              </div>
              <div className="flex flex-col justify-center items-center">
                <h2 className="w-full font-bold">
                  {session?.user.firstName} {session?.user.lastName}
                </h2>
                <p className="text-sm">{session?.user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
          {children}
        </main>
        {/* {children} */}
      </div>
    </>
  );
};

export default UserProfile;
