"use client";

import { Archive, BookOpen, Clock8, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "~/app/auth/context-provider";

import { Avatar, AvatarFallback, AvatarImage } from "../shadcn/avatar";
import { Button } from "../shadcn/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../shadcn/sidebar";
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
              <SidebarMenuButton className="px-0" asChild>
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
  const exploreItems = [
    { icon: BookOpen, label: "Catalogs", path: "catalogs" },
    { icon: Archive, label: "Archives", path: "archives" },
    { icon: Clock8, label: "Watch later", path: "watch-later" },
  ];

  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Explore</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {exploreItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                className="px-0"
                asChild
                isActive={pathname.includes(item.path)}
              >
                <Link href={`/explore/${item.path}`}>
                  <Button variant="ghost" className="w-full justify-start px-2">
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
