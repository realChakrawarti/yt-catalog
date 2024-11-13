"use client";

import { useAuth } from "../../app/auth/context-provider";
import Image from "next/image";
import AppIcon from "../../../public/icon.png";
import Link from "next/link";
import { Button } from "../shadcn/button";
import { LogoutIcon } from "./icons";
import ThemeToggle from "./theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "../shadcn/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../shadcn/tooltip";
import AuthButton from "./auth-buttons";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="h-14 sticky z-50 top-0 w-full border-b border-border/40 self-start px-3 flex justify-between items-center bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border">
      <div className="flex-1 flex justify-between items-center">
        <div>
          <Link href={user ? "/dashboard" : "/"}>
            <h1 className="flex gap-1">
              <Image src={AppIcon} alt="YTCatalog" className="size-7" />
              <p className="self-end text-lg tracking-wide">YTCatalog</p>
            </h1>
          </Link>
        </div>
        <div className="flex gap-3 items-center">
          {user ? (
            <div className="flex gap-3">
              <Avatar>
                <AvatarImage
                  src={
                    user?.photoURL ||
                    `https://ui-avatars.com/api/?name=${user?.displayName}&background=random&size=96`
                  }
                  alt={user?.displayName || ""}
                />
                <AvatarFallback>{user?.displayName || ""}</AvatarFallback>
              </Avatar>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={logout} variant="ghost">
                      <LogoutIcon size={24} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Logout</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
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
