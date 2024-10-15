"use client";

import { Button } from "./Button";
import { useAuth } from "../context/AuthContextProvider";
import { Menu, MenuSeparator, MenuItem } from "./Menu";
import { MenuTrigger } from "react-aria-components";

const Header = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <header className="hidden">Not authenticated!</header>;
  }

  return (
    <header className="flex justify-between items-center">
      <h1 className="text-lg border border-gray-200 px-2">YTCatalog</h1>
      <MenuTrigger>
        <Button variant="icon">
          <img
            className="size-10"
            src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}&background=random&size=96`}
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
