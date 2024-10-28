import packageInfo from "../../package.json";
import { FaSquareGithub } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="px-2 md:px-0 h-4 flex justify-between items-center w-full">
      <div>
        <p className="text-xs text-gray-500">
          Developed by{" "}
          <a
            className="cursor-pointer text-indigo-500"
            target="_blank"
            href="https://707x.in"
          >
            707x Labs
          </a>
        </p>
      </div>
      <div className="flex gap-2 items-end">
        <a
          className="cursor-pointer"
          href="https://github.com/realChakrawarti/yt-catalog"
          target="_blank"
        >
          <FaSquareGithub
            className="text-slate-700 hover:text-slate-500"
            size="18"
          />
        </a>
        <p className="text-xs text-gray-500 tracking-wider">
          v{packageInfo.version}
        </p>
      </div>
    </footer>
  );
}
