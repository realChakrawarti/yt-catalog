"use client";

import { Button } from "./Button";
import { useAuth } from "../context/AuthContextProvider";
import { Menu, MenuSeparator, MenuItem } from "./Menu";
import { MenuTrigger } from "react-aria-components";
import Image from "next/image";
import AppIcon from "../../public/icon.png";
import Link from "next/link";

const Header = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <header className="hidden">Not authenticated!</header>;
  }

  return (
    <header className="flex justify-between items-center">
      <Link href="/dashboard">
        <h1 className="flex gap-1">
          <Image src={AppIcon} alt="YTCatalog" className="size-7" />
          <p className="self-end text-lg tracking-wide">YTCatalog</p>
        </h1>
      </Link>
      <MenuTrigger>
        <Button variant="icon">
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
          <MenuItem onAction={logout} id="logout">
            Logout
          </MenuItem>
        </Menu>
      </MenuTrigger>
    </header>
  );
};

export default Header;
