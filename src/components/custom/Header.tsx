"use client";

import Image from "next/image";
import Link from "next/link";

import AppIcon from "../../../public/icon.png";
import { useAuth } from "../../app/auth/context-provider";
import { Avatar, AvatarFallback, AvatarImage } from "../shadcn/avatar";
import { Button } from "../shadcn/button";
import AuthButton from "./auth-buttons";
import { LogoutIcon } from "./icons";
import JustTip from "./just-the-tip";
import ThemeToggle from "./theme-toggle";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="h-14 sticky z-50 top-0 w-full border-b border-border/40 self-start flex justify-between items-center bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border">
      <div className="flex-1 flex justify-between items-end px-3">
        <Link href={user ? "/dashboard" : "/"}>
          <h1 className="flex gap-1">
            <Image src={AppIcon} alt="YTCatalog" className="size-7" />
            <p className="self-end text-lg tracking-wide">YTCatalog</p>
          </h1>
        </Link>
        <div className="flex gap-3 items-center">
          {user ? (
            <>
              <Avatar className="size-8">
                <AvatarImage
                  src={
                    user?.photoURL ||
                    `https://ui-avatars.com/api/?name=${user?.displayName}&background=random&size=96`
                  }
                  alt={user?.displayName || ""}
                />
                <AvatarFallback>{user?.displayName || ""}</AvatarFallback>
              </Avatar>

              <JustTip label="Logout">
                <Button onClick={logout} variant="outline">
                  <LogoutIcon size={24} />
                </Button>
              </JustTip>
            </>
          ) : (
            <AuthButton />
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
