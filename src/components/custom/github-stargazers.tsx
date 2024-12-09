"use client";

import useSWR from "swr";

import { StarIcon } from "~/components/custom/icons";

import { Skeleton } from "../shadcn/skeleton";
import JustTip from "./just-the-tip";

interface StargazerProps {
  owner: string;
  repo: string;
  className?: string;
}

export function GitHubStargazer({
  owner,
  repo,
  className = "",
}: StargazerProps) {
  const { data, error, isLoading } = useSWR(
    `https://api.github.com/repos/${owner}/${repo}`,
    (url) => fetch(url).then((res) => res.json()),
    {
      revalidateOnFocus: false,
      refreshInterval: 10 * 60 * 1000, // 10 minutes
    }
  );

  const handleClick = () => {
    window.open(`https://github.com/${owner}/${repo}`, "_blank");
  };

  if (isLoading) {
    return <Skeleton className="w-7" />;
  }
  return (
    <JustTip label="🌟 on GitHub">
      <button
        onClick={handleClick}
        className={`flex items-center gap-1 text-sm transition-colors duration-200 ${className}`}
        aria-label={`Star ${owner}/${repo} on GitHub`}
      >
        <StarIcon className="w-4 h-4 text-yellow-400 hover:fill-yellow-400" />
        <span className="font-medium">
          {data?.stargazers_count.toLocaleString()}
        </span>
      </button>
    </JustTip>
  );
}
