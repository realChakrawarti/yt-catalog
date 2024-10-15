"use client";

import { Button } from "@/app/components/Button";
import { githubProvider, googleProvider } from "@/app/lib/auth";
import { useAuth } from "../context/AuthContextProvider";
import Link from "next/link";

export default function LoginPage() {
  const { authenticateWith } = useAuth();

  const signInWithGoogle = async () => {
    await authenticateWith(googleProvider);
  };

  const signInWithGitHub = async () => {
    await authenticateWith(githubProvider);
  };

  return (
    <div className="flex flex-col h-full relative items-center gap-6 px-6 md:px-0">
      <div className="text-center">
        <h1 className="text-xl">
          Youtube Catalog - Organize Your YouTube Universe
        </h1>
        <p className="text-base text-gray-400">
          Discover new channels, curate your favorite videos, and stay
          organized.
        </p>
        <Link href={"/explore"} target="_blank">
          <p className="text-indigo-600 active:text-indigo-900 hover:text-indigo-400 text-center mt-10">
            Explore public catalogs
          </p>
        </Link>
      </div>
      <div className="flex h-full justify-center gap-8 flex-col items-center">
        <Button onPress={signInWithGoogle}>Login with Google</Button>
        <Button onPress={signInWithGitHub}>Login with GitHub</Button>
      </div>
    </div>
  );
}
