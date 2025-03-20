import packageInfo from "../../package.json";
import { OutLink } from "./out-link";

export default function Footer() {
  return (
    <footer className="h-auto flex items-center border-t">
      <div className="p-3 self-end flex justify-between container mx-auto">
        <div>
          <p className="text-xs dark:text-gray-300">
            Developed by{" "}
            <OutLink
              className="cursor-pointer text-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]/70"
              href="https://707x.in"
            >
              707x Labs
            </OutLink>
          </p>
        </div>
        <OutLink
          className="cursor-pointer text-xs dark:text-gray-300 dark:hover:text-gray-100"
          href="https://github.com/realChakrawarti/yt-catalog/blob/main/CHANGELOG.md"
        >
          <p className="tracking-wider">v{packageInfo.version}</p>
        </OutLink>
      </div>
    </footer>
  );
}
