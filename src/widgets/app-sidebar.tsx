"use client";

import {
  Archive,
  BookOpen,
  Clock8,
  Compass,
  History,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "~/features/auth/context-provider";

import { Avatar, AvatarFallback, AvatarImage } from "../shared/ui/avatar";
import { Button } from "../shared/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../shared/ui/sidebar";
import AuthButton from "./auth-buttons";

export default function AppSidebar() {
  return (
    <Sidebar className="border-r">
      <SidebarContent>
        <UserGroup />
        <ExploreGroup />
      </SidebarContent>
    </Sidebar>
  );
}

function UserGroup() {
  const { user } = useAuth();

  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  const isDashboardActive = pathname.includes("dashboard");

  if (!user) {
    return (
      <SidebarHeader className="border-b px-4 h-14 justify-center">
        <AuthButton />
      </SidebarHeader>
    );
  }
  return (
    <>
      <SidebarHeader className="border-b px-4 h-14 justify-center">
        <div className="flex gap-2 items-center">
          <Avatar className="size-8 rounded-lg">
            <AvatarImage
              src={
                user?.photoURL ||
                `https://ui-avatars.com/api/?name=${user?.displayName}&background=random&size=96`
              }
              alt={user?.displayName || ""}
            />
            <AvatarFallback>{user?.displayName || ""}</AvatarFallback>
          </Avatar>
          <p>{user?.displayName}</p>
        </div>
      </SidebarHeader>
      <SidebarGroup>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setOpenMobile(false)}
                className="px-0"
                asChild
                isActive={isDashboardActive}
              >
                <Link href={"/dashboard"}>
                  <Button variant="ghost" className="w-full justify-start px-2">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </SidebarGroup>
    </>
  );
}

function ExploreGroup() {
  const { setOpenMobile } = useSidebar();

  const exploreItems = [
    { icon: Compass, label: "Explore", path: "/explore", shortPath: "/e/" },
    {
      icon: BookOpen,
      label: "Catalogs",
      path: "/explore/catalogs",
      shortPath: "/c/",
    },
    {
      icon: Archive,
      label: "Archives",
      path: "/explore/archives",
      shortPath: "/a/",
    },
    {
      icon: Clock8,
      label: "Watch later",
      path: "/explore/watch-later",
      shortPath: "watch-later",
    },
    {
      icon: History,
      label: "History",
      path: "/explore/history",
      shortPath: "history",
    },
  ];

  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {exploreItems.map((item) => {
            const isActive =
              pathname === item.path || pathname.includes(item.shortPath);
            return (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  onClick={() => setOpenMobile(false)}
                  className="px-0"
                  asChild
                  isActive={isActive}
                >
                  <Link href={item.path}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start px-2"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
