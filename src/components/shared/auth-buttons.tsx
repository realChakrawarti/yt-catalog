"use client";

import { useAuth } from "~/app/auth/context-provider";
import { githubProvider, googleProvider } from "~/app/auth/service-providers";

import { Button } from "../shadcn/button";
import { GithubIcon, GmailIcon } from "./icons";
import JustTip from "./just-the-tip";

export default function AuthButton() {
  const { authenticateWith } = useAuth();

  const signInWithGoogle = async () => {
    await authenticateWith(googleProvider);
  };

  const signInWithGitHub = async () => {
    await authenticateWith(githubProvider);
  };

  return (
    <div className="flex items-center gap-3">
      <JustTip label="Login with Google">
        <Button
          className="flex items-center gap-3"
          variant="outline"
          onClick={signInWithGoogle}
        >
          <GmailIcon color="#EA4335" size={24} />
          <p>Google</p>
        </Button>
      </JustTip>
      <JustTip label="Login with GitHub">
        <Button
          className="flex items-center gap-3"
          variant="outline"
          onClick={signInWithGitHub}
        >
          <GithubIcon size={24} />
          <p>GitHub</p>
        </Button>
      </JustTip>
    </div>
  );
}
