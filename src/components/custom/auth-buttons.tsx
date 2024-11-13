import { useAuth } from "~/app/auth/context-provider";
import { githubProvider, googleProvider } from "~/app/auth/service-providers";
import { GithubIcon, GmailIcon } from "./icons";
import { Button } from "../shadcn/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../shadcn/tooltip";

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
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={signInWithGoogle}>
              <GmailIcon size={24} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Login with Google</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={signInWithGitHub}>
              <GithubIcon size={24} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Login with GitHub</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
