import packageInfo from "../../../package.json";
import { GithubIcon } from "./icons";

export default function Footer() {
  return (
    <footer className="h-auto flex items-center border-t">
      <div className="p-3 self-end flex justify-between container mx-auto">
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
        <a
          className="cursor-pointer text-xs text-gray-500 hover:text-gray-300"
          href="https://github.com/realChakrawarti/yt-catalog/blob/main/CHANGELOG.md"
          target="_blank"
        >
          <p className="tracking-wider">v{packageInfo.version}</p>
        </a>
      </div>
    </footer>
  );
}
