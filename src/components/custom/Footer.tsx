import packageInfo from "../../../package.json";
import { GithubIcon } from "./icons";

export default function Footer() {
  return (
    <footer className="p-3 h-auto self-end flex justify-between items-center w-full">
      <div>
        <p className="text-xs text-gray-500">
          Developed by{" "}
          <a
            className="cursor-pointer text-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]/70"
            target="_blank"
            href="https://707x.in"
          >
            707x Labs
          </a>
        </p>
      </div>
      <div className="flex gap-2 items-center text-xs text-gray-500">
        <a
          className="cursor-pointer hover:text-gray-300"
          href="https://github.com/realChakrawarti/yt-catalog"
          target="_blank"
        >
          <span className="flex gap-2 items-center tracking-tight">
            Open Source on GitHub
            <GithubIcon size={18} />
          </span>
        </a>
        <a
          className="cursor-pointer hover:text-gray-300"
          href="https://github.com/realChakrawarti/yt-catalog/blob/main/CHANGELOG.md"
          target="_blank"
        >
          <p className="tracking-wider">v{packageInfo.version}</p>
        </a>
      </div>
    </footer>
  );
}
