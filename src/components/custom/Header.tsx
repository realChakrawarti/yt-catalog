"use client";

import { useAuth } from "../../app/auth/context-provider";
import { Menu, MenuSeparator, MenuItem } from "./Menu";
import { MenuTrigger } from "react-aria-components";
import Image from "next/image";
import AppIcon from "../../../public/icon.png";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "../shadcn/button";
import { useIsClient } from "usehooks-ts";

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const isClient = useIsClient();

  return (
    <header
      suppressHydrationWarning
      className="h-full bg-slate-800 flex justify-between items-center self-start p-3"
    >
      <Link href={user ? "/dashboard" : "/"}>
        <h1 className="flex gap-1">
          <Image src={AppIcon} alt="YTCatalog" className="size-7" />
          <p className="self-end text-lg tracking-wide">YTCatalog</p>
        </h1>
      </Link>
      {user ? (
        <div className="flex gap-3">
          <div
            className="p-3 border border-white cursor-pointer"
            onClick={logout}
          >
            Logout
          </div>
          <MenuTrigger>
            <Button className="flex gap-2 items-center">
              <p className="text-lg text-white">{user?.displayName}</p>
              <img
                className="size-10"
                src={
                  user?.photoURL ||
                  `https://ui-avatars.com/api/?name=${user?.displayName}&background=random&size=96`
                }
                alt={user?.displayName || ""}
              />
            </Button>
            <Menu placement="bottom end">
              <MenuItem isDisabled id="name">
                <span className="font-semibold text-gray-700">
                  {user?.displayName}
                </span>
              </MenuItem>
              <MenuSeparator />
              <MenuItem id="settings">Settings</MenuItem>
            </Menu>
          </MenuTrigger>
        </div>
      ) : null}
      {isClient && theme === "dark" ? (
        <Button onClick={() => setTheme("light")}>{theme}</Button>
      ) : null}
      {isClient && theme === "light" ? (
        <Button onClick={() => setTheme("dark")}>{theme}</Button>
      ) : null}
      {isClient && theme === "system" ? (
        <Button onClick={() => setTheme("dark")}>{theme}</Button>
      ) : null}
    </header>
  );
};

export default Header;
