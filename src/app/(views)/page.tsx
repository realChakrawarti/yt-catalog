"use client";

import { githubProvider, googleProvider } from "../auth/service-providers";
import { useAuth } from "../auth/context-provider";
import Link from "next/link";
import { GrCatalog } from "react-icons/gr";
import { SiGmail } from "react-icons/si";
import { FaGithub } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/shadcn/card";

export default function LoginPage() {
  const { authenticateWith } = useAuth();

  const signInWithGoogle = async () => {
    await authenticateWith(googleProvider);
  };

  const signInWithGitHub = async () => {
    await authenticateWith(githubProvider);
  };

  return (
    <div className="grid grid-cols-[repeat(1,minmax(200px,1fr))] md:grid-cols-[repeat(2,minmax(200px,1fr))] lg:grid-cols-[repeat(3,minmax(200px,1fr))] auto-rows-[200px] min-h-full gap-3">
      <Link
        className="bg-slate-800 p-3 flex flex-col cursor-pointer"
        href={"/explore"}
        target="_blank"
      >
        <div className="self-center flex-grow grid items-center">
          <GrCatalog className="size-16" />
        </div>
        <p className="text-gray-400">Explore catalogs</p>
      </Link>
      <div
        onClick={signInWithGoogle}
        className="bg-slate-800 p-3 flex flex-col cursor-pointer"
      >
        <div className="self-center flex-grow grid items-center">
          <SiGmail className="size-16" />
        </div>
        <p className="text-gray-400">Login with Google</p>
      </div>
      <div
        onClick={signInWithGitHub}
        className="bg-slate-800 p-3 flex flex-col cursor-pointer"
      >
        <div className="self-center flex-grow grid items-center">
          <FaGithub className="size-16" />
        </div>
        <p className="text-gray-400">Login with GitHub</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    </div>
  );
}
