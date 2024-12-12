"use client";

import Image from "next/image";
import Link from "next/link";

import { useScrollTrigger } from "~/hooks/use-scroll-trigger";

import AppIcon from "../../../public/icon.png";
import { useAuth } from "../../app/auth/context-provider";
import { Avatar, AvatarFallback, AvatarImage } from "../shadcn/avatar";
import { Button } from "../shadcn/button";
import { GitHubStargazer } from "./github-stargazers";
import { LogoutIcon } from "./icons";
import JustTip from "./just-the-tip";
import ThemeToggle from "./theme-toggle";

const Header = () => {
  const { user, logout } = useAuth();
  const isHidden = useScrollTrigger()

  return (
   
    <header className={`h-14 sticky z-50 top-0 w-full border-b border-border/40 self-start flex justify-between items-center bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border transition-transform duration-300 ${
        isHidden ? "-translate-y-full" : "translate-y-0"
      }`}>

      <div className="flex-1 flex justify-between items-center px-2 container mx-auto">
        <div className="flex gap-2 items-center">
          <Link href="/">
            <h1 className="flex gap-1">
              <Image src={AppIcon} alt="YTCatalog" className="size-7" />
              {user ? null : (
                <p className="self-end text-lg tracking-wide">YTCatalog</p>
              )}
            </h1>
          </Link>
          {user ? (
            <Link
              className="dark:text-white/80 dark:hover:text-white text-primary/80 hover:text-primary"
              href="/dashboard"
            >
              Dashboard
            </Link>
          ) : null}
        </div>
        <div className="flex gap-3 items-center">
          <Link
            className="dark:text-white/80 dark:hover:text-white text-primary/80 hover:text-primary"
            href="/explore"
          >
            Explore
          </Link>
          {user ? (
            <>
              <Avatar className="size-8 rounded-lg hidden md:block">
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
            <GitHubStargazer owner="realChakrawarti" repo="yt-catalog" />
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
