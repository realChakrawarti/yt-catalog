"use client";

import { useMemo } from "react";

import { CopyIcon, ShareIcon } from "~/components/custom/icons";
import JustTip from "~/components/custom/just-the-tip";
import { Button } from "~/components/shadcn/button";
import { toast } from "~/hooks/use-toast";

export default function ShareCatalog(props: any) {
  const shareData = useMemo(
    () => ({
      title: props.catalogTitle,
      text: props.catalogDescription,
      url: `https://ytcatalog.707x.in/@${props.catalogId}`,
    }),
    [props]
  );

  const copyLink = () => {
    window.navigator.clipboard.writeText(shareData.url);
    toast({
      title: "Link copied",
      description: "The video link has been copied to your clipboard.",
    });
  };

  const shareLink = async () => {
    try {
      await window.navigator.share(shareData);
    } catch (err) {
      if (err instanceof Error) {
        return toast({ title: err.message });
      }

      return toast({ title: "Something went wrong!" });
    }
  };

  // Firefox doesn't support it yet, 23-11-2024
  if (
    typeof window.navigator.canShare === "function" &&
    window.navigator.canShare(shareData)
  ) {
    return (
      <JustTip label="Share catalog">
        <Button variant="outline" onClick={shareLink}>
          <ShareIcon className="size-8" />
        </Button>
      </JustTip>
    );
  } else {
    return (
      <JustTip label="Copy to clipboard">
        <Button variant="outline" onClick={copyLink}>
          <CopyIcon className="size-8" />
        </Button>
      </JustTip>
    );
  }
}
