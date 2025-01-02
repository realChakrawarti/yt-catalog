"use client";

import useSWR from "swr";

import { StarIcon } from "~/components/shared/icons";

import { Skeleton } from "../shadcn/skeleton";

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
  const { data, isLoading } = useSWR(
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

  return (
    <div className="flex gap-2 items-center">
      {isLoading ? (
        <Skeleton className="w-7" />
      ) : (
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
      )}
    </div>
  );
}
